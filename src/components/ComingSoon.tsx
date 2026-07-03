"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export default function ComingSoon({ 
  title = "Coming Soon", 
  description = "This module is currently being built and will be available shortly." 
}: ComingSoonProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      background: '#0a0a0a',
      color: '#fff',
      padding: '40px'
    }}>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: '40px' }}
      >
        <img 
          src="/assets/robot_typing.png" 
          alt="3D Robot Typing" 
          style={{
            width: '300px',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(var(--acid-rgb, 170, 255, 0), 0.2)',
            border: '2px solid rgba(255,255,255,0.05)'
          }}
        />
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '32px', fontWeight: 700, marginBottom: '15px' }}
      >
        {title}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '16px', color: '#888', maxWidth: '500px', lineHeight: 1.6 }}
      >
        {description}
      </motion.p>
    </div>
  )
}
