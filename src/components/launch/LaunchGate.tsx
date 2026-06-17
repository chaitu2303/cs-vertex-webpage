"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import dynamic from 'next/dynamic'
import './launch.css'

const NetworkScene = dynamic(() => import('./NetworkScene'), { ssr: false })

/* ═══════════════════════════════════════════════════════
   PHASE TYPES
═══════════════════════════════════════════════════════ */
type Scene =
  | 'LOADING'
  | 'COUNTDOWN'    // S1: Cinematic countdown
  | 'IGNITION'     // S2: Final 15s energy buildup
  | 'FREEZE'       // S3: T-0 impact flash
  | 'FORGE'        // S4: Particle logo assembly
  | 'CURTAIN'      // S5: Velvet curtain reveal
  | 'HERO'         // S6: Logo hero shot + wordmark
  | 'EMERGE'       // S7: Homepage emerge
  | 'DONE'

/* ═══════════════════════════════════════════════════════
   PARTICLE SYSTEM — Logo Forge
═══════════════════════════════════════════════════════ */
class ForgeParticle {
  x: number; y: number
  tx: number; ty: number
  vx = 0; vy = 0
  size: number
  color: string
  alpha: number
  delay: number
  trail: { x: number; y: number; a: number }[] = []
  shimmer: number

  constructor(cw: number, ch: number) {
    const angle  = Math.random() * Math.PI * 2
    const radius = Math.max(cw, ch) * (0.5 + Math.random() * 0.7)
    this.x = cw / 2 + Math.cos(angle) * radius
    this.y = ch / 2 + Math.sin(angle) * radius

    const logoW = Math.min(cw * 0.35, 520)
    const logoH = logoW * 0.4
    this.tx = cw / 2 + (Math.random() - 0.5) * logoW * 0.9
    this.ty = ch / 2 + (Math.random() - 0.5) * logoH * 0.9

    this.size    = 0.8 + Math.random() * 2.8
    this.alpha   = 0.5 + Math.random() * 0.5
    this.delay   = Math.random() * 0.6
    this.shimmer = Math.random()

    const r = Math.random()
    this.color = r < 0.40 ? '#E8440A'
               : r < 0.62 ? '#FF7043'
               : r < 0.76 ? '#FFB74D'
               : r < 0.88 ? '#FF9800'
               : r < 0.95 ? '#FFFFFF'
               :             '#FF5722'
  }

  update(progress: number) {
    if (progress < this.delay) return
    const p    = Math.min(1, (progress - this.delay) / (1 - this.delay))
    const ease = 1 - Math.pow(1 - p, 3)

    this.trail.push({ x: this.x, y: this.y, a: this.alpha * 0.45 })
    if (this.trail.length > 12) this.trail.shift()

    const dx = this.tx - this.x
    const dy = this.ty - this.y
    this.vx += dx * 0.065 * ease
    this.vy += dy * 0.065 * ease
    this.vx *= 0.83
    this.vy *= 0.83
    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.trail.length; i++) {
      const t      = this.trail[i]
      const tAlpha = (i / this.trail.length) * this.alpha * 0.3
      ctx.globalAlpha = tAlpha
      ctx.beginPath()
      ctx.arc(t.x, t.y, this.size * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
    }

    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()

    ctx.globalAlpha = this.alpha * 0.18
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5)
    grd.addColorStop(0, this.color)
    grd.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function runForgeAnimation(canvas: HTMLCanvasElement, onLogoReady: () => void) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight

  const PARTICLES   = 220
  const DURATION_MS = 5500
  const particles   = Array.from({ length: PARTICLES }, () => new ForgeParticle(canvas.width, canvas.height))

  let startTime  = 0
  let raf        = 0
  let logoEmitted = false

  const tick = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed  = timestamp - startTime
    const progress = Math.min(elapsed / DURATION_MS, 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Ambient sparks
    const sparkCount = Math.floor(3 + progress * 8)
    for (let i = 0; i < sparkCount; i++) {
      if (Math.random() < 0.4) {
        const cx = canvas.width  / 2 + (Math.random() - 0.5) * canvas.width  * 0.4
        const cy = canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.22
        const sr = 0.3 + Math.random() * 2
        ctx.globalAlpha = Math.random() * 0.8
        ctx.beginPath()
        ctx.arc(cx, cy, sr, 0, Math.PI * 2)
        ctx.fillStyle = ['#FFD580', '#E8440A', '#fff', '#FF9800', '#FFB74D'][Math.floor(Math.random() * 5)]
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    particles.forEach(p => { p.update(progress); p.draw(ctx) })

    // At 72% convergence → logo ready
    if (progress >= 0.72 && !logoEmitted) { logoEmitted = true; onLogoReady() }

    if (progress < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      gsap.to(canvas, { opacity: 0, duration: 1.6, ease: 'power2.out' })
    }
  }

  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/* ═══════════════════════════════════════════════════════
   AMBIENT PARTICLE CANVAS — Countdown bg
═══════════════════════════════════════════════════════ */
function useAmbientParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>, tension: number) {
  const tensionRef = useRef(tension)
  tensionRef.current = tension

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface AmbP { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string; life: number; maxLife: number }

    const pool: AmbP[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * (canvas.width || window.innerWidth),
      y: Math.random() * (canvas.height || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.6 - 0.1,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.05,
      color: Math.random() < 0.4 ? '#E8440A' : '#ffffff',
      life: Math.random() * 200,
      maxLife: 150 + Math.random() * 120,
    }))

    const tick = () => {
      const t = tensionRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pool.forEach(p => {
        p.x   += p.vx * (1 + t * 1.5)
        p.y   += p.vy * (1 + t * 1.5)
        p.life += 1

        if (p.life > p.maxLife || p.x < 0 || p.x > canvas.width || p.y < -50) {
          p.x      = Math.random() * canvas.width
          p.y      = canvas.height + 10
          p.vx     = (Math.random() - 0.5) * 0.3
          p.vy     = -Math.random() * 0.6 - 0.1
          p.life   = 0
          p.maxLife = 150 + Math.random() * 120
          p.size   = Math.random() * 1.5 + 0.3
          p.alpha  = Math.random() * 0.4 + 0.05
          p.color  = Math.random() < 0.4 ? '#E8440A' : '#ffffff'
        }

        const fadeIn  = Math.min(1, p.life / 30)
        const fadeOut = Math.min(1, (p.maxLife - p.life) / 30)
        ctx.globalAlpha = p.alpha * fadeIn * fadeOut

        // Draw light ray
        ctx.save()
        ctx.translate(p.x, p.y)
        const gy = ctx.createLinearGradient(0, -p.size * 8, 0, p.size * 8)
        gy.addColorStop(0, 'transparent')
        gy.addColorStop(0.5, p.color)
        gy.addColorStop(1, 'transparent')
        ctx.fillStyle = gy
        ctx.fillRect(-p.size * 0.5, -p.size * 8, p.size, p.size * 16)
        ctx.restore()

        ctx.globalAlpha = 1
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

/* ═══════════════════════════════════════════════════════
   CURTAIN CANVAS — Physics-based curtain shading
═══════════════════════════════════════════════════════ */
function CurtainPanel({ side, openProgress }: { side: 'left' | 'right'; openProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = canvas.offsetWidth  || window.innerWidth / 2
    canvas.height = canvas.offsetHeight || window.innerHeight

    const drawCurtain = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Rich velvet base gradient
      const bg = ctx.createLinearGradient(0, 0, W, 0)
      if (side === 'left') {
        bg.addColorStop(0, '#0a0808')
        bg.addColorStop(0.4, '#140c0c')
        bg.addColorStop(0.7, '#1a0f0e')
        bg.addColorStop(1, '#0d0a09')
      } else {
        bg.addColorStop(0, '#0d0a09')
        bg.addColorStop(0.3, '#1a0f0e')
        bg.addColorStop(0.6, '#140c0c')
        bg.addColorStop(1, '#0a0808')
      }
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Fabric fold waves
      const FOLDS = 8
      for (let i = 0; i < FOLDS; i++) {
        const x      = (i / FOLDS) * W
        const foldW  = W / FOLDS
        const depth  = 0.06 + (Math.sin(i * 1.7 + openProgress * 0.5) * 0.5 + 0.5) * 0.08

        const fold = ctx.createLinearGradient(x, 0, x + foldW, 0)
        fold.addColorStop(0,    `rgba(255,255,255,${depth * 0.5})`)
        fold.addColorStop(0.3,  `rgba(232,68,10,${depth * 0.15})`)
        fold.addColorStop(0.6,  `rgba(0,0,0,${depth * 0.7})`)
        fold.addColorStop(0.85, `rgba(232,68,10,${depth * 0.08})`)
        fold.addColorStop(1,    `rgba(255,255,255,${depth * 0.3})`)
        ctx.fillStyle = fold
        ctx.fillRect(x, 0, foldW, H)
      }

      // Top valance border
      const valance = ctx.createLinearGradient(0, 0, 0, 80)
      valance.addColorStop(0, 'rgba(180,130,40,0.5)')
      valance.addColorStop(0.5, 'rgba(220,170,60,0.2)')
      valance.addColorStop(1, 'transparent')
      ctx.fillStyle = valance
      ctx.fillRect(0, 0, W, 80)

      // Bottom tassel area
      const tassel = ctx.createLinearGradient(0, H - 120, 0, H)
      tassel.addColorStop(0, 'transparent')
      tassel.addColorStop(0.6, 'rgba(180,130,40,0.12)')
      tassel.addColorStop(1, 'rgba(200,155,50,0.3)')
      ctx.fillStyle = tassel
      ctx.fillRect(0, H - 120, W, 120)

      // Center seam glow
      const seamX  = side === 'left' ? W - 3 : 0
      const seamGr = ctx.createLinearGradient(0, 0, 0, H)
      seamGr.addColorStop(0,   'transparent')
      seamGr.addColorStop(0.2, 'rgba(232,68,10,0.9)')
      seamGr.addColorStop(0.5, 'rgba(255,150,50,1)')
      seamGr.addColorStop(0.8, 'rgba(232,68,10,0.9)')
      seamGr.addColorStop(1,   'transparent')
      ctx.strokeStyle = seamGr
      ctx.lineWidth   = 2
      ctx.shadowColor = 'rgba(232,68,10,0.8)'
      ctx.shadowBlur  = 16
      ctx.beginPath()
      ctx.moveTo(seamX, 0)
      ctx.lineTo(seamX, H)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Gold rope ornament
      ctx.strokeStyle = 'rgba(210,165,50,0.6)'
      ctx.lineWidth = 3
      ctx.setLineDash([6, 4])
      const ropeX = side === 'left' ? W * 0.15 : W * 0.85
      ctx.beginPath()
      ctx.moveTo(ropeX, H * 0.1)
      ctx.lineTo(ropeX + (side === 'left' ? 20 : -20), H * 0.35)
      ctx.lineTo(ropeX, H * 0.45)
      ctx.stroke()
      ctx.setLineDash([])

      // Stage-light reflection sweep at top
      const sweep = ctx.createRadialGradient(
        side === 'left' ? W * 0.9 : W * 0.1, 0, 0,
        side === 'left' ? W * 0.9 : W * 0.1, 0, W * 1.2
      )
      sweep.addColorStop(0,   'rgba(255,240,200,0.08)')
      sweep.addColorStop(0.5, 'rgba(255,200,100,0.03)')
      sweep.addColorStop(1,   'transparent')
      ctx.fillStyle = sweep
      ctx.fillRect(0, 0, W, H * 0.6)
    }

    const animate = () => { drawCurtain(); animRef.current = requestAnimationFrame(animate) }
    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [side, openProgress])

  return (
    <canvas
      ref={canvasRef}
      className={`curtain-canvas curtain-${side}`}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN LAUNCH GATE
═══════════════════════════════════════════════════════ */
export function LaunchGate({ children }: { children: React.ReactNode }) {
  const [scene,      setScene]     = useState<Scene>('LOADING')
  const [isClient,   setClient]    = useState(false)
  const [time,       setTime]      = useState({ h: 0, m: 0, s: 0 })
  const [tension,    setTension]   = useState(0)
  const [flip,       setFlip]      = useState({ h: false, m: false, s: false })
  const [progress,   setProgress]  = useState(0)
  const [rings,      setRings]     = useState(false)
  const [curtainOpen, setCurtainOpen] = useState(0)  // 0–1

  // DOM refs
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null)
  const sceneForgeRef    = useRef<HTMLDivElement>(null)
  const sceneHeroRef     = useRef<HTMLDivElement>(null)
  const sceneEmergeRef   = useRef<HTMLDivElement>(null)
  const sceneFreezeRef   = useRef<HTMLDivElement>(null)
  const curtainRootRef   = useRef<HTMLDivElement>(null)
  const curtainLeftRef   = useRef<HTMLDivElement>(null)
  const curtainRightRef  = useRef<HTMLDivElement>(null)
  const backdropGlowRef  = useRef<HTMLDivElement>(null)
  const forgeCanvasRef   = useRef<HTMLCanvasElement>(null)
  const forgeSparkRef    = useRef<HTMLDivElement>(null)
  const forgeCircleRef   = useRef<HTMLDivElement>(null)
  const logoHeroRef      = useRef<HTMLDivElement>(null)
  const heroWordmarkRef  = useRef<HTMLDivElement>(null)
  const emergeLogo       = useRef<HTMLDivElement>(null)
  const websiteRef       = useRef<HTMLDivElement>(null)
  const heroSubRef       = useRef<HTMLDivElement>(null)
  const shakeRef         = useRef<HTMLDivElement>(null)
  const spotlightRef     = useRef<HTMLDivElement>(null)
  const laserRef         = useRef<HTMLDivElement>(null)
  const countdownRef     = useRef<HTMLDivElement>(null)

  // Ambient canvas particles
  useAmbientParticles(ambientCanvasRef, tension)

  // Stable timer
  const [launchDate] = useState(() =>
    process.env.NEXT_PUBLIC_LAUNCH_DATE
      ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime()
      : Date.now() + 1000 * 45   // 45s demo
  )
  const [totalDuration] = useState(() =>
    process.env.NEXT_PUBLIC_LAUNCH_DATE
      ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime() - Date.now()
      : 1000 * 45
  )

  /* ═══════════════════════════════
     MASTER SEQUENCE
  ═══════════════════════════════ */
  const runSequence = useCallback(() => {

    // ── S3: FREEZE / IMPACT ──────────────────────────────────
    setScene('FREEZE')

    // Screen shake
    if (shakeRef.current) {
      gsap.timeline()
        .to(shakeRef.current, { x: -8, duration: 0.05, ease: 'none' })
        .to(shakeRef.current, { x:  8, duration: 0.05, ease: 'none' })
        .to(shakeRef.current, { x: -5, duration: 0.05, ease: 'none' })
        .to(shakeRef.current, { x:  5, duration: 0.05, ease: 'none' })
        .to(shakeRef.current, { x: -3, duration: 0.04, ease: 'none' })
        .to(shakeRef.current, { x:  0, duration: 0.04, ease: 'none' })
    }

    // Flash to black
    gsap.fromTo(sceneFreezeRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.08, ease: 'power4.in' }
    )

    const tl = gsap.timeline()

    // Hold black 0.9s — spotlight emerges
    tl.to({}, { duration: 0.9 })

    // Spotlight from above center
    tl.call(() => {
      if (spotlightRef.current) {
        gsap.fromTo(spotlightRef.current,
          { opacity: 0, scaleY: 0 },
          { opacity: 1, scaleY: 1, duration: 1.2, ease: 'power3.out', transformOrigin: 'top center' }
        )
      }
    })

    // Laser streaks appear
    tl.call(() => {
      if (laserRef.current) {
        const lasers = laserRef.current.querySelectorAll('.laser-beam')
        lasers.forEach((l, i) => {
          gsap.fromTo(l,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.4, delay: i * 0.06, ease: 'power3.out' }
          )
        })
        // Fade lasers after brief flash
        setTimeout(() => {
          lasers.forEach(l => {
            gsap.to(l, { opacity: 0, duration: 0.6, ease: 'power2.out' })
          })
        }, 800)
      }
    }, undefined, '+=0.3')

    // ── S4: FORGE ────────────────────────────────────
    tl.call(() => {
      setScene('FORGE')
      gsap.to(sceneFreezeRef.current, { opacity: 0, duration: 2, ease: 'power2.out' })

      if (sceneForgeRef.current) {
        gsap.to(sceneForgeRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      }

      // Spark birth
      const spark  = forgeSparkRef.current
      const circle = forgeCircleRef.current
      if (spark) {
        gsap.timeline()
          .fromTo(spark,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(3)' }
          )
          .to(spark, { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.15)
      }
      if (circle) {
        gsap.timeline()
          .fromTo(circle,
            { opacity: 0, width: '20px', height: '20px', marginLeft: '-10px', marginTop: '-10px' },
            { opacity: 1, duration: 0.15, ease: 'power2.out', delay: 0.25 }
          )
          .to(circle, {
            width: '400px', height: '400px',
            marginLeft: '-200px', marginTop: '-200px',
            opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.05
          })
      }

      // Run particle forge
      if (forgeCanvasRef.current) {
        runForgeAnimation(forgeCanvasRef.current, () => {
          if (!logoHeroRef.current) return

          // Flash at logo birth
          gsap.fromTo(sceneFreezeRef.current,
            { opacity: 0 },
            { opacity: 0.55, duration: 0.05, yoyo: true, repeat: 1, ease: 'power4.in' }
          )

          // Logo materializes — metallic, blazing
          gsap.fromTo(logoHeroRef.current,
            { opacity: 0, scale: 0.55, filter: 'blur(40px) brightness(8)' },
            {
              opacity: 1,
              scale: 1,
              filter: [
                'blur(0px)',
                'brightness(1.4)',
                'drop-shadow(0 0 80px rgba(232,68,10,1))',
                'drop-shadow(0 0 160px rgba(232,68,10,0.6))',
                'drop-shadow(0 30px 60px rgba(0,0,0,0.95))',
                'drop-shadow(-5px -5px 10px rgba(255,255,255,0.14))',
              ].join(' '),
              duration: 2.5,
              ease: 'power3.out',
              onComplete: () => {
                gsap.to(logoHeroRef.current, {
                  filter: [
                    'blur(0px)',
                    'brightness(1)',
                    'drop-shadow(0 0 50px rgba(232,68,10,0.75))',
                    'drop-shadow(0 0 100px rgba(232,68,10,0.3))',
                    'drop-shadow(0 24px 48px rgba(0,0,0,0.9))',
                    'drop-shadow(-3px -3px 6px rgba(255,255,255,0.1))',
                  ].join(' '),
                  duration: 1.8, ease: 'power2.out'
                })
              }
            }
          )

          // Power beat pulse 3.2s after logo appears
          setTimeout(() => {
            if (!logoHeroRef.current) return
            gsap.timeline()
              .to(logoHeroRef.current, {
                filter: [
                  'blur(0px)',
                  'brightness(2.5)',
                  'drop-shadow(0 0 120px rgba(255,120,0,1))',
                  'drop-shadow(0 0 240px rgba(232,68,10,0.9))',
                ].join(' '),
                scale: 1.04, duration: 0.55, ease: 'power3.out'
              })
              .to(logoHeroRef.current, {
                filter: [
                  'blur(0px)',
                  'brightness(1)',
                  'drop-shadow(0 0 50px rgba(232,68,10,0.75))',
                  'drop-shadow(0 0 100px rgba(232,68,10,0.3))',
                  'drop-shadow(0 24px 48px rgba(0,0,0,0.9))',
                ].join(' '),
                scale: 1, duration: 1.4, ease: 'power2.out'
              })

            // Gentle float
            gsap.to(logoHeroRef.current, {
              y: -16, duration: 4.5, ease: 'power1.inOut', yoyo: true, repeat: -1, delay: 1.8
            })
          }, 3200)

          // ── S5: CURTAIN REVEAL ────────────────────────────────
          setTimeout(() => {
            setScene('CURTAIN')

            const cLeft  = curtainLeftRef.current
            const cRight = curtainRightRef.current
            const bgGlow = backdropGlowRef.current

            // Dramatic pause then curtains fly
            setTimeout(() => {
              if (cLeft && cRight) {
                // Stage lighting explosion behind curtains
                if (bgGlow) {
                  gsap.timeline()
                    .fromTo(bgGlow,
                      { opacity: 0, scale: 0.3 },
                      { opacity: 1, scale: 1.6, duration: 0.9, ease: 'power2.out' }
                    )
                    .to(bgGlow, { opacity: 0, scale: 2.4, duration: 1.4, ease: 'power1.in' })
                }

                // Curtains part with staggered ease
                gsap.to(cLeft,  { xPercent: -100, duration: 2.0, ease: 'power4.inOut' })
                gsap.to(cRight, { xPercent:  100, duration: 2.0, ease: 'power4.inOut',
                  onUpdate: () => {
                    const progress = 1 - Math.abs(gsap.getProperty(cRight, 'xPercent') as number) / 100
                    setCurtainOpen(progress)
                  }
                })
              }

              // ── S6: HERO SHOT ──────────────────────────────
              setTimeout(() => {
                setScene('HERO')
                gsap.to(sceneHeroRef.current, { opacity: 1, duration: 0.7, ease: 'power2.out' })

                setTimeout(() => {
                  if (heroWordmarkRef.current) {
                    gsap.fromTo(heroWordmarkRef.current,
                      { opacity: 0, y: 16 },
                      { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }
                    )
                  }
                  if (heroSubRef.current) {
                    gsap.fromTo(heroSubRef.current,
                      { opacity: 0, y: 12 },
                      { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.4 }
                    )
                  }

                  // ── S7: EMERGE ──────────────────────────────
                  setTimeout(() => {
                    setScene('EMERGE')
                    if (sceneEmergeRef.current) {
                      sceneEmergeRef.current.classList.add('active')
                    }

                    if (emergeLogo.current) {
                      gsap.set(emergeLogo.current, { top: '50%', y: '-50%', opacity: 1, scale: 1 })
                      gsap.to(emergeLogo.current, {
                        top: '24px', y: 0, scale: 0.26,
                        duration: 2.8, ease: 'power4.inOut', delay: 0.5
                      })
                    }

                    if (websiteRef.current) {
                      gsap.to(websiteRef.current, {
                        opacity: 1, duration: 2.4, ease: 'power2.inOut', delay: 1.6,
                        onComplete: () => {
                          gsap.to(emergeLogo.current, { opacity: 0, duration: 0.7, delay: 0.5, ease: 'power2.in' })
                          setTimeout(() => {
                            localStorage.setItem('csvertex_launch_seen', 'true')
                            setScene('DONE')
                            window.dispatchEvent(new Event('resize'))
                          }, 900)
                        }
                      })
                    }
                  }, 4500) // hero breathes 4.5s
                }, 1400)   // pause after curtains

              }, 2000)     // curtains take 2s
            }, 600)        // pause before curtains start

          }, 4800)         // forge + logo settle
        })
      }
    }, undefined, '+=0.4')

  }, [])

  /* ═══════════════════════════════
     COUNTDOWN TIMER
  ═══════════════════════════════ */
  useEffect(() => {
    setClient(true)

    const isDev = process.env.NODE_ENV === 'development'
    const seen  = isDev ? null : localStorage.getItem('csvertex_launch_seen')
    if (seen === 'true') { setScene('DONE'); return }

    const now = Date.now()
    if (now >= launchDate) { runSequence(); return }

    setScene('COUNTDOWN')

    const RING_THRESHOLD = 15 * 1000

    const tick = setInterval(() => {
      const dist = launchDate - Date.now()

      if (dist <= 0) { clearInterval(tick); runSequence(); return }

      const h = Math.floor(dist / 3600000)
      const m = Math.floor((dist % 3600000) / 60000)
      const s = Math.floor((dist % 60000) / 1000)

      const elapsed = totalDuration - dist
      setProgress(Math.min(100, (elapsed / totalDuration) * 100))
      setTension(Math.max(0, Math.min(1, 1 - dist / (totalDuration * 0.5))))

      setTime(prev => {
        setFlip({ h: prev.h !== h, m: prev.m !== m, s: prev.s !== s })
        setTimeout(() => setFlip({ h: false, m: false, s: false }), 130)
        return { h, m, s }
      })

      if (dist <= RING_THRESHOLD) setRings(true)

      // Final 5s — animate countdown to ignition
      if (dist <= 5000 && countdownRef.current) {
        const scale = 1 + (1 - dist / 5000) * 0.15
        gsap.to(countdownRef.current, { scale, duration: 0.3, ease: 'power2.out' })
      }
    }, 1000)

    return () => clearInterval(tick)
  }, [launchDate, totalDuration, runSequence])

  /* ═══════════════════════════════
     HELPERS
  ═══════════════════════════════ */
  const tClass = tension > 0.7 ? 't3' : tension > 0.35 ? 't2' : 't1'

  if (!isClient || scene === 'LOADING') {
    return <div style={{ width: '100vw', height: '100vh', background: '#080808' }} />
  }

  if (scene === 'DONE') return <>{children}</>

  /* ═══════════════════════════════
     RENDER
  ═══════════════════════════════ */
  return (
    <div id="launch-root" ref={shakeRef}>

      {/* ══════════════════════════════════
          SCENE 1 & 2 — THE COUNTDOWN
      ══════════════════════════════════ */}
      {(scene === 'COUNTDOWN' || scene === 'IGNITION') && (
        <div id="scene-wait">

          {/* Ambient light-ray particles canvas */}
          <canvas ref={ambientCanvasRef} id="ambient-canvas" />

          {/* Three.js network background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <NetworkScene intensity={tension} />
          </div>

          {/* Radial vignette */}
          <div className="vignette" />

          {/* Stage light beams from top */}
          <div className="stage-lights">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`stage-beam stage-beam-${i}`} />
            ))}
          </div>

          {/* Energy rings — final 15s */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'none' }}>
            {[600, 850, 1100].map((sz, i) => (
              <div key={i} className={`energy-ring${rings ? ' active' : ''}`}
                style={{ width: sz, height: sz, top: '50%', left: '50%', marginLeft: -sz/2, marginTop: -sz/2, position: 'absolute', animationDelay: `${i * 0.5}s` }}
              />
            ))}
          </div>

          {/* CS Vertex logo watermark */}
          <img src="/assets/logo.png" alt="" className={`logo-watermark${rings ? ' s2' : ''}`} />

          {/* COUNTDOWN CONTENT */}
          <div className="wait-content" ref={countdownRef}>
            <div className="wait-brand-line">
              <span className="wait-brand-dot" />
              CS VERTEX
              <span className="wait-brand-dot" />
            </div>
            <div className="wait-wordmark">Grand Opening</div>
            <div className="wait-sublabel">Launching In</div>

            <div className="countdown-cluster">
              {/* Hours */}
              <div className="cd-unit">
                <div className={`cd-glass ${tClass}`}>
                  <div className="cd-glass-shine" />
                  <div className={`cd-num ${tClass}${flip.h ? ' flipping' : ''}`}>
                    {String(time.h).padStart(2, '0')}
                  </div>
                </div>
                <div className={`cd-label ${tClass}`}>Hours</div>
              </div>

              <div className={`cd-sep ${tClass}`}>:</div>

              {/* Minutes */}
              <div className="cd-unit">
                <div className={`cd-glass ${tClass}`}>
                  <div className="cd-glass-shine" />
                  <div className={`cd-num ${tClass}${flip.m ? ' flipping' : ''}`}>
                    {String(time.m).padStart(2, '0')}
                  </div>
                </div>
                <div className={`cd-label ${tClass}`}>Minutes</div>
              </div>

              <div className={`cd-sep ${tClass}`}>:</div>

              {/* Seconds */}
              <div className="cd-unit">
                <div className={`cd-glass ${tClass}`}>
                  <div className="cd-glass-shine" />
                  <div className={`cd-num ${tClass}${flip.s ? ' flipping' : ''}`}>
                    {String(time.s).padStart(2, '0')}
                  </div>
                </div>
                <div className={`cd-label ${tClass}`}>Seconds</div>
              </div>
            </div>

            <div className="wait-tagline">
              Something extraordinary is about to begin
            </div>

            <div className="wait-bottom">
              csvertex.com &nbsp;·&nbsp; Visakhapatnam, India &nbsp;·&nbsp; 2026
            </div>
          </div>

          {/* Progress bar */}
          <div className="wait-progress">
            <div className="wait-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          FREEZE OVERLAY (S3) + SPOTLIGHT + LASERS
      ══════════════════════════════════ */}
      <div id="scene-freeze" ref={sceneFreezeRef}>
        {/* Spotlight beam from ceiling */}
        <div id="spotlight" ref={spotlightRef}>
          <div id="spotlight-cone" />
          <div id="spotlight-ground" />
        </div>

        {/* Laser beams */}
        <div id="laser-container" ref={laserRef}>
          {[-60, -30, 0, 30, 60].map((angle, i) => (
            <div key={i} className="laser-beam" style={{ transform: `rotate(${angle}deg)` }} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          SCENE 4 — LOGO FORGE
      ══════════════════════════════════ */}
      <div id="scene-forge" ref={sceneForgeRef}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <NetworkScene intensity={0.12} />
        </div>

        <canvas ref={forgeCanvasRef} id="forge-canvas" />

        <div ref={forgeSparkRef} className="forge-spark" />
        <div ref={forgeCircleRef} className="forge-circle" />

        <div ref={logoHeroRef} id="logo-hero-wrap">
          <img
            id="logo-hero-img"
            src="/assets/logo.png"
            alt="CS Vertex"
          />
        </div>
      </div>

      {/* ══════════════════════════════════
          SCENE 5 — VELVET CURTAINS
      ══════════════════════════════════ */}
      <div id="scene-curtains" ref={curtainRootRef}>
        <div ref={curtainLeftRef} className="curtain-panel curtain-panel-left">
          <CurtainPanel side="left" openProgress={curtainOpen} />
          {/* Gold rope decoration */}
          <div className="curtain-rope curtain-rope-left">
            <div className="curtain-tassel" />
          </div>
        </div>
        <div ref={curtainRightRef} className="curtain-panel curtain-panel-right">
          <CurtainPanel side="right" openProgress={curtainOpen} />
          <div className="curtain-rope curtain-rope-right">
            <div className="curtain-tassel" />
          </div>
        </div>

        {/* Dust particles that escape as curtains open */}
        <div id="curtain-dust">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="dust-mote" style={{
              left: `${45 + (Math.random() - 0.5) * 10}%`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Radial backdrop glow explosion */}
      <div id="scene-backdrop-glow" ref={backdropGlowRef} />

      {/* ══════════════════════════════════
          SCENE 6 — HERO SHOT
      ══════════════════════════════════ */}
      <div id="scene-hero" ref={sceneHeroRef}>
        <div ref={heroWordmarkRef} className="hero-wordmark" style={{ opacity: 0 }}>
          CS Vertex
        </div>
        <div ref={heroSubRef} className="hero-sub" style={{ opacity: 0 }}>
          Software & Hardware Engineering
        </div>
      </div>

      {/* ══════════════════════════════════
          SCENE 7 — HOMEPAGE EMERGE
      ══════════════════════════════════ */}
      <div id="scene-emerge" ref={sceneEmergeRef}>
        <div ref={emergeLogo} id="emerge-logo">
          <img src="/assets/logo.png" alt="CS Vertex"
            style={{ width: 'clamp(200px, 32vw, 480px)', height: 'auto', display: 'block',
              filter: 'drop-shadow(0 0 30px rgba(232,68,10,0.5))' }}
          />
        </div>
        <div ref={websiteRef} id="website-content" style={{ opacity: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
