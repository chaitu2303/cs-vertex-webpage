import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



export default async function QuotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
      data: {
        customerId: user!.id,
        service,
        budget,
        description,
      }
    })
    revalidatePath('/portal/quotes')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px' }}>My Quotes</h1>
      </div>

      <div style={{ background: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #333', marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px' }}>Request a New Quote</h3>
        <form action={submitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>Service Required</label>
            <input name="service" required style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>Estimated Budget</label>
            <input name="budget" placeholder="e.g. $5,000 - $10,000" style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#ccc' }}>Project Description</label>
            <textarea name="description" required rows={4} style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '14px', background: 'var(--acid)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}>
            Submit Quote Request
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Previous Submissions</h3>
      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        {quotes.length === 0 ? (
          <p style={{ padding: '20px', color: '#888', fontSize: '14px' }}>You haven't submitted any quotes yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#222' }}>
              <tr>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Service</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Date</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Status</th>
                <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Proposal</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(quote => (
                <tr key={quote.id} style={{ borderTop: '1px solid #333' }}>
                  <td style={{ padding: '15px', fontSize: '14px' }}>{quote.service}</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#aaa' }}>{quote.createdAt.toLocaleDateString()}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: quote.status === 'Pending' ? 'rgba(255,255,0,0.1)' : 'rgba(0,255,0,0.1)',
                      color: quote.status === 'Pending' ? 'yellow' : '#0f0' 
                    }}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    {quote.proposalUrl ? (
                      <a href={quote.proposalUrl} target="_blank" style={{ color: 'var(--acid)' }}>View PDF</a>
                    ) : (
                      <span style={{ color: '#555' }}>Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

