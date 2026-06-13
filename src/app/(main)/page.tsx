import PageWrapper from "@/components/layout/PageWrapper"
import HeroSection from "@/components/home/HeroSection"
import FeaturedShowcase from "@/components/home/FeaturedShowcase"
import FeaturedWorks from "@/components/home/FeaturedWorks"
import AboutSection from "@/components/home/AboutSection"
import ContactSection from "@/components/home/ContactSection"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  let allPublished: any[] = []
  let featuredProject: any = null
  let curatedProjects: any[] = []

  try {
    // Fetch all published projects to filter/arrange dynamically
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error("Supabase query error on HomePage projects:", projectsError)
    }
    if (projectsData) {
      allPublished = projectsData
    }

    // Attempt to fetch homepage settings
    const { data: settings, error: settingsError } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 'homepage')
      .maybeSingle()

    if (settingsError) {
      console.warn("Could not load homepage settings (table might not exist yet):", settingsError.message)
    }

    if (settings) {
      // Find custom featured project
      if (settings.featured_project_id) {
        featuredProject = allPublished.find(p => p.id === settings.featured_project_id) || null
      }
      
      // Map custom curated projects (ensuring order)
      if (settings.curated_project_ids && Array.isArray(settings.curated_project_ids)) {
        curatedProjects = settings.curated_project_ids
          .map((id: string) => allPublished.find(p => p.id === id))
          .filter(Boolean)
      }
    }
  } catch (e) {
    console.error("Exception fetching data on HomePage:", e)
  }

  // Fallbacks if customization is missing or table is not created yet
  const heroProject = allPublished[0] || null
  const displayFeatured = featuredProject || allPublished[1] || null
  const displayCurated = curatedProjects.length > 0 ? curatedProjects : allPublished.slice(0, 3)

  return (
    <PageWrapper>
      <HeroSection project={heroProject} />
      {displayFeatured && (
        <FeaturedShowcase project={displayFeatured} />
      )}
      <FeaturedWorks projects={displayCurated} />
      <AboutSection />
      <ContactSection />
    </PageWrapper>
  )
}
