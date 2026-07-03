"use client"

import React from 'react'
import { RefreshCw } from 'lucide-react'

export function ReplayButton() {
  const handleReplay = () => {
    window.location.reload()
  }

  return (
    <button
      onClick={handleReplay}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 10000000,
        background: '#FF6A00',
        color: '#ffffff',
        border: 'none',
        borderRadius: '30px',
        padding: '12px 24px',
        fontWeight: 'bold',
        fontSize: '12px',
        letterSpacing: '0.05em',
        boxShadow: '0 4px 20px rgba(255, 106, 0, 0.4)',
        cursor: 'pointer',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'
        e.currentTarget.style.backgroundColor = '#ff8022'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.backgroundColor = '#FF6A00'
      }}
    >
      <RefreshCw size={14} strokeWidth={2} /> REPLAY PRELOADER
    </button>
  )
}
