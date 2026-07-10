import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Globe, Mail, ArrowLeft, Share2, Briefcase, Award, CheckCircle } from 'lucide-react'
import { PROFILES, resolveImage, resolveRoleBadge, LinkedInIcon, GitHubIcon } from '@/data/teamProfiles'
import { prisma } from '@/lib/prisma'

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  // Find member from DB first if dynamic matching
  const team = await prisma.teamMember.findMany({ where: { published: true } })
  const member = team.find(m => m.name.toLowerCase().includes(slug.toLowerCase()))
  
  if (!member) {
    notFound()
  }

  const profile = PROFILES[slug as keyof typeof PROFILES] || PROFILES.chaitanya
  const imageSrc = resolveImage(member)
  const skills = member.expertise ? member.expertise.split(',').map(s => s.trim()) : profile.skills
  const bio = member.bio || profile.about

  return (
    <div className="profile-page">
      {/* Sticky Header Navigation */}
      <nav className="profile-nav">
        <Link href="/about#leadership" className="back-btn">
          <ArrowLeft size={20} /> Back
        </Link>
        <button className="share-btn">
          <Share2 size={20} />
        </button>
      </nav>

      <main className="profile-content">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="avatar-container">
            <Image 
              src={imageSrc} 
              alt={member.name}
              fill
              className="avatar-img"
              style={{ objectPosition: profile.objectPosition || 'center top' }}
              unoptimized
            />
          </div>
          <h1 className="member-name">{member.name}</h1>
          <p className="member-role">{member.role}</p>
          <div className="verified-badge">
            <CheckCircle size={14} className="verified-icon" /> Verified Member
          </div>
          <div className="location">📍 India</div>
        </header>

        {/* Stats Strip */}
        <section className="stats-strip">
          <div className="stat">
            <span className="stat-val">{profile.stats.exp}</span>
            <span className="stat-lbl">Experience</span>
          </div>
          <div className="stat">
            <span className="stat-val">{profile.stats.projects}</span>
            <span className="stat-lbl">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-val">{profile.stats.skills}</span>
            <span className="stat-lbl">Skills</span>
          </div>
          <div className="stat">
            <span className="stat-val">{profile.stats.certs}</span>
            <span className="stat-lbl">Certificates</span>
          </div>
        </section>

        {/* About Section */}
        <section className="profile-section">
          <h2 className="section-title">About</h2>
          <p className="section-text">{bio}</p>
        </section>

        {/* Core Skills */}
        <section className="profile-section">
          <h2 className="section-title">Core Skills</h2>
          <div className="skills-grid">
            {skills.map((s: string) => (
              <span key={s} className="skill-chip">{s}</span>
            ))}
          </div>
        </section>

        {/* Tech Stack & Focus */}
        <section className="profile-section">
          <h2 className="section-title">Tech Stack & Focus</h2>
          <div className="skills-grid">
            {profile.focus.map((f: string) => (
              <span key={f} className="skill-chip alt">{f}</span>
            ))}
          </div>
        </section>

        {/* Experience & Projects */}
        <section className="profile-section two-col">
          <div>
            <h2 className="section-title">Experience</h2>
            <div className="timeline">
              {profile.experience.map((exp: any, i: number) => (
                <div key={i} className="timeline-item">
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

          <div>
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-list">
              {profile.featuredProjects.map((p: any, i: number) => (
                <div key={i} className="project-item">
                  <Briefcase size={16} className="proj-icon" />
                  <span className="proj-name">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Socials & Contact */}
        <section className="profile-section socials-section">
          <h2 className="section-title">Connect</h2>
          <div className="socials-grid">
            {member.portfolioUrl && member.portfolioUrl !== '#' && (
              <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="social-btn">
                <Globe size={18} /> Website
              </a>
            )}
            {member.githubUrl && (
              <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="social-btn">
                <GitHubIcon /> GitHub
              </a>
            )}
            {member.linkedinUrl && (
              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-btn">
                <LinkedInIcon /> LinkedIn
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="social-btn">
                <Mail size={18} /> Email
              </a>
            )}
          </div>
          
          <a href={`mailto:${member.email || 'hello@csvertex.com'}`} className="contact-btn">
            Contact {member.name.split(' ')[0]}
          </a>
        </section>
      </main>

      <style>{`
        .profile-page {
          min-height: 100dvh;
          background: var(--ink);
          color: #fff;
          display: flex;
          flex-direction: column;
        }

        .profile-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10,10,10,0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .back-btn, .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          background: rgba(255,255,255,0.1);
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          min-height: 48px;
          min-width: 48px;
          justify-content: center;
        }
        
        .share-btn {
          padding: 8px;
          border-radius: 50%;
        }

        .profile-content {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 24px;
        }

        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 40px;
        }

        .avatar-container {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 4px solid #141414;
          box-shadow: 0 0 0 2px var(--acid);
          overflow: hidden;
          margin-bottom: 24px;
          background: #111;
        }

        .avatar-img {
          object-fit: cover;
        }

        .member-name {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .member-role {
          font-size: 18px;
          color: var(--acid);
          font-weight: 600;
          margin: 0 0 12px;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,107,44,0.1);
          color: var(--acid);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .location {
          font-size: 14px;
          color: #888;
        }

        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          margin-bottom: 40px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .stat-lbl {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .profile-section {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .profile-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #666;
          font-weight: 700;
          margin: 0 0 20px;
        }

        .section-text {
          font-size: 16px;
          line-height: 1.8;
          color: #aaa;
          margin: 0;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-chip {
          font-size: 14px;
          color: #ddd;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 10px 16px;
          border-radius: 20px;
        }

        .skill-chip.alt {
          background: transparent;
          border-style: dashed;
          color: #888;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 8px;
          bottom: 8px;
          width: 1px;
          background: rgba(255,255,255,0.1);
        }

        .timeline-item {
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
          background: var(--acid);
          border: 2px solid #111;
        }

        .tl-role { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 4px; }
        .tl-org { font-size: 14px; color: #aaa; display: block; margin-bottom: 4px; }
        .tl-year { font-size: 13px; color: #666; font-family: var(--mono); }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .project-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .proj-icon { color: var(--acid); }
        .proj-name { font-size: 15px; font-weight: 500; color: #ddd; }

        .socials-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .socials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 24px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          min-height: 48px;
        }

        .contact-btn {
          width: 100%;
          background: var(--acid);
          color: #000;
          font-weight: 700;
          font-size: 16px;
          padding: 16px;
          border-radius: 12px;
          text-decoration: none;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .stats-strip {
            grid-template-columns: 1fr 1fr;
          }
          .two-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
