"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, ZoomIn, Plus, Minus, RotateCcw, Maximize, Share2, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function PosterGallery({ posters }: { posters: any[] }) {
  const [selectedPoster, setSelectedPoster] = useState<any>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedPoster) {
      document.body.style.overflow = 'hidden'
      setZoom(1)
      setPan({ x: 0, y: 0 })
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedPoster])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  if (!posters || posters.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: '#111', borderRadius: '16px', border: '1px solid #222', color: '#888' }}>
        No announcements available.
      </div>
    )
  }

  return (
    <>
      <div className="posters-grid">
        {posters.map((poster, index) => (
          <motion.div 
            key={poster.id} 
            className="poster-card" 
            onClick={() => setSelectedPoster(poster)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="poster-image-wrapper">
              <Image 
                src={poster.image} 
                alt={poster.title || "Poster"} 
                width={600}
                height={800}
                className="poster-img"
                loading="lazy"
                unoptimized
              />
              <div className="poster-zoom-overlay">
                <ZoomIn size={32} />
              </div>
            </div>
            {(poster.title || poster.description) && (
              <div className="poster-content">
                {poster.category && (
                  <div className="poster-category">{poster.category.toUpperCase()}</div>
                )}
                {poster.title && <h3 className="poster-title">{poster.title}</h3>}
                {poster.description && <p className="poster-desc">{poster.description}</p>}
                {poster.buttonText && poster.buttonUrl && (
                  <a href={poster.buttonUrl} className="poster-btn" onClick={(e) => e.stopPropagation()}>
                    {poster.buttonText.toUpperCase()} 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPoster && (
          <motion.div 
            className="poster-lightbox" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
          >
            {/* Top Right Fixed Actions */}
            <div className="lightbox-top-actions">
              <button className="action-fab close-fab" onClick={() => setSelectedPoster(null)}>
                <X size={24} />
              </button>
            </div>

            {/* Draggable/Zoomable Image Area */}
            <div 
              className="lightbox-image-area"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <motion.div
                animate={{ x: pan.x, y: pan.y, scale: zoom }}
                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <Image 
                  src={selectedPoster.image} 
                  alt="Fullscreen Poster" 
                  width={1200} 
                  height={1600} 
                  className="lightbox-img" 
                  draggable={false}
                  unoptimized 
                />
              </motion.div>
            </div>

            {/* Bottom Right Zoom Toolbar */}
            <div className="lightbox-toolbar">
              <button className="toolbar-btn" onClick={handleZoomOut} title="Zoom Out"><Minus size={20} /></button>
              <div className="toolbar-divider" />
              <button className="toolbar-btn" onClick={handleReset} title="Reset Zoom"><RotateCcw size={18} /></button>
              <div className="toolbar-divider" />
              <button className="toolbar-btn" onClick={handleZoomIn} title="Zoom In"><Plus size={20} /></button>
              <div className="toolbar-divider" />
              <button className="toolbar-btn" onClick={handleFullscreen} title="Fullscreen"><Maximize size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .posters-grid {
          column-count: 1;
          column-gap: 40px;
          width: 100%;
        }
        @media (min-width: 768px) {
          .posters-grid {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .posters-grid {
            column-count: 3;
          }
        }
        .poster-card {
          background: #111111;
          border-radius: 16px;
          border: 1px solid #222;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          break-inside: avoid;
          margin-bottom: 40px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .poster-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .poster-image-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .poster-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s ease;
        }
        .poster-card:hover .poster-img {
          transform: scale(1.03);
        }
        .poster-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .poster-card:hover .poster-zoom-overlay {
          opacity: 1;
        }
        .poster-content {
          padding: 24px;
          background: linear-gradient(to right, #111, #1a1a1a);
          border-top: 1px solid #333;
        }
        .poster-category {
          display: inline-block;
          background: #FF5A2A;
          color: #000;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .poster-title {
          color: #fff;
          font-size: 24px;
          margin: 0 0 8px;
          font-weight: 600;
        }
        .poster-desc {
          color: #aaa;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .poster-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #FF5A2A;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .poster-btn:hover {
          color: #ff7a52;
        }
        
        .poster-lightbox {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(5,5,5,0.95);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: none; /* Prevent browser handling of pinch/pan */
        }

        .lightbox-image-area {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .lightbox-img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8);
          pointer-events: none; /* Let the wrapper handle pointer events */
        }

        /* Top Right Fixed Actions */
        .lightbox-top-actions {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 100;
          display: flex;
          gap: 12px;
        }
        
        .action-fab {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-fab:hover {
          background: rgba(255,90,42,0.2);
          border-color: #FF5A2A;
          transform: scale(1.1);
        }

        /* Bottom Right Toolbar */
        .lightbox-toolbar {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: rgba(15,15,15,0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 30px;
          display: flex;
          align-items: center;
          padding: 6px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .toolbar-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #aaa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .toolbar-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .toolbar-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          margin: 0 4px;
        }

        @media (max-width: 768px) {
          .lightbox-toolbar {
            bottom: 20px;
            right: 50%;
            transform: translateX(50%);
          }
        }
      `}</style>
    </>
  )
}
