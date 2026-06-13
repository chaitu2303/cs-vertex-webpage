import { prisma } from '@/lib/prisma'
import Link from 'next/link'



export const revalidate = 0

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Quotes & CRM</h1>
      </div>

      <div className="premium-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Service</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No quotes received yet.</td>
              </tr>
            ) : (
              quotes.map(quote => (
                <tr key={quote.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#888' }}>{quote.createdAt.toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{quote.customer?.email || 'Unknown'}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{quote.service}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      background: quote.status === 'Pending Review' ? 'rgba(255,170,0,0.1)' :
                                  quote.status === 'Proposal Sent' ? 'rgba(62,142,255,0.1)' :
                                  quote.status === 'Approved' ? 'rgba(68,255,68,0.1)' :
                                  quote.status === 'Completed' ? 'rgba(170,68,255,0.1)' :
                                  'rgba(255,255,255,0.1)',
                      color: quote.status === 'Pending Review' ? '#ffaa00' :
                             quote.status === 'Proposal Sent' ? '#3e8eff' :
                             quote.status === 'Approved' ? '#44ff44' :
                             quote.status === 'Completed' ? '#aa44ff' :
                             '#ccc'
                    }}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Link href={`/admin/quotes/${quote.id}`} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', fontSize: '12px', textDecoration: 'none' }}>
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .premium-glass-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; }
      `}</style>
    </div>
  )
}

