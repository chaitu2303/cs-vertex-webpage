"use client"

import { useState } from "react"
import Image from "next/image"

function AccordionItem({ title, content }: { title: string, content: string | React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!content) return null

  return (
    <div style={{ borderBottom: '1px solid #333' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 0', 
          background: 'none', 
          border: 'none', 
          color: isOpen ? 'var(--acid)' : '#ccc', 
          fontSize: '14px', 
          fontWeight: 600, 
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        {title}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: '12px', fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
          {content}
        </div>
      )}
    </div>
  )
}

export function ProjectCard({ project }: { project: any }) {
  return (
    <article className="project-card" style={{ background: '#111111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
      <div 
        style={{ 
          height: '200px', 
          position: 'relative',
          background: '#222',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '20px'
        }}
      >
        {project.image && (
          <Image 
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1, background: 'var(--acid)', color: '#000', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px' }}>
          {project.category}
        </span>
      </div>

      <div style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#fff' }}>{project.title}</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px', lineHeight: 1.5 }}>{project.shortSummary}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <AccordionItem title="Technologies" content={project.technologies} />
          <AccordionItem title="Problem" content={project.challenge} />
          <AccordionItem title="Solution" content={project.solution} />
          <AccordionItem title="Outcome & Impact" content={project.outcomes || project.impact} />
        </div>
      </div>
    </article>
  )
}
