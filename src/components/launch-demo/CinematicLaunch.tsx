'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import dynamic from 'next/dynamic'
import styles from './cinematic.module.css'
import { FullWebsiteData } from './FullWebsiteData'
import './badge.css'

const AmbientR3F = dynamic(() => import('./AmbientR3F'), { ssr: false })

/* ═══════════════════════════════════════════════════════════
   THE AWAKENING — UNIFIED CINEMATIC LAUNCH SEQUENCE V6.1
   ═══════════════════════════════════════════════════════════ */

type Phase =
  | 'P0'               // SSR guard
  | 'SILENCE'          // Phase 1: Countdown - minimal
  | 'ENERGY'           // Phase 1: Countdown - energy buildup
  | 'FINAL_COUNTDOWN'  // Phase 2: Last 10s countdown
  | 'MYSTERY'          // Phase 1: Spotlight, rotating red velvet wrapped logo (4s)
  | 'AWAKENING'        // Phase 2: Orange light leak, orbit rings (3s)
  | 'RELEASE'          // Phase 3: Velvet cloth unwraps & floats away (4s)
  | 'LOGO_REVEAL'      // Phase 4: Logo wireframe -> metal -> full texture, sweeps (3s)
  | 'HERO'             // Phase 5: Rear energy ring ignites, camera pushes, text overlay (3s)
  | 'ENTRY'            // Phase 6: Smooth fade into homepage (2.5s)
  | 'DONE'             // Website active

const DEMO_MS = 60_000
const ENERGY_AT = 30_000

function getPhase(rem: number): Phase {
  if (rem > ENERGY_AT) return 'SILENCE'
  return 'ENERGY'
}

function getTension(rem: number): number {
  if (rem >= DEMO_MS) return 0
  if (rem <= 0) return 1
  return Math.pow(1 - rem / DEMO_MS, 0.55)
}

/* ─────────────────────────────────────────────────────────
   AUDIO ENGINE
   ───────────────────────────────────────────────────────── */
class AudioEngine {
  private ctx: AudioContext | null = null

  init() {
    if (!this.ctx) {
      try { this.ctx = new AudioContext() } catch { /* blocked */ }
    }
  }

  beat(freq = 55, dur = 0.65, vol = 0.75) {
    if (!this.ctx) return
    const ac = this.ctx
    if (ac.state === 'suspended') ac.resume()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.25, ac.currentTime + dur)
    gain.gain.setValueAtTime(vol, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
    osc.connect(gain); gain.connect(ac.destination)
    osc.start(); osc.stop(ac.currentTime + dur)
  }

  impact() {
    this.beat(75, 3.0, 0.95)
    if (!this.ctx) return
    const ac = this.ctx
    const buf = ac.createBuffer(1, ac.sampleRate * 0.1, ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 400)
    const src = ac.createBufferSource()
    const g = ac.createGain()
    src.buffer = buf; g.gain.value = 0.55
    src.connect(g); g.connect(ac.destination)
    src.start()
  }
}

const audio = new AudioEngine()

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    return false
  }
}

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: () => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL error caught by boundary:", error, errorInfo)
    this.props.fallback()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
interface CinematicLaunchProps {
  initialData: {
    services: any[]
    projects: any[]
    team: any[]
    announcements: any[]
    testimonials: any[]
  }
}

export function CinematicLaunch({ initialData }: CinematicLaunchProps) {
  const [phase, setPhase] = useState<Phase>('P0')
  const [tension, setTension] = useState(0)
  const [dhms, setDhms] = useState({ d: 0, h: 0, m: 1, s: 30 })
  const [muted, setMuted] = useState(true)

  /* Test mode state */
  const [testMode, setTestMode] = useState(false)

  /* Debug Mode Stage Toggles — Logo Revival Experience enabled by default */
  const [enableFinalCountdown, setEnableFinalCountdown] = useState(false)
  const [enableLogoReveal, setEnableLogoReveal] = useState(true)
  const [enableThreeJS, setEnableThreeJS] = useState(true)

  /* Error and Watchdog tracking states */
  const [watchdogError, setWatchdogError] = useState<string | null>(null)
  const [stageError, setStageError] = useState<string | null>(null)
  const [mountError, setMountError] = useState<string | null>(null)

  /* Subscription form and access badge states */
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [badgeId, setBadgeId] = useState('')

  /* WebGL Readiness & Fallback states */
  const [webglSupported, setWebglSupported] = useState(true)
  const [canvasReady, setCanvasReady] = useState(false)
  const [canvasFallbackActive, setCanvasFallbackActive] = useState(false)

  const canvasReadyRef = useRef(false)
  const countdownEndedRef = useRef(false)
  const launchedRef = useRef(false)
  const canvasTimeoutRef = useRef<{ clear: () => void; start: () => void } | null>(null)

  const stage3LoggedRef = useRef(false)
  const stage5LoggedRef = useRef(false)
  const stage6LoggedRef = useRef(false)

  /* Three.js transition uniforms driven by GSAP */
  const [logoProgress, setLogoProgress] = useState(0)
  const [logoEmissive, setLogoEmissive] = useState(0)
  const [logoWireframe, setLogoWireframe] = useState(0)
  const [logoMetal, setLogoMetal] = useState(0)
  const [cameraOrbit, setCameraOrbit] = useState(0)
  const [cameraTravel, setCameraTravel] = useState(0)
  const [coreScale, setCoreScale] = useState(0)
  const [gateOpen, setGateOpen] = useState(0)
  const [countdownValue, setCountdownValue] = useState(10)
  const [logoElevate, setLogoElevate] = useState(0)

  /* Logo Revival Experience state variables */
  const [clothProgress, setClothProgress] = useState(0)
  const [lightLeak, setLightLeak] = useState(0)
  const [ringProgress, setRingProgress] = useState(0)
  const [spotlightIntensity, setSpotlightIntensity] = useState(0)

  const launchTs = useRef(0)
  const prevPhase = useRef<Phase>('P0')
  const mutedRef = useRef(true)
  const zoomRef = useRef<gsap.core.Tween | null>(null)

  /* helper functions for custom debug transitions */
  const getNextPhase = useCallback((current: Phase): Phase => {
    if (current === 'P0') return 'SILENCE'
    if (current === 'SILENCE' || current === 'ENERGY') {
      if (enableFinalCountdown) return 'FINAL_COUNTDOWN'
      return 'MYSTERY'
    }
    if (current === 'FINAL_COUNTDOWN') return 'MYSTERY'
    if (current === 'MYSTERY') return 'AWAKENING'
    if (current === 'AWAKENING') return 'RELEASE'
    if (current === 'RELEASE') return 'LOGO_REVEAL'
    if (current === 'LOGO_REVEAL') return 'HERO'
    if (current === 'HERO') return 'ENTRY'
    if (current === 'ENTRY') return 'DONE'
    return 'DONE'
  }, [enableFinalCountdown])

  const getStageLabel = () => {
    if (phase === 'P0') return 'LOADING ASSETS'
    if (phase === 'SILENCE' || phase === 'ENERGY') return 'COUNTDOWN ACTIVE'
    if (phase === 'FINAL_COUNTDOWN') return 'FINAL SEQUENCE'
    if (phase === 'MYSTERY') return 'MYSTERY (PHASE 1)'
    if (phase === 'AWAKENING') return 'ENERGY AWAKENING (PHASE 2)'
    if (phase === 'RELEASE') return 'CLOTH RELEASE (PHASE 3)'
    if (phase === 'LOGO_REVEAL') return 'LOGO REVEAL (PHASE 4)'
    if (phase === 'HERO') return 'HERO MOMENT (PHASE 5)'
    if (phase === 'ENTRY') return 'WEBSITE ENTRY (PHASE 6)'
    if (phase === 'DONE') return 'COMPLETED'
    return 'UNKNOWN'
  }

  // Log Stage 1 on mount
  useEffect(() => {
    try {
      // Stage 1 Log removed
    } catch (err: any) {
      setMountError(err?.message || String(err))
    }
  }, [])

  useEffect(() => {
    // Client-side mount fallback to ensure we never stay on black screen in P0
    const timer = setTimeout(() => {
      if (phase === 'P0') {
        console.warn("[STAGE 1] Client mounted but phase stuck in P0. Forcing SILENCE.");
        setPhase('SILENCE');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Watchdog Timer ──
  useEffect(() => {
    if (phase === 'P0' || phase === 'SILENCE' || phase === 'ENERGY' || phase === 'DONE') {
      setWatchdogError(null)
      return
    }

    let timeoutMs = 4000
    if (phase === 'FINAL_COUNTDOWN') {
      timeoutMs = 13000
    } else if (phase === 'MYSTERY') {
      timeoutMs = 5000
    } else if (phase === 'AWAKENING') {
      timeoutMs = 4000
    } else if (phase === 'RELEASE') {
      timeoutMs = 5000
    } else if (phase === 'LOGO_REVEAL') {
      timeoutMs = 4000
    } else if (phase === 'HERO') {
      timeoutMs = 4000
    } else if (phase === 'ENTRY') {
      timeoutMs = 3500
    }

    // Log Watchdog removed

    const timer = setTimeout(() => {
      const next = getNextPhase(phase)
      const errMsg = `Stage "${phase}" failed/timed out. Auto-skipped to "${next}".`
      console.warn(`[WATCHDOG] ${errMsg}`)
      setWatchdogError(errMsg)
      setPhase(next)
    }, timeoutMs)

    return () => clearTimeout(timer)
  }, [phase, getNextPhase])

  // ── Stage Logging ──
  useEffect(() => {
    if (phase === 'P0') return

    if (phase === 'SILENCE' || phase === 'ENERGY') {
      // Stage 2 Log removed
    }
    
    // Log Countdown Finished exactly once when leaving counting states
    if (['FINAL_COUNTDOWN', 'MYSTERY', 'AWAKENING', 'RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY', 'DONE'].includes(phase) && !stage3LoggedRef.current) {
      stage3LoggedRef.current = true
      // Stage 3 Log removed
    }

    if (phase === 'FINAL_COUNTDOWN') {
      // Stage 4 Log removed
    }

    if (phase === 'RELEASE' && !stage5LoggedRef.current) {
      stage5LoggedRef.current = true
      // Stage 5 Log removed
    }

    if (phase === 'LOGO_REVEAL' && !stage6LoggedRef.current) {
      stage6LoggedRef.current = true
      // Stage 6 Log removed
    }

    if (phase === 'HERO' && !stage6LoggedRef.current) {
      // Stage 7 Log removed
    }

    if (phase === 'DONE') {
      // Stage 8 Log removed
    }
  }, [phase])

  /* DOM refs */
  const rootRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const shockRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const websiteRef = useRef<HTMLDivElement>(null)
  const ambCvsRef = useRef<HTMLCanvasElement>(null)
  const hologramGridRef = useRef<HTMLDivElement>(null)
  const laserScanlineRef = useRef<HTMLDivElement>(null)
  const scanCircleRef = useRef<HTMLDivElement>(null)
  const hudHeaderRef = useRef<HTMLDivElement>(null)
  const hudPanelLeftRef = useRef<HTMLDivElement>(null)
  const hudPanelRightRef = useRef<HTMLDivElement>(null)
  const hudDialRef = useRef<HTMLDivElement>(null)

  /* Curtains refs */
  const curtainLeftRef = useRef<HTMLDivElement>(null)
  const curtainRightRef = useRef<HTMLDivElement>(null)

  /* Terminal lines typing animation state */
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  useEffect(() => { mutedRef.current = muted }, [muted])

  /* ─────────────────────────────────────────────────────────
     TYPING TERMINAL (Phase 1: Pre-Launch)
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'SILENCE' && phase !== 'ENERGY') return
    const lines = [
      'INITIALIZING CS VERTEX...',
      'LOADING DIGITAL INFRASTRUCTURE...',
      'ACTIVATING AI SYSTEMS...',
      'PREPARING LAUNCH SEQUENCE...'
    ]
    let currentLineIdx = 0
    let currentCharIdx = 0
    let tempLines: string[] = []

    const interval = setInterval(() => {
      if (currentLineIdx >= lines.length) {
        clearInterval(interval)
        return
      }

      const line = lines[currentLineIdx]
      if (currentCharIdx === 0) {
        tempLines.push('')
      }

      tempLines[currentLineIdx] = line.slice(0, currentCharIdx + 1)
      setTerminalLines([...tempLines])

      currentCharIdx++
      if (currentCharIdx >= line.length) {
        currentLineIdx++
        currentCharIdx = 0
      }
    }, 55)

    return () => clearInterval(interval)
  }, [phase])

  /* ─────────────────────────────────────────────────────────
     AMBIENT LIGHT-RAY CANVAS (Countdown)
     ───────────────────────────────────────────────────────── */
  const tensionRef = useRef(0)
  useEffect(() => { tensionRef.current = tension }, [tension])

  useEffect(() => {
    const cvs = ambCvsRef.current
    if (!cvs || phase === 'P0' || phase === 'DONE') return
    const ctx = cvs.getContext('2d')!
    let raf = 0

    const resize = () => { if (cvs) { cvs.width = innerWidth; cvs.height = innerHeight } }
    resize()
    window.addEventListener('resize', resize)

    interface Ray {
      x: number; y: number; vx: number; vy: number
      w: number; h: number; alpha: number; color: string
      life: number; maxLife: number; stream: boolean
    }
    const pool: Ray[] = []

    const spawn = (): Ray => ({
      x: Math.random() * cvs.width,
      y: cvs.height + 10,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.45 + 0.12),
      w: 0.5 + Math.random() * 1.4,
      h: 10 + Math.random() * 28,
      alpha: 0.035 + Math.random() * 0.08,
      color: Math.random() < 0.4 ? '#E8440A' : '#fff',
      life: 0,
      maxLife: 130 + Math.random() * 160,
      stream: false,
    })

    for (let i = 0; i < 70; i++) {
      const r = spawn(); r.y = Math.random() * cvs.height; pool.push(r)
    }

    const draw = () => {
      const t = tensionRef.current
      if (!cvs) return
      ctx.clearRect(0, 0, cvs.width, cvs.height)

      const isEnergy = t > 0.35
      const target = Math.floor(70 + t * 220)
      while (pool.length < target) {
        const r = spawn()
        r.stream = isEnergy && Math.random() < 0.65
        if (r.stream) { r.vy *= 2.8; r.h *= 3.5; r.alpha *= 1.5 }
        pool.push(r)
      }
      while (pool.length > target + 30) pool.pop()

      const spd = 1 + t * 3.5

      pool.forEach(r => {
        r.x += r.vx * spd; r.y += r.vy * spd; r.life++
        if (r.life > r.maxLife || r.y < -r.h * 2) {
          const n = spawn()
          n.stream = isEnergy && Math.random() < 0.6
          if (n.stream) { n.vy *= 2.8; n.h *= 3.5; n.alpha *= 1.5 }
          Object.assign(r, n)
        }
        const fi = Math.min(1, r.life / 45)
        const fo = Math.min(1, (r.maxLife - r.life) / 45)
        const g = ctx.createLinearGradient(0, r.y - r.h, 0, r.y + r.h)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.5, r.color)
        g.addColorStop(1, 'transparent')
        ctx.save()
        ctx.translate(r.x, r.y)
        ctx.globalAlpha = r.alpha * fi * fo * (0.35 + t * 0.65)
        ctx.fillStyle = g
        ctx.fillRect(-r.w / 2, -r.h, r.w, r.h * 2)
        ctx.restore()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [phase])

  /* ─────────────────────────────────────────────────────────
     UNIFIED TIMELINE FLOW
     ───────────────────────────────────────────────────────── */
  /* ─────────────────────────────────────────────────────────
     UNIFIED TIMELINE FLOW
     ───────────────────────────────────────────────────────── */
  // ── Unified State Machine Transition Logic ──
  useEffect(() => {
    if (phase === 'P0' || phase === 'SILENCE' || phase === 'ENERGY' || phase === 'DONE') {
      return
    }

    // Stage Machine Log removed

    let timer: NodeJS.Timeout

    if (phase === 'FINAL_COUNTDOWN') {
      let count = 10
      setCountdownValue(count)
      
      const interval = setInterval(() => {
        count--
        if (count >= 1) {
          setCountdownValue(count)
          // Beat pulse & shake
          if (!mutedRef.current) {
            audio.beat(55 + (10 - count) * 8, 0.4, 0.95)
          }
          // Shake container
          const shakeAmp = (11 - count) * 2.5
          gsap.timeline()
            .to(rootRef.current, { x: -shakeAmp, y: shakeAmp * 0.5, duration: 0.03, ease: 'none' })
            .to(rootRef.current, { x: shakeAmp, y: -shakeAmp * 0.5, duration: 0.03 })
            .to(rootRef.current, { x: -shakeAmp * 0.5, y: shakeAmp * 0.2, duration: 0.03 })
            .to(rootRef.current, { x: 0, y: 0, duration: 0.03 })

          if (flashRef.current) {
            gsap.fromTo(flashRef.current,
              { backgroundColor: 'rgba(232, 68, 10, 0.45)', opacity: 1 },
              { opacity: 0, duration: 0.35, ease: 'power2.out' }
            )
          }
          setTension((11 - count) / 10)
        } else {
          clearInterval(interval)
          // Transition to next stage
          const next = getNextPhase('FINAL_COUNTDOWN')
          setPhase(next)
        }
      }, 1000)

      return () => clearInterval(interval)
    }

    if (phase === 'MYSTERY') {
      // Screen goes dark, spotlight appears, Stage visible. Rotating cloth floating.
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0.85 })
      if (!mutedRef.current) audio.beat(45, 3.5, 0.6)

      // Reset uniforms
      setClothProgress(0)
      setLightLeak(0)
      setRingProgress(0)
      setLogoProgress(0)
      setLogoMetal(0)
      setLogoEmissive(0)
      setCameraTravel(0)

      const spotObj = { val: 0 }
      gsap.to(spotObj, {
        val: 1.0,
        duration: 2.0,
        ease: 'power2.out',
        onUpdate: () => setSpotlightIntensity(spotObj.val)
      })

      if (canvasFallbackActive) {
        gsap.fromTo(".launch-fallback-logo",
          { opacity: 0, scale: 0.7, filter: 'blur(30px)' },
          { opacity: 0.15, scale: 0.75, filter: 'blur(15px)', duration: 3.5 }
        )
      }

      timer = setTimeout(() => {
        setPhase('AWAKENING')
      }, 4000) // 4 seconds duration
    }

    if (phase === 'AWAKENING') {
      // Orange energy glowing underneath, light leaks, orbiting rings.
      if (!mutedRef.current) {
        audio.beat(55, 1.2, 0.7)
        setTimeout(() => audio.beat(60, 1.2, 0.8), 1000)
        setTimeout(() => audio.beat(65, 1.2, 0.9), 2000)
      }

      const leakObj = { val: 0 }
      gsap.to(leakObj, {
        val: 1.0,
        duration: 3.0,
        ease: 'power1.inOut',
        onUpdate: () => setLightLeak(leakObj.val)
      })

      if (canvasFallbackActive) {
        gsap.to(".launch-fallback-logo", {
          opacity: 0.35,
          filter: 'blur(8px) drop-shadow(0 0 15px rgba(232, 68, 10, 0.5))',
          duration: 3.0
        })
      }

      timer = setTimeout(() => {
        setPhase('RELEASE')
      }, 3000) // 3 seconds duration
    }

    if (phase === 'RELEASE') {
      // Velvet cloth unwraps slowly, flows outward, fades away.
      if (!mutedRef.current) audio.beat(70, 2.5, 0.8)

      const clothObj = { val: 0 }
      gsap.to(clothObj, {
        val: 1.0,
        duration: 4.0,
        ease: 'power3.inOut',
        onUpdate: () => setClothProgress(clothObj.val)
      })

      // As cloth moves away, start resolving logo edges/wireframe
      const logoWireObj = { val: 0 }
      gsap.to(logoWireObj, {
        val: 1.0,
        duration: 3.0,
        delay: 1.0,
        ease: 'power2.out',
        onUpdate: () => setLogoProgress(logoWireObj.val)
      })

      if (canvasFallbackActive) {
        gsap.to(".launch-fallback-logo", {
          opacity: 0.65,
          scale: 0.9,
          filter: 'blur(3px) drop-shadow(0 0 25px rgba(232, 68, 10, 0.7))',
          duration: 4.0,
          ease: 'power2.inOut'
        })
      }

      timer = setTimeout(() => {
        setPhase('LOGO_REVEAL')
      }, 4000) // 4 seconds duration
    }

    if (phase === 'LOGO_REVEAL') {
      // Metallic surfaces form, reflection sweep, orange glow, bloom, particles
      if (!mutedRef.current) audio.beat(85, 2.0, 0.95)

      const revealObj = { metal: 0, emissive: 0 }
      gsap.timeline()
        .to(revealObj, {
          metal: 1.0,
          emissive: 3.5,
          duration: 2.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            setLogoMetal(revealObj.metal)
            setLogoEmissive(revealObj.emissive)
          }
        })
        .to(revealObj, {
          emissive: 1.0, // Settle glow
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => setLogoEmissive(revealObj.emissive)
        })

      if (canvasFallbackActive) {
        gsap.to(".launch-fallback-logo", {
          opacity: 1.0,
          scale: 1.0,
          filter: 'blur(0px) drop-shadow(0 0 35px rgba(232, 68, 10, 0.9))',
          duration: 2.2,
          ease: 'power2.inOut'
        })
      }

      timer = setTimeout(() => {
        setPhase('HERO')
      }, 3000) // 3 seconds duration
    }

    if (phase === 'HERO') {
      // Energy ring ignites, light rays spread, camera pushes in, title overlay displays
      if (!mutedRef.current) audio.impact()

      if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0.05, duration: 2.0 })

      const heroObj = { ring: 0, zoom: 0 }
      gsap.to(heroObj, {
        ring: 1.0,
        zoom: 1.0,
        duration: 3.0,
        ease: 'power2.out',
        onUpdate: () => {
          setRingProgress(heroObj.ring)
          setCameraTravel(heroObj.zoom)
        }
      })

      if (canvasFallbackActive) {
        gsap.to(".launch-fallback-logo", {
          scale: 1.15,
          duration: 3.0,
          ease: 'power2.out'
        })
      }

      timer = setTimeout(() => {
        setPhase('ENTRY')
      }, 3000) // 3 seconds duration
    }

    if (phase === 'ENTRY') {
      // Glow fades, smooth transition to homepage. No black screen.
      const entryObj = { emissive: logoEmissive }
      gsap.to(entryObj, {
        emissive: 0,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => setLogoEmissive(entryObj.emissive)
      })

      if (websiteRef.current) {
        websiteRef.current.style.pointerEvents = 'all'
        gsap.to(websiteRef.current, { opacity: 1, duration: 2.5, ease: 'power2.out' })
        
        const revealTl = gsap.timeline()
        revealTl.fromTo('.top-utility-bar', 
          { y: -50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' }
        )
        revealTl.fromTo('header', 
          { y: -50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 
          '-=0.8'
        )
        revealTl.fromTo('.hero-copy h1', 
          { y: 55, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' }, 
          '-=0.6'
        )
        revealTl.fromTo('.hero-copy .hero-lede', 
          { y: 35, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 
          '-=1.2'
        )
      }

      if (flashRef.current) {
        gsap.to(flashRef.current, { opacity: 0, duration: 1.5, ease: 'power2.out' })
      }

      timer = setTimeout(() => {
        try {
          localStorage.setItem('csv_launch_seen', '1')
        } catch (e) {
          console.warn("localStorage block:", e)
        }
        setPhase('DONE')
      }, 2500) // 2.5 seconds duration
    }

    return () => clearTimeout(timer)
  }, [phase, getNextPhase, canvasFallbackActive])

  const fallbackToLogoReveal = useCallback(() => {
    console.warn("3D assets failed - falling back to Logo Reveal")
    setCanvasFallbackActive(true)
    if (!launchedRef.current) {
      launchedRef.current = true
      countdownEndedRef.current = true
      const next = getNextPhase(phase)
      setPhase(next)
    }
  }, [phase, getNextPhase])

  const triggerLaunchFlow = useCallback(() => {
    if (launchedRef.current) return
    launchedRef.current = true
    countdownEndedRef.current = true

    const hasWebGL = enableThreeJS && isWebGLSupported()
    setWebglSupported(hasWebGL)

    const start = (isFallback: boolean) => {
      if (isFallback) {
        setCanvasFallbackActive(true)
      }
      const next = getNextPhase(phase)
      // T=0 Log removed
      setPhase(next)
    }

    if (!hasWebGL) {
      start(true)
    } else if (canvasReadyRef.current) {
      start(false)
    } else {
      const timeoutId = setTimeout(() => {
        console.warn("WebGL canvas not ready - forcing continue")
        start(true)
      }, 2000)

      canvasTimeoutRef.current = {
        clear: () => clearTimeout(timeoutId),
        start: () => start(false)
      }
    }
  }, [phase, getNextPhase, enableThreeJS])

  const handleCanvasReady = useCallback(() => {
    canvasReadyRef.current = true
    setCanvasReady(true)
    if (countdownEndedRef.current && canvasTimeoutRef.current) {
      canvasTimeoutRef.current.clear()
      canvasTimeoutRef.current.start()
      canvasTimeoutRef.current = null
    }
  }, [])

  /* ─────────────────────────────────────────────────────────
     COUNTDOWN TICKER TIMER (Resets and triggers on testMode change)
     ───────────────────────────────────────────────────────── */
  useEffect(() => {
    let seen = null
    try {
      seen = localStorage.getItem('csv_launch_seen')
    } catch (e) {
      console.warn("localStorage block:", e)
    }
    // Only bypass if not in testMode
    if (seen && !testMode) { setPhase('DONE'); return }

    // Official Target: 24 June 2026 at 2:00 PM IST
    // Month is 0-indexed (5 = June), 2:00 PM IST is 8:30 AM UTC.
    const launchTargetTs = testMode 
      ? Date.now() + 15_000 
      : Date.UTC(2026, 5, 24, 8, 30, 0)

    launchTs.current = launchTargetTs
    setPhase('SILENCE')
    prevPhase.current = 'SILENCE'
    launchedRef.current = false
    countdownEndedRef.current = false

    let launched = false

    const id = setInterval(() => {
      const rem = launchTs.current - Date.now()

      // When countdown gets down to 10 seconds remaining, trigger Phase 2!
      if (rem <= 10_000) {
        clearInterval(id)
        if (!launched) {
          launched = true
          triggerLaunchFlow()
        }
        return
      }

      const d = Math.floor(rem / 86_400_000)
      const h = Math.floor((rem % 86_400_000) / 3_600_000)
      const m = Math.floor((rem % 3_600_000) / 60_000)
      const s = Math.floor((rem % 60_000) / 1_000)
      
      // Guard against NaN
      if (!isNaN(d) && !isNaN(h) && !isNaN(m) && !isNaN(s)) {
        setDhms({ d, h, m, s })
      }
      
      const tensionVal = getTension(rem)
      if (!isNaN(tensionVal)) {
        setTension(tensionVal)
      }

      const p = getPhase(rem)

      if (p === 'ENERGY' && prevPhase.current !== 'ENERGY') {
        if (rootRef.current) {
          zoomRef.current?.kill()
          zoomRef.current = gsap.to(rootRef.current, {
            scale: 1.055, duration: 40, ease: 'power1.in'
          })
        }
      }

      if (p !== prevPhase.current) {
        prevPhase.current = p
        setPhase(p)
      }
    }, 100)

    return () => clearInterval(id)
  }, [testMode, triggerLaunchFlow])

  /* ─────────────────────────────────────────────────────────
     NOTIFY FORM SUBMISSION
     ───────────────────────────────────────────────────────── */
  const handleNotify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return

    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (response.ok) {
        setSubmitted(true)
        const randomNum = Math.floor(Math.random() * 9000) + 1000
        setBadgeId(`CSV-2026-${randomNum}`)
        setShowBadgeModal(true)
        
        setTimeout(() => {
          setEmail('')
          setSubmitted(false)
        }, 3000)
      } else {
        alert('Subscription failed. Please check details.')
      }
    } catch (err) {
      console.error(err)
      alert('Subscription failed. Please try again.')
    }
  }, [email])

  const fmt = (n: number) => String(n).padStart(2, '0')
  const isCounting = phase === 'SILENCE' || phase === 'ENERGY'

  // Render developer controls floating toolbar
  const renderDemoPanel = () => (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 99999,
      background: 'rgba(10, 10, 10, 0.85)',
      border: '1px solid rgba(232, 68, 10, 0.3)',
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backdropFilter: 'blur(10px)',
      fontFamily: 'monospace',
      fontSize: '11px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      pointerEvents: 'all'
    }}>
      <div style={{ fontWeight: 'bold', color: '#E8440A', letterSpacing: '0.1em' }}>LAUNCH DEBUG TOOLBAR</div>
      
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff' }}>
        <input
          type="checkbox"
          checked={testMode}
          onChange={(e) => {
            try {
              localStorage.removeItem('csv_launch_seen')
            } catch (err) {}
            setTestMode(e.target.checked)
          }}
          style={{ accentColor: '#E8440A', cursor: 'pointer' }}
        />
        TEST MODE (15s Countdown)
      </label>

      {/* STAGE ENABLE CHECKBOX TOGGLES */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#aaa', fontSize: '10px' }}>
          <input
            type="checkbox"
            checked={enableFinalCountdown}
            onChange={(e) => setEnableFinalCountdown(e.target.checked)}
            style={{ accentColor: '#E8440A', cursor: 'pointer' }}
          />
          Enable Final 10 Seconds
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#aaa', fontSize: '10px' }}>
          <input
            type="checkbox"
            checked={enableLogoReveal}
            onChange={(e) => {
              setEnableLogoReveal(e.target.checked)
              if (e.target.checked) setEnableThreeJS(true)
            }}
            style={{ accentColor: '#E8440A', cursor: 'pointer' }}
          />
          Enable Logo Revival
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#aaa', fontSize: '10px' }}>
          <input
            type="checkbox"
            checked={enableThreeJS}
            onChange={(e) => setEnableThreeJS(e.target.checked)}
            style={{ accentColor: '#E8440A', cursor: 'pointer' }}
          />
          Enable Three.js WebGL
        </label>
      </div>

      <button
        onClick={() => {
          try {
            localStorage.removeItem('csv_launch_seen')
          } catch (err) {}
          location.reload()
        }}
        style={{
          background: 'rgba(232, 68, 10, 0.15)',
          border: '1px solid rgba(232, 68, 10, 0.4)',
          color: '#fff',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '10px',
          marginTop: '4px'
        }}
      >
        Reset / Replay Keynote
      </button>
    </div>
  )

  // Render status diagnostic HUD on screen
  const renderDebugHUD = () => (
    <div style={{
      position: 'fixed',
      top: '25px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999999,
      background: 'rgba(10, 10, 10, 0.95)',
      border: '2px solid #E8440A',
      borderRadius: '8px',
      padding: '12px 20px',
      fontFamily: 'monospace',
      color: '#fff',
      boxShadow: '0 0 35px rgba(232, 68, 10, 0.45)',
      textAlign: 'center',
      minWidth: '340px',
      pointerEvents: 'none',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ color: '#E8440A', fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.12em', marginBottom: '6px' }}>
        SYSTEM DIAGNOSTIC DISPLAY
      </div>
      <div style={{ fontSize: '12px', margin: '4px 0', textTransform: 'uppercase' }}>
        STAGE: <span style={{ color: '#FF7A30', fontWeight: 'bold' }}>{getStageLabel()}</span>
      </div>
      <div style={{ fontSize: '10px', color: '#888' }}>
        PHASE ID: <span style={{ color: '#aaa' }}>{phase}</span> | TEST MODE: <span style={{ color: testMode ? '#33ff33' : '#ff3333' }}>{testMode ? 'ON (15s)' : 'OFF'}</span>
      </div>
      
      <div style={{ fontSize: '9px', color: '#666', marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <span>Final 10s: {enableFinalCountdown ? 'ON' : 'OFF'}</span>
        <span>Logo Revival: {enableLogoReveal ? 'ON' : 'OFF'}</span>
        <span>WebGL: {enableThreeJS ? 'ON' : 'OFF'}</span>
      </div>

      {watchdogError && (
        <div style={{ color: '#ff3333', fontSize: '10px', marginTop: '6px', fontWeight: 'bold', borderTop: '1px solid rgba(255,50,50,0.2)', paddingTop: '4px' }}>
          ⚠️ WATCHDOG SKIP: {watchdogError}
        </div>
      )}

      {stageError && (
        <div style={{ color: '#ff3333', fontSize: '10px', marginTop: '6px', fontWeight: 'bold', borderTop: '1px solid rgba(255,50,50,0.2)', paddingTop: '4px' }}>
          ❌ ERROR: {stageError}
        </div>
      )}

      {mountError && (
        <div style={{ color: '#ff3333', fontSize: '10px', marginTop: '6px', fontWeight: 'bold', borderTop: '1px solid rgba(255,50,50,0.2)', paddingTop: '4px' }}>
          ⚠️ MOUNT EXCEPTION: {mountError}
        </div>
      )}
    </div>
  )

  // If phase is DONE, completely replace layout with the actual interactive site
  if (phase === 'DONE') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: '#030303' }}>
        <FullWebsiteData data={initialData} />
        {renderDemoPanel()}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ '--t': tension } as React.CSSProperties}
    >
      {/* early render of black fallback overlay if phase is P0 */}
      {phase === 'P0' && <div className={styles.black} />}

      {/* City Skyline Background (Phase 1) */}
      {isCounting && (
        <div className={styles.cityBgContainer}>
          <img src="/assets/city-skyline-bg.png" alt="" className={styles.cityBg} />
          <div className={styles.cityBgDarkOverlay} />
        </div>
      )}

      {/* Ambient light-ray canvas */}
      <canvas ref={ambCvsRef} className={styles.ambCvs} />

      {/* Futuristic Holographic Laser Reveal */}
      <div ref={hologramGridRef} className={styles.hologramGrid} />
      <div ref={laserScanlineRef} className={styles.laserScanline} />
      <div ref={scanCircleRef} className={styles.scanCircle} />

      {/* 3D WebGL scene */}
      {enableThreeJS && webglSupported && !canvasFallbackActive && (
        <div className={styles.r3fWrap}>
          <WebGLErrorBoundary fallback={fallbackToLogoReveal}>
            <AmbientR3F
              tension={tension}
              phase={phase}
              logoProgress={logoProgress}
              logoEmissive={logoEmissive}
              logoWireframe={logoWireframe}
              logoMetal={logoMetal}
              cameraOrbit={cameraOrbit}
              cameraTravel={cameraTravel}
              coreScale={coreScale}
              gateOpen={gateOpen}
              logoElevate={logoElevate}
              countdownValue={countdownValue}
              clothProgress={clothProgress}
              lightLeak={lightLeak}
              ringProgress={ringProgress}
              spotlightIntensity={spotlightIntensity}
              onReady={handleCanvasReady}
            />
          </WebGLErrorBoundary>
        </div>
      )}

      {/* Fallback 2D Logo Reveal if WebGL fails */}
      {enableLogoReveal && (!webglSupported || canvasFallbackActive) && ['MYSTERY', 'AWAKENING', 'RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase) && (
        <div
          className="launch-fallback-logo-wrap"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <img
            src="/assets/logo/csvertex-logo.png"
            alt="CS Vertex Logo"
            className="launch-fallback-logo"
            style={{
              height: 'clamp(140px, 25vw, 320px)',
              width: 'auto',
              objectFit: 'contain',
              opacity: 0,
              filter: 'blur(20px)'
            }}
          />
        </div>
      )}

      {/* ── PHASE 1 — COUNTDOWN & HUD TERMINAL ── */}
      {isCounting && (
        <div className={`${styles.stage} ${phase === 'ENERGY' ? styles.energyStage : ''}`}>

          <button className={styles.audioBtn}
            onClick={() => { setMuted(v => !v); audio.init() }}
            aria-label="Toggle sound">
            {muted
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            }
          </button>

          {/* Futuristic HUD Header */}
          <div ref={hudHeaderRef} className={styles.hudHeader}>
            <div className={styles.hudTechLeft}>
              <span>SYS.STATUS: NOMINAL</span>
              <span>// SECURE LINK ACTIVE</span>
            </div>
            <div>COORD: 17.6868° N, 83.2185° E</div>
          </div>

          {/* Futuristic HUD Left Panel: Premium loading terminal */}
          <div ref={hudPanelLeftRef} className={styles.hudPanelLeft}>
            {terminalLines.map((line, idx) => (
              <div key={idx} className={styles.hudLogLine} style={{ color: '#E8440A', fontWeight: 600 }}>
                [SYS] {line}
              </div>
            ))}
            {terminalLines.length < 4 && (
              <div className={styles.hudLogLineCursor}>_</div>
            )}
          </div>

          {/* Futuristic HUD Right Panel */}
          <div ref={hudPanelRightRef} className={styles.hudPanelRight}>
            <div className={styles.hudDiagnostic}>
              <span>STABILITY</span>
              <span className={styles.hudDiagValue}>99.98%</span>
            </div>
            <div className={styles.hudDiagnostic}>
              <span>TENSION</span>
              <span className={styles.hudDiagValue}>{(tension * 100).toFixed(2)}%</span>
            </div>
            <div className={styles.hudDiagnostic}>
              <span>PRE-LAUNCH LOCK</span>
              <span className={styles.hudDiagValue} style={{ color: '#E8440A' }}>ACTIVE</span>
            </div>
          </div>

          {/* Brand */}
          <div className={styles.brand} ref={brandRef}>
            <p className={styles.brandMark}>CS VERTEX</p>
            <p className={styles.brandSub}>LAUNCH SEQUENCE INITIATED</p>
          </div>

          {/* Telemetry Dial Container */}
          <div ref={hudDialRef} className={styles.hudDialContainer}>
            <div className={styles.hudRingOuter} />
            <div className={styles.hudRingMid} />
            <div className={styles.hudRingInner} />
            <svg className={styles.hudSvg} viewBox="0 0 220 220">
              <defs>
                <linearGradient id="hudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8440A" />
                  <stop offset="100%" stopColor="#FF7A30" />
                </linearGradient>
              </defs>
              <circle className={styles.hudTrack} cx="110" cy="110" r="100" />
              <circle
                className={styles.hudProgress}
                cx="110"
                cy="110"
                r="100"
                style={{
                  strokeDasharray: 628,
                  strokeDashoffset: 628 * (1 - (
                    ((launchTs.current - Date.now()) > 60_000)
                      ? ((launchTs.current - Date.now()) % 60_000) / 60_000
                      : Math.max(0, (launchTs.current - Date.now()) / 60_000)
                  ))
                }}
              />
            </svg>
            <div className={styles.countdownText}>
              <div className={styles.cdWrap}>
                {[
                  { v: dhms.d, l: 'Days' },
                  null,
                  { v: dhms.h, l: 'Hours' },
                  null,
                  { v: dhms.m, l: 'Min' },
                  null,
                  { v: dhms.s, l: 'Sec' },
                ].map((item, i) =>
                  item === null ? (
                    <span key={i} className={styles.colon}>:</span>
                  ) : (
                    <div key={i} className={styles.unit}>
                      <span key={item.v} className={`${styles.digit} ${phase === 'ENERGY' ? styles.energyDigit : ''}`}>
                        {fmt(item.v as number)}
                      </span>
                      <span className={styles.unitLabel}>{item.l}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Inline Notify Me Form (Phase 1) */}
          <div className={styles.notifyFormContainer}>
            <p className={styles.notifyTag}>JOIN THE EXCLUSIVE LAUNCH LOOP</p>
            <form onSubmit={handleNotify} className={styles.notifyForm}>
              <input
                type="email"
                placeholder="Enter email for Founder Access Badge..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.notifyInput}
              />
              <button type="submit" className={styles.notifySubmit}>
                NOTIFY ME
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PHASE 2: Dedicated 10s Countdown Digits ── */}
      {phase === 'FINAL_COUNTDOWN' && (
        <div className={styles.finalCountdownContainer}>
          <div key={countdownValue} className={styles.finalCountdownDigit}>
            {countdownValue}
          </div>
          <div className={styles.finalCountdownShockwave} />
          <div className={styles.finalCountdownShockwaveOuter} />
        </div>
      )}

      {/* ── PHASE 5: HERO MOMENT BRAND TYPOGRAPHY OVERLAY ── */}
      {phase === 'HERO' && (
        <div className={styles.brandReveal} style={{ opacity: 1, bottom: '22%', transition: 'all 0.5s ease' }}>
          <h1 className={styles.bLogo} style={{ opacity: 1, margin: '0 0 10px', fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.25em', color: '#fff', textShadow: '0 0 40px rgba(255,106,0,0.6)', animation: 'fadeSlide 1.2s ease forwards' }}>CS VERTEX</h1>
          <span className={styles.bLine1} style={{ opacity: 1, fontSize: 'clamp(9px, 1.2vw, 14px)', letterSpacing: '0.45em', color: '#FF6A00', animation: 'fadeIn 1.5s ease forwards 0.4s' }}>INNOVATIVE DIGITAL SOLUTIONS</span>
        </div>
      )}

      {/* Website emerge */}
      <div ref={websiteRef} className={styles.emerge} style={{ pointerEvents: 'none' }}>
        {['ENTRY', 'DONE'].includes(phase) && <FullWebsiteData data={initialData} />}
      </div>

      {/* ── NOTIFY MODAL / FOUNDER ACCESS BADGE ── */}
      {showBadgeModal && (
        <div className={styles.badgeModalOverlay} onClick={() => setShowBadgeModal(false)}>
          <div className={styles.badgeModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.badgeModalClose} onClick={() => setShowBadgeModal(false)}>✕</button>
            <h3 style={{ color: '#E8440A', letterSpacing: '0.15em', fontSize: '18px', marginBottom: '10px' }}>CONGRATULATIONS</h3>
            <p style={{ fontSize: '13px', color: '#ccc', margin: '0 0 15px 0' }}>
              You are officially registered! Here is your exclusive digital Founder Access Badge.
            </p>
            
            {/* The Holographic Badge */}
            <div className="badgeContainer">
              <div className="founderBadge">
                <div className="badgeScanline"></div>
                <div className="badgeGrid"></div>
                <div className="badgeCornerDecor badgeCornerTL"></div>
                <div className="badgeCornerDecor badgeCornerTR"></div>
                <div className="badgeCornerDecor badgeCornerBL"></div>
                <div className="badgeCornerDecor badgeCornerBR"></div>
                
                <div className="badgeHeader">
                  <div className="badgeLogo">
                    <img src="/logo-nav.png" alt="CS Vertex" />
                    <span className="badgeTitle" style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)' }}>CS VERTEX</span>
                  </div>
                  <div className="badgeHoloChip"></div>
                </div>
                
                <div className="badgeBody">
                  <span className="badgeLabel">Membership Rank</span>
                  <span className="badgeMemberName">Founder Member</span>
                </div>
                
                <div className="badgeFooter">
                  <span className="badgeId">{badgeId}</span>
                  <span className="badgeDate">24-06-2026</span>
                </div>
              </div>
            </div>

            <button className={styles.badgeModalButton} onClick={() => setShowBadgeModal(false)}>
              Back to Countdown
            </button>
          </div>
        </div>
      )}

      {/* Stage debug HUD is always rendered on top */}
      {renderDebugHUD()}

      {/* Render the Developer Preview Panel */}
      {renderDemoPanel()}
    </div>
  )
}
