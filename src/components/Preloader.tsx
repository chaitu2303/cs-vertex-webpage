"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Advanced cinematic load time
    const timer = setTimeout(() => setLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div 
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: '#050505', 
            zIndex: 999999, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Background Grid Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(212, 255, 62, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 255, 62, 0.15) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              perspective: '1000px',
              transform: 'rotateX(60deg) scale(2) translateY(-20%)',
              zIndex: 0
            }}
          />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <img 
                src="/assets/logo/csvertex-logo.png" 
                alt="CS Vertex" 
                style={{ width: '120px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(255,92,42,0.4))' }} 
              />
            </motion.div>

            <motion.div 
              style={{ display: 'flex', overflow: 'hidden' }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {"CS VERTEX".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { y: 40, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } }
                  }}
                  style={{ 
                    fontSize: '32px', 
                    fontWeight: 800, 
                    color: '#fff', 
                    letterSpacing: '8px',
                    marginRight: char === ' ' ? '16px' : '0'
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Glowing Loading Bar */}
            <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '40px', position: 'relative', overflow: 'hidden' }}>
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(90deg, transparent, var(--acid), transparent)',
                  width: '50%'
                }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{ fontSize: '12px', color: 'var(--acid)', marginTop: '16px', letterSpacing: '4px', textTransform: 'uppercase' }}
            >
              Initializing Systems...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
