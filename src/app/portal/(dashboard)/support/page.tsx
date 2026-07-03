import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { MessageSquare, ArrowRight } from 'lucide-react'

export default async function SupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const tickets = await prisma.supportTicket.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  async function submitTicket(formData: FormData) {
    "use server"
    await prisma.supportTicket.create({
      data: {
        customerId: user!.id,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      }
    })
    revalidatePath('/portal/support')
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Support Center</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Create a support ticket and our team will get back to you within 24 hours.</p>
      </div>

      <div className="support-grid">

        {/* New Ticket Form */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Create Support Ticket</h2>
          </div>
          <form action={submitTicket} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Subject *</label>
              <input name="subject" required placeholder="Briefly describe your issue..." style={{
                width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e',
                borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box',
                outline: 'none'
              }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Message *</label>
              <textarea name="message" required rows={5} placeholder="Provide as much detail as possible..." style={{
                width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e',
                borderRadius: '8px', color: '#ededed', fontSize: '13px', resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none'
              }} />
            </div>
            <button type="submit" style={{
              padding: '11px 20px', background: '#FF5A2A', color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              Submit Ticket <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Ticket History */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>My Tickets</h2>
          </div>
          {tickets.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
              <MessageSquare size={32} style={{ color: '#2a2a2a', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>No support tickets yet.</p>
            </div>
          ) : (
            <div>
              {tickets.map(t => (
                <div key={t.id} style={{ padding: '14px 24px', borderBottom: '1px solid #0d0d0d', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 500, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</p>
                    <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>#{t.id.slice(0, 8)} · {t.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, flexShrink: 0,
                    background: t.status === 'Open' ? 'rgba(245,158,11,0.1)' : t.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                    color: t.status === 'Open' ? '#f59e0b' : t.status === 'Resolved' ? '#10b981' : '#3b82f6'
                  }}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        .support-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .support-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
