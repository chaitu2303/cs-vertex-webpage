"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Code2, ExternalLink, FileText, ImageIcon, X, CheckCircle, ArrowRight } from "lucide-react"

export function ProjectCard({ project }: { project: any }) {
  const [modalOpen, setModalOpen] = useState(false)

  // Parse gallery images
  let galleryImages: string[] = []
  if (project.galleryImages) {
    try {
      const parsed = JSON.parse(project.galleryImages)
      if (Array.isArray(parsed)) galleryImages = parsed
    } catch (e) {
      // ignore
    }
  }

  // Handle escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false) }
    if (modalOpen) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [modalOpen])

  return (
    <>
      <div className="project-card group" onClick={() => setModalOpen(true)}>
        <div className="project-image-wrapper">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="project-image"
            />
          ) : (
            <div className="project-image-placeholder">
              <span className="text-white/20 text-xs tracking-widest uppercase">No Image</span>
            </div>
          )}
          
          <div className="project-badges">
            {project.category && <span className="category-badge">{project.category}</span>}
            {project.isFeatured && <span className="featured-badge">Featured</span>}
          </div>

          <div className="project-hover-overlay">
            <div className="hover-actions">
              <span className="action-btn" title="View Details">
                <ExternalLink size={18} />
              </span>
            </div>
          </div>
        </div>

        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          {project.shortSummary && (
            <p className="project-summary">{project.shortSummary}</p>
          )}
          
          <div className="project-tech">
            {project.technologies && project.technologies.split(',').map((tech: string, i: number) => (
              <span key={i} className="tech-tag">{tech.trim()}</span>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && createPortal(
        <div className="pm-overlay" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true">
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <button className="pm-close" onClick={() => setModalOpen(false)} title="Close">
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="pm-header">
              {project.image && (
                <div className="pm-hero-image">
                  <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                  <div className="pm-hero-glow" />
                </div>
              )}
              <div className="pm-title-block">
                {project.category && <span className="pm-category">{project.category}</span>}
                <h2 className="pm-title">{project.title}</h2>
                {project.shortSummary && <p className="pm-subtitle">{project.shortSummary}</p>}
                
                <div className="pm-action-links">
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="pm-btn pm-btn-primary">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="pm-btn">
                      <Code2 size={16} /> GitHub
                    </a>
                  )}
                  {project.documentation && (
                    <a href={project.documentation} target="_blank" rel="noopener noreferrer" className="pm-btn">
                      <FileText size={16} /> Documentation
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pm-body">
              <div className="pm-grid">
                <div className="pm-main-col">
                  {project.challenge && (
                    <section className="pm-section">
                      <h3 className="pm-heading">Problem Statement</h3>
                      <p className="pm-text">{project.challenge}</p>
                    </section>
                  )}
                  
                  {project.solution && (
                    <section className="pm-section">
                      <h3 className="pm-heading">Solution</h3>
                      <p className="pm-text">{project.solution}</p>
                    </section>
                  )}

                  {(project.features || project.objectives) && (
                    <section className="pm-section">
                      <h3 className="pm-heading">Key Features & Workflow</h3>
                      <p className="pm-text">{project.features || project.objectives}</p>
                    </section>
                  )}
                  
                  {project.outcomes && (
                    <section className="pm-section">
                      <h3 className="pm-heading">Impact & Outcomes</h3>
                      <p className="pm-text">{project.outcomes}</p>
                    </section>
                  )}
                </div>

                <div className="pm-side-col">
                  {project.technologies && (
                    <section className="pm-section pm-card">
                      <h3 className="pm-heading-small">Tech Stack & Tools</h3>
                      <div className="pm-tags">
                        {project.technologies.split(',').map((tech: string, i: number) => (
                          <span key={i} className="pm-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  {project.useCase && (
                    <section className="pm-section pm-card">
                      <h3 className="pm-heading-small">Use Case</h3>
                      <p className="pm-text-small">{project.useCase}</p>
                    </section>
                  )}
                </div>
              </div>

              {galleryImages.length > 0 && (
                <section className="pm-section pm-gallery-section">
                  <h3 className="pm-heading">Project Gallery</h3>
                  <div className="pm-gallery">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="pm-gallery-item">
                        <Image src={img} alt={`${project.title} ${i+1}`} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        /* Card Styles */
        .project-card {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 92, 42, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255, 92, 42, 0.1);
        }

        .project-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 60%;
          overflow: hidden;
          background: #111;
        }

        .project-image {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .project-card:hover .project-image {
          transform: scale(1.08);
        }

        .project-badges {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .category-badge, .featured-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-family: var(--mono);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        .category-badge {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        .featured-badge {
          background: var(--acid);
          color: black;
          border: 1px solid var(--acid);
        }

        .project-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .project-card:hover .project-hover-overlay {
          opacity: 1;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          background: var(--acid);
          color: black;
          border-color: var(--acid);
          transform: scale(1.1);
        }

        .project-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .project-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .project-summary {
          font-size: 14px;
          color: #a0a0a0;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
        }

        .tech-tag {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Modal Styles */
        .pm-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: pmFadeIn 0.25s ease forwards;
        }
        @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pm-modal {
          position: relative;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(255, 92, 42, 0.08);
          animation: pmSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,90,42,0.3) transparent;
        }
        .pm-modal::-webkit-scrollbar { width: 6px; }
        .pm-modal::-webkit-scrollbar-track { background: transparent; }
        .pm-modal::-webkit-scrollbar-thumb { background: rgba(255,90,42,0.3); border-radius: 10px; }
        
        @keyframes pmSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pm-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.2s;
        }
        .pm-close:hover {
          background: var(--acid);
          color: black;
          border-color: var(--acid);
          transform: rotate(90deg);
        }

        .pm-header {
          position: relative;
        }
        
        .pm-hero-image {
          position: relative;
          width: 100%;
          height: 350px;
          background: #111;
        }
        .pm-hero-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, #0a0a0a 100%);
        }

        .pm-title-block {
          padding: 0 40px;
          margin-top: -60px;
          position: relative;
          z-index: 2;
          margin-bottom: 40px;
        }
        
        /* If no image */
        .pm-header:not(:has(.pm-hero-image)) .pm-title-block {
          margin-top: 40px;
        }

        .pm-category {
          display: inline-block;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--acid);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          background: rgba(255,92,42,0.1);
          padding: 6px 12px;
          border-radius: 4px;
        }

        .pm-title {
          font-size: 36px;
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .pm-subtitle {
          font-size: 16px;
          color: #aaa;
          line-height: 1.6;
          max-width: 700px;
          margin: 0 0 24px;
        }

        .pm-action-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .pm-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .pm-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .pm-btn-primary {
          background: rgba(255,92,42,0.1);
          border-color: rgba(255,92,42,0.3);
          color: var(--acid);
        }
        .pm-btn-primary:hover {
          background: rgba(255,92,42,0.2);
          border-color: var(--acid);
        }

        .pm-body {
          padding: 0 40px 40px;
        }

        .pm-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .pm-main-col {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .pm-side-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pm-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pm-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 24px;
        }

        .pm-heading {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .pm-heading-small {
          font-size: 14px;
          font-family: var(--mono);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          margin: 0 0 16px;
        }

        .pm-text {
          font-size: 15px;
          line-height: 1.7;
          color: #bbb;
          margin: 0;
          white-space: pre-wrap;
        }
        
        .pm-text-small {
          font-size: 14px;
          line-height: 1.6;
          color: #aaa;
          margin: 0;
        }

        .pm-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pm-tag {
          font-size: 12px;
          color: #eee;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .pm-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .pm-gallery-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
          .pm-overlay { padding: 0; }
          .pm-modal { border-radius: 0; max-height: 100vh; height: 100vh; }
          .pm-grid { grid-template-columns: 1fr; gap: 30px; }
          .pm-hero-image { height: 250px; }
          .pm-title-block { padding: 0 20px; margin-top: -40px; }
          .pm-body { padding: 0 20px 40px; }
          .pm-title { font-size: 28px; }
          .pm-close { top: 16px; right: 16px; background: rgba(0,0,0,0.8); }
        }
      `}</style>
    </>
  )
}
