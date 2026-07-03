export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'



export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>Customer Management</h1>

      <div style={{ background: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#222' }}>
            <tr>
              <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Name</th>
              <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Company</th>
              <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Email</th>
              <th style={{ padding: '15px', fontSize: '13px', color: '#888' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #333' }}>
                <td style={{ padding: '15px', fontSize: '14px' }}>{c.name || 'N/A'}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#aaa' }}>{c.company || 'N/A'}</td>
                <td style={{ padding: '15px', fontSize: '14px' }}>{c.email}</td>
                <td style={{ padding: '15px', fontSize: '14px', color: '#888' }}>{c.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}




