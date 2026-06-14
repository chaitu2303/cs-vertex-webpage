"use client"

import { motion } from 'framer-motion'
import { Clock, GraduationCap, Wrench } from 'lucide-react'
import Link from 'next/link'

const PLATFORMS = [
  {
    id: 'internships',
    title: 'Internships',
    description: 'Gain practical industry experience by working on real-world software, AI, IoT, robotics, and enterprise development projects under the guidance of experienced mentors.',
    button: 'OPENING SOON',
    icon: Clock,
    path: '#'
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Structured technology learning programs designed to help students and professionals build strong foundations in modern software engineering, AI, cybersecurity, cloud technologies, and embedded systems.',
    button: 'OPENING SOON',
    icon: GraduationCap,
    path: '#'
  },
  {
    id: 'workshops',
    title: 'Workshops',
    description: 'Hands-on technical workshops focused on real-world implementation, problem-solving, engineering best practices, and emerging technologies.',
    button: 'OPENING SOON',
    icon: Wrench,
    path: '#'
  }
]

export function LearningPlatform() {
  return (
    <section id="learning" className="systems section-gap">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="systems-top">
          <div className="section-index" style={{marginBottom:0}}><i></i> <span>06</span> <span>/</span> <span>LEARNING PLATFORM</span></div>
          <p>MASTER MODERN TECHNOLOGY</p>
        </div>
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 85px)', fontWeight: 500, letterSpacing: '-.065em', margin: 0, lineHeight: .93, color: 'var(--acid)' }}>
            Learning <em style={{ fontWeight: 400, color: '#050505', fontStyle: 'normal' }}>Platform</em>
          </h2>
          <p style={{ marginTop: '20px', maxWidth: '600px', color: '#050505', lineHeight: 1.6 }}>Master modern technology stacks through our intensive courses, internships, and industry-expert workshops.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          {PLATFORMS.map((platform, i) => (
            <motion.div 
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(255, 90, 42, 0.1)' }}
              style={{ 
                background: '#111111', 
                padding: '40px', 
                border: '1px solid #222', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
              }}
            >
              {/* Subtle Glow */}
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--acid)', filter: 'blur(80px)', opacity: 0.15, zIndex: -1 }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: '25px' }}>
                <motion.div 
                  animate={{ y: [0, -6, 0] }} 
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i }}
                  style={{ background: 'rgba(255, 90, 42, 0.1)', padding: '14px', borderRadius: '12px' }}
                >
                  <platform.icon color="var(--acid)" size={28} />
                </motion.div>
              </div>
              
              <h3 style={{ color: '#FFFFFF', margin: '0 0 15px', fontSize: '26px', fontWeight: 500 }}>{platform.title}</h3>
              <p style={{ color: '#F5F1EA', fontSize: '15px', marginBottom: '40px', lineHeight: 1.7, flexGrow: 1 }}>{platform.description}</p>
              
              <motion.a 
                href={platform.path}
                animate={{ 
                  rotateX: [0, 8, 0, -8, 0],
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 5px 15px rgba(255,90,42,0.15)",
                    "0 12px 25px rgba(255,90,42,0.4)",
                    "0 5px 15px rgba(255,90,42,0.15)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                style={{ 
                  display: 'block',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, var(--acid) 0%, #ff8a00 100%)', 
                  padding: '16px 20px', 
                  color: '#000', 
                  borderRadius: '8px',
                  font: '14px var(--mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  width: '100%',
                  fontWeight: 800,
                  border: '1px solid rgba(255,255,255,0.4)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {platform.button}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

