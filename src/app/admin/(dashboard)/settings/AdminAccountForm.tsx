"use client"

import { useState } from "react"
import { updateAdminAccount } from "./actions"
import { Save, AlertCircle, ShieldAlert } from "lucide-react"

export default function AdminAccountForm({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    if (password && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" })
      setSaving(false)
      return
    }

    const res = await updateAdminAccount({
      email,
      newPassword: password || undefined
    })

    if (res.success) {
      setMessage({ text: "Admin credentials updated successfully.", type: "success" })
      setPassword("")
      setConfirmPassword("")
    } else {
      setMessage({ text: res.error || "Failed to update admin credentials.", type: "error" })
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl mt-10 border-t border-white/5 pt-10">
      <div>
        <h2 className="text-xl font-serif text-white uppercase tracking-widest mb-1">Admin Account Settings</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Manage authentication parameters for administration portal access</p>
      </div>

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
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-500/25" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-500/25" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-red-500/25" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-500/25" />

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-red-400">Admin Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-xs focus:outline-none focus:border-red-500/50 rounded-none h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-red-400">New Password (Leave blank to keep current)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-xs focus:outline-none focus:border-red-500/50 rounded-none h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-red-400">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-xs focus:outline-none focus:border-red-500/50 rounded-none h-11"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-red-500/30 text-red-400 text-[11px] uppercase tracking-[0.2em] transition-all hover:border-red-500/60 disabled:opacity-50 cursor-pointer min-h-[48px]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Save size={15} />
            {saving ? "Updating..." : "Update Credentials"}
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </button>
      </div>
    </form>
  )
}
