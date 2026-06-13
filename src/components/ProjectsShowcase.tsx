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
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export function ProjectsShowcase({ projects }: { projects: any[] }) {
  const [activeTab, setActiveTab] = useState<'software' | 'hardware'>('software')

  const softwareProjects = projects.filter(p => p.category?.toLowerCase() === 'software')
  const hardwareProjects = projects.filter(p => p.category?.toLowerCase() !== 'software')

  const activeProjects = activeTab === 'software' ? softwareProjects : hardwareProjects

  return (
    <div className="projects-showcase">
      {/* Glassmorphism Tabs Container */}
      <div className="tabs-container">
        <button 
          onClick={() => setActiveTab('software')}
          className={`tab-btn ${activeTab === 'software' ? 'active' : ''}`}
        >
          <span>💻</span> Software Engineering
        </button>
        <button 
          onClick={() => setActiveTab('hardware')}
          className={`tab-btn ${activeTab === 'hardware' ? 'active' : ''}`}
        >
          <span>🤖</span> AI, IoT & Embedded
        </button>
      </div>

      {/* Blurred Black Glassmorphism Projects Container */}
      <div className="projects-list-container">
        {/* Projects Grid - 3 Column Comparison Layout */}
        <div className="projects-grid">
          {activeProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <style>{`
        .projects-showcase {
          width: 100%;
          margin-top: 40px;
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          background: rgba(15, 15, 15, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px;
          border-radius: 40px;
          width: fit-content;
          margin: 0 auto 40px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1);
        }

        .tab-btn {
          background: transparent;
          color: rgba(255, 255, 255, 0.65);
          border: none;
          padding: 12px 28px;
          border-radius: 30px;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .tab-btn.active {
          background: var(--acid);
          color: #000;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(255, 92, 42, 0.3);
        }

        /* Glassmorphic Background Panel */
        .projects-list-container {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 45px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* 3-Column Side-by-Side Comparison Layout */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        @media (max-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .projects-list-container {
            padding: 35px;
          }
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          .projects-list-container {
            padding: 20px;
            border-radius: 16px;
          }
        }

        @media (max-width: 600px) {
          .tabs-container {
            flex-direction: column;
            border-radius: 16px;
            width: 100%;
            gap: 8px;
            padding: 10px;
          }
          .tab-btn {
            width: 100%;
            justify-content: center;
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  )
}
