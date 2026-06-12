"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FolderKanban, LogOut, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050814] flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <span className="text-sm font-serif tracking-[0.2em] text-white uppercase">Aria Shadow<span className="text-[var(--glow-cyan)] font-sans">.</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-none transition-all uppercase tracking-[0.2em] text-[10px]",
              pathname === "/admin" 
                ? "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-l-2 border-[var(--glow-cyan)]" 
                : "text-zinc-500 hover:text-[var(--glow-cyan)] border-l-2 border-transparent hover:border-[var(--glow-cyan)]/50 hover:bg-[var(--glow-cyan)]/5"
            )}
          >
            <LayoutDashboard size={16} />
            Control Center
          </Link>
          <Link
            href="/admin/projects"
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-none transition-all uppercase tracking-[0.2em] text-[10px]",
              pathname.includes("/admin/projects") 
                ? "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-l-2 border-[var(--glow-cyan)]" 
                : "text-zinc-500 hover:text-[var(--glow-cyan)] border-l-2 border-transparent hover:border-[var(--glow-cyan)]/50 hover:bg-[var(--glow-cyan)]/5"
            )}
          >
            <FolderKanban size={16} />
            Archives Registry
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-6 py-4 rounded-none transition-all uppercase tracking-[0.2em] text-[10px] text-zinc-500 hover:text-[var(--glow-cyan)] border-l-2 border-transparent hover:border-[var(--glow-cyan)]/50 hover:bg-[var(--glow-cyan)]/5"
          >
            <Globe size={16} />
            View Website
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 w-full text-left text-zinc-500 hover:text-red-400 border-l-2 border-transparent hover:border-red-400 hover:bg-red-500/5 transition-all uppercase tracking-[0.2em] text-[10px]"
          >
            <LogOut size={16} />
            Disconnect Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header for Switcher */}
        <header className="h-20 border-b border-white/5 bg-[#050814]/30 px-8 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-serif tracking-[0.2em] text-white uppercase md:hidden">Aria Shadow Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-[10px] uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-all bg-white/5"
            >
              <Globe size={12} />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-450 hover:text-red-400 transition-colors md:hidden cursor-pointer"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
