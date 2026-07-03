"use client"

import { motion } from 'framer-motion'
import { Clock, GraduationCap, Wrench } from 'lucide-react'
import { InternshipApplyButton } from '@/components/RecruitmentButtons'
import Link from 'next/link'
import { useState } from 'react'

const LearningEmptyState = ({ title, icon: Icon }: { title: string, icon: any }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  
  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div style={{ background: '#111', padding: '40px', border: '1px solid #222', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
      <Icon color="var(--acid)" size={28} style={{ marginBottom: '20px' }} />
      <h3 style={{ color: '#FFFFFF', margin: '0 0 15px', fontSize: '26px' }}>{title}</h3>
      <p style={{ color: '#888', marginBottom: '25px' }}>{title} will be announced soon. Get notified when we launch.</p>
      
      {status === 'success' ? (
        <p style={{ color: 'var(--acid)', fontWeight: 600 }}>Thank you! We'll notify you soon.</p>
      ) : (
        <form onSubmit={handleNotify} style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, background: '#000', border: '1px solid #333', padding: '10px 15px', borderRadius: '8px', color: '#fff', outline: 'none' }}
            required
          />
          <button type="submit" disabled={status === 'loading'} style={{ background: 'var(--acid)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
            {status === 'loading' ? '...' : 'Notify Me'}
          </button>
        </form>
      )}
    </motion.div>
  )
}

interface LearningPlatformProps {
  internships?: any[]
  courses?: any[]
  workshops?: any[]
}

export function LearningPlatform({ internships = [], courses = [], workshops = [] }: LearningPlatformProps) {
  // Calculate status and parameters dynamically based on counts
  const internshipCount = internships.length
  const courseCount = courses.length
  const workshopCount = workshops.length

  const platforms = [
    {
      id: 'internships',
      title: 'Internships',
      description: 'Gain practical industry experience by working on real-world software, AI, IoT, robotics, and enterprise development projects under the guidance of experienced mentors.',
      buttonText: internshipCount > 0 ? 'Browse Internships' : 'OPENING SOON',
      statusText: internshipCount > 0 
        ? `${internshipCount} ${internshipCount === 1 ? 'internship' : 'internships'} available`
        : 'No internships available',
      icon: Clock,
      path: internshipCount > 0 ? '/learning/internships' : '#'
    },
    {
      id: 'courses',
      title: 'Courses',
      description: 'Structured technology learning programs designed to help students and professionals build strong foundations in modern software engineering, AI, cybersecurity, cloud technologies, and embedded systems.',
      buttonText: courseCount > 0 ? 'Browse Courses' : 'OPENING SOON',
      statusText: courseCount > 0 
        ? `${courseCount} ${courseCount === 1 ? 'course' : 'courses'} available`
        : 'No courses available',
      icon: GraduationCap,
      path: courseCount > 0 ? '/learning/courses' : '#'
    },
    {
      id: 'workshops',
      title: 'Workshops',
      description: 'Hands-on technical workshops focused on real-world implementation, problem-solving, engineering best practices, and emerging technologies.',
      buttonText: workshopCount > 0 ? 'Browse Workshops' : 'OPENING SOON',
      statusText: workshopCount > 0 
        ? `${workshopCount} upcoming ${workshopCount === 1 ? 'workshop' : 'workshops'}`
        : 'No workshops scheduled',
      icon: Wrench,
      path: workshopCount > 0 ? '/learning/workshops' : '#'
    }
  ]

  return (
    <section id="learning" className="systems section-gap">
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="systems-top">
          <div className="section-index" style={{marginBottom:0}}><i></i> <span>06</span> <span>/</span> <span>LEARNING PLATFORM</span></div>
          <p>MASTER MODERN TECHNOLOGY</p>
        </div>
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 85px)', fontWeight: 500, letterSpacing: '-.065em', margin: 0, lineHeight: .93, color: 'var(--acid)' }}>
            Learning <em style={{ fontWeight: 400, color: '#FFFFFF', fontStyle: 'normal' }}>Platform</em>
          </h2>
          <p style={{ marginTop: '20px', maxWidth: '600px', color: '#b0b0aa', lineHeight: 1.6 }}>Master modern technology stacks through our intensive courses, internships, and industry-expert workshops.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          {/* Internships Column */}
          {internshipCount > 0 ? (
            internships.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: 'var(--acid)', fontSize: '12px', padding: '4px 10px', background: 'rgba(212, 255, 62, 0.1)', borderRadius: '12px', fontWeight: 'bold' }}>AVAILABLE</span>
                  <span style={{ color: '#888', fontSize: '12px' }}><Clock size={12} style={{display:'inline', marginRight:'4px'}}/> {item.duration}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#aaa', fontSize: '14px', flexGrow: 1, marginBottom: '20px' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                  <span>Seats: {item.seats || 'Limited'}</span>
                  <span>{item.location || item.mode}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/learning/internships/${item.id}`} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Know More</Link>
                  <InternshipApplyButton className="internship-apply-button" />
                </div>
              </motion.div>
            ))
          ) : (
            <LearningEmptyState title="Internships" icon={Clock} />
          )}

          {/* Courses Column */}
          {courseCount > 0 ? (
            courses.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: 'var(--acid)', fontSize: '12px', padding: '4px 10px', background: 'rgba(212, 255, 62, 0.1)', borderRadius: '12px', fontWeight: 'bold' }}>AVAILABLE</span>
                  <span style={{ color: '#888', fontSize: '12px' }}><GraduationCap size={12} style={{display:'inline', marginRight:'4px'}}/> {item.duration}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#aaa', fontSize: '14px', flexGrow: 1, marginBottom: '20px' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                  <span>Price: ₹{item.price}</span>
                  <span>{item.level}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/learning/courses/${item.id}`} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Know More</Link>
                  <Link href={`/learning/courses/${item.id}/enroll`} style={{ flex: 1, textAlign: 'center', background: 'var(--acid)', color: '#000', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Enroll Now</Link>
                </div>
              </motion.div>
            ))
          ) : (
            <LearningEmptyState title="Courses" icon={GraduationCap} />
          )}

          {/* Workshops Column */}
          {workshopCount > 0 ? (
            workshops.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: 'var(--acid)', fontSize: '12px', padding: '4px 10px', background: 'rgba(212, 255, 62, 0.1)', borderRadius: '12px', fontWeight: 'bold' }}>UPCOMING</span>
                  <span style={{ color: '#888', fontSize: '12px' }}><Wrench size={12} style={{display:'inline', marginRight:'4px'}}/> {new Date(item.date).toLocaleDateString()}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#aaa', fontSize: '14px', flexGrow: 1, marginBottom: '20px' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                  <span>{item.location}</span>
                  <span>{item.time}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link href={`/learning/workshops/${item.id}`} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Know More</Link>
                  <Link href={`/learning/workshops/${item.id}/register`} style={{ flex: 1, textAlign: 'center', background: 'var(--acid)', color: '#000', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Register</Link>
                </div>
              </motion.div>
            ))
          ) : (
            <LearningEmptyState title="Workshops" icon={Wrench} />
          )}
        </div>
      </div>
    </section>
  )
}
