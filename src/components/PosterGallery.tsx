"use client"

import React, { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

export function PosterGallery({ posters }: { posters: any[] }) {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null)

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
        {posters.map((poster) => (
          <div key={poster.id} className="poster-card" onClick={() => setSelectedPoster(poster.image)}>
            <div className="poster-image-wrapper">
              <img 
                src={poster.image} 
                alt={poster.title || "Poster"} 
                loading="lazy"
                className="poster-img"
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
          </div>
        ))}
      </div>

      {selectedPoster && (
        <div className="poster-lightbox" onClick={() => setSelectedPoster(null)}>
          <button className="lightbox-close" onClick={() => setSelectedPoster(null)}>
            <X size={28} />
          </button>
          <img src={selectedPoster} alt="Fullscreen Poster" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

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
          animation: fadeZoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
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
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: fadeIn 0.3s ease;
        }
        .lightbox-close {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lightbox-close:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeZoomIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}
