import React from 'react'

export default function AdminLoading() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ height: '32px', width: '200px', background: '#111', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px', height: '110px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>

      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '30px', height: '200px', animation: 'pulse 1.5s infinite' }} />

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
