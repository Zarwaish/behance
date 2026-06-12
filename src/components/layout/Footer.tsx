import Link from "next/link"
import { MessageCircle, Globe, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-serif tracking-[0.2em] text-white uppercase">
              Aria Shadow<span className="text-[var(--glow-cyan)]">.</span>
            </Link>
            <p className="mt-2 text-zinc-500 text-xs uppercase tracking-wider max-w-sm leading-relaxed">
              Curated digital art, 3D modeling, and brand design registry.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <span className="sr-only">Social</span>
              <MessageCircle size={24} />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <span className="sr-only">Website</span>
              <Globe size={24} />
            </a>
            <a href="mailto:hello@hazi.com" className="text-zinc-400 hover:text-white transition-colors">
              <span className="sr-only">Email</span>
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            © {new Date().getFullYear()} Aria Shadow. All rights reserved.
          </p>
          {/* Hidden Admin Link */}
          <Link href="/admin/login" className="text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  )
}
