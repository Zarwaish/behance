"use client"

import { motion } from "framer-motion"

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-40 bg-[#02040a] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[var(--glow-blue)]/10 rounded-full blur-[150px] mix-blend-screen"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <div className="w-[1px] h-10 sm:h-16 bg-gradient-to-b from-transparent to-[var(--glow-cyan)] mx-auto mb-8 sm:mb-12" />

          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight mb-6 sm:mb-8 leading-tight">
            Initiate <br />
            <span className="text-[var(--glow-cyan)] italic">The Sequence</span>
          </h2>

          <p className="text-base sm:text-xl text-zinc-500 font-light mb-10 sm:mb-16 max-w-2xl mx-auto leading-relaxed">
            My sanctum is currently open for exclusive commissions and high-end collaborations.
          </p>

          <a
            href="mailto:hello@hazi.com"
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 bg-transparent text-white font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-sm overflow-hidden border border-white/20 transition-all hover:border-[var(--glow-cyan)] min-h-[52px]"
          >
            <span className="relative z-10">Establish Connection</span>
            <div className="absolute inset-0 bg-[var(--glow-cyan)]/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--glow-cyan)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
