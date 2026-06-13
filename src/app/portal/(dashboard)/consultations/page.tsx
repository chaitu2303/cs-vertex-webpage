import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'



export default async function ConsultationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const consults = await prisma.consultation.findMany({
    where: { customerId: user.id },
    orderBy: { date: 'asc' }
  })

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>My Consultations</h1>

      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        {consults.length === 0 ? (
          <p style={{ padding: '20px', color: '#888', fontSize: '14px' }}>You have no upcoming consultations.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#222' }}>
              <tr>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Date</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Status</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Meeting Link / Notes</th>
              </tr>
            </thead>
            <tbody>
              {consults.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid #333' }}>
                  <td style={{ padding: '15px', fontSize: '14px' }}>{new Date(c.date).toLocaleString()}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>{c.status}</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#aaa' }}>{c.notes || 'Pending...'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

