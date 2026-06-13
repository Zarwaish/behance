import { createClient } from "@/lib/supabase/server"
import { Project } from "@/types"
import { getHomepageSettings } from "./actions"
import HomepageCurationForm from "./HomepageCurationForm"

export default async function HomepageCurationPage() {
  const supabase = await createClient()

  let projects: Project[] = []
  try {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("title", { ascending: true })
    if (data) projects = data as Project[]
  } catch (err) {
    console.error("Failed to load projects for curation:", err)
  }

  const settings = await getHomepageSettings()

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="border-b border-white/5 pb-6 sm:pb-8">
        <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-white mb-1 sm:mb-2 uppercase">Homepage Curation</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Curate and order the featured exhibitions</p>
      </div>

      <HomepageCurationForm projects={projects} initialSettings={settings} />
    </div>
  )
}
