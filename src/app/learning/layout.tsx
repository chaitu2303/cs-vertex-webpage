import { Header } from '@/components/Header'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function LearningLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Header />
      
      <div style={{ paddingTop: '100px', background: '#050505', minHeight: '100vh', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 4vw' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, color: 'var(--acid)', margin: 0 }}>Learning Platform</h1>
              <p style={{ color: '#888', marginTop: '10px' }}>Master modern technology stacks through our intensive programs.</p>
            </div>
            {user ? (
              <Link href="/portal" style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                My Dashboard
              </Link>
            ) : (
              <Link href="/portal/login?next=/learning" style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                Log In
              </Link>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
            <Link href="/learning/internships" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px', background: '#111', borderRadius: '6px', border: '1px solid #333' }}>Internships</Link>
            <Link href="/learning/courses" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px', background: '#111', borderRadius: '6px', border: '1px solid #333' }}>Courses</Link>
            <Link href="/learning/workshops" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px', background: '#111', borderRadius: '6px', border: '1px solid #333' }}>Workshops</Link>
          </div>
          
          {children}
        </div>
      </div>
    </>
  )
}
