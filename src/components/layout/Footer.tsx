import Link from "next/link"
import { MessageCircle, Globe, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-serif tracking-[0.2em] text-white uppercase">
              Aria Shadow<span className="text-[var(--glow-cyan)]">.</span>
            </Link>
            <p className="mt-2 text-zinc-500 text-xs uppercase tracking-wider max-w-sm leading-relaxed">
              Curated digital art, 3D modeling, and brand design registry.
            </p>
          </div>

          {/* Social icons with proper 44×44px touch targets */}
          <div className="flex items-center space-x-2">
            <a
              href="#"
              className="flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white transition-colors"
              aria-label="Social"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white transition-colors"
              aria-label="Website"
            >
              <Globe size={20} />
            </a>
            <a
              href="mailto:hello@hazi.com"
              className="flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            © {new Date().getFullYear()} Aria Shadow. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors min-h-[36px] flex items-center"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  )
}
