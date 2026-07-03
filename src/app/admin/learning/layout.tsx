"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { label: 'Overview', path: '/admin/learning' },
    { label: 'Internships', path: '/admin/learning/internships' },
    { label: 'Courses', path: '/admin/learning/courses' },
    { label: 'Workshops', path: '/admin/learning/workshops' },
    { label: 'Applications', path: '/admin/learning/applications' },
    { label: 'Reports', path: '/admin/learning/reports' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
        {tabs.map(t => {
          const isActive = pathname === t.path
          return (
            <Link 
              key={t.path} 
              href={t.path}
              style={{
                color: isActive ? 'var(--acid)' : '#888',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                padding: '5px 10px',
                borderBottom: isActive ? '2px solid var(--acid)' : '2px solid transparent',
                marginBottom: '-11px',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </Link>
          )
        })}
      </div>
      
      <div>
        {children}
      </div>
    </div>
  )
}
