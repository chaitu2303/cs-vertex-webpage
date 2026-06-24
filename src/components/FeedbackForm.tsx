"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

import { submitFrontendFeedbackAction } from '@/app/actions/feedback'

export function FeedbackForm({ testimonials = [] }: { testimonials?: any[] }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', role: '', message: '' })
  
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please provide a rating!")
      return
    }
    
    setStatus('loading')
    const res = await submitFrontendFeedbackAction({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      message: formData.message,
      rating: rating
    })

    if (res.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="feedback" className="section-gap" style={{ background: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="feedback-container">
        
        <div style={{ zIndex: 2, paddingRight: '40px', display: 'flex', flexDirection: 'column' }} className="feedback-copy">
          <div>
            <div className="section-index" style={{marginBottom: 20}}><i></i> <span>08</span> <span>/</span> <span>FEEDBACK & REVIEWS</span></div>
            <h2 style={{ fontSize: 'clamp(40px, 6vw, 85px)', fontWeight: 500, letterSpacing: '-.065em', margin: 0, lineHeight: .93, color: 'var(--ink)' }}>
              <span style={{ color: 'var(--acid)' }}>Your</span> Voice <em style={{ fontWeight: 400, color: 'var(--ink)', fontStyle: 'normal' }}>Matters</em>
            </h2>
            <p style={{ marginTop: '20px', maxWidth: '400px', color: '#555', lineHeight: 1.8 }}>
              Help us shape the future of enterprise software and IoT. Your insights drive our engineering excellence.
            </p>
          </div>

          {testimonials.length > 0 && (
            <div style={{ marginTop: '60px', position: 'relative', background: '#0a0a0a', padding: '30px', borderRadius: '16px', border: '1px solid #222' }}>
              <Quote size={40} color="var(--acid)" style={{ opacity: 0.3, position: 'absolute', top: 20, right: 20 }} />
              
              <div style={{ height: '150px', position: 'relative' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < testimonials[currentSlide].rating ? "var(--acid)" : "transparent"} color={i < testimonials[currentSlide].rating ? "var(--acid)" : "#444"} />
                      ))}
                    </div>
                    <p style={{ color: '#eee', fontSize: '16px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{testimonials[currentSlide].feedback}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {testimonials[currentSlide].clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', margin: 0, fontSize: '14px' }}>{testimonials[currentSlide].clientName}</h4>
                        <span style={{ color: '#888', fontSize: '12px' }}>{testimonials[currentSlide].company || 'Client'}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => setCurrentSlide(prev => (prev - 1 + testimonials.length) % testimonials.length)} style={{ background: '#222', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                  <button onClick={() => setCurrentSlide(prev => (prev + 1) % testimonials.length)} style={{ background: '#222', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                </div>
              )}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="feedback-form-card"
          style={{ 
            background: 'rgba(11, 11, 11, 0.95)', 
            padding: '50px', 
            borderRadius: '16px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                <CheckCircle color="var(--acid)" size={64} style={{ margin: '0 auto 20px' }} />
                <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px' }}>Feedback Received</h3>
                <p style={{ color: '#888', lineHeight: 1.6 }}>Thank you for taking the time to share your thoughts. Our team will review your feedback shortly.</p>
                <button 
                  onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', role: '', message: '' }); setRating(0); }}
                  style={{ marginTop: '30px', padding: '12px 24px', background: 'transparent', border: '1px solid var(--acid)', color: 'var(--acid)', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                style={{ display: 'grid', gap: '25px' }}
              >
                <h3 style={{ color: '#fff', margin: '0 0 10px', fontSize: '22px', fontWeight: 500 }}>Share Your Experience</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="form-grid-inner">
                  <div style={{ position: 'relative' }}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = 'var(--acid)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', transition: 'border 0.3s' }} onFocus={(e) => e.target.style.borderColor = 'var(--acid)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <select name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                    <option value="" disabled>Select Your Role</option>
                    <option value="client">Enterprise Client</option>
                    <option value="student">Student / Learner</option>
                    <option value="partner">Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '10px' }}>Rate Your Experience</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <Star 
                          size={28} 
                          fill={(hoveredRating || rating) >= star ? 'var(--acid)' : 'transparent'}
                          color={(hoveredRating || rating) >= star ? 'var(--acid)' : '#444'}
                          style={{ transition: 'all 0.2s' }}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your experience..." rows={4} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--acid)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>

                <motion.button 
                  type="submit" 
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                  {status === 'loading' ? 'Submitting...' : (
                    <>Submit Feedback <Send size={18} /></>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '400px', fontWeight: 900, color: 'rgba(0,0,0,0.02)', pointerEvents: 'none', lineHeight: 1 }}>
        &quot;
      </div>

      <style>{`
        .feedback-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .feedback-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .feedback-copy {
            padding-right: 0 !important;
          }
          .form-grid-inner {
            grid-template-columns: 1fr !important;
          }
          .feedback-form-card {
            padding: 30px !important;
          }
        }
      `}</style>
    </section>
  )
}
