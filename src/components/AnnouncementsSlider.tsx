"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, ExternalLink, Tag, Clock, Flame, Star, X, Download, ZoomIn } from 'lucide-react'

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

  const goNext = useCallback(() => setCurrent(c => (c + 1) % Math.max(1, totalRef.current)), [])
  const goPrev = useCallback(() => setCurrent(c => (c === 0 ? totalRef.current - 1 : c - 1)), [])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (paused || lightboxOpen || total <= 1) return
    const id = setInterval(() => setCurrent(c => (c + 1) % Math.max(1, totalRef.current)), 5500)
    return () => clearInterval(id)
  }, [paused, lightboxOpen, total])

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
    if (lightboxOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
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
              Notice <span style={{ color: '#ffffff' }}>Board</span>
            </h2>
          </div>
          {total > 1 && (
            <div className="nb-nav-btns">
              <button className="nb-nav" onClick={goPrev} aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <span className="nb-counter">{current + 1} / {total}</span>
              <button className="nb-nav" onClick={goNext} aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

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
              const isPortrait = false // detect via img onLoad if needed
              return (
                <div key={ann.id} className="nb-slide" aria-hidden={i !== current}>
                  <div className="nb-card">
                    {/* Priority badge */}
                    {ann.priority >= 5 && (
                      <div className="nb-badge-priority">
                        <Flame size={11} /> Priority
                      </div>
                    )}
                    {ann.isFeatured && (
                      <div className="nb-badge-featured">
                        <Star size={11} /> Featured
                      </div>
                    )}

                    {/* Image panel */}
                    {ann.fileUrl && (
                      <div className="nb-img-wrap" onClick={() => setLightboxOpen(true)} style={{ cursor: 'zoom-in' }}>
                        <img
                          src={ann.fileUrl}
                          alt={ann.title}
                          className="nb-img"
                          loading="lazy"
                        />
                        <div className="nb-img-overlay" />
                        <div className="nb-img-zoom-hint" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.3s', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                          <ZoomIn size={24} />
                        </div>
                        {ann.offerTag && (
                          <div className="nb-offer-tag">
                            <Tag size={11} /> {ann.offerTag}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content panel */}
                    <div className="nb-content">
                      <div className="nb-meta">
                        <span className="nb-cat" style={{ background: `${catColor}18`, color: catColor, borderColor: `${catColor}40` }}>
                          {ann.category}
                        </span>
                        {ann.endDate && (
                          <span className="nb-expiry">
                            <Clock size={11} />
                            Expires {new Date(ann.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {!ann.fileUrl && ann.offerTag && (
                          <span className="nb-offer-inline">
                            <Tag size={11} /> {ann.offerTag}
                          </span>
                        )}
                      </div>

                      {ann.title && <h3 className="nb-card-title">{ann.title}</h3>}
                      {ann.subtitle && <p className="nb-subtitle">{ann.subtitle}</p>}
                      {ann.content && <p className="nb-desc">{ann.content}</p>}

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '20px' }}>
                        {ann.fileUrl && (['Brochure', 'Poster'].includes(ann.category) || true) && (
                          <button
                            onClick={() => setLightboxOpen(true)}
                            className="nb-cta nb-view-btn"
                            style={{ '--cta-color': catColor, cursor: 'pointer', border: 'none' } as React.CSSProperties}
                          >
                            {ann.category === 'Brochure' ? 'View Brochure' : 'View Poster'}
                            <ZoomIn size={13} />
                          </button>
                        )}
                        
                        {ann.buttonText && ann.buttonUrl && (
                          <a
                            href={ann.buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nb-cta"
                            style={{ '--cta-color': catColor } as React.CSSProperties}
                          >
                            {ann.buttonText}
                            <ExternalLink size={13} />
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

        {/* Dots */}
        {total > 1 && (
          <div className="nb-dots">
            {active.map((_, i) => (
              <button
                key={i}
                className={`nb-dot-btn${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && createPortal(
        <div className="nb-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="nb-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close">
            <X size={24} />
          </button>
          
          <div className="nb-lightbox-content" onClick={e => e.stopPropagation()}>
            {active[current].fileUrl ? (
              <img src={active[current].fileUrl} alt="Preview" className="nb-lightbox-img" />
            ) : (
              <div style={{ color: '#fff' }}>No image available</div>
            )}
            
            {active[current].fileUrl && (
              <a href={active[current].fileUrl} download target="_blank" rel="noopener noreferrer" className="nb-lightbox-download" title="Download Image">
                <Download size={20} />
              </a>
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
        .nb-lightbox-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFadeIn 0.3s ease-out;
        }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .nb-lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .nb-lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        
        .nb-lightbox-close {
          position: absolute !important;
          top: 20px !important;
          right: 20px !important;
          background: rgba(255,255,255,0.1) !important;
          border: none !important;
          color: white !important;
          width: 44px !important;
          min-width: 44px !important;
          max-width: 44px !important;
          height: 44px !important;
          min-height: 44px !important;
          max-height: 44px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: 0.2s !important;
          z-index: 100000 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .nb-lightbox-close:hover { background: rgba(255,107,44,0.8) !important; }
        
        .nb-lightbox-download {
          position: absolute !important;
          bottom: -50px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 30px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          text-decoration: none !important;
          font-size: 14px !important;
          transition: 0.2s !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          width: auto !important;
          min-width: 140px !important;
          white-space: nowrap !important;
        }
        .nb-lightbox-download:hover { background: rgba(255,255,255,0.2) !important; }
        
        .nb-lightbox-nav {
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          background: rgba(255,255,255,0.05) !important;
          border: none !important;
          color: white !important;
          width: 60px !important;
          min-width: 60px !important;
          max-width: 60px !important;
          height: 60px !important;
          min-height: 60px !important;
          max-height: 60px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: 0.2s !important;
          z-index: 100000 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .nb-lightbox-nav:hover { background: rgba(255,255,255,0.2) !important; }
        .nb-lightbox-nav.prev { left: 30px !important; }
        .nb-lightbox-nav.next { right: 30px !important; }
        
        @media (max-width: 768px) {
          .nb-lightbox-nav { 
            width: 44px !important; 
            min-width: 44px !important;
            max-width: 44px !important;
            height: 44px !important; 
            min-height: 44px !important;
            max-height: 44px !important;
          }
          .nb-lightbox-nav.prev { left: 10px !important; }
          .nb-lightbox-nav.next { right: 10px !important; }
          .nb-lightbox-img { max-height: 75vh !important; }
        }

        .nb-img-wrap:hover .nb-img-zoom-hint {
          opacity: 1 !important;
        }

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
          margin-bottom: 40px;
          gap: 20px;
        }
        .nb-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .nb-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF6B2C;
          display: inline-block;
          animation: nbPulse 2s ease-in-out infinite;
        }
        @keyframes nbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .nb-title {
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700;
          color: #FF6B2C;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }
        .nb-title em {
          color: #fff;
          font-style: normal;
          font-weight: 400;
        }
        .nb-nav-btns {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nb-counter {
          font-size: 13px;
          color: #555;
          min-width: 40px;
          text-align: center;
        }
        .nb-nav {
          background: transparent;
          border: none;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 5px;
        }
        .nb-nav:hover {
          color: #FF6B2C;
          transform: scale(1.1);
        }

        /* Viewport */
        .nb-viewport {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .nb-track {
          display: flex;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1);
          will-change: transform;
        }
        .nb-slide {
          flex: 0 0 100%;
          padding: 0 6px;
          box-sizing: border-box;
        }

        /* Card */
        .nb-card {
          position: relative;
          background: #0e0e0e;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          min-height: 260px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nb-card:hover {
          border-color: rgba(255,107,44,0.2);
          box-shadow: 0 0 40px rgba(255,107,44,0.06);
        }

        /* Priority / Featured badges */
        .nb-badge-priority {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          background: rgba(239,68,68,0.15);
          color: #EF4444;
          border: 1px solid rgba(239,68,68,0.3);
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .nb-badge-featured {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 10;
          background: rgba(251,191,36,0.15);
          color: #F59E0B;
          border: 1px solid rgba(251,191,36,0.3);
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Image panel — left side on desktop */
        .nb-img-wrap {
          position: relative;
          width: 45%;
          min-width: 200px;
          flex-shrink: 0;
          background: #0a0a0a;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nb-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          max-height: 400px;
          padding: 8px;
        }
        .nb-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 70%, #0e0e0e 100%);
          pointer-events: none;
        }
        .nb-offer-tag {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(245,158,11,0.9);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Content panel */
        .nb-content {
          flex: 1;
          padding: 32px 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
          min-width: 0;
        }
        .nb-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .nb-cat {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid;
        }
        .nb-expiry {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #666;
          font-family: var(--mono, monospace);
        }
        .nb-offer-inline {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #F59E0B;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nb-card-title {
          font-size: clamp(20px, 2.5vw, 30px);
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        .nb-subtitle {
          font-size: 15px;
          color: #888;
          margin: 0;
          line-height: 1.5;
        }
        .nb-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .nb-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          padding: 10px 22px;
          background: var(--cta-color, #FF6B2C);
          color: #000;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          align-self: flex-start;
          letter-spacing: 0.02em;
        }
        .nb-cta:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        /* No image — full width text */
        .nb-card:not(:has(.nb-img-wrap)) .nb-content {
          padding: 36px 40px;
        }

        /* Dots */
        .nb-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }
        .nb-dot-btn {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .nb-dot-btn.active {
          width: 24px;
          border-radius: 3px;
          background: #FF6B2C;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .nb-section { padding: 60px 4vw; }
          .nb-slide { width: 100%; flex: 0 0 100%; min-width: 100%; }
          .nb-card { flex-direction: column; min-height: unset; }
          .nb-img-wrap {
            width: 100%;
            min-width: unset;
            height: 280px;
          }
          .nb-img { max-height: 280px; padding: 0; object-fit: contain; }
          .nb-img-overlay {
            background: linear-gradient(to bottom, transparent 60%, #0e0e0e 100%);
          }
          .nb-content { padding: 20px 20px 24px; gap: 10px; }
          .nb-card-title { font-size: 20px; }
          .nb-desc { -webkit-line-clamp: 2; font-size: 13px; }
          .nb-header { flex-direction: column; align-items: flex-start; margin-bottom: 24px; }
          .nb-nav-btns { align-self: flex-end; margin-top: -40px; }
        }
      `}</style>
    </section>
  )
}
