'use client'

import React, { useState, useEffect } from 'react'

const LOADER_MESSAGES = [
  "Securing Socket Connection...",
  "Synchronizing Database Ledger...",
  "Decrypting Workspace Session...",
  "Validating CSRF Authenticity...",
  "Readying Dashboard Layout..."
]

export function PremiumLoader() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // 1. Cycle status text messages
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADER_MESSAGES.length)
    }, 600)

    // 2. Start CSS opacity fade-out transition at 1.1s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1100)

    // 3. Fully unmount the loader from DOM at 1.45s
    const destroyTimer = setTimeout(() => {
      setVisible(false)
    }, 1450)

    return () => {
      clearInterval(msgInterval)
      clearTimeout(fadeTimer)
      clearTimeout(destroyTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: '#040404',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '36px',
      overflow: 'hidden',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: fadeOut ? 'none' : 'auto'
    }}>
      {/* Background Matrix Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 90, 42, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 90, 42, 0.01) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Volumetric Glowing Light Backing */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 90, 42, 0.06) 0%, transparent 70%)',
        filter: 'blur(35px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Central Content Container matching homescreen layout */}
      <div style={{ position: 'relative', width: '154px', height: '154px', zIndex: 2 }}>
        
        {/* Outer dashed rotating ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed rgba(255, 90, 42, 0.14)',
          borderRadius: '50%',
          animation: 'spinClockwise 12s linear infinite'
        }} />

        {/* Inner solid ring pulse */}
        <div style={{
          position: 'absolute',
          inset: '8px',
          border: '1px solid rgba(255, 90, 42, 0.09)',
          borderRadius: '50%',
          animation: 'pulseScaleRing 2.2s ease-in-out infinite'
        }} />

        {/* Counter-rotating dotted ring */}
        <div style={{
          position: 'absolute',
          inset: '16px',
          border: '1px dotted rgba(255, 255, 255, 0.04)',
          borderRadius: '50%',
          animation: 'spinCounter 18s linear infinite'
        }} />

        {/* Inner logo container with original brand logo */}
        <div style={{
          position: 'absolute',
          inset: '18px',
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid rgba(255, 90, 42, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 12px rgba(255, 90, 42, 0.2), 0 0 24px rgba(255, 90, 42, 0.1)',
          animation: 'pulseLogo 2s ease-in-out infinite',
          padding: '12px'
        }}>
          <img
            src="/assets/logo/csvertex-logo.png"
            alt="CS Vertex Logo"
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(255, 90, 42, 0.45))'
            }}
          />
        </div>
      </div>

      {/* Loading State & Status Messages */}
      <div style={{ textTransform: 'none', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <p style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#FF5A2A',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          animation: 'fadePulse 1.2s infinite'
        }}>
          SYSTEM ACTIVE
        </p>
        <p style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#888',
          letterSpacing: '0.04em',
          minHeight: '18px',
          transition: 'opacity 0.3s ease-in-out'
        }}>
          {LOADER_MESSAGES[msgIndex]}
        </p>
      </div>

      <style>{`
        @keyframes spinClockwise {
          100% { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulseScaleRing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,90,42,0.3)); }
          50% { transform: scale(1.03); filter: drop-shadow(0 0 16px rgba(255,90,42,0.6)); }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
