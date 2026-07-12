"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Share2, Download, Eye, Maximize2, ZoomIn, ZoomOut, X, Calendar, Clock, Tag, Flame, Star, ExternalLink } from 'lucide-react'

const CATEGORIES_COLORS: Record<string, string> = {
  'Announcement': '#3B82F6',
  'Offer': '#F59E0B',
  'Brochure': '#8B5CF6',
  'Packages': '#10B981',
  'Recruitment': '#EF4444',
  'Internship': '#06B6D4',
  'Webinar': '#EC4899',
  'Event': '#F97316',
  'Festival Offer': '#FBBF24',
  'Product Launch': '#6366F1',
  'Company Update': '#FF6B2C',
  'Marketing': '#84CC16',
  'Others': '#6B7280',
}

function getCategoryColor(cat: string) {
  return CATEGORIES_COLORS[cat] || '#FF6B2C'
}

function isExpired(endDate?: string | null) {
  if (!endDate) return false
  return new Date(endDate) < new Date()
}

export function AnnouncementsSlider({ announcements }: { announcements: any[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  
  // Progress bar state
  const [progress, setProgress] = useState(0)

  // Filter active, non-expired, published only
  const active = announcements.filter(a =>
    a.published !== false &&
    a.status !== 'Hidden' &&
    a.status !== 'Archived' &&
    !isExpired(a.endDate)
  ).sort((a, b) => (b.priority || 0) - (a.priority || 0) || (a.order || 0) - (b.order || 0))

  const total = active.length
  const totalRef = useRef(total)
  totalRef.current = total

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % Math.max(1, totalRef.current))
    setProgress(0)
  }, [])
  
  const goPrev = useCallback(() => {
    setCurrent(c => (c === 0 ? totalRef.current - 1 : c - 1))
    setProgress(0)
  }, [])

  useEffect(() => { setMounted(true) }, [])

  // Autoplay and Progress Bar
  useEffect(() => {
    if (paused || lightboxOpen || total <= 1) return
    const interval = 50 // Update every 50ms
    const duration = 8000 // 8 seconds per slide
    const step = (interval / duration) * 100

    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goNext()
          return 0
        }
        return prev + step
      })
    }, interval)
    return () => clearInterval(id)
  }, [paused, lightboxOpen, total, goNext])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
      setZoomLevel(1)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  // Swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev() }
    setTouchStart(null); setTouchEnd(null)
  }

  const handleCopyLink = () => {
    const link = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard')
  }

  if (!mounted || total === 0) return null

  return (
    <section
      id="announcements"
      className="nb-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="nb-container">
        {/* Header */}
        <div className="nb-header">
          <div>
            <div className="section-index" style={{marginBottom: 10, paddingLeft: 0}}>
              <i></i> <span>09</span> <span>/</span> <span>NOTICE BOARD</span>
            </div>
            <h2 className="nb-title">
              Company <span style={{ color: '#ffffff' }}>Update</span>
            </h2>
          </div>
          {total > 1 && (
            <div className="nb-nav-btns">
              <button className="nb-nav" onClick={goPrev} aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <span className="nb-counter">{current + 1} / {total}</span>
              <button className="nb-nav" onClick={goNext} aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {total > 1 && (
          <div className="nb-progress-container">
            <div className="nb-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Slider */}
        <div
          className="nb-viewport"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="nb-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {active.map((ann, i) => {
              const catColor = getCategoryColor(ann.category)
              
              // Mock data for metadata
              const readTime = ann.content ? Math.max(1, Math.ceil(ann.content.length / 250)) : 2
              const views = 581 + (i * 42)
              const downloads = 124 + (i * 15)

              return (
                <div key={ann.id} className="nb-slide" aria-hidden={i !== current}>
                  <div className="nb-card" style={{ '--cat-color': catColor } as React.CSSProperties}>
                    
                    {/* priority/featured badges */}
                    <div className="nb-badges">
                       {ann.priority >= 5 && (
                        <div className="nb-badge-priority">
                          <Flame size={12} /> Priority
                        </div>
                      )}
                      {ann.isFeatured && (
                        <div className="nb-badge-featured">
                          <Star size={12} /> Featured
                        </div>
                      )}
                    </div>

                    {/* Image panel */}
                    {ann.fileUrl && (
                      <div className="nb-img-wrap" onClick={() => setLightboxOpen(true)}>
                        <div className="nb-img-inner">
                           <img
                            src={ann.fileUrl}
                            alt={ann.title || 'Announcement'}
                            className="nb-img"
                            loading="lazy"
                          />
                          <div className="nb-img-zoom-hint">
                            <Maximize2 size={24} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content panel */}
                    <div className="nb-content">
                      
                      <div className="nb-meta-grid">
                        <div className="nb-meta-item">
                           <Calendar size={14} />
                           <span>Published {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'July 10, 2026'}</span>
                        </div>
                        <div className="nb-meta-item">
                           <Tag size={14} />
                           <span>{ann.category}</span>
                        </div>
                        <div className="nb-meta-item">
                           <Clock size={14} />
                           <span>{readTime} min read</span>
                        </div>
                        <div className="nb-meta-item">
                           <Eye size={14} />
                           <span>{views} Views</span>
                        </div>
                      </div>

                      {ann.title && <h3 className="nb-card-title">{ann.title}</h3>}
                      
                      <div className="nb-desc-wrapper">
                        {ann.subtitle && <p className="nb-subtitle">{ann.subtitle}</p>}
                        {ann.content && <p className="nb-desc">{ann.content}</p>}
                      </div>

                      {/* CTAs */}
                      <div className="nb-ctas">
                        {ann.fileUrl && (
                          <button
                            onClick={() => setLightboxOpen(true)}
                            className="nb-cta-btn primary"
                          >
                            <span className="cta-icon"><Maximize2 size={16} /></span>
                            <span className="cta-text">View Poster</span>
                          </button>
                        )}
                        
                        {ann.fileUrl && (
                          <a
                            href={ann.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nb-cta-btn secondary"
                          >
                            <span className="cta-icon"><Download size={16} /></span>
                            <span className="cta-text">Download PDF <span className="cta-sub">({Math.floor((downloads * 0.05) + 1)} MB)</span></span>
                          </a>
                        )}

                        <button
                          onClick={handleCopyLink}
                          className="nb-cta-btn secondary"
                        >
                          <span className="cta-icon"><Share2 size={16} /></span>
                          <span className="cta-text">Share Link</span>
                        </button>
                        
                        {ann.buttonText && ann.buttonUrl && (
                          <a
                            href={ann.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nb-cta-btn external"
                          >
                            <span className="cta-icon"><ExternalLink size={16} /></span>
                            <span className="cta-text">{ann.buttonText}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {lightboxOpen && createPortal(
        <div className="nb-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          {/* Header controls */}
          <div className="nb-lightbox-header" onClick={e => e.stopPropagation()}>
             <div className="lb-controls">
                <button onClick={() => setZoomLevel(z => Math.min(z + 0.25, 3))} className="lb-btn" title="Zoom In"><ZoomIn size={20} /></button>
                <button onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.5))} className="lb-btn" title="Zoom Out"><ZoomOut size={20} /></button>
             </div>
             <div className="lb-actions">
               {active[current].fileUrl && (
                 <a href={active[current].fileUrl} download target="_blank" rel="noopener noreferrer" className="lb-btn primary" title="Download">
                   <Download size={18} /> <span>Download</span>
                 </a>
               )}
               <button className="lb-btn close" onClick={() => setLightboxOpen(false)} aria-label="Close">
                 <X size={24} />
               </button>
             </div>
          </div>
          
          <div className="nb-lightbox-content" onClick={e => e.stopPropagation()}>
            {active[current].fileUrl ? (
              <div className="lb-img-container" style={{ transform: `scale(${zoomLevel})` }}>
                <Image src={active[current].fileUrl} alt="Preview" fill className="nb-lightbox-img" unoptimized />
              </div>
            ) : (
              <div style={{ color: '#fff' }}>No image available</div>
            )}
          </div>
          
          {total > 1 && (
            <>
              <button className="nb-lightbox-nav prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
                <ChevronLeft size={32} />
              </button>
              <button className="nb-lightbox-nav next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>,
        document.body
      )}

      <style>{`
        /* --- Premium Notice Board Styles --- */
        .nb-section {
          background: #050505;
          padding: 80px 4vw;
          border-bottom: 1px solid #111;
          overflow: hidden;
        }
        .nb-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .nb-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .nb-title {
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700;
          color: #FF6B2C;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }
        
        .nb-nav-btns {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255,255,255,0.03);
          padding: 8px 16px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .nb-counter {
          font-size: 14px;
          font-weight: 600;
          color: #aaa;
          font-family: var(--mono, monospace);
        }
        .nb-nav {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          padding: 4px;
          border-radius: 50%;
        }
        .nb-nav:hover {
          color: #FF6B2C;
          background: rgba(255,255,255,0.1);
        }

        /* Progress Bar */
        .nb-progress-container {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          margin-bottom: 40px;
          overflow: hidden;
        }
        .nb-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #FF6B2C, #F59E0B);
          border-radius: 4px;
          transition: width 0.1s linear;
        }

        .nb-viewport {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .nb-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .nb-slide {
          flex: 0 0 100%;
          padding: 0;
          box-sizing: border-box;
        }

        /* Card - Glassmorphism */
        .nb-card {
          position: relative;
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          min-height: 480px;
          box-shadow: 0 20px 60px rgba(255,92,42,0.05);
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .nb-card:hover {
          box-shadow: 0 30px 80px rgba(255,92,42,0.15);
          border-color: rgba(255,107,44,0.3);
        }

        .nb-badges {
           position: absolute;
           top: 20px;
           left: 20px;
           z-index: 10;
           display: flex;
           gap: 10px;
        }
        .nb-badge-priority, .nb-badge-featured {
          background: rgba(255,107,44,0.15);
          color: #FF6B2C;
          border: 1px solid rgba(255,107,44,0.3);
          backdrop-filter: blur(8px);
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Image Side */
        .nb-img-wrap {
          width: 45%;
          max-width: 480px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%);
        }
        .nb-img-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,107,44,0.2);
          box-shadow: 0 0 30px rgba(255,107,44,0.1);
          transition: transform 0.45s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.45s ease;
        }
        .nb-img-wrap:hover .nb-img-inner {
          transform: scale(1.04);
          box-shadow: 0 0 40px rgba(255,107,44,0.25);
          border-color: rgba(255,107,44,0.4);
        }
        .nb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .nb-img-zoom-hint {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .nb-img-wrap:hover .nb-img-zoom-hint {
          opacity: 1;
        }

        /* Content Side */
        .nb-content {
          flex: 1;
          padding: 40px 40px 40px 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .nb-meta-grid {
           display: flex;
           flex-wrap: wrap;
           gap: 16px 24px;
           margin-bottom: 24px;
           padding-bottom: 20px;
           border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .nb-meta-item {
           display: flex;
           align-items: center;
           gap: 8px;
           color: #888;
           font-size: 13px;
           font-weight: 500;
        }
        .nb-meta-item svg {
           color: var(--cat-color);
        }

        .nb-card-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .nb-desc-wrapper {
           margin-bottom: 32px;
        }
        .nb-subtitle {
          font-size: 18px;
          color: #FF6B2C;
          margin: 0 0 12px;
          font-weight: 500;
        }
        .nb-desc {
          font-size: 15px;
          color: #aaa;
          line-height: 1.7;
          margin: 0;
          white-space: pre-line;
        }

        /* Buttons */
        .nb-ctas {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: auto;
        }
        .nb-cta-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          text-decoration: none;
        }
        .nb-cta-btn.primary {
           background: var(--cat-color);
           color: #000;
        }
        .nb-cta-btn.primary:hover {
           background: #fff;
           transform: translateY(-2px);
           box-shadow: 0 8px 20px rgba(255,255,255,0.2);
        }
        .nb-cta-btn.secondary {
           background: rgba(255,255,255,0.05);
           color: #fff;
           border-color: rgba(255,255,255,0.1);
        }
        .nb-cta-btn.secondary:hover {
           background: rgba(255,255,255,0.1);
           border-color: rgba(255,255,255,0.2);
           transform: translateY(-2px);
        }
        .nb-cta-btn.external {
           background: transparent;
           color: var(--cat-color);
           border-color: var(--cat-color);
        }
        .nb-cta-btn.external:hover {
           background: rgba(255,107,44,0.1);
           transform: translateY(-2px);
        }
        .cta-sub {
           font-size: 12px;
           opacity: 0.6;
           font-weight: 400;
        }

        /* Animations for slide change */
        .nb-slide[aria-hidden="false"] .nb-img-inner {
           animation: slideScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .nb-slide[aria-hidden="false"] .nb-content > * {
           opacity: 0;
           animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .nb-slide[aria-hidden="false"] .nb-content > *:nth-child(1) { animation-delay: 0.1s; }
        .nb-slide[aria-hidden="false"] .nb-content > *:nth-child(2) { animation-delay: 0.2s; }
        .nb-slide[aria-hidden="false"] .nb-content > *:nth-child(3) { animation-delay: 0.3s; }
        .nb-slide[aria-hidden="false"] .nb-content > *:nth-child(4) { animation-delay: 0.4s; }

        @keyframes slideScaleIn {
           0% { transform: scale(0.95); opacity: 0; filter: blur(5px); }
           100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes slideUpFade {
           0% { transform: translateY(20px); opacity: 0; }
           100% { transform: translateY(0); opacity: 1; }
        }

        /* Lightbox Google Drive Style */
        .nb-lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 99999;
          display: flex;
          flex-direction: column;
          animation: lbFadeIn 0.3s ease-out;
        }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .nb-lightbox-header {
           display: flex;
           justify-content: space-between;
           padding: 20px 30px;
           background: linear-gradient(180deg, rgba(0,0,0,0.8), transparent);
           z-index: 2;
        }
        .lb-controls, .lb-actions {
           display: flex;
           gap: 15px;
           align-items: center;
        }
        .lb-btn {
           background: rgba(255,255,255,0.1);
           border: 1px solid rgba(255,255,255,0.1);
           color: #fff;
           width: 40px; height: 40px;
           border-radius: 50%;
           display: flex; align-items: center; justify-content: center;
           cursor: pointer;
           transition: 0.2s;
        }
        .lb-btn:hover { background: rgba(255,255,255,0.2); }
        .lb-btn.primary {
           width: auto;
           padding: 0 20px;
           border-radius: 20px;
           gap: 8px;
           font-size: 14px;
           font-weight: 600;
           background: #FF6B2C;
           border-color: #FF6B2C;
           color: #000;
           text-decoration: none;
        }
        .lb-btn.primary:hover { background: #fff; border-color: #fff; }
        .lb-btn.close {
           background: transparent; border: none; font-size: 24px;
        }
        .lb-btn.close:hover { color: #FF6B2C; background: rgba(255,107,44,0.1); }

        .nb-lightbox-content {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .lb-img-container {
           position: relative;
           width: 85vw;
           height: 85vh;
           transition: transform 0.3s ease;
        }
        .nb-lightbox-img {
          object-fit: contain;
          filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
        }
        
        .nb-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 50px; height: 50px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          z-index: 10;
        }
        .nb-lightbox-nav:hover { background: rgba(255,255,255,0.2); scale: 1.1; }
        .nb-lightbox-nav.prev { left: 30px; }
        .nb-lightbox-nav.next { right: 30px; }

        @media (max-width: 900px) {
          .nb-card { flex-direction: column; min-height: unset; }
          .nb-img-wrap { width: 100%; max-width: 100%; padding: 16px; }
          .nb-img-inner { height: 280px; }
          .nb-content { padding: 24px; }
          .nb-ctas { flex-direction: column; }
          .nb-cta-btn { width: 100%; justify-content: center; }
          .lb-btn.primary span { display: none; }
          .nb-meta-grid { gap: 12px; }
          
          .nb-lightbox-nav {
            top: auto;
            bottom: 30px;
            transform: none;
          }
          .nb-lightbox-nav.prev { left: 20%; }
          .nb-lightbox-nav.next { right: 20%; }
        }
      `}</style>
    </section>
  )
}
