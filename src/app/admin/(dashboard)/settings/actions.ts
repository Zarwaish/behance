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
  currentPassword?: string
  newPassword?: string
}) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  if (!formData.currentPassword) {
    return { success: false, error: "Current password is required to make updates." }
  }

  const supabase = await createClient()
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Authenticated session not found." }
    }

    // 1. Re-authenticate admin with current password first
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email || "",
      password: formData.currentPassword,
    })

    if (authError) {
      return { success: false, error: "Authentication failed. Current password is incorrect." }
    }

    // 2. Update Email if changed
    if (formData.email && formData.email.toLowerCase() !== user.email?.toLowerCase()) {
      const { data: updateData, error: emailError } = await supabase.auth.updateUser({
        email: formData.email
      })
      if (emailError) {
        return { success: false, error: `Supabase Auth error: ${emailError.message}` }
      }

      // Check if email updated instantly (email confirmation disabled) or if verification is sent
      const isConfirmed = updateData.user?.email?.toLowerCase() === formData.email.toLowerCase()
      
      if (isConfirmed) {
        // Update admin_roles record immediately only if fully confirmed
        const { error: roleError } = await supabase
          .from("admin_roles")
          .update({ email: formData.email.toLowerCase() })
          .eq("id", user.id)

        if (roleError) {
          return { success: false, error: `Auth updated but admin roles sync failed: ${roleError.message}` }
        }
      } else {
        // If not confirmed (unconfirmed_email is set in user data, or email is still the old one)
        // Do NOT update admin_roles yet since the user's active email hasn't changed.
        // Alert the user that they must verify the new email first.
        return { 
          success: true, 
          info: "A verification link has been sent to your new email. The change will take effect only after you click the verification link. The current active email remains unchanged." 
        }
      }
    }

    // 3. Update Password if specified
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
