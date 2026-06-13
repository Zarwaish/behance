"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface HomepageSettings {
  featured_project_id: string | null
  curated_project_ids: string[]
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("featured_project_id, curated_project_ids")
      .eq("id", "homepage")
      .maybeSingle()

    if (error) {
      console.warn("Could not fetch homepage settings (table might not exist yet):", error.message)
      return { featured_project_id: null, curated_project_ids: [] }
    }

    return {
      featured_project_id: data?.featured_project_id || null,
      curated_project_ids: data?.curated_project_ids || [],
    }
  } catch (err) {
    console.error("Exception fetching homepage settings:", err)
    return { featured_project_id: null, curated_project_ids: [] }
  }
}

export async function updateHomepageSettings(
  featuredProjectId: string | null,
  curatedProjectIds: string[]
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("homepage_settings")
      .upsert({
        id: "homepage",
        featured_project_id: featuredProjectId,
        curated_project_ids: curatedProjectIds,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" }
  }
}
