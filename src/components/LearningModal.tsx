"use client"

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function LearningModal({ buttonText = "Explore" }: { buttonText?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group"
        style={{ padding: '10px 20px', fontSize: '13px', background: 'transparent', color: 'var(--acid)', border: '1px solid var(--acid)', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--acid)'; e.currentTarget.style.color = '#000' }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--acid)' }}
      >
        <span>{buttonText}</span>
        <ArrowRight size={16} strokeWidth={2} />
      </button>

      {isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: '#111', border: '1px solid #333', padding: '50px 40px', maxWidth: '600px', width: '90%', textAlign: 'center', borderRadius: '12px', animation: 'slideUp 0.4s ease-out', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ width: '60px', height: '60px', background: 'var(--acid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000', fontSize: '24px' }}>
              ✦
            </div>
            <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '20px', letterSpacing: '-0.02em' }}>Coming Soon</h2>
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.7, marginBottom: '40px' }}>
              We are currently preparing high-quality learning experiences, internships, technical webinars, and industry-oriented courses. Stay tuned for updates.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ padding: '12px 30px', background: '#222', border: '1px solid #444', color: '#fff', cursor: 'pointer', borderRadius: '4px', fontSize: '14px', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#333'}
              onMouseOut={(e) => e.currentTarget.style.background = '#222'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
