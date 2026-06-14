"use client"

import { useState } from "react"
import { updateSettings } from "./actions"
import { Save, AlertCircle } from "lucide-react"

export default function SettingsForm({ initialEmail }: { initialEmail: string }) {
  const [contactEmail, setContactEmail] = useState(initialEmail)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const res = await updateSettings(contactEmail)
    setMessage(res.success
      ? { text: "Settings saved successfully.", type: "success" }
      : { text: res.error || "Failed to save settings.", type: "error" }
    )
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
      {message && (
        <div className={`p-4 border flex items-start gap-3 text-xs uppercase tracking-wider ${
          message.type === "success"
            ? "bg-green-500/10 border-green-500/25 text-green-400"
            : "bg-red-500/10 border-red-500/25 text-red-400"
        }`}>
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-[#050814]/40 border border-white/5 p-6 sm:p-8 relative space-y-6">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />

        <div>
          <h2 className="text-sm font-serif uppercase tracking-[0.2em] text-white mb-2">Contact Notification Email</h2>
          <p className="text-zinc-500 text-xs">All contact form submissions will be directed to this address.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400">Destination Email Address</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            placeholder="aria.shadow@example.com"
            className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--glow-cyan)]/50 rounded-none h-11"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-[11px] uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50 disabled:opacity-50 cursor-pointer min-h-[48px]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Save size={15} />
            {saving ? "Saving..." : "Save Settings"}
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </button>
      </div>
    </form>
  )
}
