"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import './launch.css'
import { Preloader } from '../Preloader'

/* ═══════════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * TEST_MODE = true  → countdown runs for 15 seconds from page load.
 *                     Full flow can be tested immediately.
 * TEST_MODE = false → uses real launch date/time.
 * ⚠ MUST be false before production deployment.
 */
const TEST_MODE = false

/** 24 June 2026, 2:11:00 PM IST = 08:41:00 UTC */
const LAUNCH_UTC = Date.UTC(2026, 5, 24, 8, 41, 0)

/** 24 June 2026 in IST: midnight IST = 18:30 UTC on 23 June, end of day IST = 18:29:59 UTC on 24 June */
const LAUNCH_DAY_START_UTC = Date.UTC(2026, 5, 23, 18, 30, 0)
const LAUNCH_DAY_END_UTC   = Date.UTC(2026, 5, 24, 18, 29, 59, 999)

const SESSION_REVEAL_DONE = 'csv_reveal_done'

/* ═══════════════════════════════════════════════════════════════════════
   PHASE TYPE
   ═══════════════════════════════════════════════════════════════════════ */
type Phase = 'COUNTDOWN' | 'CURTAIN' | 'LOADING' | 'DONE'

/* ═══════════════════════════════════════════════════════════════════════
   TIME HELPERS
   ═══════════════════════════════════════════════════════════════════════ */
function getTargetMs(): number {
  if (TEST_MODE) return Date.now() + 15_000
  return LAUNCH_UTC
}

function getRemaining(targetMs: number) {
  const diff = targetMs - Date.now()
  if (diff <= 0) return { total: 0, d: 0, h: 0, m: 0, s: 0 }
  return {
    total: diff,
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  }
}

function isLaunchDay(): boolean {
  if (TEST_MODE) return true
  const now = Date.now()
  return now >= LAUNCH_DAY_START_UTC && now <= LAUNCH_DAY_END_UTC
}

function isPastLaunchDay(): boolean {
  if (TEST_MODE) return false
  return Date.now() > LAUNCH_DAY_END_UTC
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

/* ═══════════════════════════════════════════════════════════════════════
   INITIAL PHASE
   ═══════════════════════════════════════════════════════════════════════ */
function computeInitialPhase(targetMs: number): Phase {
  if (isPastLaunchDay()) return 'LOADING'
  if (!TEST_MODE && typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem(SESSION_REVEAL_DONE) === 'true') return 'LOADING'
  if (Date.now() < targetMs) return 'COUNTDOWN'
  return 'LOADING'
}

/* ═══════════════════════════════════════════════════════════════════════
   COUNTDOWN PARTICLE HOOK
   ═══════════════════════════════════════════════════════════════════════ */
function useCountdownParticles(ref: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width  = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    interface P { x: number; y: number; r: number; vx: number; vy: number; a: number }
    const pts: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.1),
      a: Math.random() * 0.4 + 0.08,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,106,0,${p.a})`
        ctx.fill()
        if (p.y < -10 || p.x < -10 || p.x > w + 10) { p.x = Math.random() * w; p.y = h + 10 }
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [ref, active])
}

/* ═══════════════════════════════════════════════════════════════════════
   BROWSER NOTIFICATION HELPER
   ═══════════════════════════════════════════════════════════════════════ */
async function requestBrowserNotification(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

/* ═══════════════════════════════════════════════════════════════════════
   CURTAIN + LOGO REVIVAL COMPONENT
   Full cinematic sequence:
     curtain-closed  → curtains fully closed
     curtain-opening → curtains slide open (4 s)
     storm           → particle storm builds over center canvas
     converge        → particles converge inward
     logo-in         → logo fades in from particles, glow blooms
     logo-full       → full effects: sweep, flare, rays, rings
     exiting         → stage fades out
   Hard failsafe: 14 s cap
   ═══════════════════════════════════════════════════════════════════════ */
function CurtainReveal({ onComplete }: { onComplete: () => void }) {
  type CStep = 'curtain-closed' | 'curtain-opening' | 'storm' | 'converge' | 'logo-in' | 'logo-full' | 'exiting'
  const [step, setStep] = useState<CStep>('curtain-closed')

  const dustRef  = useRef<HTMLCanvasElement>(null)
  const stormRef = useRef<HTMLCanvasElement>(null)
  const glowRef  = useRef<HTMLCanvasElement>(null)

  /* ── Hard failsafe ── */
  useEffect(() => {
    const guard = setTimeout(() => onComplete(), 14_000)
    return () => clearTimeout(guard)
  }, [onComplete])

  /* ── Main timeline ──
     0.3 s  → curtain slides begin
     4.3 s  → particle storm starts (curtains ~85% open)
     6.0 s  → particles converge
     7.0 s  → logo fades in
     8.5 s  → logo fully locked, all effects on
     12.5 s → begin exit fade
     13.8 s → onComplete()
  */
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep('curtain-opening'), 300),
      setTimeout(() => setStep('storm'),           4_300),
      setTimeout(() => setStep('converge'),        6_000),
      setTimeout(() => setStep('logo-in'),         7_000),
      setTimeout(() => setStep('logo-full'),       8_500),
      setTimeout(() => setStep('exiting'),        12_500),
      setTimeout(() => onComplete(),              13_800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  /* ── Atmosphere dust canvas (always on) ── */
  useEffect(() => {
    const canvas = dustRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    interface D { x: number; y: number; vx: number; vy: number; r: number; a: number }
    const dust: D[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.22 + 0.04),
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.28 + 0.04,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      dust.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,210,160,${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  /* ── Particle storm + convergence + logo energy canvas ── */
  useEffect(() => {
    const canvas = stormRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    interface SP {
      x: number; y: number; vx: number; vy: number;
      r: number; a: number; life: number;
      targetX?: number; targetY?: number; converging?: boolean
    }

    let particles: SP[] = []
    let stormActive  = false
    let converging   = false
    let logoPhase    = false

    // Expose controls via ref-like mechanism through step changes
    const stateRef = { stormActive: false, converging: false, logoPhase: false }

    let raf: number
    const cx = () => w / 2
    const cy = () => h / 2

    const spawnStorm = () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 200 + Math.random() * 300
      particles.push({
        x: cx() + Math.cos(angle) * radius,
        y: cy() + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        r: Math.random() * 2.5 + 0.5,
        a: Math.random() * 0.8 + 0.2,
        life: 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Storm: spawn particles outward
      if (stateRef.stormActive && !stateRef.converging && particles.length < 180) {
        for (let i = 0; i < 4; i++) spawnStorm()
      }

      // Converge: pull particles toward center
      if (stateRef.converging) {
        particles.forEach(p => {
          const dx = cx() - p.x
          const dy = cy() - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          p.vx += (dx / dist) * 0.35
          p.vy += (dy / dist) * 0.35
          p.vx *= 0.92
          p.vy *= 0.92
        })
      }

      // Logo energy: spawn close to center
      if (stateRef.logoPhase && particles.length < 80) {
        const angle = Math.random() * Math.PI * 2
        const d = Math.random() * 130 + 30
        particles.push({
          x: cx() + Math.cos(angle) * d,
          y: cy() + Math.sin(angle) * d,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          r: Math.random() * 2 + 0.4,
          a: Math.random() * 0.7 + 0.2,
          life: 1,
        })
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (!stateRef.logoPhase) p.life -= stateRef.converging ? 0.012 : 0.003
        else p.life -= 0.005

        if (p.life <= 0) { particles.splice(i, 1); continue }

        // Color: orange-to-white based on convergence
        const t = stateRef.converging ? (1 - p.life) : 0
        const r = Math.round(255)
        const g = Math.round(106 + t * 149)
        const b = Math.round(0 + t * 255)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a * p.life})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  /* ── Sync stateRef with step by using a side-effect ── */
  /* We use a module-level mutable that the canvas draw closure reads */
  /* We implement this via a hidden div whose dataset we toggle */
  const stepSignalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Signal the canvas loop via a data attribute the draw closure can read
    if (stepSignalRef.current) {
      stepSignalRef.current.dataset.step = step
    }
  }, [step])

  /* Since we can't easily share mutable state with the closed-over draw loop,
     we implement the particle state control with a second separate effect
     that directly manipulates an external mutable object. */

  /* ─────── Particle storm canvas — clean self-contained approach ─────── */
  /* Override: use a single integrated canvas that reads `step` via a ref */
  const stepRef = useRef(step)
  useEffect(() => { stepRef.current = step }, [step])

  /* Glow energy canvas after logo-in */
  useEffect(() => {
    const isLogoPhase = step === 'logo-in' || step === 'logo-full' || step === 'exiting'
    if (!isLogoPhase) return
    const canvas = glowRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    interface EP { x: number; y: number; vx: number; vy: number; r: number; a: number; life: number }
    const pts: EP[] = []
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      if (pts.length < 60 && Math.random() < 0.45) {
        const angle = Math.random() * Math.PI * 2
        const dist  = Math.random() * 140 + 30
        pts.push({
          x: w / 2 + Math.cos(angle) * dist,
          y: h / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          r: Math.random() * 2.2 + 0.4,
          a: Math.random() * 0.75 + 0.2,
          life: 1,
        })
      }
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i]
        p.x += p.vx; p.y += p.vy; p.life -= 0.004
        if (p.life <= 0) { pts.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,106,0,${p.a * p.life})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [step])

  const isOpen   = step !== 'curtain-closed'
  const logoIn   = step === 'logo-in'   || step === 'logo-full' || step === 'exiting'
  const logoFull = step === 'logo-full' || step === 'exiting'
  const isExiting = step === 'exiting'

  return (
    <div
      className={`cr-stage${isExiting ? ' cr-stage--exiting' : ''}`}
      ref={stepSignalRef}
    >
      {/* Atmosphere dust */}
      <canvas ref={dustRef} className="cr-dust-canvas" />

      {/* Deep dark stage background */}
      <div className="cr-stage-bg" />

      {/* Spotlight beams from above */}
      <div className="cr-spotlights">
        <div className="cr-spot cr-spot--l" />
        <div className="cr-spot cr-spot--c" />
        <div className="cr-spot cr-spot--r" />
      </div>

      {/* Floor glow that activates on logo */}
      <div className={`cr-floor-glow${logoIn ? ' cr-floor-glow--active' : ''}`} />

      {/* ══ LOGO STAGE ══ */}
      <div className="cr-logo-stage">

        {/* Particle storm + convergence canvas */}
        <canvas ref={stormRef} className="cr-storm-canvas" />

        {/* Energy rings */}
        <div className={`cr-ring cr-ring--1${logoFull ? ' cr-ring--active' : ''}`} />
        <div className={`cr-ring cr-ring--2${logoFull ? ' cr-ring--active' : ''}`} />

        {/* Orange radial glow */}
        <div className={`cr-logo-glow${logoIn ? ' cr-logo-glow--active' : ''}`} />

        {/* Logo */}
        <div className={`cr-logo-wrap${logoIn ? ' cr-logo-wrap--in' : ''}${logoFull ? ' cr-logo-wrap--full' : ''}`}>
          <img
            src="/assets/logo/csvertex-logo.png"
            alt="CS Vertex"
            className="cr-logo"
            draggable={false}
          />
          {/* Reflection sweep */}
          <div className={`cr-logo-shine${logoIn ? ' cr-logo-shine--active' : ''}`} />
          {/* Lens flare */}
          <div className={`cr-lens-flare${logoFull ? ' cr-lens-flare--active' : ''}`} />
        </div>

        {/* Logo energy glow particles */}
        <canvas ref={glowRef} className="cr-glow-canvas" />

        {/* Premium light rays */}
        {logoFull && (
          <div className="cr-light-rays">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="cr-ray" style={{ '--ray-i': i } as React.CSSProperties} />
            ))}
          </div>
        )}

        {/* Brand text */}
        <div className={`cr-brand-text${logoFull ? ' cr-brand-text--visible' : ''}`}>
          <span className="cr-brand-name">CS VERTEX</span>
          <span className="cr-brand-tagline">SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* ══ CURTAIN PANELS ══ */}
      <div className={`cr-curtain cr-curtain--left${isOpen ? ' cr-curtain--open' : ''}`}>
        <div className="cr-curtain-face" />
        <div className="cr-fold cr-fold--1" />
        <div className="cr-fold cr-fold--2" />
        <div className="cr-fold cr-fold--3" />
        <div className="cr-fold cr-fold--4" />
        <div className="cr-fold cr-fold--5" />
        <div className="cr-gold-edge cr-gold-edge--right" />
        <div className="cr-valance" />
        <div className="cr-curtain-sheen" />
      </div>

      <div className={`cr-curtain cr-curtain--right${isOpen ? ' cr-curtain--open' : ''}`}>
        <div className="cr-curtain-face" />
        <div className="cr-fold cr-fold--1" />
        <div className="cr-fold cr-fold--2" />
        <div className="cr-fold cr-fold--3" />
        <div className="cr-fold cr-fold--4" />
        <div className="cr-fold cr-fold--5" />
        <div className="cr-gold-edge cr-gold-edge--left" />
        <div className="cr-valance" />
        <div className="cr-curtain-sheen" />
      </div>

      {/* Top pelmet bar */}
      <div className="cr-pelmet" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   COUNTDOWN SCREEN
   ═══════════════════════════════════════════════════════════════════════ */
function CountdownScreen({ onComplete }: { onComplete: () => void }) {
  const targetMsRef = useRef(getTargetMs())
  const [time, setTime]         = useState(() => getRemaining(targetMsRef.current))
  const [lastS, setLastS]       = useState(-1)
  const [notifGranted, setNotifGranted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useCountdownParticles(canvasRef, true)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  /* Countdown tick — single stable interval */
  useEffect(() => {
    const r0 = getRemaining(targetMsRef.current)
    if (r0.total <= 0) { onCompleteRef.current(); return }
    const id = setInterval(() => {
      const r = getRemaining(targetMsRef.current)
      setTime(r)
      if (r.total <= 0) { clearInterval(id); onCompleteRef.current() }
    }, 1_000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // stable — uses refs

  useEffect(() => { setLastS(time.s) }, [time.s])

  /* Check notification state */
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifGranted(Notification.permission === 'granted')
    }
  }, [])

  const handleEnableNotifications = async () => {
    const granted = await requestBrowserNotification()
    setNotifGranted(granted)
  }

  return (
    <>
      <div id="launch-root">
        <div className="launch-grid-overlay" />
        <canvas id="launch-particles-canvas" ref={canvasRef} />
        <div className="launch-vignette" />
        <div className="launch-scanlines" />

        {/* Nav */}
        <nav className="launch-nav">
          <div className="launch-nav-brand">
            <img src="/assets/logo/csvertex-logo.png" alt="CS Vertex" />
            <div className="launch-nav-brand-text">
              <span className="launch-nav-brand-name">CS VERTEX</span>
              <span className="launch-nav-brand-tagline">Innovative Digital Solutions</span>
            </div>
          </div>
          <div className="launch-nav-social">
            <span>Follow Us :</span>
            <a href="https://www.linkedin.com/company/cs-vertex/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.instagram.com/cs_vertex" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </nav>

        {/* Hero section */}
        <section className="launch-hero">
          <div className="launch-hero-bg">
            <img src="/assets/city-skyline-bg.png" alt="" role="presentation" />
          </div>

          <div className="launch-hero-content">
            <h1 className="launch-headline launch-fade-in launch-fade-in-delay-1">
              <span className="launch-headline-top">THE FUTURE IS</span>
              <span className="launch-headline-bottom">ALMOST HERE.</span>
            </h1>

            <p className="launch-subheadline launch-fade-in launch-fade-in-delay-2">
              <span style={{ color: '#FF6A00' }}>CS Vertex</span> is preparing something <em>extraordinary</em>.
            </p>

            {/* Countdown */}
            <div className="launch-countdown-wrap launch-fade-in launch-fade-in-delay-3">
              <div className="launch-countdown-labels">
                <span className="launch-countdown-label">DAYS</span>
                <span className="launch-countdown-label sep" />
                <span className="launch-countdown-label">HOURS</span>
                <span className="launch-countdown-label sep" />
                <span className="launch-countdown-label">MINUTES</span>
                <span className="launch-countdown-label sep" />
                <span className="launch-countdown-label">SECONDS</span>
              </div>
              <div className="launch-countdown-values">
                <span className="launch-countdown-digit">{pad(time.d)}</span>
                <span className="launch-countdown-sep">:</span>
                <span className="launch-countdown-digit">{pad(time.h)}</span>
                <span className="launch-countdown-sep">:</span>
                <span className="launch-countdown-digit">{pad(time.m)}</span>
                <span className="launch-countdown-sep">:</span>
                <span className={`launch-countdown-digit${time.s !== lastS ? ' tick' : ''}`}>
                  {pad(time.s)}
                </span>
              </div>
            </div>

            {/* Launch date display */}
            <div className="launch-date-display launch-fade-in launch-fade-in-delay-4">
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FF6A00' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Launching on <span className="date-val">{TEST_MODE ? 'TEST MODE — 15s' : '24 June 2026'}</span>
              </span>
              <span className="launch-date-divider" />
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FF6A00' }}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="date-val">2:11 PM</span> IST
              </span>
            </div>

            {/* CTA */}
            <div className="launch-fade-in launch-fade-in-delay-5" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!notifGranted ? (
                <button className="launch-cta-btn" onClick={handleEnableNotifications} id="enable-notifications-btn">
                  ENABLE NOTIFICATIONS
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
              ) : (
                <button className="launch-cta-btn" style={{ background: '#4ade80', color: '#000', cursor: 'default' }} disabled>
                  NOTIFICATIONS ENABLED
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* What we're building */}
        <div className="launch-section-heading launch-reveal">
          <h2>WHAT WE&apos;RE BUILDING</h2>
        </div>
        <div className="launch-services-grid">
          {[
            { icon: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 2.5 2.5 0 0 1-.96-4.43 2.5 2.5 0 0 1 1.95-3.8 2.5 2.5 0 0 1 4.43-.63zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 2.5 2.5 0 0 0 .96-4.43 2.5 2.5 0 0 0-1.95-3.8 2.5 2.5 0 0 0-4.43-.63z', label: 'AI SOLUTIONS', desc: 'Intelligent systems that think, learn & evolve.' },
            { icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z', label: 'WEB ECOSYSTEMS', desc: 'Scalable & powerful digital experiences.' },
            { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 9h6v6H9z', label: 'CYBERSECURITY', desc: 'Protecting what matters most with advanced security.' },
            { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', label: 'AUTOMATION', desc: 'Streamlining processes with smart automation.' },
            { icon: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z', label: 'CLOUD TECHNOLOGIES', desc: 'Building the future on scalable cloud infrastructure.' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="launch-service-card launch-reveal">
              <div className="launch-service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <h3>{label}</h3><p>{desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="launch-mission-wrapper launch-reveal">
          <div className="launch-mission">
            <div className="launch-mission-logo">
              <img src="/assets/logo/csvertex-logo.png" alt="CS Vertex" />
            </div>
            <div className="launch-mission-text">
              <p>Not just another technology company.</p>
              <p className="highlight-line">A new era of innovation is about to begin.</p>
            </div>
            <div className="launch-mission-quote">
              <p>Every great revolution starts with a vision.</p>
              <p className="highlight-line">Ours begins now.</p>
            </div>
          </div>
        </div>

        <footer className="launch-footer">
          <div className="launch-footer-left">
            <span>&copy; 2026 CS Vertex. All Rights Reserved.</span>
          </div>
          <div className="launch-footer-right">
            <div className="launch-footer-links">
              <a href="/privacy">Privacy Policy</a><span>|</span>
              <a href="/terms">Terms of Service</a><span>|</span>
              <a href="mailto:hello@csvertex.com">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT LAUNCH GATE
   ═══════════════════════════════════════════════════════════════════════ */
export function LaunchGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase]     = useState<Phase>(() => {
    const targetMs = getTargetMs()
    return computeInitialPhase(targetMs)
  })

  const goTo = useCallback((next: Phase) => setPhase(next), [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRevealComplete = useCallback(() => {
    if (!TEST_MODE) sessionStorage.setItem(SESSION_REVEAL_DONE, 'true')
    goTo('LOADING')
  }, [goTo])

  const handleCountdownComplete = useCallback(() => {
    goTo('LOADING')
  }, [goTo])

  if (!mounted) return null

  /* ⚡ COUNTDOWN ⚡ */
  if (phase === 'COUNTDOWN') {
    return (
      <CountdownScreen
        onComplete={handleCountdownComplete}
      />
    )
  }

  /* 🎭 CURTAIN 🎭 */
  if (phase === 'CURTAIN') {
    return <CurtainReveal onComplete={handleRevealComplete} />
  }

  /* 🚀 LOADING / ✨ DONE ✨ */
  return (
    <>
      {phase === 'LOADING' && <Preloader onComplete={() => setPhase('DONE')} />}
      {children}
    </>
  )
}
