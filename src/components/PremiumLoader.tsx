'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export function PremiumLoader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 2-second minimum duration for the progress bar
    const duration = 2000;
    const intervalTime = 20; // Update every 20ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        // Slight delay before fading out
        setTimeout(() => setVisible(false), 300);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      pointerEvents: 'auto'
    }}>
      {/* Dynamic Backgrounds */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 90, 42, 0.1) 0%, transparent 60%)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Content */}
      <div className="loader-content" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loader-logo">
          <Image src="/logo-nav.png" alt="CS Vertex" width={180} height={60} style={{ objectFit: 'contain' }} priority />
        </div>
        
        <p className="loader-text">Building Modern Digital Systems</p>
        
        <div className="loader-progress-container">
          <div className="loader-progress-bar" style={{ width: \`\${progress}%\` }}>
            <div className="loader-progress-glow"></div>
          </div>
        </div>
        
        <div className="loader-percentage">{Math.floor(progress)}%</div>
      </div>

      <style>{`
        .loader-content {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .loader-logo {
          margin-bottom: 40px;
          animation: pulse-logo 2s infinite alternate;
        }

        .loader-text {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .loader-progress-container {
          width: 240px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .loader-progress-bar {
          height: 100%;
          background: var(--acid);
          box-shadow: var(--glow-acid);
          transition: width 0.05s linear;
          position: relative;
        }

        .loader-progress-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 50px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          animation: shimmer 1s infinite linear;
        }

        .loader-percentage {
          margin-top: 16px;
          font-family: var(--mono);
          font-size: 10px;
          color: var(--acid);
          letter-spacing: 0.1em;
        }

        @keyframes pulse-logo {
          0% { filter: drop-shadow(0 0 10px rgba(255, 90, 42, 0.2)); }
          100% { filter: drop-shadow(0 0 25px rgba(255, 90, 42, 0.6)); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
