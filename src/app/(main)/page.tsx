import PageWrapper from "@/components/layout/PageWrapper"
import HeroSection from "@/components/home/HeroSection"
import FeaturedShowcase from "@/components/home/FeaturedShowcase"
import FeaturedWorks from "@/components/home/FeaturedWorks"
import AboutSection from "@/components/home/AboutSection"
import ContactSection from "@/components/home/ContactSection"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function Home() {
  const supabase = await createClient()
  let latestProjects: any[] = []
  
  try {
    const { data: latestData, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error("Supabase query error on HomePage:", error)
    }
    if (latestData) latestProjects = latestData
  } catch (e) {
    console.error("Exception fetching projects on HomePage:", e)
  }

  return (
    <PageWrapper>
      <HeroSection project={latestProjects[0]} />
      {latestProjects.length > 1 && (
        <FeaturedShowcase project={latestProjects[1]} />
      )}
      <FeaturedWorks projects={latestProjects.slice(0, 3) as any} />
      <AboutSection />
      <ContactSection />
    </PageWrapper>
  )
}
