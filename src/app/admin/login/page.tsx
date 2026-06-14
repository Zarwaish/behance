"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    // Sign in user
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    const user = data.user
    if (!user) {
      setError("An unexpected error occurred during authentication.")
      setLoading(false)
      return
    }

    // Check if user is an admin in the database
    try {
      const { data: dbRole } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("id", user.id)
        .eq("role", "admin")
        .maybeSingle()

      if (!dbRole) {
        // Deny access: sign out user immediately
        await supabase.auth.signOut()
        setError("Access Denied: This portal is reserved for authorized administrators only.")
        setLoading(false)
        return
      }

      // Successful login
      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      await supabase.auth.signOut()
      setError("Authorization verification failed: " + (err.message || err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative overflow-hidden font-sans py-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-6 sm:p-10 bg-[#050814]/80 border border-red-500/15 shadow-[0_0_50px_rgba(239,68,68,0.03)] backdrop-blur-sm">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-500/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-red-500/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-red-500/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-500/30" />

        <div className="text-center mb-10">
          <h1 className="text-2xl font-serif text-white mb-2 tracking-widest uppercase">Admin Terminal</h1>
          <p className="text-red-400 text-[10px] uppercase tracking-[0.2em]">Curation Node Access Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center uppercase tracking-wide leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-red-400 mb-2">Admin Identification</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#02040a]/40 border-b border-white/20 text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-red-400 mb-2">Security Key (Passphrase)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#02040a]/40 border-b border-white/20 text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 border border-red-500/50 text-red-400 uppercase tracking-[0.2em] text-xs font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Decrypting Node..." : "Initiate Terminal Session"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
            Exit to User Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
