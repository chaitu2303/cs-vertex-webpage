"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Particle {
  x: number
  y: number
  angle: number
  speed: number
  radius: number
  opacity: number
  size: number
  life: number
  maxLife: number
}

export function HeroLogoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const tiltRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const frameRef = useRef<number>(0)

  // Mouse tilt effect
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      tiltRef.current.targetX = ((e.clientY - cy) / (rect.height / 2)) * 8
      tiltRef.current.targetY = ((e.clientX - cx) / (rect.width / 2)) * 8
    }
    const onMouseLeave = () => {
      tiltRef.current.targetX = 0
      tiltRef.current.targetY = 0
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  // Mobile check to completely unmount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const SIZE = 500
    canvas.width = SIZE
    canvas.height = SIZE

    const cx = SIZE / 2
    const cy = SIZE / 2
    const isMobile = window.innerWidth < 768

    const particles: Particle[] = []
    const MAX_PARTICLES = isMobile ? 18 : 35

    const spawnParticle = () => {
      const angle = Math.random() * Math.PI * 2
      const r = 80 + Math.random() * 30
      particles.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        angle,
        speed: 0.2 + Math.random() * 0.4,
        radius: r,
        opacity: 0,
        size: 1 + Math.random() * 2,
        life: 0,
        maxLife: 100 + Math.random() * 120,
      })
    }

    // Blueprint drawing state
    let blueprintProgress = 0
    const BLUEPRINT_SPEED = 0.004

    // HUD corner data
    const hudCorners = [
      { x: cx - 140, y: cy - 140 },
      { x: cx + 140, y: cy - 140 },
      { x: cx + 140, y: cy + 140 },
      { x: cx - 140, y: cy + 140 },
    ]

    let frameCount = 0

    const render = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      frameCount++
      const t = frameCount * 0.016 // ~60fps time

      // ── 1. Faint circular grid (background) ──────────────────────────
      for (let r = 60; r <= 220; r += 40) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,90,42,0.04)`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      // Crosshair lines
      ctx.strokeStyle = "rgba(255,90,42,0.05)"
      ctx.lineWidth = 0.5
      ctx.setLineDash([4, 8])
      ctx.beginPath(); ctx.moveTo(cx, cy - 220); ctx.lineTo(cx, cy + 220); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx - 220, cy); ctx.lineTo(cx + 220, cy); ctx.stroke()
      ctx.setLineDash([])

      // ── 2. Outer ring (clockwise) ─────────────────────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.18)
      ctx.beginPath()
      ctx.arc(0, 0, 150, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255,90,42,0.18)"
      ctx.lineWidth = 1
      ctx.setLineDash([6, 14])
      ctx.stroke()
      ctx.setLineDash([])
      // tick marks on outer ring
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const inner = 146
        const outer = 155
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner)
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer)
        ctx.strokeStyle = i % 3 === 0 ? "rgba(255,90,42,0.5)" : "rgba(255,90,42,0.2)"
        ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8
        ctx.stroke()
      }
      ctx.restore()

      // ── 3. Inner ring (counter-clockwise) ────────────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(-t * 0.12)
      ctx.beginPath()
      ctx.arc(0, 0, 118, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255,255,255,0.07)"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 18])
      ctx.stroke()
      ctx.setLineDash([])
      // Small dots on inner ring
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(Math.cos(a) * 118, Math.sin(a) * 118, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,90,42,0.35)"
        ctx.fill()
      }
      ctx.restore()

      // ── 4. Orange glow / breathing effect ────────────────────────────
      const breathe = 0.6 + 0.4 * Math.sin(t * 0.5)
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120)
      glowGrad.addColorStop(0, `rgba(255,90,42,${0.18 * breathe})`)
      glowGrad.addColorStop(0.5, `rgba(255,90,42,${0.07 * breathe})`)
      glowGrad.addColorStop(1, "rgba(255,90,42,0)")
      ctx.beginPath()
      ctx.arc(cx, cy, 120, 0, Math.PI * 2)
      ctx.fillStyle = glowGrad
      ctx.fill()

      // ── 5. Particles ──────────────────────────────────────────────────
      if (frameCount % 4 === 0 && particles.length < MAX_PARTICLES) spawnParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.radius += p.speed
        p.x = cx + Math.cos(p.angle) * p.radius
        p.y = cy + Math.sin(p.angle) * p.radius
        // Fade in / fade out
        if (p.life < 30) p.opacity = p.life / 30
        else if (p.life > p.maxLife - 30) p.opacity = (p.maxLife - p.life) / 30
        else p.opacity = 0.8

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,90,42,${p.opacity * 0.8})`
        ctx.fill()

        if (p.life >= p.maxLife) particles.splice(i, 1)
      }

      // ── 6. Blueprint engineering lines (continuous draw) ─────────────
      blueprintProgress = (blueprintProgress + BLUEPRINT_SPEED) % 1
      const BP_RADIUS = 195

      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.strokeStyle = "rgba(255,90,42,1)"
      ctx.lineWidth = 0.8

      // Draw partial arc that travels around
      const startAngle = blueprintProgress * Math.PI * 2
      const arcLength = Math.PI * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, BP_RADIUS, startAngle, startAngle + arcLength)
      ctx.stroke()

      // Trailing dot
      const dotAngle = startAngle + arcLength
      ctx.beginPath()
      ctx.arc(
        cx + Math.cos(dotAngle) * BP_RADIUS,
        cy + Math.sin(dotAngle) * BP_RADIUS,
        3,
        0, Math.PI * 2
      )
      ctx.fillStyle = "rgba(255,90,42,1)"
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.restore()

      // ── 7. Light sweep every ~5–6 seconds ────────────────────────────
      const sweepPeriod = 320 // frames
      const sweepPhase = frameCount % sweepPeriod
      if (sweepPhase < 60) {
        const p2 = sweepPhase / 60
        const sweepX = cx - 130 + 260 * p2
        const sweepGrad = ctx.createLinearGradient(sweepX - 30, cy, sweepX + 30, cy)
        sweepGrad.addColorStop(0, "rgba(255,255,255,0)")
        sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.12)")
        sweepGrad.addColorStop(1, "rgba(255,255,255,0)")
        ctx.beginPath()
        ctx.ellipse(sweepX, cy, 30, 110, 0, 0, Math.PI * 2)
        ctx.fillStyle = sweepGrad
        ctx.fill()
      }

      // ── 8. HUD corner brackets ────────────────────────────────────────
      const BL = 16 // bracket length
      ctx.strokeStyle = "rgba(255,90,42,0.35)"
      ctx.lineWidth = 1
      const corners = [
        { x: cx - 140, y: cy - 140, dx: 1, dy: 1 },
        { x: cx + 140, y: cy - 140, dx: -1, dy: 1 },
        { x: cx + 140, y: cy + 140, dx: -1, dy: -1 },
        { x: cx - 140, y: cy + 140, dx: 1, dy: -1 },
      ]
      for (const c of corners) {
        ctx.beginPath()
        ctx.moveTo(c.x + c.dx * BL, c.y)
        ctx.lineTo(c.x, c.y)
        ctx.lineTo(c.x, c.y + c.dy * BL)
        ctx.stroke()
      }

      // Pulsing center dot
      const centerAlpha = 0.5 + 0.5 * Math.sin(t * 1.5)
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,90,42,${centerAlpha})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, 8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,90,42,${centerAlpha * 0.15})`
      ctx.fill()

      frameRef.current = requestAnimationFrame(render)
    }

    // Trigger entrance
    const timeout = setTimeout(() => setIsLoaded(true), 100)
    frameRef.current = requestAnimationFrame(render)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  // Smooth mouse tilt update
  useEffect(() => {
    let rafId: number
    const update = () => {
      const t = tiltRef.current
      t.x += (t.targetX - t.x) * 0.06
      t.y += (t.targetY - t.y) * 0.06
      if (containerRef.current) {
        const inner = containerRef.current.querySelector(".hero-logo-inner") as HTMLElement
        if (inner) {
          // Logo rotation turned off per user request
          inner.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`
        }
      }
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "500px",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
        flexShrink: 0,
      }}
    >
      {/* Particle/ring canvas layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Logo container with tilt */}
      <div
        className="hero-logo-inner"
        style={{
          position: "relative",
          zIndex: 2,
          willChange: "transform",
          transition: "transform 0.05s linear",
        }}
      >
        {/* Entrance + float animation wrapper */}
        <div
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "scale(1)" : "scale(0.8)",
            transition: "opacity 1.2s ease, transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            animation: isLoaded ? "hero-float 7s ease-in-out infinite" : "none",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src="/assets/logo/csvertex-logo.png"
            alt="CS Vertex"
            width={200}
            height={200}
            priority
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 0 28px rgba(255,90,42,0.45)) drop-shadow(0 0 60px rgba(255,90,42,0.18))",
              display: "block",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .hero-logo-inner:hover img {
          filter: drop-shadow(0 0 40px rgba(255,90,42,0.75)) drop-shadow(0 0 80px rgba(255,90,42,0.3)) !important;
          transition: filter 0.4s ease;
        }
        @media (max-width: 900px) {
          .hero-logo-anim-wrap {
            width: 340px !important;
            height: 340px !important;
          }
        }
        @media (max-width: 600px) {
          .hero-logo-anim-wrap {
            width: 260px !important;
            height: 260px !important;
          }
        }
      `}</style>
    </div>
  )
}
