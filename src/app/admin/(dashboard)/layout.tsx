"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FolderKanban, LogOut, Globe, Menu, X, Sliders } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Control Center", exact: true },
  { href: "/admin/projects", icon: FolderKanban, label: "Archives Registry", exact: false },
  { href: "/admin/homepage", icon: Sliders, label: "Homepage Curation", exact: true },
  { href: "/", icon: Globe, label: "View Website", exact: true },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const SidebarContent = () => (
    <>
      <div className="h-16 sm:h-20 flex items-center px-6 sm:px-8 border-b border-white/5 flex-shrink-0">
        <span className="text-sm font-serif tracking-[0.2em] text-white uppercase">
          Aria Shadow<span className="text-[var(--glow-cyan)] font-sans">.</span>
        </span>
      </div>
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-none transition-all uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] min-h-[48px]",
              isActive({ href, icon: Icon, label, exact })
                ? "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-l-2 border-[var(--glow-cyan)]"
                : "text-zinc-500 hover:text-[var(--glow-cyan)] border-l-2 border-transparent hover:border-[var(--glow-cyan)]/50 hover:bg-[var(--glow-cyan)]/5"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 sm:p-4 border-t border-white/5 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 w-full text-left text-zinc-500 hover:text-red-400 border-l-2 border-transparent hover:border-red-400 hover:bg-red-500/5 transition-all uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] min-h-[48px] cursor-pointer"
        >
          <LogOut size={15} />
          Disconnect Session
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 lg:w-64 border-r border-white/5 bg-[#050814] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#050814] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 sm:h-20 border-b border-white/5 bg-[#050814]/30 px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-[var(--glow-cyan)] transition-colors border border-white/5"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
            <span className="text-xs font-serif tracking-[0.2em] text-zinc-500 uppercase hidden sm:inline">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 sm:px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-[10px] uppercase tracking-[0.15em] text-zinc-400 hover:text-white transition-all bg-white/5 min-h-[36px]"
            >
              <Globe size={12} />
              <span className="hidden sm:inline">View Website</span>
              <span className="sm:hidden">Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500 hover:text-red-400 transition-colors md:hidden cursor-pointer min-h-[36px]"
            >
              <LogOut size={12} />
              <span>Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
