"use client"

import { useState, useTransition } from "react"
import { updateContactStatus } from "./actions"

type Status = "new" | "replied" | "closed"

interface ContactRequest {
  id: string
  name: string
  email: string
  project_id: string | null
  project_title: string | null
  message: string
  status: Status
  created_at: string
}

const statusColors: Record<Status, string> = {
  new: "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-[var(--glow-cyan)]/30",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  closed: "bg-white/5 text-zinc-500 border-white/10",
}

export default function ContactsClient({ requests }: { requests: ContactRequest[] }) {
  const [localRequests, setLocalRequests] = useState(requests)
  const [, startTransition] = useTransition()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = (id: string, status: Status) => {
    setUpdating(id)
    startTransition(async () => {
      await updateContactStatus(id, status)
      setLocalRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status } : r)
      )
      setUpdating(null)
    })
  }

  if (localRequests.length === 0) {
    return (
      <div className="py-16 text-center border border-white/5 bg-[#050814]/30">
        <p className="text-zinc-500 font-serif italic text-sm uppercase tracking-[0.2em]">No contact inquiries received yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {localRequests.map((req) => (
        <div key={req.id} className="bg-[#050814]/40 border border-white/5 p-5 sm:p-6 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/20" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-white font-medium text-sm tracking-wide">{req.name}</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">{req.email}</p>
              {req.project_title && (
                <p className="text-[var(--glow-cyan)] text-[10px] uppercase tracking-[0.15em] mt-1">
                  Project: {req.project_title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-2.5 py-1 border text-[9px] uppercase tracking-[0.15em] font-medium ${statusColors[req.status]}`}>
                {req.status}
              </span>
              <p className="text-zinc-600 text-[10px] whitespace-nowrap">
                {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed mb-5 border-l-2 border-white/10 pl-3">{req.message}</p>

          <div className="flex gap-2 flex-wrap">
            {(["new", "replied", "closed"] as Status[]).map((s) => (
              <button
                key={s}
                disabled={req.status === s || updating === req.id}
                onClick={() => handleStatusChange(req.id, s)}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  req.status === s
                    ? statusColors[s]
                    : "border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                }`}
              >
                {updating === req.id ? "..." : s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
