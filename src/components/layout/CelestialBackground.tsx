"use client"

import { useEffect, useState } from "react"

export default function CelestialBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#020205]">
      {/* Deep Midnight Blue/Purple Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,13,38,0.5)_0%,rgba(3,5,20,0.95)_70%,rgba(2,2,5,1)_100%)]" />
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[65vw] h-[65vw] rounded-full bg-cyan-900/10 blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '14s' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-blue-950/15 blur-[110px] animate-pulse pointer-events-none" style={{ animationDuration: '20s' }} />
      <div className="absolute top-[25%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-cyan-950/5 blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '17s' }} />
      
      {/* Subtle Grid overlay for alignment and depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:120px_120px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />

      {/* Floating Sparkles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => {
          const size = Math.random() * 2 + 1
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 6
          const duration = Math.random() * 8 + 12
          return (
            <div
              key={i}
              className="absolute bg-cyan-400/20 rounded-full blur-[0.5px] animate-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
