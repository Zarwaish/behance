import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit2 } from "lucide-react"
import { Project } from "@/types"
import DeleteButton from "./DeleteButton"

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  let projects: Project[] | null = null;
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    projects = data as Project[] | null;
  } catch (err) {
    // DB not connected
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-white mb-1 sm:mb-2 uppercase">Archives Registry</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Manage and curate portfolio artifacts</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-transparent border border-white/20 text-white text-[11px] uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50 w-full sm:w-auto min-h-[48px]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={15} />
            Enregister New Artifact
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </Link>
      </div>

      {/* Desktop: Table — hidden on mobile */}
      <div className="hidden sm:block bg-[#050814]/40 border border-white/5 relative shadow-[0_0_30px_rgba(34,211,238,0.02)] overflow-hidden">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/20" />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#050814]/90 border-b border-white/5">
              <tr>
                <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Artifact Details</th>
                <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Category</th>
                <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Status</th>
                <th className="px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(!projects || projects.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-zinc-500 font-serif italic text-lg">
                    No artifacts recovered in this registry. Catalog a new creation above.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--glow-cyan)]/5 transition-colors duration-500">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none overflow-hidden bg-[#02040a] border border-white/10 p-0.5 flex-shrink-0">
                          <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-serif text-base text-white tracking-wide">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs uppercase tracking-[0.15em]">{project.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 border text-[9px] uppercase tracking-[0.15em] font-medium ${
                        project.featured
                          ? "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-[var(--glow-cyan)]/30"
                          : "bg-white/5 text-zinc-500 border-white/5"
                      }`}>
                        {project.featured ? "Featured" : "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/admin/projects/${project.id}/edit`} className="p-2.5 border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center">
                          <Edit2 size={13} />
                        </Link>
                        <DeleteButton projectId={project.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card List — shown only on mobile */}
      <div className="sm:hidden space-y-3">
        {(!projects || projects.length === 0) ? (
          <div className="py-16 text-center text-zinc-500 font-serif italic border border-white/5 bg-[#050814]/30 px-6">
            No artifacts recovered. Catalog a new creation above.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-[#050814]/40 border border-white/5 p-4 space-y-3">
              {/* Top row: image + title + actions */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 overflow-hidden bg-[#02040a] border border-white/10 flex-shrink-0">
                  <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-white text-sm leading-tight mb-1 truncate">{project.title}</p>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.15em]">{project.category}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2.5 border border-white/5 bg-white/5 text-zinc-400 hover:text-white transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
                  >
                    <Edit2 size={13} />
                  </Link>
                  <DeleteButton projectId={project.id} />
                </div>
              </div>
              {/* Status badge */}
              <div>
                <span className={`px-2.5 py-1 border text-[9px] uppercase tracking-[0.15em] font-medium ${
                  project.featured
                    ? "bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border-[var(--glow-cyan)]/30"
                    : "bg-white/5 text-zinc-500 border-white/5"
                }`}>
                  {project.featured ? "Featured" : "Standard"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
