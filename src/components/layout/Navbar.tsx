"use client"

import { useEffect, useRef, useState } from "react"
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
  const navRef = useRef<HTMLElement>(null)
  const [navHeight, setNavHeight] = useState(64)

  // Measure actual navbar height for mobile menu positioning
  useEffect(() => {
    const measure = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

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
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 w-full z-[100] bg-[#020308]/95 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex-shrink-0 text-lg sm:text-xl font-serif tracking-[0.2em] text-white uppercase"
            >
              Aria Shadow<span className="text-[var(--glow-cyan)] font-sans">.</span>
            </Link>

            {/* Desktop Nav Links */}
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
                  <Link
                    href="/admin"
                    className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/45 bg-[var(--glow-cyan)]/5 text-white text-[10px] uppercase tracking-[0.2em] transition-all"
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
                    className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-white text-[10px] uppercase tracking-[0.2em] transition-all"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 text-zinc-300 hover:text-[var(--glow-cyan)] transition-colors cursor-pointer"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen
                ? <X size={22} strokeWidth={1.5} />
                : <Menu size={22} strokeWidth={1.5} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Panel ──
          Rendered as a sibling to <nav>, NOT inside it.
          Uses inline styles exclusively to avoid any Tailwind/CSS cascade issues.
          z-index: 9999 ensures it's above everything including fixed elements.
          top is set dynamically to match the actual navbar offsetHeight.
      ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(2, 3, 8, 0.97)",
            overflowY: "auto",
            overflowX: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px 20px 40px",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            {/* Navigation Links */}
            <nav style={{ display: "flex", flexDirection: "column" }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      fontSize: "17px",
                      fontWeight: 400,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      color: isActive ? "#22d3ee" : "#d4d4d8",
                      fontFamily: "serif",
                    }}
                  >
                    {link.name}
                    {isActive && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#22d3ee",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Auth Links */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "28px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {user ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "15px",
                      border: "1px solid rgba(34,211,238,0.3)",
                      backgroundColor: "rgba(34,211,238,0.05)",
                      color: "#22d3ee",
                      fontSize: "12px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "15px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backgroundColor: "transparent",
                      color: "#a1a1aa",
                      fontSize: "12px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                      width: "100%",
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "15px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    color: "#ffffff",
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    fontFamily: "sans-serif",
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
