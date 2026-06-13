import React from 'react'

const industries = [
  { name: 'Education', icon: '01' },
  { name: 'Healthcare', icon: '02' },
  { name: 'Manufacturing', icon: '03' },
  { name: 'Real Estate', icon: '04' },
  { name: 'Government', icon: '05' },
  { name: 'Retail', icon: '06' },
  { name: 'Startups', icon: '07' },
]

export function IndustriesWeServe() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginTop: '30px' }}>
      {industries.map(ind => (
        <div key={ind.name} className="industry-card" style={{ background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '25px 20px', textAlign: 'center', transition: '0.3s' }}>
          <div style={{ font: '14px var(--mono)', color: 'var(--acid)', marginBottom: '10px', opacity: 0.8 }}>{ind.icon}</div>
          <h4 style={{ fontSize: '13px', color: '#fff', margin: 0, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{ind.name}</h4>
        </div>
      ))}
    </div>
  )
}
