"use client"

import { useState } from 'react'

export function InternshipModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="primary-action"
        style={{ padding: '15px 30px', fontSize: '14px', background: 'var(--acid)', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span>Apply Now</span>
        <b>↗</b>
      </button>

      {isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: '#111', border: '1px solid #333', padding: '40px', maxWidth: '500px', width: '90%', textAlign: 'center', borderRadius: '10px', animation: 'slideUp 0.4s ease-out' }}>
            <h2 style={{ fontSize: '24px', color: 'var(--acid)', marginBottom: '20px' }}>Applications Currently Closed</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '30px' }}>
              We are not accepting internship applications at the moment. Future opportunities will be announced through the CS Vertex Learning Platform.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #555', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
