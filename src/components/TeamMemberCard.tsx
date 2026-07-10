"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, Mail, Globe, Briefcase, Award, Code, MonitorSmartphone } from 'lucide-react'

import { TeamMember, resolveImage, LinkedInIcon, GitHubIcon } from '@/data/teamProfiles'
import Link from 'next/link'
/* ─── Team Card (grid tile) ──────────────────────────────────────────── */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const imageSrc = resolveImage(member)
  
  return (
    <>
      <Link href={`/team/${member.name.toLowerCase().split(' ')[0]}`} className="tmc-card" style={{ textDecoration: 'none' }}>
        {/* Photo */}
        <div className="tmc-card-photo">
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            quality={90}
            loading="lazy"
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
      </Link>

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
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      box-shadow 0.4s ease,
                      border-color 0.4s ease;
          position: relative;
        }
        .tmc-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,107,44,0.15);
          border-color: rgba(255,107,44,0.5);
          z-index: 2;
        }
        .tmc-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 2px;
          background: linear-gradient(135deg, transparent, rgba(255,107,44,0.5), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .tmc-card:hover::after {
          opacity: 1;
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
          display: none; /* Hide view profile button as whole card is clickable */
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
    </>
  )
}

