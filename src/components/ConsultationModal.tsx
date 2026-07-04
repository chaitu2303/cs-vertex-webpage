"use client"

import React, { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    service: '',
    budget: '',
    timeline: '',
    description: ''
  })

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-consultation-modal', handleOpen)
    
    // Hash trigger if needed
    const checkHash = () => {
      if (window.location.hash === '#consultation') {
        setIsOpen(true)
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    
    return () => {
      window.removeEventListener('open-consultation-modal', handleOpen)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Reset after closing
      if (status === 'success') {
        setTimeout(() => {
          setStatus('idle')
          setFormData({ name: '', company: '', email: '', phone: '', country: '', service: '', budget: '', timeline: '', description: '' })
        }, 500)
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, status])

  const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Submission failed')
      
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      toast.error('Failed to submit request. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{ background: '#0B0B0B', borderRadius: '16px', border: '1px solid #333', width: '100%', maxWidth: '600px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <X size={16} strokeWidth={1.5} />
        </button>

        <div style={{ padding: '30px 40px', overflowY: 'auto' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }} className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--acid)', marginBottom: '20px' }}>
                <CheckCircle size={64} strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#fff' }}>Thank you!</h2>
              <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6 }}>Our team will contact you shortly.</p>
              <button onClick={() => setIsOpen(false)} style={{ marginTop: '30px', padding: '12px 24px', background: 'var(--acid)', color: '#000', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Request Consultation</h2>
              <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Fill out the details below and our team will get in touch.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input name="name" required placeholder="Full Name *" value={formData.name} onChange={updateForm} style={inputStyle} />
                  <input name="company" placeholder="Company Name" value={formData.company} onChange={updateForm} style={inputStyle} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input type="email" name="email" required placeholder="Email Address *" value={formData.email} onChange={updateForm} style={inputStyle} />
                  <input type="tel" name="phone" required placeholder="Phone Number *" value={formData.phone} onChange={updateForm} style={inputStyle} />
                </div>
                
                <input name="country" placeholder="Country" value={formData.country} onChange={updateForm} style={inputStyle} />
                
                <select name="service" required value={formData.service} onChange={updateForm} style={inputStyle}>
                  <option value="" disabled>Service Required *</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="AI Solutions">AI Solutions</option>
                  <option value="Cybersecurity / VAPT">Cybersecurity / VAPT</option>
                  <option value="IoT & Embedded">IoT & Embedded</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Other">Other</option>
                </select>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <select name="budget" value={formData.budget} onChange={updateForm} style={inputStyle}>
                    <option value="" disabled>Estimated Budget</option>
                    <option value="Under $5k">Under $5k</option>
                    <option value="$5k - $15k">$5k - $15k</option>
                    <option value="$15k - $50k">$15k - $50k</option>
                    <option value="$50k+">$50k+</option>
                    <option value="Not Sure">Not Sure</option>
                  </select>
                  <input name="timeline" placeholder="Timeline (e.g., 3 months)" value={formData.timeline} onChange={updateForm} style={inputStyle} />
                </div>

                <textarea name="description" required placeholder="Project Description *" rows={4} value={formData.description} onChange={updateForm} style={{ ...inputStyle, resize: 'vertical' }} />
                
                <button type="submit" disabled={status === 'loading'} style={{ padding: '16px', background: 'var(--acid)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', opacity: status === 'loading' ? 0.7 : 1 }}>
                  {status === 'loading' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit'
}
