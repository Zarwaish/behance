import { createClient } from "@/lib/supabase/server"

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return false
    }

    // Check env var fallback first (emails separated by comma)
    const adminEmailsEnv = process.env.ADMIN_EMAILS || ""
    const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase())
    if (user.email && adminEmails.includes(user.email.toLowerCase())) {
      return true
    }

    // Default admin email hardcoded check as fallback
    if (user.email && (
      user.email.toLowerCase() === "admin321@gmail.com" ||
      user.email.toLowerCase() === "aria.shadow@example.com"
    )) {
      return true
    }

    // Query admin_users database table
    const { data: adminRecord, error: dbError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (dbError) {
      console.warn("Could not query admin_users table (might not exist yet):", dbError.message)
    }

    if (adminRecord) {
      return true
    }

    return false
  } catch (err) {
    console.error("Exception checking admin user permissions:", err)
    return false
  }
}
