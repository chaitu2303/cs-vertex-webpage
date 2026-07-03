"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface PreloaderProps {
  onComplete?: () => void
  children?: React.ReactNode
}

const MESSAGES = [
  "Initializing Systems...",
  "Loading Assets...",
  "Preparing Interface...",
  "Connecting Modules...",
  "Launching CS Vertex...",
]

// Phase 0: draw  → logo silhouette (orange-tinted shadow)
// Phase 1: glow  → orange glow intensifies
// Phase 2: fill  → color floods in, white
// Phase 3: done  → full brightness, loading line completes
const PHASE_TIMINGS = [400, 850, 1300, 1800]
const MIN_ANIM_MS   = 1800
const MAX_TOTAL_MS  = 2000

// Routes where the preloader must NEVER appear
const SKIP_ROUTES = ['/admin', '/portal', '/auth']

export function Preloader({ onComplete, children }: PreloaderProps) {
  const pathname = usePathname()
  // Never show preloader inside admin, portal or auth pages
  const skipPreloader = SKIP_ROUTES.some(r => pathname?.startsWith(r))

  const [loading, setLoading]   = useState(true)
  const [phase, setPhase]       = useState(0)
  const [msgIdx, setMsgIdx]     = useState(0)
  const canvasRef               = useRef<HTMLCanvasElement | null>(null)

  // Guards
  const doneRef      = useRef(false)
  const animDoneRef  = useRef(false)
  const assetsDoneRef = useRef(false)

  /* ─── dismiss helpers ─────────────────────────────────────────────── */
  const dismiss = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    try { sessionStorage.setItem('csvertex_preloader_done', 'true') } catch {}
    setLoading(false)
    setTimeout(() => onComplete?.(), 650)
  }, [onComplete])

  const tryDismiss = useCallback(() => {
    if (animDoneRef.current && assetsDoneRef.current) dismiss()
  }, [dismiss])

  /* ─── 1. Skip on return visits or protected routes ─────────────────── */
  useEffect(() => {
    // Always skip inside admin / portal / auth
    if (skipPreloader) {
      doneRef.current       = true
      animDoneRef.current   = true
      assetsDoneRef.current = true
      setLoading(false)
      onComplete?.()
      return
    }
    try {
      if (sessionStorage.getItem('csvertex_preloader_done') === 'true') {
        doneRef.current    = true
        animDoneRef.current = true
        assetsDoneRef.current = true
        setLoading(false)
        onComplete?.()
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipPreloader]) // onComplete is intentionally excluded

  /* ─── 2. Hard cap – never block beyond MAX_TOTAL_MS ──────────────── */
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(dismiss, MAX_TOTAL_MS)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  /* ─── 3. Animation phase timeline ────────────────────────────────── */
  useEffect(() => {
    if (!loading) return
    const ts = [
      setTimeout(() => setPhase(1), PHASE_TIMINGS[0]),
      setTimeout(() => setPhase(2), PHASE_TIMINGS[1]),
      setTimeout(() => setPhase(3), PHASE_TIMINGS[2]),
      setTimeout(() => {
        animDoneRef.current = true
        tryDismiss()
      }, MIN_ANIM_MS),
    ]
    return () => ts.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  /* ─── 4. Preload critical first-screen assets only ───────────────── */
  useEffect(() => {
    if (!loading) return

    const loadImg = (src: string, timeout = 3000) =>
      new Promise<void>(res => {
        const img = new window.Image()
        img.onload = img.onerror = () => res()
        img.src = src
        setTimeout(res, timeout)
      })

    Promise.allSettled([
      document.fonts?.ready ?? Promise.resolve(),
      loadImg('/assets/logo/csvertex-logo.png', 2000),
      loadImg('/assets/vertex-hero.png',        3000),
    ]).finally(() => {
      assetsDoneRef.current = true
      tryDismiss()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  /* ─── 5. Message cycling ─────────────────────────────────────────── */
  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 780)
    return () => clearInterval(t)
  }, [loading])

  /* ─── 6. Canvas: particles + grid + scanline + radial glow ──────── */
  useEffect(() => {
    if (!loading) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width  = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    let animId = 0
    let scanY  = 0

    const onResize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const particles = Array.from({ length: 75 }, () => ({
      x:    Math.random() * window.innerWidth,
      y:    Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.2,
      vx:   (Math.random() - 0.5) * 0.3,
      vy:   -(Math.random() * 0.55 + 0.1),
      alpha: Math.random() * 0.55 + 0.1,
      glow:  Math.random() > 0.72,
    }))

    const frame = () => {
      // Background
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, w, h)

      // Radial glow behind logo area
      const rg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.48)
      rg.addColorStop(0,   'rgba(255,90,42,0.08)')
      rg.addColorStop(0.5, 'rgba(255,90,42,0.025)')
      rg.addColorStop(1,   'transparent')
      ctx.fillStyle = rg
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = 'rgba(255,90,42,0.022)'
      ctx.lineWidth   = 1
      const gs = 58
      for (let x = 0; x < w; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      // Moving scanline
      scanY = (scanY + 1.4) % h
      const sg = ctx.createLinearGradient(0, scanY - 70, 0, scanY + 70)
      sg.addColorStop(0,   'transparent')
      sg.addColorStop(0.5, 'rgba(255,90,42,0.032)')
      sg.addColorStop(1,   'transparent')
      ctx.fillStyle = sg
      ctx.fillRect(0, scanY - 70, w, 140)

      // Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
        if (Math.abs(p.x - w / 2) > w / 2 + 5) p.vx *= -1

        ctx.fillStyle = `rgba(255,90,42,${p.alpha})`
        if (p.glow) { ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,90,42,0.9)' }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(frame)
    }
    animId = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
    }
  }, [loading])

  /* ─── Derived animation values from phase ────────────────────────── */

  // Logo filter: silhouette → orange glow → colour flood → full
  const logoFilter =
    phase === 0 ? 'brightness(0.15) sepia(1) saturate(6) hue-rotate(-5deg)' :
    phase === 1 ? 'brightness(0.4) sepia(1) saturate(10) hue-rotate(-5deg) drop-shadow(0 0 18px rgba(255,90,42,0.85))' :
    phase === 2 ? 'brightness(0.82) saturate(1.3) drop-shadow(0 0 22px rgba(255,90,42,0.75))' :
                  'brightness(1) saturate(1) drop-shadow(0 0 28px rgba(255,90,42,0.45))'

  const logoScale   = phase === 0 ? 0.85 : phase === 1 ? 0.94 : 1.0
  const logoOpacity = phase === 0 ? 0.55 : phase === 1 ? 0.75 : 1.0

  // Loading line progress
  const lineProgress = phase === 0 ? 0.18 : phase === 1 ? 0.52 : phase === 2 ? 0.83 : 1.0
  const dotCX        = 10 + lineProgress * 220

  // Pen tip visibility
  const showPenTip = phase <= 1

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader-overlay"
            className="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            style={{
              position:       'fixed',
              inset:           0,
              zIndex:          999999,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              overflow:       'hidden',
              pointerEvents:  loading ? 'auto' : 'none',
            }}
          >
            {/* Canvas background */}
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
            />

            {/* Vignette overlay */}
            <div style={{
              position:    'absolute',
              inset:        0,
              zIndex:       2,
              background:  'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.75) 100%)',
              pointerEvents: 'none',
            }} />

            {/* ── Central content ── */}
            <div style={{
              position:       'relative',
              zIndex:          10,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '38px',
            }}>

              {/* ── Logo container with rings + pen tip ── */}
              <div style={{ position: 'relative', width: '154px', height: '154px' }}>

                {/* Outer dashed rotating ring */}
                <motion.svg
                  viewBox="0 0 154 154"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="77" cy="77" r="70" fill="none" stroke="rgba(255,90,42,0.14)" strokeWidth="1" strokeDasharray="5 12" />
                </motion.svg>

                {/* Inner solid ring pulse */}
                <motion.svg
                  viewBox="0 0 154 154"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
                  animate={{ scale: [1, 1.055, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <circle cx="77" cy="77" r="55" fill="none" stroke="rgba(255,90,42,0.09)" strokeWidth="1" />
                </motion.svg>

                {/* Counter-rotating dotted ring */}
                <motion.svg
                  viewBox="0 0 154 154"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="77" cy="77" r="62" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 18" />
                </motion.svg>

                {/* Logo with phase-driven sketch→colour reveal */}
                <motion.div
                  style={{ position: 'absolute', inset: '18px', zIndex: 2 }}
                  animate={{
                    opacity: logoOpacity,
                    scale:   logoScale,
                    filter:  logoFilter,
                  }}
                  transition={{ duration: 0.95, ease: 'easeOut' }}
                >
                  <Image
                    src="/assets/logo/csvertex-logo.png"
                    alt="CS Vertex"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </motion.div>

                {/* Glowing pen tip — traces across logo during draw phases */}
                <AnimatePresence>
                  {showPenTip && (
                    <motion.div
                      key="pen-tip"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.4 } }}
                      style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}
                    >
                      <motion.div
                        style={{
                          position:     'absolute',
                          width:         '10px',
                          height:        '10px',
                          borderRadius: '50%',
                          background:   '#FF5A2A',
                          boxShadow:    '0 0 0 3px rgba(255,90,42,0.25), 0 0 18px 4px rgba(255,90,42,0.7)',
                          transform:    'translate(-50%, -50%)',
                        }}
                        animate={{
                          left: ['28%', '72%', '88%', '60%', '22%', '48%', '75%'],
                          top:  ['28%', '22%', '50%', '78%', '68%', '42%', '32%'],
                        }}
                        transition={{
                          duration: 2.2,
                          ease:     'easeInOut',
                          times:    [0, 0.18, 0.36, 0.54, 0.72, 0.88, 1],
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Orange pulse bloom on glow/fill phase */}
                {phase >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 0.35, 0], scale: [0.6, 1.5, 2.0] }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{
                      position:     'absolute',
                      inset:        '0',
                      borderRadius: '50%',
                      background:   'radial-gradient(circle, rgba(255,90,42,0.4) 0%, transparent 70%)',
                      zIndex:       0,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>

              {/* ── Sketch-style loading line with SVG pen ── */}
              <svg width="240" height="20" viewBox="0 0 240 20" style={{ overflow: 'visible' }}>
                {/* Track */}
                <line
                  x1="10" y1="10" x2="230" y2="10"
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Drawn line — animates with phase */}
                <motion.line
                  x1="10" y1="10"
                  animate={{ x2: dotCX }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  stroke="#FF5A2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,42,0.75))' }}
                />

                {/* ── SVG Pen nib at tip of drawn line ── */}
                {/* Tip anchored at (dotCX, 10); body angled upper-left */}
                <motion.g
                  animate={{ translateX: dotCX, translateY: 10 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                >
                  <g transform="rotate(-45)">
                    {/* Pen cap (top, orange) */}
                    <rect x="-4" y="-30" width="8" height="8" rx="2.5" fill="#FF5A2A" opacity="0.95"/>
                    {/* Pen clip */}
                    <rect x="2.5" y="-28" width="1.5" height="14" rx="1" fill="rgba(255,255,255,0.3)"/>
                    {/* Pen barrel */}
                    <rect x="-4" y="-22" width="8" height="16" rx="2" fill="#D8D8D8"/>
                    {/* Metal band at bottom of barrel */}
                    <rect x="-4" y="-7" width="8" height="3.5" rx="0" fill="#FF5A2A" opacity="0.9"/>
                    {/* Nib / tip triangle */}
                    <polygon points="-3,-3.5 3,-3.5 0,0" fill="#B0B0B0"/>
                    {/* Ink-drop at very tip */}
                    <circle cx="0" cy="0" r="1.5" fill="#FF5A2A"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,90,42,1))' }}
                    />
                  </g>
                </motion.g>
              </svg>

              {/* ── Loading message with fade transition ── */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.28 }}
                  style={{
                    margin:         0,
                    font:          '10px var(--mono)',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color:         '#5a5a55',
                  }}
                >
                  {MESSAGES[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* ── Brand name watermark ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                position:       'absolute',
                bottom:         '32px',
                font:          '9px var(--mono)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color:         '#FF5A2A',
                zIndex:         10,
              }}
            >
              CS VERTEX SYSTEMS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Website content always rendered behind — avoids pop-in */}
      {children}
    </>
  )
}
