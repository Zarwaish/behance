"use client"

import { useState } from "react"
import { Project } from "@/types"
import { updateHomepageSettings, HomepageSettings } from "./actions"
import { Save, AlertCircle } from "lucide-react"

interface CurationFormProps {
  projects: Project[]
  initialSettings: HomepageSettings
}

export default function HomepageCurationForm({ projects, initialSettings }: CurationFormProps) {
  const [featuredId, setFeaturedId] = useState<string>(initialSettings.featured_project_id || "")
  const [curatedIds, setCuratedIds] = useState<string[]>([
    initialSettings.curated_project_ids[0] || "",
    initialSettings.curated_project_ids[1] || "",
    initialSettings.curated_project_ids[2] || "",
  ])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleCuratedChange = (index: number, value: string) => {
    setCuratedIds(prev => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    // Filter out empty selections to only save valid IDs
    const filteredCurated = curatedIds.filter(id => id !== "")

    const res = await updateHomepageSettings(
      featuredId || null,
      filteredCurated
    )

    if (res.success) {
      setMessage({ text: "Homepage curation config updated successfully.", type: "success" })
    } else {
      setMessage({ text: res.error || "Failed to update configuration.", type: "error" })
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
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

      {/* Featured Artwork Section */}
      <div className="bg-[#050814]/40 border border-white/5 p-6 sm:p-8 relative space-y-6">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />

        <div>
          <h2 className="text-sm font-serif uppercase tracking-[0.2em] text-white mb-2">Featured Artwork Curation</h2>
          <p className="text-zinc-500 text-xs">Spotlight a master project directly in the Homepage Hero showcase block.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400">Select Spotlight Exhibit</label>
          <select
            value={featuredId}
            onChange={(e) => setFeaturedId(e.target.value)}
            className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-[var(--glow-cyan)]/50 rounded-none h-11"
          >
            <option value="">-- No Spotlight Project Chosen --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category}) {p.status === "draft" ? "[DRAFT]" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Curated Catalog Section */}
      <div className="bg-[#050814]/40 border border-white/5 p-6 sm:p-8 relative space-y-6">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/25" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />

        <div>
          <h2 className="text-sm font-serif uppercase tracking-[0.2em] text-white mb-2">Curated Catalog Curation (Exactly 3 slots)</h2>
          <p className="text-zinc-500 text-xs">Precisely arrange the order of the top 3 projects showcased in the home curated grids.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400">Exhibition Slot {idx + 1}</label>
              <select
                value={curatedIds[idx]}
                onChange={(e) => handleCuratedChange(idx, e.target.value)}
                className="w-full bg-[#02040a] border border-white/10 text-white px-4 py-3 text-xs uppercase tracking-wider focus:outline-none focus:border-[var(--glow-cyan)]/50 rounded-none h-11"
              >
                <option value="">-- Empty Slot --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category}) {p.status === "draft" ? "[DRAFT]" : ""}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-[11px] uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50 disabled:opacity-50 cursor-pointer min-h-[48px]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Save size={15} />
            {saving ? "Deploying Configuration..." : "Commit Homepage Settings"}
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </button>
      </div>
    </form>
  )
}
