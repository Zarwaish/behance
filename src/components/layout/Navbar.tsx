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
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* ── Navbar bar ── */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#020308]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-lg sm:text-xl font-serif tracking-[0.2em] text-white uppercase"
            >
              Aria Shadow<span className="text-[var(--glow-cyan)] font-sans">.</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
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
                <div className="pl-4 border-l border-white/5 flex items-center gap-5">
                  <Link href="/admin" className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/45 bg-[var(--glow-cyan)]/5 text-white text-[10px] uppercase tracking-[0.2em] transition-all">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-red-400 transition-colors cursor-pointer">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pl-4 border-l border-white/5">
                  <Link href="/login" className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-white text-[10px] uppercase tracking-[0.2em] transition-all">
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 text-zinc-300 hover:text-[var(--glow-cyan)] transition-colors"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen
                ? <X size={22} strokeWidth={1.5} />
                : <Menu size={22} strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu — rendered OUTSIDE the nav, as a separate fixed panel ── */}
      {/* Using a plain div with inline style so no CSS class issues can hide it */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',   /* matches h-16 */
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 3, 8, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflowY: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 24px 48px' }}>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: isActive ? 'var(--glow-cyan)' : '#d4d4d8',
                    }}
                  >
                    {link.name}
                    {isActive && (
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'var(--glow-cyan)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Auth section */}
            <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      border: '1px solid rgba(34,211,238,0.3)',
                      backgroundColor: 'rgba(34,211,238,0.05)',
                      color: 'var(--glow-cyan)',
                      fontSize: '13px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: 'transparent',
                      color: '#a1a1aa',
                      fontSize: '13px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-inter), sans-serif',
                      width: '100%',
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: '#ffffff',
                    fontSize: '13px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
