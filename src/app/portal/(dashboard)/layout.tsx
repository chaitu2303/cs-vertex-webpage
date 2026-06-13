import { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/portal/actions'
import { RealtimeProvider } from '@/components/RealtimeProvider'

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <RealtimeProvider />
      
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#111', borderRight: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--acid)' }}>CS Vertex</h2>
          <p style={{ fontSize: '12px', color: '#888' }}>Client Portal</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <Link href="/portal" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block', background: '#222' }}>
            Dashboard
          </Link>
          <Link href="/portal/notifications" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            Notifications
          </Link>
          <Link href="/portal/projects" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            My Projects
          </Link>
          <Link href="/portal/quotes" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            My Quotes
          </Link>
          <Link href="/portal/consultations" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            Consultations
          </Link>
          <Link href="/portal/documents" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            Documents
          </Link>
          <Link href="/portal/support" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            Support Tickets
          </Link>
          <div style={{ marginTop: '10px', marginBottom: '5px', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Learning</div>
          <Link href="/portal/student-dashboard" style={{ color: '#ccc', textDecoration: 'none', padding: '10px', borderRadius: '4px', display: 'block' }}>
            My Applications
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #333', fontSize: '12px', color: '#888' }}>
          Logged in as<br/>
          <strong style={{ color: '#fff' }}>{user.email}</strong>
          <form action={logout} style={{ marginTop: '10px' }}>
            <button type="submit" className="hover:bg-[#ff44441a]" style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #333', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>

    </div>
  )
}
