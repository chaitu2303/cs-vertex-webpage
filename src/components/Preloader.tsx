"use client"

import React, { useState, useEffect, useRef } from 'react'
import './preloader.css'

interface PreloaderProps {
  onComplete?: () => void
  children?: React.ReactNode
}

export function Preloader({ onComplete, children }: PreloaderProps) {
  const [loading, setLoading] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 1. Resource Loading & Timer Logic
  useEffect(() => {
    // Skip preloader completely if already shown in this session
    // if (typeof window !== 'undefined' && sessionStorage.getItem('csvertex_preloader_done') === 'true') {
    //   setLoading(false)
    //   setVisible(true)
    //   if (onComplete) onComplete()
    //   return
    // }

    const startTime = Date.now()
    let progressVal = 0
    let targetProgress = 90
    let animationFrameId = 0
    let isFullyLoaded = false

    // Smoothly animate progress bar
    const animateProgress = () => {
      if (progressVal < targetProgress) {
        const diff = targetProgress - progressVal
        const speed = targetProgress === 100 ? 0.15 : 0.04
        progressVal += diff * speed + 0.08
        if (progressVal >= targetProgress) {
          progressVal = targetProgress
        }
        setProgress(Math.floor(progressVal))
      }
      animationFrameId = requestAnimationFrame(animateProgress)
    }
    
    animationFrameId = requestAnimationFrame(animateProgress)

    const checkResources = async () => {
      // Wait for DOM readystate complete
      if (document.readyState !== 'complete') {
        await new Promise((resolve) => {
          window.addEventListener('load', resolve, { once: true })
        })
      }

      // Wait for Web Fonts to be ready
      if ('fonts' in document) {
        await document.fonts.ready
      }

      // Wait for all active images in DOM to load
      const images = Array.from(document.querySelectorAll('img'))
      const imagePromises = images.map((img) => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        })
      })

      // Wait for all active videos in DOM to buffer sufficiently
      const videos = Array.from(document.querySelectorAll('video'))
      const videoPromises = videos.map((video) => {
        if (video.readyState >= 3) return Promise.resolve()
        return new Promise((resolve) => {
          video.addEventListener('canplay', resolve, { once: true })
          video.addEventListener('error', resolve, { once: true })
        })
      })

      await Promise.all([...imagePromises, ...videoPromises])
    }

    const onLoad = async () => {
      // Race resource checking with a 5s fallback timeout to prevent infinite hangs
      await Promise.race([
        checkResources(),
        new Promise((resolve) => setTimeout(resolve, 5000))
      ])

      isFullyLoaded = true
      targetProgress = 100

      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, 2500 - elapsed) // Enforce a 2.5s cinematic load time

      setTimeout(() => {
        // Wait for the progress bar to finish filling to 100%
        const checkFinished = setInterval(() => {
          if (progressVal >= 100) {
            clearInterval(checkFinished)
            cancelAnimationFrame(animationFrameId)
            
            // Step 1: Trigger Exit Animation
            setExiting(true)

            // Step 2: Hide preloader overlay and make content visible in sync
            setTimeout(() => {
              sessionStorage.setItem('csvertex_preloader_done', 'true')
              setLoading(false)
              setVisible(true)
              if (onComplete) onComplete()
            }, 1200) // matches overlay transition duration
          }
        }, 50)
      }, remainingTime)
    }

    onLoad()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // 2. Lock/Unlock Page Scroll
  useEffect(() => {
    if (loading) {
      document.body.style.setProperty('overflow', 'hidden', 'important')
    } else {
      document.body.style.removeProperty('overflow')
    }
    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [loading])

  // 3. Animate Website Content Reveal (when preloader completes)
  useEffect(() => {
    if (!loading) {
      // Trigger smooth CSS fade/scale zoom of homepage after preloader is unmounted
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    }
  }, [loading])

  // 4. Background Particle Canvas Animation
  useEffect(() => {
    if (!loading) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    interface Particle {
      x: number
      y: number
      size: number
      vy: number
      alpha: number
      targetAlpha: number
      fadeSpeed: number
    }

    const particles: Particle[] = []
    const maxParticles = 35

    const spawnParticle = (yPos = h + 10): Particle => ({
      x: Math.random() * w,
      y: yPos,
      size: Math.random() * 2 + 0.5,
      vy: -(Math.random() * 0.35 + 0.15),
      alpha: 0,
      targetAlpha: Math.random() * 0.35 + 0.05,
      fadeSpeed: Math.random() * 0.008 + 0.003
    })

    // Populate initial positions distributed vertically
    for (let i = 0; i < maxParticles; i++) {
      const p = spawnParticle(Math.random() * h)
      p.alpha = p.targetAlpha
      particles.push(p)
    }

    let frameId = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.vy

        // Fade in
        if (p.alpha < p.targetAlpha) {
          p.alpha += p.fadeSpeed
          if (p.alpha > p.targetAlpha) p.alpha = p.targetAlpha
        }

        // Fade out as it drifts into the upper 20% of viewport
        const topThreshold = h * 0.2
        if (p.y < topThreshold) {
          const ratio = Math.max(0, p.y / topThreshold)
          p.alpha = p.targetAlpha * ratio
        }

        // Render particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 106, 0, ${p.alpha})`
        ctx.fill()

        // Subtle bloom effect on larger micro-particles
        if (p.size > 1.2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 106, 0, ${p.alpha * 0.15})`
          ctx.fill()
        }

        // Recycle particle
        if (p.y < -15 || p.alpha <= 0) {
          particles[i] = spawnParticle()
        }
      }

      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [loading])

  return (
    <>
      {loading && (
        <div className={`preloader-overlay ${exiting ? 'preloader-exiting' : ''}`}>
          {/* Background particle field */}
          <canvas ref={canvasRef} className="preloader-canvas" />
          
          {/* Ambient center glow */}
          <div className="preloader-glow" />
          
          <div className="preloader-center">
            <div className="preloader-logo-wrap">
              {/* Original Logo */}
              <img 
                src="/assets/logo/csvertex-logo.png" 
                alt="CS Vertex" 
                className="preloader-logo-base"
              />
              {/* Reflective shine sweep overlay */}
              <div className="preloader-logo-shine" />
            </div>
            
            {/* Elegant tracking animated text */}
            <span className="preloader-text">CS VERTEX SYSTEMS ONLINE</span>

            {/* Fully rounded capsule progress bar */}
            <div className="preloader-progress-wrap">
              <div 
                className="preloader-progress-bar" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>
      )}
      {/* Render website content underneath (visible once preloader fades out) */}
      {children}
    </>
  )
}
