import PageWrapper from "@/components/layout/PageWrapper"
import PortfolioClient from "@/components/portfolio/PortfolioClient"
import { createClient } from "@/lib/supabase/server"
import { Project } from "@/types"

export const metadata = {
  title: "The Archives | Aria Shadow",
  description: "Browse the curated digital art, website projects, 3D models, and visual design archives of Aria Shadow.",
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  
  let projects = null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) {
      console.error("Supabase query error on PortfolioPage:", error)
    }
    projects = data;
  } catch (err) {
    console.error("Exception fetching projects on PortfolioPage:", err)
  }

  const displayProjects = projects || []

  return (
    <PageWrapper className="bg-[#02040a]">
      <div className="pt-32 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--glow-blue)]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-white uppercase mb-4">
              Registry Archives
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
              Curated catalog of illustrations, interface designs, video assets, and 3D mockups.
            </p>
          </div>
          
          <PortfolioClient initialProjects={displayProjects as any} />
        </div>
      </div>
    </PageWrapper>
  )
}
