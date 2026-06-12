"use client"

import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-xs text-[var(--glow-cyan)] uppercase tracking-[0.4em]">The Vision</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase leading-tight">
            Aria Shadow
          </h3>
          <div className="w-12 h-[1px] bg-white/20 mx-auto" />
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">
            A multidisciplinary creator combining classical painting fundamentals with modern interactive design. Specializing in high-fidelity 3D modeling, conceptual game art, and sleek, minimalist interface frameworks.
          </p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Drawing visual guidance from crystals, celestial geometries, and dark fantasy legends, every piece is sculpted to be a collectible masterpiece.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
