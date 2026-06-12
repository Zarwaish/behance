import ProjectForm from "@/components/admin/ProjectForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewProjectPage() {
  return (
    <div className="space-y-12">
      <div className="border-b border-white/5 pb-8">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--glow-cyan)] text-[10px] uppercase tracking-[0.2em] transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Registry
        </Link>
        <h1 className="text-4xl font-serif tracking-widest text-white mb-2 uppercase">Catalog Artifact</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Add a new exhibit item to your portfolio</p>
      </div>

      <ProjectForm />
    </div>
  )
}
