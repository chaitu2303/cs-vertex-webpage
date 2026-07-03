import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Target, Plus, ExternalLink } from 'lucide-react'

export default async function QuotesPage() {
  const user = await getCachedUser()
  if (!user) return null

  const quotes = await prisma.quote.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  async function submitQuote(formData: FormData) {
    "use server"
    const service = formData.get('service') as string
    const budget = formData.get('budget') as string
    const description = formData.get('description') as string
    await prisma.quote.create({
      data: { customerId: user!.id, service, budget, description }
    })
    revalidatePath('/portal/quotes')
  }

  const statusColor = (s: string) => {
    if (s === 'Approved' || s === 'Completed') return { bg: 'rgba(16,185,129,0.1)', text: '#10b981' }
    if (s === 'Rejected') return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' }
    if (s === 'In Progress') return { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' }
    return { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Quotes & Proposals</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Submit service requests and track your quote history.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* New Quote Form */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Request a New Quote</h2>
          </div>
          <form action={submitQuote} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Service Required *</label>
              <select name="service" required style={{
                width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e',
                borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box', outline: 'none'
              }}>
                <option value="">Select a service...</option>
                <option>Web Application Development</option>
                <option>Mobile App Development</option>
                <option>AI / Machine Learning</option>
                <option>IoT & Embedded Systems</option>
                <option>Cybersecurity</option>
                <option>UI/UX Design</option>
                <option>Enterprise Software</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Estimated Budget</label>
              <input name="budget" placeholder="e.g. ₹50,000 – ₹1,00,000" style={{
                width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e',
                borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box', outline: 'none'
              }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Project Description *</label>
              <textarea name="description" required rows={4} placeholder="Describe what you need built..." style={{
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
              <Plus size={14} /> Submit Request
            </button>
          </form>
        </div>

        {/* Quote History */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Quote History</h2>
          </div>
          {quotes.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textAlign: 'center' }}>
              <Target size={32} style={{ color: '#2a2a2a', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>No quotes submitted yet.</p>
            </div>
          ) : (
            <div>
              {quotes.map((q, idx) => {
                const sc = statusColor(q.status)
                return (
                  <Link key={q.id} href={`/portal/quotes/${q.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '14px 24px', borderBottom: idx < quotes.length - 1 ? '1px solid #0d0d0d' : 'none',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                      cursor: 'pointer', transition: 'background 0.15s'
                    }}
                      onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 500, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.service}</p>
                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>{q.createdAt.toLocaleDateString()}{q.budget ? ` · ${q.budget}` : ''}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: sc.bg, color: sc.text }}>
                          {q.status}
                        </span>
                        <ExternalLink size={13} style={{ color: '#333' }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
