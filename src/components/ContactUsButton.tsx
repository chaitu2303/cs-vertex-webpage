"use client"

import React, { useState } from 'react'
import { Mail, MessageCircle, Phone, X, ArrowUpRight } from 'lucide-react'
import { Linkedin, Instagram } from '@/components/BrandIcons'

export function ContactUsButton() {
  const [isOpen, setIsOpen] = useState(false)

  const channels = [
    {
      name: 'Email (Gmail)',
      value: 'hello@csvertex.com',
      icon: <Mail size={24} strokeWidth={1.5} />,
      link: 'mailto:hello@csvertex.com',
      color: '#ff5c2a'
    },
    {
      name: 'WhatsApp Chat',
      value: '+91 72889 77131',
      icon: <MessageCircle size={24} strokeWidth={1.5} />,
      link: 'https://wa.me/917288977131',
      color: '#25D366'
    },
    {
      name: 'Direct Call',
      value: '+91 72889 77131',
      icon: <Phone size={24} strokeWidth={1.5} />,
      link: 'tel:+917288977131',
      color: '#007AFF'
    },
    {
      name: 'Instagram',
      value: '@cs_vertex',
      icon: <Instagram size={24} strokeWidth={1.5} />,
      link: 'https://www.instagram.com/cs_vertex',
      color: '#E1306C'
    },
    {
      name: 'LinkedIn',
      value: 'CS Vertex',
      icon: <Linkedin size={24} strokeWidth={1.5} />,
      link: 'https://www.linkedin.com/company/cs-vertex/',
      color: '#0077B5'
    }
  ]

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="footer-cta group" 
        style={{ display: 'flex', border: 'none' }}
      >
        <span>Contact Us</span>
        <ArrowUpRight size={18} strokeWidth={2} className="hover-orange-icon" />
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
            className="contact-modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0c0c0c',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,92,42,0.1)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="contact-close-btn"
              style={{
                position: 'absolute',
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--acid)'}
              onMouseLeave={e => e.currentTarget.style.color = '#888'}
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <h3 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 500, color: '#fff', marginBottom: '10px', fontFamily: 'var(--sans)' }}>
              Let's Connect
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', fontFamily: 'var(--sans)', lineHeight: 1.5 }}>
              Choose your preferred channel to get in touch with the CS Vertex team. We typically respond within a few hours.
            </p>

            <div className="contact-channels-grid">
              {channels.map(channel => (
                <a 
                  key={channel.name} 
                  href={channel.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-channel-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
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
                  <span className="contact-channel-icon" style={{ color: channel.color }}>
                    {channel.icon}
                  </span>
                  <div className="contact-channel-text">
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'var(--sans)', wordBreak: 'break-word' }}>{channel.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px', fontFamily: 'var(--mono)', wordBreak: 'break-word' }}>{channel.value}</div>
                  </div>
                  <span className="contact-channel-arrow" style={{ color: '#444', display: 'flex' }}>
                    <ArrowUpRight size={18} strokeWidth={1.5} className="hover-orange-icon" />
                  </span>
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
        
        .contact-modal-content {
          padding: 40px;
        }
        .contact-close-btn {
          top: 20px;
          right: 20px;
          padding: 8px;
        }
        .contact-channels-grid {
          display: grid;
          gap: 15px;
        }
        .contact-channel-btn {
          padding: 16px 20px;
          gap: 20px;
          min-height: 48px; /* Touch target minimum */
        }
        .contact-channel-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          flex-shrink: 0;
        }
        .contact-channel-text {
          flex: 1;
          min-width: 0; /* allows text truncation/wrapping */
        }
        .contact-channel-arrow {
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Responsive Mobile Adjustments */
        @media (max-width: 500px) {
          .contact-modal-content {
            padding: 24px;
            max-height: 90vh;
            overflow-y: auto;
          }
          .contact-close-btn {
            top: 12px;
            right: 12px;
          }
          .contact-channels-grid {
            gap: 12px;
          }
          .contact-channel-btn {
            padding: 12px 14px;
            gap: 14px;
          }
          .contact-channel-icon {
            width: 36px;
            height: 36px;
          }
        }
        
        @media (max-width: 360px) {
          .contact-modal-content {
            padding: 20px 16px;
          }
          .contact-channel-btn {
            padding: 12px;
            gap: 12px;
          }
        }
      `}</style>
    </>
  )
}
