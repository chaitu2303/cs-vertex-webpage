'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/portal/actions'
import { RealtimeProvider } from '@/components/RealtimeProvider'
import {
  LayoutDashboard, Bell, FolderKanban, Target,
  MessageSquare, FileText, CreditCard, Download,
  GraduationCap, Settings, LogOut, Briefcase, Menu, X, ChevronRight, Search
} from 'lucide-react'

/* ─── Nav structure ────────────────────────────────────────── */
const NAV = [
  {
    group: 'Workspace',
    items: [
      { label: 'Dashboard',       href: '/portal',                  icon: LayoutDashboard, exact: true },
      { label: 'My Projects',     href: '/portal/projects',         icon: FolderKanban },
      { label: 'Quotes',          href: '/portal/quotes',           icon: Target },
      { label: 'Invoices',        href: '/portal/invoices',         icon: CreditCard },
      { label: 'Documents',       href: '/portal/documents',        icon: FileText },
    ],
  },
  {
    group: 'Support & Tools',
    items: [
      { label: 'Notification Center',   href: '/portal/notifications',    icon: Bell },
      { label: 'Raise a Ticket', href: '/portal/support',          icon: MessageSquare },
      { label: 'Meetings',        href: '/portal/consultations',    icon: Briefcase },
      { label: 'Downloads',       href: '/portal/downloads',        icon: Download },
    ],
  },
  {
    group: 'Academy',
    items: [
      { label: 'My Learning',     href: '/portal/learning', icon: GraduationCap },
    ],
  },
]

/* ─── Client wrapper — handles auth redirect via server layout ─── */
interface PortalShellProps {
  children: ReactNode
  userEmail: string
  initialUnreadCount: number
}

export function PortalShell({ children, userEmail, initialUnreadCount }: PortalShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)

  useEffect(() => {
    setUnreadCount(initialUnreadCount)
  }, [initialUnreadCount])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err))
    }

    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Push notification permission granted.')
          }
        })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Build active label for breadcrumb
  const activeItem = NAV.flatMap(g => g.items).find(item =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', height: '100vh', background: '#050505', color: '#ededed', position: 'relative' }}>
      <RealtimeProvider />

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          width: '234px',
          background: '#080808',
          borderRight: '1px solid #161616',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'auto',
        }}
        className={`portal-sidebar${sidebarOpen ? ' open' : ''}`}
      >
        {/* Logo header */}
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '1px solid #161616', flexShrink: 0 }}>
          <Link href="/portal" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', position: 'relative', flexShrink: 0 }}>
              <Image src="/assets/logo/csvertex-logo.png" alt="CS Vertex" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>CS Vertex</div>
              <div style={{ fontSize: '10px', color: '#FF5A2A', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Client Portal</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'none' }}
            className="portal-close-btn"
          >
            <X size={17} />
          </button>
        </div>

        {/* Nav groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px', scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a transparent' }}>
          {NAV.map(group => (
            <div key={group.group} style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#3a3a3a', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 10px', marginBottom: '6px' }}>
                {group.group}
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {group.items.map(item => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#fff' : '#555',
                        background: isActive ? 'rgba(255,90,42,0.08)' : 'transparent',
                        borderLeft: isActive ? '2px solid #FF5A2A' : '2px solid transparent',
                        textDecoration: 'none',
                        transition: 'all 0.16s ease',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                      }}
                      className="portal-nav-link"
                    >
                      <item.icon
                        size={15}
                        style={{ color: isActive ? '#FF5A2A' : '#3a3a3a', flexShrink: 0 }}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User + logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #161616', flexShrink: 0 }}>
          {/* User row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', marginBottom: '4px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: '#fff',
            }}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
              <div style={{ fontSize: '10px', color: '#444' }}>Client Account</div>
            </div>
          </div>

          <Link href="/portal/settings" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 10px', borderRadius: '7px', fontSize: '12px', color: '#555', textDecoration: 'none', transition: 'all 0.16s ease', cursor: 'pointer' }} className="portal-nav-link">
            <Settings size={14} /> Settings
          </Link>
          <form action={logout}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '7px 10px', width: '100%', borderRadius: '7px', fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.16s ease', textAlign: 'left', pointerEvents: 'auto' }} className="portal-logout-btn">
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, marginLeft: '234px', pointerEvents: 'auto' }} className="portal-main">
        {/* Header */}
        <header style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #161616',
          background: 'rgba(5,5,5,0.92)',
          padding: '0 28px',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexShrink: 0,
          pointerEvents: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'none' }}
              className="portal-hamburger"
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555' }}>
              <span>Portal</span>
              <ChevronRight size={13} style={{ color: '#2a2a2a' }} />
              <span style={{ color: '#ededed', fontWeight: 600 }}>{activeItem?.label ?? 'Dashboard'}</span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', pointerEvents: 'auto' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', color: '#555', pointerEvents: 'none' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid #1a1a1a', 
                  borderRadius: '20px', 
                  padding: '6px 14px 6px 34px', 
                  color: '#ededed', 
                  fontSize: '13px', 
                  outline: 'none', 
                  width: '160px',
                  transition: 'all 0.2s ease',
                  cursor: 'text',
                }} 
                onFocus={(e) => { e.currentTarget.style.width = '220px'; e.currentTarget.style.borderColor = '#FF5A2A'; e.currentTarget.style.background = '#0a0a0a' }}
                onBlur={(e) => { e.currentTarget.style.width = '160px'; e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              />
            </div>
            
            <Link href="/portal/notifications" style={{ position: 'relative', color: '#555', textDecoration: 'none', display: 'flex', cursor: 'pointer', pointerEvents: 'auto' }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: '#FF5A2A', fontSize: '8px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', pointerEvents: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 28px' }}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay — only when sidebar is open */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .portal-sidebar { transform: translateX(-100%); }
          .portal-sidebar.open { transform: translateX(0); }
          .portal-close-btn { display: flex !important; }
          .portal-hamburger { display: flex !important; }
          .portal-main { margin-left: 0 !important; }
        }
        .portal-nav-link:hover {
          background: rgba(255,90,42,0.04) !important;
          color: #aaa !important;
        }
        .portal-logout-btn:hover {
          background: rgba(255,60,60,0.07) !important;
          color: #ff5555 !important;
        }
      `}</style>
    </div>
  )
}
