import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'



export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const docs = await prisma.document.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>My Documents</h1>
      <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>Access your company brochures, proposals, invoices, and other shared files.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {docs.length === 0 ? (
          <p style={{ color: '#888', fontSize: '14px' }}>No documents available.</p>
        ) : (
          docs.map(doc => (
            <div key={doc.id} style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ padding: '4px 8px', background: '#222', borderRadius: '4px', fontSize: '11px', color: '#ccc' }}>
                  {doc.type}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>{doc.createdAt.toLocaleDateString()}</span>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#fff' }}>{doc.title}</h3>
              <a 
                href={doc.fileUrl} 
                target="_blank" 
                style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--acid)', color: '#000', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', borderRadius: '4px' }}
              >
                Download PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

