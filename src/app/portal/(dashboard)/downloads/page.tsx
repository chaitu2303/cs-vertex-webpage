import { Download, Folder } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function DownloadsPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>
          Downloads
        </h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
          Access files, reports, and resources shared by your CS Vertex team.
        </p>
      </div>

      {/* Empty state */}
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
          <Download size={24} style={{ color: '#FF5A2A' }} />
        </div>
        <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>
          No downloads available
        </h2>
        <p style={{ fontSize: '13px', color: '#555', maxWidth: '360px', lineHeight: 1.6, margin: 0 }}>
          Files shared by your CS Vertex team — such as project reports, design assets, and deliverables — will appear here.
        </p>

        {/* Feature chips */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Project Reports', 'Design Assets', 'Deliverables', 'Contracts'].map(label => (
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
          <Folder size={13} />
          <span>Your project manager will upload files to this space as work progresses</span>
        </div>
      </div>
    </div>
  )
}
