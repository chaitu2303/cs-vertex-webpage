"use client"

import React, { useState, useEffect } from 'react'

export function OpeningDayBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if within 24 hours of launch
    const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE 
      ? new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE).getTime() 
      : new Date().getTime()
      
    const now = new Date().getTime()
    const hoursSinceLaunch = (now - LAUNCH_DATE) / (1000 * 60 * 60)
    
    // Show banner if we are after launch but within 24 hours
    if (hoursSinceLaunch >= 0 && hoursSinceLaunch <= 24) {
      // Also check if they closed it
      const hasClosed = localStorage.getItem('csvertex_banner_closed')
      if (!hasClosed) {
        setIsVisible(true)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div style={{
      background: 'var(--acid, #c8ff00)',
      color: '#000',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 500,
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span style={{ 
          background: '#000', 
          color: 'var(--acid, #c8ff00)', 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '11px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Launch Event
        </span>
        <span>Welcome to CS Vertex! The First 25 users to start a project receive Founding Member Status.</span>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false)
          localStorage.setItem('csvertex_banner_closed', 'true')
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#000',
          cursor: 'pointer',
          padding: '4px',
          opacity: 0.6
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  )
}
