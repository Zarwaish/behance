"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Project, CATEGORIES } from "@/types"
import { cn } from "@/lib/utils"

export default function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  const filteredProjects = initialProjects.filter(project => {
    const matchesCategory = filter === "All" || project.category === filter
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-12">
      {/* Search & Filters Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilter("All")}
            className={cn(
              "relative px-4 py-2 uppercase tracking-[0.15em] text-[10px] font-medium transition-all duration-300 border",
              filter === "All" 
                ? "border-[var(--glow-cyan)]/40 text-white bg-white/5" 
                : "border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
            )}
          >
            All
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cn(
                "relative px-4 py-2 uppercase tracking-[0.15em] text-[10px] font-medium transition-all duration-300 border",
                filter === category 
                  ? "border-[var(--glow-cyan)]/40 text-white bg-white/5" 
                  : "border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Text Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artifacts..."
            className="w-full px-4 py-2 bg-[#050814]/60 border border-white/10 text-white text-xs tracking-wider uppercase focus:outline-none focus:border-[var(--glow-cyan)]/40 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#050814] border border-white/5 transition-all duration-500 hover:border-white/10">
                <img
                  src={project.cover_image}
                  alt={project.alt_text || project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-500" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-[9px] text-[var(--glow-cyan)] uppercase tracking-[0.25em] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">{project.category}</span>
                  <h4 className="text-xl font-serif text-white mb-3 tracking-wide">{project.title}</h4>
                  <Link href={`/portfolio/${project.slug || project.id}`} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-500 delay-100">
                    Discover <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-32 text-zinc-500 font-serif text-xl italic">
          No artifacts recovered in this sector.
        </div>
      )}
    </div>
  )
}
