"use client"

import { useState } from "react"
import { submitContactRequest } from "@/app/(main)/portfolio/contact-actions"
import { Send, CheckCircle2, AlertCircle } from "lucide-react"

interface ContactFormProps {
  projectId: string
  projectTitle: string
  userEmail: string
}

export default function ContactArtistForm({ projectId, projectTitle, userEmail }: ContactFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!name.trim() || !message.trim()) {
      setError("Please fill out all fields.")
      setLoading(false)
      return
    }

    const res = await submitContactRequest({
      name,
      email: userEmail,
      projectId,
      projectTitle,
      message,
    })

    if (res.success) {
      setSuccess(true)
      setMessage("")
      setName("")
    } else {
      setError(res.error || "Failed to submit contact request.")
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#050814]/40 border border-white/5 p-6 sm:p-8 relative">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/25" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/25" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />

      <h3 className="text-sm font-serif uppercase tracking-[0.2em] text-white mb-2">Inquire About This Creation</h3>
      <p className="text-zinc-500 text-xs mb-6">Send a direct message regarding details, licensing, or custom work.</p>

      {success && (
        <div className="mb-6 p-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs uppercase tracking-wider flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>Your inquiry has been cataloged! The artist will contact you via {userEmail}.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-xs uppercase tracking-wider flex items-start gap-3">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aria Vane"
            className="w-full px-4 py-3 bg-[#02040a]/40 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 transition-colors text-xs uppercase tracking-wider rounded-none h-11"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Your Email</label>
          <input
            type="email"
            value={userEmail}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 text-zinc-500 focus:outline-none cursor-not-allowed text-xs rounded-none h-11"
            disabled
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Inquiry / Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your design specifications or project details..."
            className="w-full px-4 py-3 bg-[#02040a]/40 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 transition-colors text-xs rounded-none resize-none leading-relaxed"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50 disabled:opacity-50 w-full min-h-[44px] cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Send size={13} />
            {loading ? "Transmitting..." : "Send Inquiry"}
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </button>
      </form>
    </div>
  )
}
