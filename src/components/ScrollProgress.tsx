"use client"

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight
          const currentScroll = window.scrollY
          const progress = (currentScroll / totalHeight) * 100
          if (barRef.current) {
            barRef.current.style.width = `${progress}%`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={barRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #FF5C2A, #F43F5E, #8B5CF6, #3B82F6)',
      width: `0%`,
      zIndex: 99999,
      boxShadow: '0 0 15px rgba(255, 92, 42, 0.6)',
      transition: 'width 0.1s ease-out'
    }} />
  )
}
