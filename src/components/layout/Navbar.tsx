"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/#contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group relative text-xl font-serif tracking-[0.2em] text-white uppercase">
            <span>Aria Shadow</span>
            <span className="text-[var(--glow-cyan)] font-sans">.</span>
          </Link>
 
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative text-[11px] uppercase tracking-[0.2em] transition-all duration-300",
                    isActive ? "text-[var(--glow-cyan)] font-medium" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--glow-cyan)] rounded-full"
                    />
                  )}
                </Link>
              )
            })}

            {user ? (
              <div className="pl-4 border-l border-white/5 flex items-center gap-6">
                <Link
                  href="/admin"
                  className="px-6 py-2.5 border border-white/10 hover:border-[var(--glow-cyan)]/45 bg-[var(--glow-cyan)]/5 text-white text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pl-4 border-l border-white/5">
                <Link
                  href="/login"
                  className="px-6 py-2.5 border border-white/10 hover:border-[var(--glow-cyan)]/40 bg-transparent text-white text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-[var(--glow-cyan)] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-b border-white/5"
        >
          <div className="px-6 py-8 flex flex-col space-y-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-[0.2em] font-serif text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-[0.2em] font-serif text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="text-sm uppercase tracking-[0.2em] font-serif text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-[0.2em] font-serif text-zinc-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
