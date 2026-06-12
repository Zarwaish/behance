"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Project } from "@/types"

export default function FeaturedWorks({ projects }: { projects: Project[] }) {
  const displayProjects = projects || []

  return (
    <section className="py-24 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-xs text-[var(--glow-cyan)] uppercase tracking-[0.4em] mb-3">Featured Showcases</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase">Curated Catalog</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="hidden md:block"
          >
            <Link href="/portfolio" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-[var(--glow-cyan)] transition-colors">
              <span>View Registry Archives</span>
              <div className="w-12 h-[1px] bg-zinc-700 group-hover:bg-[var(--glow-cyan)] transition-colors relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-current rotate-45 transform translate-x-1/2" />
              </div>
            </Link>
          </motion.div>
        </div>

        {displayProjects.length === 0 ? (
          <div className="w-full text-center py-20 border border-white/5 bg-[#050814]/20 relative max-w-md mx-auto p-8 shadow-[0_0_30px_rgba(34,211,238,0.01)]">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--glow-cyan)]/25" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--glow-cyan)]/25" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--glow-cyan)]/25" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--glow-cyan)]/25" />
            <p className="text-zinc-550 font-serif italic text-xs uppercase tracking-[0.2em]">No projects have been published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#050814] border border-white/5 transition-all duration-500 hover:border-white/10">
                  {/* Image */}
                  <img
                    src={project.cover_image}
                    alt={project.alt_text || project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-700" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-[var(--glow-cyan)]/40 via-transparent to-transparent mix-blend-overlay transition-opacity duration-700" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <span className="text-[10px] text-[var(--glow-cyan)] uppercase tracking-[0.3em] mb-3 block opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">{project.category}</span>
                    <h4 className="text-2xl font-serif text-white mb-4">{project.title}</h4>
                    <div className="h-[1px] w-0 bg-[var(--glow-cyan)]/50 group-hover:w-full transition-all duration-1000 ease-out mb-4" />
                    <Link href={`/portfolio/${project.slug || project.id}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-700 delay-200">
                      Discover <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/portfolio" className="inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:border-[var(--glow-cyan)] transition-colors bg-white/5">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
