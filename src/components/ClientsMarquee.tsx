"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ClientLogo {
  id: string
  companyName: string
  logoUrl: string
  altText?: string | null
  websiteUrl?: string | null
}

interface MarqueeProps {
  logos: ClientLogo[]
  reverse?: boolean
  pauseOnHover?: boolean
  speed?: number // seconds for one full scroll cycle
}

function LogoItem({ logo }: { logo: ClientLogo }) {
  const inner = (
    <div className="marquee-logo-item">
      <Image
        src={logo.logoUrl}
        alt={logo.altText || logo.companyName}
        width={140}
        height={52}
        loading="lazy"
        style={{ objectFit: 'contain', width: 'auto', height: '40px' }}
      />
    </div>
  )

  return logo.websiteUrl ? (
    <Link href={logo.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
      {inner}
    </Link>
  ) : (
    inner
  )
}

export function PremiumMarquee({ logos, reverse = false, pauseOnHover = true, speed = 28 }: MarqueeProps) {
  // Duplicate for seamless loop — need at least enough to fill screen twice
  const items = logos.length > 0 ? [...logos, ...logos, ...logos, ...logos] : []

  const animName = reverse ? 'marquee-reverse' : 'marquee-forward'
  const duration = `${speed}s`

  return (
    <div
      className={`marquee-track-wrapper${pauseOnHover ? ' marquee-pause-hover' : ''}`}
      style={{ '--marquee-duration': duration } as React.CSSProperties}
    >
      <div
        className="marquee-track"
        style={{
          animation: `${animName} var(--marquee-duration, ${duration}) linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((logo, i) => (
          <LogoItem key={`${logo.id}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  )
}

// Empty state placeholder row — shows CS VERTEX branding until admin adds logos
function PlaceholderRow() {
  // CS VERTEX repeated to fill the track
  const items = Array(12).fill('CS VERTEX')
  return (
    <div className="marquee-track-wrapper">
      <div className="marquee-track marquee-placeholder-animate">
        {[...items, ...items].map((_, i) => (
          <div key={i} className="marquee-logo-item marquee-placeholder-item">
            <span className="csv-placeholder-text">
              <span className="csv-dot">◆</span> CS VERTEX
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ClientsMarqueeProps {
  logos: ClientLogo[]
}

export function ClientsMarquee({ logos }: ClientsMarqueeProps) {
  const hasLogos = logos && logos.length > 0

  return (
    <div className="clients-marquee-section">
      <p className="clients-marquee-label">
        {hasLogos ? 'Trusted by Startups, Businesses & Organizations' : 'Trusted by Startups, Businesses & Organizations — Your logo could be featured here.'}
      </p>

      <div className="marquee-overflow">
        {hasLogos ? (
          <PremiumMarquee logos={logos} speed={28} />
        ) : (
          <PlaceholderRow />
        )}
      </div>

      <style>{`
        .clients-marquee-section {
          width: 100%;
          padding: 0;
          overflow: hidden;
        }
        .clients-marquee-label {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
          text-align: center;
          margin: 0 0 18px;
        }
        .marquee-overflow {
          overflow: hidden;
          position: relative;
          width: 100%;
          /* Fade edges */
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .marquee-track-wrapper {
          display: flex;
          overflow: hidden;
          width: 100%;
        }
        .marquee-track-wrapper.marquee-pause-hover:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
          min-width: max-content;
        }
        /* Keyframes */
        @keyframes marquee-forward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes marquee-placeholder-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-placeholder-animate {
          animation: marquee-placeholder-scroll 22s linear infinite;
        }

        /* Logo item styling */
        .marquee-logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 36px;
          filter: grayscale(100%) brightness(180%);
          opacity: 0.55;
          transition: filter 0.4s ease, opacity 0.4s ease, transform 0.3s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .marquee-logo-item:hover {
          filter: grayscale(0%) brightness(100%);
          opacity: 1;
          transform: scale(1.06);
        }
        /* CS VERTEX Placeholder text items */
        .marquee-placeholder-item {
          filter: none;
          opacity: 1;
        }
        .csv-placeholder-text {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 90, 42, 0.35);
          white-space: nowrap;
          padding: 5px 20px;
          border: 1px solid rgba(255, 90, 42, 0.12);
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.4s, border-color 0.4s;
        }
        .marquee-placeholder-item:hover .csv-placeholder-text {
          color: rgba(255, 90, 42, 0.7);
          border-color: rgba(255, 90, 42, 0.3);
        }
        .csv-dot {
          font-size: 7px;
          color: var(--acid);
          animation: csv-pulse 2.5s ease-in-out infinite;
        }
        @keyframes csv-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        /* Divider dots between items */
        .marquee-logo-item::after {
          content: '·';
          color: rgba(255,90,42,0.3);
          font-size: 18px;
          margin-left: 36px;
          display: inline-block;
        }
        .marquee-logo-item:last-child::after {
          display: none;
        }
      `}</style>
    </div>
  )
}
