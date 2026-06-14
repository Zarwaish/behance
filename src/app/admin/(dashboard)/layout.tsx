import { redirect } from "next/navigation"
import { isCurrentUserAdmin } from "@/lib/supabase/admin"
import AdminDashboardLayoutClient from "./AdminDashboardLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    redirect("/admin/login")
  }

  return <AdminDashboardLayoutClient>{children}</AdminDashboardLayoutClient>
}
