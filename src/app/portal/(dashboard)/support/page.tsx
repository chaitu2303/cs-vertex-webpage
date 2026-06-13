import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



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
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>Support Center</h1>

      <div style={{ background: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #333', marginBottom: '40px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '20px' }}>Create Support Ticket</h3>
        <form action={submitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>Subject</label>
            <input name="subject" required style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>Message</label>
            <textarea name="message" required rows={4} style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '14px', background: 'var(--acid)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}>
            Submit Ticket
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '20px' }}>My Tickets</h3>
      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        {tickets.length === 0 ? (
          <p style={{ padding: '20px', color: '#888', fontSize: '14px' }}>No active support tickets.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#222' }}>
              <tr>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Ticket ID</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Subject</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Status</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderTop: '1px solid #333' }}>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>#{t.id.slice(0,6)}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>{t.subject}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: t.status === 'Open' ? 'rgba(255,255,0,0.1)' : 'rgba(0,255,0,0.1)',
                      color: t.status === 'Open' ? 'yellow' : '#0f0' 
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#aaa' }}>{t.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

