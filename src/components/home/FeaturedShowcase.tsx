"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, User, Calendar, Cpu } from "lucide-react"

export default function FeaturedShowcase({ project }: { project?: any }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  if (!project) return null

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <section className="py-16 sm:py-24 bg-[#02040a] relative border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-xs text-[var(--glow-cyan)] uppercase tracking-[0.4em] mb-2 sm:mb-3">Masterpiece Spotlight</h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-akira text-white">Featured Artwork</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Parallax Card */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div style={{ perspective: 1000 }} className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[460px] cursor-pointer">
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative group p-2 bg-[#050814]/40 border border-white/5 transition-all duration-500 hover:border-[var(--glow-cyan)]/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 group-hover:border-[var(--glow-cyan)]/60 transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 group-hover:border-[var(--glow-cyan)]/60 transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 group-hover:border-[var(--glow-cyan)]/60 transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 group-hover:border-[var(--glow-cyan)]/60 transition-colors" />
                <div className="overflow-hidden aspect-[4/5] bg-[#02040a] relative" style={{ transform: "translateZ(30px)" }}>
                  <img
                    src={project.cover_image}
                    alt={project.alt_text || project.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Metadata */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 lg:pl-6 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-[10px] text-[var(--glow-cyan)] uppercase tracking-[0.25em] font-medium px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 inline-block">
                {project.category}
              </span>
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-widest uppercase line-clamp-2">
                {project.title}
              </h4>
              <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-4">
                {project.description}
              </p>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t border-b border-white/5 py-5 sm:py-6 text-xs text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3">
                <User size={14} className="text-zinc-600 flex-shrink-0" />
                <span className="text-zinc-500">Artist:</span>
                <span className="text-zinc-300 font-medium">Aria Shadow</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-zinc-600 flex-shrink-0" />
                <span className="text-zinc-500">Completed:</span>
                <span className="text-zinc-300 font-medium">{project.completion_date || "Q2 2026"}</span>
              </div>
              {project.technology_stack && project.technology_stack.length > 0 && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Cpu size={14} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-500">Tools:</span>
                  <span className="text-zinc-300 font-medium">{project.technology_stack.join(", ")}</span>
                </div>
              )}
            </div>

            <div className="pt-1 sm:pt-2">
              <Link
                href={`/portfolio/${project.slug || project.id}`}
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors min-h-[44px]"
              >
                <span>Read Full Spec Lore</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
