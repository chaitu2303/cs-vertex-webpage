import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { FileText, Download } from 'lucide-react'

export default async function DocumentsPage() {
  const user = await getCachedUser()
  if (!user) return null

  const docs = await prisma.document.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  const typeColor: Record<string, { bg: string, text: string }> = {
    Proposal: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    Invoice: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
    Brochure: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
    Quotation: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>My Documents</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Access proposals, invoices, brochures, and files shared by the CS Vertex team.</p>
      </div>

      {docs.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #1e1e1e', borderRadius: '16px', padding: '64px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', minHeight: '400px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <FileText size={24} style={{ color: '#FF5A2A' }} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>No documents yet</h2>
          <p style={{ fontSize: '13px', color: '#555', maxWidth: '360px', lineHeight: 1.6, margin: 0 }}>
            Proposals, invoices, and other shared files from our team will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {docs.map(doc => {
            const tc = typeColor[doc.type] || { bg: 'rgba(255,255,255,0.05)', text: '#888' }
            return (
              <div key={doc.id} style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: tc.bg, border: `1px solid ${tc.text}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} style={{ color: tc.text }} />
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: tc.bg, color: tc.text }}>{doc.type}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', color: '#ededed', fontWeight: 600, margin: '0 0 4px' }}>{doc.title}</h3>
                  <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>Added {doc.createdAt.toLocaleDateString()}</p>
                </div>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 14px', background: 'rgba(255,90,42,0.08)',
                  border: '1px solid rgba(255,90,42,0.2)', color: '#FF5A2A',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                  transition: 'background 0.15s'
                }}>
                  <Download size={13} /> Download
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
