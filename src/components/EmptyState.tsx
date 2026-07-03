"use client"

import React from 'react'
import { motion } from 'framer-motion'

export function EmptyState({ message = "Coming Soon", height = "300px" }: { message?: string, height?: string }) {
  return (
    <div style={{ 
      height, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative',
      width: '100%',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      border: '1px dashed rgba(255,255,255,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* The Brush Stroke Background */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'absolute',
            top: '-10px',
            bottom: '-10px',
            left: '-20px',
            right: '-20px',
            background: 'var(--acid)',
            transformOrigin: 'left center',
            borderRadius: '4px',
            clipPath: 'polygon(0 10%, 100% 0, 95% 90%, 5% 100%)',
            zIndex: 0
          }}
        />
        
        {/* The Text */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            color: '#000', 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          {message}
        </motion.h3>
      </div>

      {/* Decorative brush splatters */}
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', top: '30%', left: '40%', width: '8px', height: '8px', background: 'var(--acid)', borderRadius: '50%' }} />
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }} style={{ position: 'absolute', top: '60%', right: '35%', width: '5px', height: '5px', background: 'var(--acid)', borderRadius: '50%' }} />
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} style={{ position: 'absolute', bottom: '40%', left: '45%', width: '12px', height: '4px', background: 'var(--acid)', borderRadius: '2px', transform: 'rotate(-45deg)' }} />
    </div>
  )
}
