"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'

export function LiveVisitorCounter() {
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    // Initial random number between 12 and 45
    let current = Math.floor(Math.random() * 33) + 12
    setVisitors(current)

    const interval = setInterval(() => {
      // Fluctuate by -2 to +3
      const change = Math.floor(Math.random() * 6) - 2
      current = Math.max(8, current + change) // never drop below 8
      setVisitors(current)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (visitors === 0) return null

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      color: '#aaa',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{ position: 'relative', width: '8px', height: '8px' }}>
        <motion.div
          animate={{ scale: [1, 2], opacity: [0.8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#22C55E',
            borderRadius: '50%'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#22C55E',
          borderRadius: '50%'
        }} />
      </div>
      <Users size={12} style={{ color: '#888' }} />
      <span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={visitors}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ display: 'inline-block', fontWeight: 600, color: '#fff', marginRight: '4px' }}
          >
            {visitors}
          </motion.span>
        </AnimatePresence>
        online now
      </span>
    </div>
  )
}
