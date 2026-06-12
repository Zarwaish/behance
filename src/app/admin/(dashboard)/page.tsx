import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  let totalProjects = 0;
  let featuredProjects = 0;
  let publishedProjects = 0;
  let draftProjects = 0;

  try {
    const resTotal = await supabase.from('projects').select('*', { count: 'exact', head: true })
    totalProjects = resTotal.count || 0;
    
    const resFeatured = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('featured', true)
    featuredProjects = resFeatured.count || 0;

    const resPublished = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published')
    publishedProjects = resPublished.count || 0;

    const resDraft = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'draft')
    draftProjects = resDraft.count || 0;
  } catch (err) {
    // DB not setup
  }

  const statCards = [
    { label: "Total Cataloged", value: totalProjects },
    { label: "Published Works", value: publishedProjects },
    { label: "Draft Conceptions", value: draftProjects },
    { label: "Featured Showcases", value: featuredProjects }
  ]

  return (
    <div className="space-y-12">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-serif tracking-widest text-white mb-2 uppercase">Aria Shadow CMS</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Portfolio Management Center</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[#050814] border border-white/5 relative p-6 transition-all hover:border-[var(--glow-cyan)]/20 group">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--glow-cyan)] mb-3 block font-medium">
              {stat.label}
            </span>
            <p className="text-4xl font-serif text-white tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Informational Vault Card */}
      <div className="bg-[#050814]/50 border border-white/5 relative p-8">
        <h3 className="text-xs font-serif uppercase tracking-[0.2em] text-white mb-3">Database Connection Status</h3>
        <p className="text-zinc-500 text-xs uppercase tracking-wider leading-relaxed max-w-2xl">
          Dynamic sync active. Catalog additions, modifications, and deletions will instantly cascade to the live portfolio frontend when configured with valid keys in <code className="text-[var(--glow-cyan)] lowercase bg-white/5 px-2 py-0.5 text-[10px]">.env.local</code>.
        </p>
      </div>
    </div>
  )
}
