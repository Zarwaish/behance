export type Project = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  cover_image: string
  alt_text?: string
  gallery_images: string[]
  video_url?: string        // YouTube / Vimeo link (embed)
  video_file_url?: string   // Direct uploaded video (MP4 etc.)
  website_url?: string
  featured: boolean
  status: 'draft' | 'published'
  display_order: number
  client_name?: string
  completion_date?: string
  technology_stack?: string[]
  tags?: string[]
  created_at: string
}

export const CATEGORIES = [
  "Logos",
  "Banners",
  "Websites",
  "3D Models",
  "Videos",
  "Artwork",
] as const

export type Category = typeof CATEGORIES[number]
