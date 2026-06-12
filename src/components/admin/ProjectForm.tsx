"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from "@/lib/supabase/client"
import { CATEGORIES } from "@/types"
import { Upload, X, Video, Film } from "lucide-react"

export default function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    category: initialData?.category || CATEGORIES[0],
    cover_image: initialData?.cover_image || "",
    alt_text: initialData?.alt_text || "",
    gallery_images_raw: initialData?.gallery_images?.join("\n") || "",
    video_url: initialData?.video_url || "",
    video_file_url: initialData?.video_file_url || "",
    website_url: initialData?.website_url || initialData?.external_link || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "published",
    display_order: initialData?.display_order || 0,
    client_name: initialData?.client_name || "",
    completion_date: initialData?.completion_date || "",
    technology_stack_raw: initialData?.technology_stack?.join(", ") || "",
    tags_raw: initialData?.tags?.join(", ") || "",
  })

  // Synchronize form state when initialData changes/loads
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        category: initialData.category || CATEGORIES[0],
        cover_image: initialData.cover_image || "",
        alt_text: initialData.alt_text || "",
        gallery_images_raw: initialData.gallery_images?.join("\n") || "",
        video_url: initialData.video_url || "",
        video_file_url: initialData.video_file_url || "",
        website_url: initialData.website_url || initialData.external_link || "",
        featured: initialData.featured || false,
        status: initialData.status || "published",
        display_order: initialData.display_order || 0,
        client_name: initialData.client_name || "",
        completion_date: initialData.completion_date || "",
        technology_stack_raw: initialData.technology_stack?.join(", ") || "",
        tags_raw: initialData.tags?.join(", ") || "",
      })
    }
  }, [initialData])

  const getSupabase = () => {
    const { url, anonKey } = getSupabaseConfig()
    return createBrowserClient(url, anonKey)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'gallery') => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const supabase = getSupabase()
    setUploading(true)

    try {
      const urls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `projects/${fileName}`

        const { error } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath)

        urls.push(publicUrl)
      }

      if (field === 'cover') {
        setFormData(prev => ({ ...prev, cover_image: urls[0] }))
      } else {
        const currentGallery = formData.gallery_images_raw.trim()
        const updatedGallery = currentGallery
          ? `${currentGallery}\n${urls.join('\n')}`
          : urls.join('\n')
        setFormData(prev => ({ ...prev, gallery_images_raw: updatedGallery }))
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message || err}`)
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, etc.)')
      return
    }

    // Warn if file is very large (>500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file is larger than 500MB. Consider compressing it before uploading.')
      return
    }

    const supabase = getSupabase()
    setUploadingVideo(true)
    setVideoUploadProgress(0)

    try {
      const fileExt = file.name.split('.').pop() || 'mp4'
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `projects/${fileName}`

      // If replacing an existing uploaded video, delete the old one first
      if (formData.video_file_url && formData.video_file_url.includes('/storage/v1/object/public/portfolio-videos/')) {
        try {
          const oldPath = formData.video_file_url
            .split('/storage/v1/object/public/portfolio-videos/')[1]
          if (oldPath) {
            await supabase.storage.from('portfolio-videos').remove([decodeURIComponent(oldPath)])
          }
        } catch { /* ignore cleanup errors */ }
      }

      // Use XMLHttpRequest for real upload progress tracking
      const { url: configUrl, anonKey: configAnonKey } = getSupabaseConfig()
      const uploadUrl = `${configUrl}/storage/v1/object/portfolio-videos/${filePath}`
      const anonKey = configAnonKey

      // Get the user session token
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token || anonKey

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', uploadUrl)
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`)
        xhr.setRequestHeader('x-upsert', 'false')
        xhr.setRequestHeader('Content-Type', file.type)

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100)
            setVideoUploadProgress(pct)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error during video upload')))
        xhr.addEventListener('abort', () => reject(new Error('Video upload was aborted')))

        xhr.send(file)
      })

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-videos')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, video_file_url: publicUrl }))
      setVideoUploadProgress(100)
    } catch (err: any) {
      alert(`Video upload failed: ${err.message || err}`)
      setVideoUploadProgress(0)
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleRemoveVideo = async () => {
    if (!formData.video_file_url) return
    if (!confirm('Remove the uploaded video file?')) return

    const supabase = getSupabase()
    try {
      if (formData.video_file_url.includes('/storage/v1/object/public/portfolio-videos/')) {
        const oldPath = formData.video_file_url
          .split('/storage/v1/object/public/portfolio-videos/')[1]
        if (oldPath) {
          await supabase.storage.from('portfolio-videos').remove([decodeURIComponent(oldPath)])
        }
      }
    } catch { /* ignore cleanup errors */ }
    setFormData(prev => ({ ...prev, video_file_url: '' }))
    setVideoUploadProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = getSupabase()

    const slug = formData.slug.trim() || formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const payload = {
      title: formData.title.trim(),
      slug,
      description: formData.description.trim(),
      category: formData.category,
      cover_image: formData.cover_image.trim(),
      alt_text: formData.alt_text.trim() || null,
      gallery_images: formData.gallery_images_raw.split('\n').map((l: string) => l.trim()).filter(Boolean),
      video_url: formData.video_url.trim() || null,
      video_file_url: formData.video_file_url.trim() || null,
      website_url: formData.website_url.trim() || null,
      featured: formData.featured,
      status: formData.status as any,
      display_order: Number(formData.display_order) || 0,
      client_name: formData.client_name.trim() || null,
      completion_date: formData.completion_date || null,
      technology_stack: formData.technology_stack_raw.split(',').map((t: string) => t.trim()).filter(Boolean),
      tags: formData.tags_raw.split(',').map((t: string) => t.trim()).filter(Boolean),
    }

    try {
      let error = null
      if (initialData?.id) {
        const res = await supabase.from('projects').update(payload).eq('id', initialData.id)
        error = res.error
      } else {
        const res = await supabase.from('projects').insert([payload])
        error = res.error
      }

      if (error) {
        alert(`Error saving project: ${error.message}`)
      } else {
        router.refresh()
        router.push("/admin/projects")
        setTimeout(() => router.refresh(), 150)
      }
    } catch (err) {
      alert("Failed to communicate with Supabase backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="space-y-6 bg-[#050814]/40 border border-white/5 relative p-8 shadow-[0_0_30px_rgba(34,211,238,0.02)]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/20" />

        {/* ── Title & Slug ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Artifact Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="e.g. Midnight Symphony"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Unique Slug (Clean URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="e.g. midnight-symphony"
            />
          </div>
        </div>

        {/* ── Description ── */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Description / Lore</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm resize-none"
            placeholder="Describe the conceptual history and visual context..."
            required
          />
        </div>

        {/* ── Category / Status / Order ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Category Sector</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#050814] text-white">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Publishing Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm cursor-pointer"
            >
              <option value="published" className="bg-[#050814] text-white">Published</option>
              <option value="draft" className="bg-[#050814] text-white">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="e.g. 1"
            />
          </div>
        </div>

        {/* ── Client / Date ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Client Name (Optional)</label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="Client/Project sponsor"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Completion Date (Optional)</label>
            <input
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
            />
          </div>
        </div>

        {/* ── Tech Stack / Tags ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Technology Stack (Comma separated)</label>
            <input
              type="text"
              value={formData.technology_stack_raw}
              onChange={(e) => setFormData({ ...formData, technology_stack_raw: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="Blender, ZBrush, Photoshop"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Tags (Comma separated)</label>
            <input
              type="text"
              value={formData.tags_raw}
              onChange={(e) => setFormData({ ...formData, tags_raw: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="3D, Illustration, Character"
            />
          </div>
        </div>

        {/* ── Cover Image ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Primary Cover Image Link</label>
            <div className="flex gap-4 items-center">
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="flex-1 px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
                placeholder="https://..."
                required
              />
              <label className="px-4 py-3 border border-white/20 hover:border-[var(--glow-cyan)]/50 text-white text-[10px] uppercase tracking-wider bg-white/5 cursor-pointer transition-colors shrink-0">
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Image Alt Text</label>
            <input
              type="text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="Detailed description of the artwork"
            />
          </div>
        </div>

        {/* ── Gallery Images ── */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] font-semibold">Additional Gallery Images (One link per line)</label>
            <label className="px-3 py-1.5 border border-white/20 hover:border-[var(--glow-cyan)]/50 text-white text-[9px] uppercase tracking-wider bg-white/5 cursor-pointer transition-colors">
              {uploading ? "Uploading..." : "Upload Files"}
              <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'gallery')} className="hidden" disabled={uploading} />
            </label>
          </div>
          <textarea
            value={formData.gallery_images_raw}
            onChange={(e) => setFormData({ ...formData, gallery_images_raw: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm resize-none"
            placeholder={"https://...\nhttps://..."}
          />
        </div>

        {/* ══════════════════════════════════════════════
            VIDEO SECTION
        ══════════════════════════════════════════════ */}
        <div className="space-y-6 pt-2 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-semibold pt-2">Video Content</p>

          {/* ── Direct Video Upload ── */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-3 font-semibold">
              Upload Video File (MP4 / WebM)
            </label>

            {formData.video_file_url ? (
              /* Video already uploaded — show preview + replace/remove controls */
              <div className="space-y-3">
                <div className="relative w-full aspect-video bg-[#02040a] border border-[var(--glow-cyan)]/20 overflow-hidden">
                  <video
                    src={formData.video_file_url}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 border border-white/20 hover:border-[var(--glow-cyan)]/50 text-white text-[10px] uppercase tracking-wider bg-white/5 cursor-pointer transition-colors">
                    <Upload size={12} />
                    Replace Video
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="flex items-center gap-2 px-4 py-2.5 border border-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300 text-[10px] uppercase tracking-wider bg-red-950/20 transition-colors"
                  >
                    <X size={12} />
                    Remove Video
                  </button>
                </div>
              </div>
            ) : uploadingVideo ? (
              /* Upload in progress */
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-5 bg-[#02040a]/60 border border-[var(--glow-cyan)]/20">
                  <Film size={18} className="text-[var(--glow-cyan)] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider">
                      <span className="text-zinc-400">Uploading video...</span>
                      <span className="text-[var(--glow-cyan)] font-semibold">{videoUploadProgress}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--glow-cyan)] to-cyan-400 transition-all duration-300"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state — upload trigger */
              <label className="flex flex-col items-center justify-center gap-3 w-full py-10 border border-dashed border-white/10 hover:border-[var(--glow-cyan)]/30 bg-[#02040a]/40 cursor-pointer transition-colors group">
                <Video size={28} className="text-zinc-600 group-hover:text-[var(--glow-cyan)] transition-colors" />
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                    Click to upload video
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wider">MP4, WebM, MOV — max 500 MB</p>
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploadingVideo}
                />
              </label>
            )}
          </div>

          {/* ── YouTube / Vimeo Link (alternative) ── */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">
              Or: YouTube / Vimeo URL (Optional)
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
            <p className="mt-1.5 text-[9px] text-zinc-600 uppercase tracking-wider">
              If both a file and a URL are provided, the uploaded file takes priority.
            </p>
          </div>
        </div>

        {/* ── Website URL ── */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--glow-cyan)] mb-2 font-semibold">Website URL (Optional)</label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="w-full px-4 py-3 bg-[#02040a]/60 border border-white/10 text-white focus:outline-none focus:border-[var(--glow-cyan)]/50 focus:ring-1 focus:ring-[var(--glow-cyan)]/20 transition-all font-sans text-sm"
            placeholder="https://exhibit.live"
          />
        </div>

        {/* ── Featured checkbox ── */}
        <div className="flex items-center gap-3 pt-4">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 border border-white/20 bg-[#02040a]/60 text-[var(--glow-cyan)] rounded-none focus:ring-[var(--glow-cyan)] focus:ring-offset-[#02040a] cursor-pointer"
          />
          <label htmlFor="featured" className="text-xs uppercase tracking-[0.15em] text-zinc-400 cursor-pointer hover:text-white transition-colors">
            Feature this artifact on the main gallery showcase
          </label>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-xs uppercase tracking-[0.2em] rounded-none transition-all cursor-pointer"
          disabled={loading || uploading || uploadingVideo}
        >
          Retreat
        </button>
        <button
          type="submit"
          disabled={loading || uploading || uploadingVideo}
          className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white text-xs uppercase tracking-[0.2em] transition-all hover:border-[var(--glow-cyan)]/50 cursor-pointer disabled:opacity-50"
        >
          <span className="relative z-10">
            {loading ? "Cataloging..." : uploading ? "Uploading Images..." : uploadingVideo ? `Uploading Video ${videoUploadProgress}%...` : "Catalog Artifact"}
          </span>
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--glow-cyan)]/15 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </button>
      </div>
    </form>
  )
}
