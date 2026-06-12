"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { deleteProject } from "./actions"

export default function DeleteButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this project? This action will also clean up associated images from storage.")) {
      return
    }

    setLoading(true)
    try {
      const res = await deleteProject(projectId)
      if (!res.success) {
        alert(`Error deleting project: ${res.error}`)
      }
    } catch (err) {
      alert("Failed to delete project.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2.5 border border-white/5 bg-white/5 text-zinc-400 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer disabled:opacity-50"
      title="Delete Project"
    >
      <Trash2 size={14} className={loading ? "animate-pulse" : ""} />
    </button>
  )
}
