"use client"

import { useState } from "react"
import { ProjectCard } from "./ProjectCard"

type Project = {
  id: string
  title: string
  category: string | null
  shortSummary: string | null
  challenge: string
  solution: string
  technologies: string
  impact: string
  objectives: string | null
  features: string | null
  outcomes: string | null
  useCase: string | null
  image: string | null
  galleryImages: string | null
  github: string | null
  liveDemo: string | null
  documentation: string | null
  isFeatured: boolean
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export function ProjectsShowcase({ projects }: { projects: any[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('All')

  // Grouped and Base Filters
  const baseFilters = ['All', 'Web', 'Mobile', 'AI', 'IoT / Embedded / Robotics']
  const dynamicFilters = new Set<string>()

  projects.forEach(p => {
    if (p.published && p.status !== 'Archived' && p.status !== 'Draft' && p.category) {
      p.category.split(',').forEach((c: string) => {
        const cat = c.trim()
        if (!cat) return
        
        const lowerCat = cat.toLowerCase()
        if (['web', 'mobile', 'ai'].includes(lowerCat)) return
        if (['iot', 'embedded', 'robotics'].includes(lowerCat)) return
        
        dynamicFilters.add(cat)
      })
    }
  })

  const filters = [...baseFilters, ...Array.from(dynamicFilters).sort()]
  
  const activeProjects = projects.filter(p => {
    if (!p.published || p.status === 'Archived' || p.status === 'Draft') return false
    
    if (activeFilter === 'All') return true
    if (!p.category) return false
    
    const catsString = p.category.toLowerCase()
    
    if (activeFilter === 'IoT / Embedded / Robotics') {
      return catsString.includes('iot') || catsString.includes('embedded') || catsString.includes('robotics')
    }
    
    const catsArray = p.category.split(',').map((c: string) => c.trim().toLowerCase())
    return catsArray.includes(activeFilter.toLowerCase())
  })

  return (
    <div className="projects-showcase-premium">
      
      {/* Sleek Filters */}
      <div className="filters-container">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Projects Grid Container (Full Width, 4 Columns) */}
      <div className="projects-grid">
        {activeProjects.length > 0 ? activeProjects.map(project => (
          <div key={project.id} className="project-wrapper">
            <ProjectCard project={project} />
          </div>
        )) : (
          <div className="empty-state">
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>

      <style>{`
        .projects-showcase-premium {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .filters-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 50px;
          padding-bottom: 10px;
        }

        .filter-btn {
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.12);
          color: #555;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 14px;
          font-family: var(--mono);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .filter-btn:hover {
          background: rgba(0, 0, 0, 0.08);
          color: black;
          border-color: rgba(0, 0, 0, 0.35);
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: var(--acid);
          color: black;
          border-color: var(--acid);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(255, 92, 42, 0.3);
        }

        .projects-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
        }
        
        .project-wrapper {
          animation: fadeInUp 0.6s ease-out forwards;
          width: calc(25% - 22.5px); /* (100% / 4 cols) - (gap * (4-1) / 4) */
          max-width: 400px; /* Cap width for very large screens */
        }
        
        .empty-state {
          width: 100%;
          text-align: center;
          padding: 60px 20px;
          color: #888;
          background: rgba(25,25,25,0.4);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Breakpoints matching strict requirements */
        @media (max-width: 1440px) {
          .project-wrapper { width: calc(33.333% - 20px); }
        }
        
        @media (max-width: 1024px) {
          .project-wrapper { width: calc(50% - 15px); }
          .filters-container {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 5px 20px;
            margin-left: -20px;
            margin-right: -20px;
          }
          .filters-container::-webkit-scrollbar {
            display: none;
          }
          .filter-btn {
            white-space: nowrap;
          }
        }
        
        @media (max-width: 640px) {
          .project-wrapper { width: 100%; max-width: 100%; }
        }
      `}</style>
    </div>
  )
}
