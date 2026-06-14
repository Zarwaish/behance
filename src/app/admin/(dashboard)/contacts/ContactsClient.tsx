"use client"

import { useState, useTransition } from "react"
import { updateContactStatus, deleteContactRequest } from "./actions"
import { Trash2, Mail, ExternalLink, Search, Filter, AlertTriangle, X } from "lucide-react"

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
  
  // Search & Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all")
  
  // Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<ContactRequest | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteContactRequest(deleteTarget.id)
    if (res.success) {
      setLocalRequests(prev => prev.filter(r => r.id !== deleteTarget.id))
      setDeleteTarget(null)
    } else {
      alert(res.error || "Failed to delete request.")
    }
    setDeleting(false)
  }

  const handleReplyMailto = (req: ContactRequest) => {
    // Generate Professional template
    const subject = encodeURIComponent(`Re: Inquiry on project: "${req.project_title || 'Artwork Inquiry'}"`)
    const body = encodeURIComponent(
      `Hi ${req.name},\n\n` +
      `Thank you for reaching out regarding "${req.project_title || 'my creative portfolio work'}". I have received your message:\n\n` +
      `"${req.message}"\n\n` +
      `I would love to discuss this further. Let me know when you are available to connect.\n\n` +
      `Best regards,\n` +
      `Aria Shadow`
    )
    
    // Automatically transition state to Replied
    if (req.status === "new") {
      handleStatusChange(req.id, "replied")
    }

    // Open mail client
    window.location.href = `mailto:${req.email}?subject=${subject}&body=${body}`
  }

  // Filtered requests list
  const filteredRequests = localRequests.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(search.toLowerCase()) || 
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      (req.project_title && req.project_title.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Recalculate live stats count dynamically for UI badges
  const newCount = localRequests.filter(r => r.status === "new").length
  const repliedCount = localRequests.filter(r => r.status === "replied").length
  const closedCount = localRequests.filter(r => r.status === "closed").length

  return (
    <div className="space-y-6">
      {/* Live Badge Metrics */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {[
          { label: "New Requests", value: newCount, color: "text-[var(--glow-cyan)] border-[var(--glow-cyan)]/20 bg-[var(--glow-cyan)]/5" },
          { label: "Replied", value: repliedCount, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
          { label: "Closed", value: closedCount, color: "text-zinc-500 border-white/10 bg-white/5" },
        ].map((stat) => (
          <div key={stat.label} className={`border p-4 sm:p-6 transition-all ${stat.color}`}>
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">{stat.label}</span>
            <p className="text-3xl sm:text-4xl font-serif tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar UX */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-[#050814]/30 border border-white/5 p-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name, email, or project..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#02040a]/50 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 transition-colors text-xs placeholder-zinc-600 rounded-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 flex-shrink-0">
            <Filter className="w-3 h-3" />
            <span>Filter Status</span>
          </div>
          <div className="flex gap-1 border border-white/10 p-0.5 bg-[#02040a]/40">
            {([
              { value: "all", label: "All" },
              { value: "new", label: "New" },
              { value: "replied", label: "Replied" },
              { value: "closed", label: "Closed" }
            ] as const).map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === f.value
                    ? "bg-[var(--glow-cyan)] text-black font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Feed */}
      {filteredRequests.length === 0 ? (
        <div className="py-16 text-center border border-white/5 bg-[#050814]/20">
          <p className="text-zinc-600 font-serif italic text-xs uppercase tracking-[0.2em]">
            {localRequests.length === 0 ? "No incoming contact inquiries yet." : "No matching inquiries found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-[#050814]/40 border border-white/5 p-5 sm:p-6 relative group transition-all duration-300 hover:border-white/10">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm tracking-wide">{req.name}</p>
                    {req.project_id && (
                      <a 
                        href={`/portfolio/${req.project_id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-zinc-600 hover:text-[var(--glow-cyan)] transition-colors"
                        title="View Project in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5">{req.email}</p>
                  {req.project_title && (
                    <p className="text-[var(--glow-cyan)] text-[10px] uppercase tracking-[0.15em] mt-1.5 font-medium">
                      Project Link: {req.project_title}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 border text-[9px] uppercase tracking-[0.15em] font-semibold ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                  <p className="text-zinc-650 text-[10px] whitespace-nowrap">
                    {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              <p className="text-zinc-450 text-xs leading-relaxed mb-6 border-l border-white/10 pl-3.5 whitespace-pre-line italic">
                "{req.message}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                {/* Status Toggles */}
                <div className="flex gap-1.5">
                  {(["new", "replied", "closed"] as Status[]).map((s) => (
                    <button
                      key={s}
                      disabled={req.status === s || updating === req.id}
                      onClick={() => handleStatusChange(req.id, s)}
                      className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        req.status === s
                          ? statusColors[s]
                          : "border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {updating === req.id ? "..." : s}
                    </button>
                  ))}
                </div>

                {/* Response / Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplyMailto(req)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[9px] uppercase tracking-wider hover:bg-emerald-500/20 transition-all cursor-pointer rounded-none h-8"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Reply via Email</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(req)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-450 text-[9px] uppercase tracking-wider hover:bg-red-500/20 transition-all cursor-pointer rounded-none h-8"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-md w-full p-6 sm:p-8 bg-[#050814] border border-red-500/25 shadow-2xl">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-red-500/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-red-500/50" />

            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-sm font-serif uppercase tracking-[0.2em] font-semibold text-white">Confirm Removal</h3>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Are you sure you want to permanently delete the inquiry from <strong>{deleteTarget.name}</strong>? 
              This action will remove the record from both the database index and the dashboard panel, and cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-white/10 text-zinc-400 hover:text-white text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
