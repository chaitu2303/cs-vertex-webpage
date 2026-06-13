"use client"

import { useState, useRef, MouseEvent, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

type TeamMember = {
  id: string
  name: string
  role: string
  expertise: string | null
  bio: string
  image: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  email: string | null
}

function getDefaultExpertise(role: string): string {
  const r = role.toLowerCase();
  if (r.includes('ceo') || r.includes('founder')) {
    return 'Web Development (Full Stack), Cyber Security, Python Full Stack, and Java.';
  }
  if (r.includes('product') || r.includes('engineering lead')) {
    return 'Full-stack development, cloud architecture, system automation, and product lifecycle engineering.';
  }
  if (r.includes('technical lead') || r.includes('tech lead')) {
    return 'Scalable backend systems development, database optimization, API integration, and cloud architecture.';
  }
  if (r.includes('executive director') || r.includes('director')) {
    return 'High-fidelity UI/UX design, corporate branding, product prototyping, and visual identity systems.';
  }
  if (r.includes('robotics') || r.includes('embedded') || r.includes('iot')) {
    return 'ESP32 firmware engineering, custom PCB design, robotics hardware design, and smart IoT automation.';
  }
  if (r.includes('operations') || r.includes('coordinator')) {
    return 'Agile project management, operational workflow coordination, client relations, and delivery execution.';
  }
  return 'Full Stack Engineering, Product Strategy, Cloud Architecture';
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isModalOpen, setModalOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isModalOpen) {
      const handleScroll = () => setModalOpen(false)
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isModalOpen])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  function handleMouseLeave() {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--mouse-x', `-1000px`)
    cardRef.current.style.setProperty('--mouse-y', `-1000px`)
  }

  // Intercept the name and links to enforce overrides
  let displayName = member.name;
  if (displayName.toLowerCase().includes('mahendra')) {
    displayName = 'KALLA MAHENDRA NADHA';
  }
  
  // Custom links block
  let additionalLinks = null;
  if (displayName.toLowerCase().includes('chaitanya')) {
    additionalLinks = (
      <a href="https://chaitanya-kumar-sahu-portifolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="modal-connect-btn outline">
        Portfolio
      </a>
    )
  }

  // Parse skills
  const skillsArray = (member.expertise || getDefaultExpertise(member.role))
    .split(',')
    .map(s => s.trim().replace(/^and\s+/i, '').replace(/\.$/, ''))
    .filter(s => s.length > 0);

  return (
    <>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="premium-team-card"
      >
        <div className="card-spotlight"></div>
        
        <div className="card-inner">
          <div className="image-wrapper">
            <Image 
              src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=222222&color=ffffff&size=500`}
              alt={displayName}
              fill
              className="team-image"
              style={(displayName.toLowerCase().includes('nithish') || displayName.toLowerCase().includes('chaitanya')) ? { objectPosition: 'center 15%' } : undefined}
            />
          </div>
          
          <div className="card-content">
            <h3 className="member-name">{displayName}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-bio line-clamp-2">{member.bio}</p>
            
            <div className="card-actions">
              <button onClick={() => setModalOpen(true)} className="action-btn outline">
                View Profile
              </button>
              <div className="social-links">
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                )}
                {member.githubUrl ? (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                ) : (
                  <div className="social-icon disabled" title="GitHub Profile Coming Soon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                )}
                {member.email && (
                  <a href={`mailto:${member.email}`} className="social-icon" title="Email">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .premium-team-card {
          position: relative;
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: default;
        }

        .premium-team-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 180, 0, 0.4);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(255, 180, 0, 0.1);
        }

        .card-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          background: #0B0B0B;
        }

        .team-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .premium-team-card:hover .team-image {
          transform: scale(1.05);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 0 8px 8px;
        }

        .member-name {
          font-size: 22px;
          color: #fff;
          margin: 0 0 6px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .member-role {
          font-size: 13px;
          color: var(--acid);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 16px;
          font-weight: 500;
        }

        .member-bio {
          font-size: 14px;
          color: #F5F1EA;
          line-height: 1.6;
          margin: 0 0 24px;
          flex: 1;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
          margin-top: auto;
        }

        .action-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .action-btn:hover {
          background: #fff;
          color: #000;
        }

        .social-links {
          display: flex;
          gap: 8px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          color: #aaa;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          background: var(--acid);
          color: #000;
        }

        .social-icon.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.02);
        }

        .social-icon.disabled:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #aaa;
        }

        .card-spotlight {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 90, 42, 0.06), transparent 40%);
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1;
        }

        .premium-team-card:hover .card-spotlight {
          opacity: 1;
        }

        /* Modal specific styles */
        .modal-overlay-v2 {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          animation: fadeIn 0.2s ease-out;
        }
        
        .team-modal-v2 {
          background: #0B0B0B;
          border: 1px solid #333;
          border-radius: 16px;
          max-width: 850px;
          width: 100%;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          max-height: 85vh;
        }

        .modal-split-v2 {
          display: grid;
          grid-template-columns: 40% 60%;
          width: 100%;
          min-height: 450px;
        }

        .modal-img-col-v2 {
          background: #111;
          position: relative;
        }
        
        .modal-img-col-v2 img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }

        .modal-info-col-v2 {
          padding: 40px;
          background: #0B0B0B;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .modal-close-v2 {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.5);
          border: 1px solid #333;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .modal-close-v2:hover {
          background: var(--acid);
          color: #000;
          border-color: var(--acid);
        }

        .modal-connect-btn-v2 {
          padding: 12px 24px;
          background: var(--acid);
          color: #000;
          text-decoration: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          display: inline-block;
        }

        .modal-connect-btn-v2.outline {
          background: transparent;
          color: #fff;
          border: 1px solid #333;
        }

        .modal-connect-btn-v2.outline:hover {
          border-color: var(--acid);
          color: var(--acid);
        }

        .modal-connect-btn-v2.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: #333 !important;
          color: #888 !important;
        }

        @media (max-width: 768px) {
          .modal-overlay-v2 {
            display: block !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          .team-modal-v2 {
            position: fixed !important;
            inset: 0 !important;
            margin: auto !important;
            width: 90vw !important;
            max-width: 340px !important;
            height: fit-content !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
            border-radius: 12px !important;
            transform: none !important;
            z-index: 10000 !important;
          }
          .modal-split-v2 {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .modal-img-col-v2 {
            height: 240px !important;
            width: 100% !important;
            position: relative !important;
            border-bottom: 1px solid #222;
          }
          .modal-img-col-v2 img {
            position: absolute !important;
          }
          .modal-info-col-v2 {
            padding: 20px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            display: block !important;
          }
          .modal-member-name-v2 {
            font-size: 22px !important;
            margin-bottom: 4px !important;
          }
          .modal-member-role-v2 {
            font-size: 12px !important;
            margin-bottom: 12px !important;
          }
          .modal-connect-btn-v2 {
            padding: 10px 14px !important;
            font-size: 11px !important;
            margin-bottom: 6px !important;
          }
          .modal-close-v2 {
            top: 10px !important;
            right: 10px !important;
            width: 30px !important;
            height: 30px !important;
            font-size: 14px !important;
          }
        }
      `}</style>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="modal-overlay-v2" onClick={() => setModalOpen(false)}>
          <div className="team-modal-v2" onClick={e => e.stopPropagation()}>
            <button className="modal-close-v2" onClick={() => setModalOpen(false)}>✕</button>
            <div className="modal-split-v2">
              <div className="modal-img-col-v2">
                <Image 
                  src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=222222&color=ffffff&size=500`}
                  alt={displayName}
                  fill
                  style={{ objectFit: 'cover', objectPosition: (displayName.toLowerCase().includes('nithish') || displayName.toLowerCase().includes('chaitanya')) ? 'center 15%' : 'center center' }}
                />
              </div>
              <div className="modal-info-col-v2">
                <h2 className="modal-member-name-v2" style={{ fontSize: '32px', margin: '0 0 8px', color: '#FFFFFF', fontWeight: 500, letterSpacing: '-0.02em' }}>{displayName}</h2>
                <p className="modal-member-role-v2" style={{ color: '#FF5A2A', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px', fontWeight: 600 }}>{member.role}</p>
                <p style={{ fontSize: '15px', color: '#F5F1EA', lineHeight: 1.8, marginBottom: '35px' }}>
                  {member.bio}
                </p>
                
                <div style={{ marginBottom: '40px', flexGrow: 1 }}>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Core Expertise</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {skillsArray.map((skill, idx) => (
                       <div key={idx} style={{ color: '#F5F1EA', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ color: '#FF5A2A', fontSize: '18px', lineHeight: 1 }}>•</span> {skill}
                       </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="modal-connect-btn-v2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }}><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      LinkedIn
                    </a>
                  )}
                  {member.githubUrl ? (
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-connect-btn-v2 outline">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </a>
                  ) : (
                    <div className="modal-connect-btn-v2 outline disabled" title="GitHub Profile Coming Soon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </div>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="modal-connect-btn-v2 outline">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '8px', marginTop: '-2px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </a>
                  )}
                  {additionalLinks}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
