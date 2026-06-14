import { createClient } from "@/lib/supabase/server"

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return false
    }

    // Query admin_roles database table as single source of truth
    const { data: roleRecord, error: dbError } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("id", user.id)
      .eq("role", "admin")
      .maybeSingle()

    if (dbError) {
      console.error("Database query failed inside isCurrentUserAdmin helper:", dbError.message)
      return false
    }

    return !!roleRecord
  } catch (err) {
    console.error("Exception checking admin user permissions:", err)
    return false
  }
}
