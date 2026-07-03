"use client"

import { useEffect, useState, useRef } from 'react'

function AnimatedCounter({ end, duration }: { end: number, duration: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let start = 0
    const increment = end / (duration / 16)
    
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setCount(end)
            clearInterval(timer)
          } else {
            setCount(Math.floor(start))
          }
        }, 16)
        observer.disconnect()
      }
    })

    if (ref.current) observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count}</span>
}

export function LeadershipStats() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '60px', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '40px 0' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '48px', margin: '0 0 10px', color: 'var(--acid)', fontWeight: 'bold' }}>
          <AnimatedCounter end={6} duration={1000} />
        </h4>
        <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Core Team Members</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '48px', margin: '0 0 10px', color: 'var(--acid)', fontWeight: 'bold' }}>
          <AnimatedCounter end={100} duration={1500} /><span>%</span>
        </h4>
        <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Software + Hardware Expertise</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '48px', margin: '0 0 10px', color: 'var(--acid)', fontWeight: 'bold' }}>
          <AnimatedCounter end={2} duration={1000} />
        </h4>
        <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>AI, Robotics & IoT Specialists</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h4 style={{ fontSize: '48px', margin: '0 0 10px', color: 'var(--acid)', fontWeight: 'bold' }}>
          <AnimatedCounter end={4} duration={1500} /><span>+</span>
        </h4>
        <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Multi-domain Engineering Team</p>
      </div>

    </div>
  )
}
