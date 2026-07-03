import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { Calendar, Video } from 'lucide-react'

export default async function ConsultationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const consults = await prisma.consultation.findMany({
    where: { customerId: user.id },
    orderBy: { date: 'asc' }
  })

  const upcoming = consults.filter(c => c.status === 'Scheduled')
  const past = consults.filter(c => c.status !== 'Scheduled')

  const statusColor = (s: string) => {
    if (s === 'Completed') return { bg: 'rgba(16,185,129,0.1)', text: '#10b981' }
    if (s === 'Cancelled') return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' }
    return { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Meetings & Consultations</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>View your scheduled and past consultation sessions with our team.</p>
      </div>

      {consults.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #1e1e1e', borderRadius: '16px', padding: '64px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', minHeight: '400px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Video size={24} style={{ color: '#FF5A2A' }} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>No consultations scheduled</h2>
          <p style={{ fontSize: '13px', color: '#555', maxWidth: '360px', lineHeight: 1.6, margin: 0 }}>
            Consultation sessions booked by the CS Vertex team will appear here. Contact us at <span style={{ color: '#FF5A2A' }}>hello@csvertex.com</span> to book a session.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {upcoming.length > 0 && (
            <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Upcoming Sessions</h2>
              </div>
              {upcoming.map((c, idx) => (
                <div key={c.id} style={{ padding: '16px 24px', borderBottom: idx < upcoming.length - 1 ? '1px solid #0d0d0d' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Calendar size={16} style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#ededed', fontWeight: 500, margin: '0 0 3px' }}>{new Date(c.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{new Date(c.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>Scheduled</span>
                    {c.notes && <span style={{ fontSize: '12px', color: '#555' }}>{c.notes}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #111' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#555', margin: 0 }}>Past Sessions</h2>
              </div>
              {past.map((c, idx) => {
                const sc = statusColor(c.status)
                return (
                  <div key={c.id} style={{ padding: '14px 24px', borderBottom: idx < past.length - 1 ? '1px solid #0d0d0d' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#ededed', margin: '0 0 3px' }}>{new Date(c.date).toLocaleDateString()}</p>
                      <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>{c.notes || 'No notes'}</p>
                    </div>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: sc.bg, color: sc.text }}>{c.status}</span>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
