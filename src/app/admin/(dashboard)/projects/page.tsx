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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-serif tracking-widest text-white mb-2 uppercase">Archives Registry</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Manage and curate portfolio artifacts</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-[11px] uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus size={16} />
            Enregister New Artifact
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </Link>
      </div>

      <div className="bg-[#050814]/40 border border-white/5 relative shadow-[0_0_30px_rgba(34,211,238,0.02)] overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/20" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#050814]/90 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Artifact Details</th>
                <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Category Group</th>
                <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)]">Registry Status</th>
                <th className="px-8 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--glow-cyan)] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(!projects || projects.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-zinc-500 font-serif italic text-lg">
                    No artifacts recovered in this registry. Catalog a new creation above.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--glow-cyan)]/5 transition-colors duration-500">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-none overflow-hidden bg-[#02040a] border border-white/10 p-1 flex-shrink-0">
                          <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover transition-all duration-500" />
                        </div>
                        <span className="font-serif text-lg text-white tracking-wide">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-zinc-400 text-xs uppercase tracking-[0.15em]">{project.category}</td>
                    <td className="px-8 py-5">
                      {project.featured ? (
                        <span className="px-3 py-1 bg-[var(--glow-cyan)]/10 text-[var(--glow-cyan)] border border-[var(--glow-cyan)]/30 text-[9px] uppercase tracking-[0.15em] font-medium">
                          Featured
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-white/5 text-zinc-500 border border-white/5 text-[9px] uppercase tracking-[0.15em] font-medium">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-4">
                        <Link href={`/admin/projects/${project.id}/edit`} className="p-2.5 border border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                          <Edit2 size={14} />
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
    </div>
  )
}
