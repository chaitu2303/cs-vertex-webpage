"use client"

import React, { useEffect, useRef, useState } from 'react'

export function FadeUp({ children, delay = 0, duration = 0.6, yOffset = 40 }: { children: React.ReactNode, delay?: number, duration?: number, yOffset?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (domRef.current) observer.unobserve(domRef.current)
        }
      })
    }, { rootMargin: '0px 0px -50px 0px' })
    
    if (domRef.current) {
      observer.observe(domRef.current)
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current)
    }
  }, [])

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
}
