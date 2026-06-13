"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { RealtimeProvider } from '@/components/RealtimeProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const menu = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Notifications', path: '/admin/notifications' },
    { label: 'Team', path: '/admin/team' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Services', path: '/admin/services' },
    { label: 'Quotes & CRM', path: '/admin/quotes' },
    { label: 'Announcements', path: '/admin/announcements' },
    { label: 'Learning Platform', path: '/admin/learning' },
    { label: 'Feedback & Reviews', path: '/admin/feedback' },
    { label: 'Leads & Contacts', path: '/admin/leads' },
    { label: 'Homepage Content', path: '/admin/content' },
    { label: 'Media Library', path: '/admin/media' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#eee' }}>
      <RealtimeProvider />
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '25px 20px', borderBottom: '1px solid #1a1a1a' }}>
          <img src="/assets/logo.png" alt="CS Vertex" style={{ height: '30px' }} />
          <div style={{ fontSize: '11px', color: 'var(--acid)', marginTop: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Portal</div>
        </div>

        <nav style={{ padding: '20px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menu.map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              style={{
                padding: '10px 20px',
                color: pathname === item.path ? '#fff' : '#888',
                background: pathname === item.path ? '#1a1a1a' : 'transparent',
                borderLeft: pathname === item.path ? '3px solid var(--acid)' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: pathname === item.path ? 500 : 400,
                transition: '0.2s'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1a1a1a' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #222', color: '#ff4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
        <header style={{ padding: '20px 40px', borderBottom: '1px solid #1a1a1a', background: '#0a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 500 }}>{menu.find(m => m.path === pathname)?.label || 'Dashboard'}</h2>
          <div style={{ fontSize: '13px', color: '#888' }}>
            CS Vertex CMS
          </div>
        </header>

        <div style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
