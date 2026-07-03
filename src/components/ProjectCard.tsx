"use client"

import Image from "next/image"
import Link from "next/link"
import { Code2, ExternalLink, FileText, ImageIcon } from "lucide-react"

export function ProjectCard({ project }: { project: any }) {
  // Try to parse gallery images if they exist
  let galleryCount = 0;
  if (project.galleryImages) {
    try {
      const parsed = JSON.parse(project.galleryImages);
      if (Array.isArray(parsed)) galleryCount = parsed.length;
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="project-card group">
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
        
        {/* Overlay Badges */}
        <div className="project-badges">
          {project.category && (
            <span className="category-badge">{project.category}</span>
          )}
          {project.isFeatured && (
            <span className="featured-badge">Featured</span>
          )}
        </div>

        {/* Hover Action Layer */}
        <div className="project-hover-overlay">
          <div className="hover-actions">
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="action-btn" title="Live Demo">
                <ExternalLink size={18} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="action-btn" title="GitHub Repo">
                <Code2 size={18} />
              </a>
            )}
            {project.documentation && (
              <a href={project.documentation} target="_blank" rel="noopener noreferrer" className="action-btn" title="Documentation">
                <FileText size={18} />
              </a>
            )}
            {galleryCount > 0 && (
              <div className="action-btn gallery-indicator" title={`${galleryCount} Gallery Images`}>
                <ImageIcon size={18} />
                <span>{galleryCount}</span>
              </div>
            )}
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

      <style>{`
        .project-card {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 92, 42, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255, 92, 42, 0.1);
        }

        .project-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 60%; /* 16:9 Aspect Ratio approximation */
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

        .project-image-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, #0a0a0a, #1a1a1a);
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
          background: rgba(0, 0, 0, 0.7);
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

        .hover-actions {
          display: flex;
          gap: 12px;
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .project-card:hover .hover-actions {
          transform: translateY(0);
        }

        .action-btn {
          width: 40px;
          height: 40px;
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

        .gallery-indicator {
          width: auto;
          padding: 0 12px;
          border-radius: 20px;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
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
      `}</style>
    </div>
  )
}
