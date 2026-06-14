"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCurrentAdminEmail() {
  const supabase = await createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email || ""
  } catch {
    return ""
  }
}
