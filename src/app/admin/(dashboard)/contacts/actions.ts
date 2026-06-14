"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isCurrentUserAdmin } from "@/lib/supabase/admin"

export async function getContactRequests() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Unauthorized dashboard operations.")
  }

  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function updateContactStatus(id: string, status: "new" | "replied" | "closed") {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("contact_requests")
      .update({ status })
      .eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteContactRequest(id: string) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("contact_requests")
      .delete()
      .eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
