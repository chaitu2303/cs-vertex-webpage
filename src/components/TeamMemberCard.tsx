"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, Mail, Globe, CheckCircle } from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────── */
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

type MemberProfile = {
  about: string
  skills: string[]
  focus: string[]
  portfolioUrl?: string
  objectPosition?: string
  objectScale?: number
}

/* ─── Per-member profile data ────────────────────────────────────────── */
const PROFILES: Record<string, MemberProfile> = {
  chaitanya: {
    about:
      'Passionate software developer and entrepreneur leading CS Vertex with a vision to build innovative software solutions, AI-powered applications, cybersecurity services, and enterprise technology products. Focused on continuous learning, innovation, and delivering practical digital solutions for startups and businesses.',
    skills: [
      'Full Stack Development', 'Artificial Intelligence', 'Machine Learning',
      'Python', 'Java', 'Web Development', 'Cybersecurity', 'Automation',
      'Startup Leadership', 'Product Strategy', 'Project Management',
    ],
    focus: [
      'Enterprise Software Development', 'AI Products',
      'Cybersecurity Solutions', 'Startup Growth', 'Student Technology Platform',
    ],
    portfolioUrl: 'https://chaitanya-kumar-sahu-portifolio.netlify.app/',
    objectPosition: 'center 0%',
    objectScale: 1.0,
  },
  nithish: {
    about:
      'Leading advanced software engineering initiatives with expertise in Artificial Intelligence, Machine Learning, Data Science, Product Architecture, and scalable enterprise solutions. Passionate about transforming innovative ideas into intelligent and reliable software products.',
    skills: [
      'AI / ML', 'Java', 'Python', 'Web Development', 'Data Science',
      'Product Engineering', 'Backend Architecture', 'Research & Innovation', 'Quantum Computing',
    ],
    focus: [
      'AI Solutions', 'Product Architecture', 'Research Projects',
      'Machine Learning', 'Enterprise Applications',
      'Student Technology Platform', 'Quantum Computing',
    ],
    objectPosition: 'center 0%',
    objectScale: 1.0,
  },
  vasant: {
    about:
      'Driving software architecture, backend engineering, scalable APIs, DevOps integration, and full-stack application development across enterprise projects with a focus on performance, reliability, and maintainability.',
    skills: [
      'Backend Development', 'React', 'Node.js', 'Python', 'Java',
      'AI / ML', 'Data Science', 'Databases', 'DevOps', 'Cloud Deployment',
    ],
    focus: [
      'Backend Systems', 'API Development', 'Full Stack Applications',
      'Cloud Deployment', 'Enterprise Software', 'Student Technology Platform',
    ],
    objectPosition: 'center 10%',
    objectScale: 1.0,
  },
  harish: {
    about:
      'Designing modern UI/UX experiences, intuitive digital interfaces, creative visuals, and engaging product experiences that strengthen the CS Vertex brand across web and digital platforms.',
    skills: [
      'UI / UX Design', 'Graphic Design', 'Motion Design', 'Figma',
      'Creative Direction', 'AI / ML', 'Java', 'Python', 'Web Development',
    ],
    focus: [
      'Product UI Design', 'Design Systems', 'User Experience',
      'Website Design', 'Creative Assets',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.05,
  },
  mahendra: {
    about:
      'Building intelligent embedded systems, IoT platforms, robotics integrations, and firmware solutions by combining hardware and software to create practical engineering applications.',
    skills: [
      'Embedded C', 'Arduino', 'ESP32', 'Raspberry Pi', 'IoT',
      'Robotics', 'Python', 'Java', 'AI / ML', 'Networking',
    ],
    focus: [
      'Embedded Projects', 'IoT Systems', 'Robotics',
      'Hardware Integration', 'Smart Devices',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.05,
  },
  sateesh: {
    about:
      'Managing operational excellence, project coordination, client communication, financial workflow planning, and execution. Supports software, AI, embedded systems, and enterprise teams through structured planning and business operations.',
    skills: [
      'Operations Management', 'Project Coordination', 'Client Relationship Management',
      'Financial Planning', 'Business Development', 'Process Optimization',
      'Team Coordination', 'Web Development',
    ],
    focus: [
      'Project Coordination', 'Client Communication', 'Documentation',
      'Workflow Management', 'Team Operations',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.25,
  },
}

function resolveProfile(name: string): MemberProfile {
  const n = name.toLowerCase()
  if (n.includes('chaitanya')) return PROFILES.chaitanya
  if (n.includes('nithish'))   return PROFILES.nithish
  if (n.includes('vasant'))    return PROFILES.vasant
  if (n.includes('harish'))    return PROFILES.harish
  if (n.includes('mahendra'))  return PROFILES.mahendra
  if (n.includes('sateesh') || n.includes('satish')) return PROFILES.sateesh
  return {
    about: '',
    skills: [],
    focus: [],
    objectPosition: 'center top',
    objectScale: 1,
  }
}

function resolveImage(member: TeamMember): string {
  if (member.image) return member.image
  const n = member.name.toLowerCase()
  if (n.includes('chaitanya')) return '/assets/team/founder_chaitanya.jpg'
  if (n.includes('nithish'))   return '/assets/team/founder_nithish.jpeg'
  if (n.includes('vasant'))    return '/assets/team/founder_vasant.jpeg'
  if (n.includes('harish'))    return '/assets/team/founder_harish.jpeg'
  if (n.includes('mahendra'))  return '/assets/team/founder_mahendra.jpg'
  if (n.includes('sateesh') || n.includes('satish')) return '/assets/team/founder_sateesh2.jpeg'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=222222&color=ffffff&size=500`
}

function resolveRoleBadge(role: string): string {
  const r = role.toLowerCase()
  if (r.includes('ceo') || r.includes('founder'))   return 'Founder'
  if (r.includes('product'))  return 'Product'
  if (r.includes('technical') || r.includes('tech')) return 'Engineering'
  if (r.includes('creative'))  return 'Design'
  if (r.includes('embedded') || r.includes('iot'))   return 'Hardware'
  return 'Operations'
}

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

/* ─── Profile Modal ──────────────────────────────────────────────────── */
function ProfileModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const profile  = resolveProfile(member.name)
  const imageSrc = resolveImage(member)
  const badge    = resolveRoleBadge(member.role)
  const hasGitHub    = !!member.githubUrl
  const hasPortfolio = !!profile.portfolioUrl

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="tmc-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} profile`}
    >
      <div className="tmc-modal" onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className="tmc-close" onClick={onClose} title="Close">
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* ── Unified Layout ── */}
        <div className="tmc-body">
          <div className="tmc-header-unified">
            <div className="tmc-photo-wrap">
              <Image
                src={imageSrc}
                alt={member.name}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transform: `scale(${profile.objectScale ?? 1})`,
                  transformOrigin: 'center top',
                }}
              />
              <div className="tmc-photo-glow" />
            </div>
            <h2 className="tmc-name">{member.name}</h2>
            <p className="tmc-role">{member.role}</p>
            <div className="tmc-mini-links">
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tmc-icon-btn" title="LinkedIn">
                  <LinkedInIcon />
                </a>
              )}
              {hasGitHub && (
                <a href={member.githubUrl!} target="_blank" rel="noopener noreferrer" className="tmc-icon-btn" title="GitHub">
                  <GitHubIcon />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="tmc-icon-btn" title="Email">
                  <Mail size={16} />
                </a>
              )}
              {hasPortfolio && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="tmc-icon-btn" title="Portfolio">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="tmc-content-unified">
            <section className="tmc-section">
              <h3 className="tmc-section-title">About</h3>
              <p className="tmc-about">{profile.about || member.bio}</p>
            </section>

            <section className="tmc-section">
              <h3 className="tmc-section-title">Core Skills</h3>
              <div className="tmc-chips">
                {(profile.skills.length > 0
                  ? profile.skills
                  : (member.expertise ?? '').split(',').map(s => s.trim()).filter(Boolean)
                ).map(skill => (
                  <span key={skill} className="tmc-chip">{skill}</span>
                ))}
              </div>
            </section>

            {profile.focus.length > 0 && (
              <section className="tmc-section">
                <h3 className="tmc-section-title">Current Focus</h3>
                <ul className="tmc-focus-list">
                  {profile.focus.map(item => (
                    <li key={item} className="tmc-focus-item">
                      <span className="tmc-check">
                        <CheckCircle size={14} strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── Scoped CSS ── */}
      <style>{`
        /* Overlay */
        .tmc-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: tmcFadeIn 0.22s ease forwards;
        }
        @keyframes tmcFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Modal shell */
        .tmc-modal {
          position: relative;
          background: #0c0c0c;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.9), 0 0 60px rgba(255, 90, 42, 0.06);
          animation: tmcSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,90,42,0.2) transparent;
        }
        .tmc-modal::-webkit-scrollbar { width: 4px; }
        .tmc-modal::-webkit-scrollbar-track { background: transparent; }
        .tmc-modal::-webkit-scrollbar-thumb { background: rgba(255,90,42,0.2); border-radius: 4px; }
        @keyframes tmcSlideIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Close button */
        .tmc-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #777;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s ease;
        }
        .tmc-close:hover {
          background: rgba(255,90,42,0.12);
          border-color: #FF5A2A;
          color: #FF5A2A;
          transform: rotate(90deg);
        }

        /* Unified Body */
        .tmc-body {
          display: flex;
          flex-direction: column;
        }

        .tmc-header-unified {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 24px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255,255,255,0.01);
        }

        .tmc-content-unified {
          padding: 30px 40px 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Photo */
        .tmc-photo-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.08);
          background: #111;
          margin-bottom: 20px;
        }
        .tmc-photo-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(255,90,42,0.15) 100%);
          pointer-events: none;
        }

        /* Name / role */
        .tmc-name {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .tmc-role {
          font-size: 13px;
          color: #aaa;
          margin: 0 0 16px;
          letter-spacing: 0.02em;
        }

        /* Mini icon links */
        .tmc-mini-links {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .tmc-icon-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #888;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tmc-icon-btn:hover {
          background: rgba(255,90,42,0.1);
          border-color: #FF5A2A;
          color: #FF5A2A;
        }

        /* Sections */
        .tmc-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }
        .tmc-section-title {
          font-size: 11px;
          font-family: var(--mono, monospace);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #FF5A2A;
          margin: 0;
        }

        /* About text */
        .tmc-about {
          font-size: 14px;
          color: #a8a8a3;
          line-height: 1.8;
          margin: 0;
          max-width: 600px;
        }

        /* Skill chips */
        .tmc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 600px;
        }
        .tmc-chip {
          font-size: 11px;
          font-family: var(--mono, monospace);
          color: #ccc;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 6px 14px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
          cursor: default;
        }
        .tmc-chip:hover {
          background: rgba(255,90,42,0.09);
          border-color: rgba(255,90,42,0.4);
          color: #FF5A2A;
        }

        /* Focus list */
        .tmc-focus-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .tmc-focus-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #b0b0aa;
        }
        .tmc-check {
          color: #FF5A2A;
          display: flex;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .tmc-content-unified {
            padding: 24px 20px 30px;
            gap: 24px;
          }
          .tmc-header-unified {
            padding: 30px 20px 24px;
          }
          .tmc-photo-wrap {
            width: 100px;
            height: 100px;
          }
          .tmc-name { font-size: 22px; }
          .tmc-role { font-size: 12px; }
          .tmc-about { font-size: 13px; }
          .tmc-focus-item { font-size: 13px; }
        }
      `}</style>
    </div>,
    document.body
  )
}

/* ─── Team Card (grid tile) ──────────────────────────────────────────── */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [modalOpen, setModalOpen] = useState(false)
  const profile   = resolveProfile(member.name)
  const imageSrc  = resolveImage(member)
  const badge     = resolveRoleBadge(member.role)

  return (
    <>
      <div className="tmc-card">
        {/* Photo */}
        <div className="tmc-card-photo">
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              transform: `scale(${profile.objectScale ?? 1})`,
              transformOrigin: 'center top',
            }}
          />
          <div className="tmc-card-photo-overlay" />
        </div>

        {/* Info */}
        <div className="tmc-card-info">
          <h3 className="tmc-card-name">{member.name}</h3>
          <p className="tmc-card-role">{member.role}</p>

          {/* Skill preview — first 3 chips */}
          <div className="tmc-card-chips">
            {profile.skills.slice(0, 3).map(s => (
              <span key={s} className="tmc-card-chip">{s}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="tmc-card-actions">
            <button className="tmc-card-btn" onClick={() => setModalOpen(true)}>
              View Profile
            </button>
            <div className="tmc-card-icons">
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tmc-card-icon" title="LinkedIn" onClick={e => e.stopPropagation()}>
                  <LinkedInIcon />
                </a>
              )}
              {member.githubUrl && (
                <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="tmc-card-icon" title="GitHub" onClick={e => e.stopPropagation()}>
                  <GitHubIcon />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="tmc-card-icon" title="Email" onClick={e => e.stopPropagation()}>
                  <Mail size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tmc-card {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          box-shadow: 0 8px 30px rgba(0,0,0,0.07);
          height: 100%;
        }
        .tmc-card:hover {
          transform: translateY(-7px);
          border-color: rgba(255,255,255,0.9);
          box-shadow: 0 20px 45px -10px rgba(0,0,0,0.14), 0 0 20px rgba(255,90,42,0.08);
        }

        .tmc-card-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #0b0b0b;
          overflow: hidden;
        }
        .tmc-card-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.18) 100%);
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .tmc-card:hover .tmc-card-photo-overlay {
          opacity: 0.6;
        }

        .tmc-card-info {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .tmc-card-name {
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 0 0 3px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .tmc-card-role {
          font-size: 12px;
          color: #e64a19;
          margin: 0 0 12px;
          line-height: 1.4;
          font-weight: 500;
        }

        .tmc-card-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
          flex: 1;
          align-content: flex-start;
        }
        .tmc-card-chip {
          font-size: 10px;
          font-family: var(--mono, monospace);
          color: #555;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.1);
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          cursor: default;
          white-space: nowrap;
        }
        .tmc-card:hover .tmc-card-chip {
          background: rgba(255,90,42,0.06);
          border-color: rgba(255,90,42,0.2);
          color: #c94010;
        }

        .tmc-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 14px;
          margin-top: auto;
        }
        .tmc-card-btn {
          background: none;
          border: 1px solid rgba(0,0,0,0.18);
          color: #222;
          padding: 7px 14px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .tmc-card-btn:hover {
          background: #111;
          border-color: #111;
          color: #fff;
        }

        .tmc-card-icons {
          display: flex;
          gap: 6px;
        }
        .tmc-card-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 7px;
          color: #555;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tmc-card-icon:hover {
          background: #FF5A2A;
          border-color: #FF5A2A;
          color: #fff;
        }
      `}</style>

      {modalOpen && <ProfileModal member={member} onClose={() => setModalOpen(false)} />}
    </>
  )
}
