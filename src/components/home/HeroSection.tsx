"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const particlePositions = [
  { top: "15%", left: "20%" },
  { top: "45%", left: "75%" },
  { top: "70%", left: "10%" },
  { top: "30%", left: "80%" },
  { top: "60%", left: "25%" },
  { top: "85%", left: "60%" },
  { top: "25%", left: "55%" },
  { top: "75%", left: "40%" },
]

export default function HeroSection({ project }: { project?: any }) {
  const title = project?.title || "Aria Shadow"
  const category = project?.category || "Digital Artistry & Conceptual Design"
  const description = project?.description || "Step into a realm where classical fantasy meets digital clarity. Treat each conceptual rendering, illustration, and 3D mesh as a bespoke artifact in a larger celestial collection."
  const coverImage = project?.cover_image || "/images/i1.png"
  const altText = project?.alt_text || project?.title || "Aria Shadow Primary Exhibit - Ethereal Gaze"
  const href = project ? `/portfolio/${project.slug || project.id}` : "/portfolio"
  const buttonText = project ? "Discover Artifact" : "Explore Archives"

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden bg-background">
      {/* Background celestial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[var(--glow-blue)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-[var(--glow-cyan)]/5 rounded-full blur-[100px]" />
      </div>

      {/* Floating Particles — hidden on small screens for performance */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden sm:block">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400/20 rounded-full"
            style={{ top: pos.top, left: pos.left }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Hero Content — stacks above image on mobile */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-5 sm:space-y-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-akira text-white leading-tight line-clamp-2">
                {title}
              </h1>
              <p className="text-[10px] sm:text-xs text-[var(--glow-cyan)] uppercase tracking-[0.3em] font-medium">
                {category}
              </p>
              <div className="w-12 h-[1px] bg-white/20 mx-auto lg:mx-0" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 line-clamp-3"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-2 sm:pt-4"
            >
              <Link
                href={href}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-white/20 hover:border-[var(--glow-cyan)]/45 text-white text-[11px] uppercase tracking-[0.2em] transition-all bg-white/5 hover:bg-[var(--glow-cyan)]/5 min-h-[44px]"
              >
                {buttonText} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Featured Hero Artwork — appears first on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center order-1 lg:order-2"
          >
            <div className="relative group p-2 sm:p-3 bg-[#050814]/60 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.05)] transition-all duration-700 hover:border-[var(--glow-cyan)]/30 hover:shadow-[0_0_60px_rgba(34,211,238,0.12)] w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px]">
              {/* Decorative Frame Corners */}
              <div className="absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-[var(--glow-cyan)]/40 group-hover:border-[var(--glow-cyan)]" />
              <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-[var(--glow-cyan)]/40 group-hover:border-[var(--glow-cyan)]" />
              <div className="absolute bottom-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-[var(--glow-cyan)]/40 group-hover:border-[var(--glow-cyan)]" />
              <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-[var(--glow-cyan)]/40 group-hover:border-[var(--glow-cyan)]" />

              <div className="overflow-hidden aspect-[4/5] w-full bg-[#02040a]">
                <img
                  src={coverImage}
                  alt={altText}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
