"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError("Passphrases do not match.")
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        router.push("/login")
      }, 4000)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative overflow-hidden font-sans py-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--glow-cyan)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-10 bg-[#050814]/80 border border-white/5 shadow-[0_0_50px_rgba(34,211,238,0.03)] backdrop-blur-sm">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--glow-cyan)]/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--glow-cyan)]/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--glow-cyan)]/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--glow-cyan)]/30" />

        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif text-white mb-2 tracking-widest uppercase">Register Agent</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Create Credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-450 text-sm text-center">
            Agent account registered! Please check your email inbox to verify the registration. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2">Identification Link (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#02040a]/40 border-b border-white/20 text-white focus:outline-none focus:border-[var(--glow-cyan)] transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2">Passphrase</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#02040a]/40 border-b border-white/20 text-white focus:outline-none focus:border-[var(--glow-cyan)] transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2">Confirm Passphrase</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#02040a]/40 border-b border-white/20 text-white focus:outline-none focus:border-[var(--glow-cyan)] transition-colors text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 mt-4 border border-[var(--glow-cyan)]/50 text-[var(--glow-cyan)] uppercase tracking-[0.2em] text-xs font-medium hover:bg-[var(--glow-cyan)]/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering..." : "Register Credentials"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] uppercase tracking-[0.2em] text-zinc-555 hover:text-[var(--glow-cyan)] transition-colors">
            Already registered? Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
