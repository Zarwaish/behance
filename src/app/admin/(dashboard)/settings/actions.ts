"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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
