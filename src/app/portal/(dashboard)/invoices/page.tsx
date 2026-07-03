import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { CreditCard, Download, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const user = await getCachedUser()
  if (!user) return null

  const invoices = await prisma.document.findMany({
    where: { customerId: user.id, type: 'Invoice' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>
          Invoices & Payments
        </h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
          View and download your invoices from CS Vertex.
        </p>
      </div>

      {invoices.length === 0 ? (
        /* Empty state */
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #1e1e1e',
          borderRadius: '16px',
          padding: '64px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.01)',
          minHeight: '400px',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
          }}>
            <CreditCard size={24} style={{ color: '#FF5A2A' }} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>
            No invoices yet
          </h2>
          <p style={{ fontSize: '13px', color: '#555', maxWidth: '340px', lineHeight: 1.6, margin: 0 }}>
            Your invoices from CS Vertex will appear here once a project is billed. Contact your project manager for payment details.
          </p>

          {/* Info chips */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['PDF Download', 'Payment History', 'Receipt Management'].map(label => (
              <span key={label} style={{
                fontSize: '11px', color: '#444', border: '1px solid #1e1e1e',
                background: 'rgba(255,255,255,0.02)', borderRadius: '20px',
                padding: '5px 14px', fontFamily: 'monospace', letterSpacing: '0.05em',
              }}>
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '28px', fontSize: '12px', color: '#3a3a3a' }}>
            <Clock size={13} />
            <span>Invoices are generated within 24 hours of project milestones</span>
          </div>
        </div>
      ) : (
        /* Invoice Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {invoices.map(invoice => (
            <div key={invoice.id} style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} style={{ color: '#FF5A2A' }} />
                </div>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Shared</span>
              </div>
              <div>
                <h3 style={{ fontSize: '14px', color: '#ededed', fontWeight: 600, margin: '0 0 4px' }}>{invoice.title}</h3>
                <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>Billed {new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <a href={invoice.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 14px', background: 'rgba(255,90,42,0.08)',
                border: '1px solid rgba(255,90,42,0.2)', color: '#FF5A2A',
                borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                transition: 'background 0.15s', justifyContent: 'center'
              }}>
                <Download size={13} /> View Invoice
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
