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

  const filters = [
    'All', 'AI', 'IoT / Embedded / Robotics', 'Web', 'Mobile'
  ]
  
  const activeProjects = projects.filter(p => {
    if (!p.published) return false
    
    // Category match
    if (activeFilter === 'All') return true
    if (!p.category) return false
    
    const cat = p.category.toLowerCase()
    
    if (activeFilter === 'IoT / Embedded / Robotics') {
      return cat.includes('iot') || cat.includes('embedded') || cat.includes('robotics')
    }
    
    const filter = activeFilter.toLowerCase()
    if (filter === 'web' && cat.includes('software')) return true
    
    return cat.includes(filter)
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
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
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
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
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
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }
        
        .project-wrapper {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .empty-state {
          grid-column: 1 / -1;
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
          .projects-grid { grid-template-columns: repeat(3, 1fr); }
        }
        
        @media (max-width: 1024px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .projects-grid { grid-template-columns: 1fr; }
          .filters-container {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .filters-container::-webkit-scrollbar {
            display: none;
          }
          .filter-btn {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}
