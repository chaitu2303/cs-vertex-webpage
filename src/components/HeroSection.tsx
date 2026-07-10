"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Mouse interaction state for tilt and glow effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  // Generate particles for the background
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }))

  return (
    <section 
      id="home" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      className="hero-section-wrapper"
    >
      {/* Dynamic Backgrounds */}
      <div className="hero-grid-bg" />
      
      {/* Moving Particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: 'rgba(255, 90, 42, 0.4)',
              borderRadius: '50%',
              boxShadow: 'var(--glow-acid)',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* Mouse Tracking Volumetric Glow */}
      <motion.div
        animate={{
          x: mousePosition.x * 400,
          y: mousePosition.y * 400,
          scale: isHovering ? 1.1 : 1
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        className="mouse-glow-orb"
      />

      <div className="container-1400 hero-content-grid">
        
        {/* Left Side: Typography & CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="hero-copy-wrapper"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="hero-status-pill"
          >
            <span className="status-dot" />
            <span className="status-text">CS Vertex System v2.0 Active</span>
          </motion.div>

          <h1 className="hero-h1">
            {['Enterprise', 'Digital', 'Engineering.'].map((word, i) => (
              <motion.span
                key={word}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                style={{ display: 'inline-block', marginRight: '16px', color: i === 1 ? 'var(--acid)' : '#fff' }}
              >
                {word}
                {i < 2 && <br/>}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="hero-lede-text"
          >
            We engineer secure software, AI-powered solutions, embedded systems, and modern digital platforms for startups, enterprises, and global businesses.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="hero-cta-group"
          >
            <motion.a 
              href="#consultation"
              whileHover={{ scale: 1.02, boxShadow: 'var(--glow-acid-hover)' }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary-glow"
            >
              Start Building
            </motion.a>
            <motion.a 
              href="#services"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline-glass"
            >
              Explore Services
            </motion.a>
          </motion.div>
          
          {/* Trust Badges */}
          <div className="trust-badges-row">
            {['MSME Registered', 'Secure Development', 'End-to-End Solutions', 'Remote Worldwide'].map(badge => (
              <div key={badge} className="trust-badge">
                <span className="trust-check">✓</span>
                <span className="trust-label">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Interactive Mockups (Parallax & Tilt) */}
        <motion.div 
          className="hero-mockups-wrapper"
          style={{ perspective: '1200px' }}
        >
          {/* Main Dashboard Mockup */}
          <motion.div
            animate={{
              rotateX: mousePosition.y * 20,
              rotateY: mousePosition.x * -20,
              x: mousePosition.x * -20,
              y: mousePosition.y * -20,
              z: 50
            }}
            transition={{ type: 'spring', stiffness: 75, damping: 20 }}
            className="mockup-dashboard"
          >
            <div className="mockup-header">
              <div className="mockup-dot red" />
              <div className="mockup-dot yellow" />
              <div className="mockup-dot green" />
            </div>
            <Image 
              src="/assets/vertex-hero.png" 
              alt="Dashboard" 
              width={800} 
              height={450} 
              className="mockup-img"
            />
            {/* Overlay Gradient for realism */}
            <div className="mockup-glass-overlay" />
          </motion.div>

          {/* Floating UI Element 1 */}
          <motion.div
            animate={{
              x: mousePosition.x * -60,
              y: mousePosition.y * -60,
              rotateZ: -5
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="floating-widget system-nominal"
          >
            <div className="widget-label">SYSTEM STATUS</div>
            <div className="widget-value">All Systems Nominal</div>
            <div className="widget-progress-track">
              <div className="widget-progress-fill" />
            </div>
          </motion.div>

          {/* Floating UI Element 2 */}
          <motion.div
            animate={{
              x: mousePosition.x * 80,
              y: mousePosition.y * 80,
              rotateZ: 5
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="floating-widget deploy-status"
          >
            <div className="deploy-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--acid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <div className="deploy-title">Deployed</div>
              <div className="deploy-version">v2.0.4</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .hero-section-wrapper {
          position: relative;
          min-height: 90vh; /* Re-tuned to 80-90% viewport */
          display: flex;
          align-items: center;
          background: var(--ink);
          overflow: hidden;
          padding-top: var(--spacing-5);
        }
        
        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          z-index: -1;
          pointer-events: none;
        }

        .particles-container {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .mouse-glow-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255, 90, 42, 0.12) 0%, transparent 60%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .hero-content-grid {
          position: relative;
          z-index: 100;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: var(--spacing-5);
          align-items: center;
        }

        .hero-copy-wrapper {
          padding-right: var(--spacing-5);
        }

        .hero-status-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-1);
          padding: 6px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          margin-bottom: var(--spacing-4);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--acid);
          box-shadow: 0 0 10px var(--acid);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(255, 90, 42, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(255, 90, 42, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 90, 42, 0); }
        }

        .status-text {
          font-family: var(--mono);
          font-size: 11px;
          color: #888;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-h1 {
          font-size: clamp(48px, 6vw, 84px);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin: 0 0 var(--spacing-3) 0;
          color: #fff;
        }

        .text-acid {
          color: var(--acid);
        }

        .hero-lede-text {
          font-size: clamp(16px, 1.5vw, 18px);
          line-height: 1.6;
          color: #888;
          max-width: 540px;
          margin-bottom: var(--spacing-5);
        }

        .hero-cta-group {
          display: flex;
          gap: var(--spacing-3);
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: var(--spacing-4);
        }

        .btn-primary-glow {
          background: #fff;
          color: #000;
          padding: 16px 32px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: var(--transition-normal);
        }

        .btn-outline-glass {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 16px 32px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.02em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-decoration: none;
          transition: var(--transition-normal);
        }

        .btn-outline-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .trust-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-3);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trust-check {
          color: var(--acid);
          font-size: 11px;
          font-weight: 700;
        }

        .trust-label {
          color: #777;
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-mockups-wrapper {
          position: relative;
          height: 600px;
          width: 100%;
        }

        .mockup-dashboard {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: auto;
          transform-style: preserve-3d;
          z-index: 2;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #111;
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.05);
          overflow: hidden;
          margin-left: -60%;
          margin-top: -35%;
        }

        .mockup-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 8px;
          background: rgba(0,0,0,0.5);
        }

        .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-dot.red { background: #FF5C5C; }
        .mockup-dot.yellow { background: #FFBD44; }
        .mockup-dot.green { background: #00CA4E; }

        .mockup-img {
          width: 100%;
          height: auto;
          display: block;
          opacity: 0.8;
        }

        .mockup-glass-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(255,255,255,0.02) 100%);
          pointer-events: none;
        }

        .floating-widget {
          position: absolute;
          padding: var(--spacing-2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-sm);
          z-index: 3;
        }

        .system-nominal {
          top: 20%;
          left: -10%;
          width: 200px;
          background: rgba(20, 20, 20, 0.8);
          box-shadow: var(--shadow-md);
        }

        .widget-label {
          font-size: 10px;
          color: var(--acid);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          font-family: var(--mono);
        }

        .widget-value {
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }

        .widget-progress-track {
          margin-top: 10px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .widget-progress-fill {
          width: 75%;
          height: 100%;
          background: var(--acid);
        }

        .deploy-status {
          bottom: 15%;
          right: -15%;
          width: 180px;
          background: rgba(255, 90, 42, 0.9);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: var(--glow-acid);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .deploy-icon-wrap {
          width: 36px;
          height: 36px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .deploy-title {
          font-size: 13px;
          color: #000;
          font-weight: 700;
        }

        .deploy-version {
          font-size: 11px;
          color: rgba(0,0,0,0.7);
          font-family: var(--mono);
        }

        @media (max-width: 900px) {
          .hero-section-wrapper {
            padding-top: 20px;
            min-height: 85vh; /* Fixing the mobile blank space issue */
            display: flex;
            align-items: flex-start;
          }
          .hero-content-grid {
            grid-template-columns: 1fr;
            text-align: left;
            padding-top: var(--spacing-5);
            margin-top: 50px;
          }
          .hero-h1 {
            font-size: clamp(40px, 8vw, 56px);
          }
          .hero-mockups-wrapper {
            height: 400px;
            margin-top: var(--spacing-5);
          }
          .mockup-dashboard {
            width: 100%;
            margin-left: -50%;
            margin-top: -20%;
          }
          .system-nominal { left: 5%; top: 10%; }
          .deploy-status { right: 5%; bottom: 10%; }
        }
      `}</style>
    </section>
  )
}
