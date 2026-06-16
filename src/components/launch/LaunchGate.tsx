"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import dynamic from 'next/dynamic'
import './launch.css'

const NetworkScene = dynamic(() => import('./NetworkScene'), { ssr: false })

/* ═══════════════════════════════════════════════════════
   THREE.JS — NETWORK NODE BACKGROUND
   Premium tech-company feel. Subtle. Not gaming.
═══════════════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════════════
   CANVAS PARTICLE FORGE — Logo Assembly System
   The STAR of the experience.
═══════════════════════════════════════════════════════ */
class Particle {
  x: number; y: number
  tx: number; ty: number        // target position near logo center
  vx = 0; vy = 0
  size: number
  color: string
  alpha: number
  arrived = false
  delay: number
  trail: { x: number; y: number; a: number }[] = []

  constructor(cw: number, ch: number) {
    // Spawn from far edges / random positions
    const angle  = Math.random() * Math.PI * 2
    const radius = Math.max(cw, ch) * (0.55 + Math.random() * 0.6)
    this.x = cw / 2 + Math.cos(angle) * radius
    this.y = ch / 2 + Math.sin(angle) * radius

    // Target: cluster near the logo silhouette area
    const logoW = Math.min(cw * 0.32, 480)
    const logoH = logoW * 0.4
    this.tx = cw / 2 + (Math.random() - 0.5) * logoW * 0.85
    this.ty = ch / 2 + (Math.random() - 0.5) * logoH * 0.85

    this.size  = 1 + Math.random() * 2.5
    this.alpha = 0.6 + Math.random() * 0.4
    this.delay = Math.random() * 0.7

    const r = Math.random()
    this.color = r < 0.45 ? '#E8440A'
               : r < 0.70 ? '#FF7043'
               : r < 0.85 ? '#FFB74D'
               : r < 0.95 ? '#FFFFFF'
               :             '#FF5722'
  }

  update(progress: number) {
    if (progress < this.delay) return

    const p  = Math.min(1, (progress - this.delay) / (1 - this.delay))
    const ease = 1 - Math.pow(1 - p, 3)    // ease-out-cubic

    this.trail.push({ x: this.x, y: this.y, a: this.alpha * 0.5 })
    if (this.trail.length > 10) this.trail.shift()

    const dx = this.tx - this.x
    const dy = this.ty - this.y

    this.vx += dx * 0.06 * ease
    this.vy += dy * 0.06 * ease
    this.vx *= 0.84
    this.vy *= 0.84

    this.x += this.vx
    this.y += this.vy

    if (Math.hypot(dx, dy) < 3) this.arrived = true
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i]
      const tAlpha = (i / this.trail.length) * this.alpha * 0.35
      ctx.globalAlpha = tAlpha
      ctx.beginPath()
      ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
    }

    // Core
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()

    // Glow
    ctx.globalAlpha = this.alpha * 0.2
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4)
    grd.addColorStop(0, this.color)
    grd.addColorStop(1, 'transparent')
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.globalAlpha = 1
  }
}

function runForgeAnimation(
  canvas: HTMLCanvasElement,
  onLogoReady: () => void
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight

  const PARTICLES = 160
  const FPS_DURATION = 5000  // ms total for particle convergence
  const particles = Array.from({ length: PARTICLES }, () => new Particle(canvas.width, canvas.height))

  let startTime = 0
  let raf = 0
  let logoEmitted = false

  const tick = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed  = timestamp - startTime
    const progress = Math.min(elapsed / FPS_DURATION, 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sparse random sparks
    if (Math.random() < 0.35) {
      const cx = canvas.width / 2  + (Math.random() - 0.5) * canvas.width  * 0.34
      const cy = canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.18
      const sr = 0.5 + Math.random() * 1.5
      ctx.globalAlpha = Math.random() * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, sr, 0, Math.PI * 2)
      ctx.fillStyle = ['#FFD580', '#E8440A', '#fff'][Math.floor(Math.random() * 3)]
      ctx.fill()
      ctx.globalAlpha = 1
    }

    particles.forEach(p => {
      p.update(progress)
      p.draw(ctx)
    })

    // At 75% convergence, signal logo ready
    if (progress >= 0.75 && !logoEmitted) {
      logoEmitted = true
      onLogoReady()
    }

    if (progress < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      // Fade canvas out smoothly
      gsap.to(canvas, { opacity: 0, duration: 1.4, ease: 'power2.out' })
    }
  }

  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/* ═══════════════════════════════════════════════════════
   PHASE TYPES
═══════════════════════════════════════════════════════ */
type Scene =
  | 'LOADING'
  | 'WAIT'        // S1+S2: Countdown
  | 'FREEZE'      // S3: 0.8s black
  | 'FORGE'       // S4: Particle logo assembly
  | 'PANELS'      // S5: Digital panels split
  | 'HERO'        // S6: Full-screen 3D logo
  | 'EMERGE'      // S7: Homepage emerges
  | 'DONE'

/* ═══════════════════════════════════════════════════════
   MAIN LAUNCH GATE
═══════════════════════════════════════════════════════ */
export function LaunchGate({ children }: { children: React.ReactNode }) {
  const [scene,    setScene]   = useState<Scene>('LOADING')
  const [isClient, setClient]  = useState(false)
  const [time,     setTime]    = useState({ h: 0, m: 0, s: 0 })
  const [tension,  setTension] = useState(0)          // 0-1
  const [flip,     setFlip]    = useState({ h: false, m: false, s: false })
  const [progress, setProgress] = useState(0)
  const [rings,    setRings]   = useState(false)       // energy rings visible

  // DOM refs
  const sceneForgeRef  = useRef<HTMLDivElement>(null)
  const sceneHeroRef   = useRef<HTMLDivElement>(null)
  const sceneEmergeRef = useRef<HTMLDivElement>(null)
  const sceneFreezeRef = useRef<HTMLDivElement>(null)
  const panelsRef      = useRef<HTMLDivElement>(null)
  const forgeCanvasRef = useRef<HTMLCanvasElement>(null)
  const forgeSparkRef  = useRef<HTMLDivElement>(null)
  const forgeCircleRef = useRef<HTMLDivElement>(null)
  const logoHeroRef    = useRef<HTMLDivElement>(null)
  const heroWordmarkRef = useRef<HTMLDivElement>(null)
  const emergeLogo     = useRef<HTMLDivElement>(null)
  const websiteRef     = useRef<HTMLDivElement>(null)
  const logoHeroImgRef = useRef<HTMLImageElement>(null)

  // Stable timer
  const [launchDate] = useState(() =>
    process.env.NEXT_PUBLIC_LAUNCH_DATE
      ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime()
      : Date.now() + 1000 * 40   // 40s demo
  )
  const [totalDuration] = useState(() =>
    process.env.NEXT_PUBLIC_LAUNCH_DATE
      ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime() - Date.now()
      : 1000 * 40
  )

  /* ═══════════════════════════════
     MASTER SEQUENCE: FREEZE → DONE
  ═══════════════════════════════ */
  const runSequence = useCallback(() => {

    // ── S3: FREEZE ──────────────────────────────────
    setScene('FREEZE')
    gsap.to(sceneFreezeRef.current, { opacity: 1, duration: 0.12, ease: 'power4.in' })

    const tl = gsap.timeline()

    // Hold black for 0.8s
    tl.to({}, { duration: 0.8 })

    // ── S4: FORGE ────────────────────────────────────
    tl.call(() => {
      setScene('FORGE')

      // Fade freeze screen out slowly (keep slightly dark behind forge)
      gsap.to(sceneFreezeRef.current, { opacity: 0, duration: 1.5, ease: 'power2.out' })

      // Show forge scene
      if (sceneForgeRef.current) {
        gsap.to(sceneForgeRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      }

      // ── Spark birth ──
      const spark = forgeSparkRef.current
      const circle = forgeCircleRef.current
      if (spark) {
        gsap.timeline()
          .fromTo(spark,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }
          )
          .to(spark, { scale: 3, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
      }

      // ── Energy circle expands from spark ──
      if (circle) {
        gsap.timeline()
          .fromTo(circle,
            { opacity: 0, width: '20px', height: '20px', marginLeft: '-10px', marginTop: '-10px' },
            { opacity: 1, duration: 0.2, ease: 'power2.out', delay: 0.3 }
          )
          .to(circle, {
            width: '300px', height: '300px',
            marginLeft: '-150px', marginTop: '-150px',
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1
          })
      }

      // ── Run particle canvas ──
      if (forgeCanvasRef.current) {
        runForgeAnimation(forgeCanvasRef.current, () => {
          // Logo emerges from particle convergence
          if (!logoHeroRef.current) return

          // Brief white flash at logo birth
          gsap.fromTo(sceneFreezeRef.current,
            { opacity: 0 },
            { opacity: 0.6, duration: 0.06, yoyo: true, repeat: 1, ease: 'power4.in' }
          )

          // Logo materializes — metallic, depth, orange glow
          gsap.fromTo(logoHeroRef.current,
            {
              opacity: 0,
              scale: 0.6,
              filter: 'blur(30px) brightness(6)',
            },
            {
              opacity: 1,
              scale: 1,
              filter: [
                'blur(0px)',
                'brightness(1.3)',
                'drop-shadow(0 0 60px rgba(232,68,10,1))',
                'drop-shadow(0 0 120px rgba(232,68,10,0.6))',
                'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
                'drop-shadow(-4px -4px 8px rgba(255,255,255,0.12))',  // highlight edge
              ].join(' '),
              duration: 2.2,
              ease: 'power3.out',
              onComplete: () => {
                // Settle filter
                gsap.to(logoHeroRef.current, {
                  filter: [
                    'blur(0px)',
                    'brightness(1)',
                    'drop-shadow(0 0 40px rgba(232,68,10,0.7))',
                    'drop-shadow(0 0 80px rgba(232,68,10,0.3))',
                    'drop-shadow(0 24px 48px rgba(0,0,0,0.85))',
                    'drop-shadow(-3px -3px 6px rgba(255,255,255,0.1))',
                  ].join(' '),
                  duration: 1.5,
                  ease: 'power2.out'
                })
                // Enable metallic sheen (CSS animation on ::before)
                if (logoHeroRef.current) {
                  logoHeroRef.current.style.setProperty('--sheen', '1')
                }
                if (logoHeroRef.current) {
                  ;(logoHeroRef.current as HTMLElement).querySelector('img')?.classList.add('logo-sheen')
                }
              }
            }
          )

          // Logo glow pulse (power beat)
          setTimeout(() => {
            if (!logoHeroRef.current) return
            gsap.timeline()
              .to(logoHeroRef.current, {
                filter: [
                  'blur(0px)',
                  'brightness(2)',
                  'drop-shadow(0 0 100px rgba(255,120,0,1))',
                  'drop-shadow(0 0 200px rgba(232,68,10,0.8))',
                  'drop-shadow(0 24px 48px rgba(0,0,0,0.9))',
                ].join(' '),
                scale: 1.03,
                duration: 0.5,
                ease: 'power3.out'
              })
              .to(logoHeroRef.current, {
                filter: [
                  'blur(0px)',
                  'brightness(1)',
                  'drop-shadow(0 0 40px rgba(232,68,10,0.7))',
                  'drop-shadow(0 0 80px rgba(232,68,10,0.3))',
                  'drop-shadow(0 24px 48px rgba(0,0,0,0.85))',
                  'drop-shadow(-3px -3px 6px rgba(255,255,255,0.1))',
                ].join(' '),
                scale: 1,
                duration: 1.2,
                ease: 'power2.out'
              })

            // Begin gentle float
            gsap.to(logoHeroRef.current, {
              y: -14,
              duration: 4,
              ease: 'power1.inOut',
              yoyo: true,
              repeat: -1,
              delay: 1.5
            })
          }, 3200)  // 2.2s materialise + 1s settle

          // ── S5: PANELS split ──────────────────────────────
          setTimeout(() => {
            setScene('PANELS')

            // Split panels away — alternating left/right
            const panels = panelsRef.current?.querySelectorAll('.reveal-panel')
            if (panels) {
              gsap.to(Array.from(panels).filter((_, i) => i % 2 === 0), {
                xPercent: -110,
                duration: 0.9,
                ease: 'power4.in',
                stagger: 0.06
              })
              gsap.to(Array.from(panels).filter((_, i) => i % 2 !== 0), {
                xPercent: 110,
                duration: 0.9,
                ease: 'power4.in',
                stagger: 0.06
              })
            }

            // ── S6: HERO SHOT ──────────────────────────────
            setTimeout(() => {
              setScene('HERO')
              gsap.to(sceneHeroRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' })

              // Copy logo position/size to hero scene (logo is already in forge scene, which stays)
              // Show CS VERTEX wordmark
              setTimeout(() => {
                if (heroWordmarkRef.current) {
                  gsap.fromTo(heroWordmarkRef.current,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
                  )
                }

                // ── S7: EMERGE ──────────────────────────────
                setTimeout(() => {
                  setScene('EMERGE')
                  if (sceneEmergeRef.current) {
                    sceneEmergeRef.current.classList.add('active')
                  }

                  // Logo travels up — hero moment becomes header
                  if (emergeLogo.current) {
                    // Start at center
                    gsap.set(emergeLogo.current, {
                      top: '50%',
                      y: '-50%',
                      opacity: 1,
                      scale: 1,
                    })

                    // Apple-style glide up
                    gsap.to(emergeLogo.current, {
                      top: '28px',
                      y: 0,
                      scale: 0.28,
                      duration: 2.6,
                      ease: 'power4.inOut',
                      delay: 0.5,
                    })
                  }

                  // Website content builds from below
                  if (websiteRef.current) {
                    gsap.to(websiteRef.current, {
                      opacity: 1,
                      duration: 2.2,
                      ease: 'power2.inOut',
                      delay: 1.4,
                      onComplete: () => {
                        // Fade the floating logo (real header logo takes over)
                        gsap.to(emergeLogo.current, {
                          opacity: 0,
                          duration: 0.6,
                          delay: 0.4,
                          ease: 'power2.in'
                        })
                        // Unlock
                        setTimeout(() => {
                          localStorage.setItem('csvertex_launch_seen', 'true')
                          setScene('DONE')
                          window.dispatchEvent(new Event('resize'))
                        }, 800)
                      }
                    })
                  }

                }, 4000)  // hero breathes 4s
              }, 1200)    // slight pause after panels open

            }, 1200)      // panels take 1.2s
          }, 4500)        // forge + logo settle = 4.5s
        })
      }
    })

  }, [])

  /* ═══════════════════════════════
     COUNTDOWN TIMER
  ═══════════════════════════════ */
  useEffect(() => {
    setClient(true)

    // DEV: always play
    const isDev = process.env.NODE_ENV === 'development'
    const seen  = isDev ? null : localStorage.getItem('csvertex_launch_seen')
    if (seen === 'true') { setScene('DONE'); return }

    const now = Date.now()
    if (now >= launchDate) {
      runSequence()
      return
    }

    setScene('WAIT')

    const RING_THRESHOLD = 15 * 1000   // final 15s → energy rings appear

    const tick = setInterval(() => {
      const dist = launchDate - Date.now()

      if (dist <= 0) {
        clearInterval(tick)
        runSequence()
        return
      }

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
    <div id="launch-root">

      {/* ══════════════════════════════════
          SCENE 1 & 2 — THE WAIT
      ══════════════════════════════════ */}
      {scene === 'WAIT' && (
        <div id="scene-wait">
          {/* Three.js network background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <NetworkScene intensity={tension} />
          </div>

          {/* Vignette */}
          <div className="vignette" />

          {/* Energy rings — Scene 2 */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'none' }}>
            {[500, 700, 900].map((sz, i) => (
              <div key={i} className={`energy-ring${rings ? ' active' : ''}`}
                style={{ width: sz, height: sz, top: '50%', left: '50%', marginLeft: -sz/2, marginTop: -sz/2, position: 'absolute', animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </div>

          {/* Logo watermark 5% opacity */}
          <img src="/assets/logo.png" alt="" className={`logo-watermark${rings ? ' s2' : ''}`} />

          {/* Content */}
          <div className="wait-content">
            <div className="wait-wordmark">CS Vertex</div>
            <div className="wait-sublabel">Launching In</div>

            <div className="countdown-cluster">
              {/* Hours */}
              <div className="cd-unit">
                <div className={`cd-glass ${tClass}`}>
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
                  <div className={`cd-num ${tClass}${flip.s ? ' flipping' : ''}`}>
                    {String(time.s).padStart(2, '0')}
                  </div>
                </div>
                <div className={`cd-label ${tClass}`}>Seconds</div>
              </div>
            </div>

            <div className="wait-bottom">
              csvertex.com &nbsp;·&nbsp; 2026
            </div>
          </div>

          {/* Progress */}
          <div className="wait-progress">
            <div className="wait-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          FREEZE OVERLAY (S3)
      ══════════════════════════════════ */}
      <div id="scene-freeze" ref={sceneFreezeRef} style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 100, opacity: 0, pointerEvents: 'none' }} />

      {/* ══════════════════════════════════
          SCENE 4 — LOGO FORGE (THE STAR)
      ══════════════════════════════════ */}
      <div id="scene-forge" ref={sceneForgeRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, opacity: 0, pointerEvents: 'none', background: '#080808' }}>

        {/* Network background still visible behind forge */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <NetworkScene intensity={0.15} />
        </div>

        {/* Particle canvas */}
        <canvas ref={forgeCanvasRef} id="forge-canvas" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

        {/* Initial spark */}
        <div ref={forgeSparkRef} className="forge-spark" style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: '-3px', marginTop: '-3px', opacity: 0, zIndex: 2 }} />

        {/* Energy circle */}
        <div ref={forgeCircleRef} className="forge-circle" style={{ position: 'absolute', top: '50%', left: '50%', opacity: 0, zIndex: 2 }} />

        {/* 3D Logo — appears from particle convergence */}
        <div ref={logoHeroRef} id="logo-hero-wrap" style={{ opacity: 0, position: 'relative', zIndex: 3 }}>
          <img
            ref={logoHeroImgRef}
            id="logo-hero-img"
            src="/assets/logo.png"
            alt="CS Vertex"
            style={{
              width: 'clamp(200px, 32vw, 480px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════
          SCENE 5 — DIGITAL PANELS
      ══════════════════════════════════ */}
      <div id="scene-panels" ref={panelsRef} style={{ position: 'absolute', inset: 0, zIndex: 300, pointerEvents: 'none' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="reveal-panel" />
        ))}
      </div>

      {/* ══════════════════════════════════
          SCENE 6 — HERO SHOT
          (Logo still in forge scene, hero adds wordmark)
      ══════════════════════════════════ */}
      <div id="scene-hero" ref={sceneHeroRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '38vh', zIndex: 400, opacity: 0, pointerEvents: 'none' }}>
        <div ref={heroWordmarkRef} className="hero-wordmark" style={{ opacity: 0 }}>
          CS Vertex
        </div>
      </div>

      {/* ══════════════════════════════════
          SCENE 7 — HOMEPAGE EMERGE
      ══════════════════════════════════ */}
      <div id="scene-emerge" ref={sceneEmergeRef} style={{ position: 'absolute', inset: 0, zIndex: 500, opacity: 0, pointerEvents: 'none' }}>

        {/* Floating logo that travels upward */}
        <div ref={emergeLogo} id="emerge-logo" style={{ position: 'fixed', left: '50%', opacity: 0 }}>
          <img src="/assets/logo.png" alt="CS Vertex"
            style={{ width: 'clamp(200px, 32vw, 480px)', height: 'auto', display: 'block',
              filter: 'drop-shadow(0 0 30px rgba(232,68,10,0.5))' }}
          />
        </div>

        {/* Website content */}
        <div ref={websiteRef} id="website-content" style={{ opacity: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
