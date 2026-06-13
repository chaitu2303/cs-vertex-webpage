"use client"

import { useState, useEffect, useRef } from 'react'

type Testimonial = {
  id: string
  clientName: string
  company: string | null
  feedback: string
  rating: number
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Chaitanya Krishna Y.',
    company: 'Desh Property (Next.js Web App)',
    rating: 5,
    feedback: 'Desh Property real estate website design chala bagundi. Next.js and API integration valla listings load dynamic ga complete solutions fast load avthundi.'
  },
  {
    id: 't2',
    clientName: 'Sravani Yerramreddy',
    company: 'Foodchain Supply IoT Project',
    rating: 5,
    feedback: 'Foodchain supply management project ki IoT system build chesaru. Temperature data and GPS values cloud directly dynamic edge nodes sync support core explain structure bagundi.'
  },
  {
    id: 't3',
    clientName: 'Naveen Kumar Penugonda',
    company: 'Smart Irrigation (ESP32 Edge)',
    rating: 5,
    feedback: 'ESP32 custom PCB hardware design dynamically perform chesthundi. Web dashboard nundi immediate control untundi. Student project support chala professional ga undhi.'
  },
  {
    id: 't4',
    clientName: 'Haritha Rao K.',
    company: 'AgriTech Sensor Network IoT',
    rating: 5,
    feedback: 'CS Vertex software capabilities super, agriculture smart sensor network simple and secure ga direct edge nodes nundi operate chesela build chesaru.'
  },
  {
    id: 't5',
    clientName: 'Pawan Kalyan M.',
    company: 'Industrial Automation IoT project',
    rating: 5,
    feedback: 'IoT sensors network deployment support complete solutions valla chala easy aindi. Telugu state engineering final year team core technical terms chala simple explain chesaru.'
  }
]

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Feedback Form State
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Fetch approved testimonials
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTestimonials(data)
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS)
        }
      })
      .catch(() => setTestimonials(FALLBACK_TESTIMONIALS))
  }, [])

  // Auto Slider
  useEffect(() => {
    if (testimonials.length === 0) return

    const startTimer = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % testimonials.length)
      }, 5000)
    }

    if (!isHovered) {
      startTimer()
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [testimonials.length, isHovered])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: name, company, email, rating, feedback: message })
      })

      if (!res.ok) throw new Error('Failed to submit')

      setStatus('success')
      setName('')
      setCompany('')
      setEmail('')
      setRating(5)
      setMessage('')

      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section id="testimonials" className="section-gap" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '40px 4vw' }}>
      <div className="section-index" style={{marginBottom: 30}}><i></i> <span>10</span> <span>/</span> <span>CLIENT TESTIMONIALS</span></div>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '40px' }}>Trusted By <em>Clients & Innovators</em></h2>
      <p style={{ color: '#555', maxWidth: '600px', marginBottom: '50px' }}>
        Real feedback from clients, collaborators, startups, and project stakeholders who worked with CS Vertex.
      </p>

      <div className="testimonials-container">
        {/* LEFT SIDE: Carousel (65%) */}
        <div 
          className="carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {testimonials.length > 0 && (
            <div className="carousel-slide">
              <div className="testimonial-card">
                <div className="stars">{'★'.repeat(testimonials[currentIndex].rating)}</div>
                <p className="feedback-text">"{testimonials[currentIndex].feedback}"</p>
                <div className="client-info">
                  <h4 className="client-name">{testimonials[currentIndex].clientName}</h4>
                  {testimonials[currentIndex].company && <span className="client-company">{testimonials[currentIndex].company}</span>}
                </div>
              </div>
            </div>
          )}
          
          <div className="carousel-controls">
            <button onClick={handlePrev} className="nav-btn">←</button>
            <div className="dots">
              {testimonials.map((_, idx) => (
                <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)}></span>
              ))}
            </div>
            <button onClick={handleNext} className="nav-btn">→</button>
          </div>
        </div>

        {/* RIGHT SIDE: Feedback Form (35%) */}
        <div className="feedback-form-wrapper">
          <h3>Share Your Feedback</h3>
          {status === 'success' ? (
            <div className="success-msg">
              <div className="success-icon">✓</div>
              <p>Thank you! Your feedback has been submitted for review.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Company / Organization" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group rating-stars-group">
                <span className="rating-label">Rating:</span>
                <div className="stars-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`star-pick-btn ${rating >= star ? 'active' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <textarea placeholder="Feedback Message" required rows={4} value={message} onChange={e => setMessage(e.target.value)}></textarea>
              </div>
              <button type="submit" disabled={status === 'loading'} className="submit-btn">
                {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
              </button>
              {status === 'error' && <p className="error-msg">Failed to submit. Please try again.</p>}
            </form>
          )}
        </div>
      </div>

      <style>{`
        .testimonials-container {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        .carousel-wrapper {
          flex: 0 0 70%;
          position: relative;
          max-height: 350px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .testimonial-card {
          background: rgba(11, 11, 11, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-left: 4px solid var(--acid);
          border-radius: 16px;
          padding: 30px;
          height: 100%;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          box-shadow: 0 10px 40px -10px rgba(255, 180, 0, 0.15);
          border-color: rgba(255, 180, 0, 0.3);
        }

        .stars {
          color: #ffb400;
          font-size: 20px;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .feedback-text {
          font-size: 18px;
          line-height: 1.6;
          color: #ddd;
          font-style: italic;
          flex-grow: 1;
        }

        .client-info {
          margin-top: 20px;
        }

        .client-name {
          font-size: 16px;
          color: #fff;
          margin: 0 0 5px 0;
        }

        .client-company {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: var(--acid);
          color: #000;
          border-color: var(--acid);
        }

        .dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dot.active {
          background: var(--acid);
          transform: scale(1.2);
        }

        .feedback-form-wrapper {
          flex: 0 0 calc(30% - 40px);
          background: rgba(11, 11, 11, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 30px 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,92,42,0.04);
          transition: all 0.3s ease;
        }
        .feedback-form-wrapper:hover {
          border-color: rgba(255, 92, 42, 0.3);
          box-shadow: 0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(255,92,42,0.08);
        }

        .feedback-form-wrapper h3 {
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 15px;
        }

        .feedback-form .form-group {
          margin-bottom: 18px;
        }

        .feedback-form input, .feedback-form textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          color: #fff;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .feedback-form input:focus, .feedback-form textarea:focus {
          border-color: var(--acid);
          box-shadow: 0 0 15px rgba(255, 92, 42, 0.25), inset 0 2px 4px rgba(0,0,0,0.3);
          background: rgba(255, 255, 255, 0.04);
        }

        .rating-stars-group {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px !important;
        }

        .rating-label {
          color: #888;
          font-size: 14px;
        }

        .stars-picker {
          display: flex;
          gap: 6px;
        }

        .star-pick-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.18);
          font-size: 26px;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
          text-shadow: none;
        }

        .star-pick-btn:hover {
          transform: scale(1.25);
        }

        .star-pick-btn.active {
          color: #ffb400;
          text-shadow: 0 0 12px rgba(255, 180, 0, 0.6);
        }

        .submit-btn {
          width: 100%;
          background: var(--acid);
          color: #000;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 15px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 92, 42, 0.35);
          background: #ff7547;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .success-msg {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 180, 0, 0.1);
          color: var(--acid);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 20px;
        }

        .success-msg p {
          color: #fff;
          line-height: 1.5;
        }

        .error-msg {
          color: #ff4444;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .testimonials-container {
            flex-direction: column;
          }
          
          .carousel-wrapper {
            flex: 1 1 100%;
            width: 100%;
          }

          .feedback-form-wrapper {
            flex: 1 1 100%;
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
