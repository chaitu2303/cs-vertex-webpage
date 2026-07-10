"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return
    setIsVisible(true)

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.1
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: '#FF5C2A',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999
        }}
      />
      <motion.div
        className="custom-cursor-ring"
        animate={{
          x: mousePosition.x - (isHovering ? 24 : 16),
          y: mousePosition.y - (isHovering ? 24 : 16),
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          backgroundColor: isHovering ? 'rgba(255, 92, 42, 0.1)' : 'transparent',
          border: isHovering ? '1px solid rgba(255, 92, 42, 0.5)' : '2px solid rgba(255, 92, 42, 0.8)',
          scale: isHovering ? 1.2 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          backdropFilter: isHovering ? 'blur(2px)' : 'none'
        }}
      />
      <style>{`
        /* Hide default cursor on interactive elements */
        body {
          cursor: none;
        }
        a, button, input, textarea, select {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}
