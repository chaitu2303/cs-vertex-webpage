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
      height: '3px',
      background: 'var(--acid)',
      width: `0%`,
      zIndex: 99999,
      boxShadow: '0 0 10px var(--acid)'
    }} />
  )
}
