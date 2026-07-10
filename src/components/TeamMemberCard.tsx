"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, Mail, Globe, Briefcase, Award, Code, MonitorSmartphone } from 'lucide-react'

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
  portfolioUrl: string | null
}

type MemberProfile = {
  about: string
  skills: string[]
  focus: string[]
  portfolioUrl?: string
  objectPosition?: string
  objectScale?: number
  stats: { projects: string; exp: string; skills: string; certs: string }
  experience: { role: string; org: string; year: string }[]
  featuredProjects: { name: string; url?: string }[]
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
    stats: { projects: '12+', exp: '5+', skills: '8', certs: '15+' },
    experience: [
      { role: 'Founder & CEO', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Software Engineer', org: 'Tech Innovators', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'CS Vertex Platform' },
      { name: 'Raksha Alert' },
      { name: 'FoodChain' }
    ]
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
    stats: { projects: '8+', exp: '4+', skills: '10', certs: '6+' },
    experience: [
      { role: 'Co-Founder & CTO', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'AI Researcher', org: 'AI Labs', year: '2022 - 2023' }
    ],
    featuredProjects: [
      { name: 'AI Analytics Engine' },
      { name: 'NeuralNet Optimizer' }
    ]
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
    stats: { projects: '15+', exp: '6+', skills: '12', certs: '4+' },
    experience: [
      { role: 'Lead Backend Engineer', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Cloud Architect', org: 'CloudSys', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'Scalable Microservices API' },
      { name: 'Data Pipeline Automation' }
    ]
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
    stats: { projects: '20+', exp: '5+', skills: '7', certs: '8+' },
    experience: [
      { role: 'Creative Director', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'UX Designer', org: 'Design Studio', year: '2020 - 2023' }
    ],
    featuredProjects: [
      { name: 'CS Vertex Rebrand' },
      { name: 'DeshProperty App Design' }
    ]
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
    stats: { projects: '10+', exp: '4+', skills: '9', certs: '3+' },
    experience: [
      { role: 'Embedded Systems Lead', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'IoT Engineer', org: 'Smart Devices Inc.', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'Smart Home Hub' },
      { name: 'Industrial IoT Sensor' }
    ]
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
    stats: { projects: '30+', exp: '7+', skills: '6', certs: '5+' },
    experience: [
      { role: 'Operations Manager', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Project Lead', org: 'Enterprise Solutions', year: '2019 - 2023' }
    ],
    featuredProjects: [
      { name: 'Agile Workflow Optimization' },
      { name: 'Client Portal Delivery' }
    ]
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
    stats: { projects: '0', exp: '0', skills: '0', certs: '0' },
    experience: [],
    featuredProjects: []
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

/* ─── Profile Modal ──────────────────────────────────────────────────── */
function ProfileModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const imageSrc = resolveImage(member)
  const profile = resolveProfile(member.name)
  
  // Use member data if provided in DB, else fallback to mock profile
  const skills = member.expertise ? member.expertise.split(',').map(s => s.trim()) : profile.skills
  const bio = member.bio || profile.about

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
      <div className="tmc-panel" onClick={e => e.stopPropagation()}>
        <button className="tmc-close-btn" onClick={onClose} title="Close (Esc)">
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* ── Header: Photo, Identity, Stats ── */}
        <div className="tmc-header">
           <div className="tmc-avatar-wrap">
             <Image
               src={imageSrc}
               alt={member.name}
               width={160}
               height={160}
               quality={100}
               priority
               className="tmc-avatar-img"
             />
             <div className="tmc-avatar-glow" />
           </div>
           
           <div className="tmc-identity">
             <h2 className="tmc-pname">{member.name}</h2>
             <p className="tmc-prole">{member.role}</p>
             <div className="tmc-location">📍 India</div>
           </div>

           <div className="tmc-stats-grid">
              <div className="tmc-stat-box">
                 <span className="stat-val">{profile.stats.exp}</span>
                 <span className="stat-lbl">Years Exp</span>
              </div>
              <div className="tmc-stat-box">
                 <span className="stat-val">{profile.stats.projects}</span>
                 <span className="stat-lbl">Projects</span>
              </div>
              <div className="tmc-stat-box">
                 <span className="stat-val">{profile.stats.skills}</span>
                 <span className="stat-lbl">Core Skills</span>
              </div>
              <div className="tmc-stat-box">
                 <span className="stat-val">{profile.stats.certs}</span>
                 <span className="stat-lbl">Certs</span>
              </div>
           </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="tmc-content-scroll">
          <div className="tmc-content-grid">
            
            {/* Left Column */}
            <div className="tmc-col tmc-col-left">
               <div className="tmc-block">
                 <h3 className="tmc-section-title">About</h3>
                 <p className="tmc-bio">{bio}</p>
               </div>

               <div className="tmc-block">
                 <h3 className="tmc-section-title">Core Skills</h3>
                 <div className="tmc-skill-wrap">
                   {skills.map(s => (
                     <span key={s} className="tmc-skill">{s}</span>
                   ))}
                 </div>
               </div>

               <div className="tmc-block">
                 <h3 className="tmc-section-title">Tech Stack & Focus</h3>
                 <div className="tmc-skill-wrap">
                   {profile.focus.map(f => (
                     <span key={f} className="tmc-skill alt">{f}</span>
                   ))}
                 </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="tmc-col tmc-col-right">
               <div className="tmc-block">
                 <h3 className="tmc-section-title">Experience</h3>
                 <div className="tmc-timeline">
                   {profile.experience.map((exp, i) => (
                     <div key={i} className="tmc-timeline-item">
                       <div className="tl-dot" />
                       <div className="tl-content">
                         <h4 className="tl-role">{exp.role}</h4>
                         <span className="tl-org">{exp.org}</span>
                         <span className="tl-year">{exp.year}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="tmc-block">
                 <h3 className="tmc-section-title">Featured Projects</h3>
                 <div className="tmc-projects">
                   {profile.featuredProjects.map((p, i) => (
                     <div key={i} className="tmc-project-item">
                       <Briefcase size={14} className="proj-icon" />
                       <span className="proj-name">{p.name}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ── Footer: CTAs & Socials ── */}
        <div className="tmc-footer">
           <div className="tmc-social-links">
             {(member.portfolioUrl && member.portfolioUrl !== '#') ? (
               <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="tmc-social-btn portfolio" title="Portfolio">
                 <Globe size={18} /> <span>Portfolio</span>
               </a>
             ) : null}
             
             {member.githubUrl && (
               <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="tmc-social-btn github" title="GitHub">
                 <GitHubIcon /> <span>GitHub</span>
               </a>
             )}
             
             {member.linkedinUrl && (
               <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tmc-social-btn linkedin" title="LinkedIn">
                 <LinkedInIcon /> <span>LinkedIn</span>
               </a>
             )}
             
             {member.email && (
               <a href={`mailto:${member.email}`} className="tmc-social-btn email" title="Email">
                 <Mail size={18} /> <span>Email</span>
               </a>
             )}
           </div>

           <a href={`mailto:${member.email || 'hello@csvertex.com'}`} className="tmc-hire-btn">
             Contact {member.name.split(' ')[0]}
           </a>
        </div>
      </div>

      <style>{`
        /* --- Premium Enterprise Modal Styles --- */
        .tmc-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: tmcFadeIn 0.3s ease forwards;
        }
        @keyframes tmcFadeIn { from { opacity:0 } to { opacity:1 } }

        .tmc-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1000px;
          height: 85vh;
          max-height: 800px;
          background: linear-gradient(180deg, rgba(20,20,20,0.95), rgba(10,10,10,0.98));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(255,107,44,0.08);
          animation: tmcPop 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes tmcPop {
          from { opacity:0; transform: scale(0.92) }
          to   { opacity:1; transform: scale(1) }
        }

        .tmc-close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .tmc-close-btn:hover {
          background: rgba(255,107,44,0.15);
          border-color: #FF6B2C;
          color: #fff;
          transform: rotate(90deg);
        }

        /* Header Area */
        .tmc-header {
           padding: 40px 40px 30px;
           display: flex;
           align-items: center;
           gap: 30px;
           border-bottom: 1px solid rgba(255,255,255,0.06);
           background: radial-gradient(circle at top left, rgba(255,107,44,0.05) 0%, transparent 50%);
        }
        
        .tmc-avatar-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, #FF6B2C, rgba(255,107,44,0.1));
          flex-shrink: 0;
        }
        .tmc-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: #111;
          border: 4px solid #141414;
        }
        .tmc-avatar-glow {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255,107,44,0.3) 0%, transparent 60%);
          z-index: -1;
        }

        .tmc-identity {
           flex: 1;
        }
        .tmc-pname {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .tmc-prole {
          font-size: 16px;
          color: #FF6B2C;
          margin: 0 0 8px;
          font-weight: 600;
        }
        .tmc-location {
          font-size: 13px;
          color: #888;
        }

        .tmc-stats-grid {
           display: flex;
           gap: 16px;
        }
        .tmc-stat-box {
           background: rgba(255,255,255,0.03);
           border: 1px solid rgba(255,255,255,0.06);
           padding: 12px 20px;
           border-radius: 12px;
           display: flex;
           flex-direction: column;
           align-items: center;
           min-width: 90px;
        }
        .stat-val { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .stat-lbl { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }

        /* Content Area */
        .tmc-content-scroll {
           flex: 1;
           overflow-y: auto;
           padding: 40px;
        }
        .tmc-content-grid {
           display: flex;
           gap: 60px;
        }
        .tmc-col { flex: 1; display: flex; flex-direction: column; gap: 40px; }
        
        .tmc-section-title {
           font-size: 12px;
           text-transform: uppercase;
           letter-spacing: 0.1em;
           color: #666;
           font-weight: 700;
           margin: 0 0 16px;
           padding-bottom: 8px;
           border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tmc-bio {
          font-size: 15px;
          color: #aaa;
          line-height: 1.8;
          margin: 0;
        }

        /* Skills */
        .tmc-skill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .tmc-skill {
          font-size: 13px;
          color: #ddd;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.2s ease;
          cursor: default;
        }
        .tmc-skill:hover {
          background: rgba(255,107,44,0.15);
          border-color: #FF6B2C;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255,107,44,0.1);
        }
        .tmc-skill.alt {
           background: transparent;
           border: 1px dashed rgba(255,255,255,0.2);
           color: #888;
        }

        /* Timeline */
        .tmc-timeline {
           display: flex;
           flex-direction: column;
           gap: 20px;
           position: relative;
        }
        .tmc-timeline::before {
           content: '';
           position: absolute;
           left: 5px;
           top: 10px;
           bottom: 10px;
           width: 1px;
           background: rgba(255,255,255,0.1);
        }
        .tmc-timeline-item {
           position: relative;
           padding-left: 24px;
        }
        .tl-dot {
           position: absolute;
           left: 0;
           top: 6px;
           width: 11px;
           height: 11px;
           border-radius: 50%;
           background: #FF6B2C;
           border: 2px solid #111;
        }
        .tl-role { font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 4px; }
        .tl-org { font-size: 13px; color: #aaa; display: block; margin-bottom: 2px; }
        .tl-year { font-size: 12px; color: #666; font-family: monospace; }

        /* Projects */
        .tmc-projects {
           display: flex;
           flex-direction: column;
           gap: 12px;
        }
        .tmc-project-item {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 12px 16px;
           background: rgba(255,255,255,0.03);
           border-radius: 8px;
           border: 1px solid rgba(255,255,255,0.05);
        }
        .proj-icon { color: #FF6B2C; }
        .proj-name { font-size: 14px; font-weight: 500; color: #ddd; }

        /* Footer */
        .tmc-footer {
           padding: 24px 40px;
           background: rgba(0,0,0,0.5);
           border-top: 1px solid rgba(255,255,255,0.08);
           display: flex;
           align-items: center;
           justify-content: space-between;
        }
        .tmc-social-links {
           display: flex;
           gap: 12px;
        }
        .tmc-social-btn {
           display: flex;
           align-items: center;
           gap: 8px;
           padding: 10px 16px;
           border-radius: 10px;
           font-size: 13px;
           font-weight: 600;
           color: #fff;
           text-decoration: none;
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.1);
           transition: all 0.2s ease;
        }
        .tmc-social-btn:hover {
           transform: translateY(-2px);
           box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }
        .tmc-social-btn.linkedin:hover { background: #0077b5; border-color: #0077b5; }
        .tmc-social-btn.github:hover { background: #333; border-color: #555; }
        .tmc-social-btn.portfolio:hover { background: #FF6B2C; border-color: #FF6B2C; color: #000; }
        .tmc-social-btn.email:hover { background: #ea4335; border-color: #ea4335; }

        .tmc-hire-btn {
           background: #FF6B2C;
           color: #000;
           padding: 12px 24px;
           border-radius: 10px;
           font-weight: 700;
           font-size: 14px;
           text-decoration: none;
           transition: 0.2s;
        }
        .tmc-hire-btn:hover {
           background: #fff;
           box-shadow: 0 8px 25px rgba(255,255,255,0.2);
           transform: translateY(-2px);
        }

        /* ── Mobile Layout ── */
        @media (max-width: 900px) {
           .tmc-panel { height: 95vh; max-height: unset; border-radius: 16px; }
           .tmc-header { flex-direction: column; text-align: center; padding: 40px 20px 30px; gap: 20px; }
           .tmc-stats-grid { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
           .tmc-content-grid { flex-direction: column; gap: 40px; }
           .tmc-content-scroll { padding: 30px 20px; }
           .tmc-footer { flex-direction: column; gap: 20px; padding: 20px; }
           .tmc-social-links { flex-wrap: wrap; justify-content: center; width: 100%; }
           .tmc-social-btn { flex: 1; justify-content: center; min-width: 120px; }
           .tmc-hire-btn { width: 100%; text-align: center; }
        }
      `}</style>
    </div>,
    document.body
  )
}

/* ─── Team Card (grid tile) ──────────────────────────────────────────── */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const imageSrc = resolveImage(member)
  
  return (
    <>
      <div className="tmc-card">
        {/* Photo */}
        <div className="tmc-card-photo">
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            quality={90}
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
          <div className="tmc-card-photo-overlay" />
        </div>

        {/* Info */}
        <div className="tmc-card-info">
          <h3 className="tmc-card-name">{member.name}</h3>
          <p className="tmc-card-role">{member.role}</p>

          {/* Actions */}
          <div className="tmc-card-actions">
            <button 
              className="tmc-card-btn"
              onClick={() => setIsModalOpen(true)}
              aria-label={`View ${member.name}'s profile`}
            >
              View Profile
            </button>
            <div className="tmc-card-icons">
              {member.portfolioUrl && member.portfolioUrl !== '#' && (
                <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="tmc-card-icon" title="Portfolio" onClick={e => e.stopPropagation()}>
                  <Globe size={14} />
                </a>
              )}
              {member.githubUrl && (
                <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="tmc-card-icon" title="GitHub" onClick={e => e.stopPropagation()}>
                  <GitHubIcon />
                </a>
              )}
              {member.linkedinUrl && (
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="tmc-card-icon" title="LinkedIn" onClick={e => e.stopPropagation()}>
                  <LinkedInIcon />
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
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          height: 100%;
        }
        .tmc-card:hover {
          transform: translateY(-7px);
          border-color: rgba(255, 107, 44, 0.3);
          box-shadow: 0 20px 45px -10px rgba(0,0,0,0.5), 0 0 20px rgba(255, 107, 44, 0.15);
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
          background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.8) 100%);
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .tmc-card:hover .tmc-card-photo-overlay {
          opacity: 0.9;
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
          color: #fff;
          margin: 0 0 3px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .tmc-card-role {
          font-size: 12px;
          color: #FF6B2C;
          margin: 0 0 12px;
          line-height: 1.4;
          font-weight: 500;
        }

        .tmc-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 14px;
          margin-top: auto;
        }
        .tmc-card-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ccc;
          padding: 7px 14px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .tmc-card-btn:hover {
          background: #FF6B2C;
          border-color: #FF6B2C;
          color: #000;
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          color: #aaa;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tmc-card-icon:hover {
          background: #FF6B2C;
          border-color: #FF6B2C;
          color: #fff;
        }
      `}</style>

      {isModalOpen && <ProfileModal member={member} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
