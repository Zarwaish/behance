"use client"

import { motion } from "framer-motion"
import { Layers, MonitorSmartphone, Hexagon, Diamond } from "lucide-react"

const skills = [
  {
    icon: <Diamond size={28} strokeWidth={1} />,
    title: "Brand Identity",
    description: "Architecting visual systems that resonate with prestige and clarity."
  },
  {
    icon: <MonitorSmartphone size={28} strokeWidth={1} />,
    title: "Digital Experiences",
    description: "Engineering immersive web environments with cutting-edge interaction."
  },
  {
    icon: <Hexagon size={28} strokeWidth={1} />,
    title: "3D Realities",
    description: "Sculpting surreal objects and spaces that defy conventional physics."
  },
  {
    icon: <Layers size={28} strokeWidth={1} />,
    title: "Motion Design",
    description: "Choreographing fluid animations that breathe life into static assets."
  }
]

export default function SkillsSection() {
  return (
    <section className="py-32 bg-[#02040a] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--glow-blue)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="md:w-1/3"
          >
            <div className="sticky top-32">
              <h2 className="text-sm text-[var(--glow-cyan)] uppercase tracking-[0.4em] mb-4">Disciplines</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-6">Mastery of Form & Void</h3>
              <p className="text-zinc-500 font-light leading-relaxed">
                A multidisciplinary approach fusing classical aesthetic principles with avant-garde technology.
              </p>
            </div>
          </motion.div>

          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: index * 0.15 }}
                className="group p-10 bg-transparent border border-white/5 hover:border-[var(--glow-cyan)]/30 transition-colors duration-500 relative overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="text-zinc-600 group-hover:text-[var(--glow-cyan)] transition-colors duration-500 mb-8 relative z-10">
                  {skill.icon}
                </div>
                <h4 className="text-xl font-serif text-white mb-4 relative z-10">{skill.title}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed relative z-10">
                  {skill.description}
                </p>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--glow-cyan)]/0 group-hover:border-[var(--glow-cyan)]/50 transition-colors duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
