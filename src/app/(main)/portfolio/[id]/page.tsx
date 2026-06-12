import PageWrapper from "@/components/layout/PageWrapper"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe, Calendar, User, Cpu } from "lucide-react"
import { notFound } from "next/navigation"
import { Project } from "@/types"

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  let projectData = null;
  try {
    // 1. Try querying by slug first
    const { data: slugData } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', id)
      .single()
    
    if (slugData) {
      projectData = slugData;
    } else {
      // 2. Fallback querying by id
      const { data: idData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
      projectData = idData;
    }
  } catch(e) {}

  let project = projectData as Project | null
  
  if (!project) {
    return notFound()
  }

  const getVideoEmbedUrl = (url?: string) => {
    if (!url) return null
    
    // Normalize youtube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    
    // Normalize vimeo URLs
    if (url.includes('vimeo.com')) {
      let videoId = '';
      if (url.includes('player.vimeo.com/video/')) {
        videoId = url.split('player.vimeo.com/video/')[1]?.split('?')[0] || '';
      } else if (url.includes('vimeo.com/')) {
        videoId = url.split('vimeo.com/')[1]?.split('?')[0] || '';
      }
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    
    return url // fallback
  }

  const embedVideoUrl = getVideoEmbedUrl(project.video_url)
  // Uploaded file takes priority over embed link
  const hasUploadedVideo = Boolean(project.video_file_url)
  const hasEmbedVideo = !hasUploadedVideo && Boolean(embedVideoUrl)
  const targetLink = project.website_url

  return (
    <PageWrapper>
      {/* Cinematic Banner */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-[#02040a]">
        <img 
          src={project.cover_image} 
          alt={project.alt_text || project.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-75" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors mb-6">
              <ArrowLeft size={12} /> Return to Archives
            </Link>
            <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-white uppercase mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-[var(--glow-cyan)] uppercase tracking-[0.15em] font-medium">{project.category}</span>
              {project.tags && project.tags.length > 0 && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(t => (
                      <span key={t} className="text-zinc-500 uppercase tracking-wider text-[10px]">#{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Specifications */}
            <div className="lg:col-span-4 space-y-8 border-r border-white/5 pr-0 lg:pr-8">
              <div>
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-3 font-semibold">Project Brief</h3>
                <p className="text-sm text-zinc-350 font-light leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-semibold">Specifications</h3>
                
                {project.client_name && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <User size={14} className="text-zinc-650" />
                    <span className="font-medium">Client:</span>
                    <span className="text-zinc-300">{project.client_name}</span>
                  </div>
                )}

                {project.completion_date && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Calendar size={14} className="text-zinc-650" />
                    <span className="font-medium">Completed:</span>
                    <span className="text-zinc-300">{project.completion_date}</span>
                  </div>
                )}

                {project.technology_stack && project.technology_stack.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <Cpu size={14} className="text-zinc-650" />
                      <span className="font-medium">Technologies:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-6">
                      {project.technology_stack.map(tech => (
                        <span key={tech} className="px-2 py-0.5 border border-white/10 bg-white/5 text-[9px] uppercase tracking-wider text-zinc-450 rounded-none">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {targetLink && (
                <div className="pt-6 border-t border-white/5">
                  <a
                    href={targetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 border border-white/10 hover:border-[var(--glow-cyan)]/40 text-[10px] uppercase tracking-[0.2em] text-white bg-[#050814]/30 transition-all duration-300"
                  >
                    <span>Launch Website</span>
                    <ExternalLink size={12} className="text-zinc-500" />
                  </a>
                </div>
              )}
            </div>

            {/* Media Column */}
            <div className="lg:col-span-8 space-y-10">

              {/* ── Uploaded Video (HTML5 player) — priority ── */}
              {hasUploadedVideo && (
                <div className="space-y-4">
                  <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Video</h3>
                  <div className="relative w-full bg-[#02040a] border border-white/5 overflow-hidden">
                    <video
                      src={project.video_file_url}
                      poster={project.cover_image}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full max-h-[70vh] object-contain"
                      style={{ display: 'block' }}
                    >
                      <p className="text-zinc-500 text-sm p-4">
                        Your browser does not support the video element.{' '}
                        <a href={project.video_file_url} className="text-[var(--glow-cyan)] underline">Download video</a>
                      </p>
                    </video>
                  </div>
                </div>
              )}

              {/* ── YouTube / Vimeo Embed (fallback when no uploaded file) ── */}
              {hasEmbedVideo && embedVideoUrl && (
                <div className="space-y-4">
                  <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Video Reel</h3>
                  <div className="relative w-full aspect-[16/9] bg-[#050814] border border-white/5">
                    <iframe
                      src={embedVideoUrl}
                      title={`${project.title} Video Embed`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* ── Gallery Images ── */}
              <div className="space-y-6">
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Visual Gallery</h3>
                {project.gallery_images && project.gallery_images.length > 0 ? (
                  project.gallery_images.map((img: string, i: number) => (
                    <div key={i} className="relative w-full bg-[#050814] border border-white/5 p-1.5">
                      <img src={img} alt={`${project.title} gallery exhibit ${i+1}`} className="w-full object-contain" />
                    </div>
                  ))
                ) : (
                  !hasUploadedVideo && !hasEmbedVideo && (
                    <div className="w-full aspect-[16/9] bg-[#02040a] border border-white/5 flex items-center justify-center p-8">
                      <p className="text-zinc-650 font-serif italic text-base">No additional gallery assets registered.</p>
                    </div>
                  )
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
