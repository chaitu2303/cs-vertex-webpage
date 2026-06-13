import React from 'react'

export default function PortalLoading() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: '32px', width: '250px', background: '#111', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '32px', width: '100px', background: '#111', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '25px', height: '110px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', height: '400px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', height: '400px', animation: 'pulse 1.5s infinite' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '2fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
