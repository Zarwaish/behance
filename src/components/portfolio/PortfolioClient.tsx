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
    <div className="space-y-10 sm:space-y-12">
      {/* Search & Filters Panel */}
      <div className="flex flex-col gap-5 border-b border-white/5 pb-8">
        {/* Category Filters — horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max sm:flex-wrap">
            <button
              onClick={() => setFilter("All")}
              className={cn(
                "px-3 sm:px-4 py-2 uppercase tracking-[0.15em] text-[10px] font-medium transition-all duration-300 border whitespace-nowrap min-h-[38px]",
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
                  "px-3 sm:px-4 py-2 uppercase tracking-[0.15em] text-[10px] font-medium transition-all duration-300 border whitespace-nowrap min-h-[38px]",
                  filter === category
                    ? "border-[var(--glow-cyan)]/40 text-white bg-white/5"
                    : "border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Text Search — full width */}
        <div className="w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artifacts..."
            className="w-full px-4 py-3 bg-[#050814]/60 border border-white/10 text-white text-xs tracking-wider uppercase focus:outline-none focus:border-[var(--glow-cyan)]/40 transition-colors min-h-[44px]"
          />
        </div>
      </div>

      {/* Active filter label on mobile */}
      {filter !== "All" && (
        <div className="flex items-center gap-2 -mt-4 sm:hidden">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600">Filtered:</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--glow-cyan)]">{filter}</span>
          <button
            onClick={() => setFilter("All")}
            className="text-[9px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 ml-2"
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
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
              <Link href={`/portfolio/${project.slug || project.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#050814] border border-white/5 transition-all duration-500 hover:border-white/10">
                  <img
                    src={project.cover_image}
                    alt={project.alt_text || project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-500" />

                  {/* Mobile: always visible info; Desktop: hover reveal */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 sm:transition-transform sm:duration-500 sm:ease-out">
                    <span className="text-[9px] text-[var(--glow-cyan)] uppercase tracking-[0.25em] mb-1.5 sm:mb-2 block sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-500 sm:delay-75">
                      {project.category}
                    </span>
                    <h4 className="text-base sm:text-xl font-serif text-white mb-2 sm:mb-3 tracking-wide leading-tight">
                      {project.title}
                    </h4>
                    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors sm:opacity-0 sm:group-hover:opacity-100 sm:duration-500 sm:delay-100">
                      Discover <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 sm:py-32 text-zinc-500 font-serif text-lg sm:text-xl italic">
          No artifacts recovered in this sector.
        </div>
      )}
    </div>
  )
}
