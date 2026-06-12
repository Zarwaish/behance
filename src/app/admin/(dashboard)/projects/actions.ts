"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Helper to extract file path from a Supabase Storage public URL
function getStoragePath(url: string, bucketName: string): string | null {
  try {
    if (!url.includes(`/storage/v1/object/public/${bucketName}/`)) {
      return null
    }
    const parts = url.split(`/storage/v1/object/public/${bucketName}/`)
    return parts[1] ? decodeURIComponent(parts[1]) : null
  } catch (e) {
    return null
  }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()

  try {
    // 1. Fetch the project to retrieve storage file paths
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("cover_image, gallery_images, video_file_url")
      .eq("id", projectId)
      .single()

    if (fetchError || !project) {
      return { success: false, error: fetchError?.message || "Project not found" }
    }

    // 2. Collect image paths for portfolio-images bucket
    const imagePaths: string[] = []

    const coverPath = getStoragePath(project.cover_image, "portfolio-images")
    if (coverPath) imagePaths.push(coverPath)

    if (project.gallery_images && Array.isArray(project.gallery_images)) {
      project.gallery_images.forEach((url: string) => {
        const path = getStoragePath(url, "portfolio-images")
        if (path) imagePaths.push(path)
      })
    }

    // 3. Delete image files from portfolio-images bucket
    if (imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("portfolio-images")
        .remove(imagePaths)

      if (storageError) {
        console.error("Failed to clean up image storage files:", storageError.message)
      }
    }

    // 4. Delete video file from portfolio-videos bucket (if an uploaded video exists)
    if (project.video_file_url) {
      const videoPath = getStoragePath(project.video_file_url, "portfolio-videos")
      if (videoPath) {
        const { error: videoStorageError } = await supabase.storage
          .from("portfolio-videos")
          .remove([videoPath])

        if (videoStorageError) {
          console.error("Failed to clean up video storage file:", videoStorageError.message)
        }
      }
    }

    // 5. Delete project record from database
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    revalidatePath("/admin/projects")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" }
  }
}
