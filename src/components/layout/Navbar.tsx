"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Track scroll for nav shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      "bg-background/80 backdrop-blur-md border-b border-white/5",
      scrolled && "shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="group relative text-lg sm:text-xl font-serif tracking-[0.2em] text-white uppercase flex-shrink-0">
            <span>Aria Shadow</span>
            <span className="text-[var(--glow-cyan)] font-sans">.</span>
          </Link>

          {/* Desktop Nav */}
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
                  className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/45 bg-[var(--glow-cyan)]/5 text-white text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
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
                  className="px-5 py-2 border border-white/10 hover:border-[var(--glow-cyan)]/40 bg-transparent text-white text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button — 44×44px touch target */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-[var(--glow-cyan)] transition-colors rounded-none border border-white/5 bg-white/2 active:bg-white/5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Full-screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-background/98 backdrop-blur-xl border-t border-white/5"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Nav Links */}
              <div className="flex flex-col px-6 pt-8 pb-4 space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between w-full py-4 border-b border-white/5",
                          "text-base font-serif uppercase tracking-[0.2em] transition-colors",
                          isActive ? "text-[var(--glow-cyan)]" : "text-zinc-300 hover:text-white"
                        )}
                      >
                        {link.name}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--glow-cyan)]" />}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Auth Section */}
              <div className="px-6 pt-4 pb-8 mt-auto">
                <div className="border-t border-white/5 pt-6 space-y-4">
                  {user ? (
                    <>
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center w-full py-4 border border-[var(--glow-cyan)]/30 bg-[var(--glow-cyan)]/5 text-[var(--glow-cyan)] text-sm uppercase tracking-[0.2em] transition-all"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { setIsOpen(false); handleLogout() }}
                        className="flex items-center justify-center w-full py-4 border border-white/10 text-zinc-400 hover:text-red-400 text-sm uppercase tracking-[0.2em] transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-4 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-white text-sm uppercase tracking-[0.2em] transition-all bg-white/5"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
