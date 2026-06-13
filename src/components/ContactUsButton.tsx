"use client"

import React, { useState } from 'react'

export function ContactUsButton() {
  const [isOpen, setIsOpen] = useState(false)

  const channels = [
    {
      name: 'Email (Gmail)',
      value: 'hello@csvertex.com',
      icon: '✉',
      link: 'mailto:hello@csvertex.com',
      color: '#ff5c2a'
    },
    {
      name: 'WhatsApp Chat',
      value: '+91 72889 77131',
      icon: '💬',
      link: 'https://wa.me/917288977131',
      color: '#25D366'
    },
    {
      name: 'Direct Call',
      value: '+91 72889 77131',
      icon: '📞',
      link: 'tel:+917288977131',
      color: '#007AFF'
    },
    {
      name: 'Instagram',
      value: '@cs_vertex',
      icon: '📸',
      link: 'https://www.instagram.com/cs_vertex',
      color: '#E1306C'
    },
    {
      name: 'LinkedIn',
      value: 'CS Vertex',
      icon: '💼',
      link: 'https://www.linkedin.com/company/cs-vertex/',
      color: '#0077B5'
    }
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="footer-cta" 
        style={{ display: 'flex', border: 'none' }}
      >
        <span>Contact Us</span>
        <b>↗</b>
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0c0c0c',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,92,42,0.1)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--acid)'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '24px', fontWeight: 500, color: '#fff', marginBottom: '10px', fontFamily: 'var(--sans)' }}>
              Let's Connect
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px', fontFamily: 'var(--sans)', lineHeight: 1.5 }}>
              Choose your preferred channel to get in touch with the CS Vertex team. We typically respond within a few hours.
            </p>

            <div style={{ display: 'grid', gap: '15px' }}>
              {channels.map(channel => (
                <a 
                  key={channel.name} 
                  href={channel.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,92,42,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,92,42,0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span style={{ 
                    fontSize: '24px', 
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    color: channel.color
                  }}>
                    {channel.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'var(--sans)' }}>{channel.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', fontFamily: 'var(--mono)' }}>{channel.value}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#444', fontSize: '18px' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
