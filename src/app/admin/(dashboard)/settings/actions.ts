"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isCurrentUserAdmin } from "@/lib/supabase/admin"

export async function getSettings() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("contact_email")
      .eq("id", "homepage")
      .maybeSingle()
    if (error) return { contact_email: "aria.shadow@example.com" }
    return { contact_email: data?.contact_email || "aria.shadow@example.com" }
  } catch {
    return { contact_email: "aria.shadow@example.com" }
  }
}

export async function updateSettings(contactEmail: string) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("homepage_settings")
      .upsert({ id: "homepage", contact_email: contactEmail, updated_at: new Date().toISOString() }, { onConflict: "id" })
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateAdminAccount(formData: {
  email: string
  newPassword?: string
}) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Authenticated session not found." }
    }

    // 1. Update Email if changed
    if (formData.email && formData.email.toLowerCase() !== user.email?.toLowerCase()) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: formData.email
      })
      if (emailError) return { success: false, error: emailError.message }

      // Update admin_roles record too
      await supabase
        .from("admin_roles")
        .update({ email: formData.email })
        .eq("id", user.id)
    }

    // 2. Update Password if specified
    if (formData.newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: formData.newPassword
      })
      if (passwordError) return { success: false, error: passwordError.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
