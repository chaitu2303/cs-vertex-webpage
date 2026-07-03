import React from 'react'

const process = [
  { step: '01', name: 'Discovery', desc: 'Understanding requirements and business goals.' },
  { step: '02', name: 'Planning', desc: 'System architecture and resource allocation.' },
  { step: '03', name: 'Design', desc: 'UI/UX mockups and hardware schematics.' },
  { step: '04', name: 'Development', desc: 'Agile coding and physical prototyping.' },
  { step: '05', name: 'Testing', desc: 'Rigorous QA and security validation.' },
  { step: '06', name: 'Deployment', desc: 'Cloud rollout and hardware installation.' },
  { step: '07', name: 'Support', desc: 'Long-term maintenance and scaling.' },
]

export function DevelopmentProcess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
      {process.map(p => (
        <div key={p.step} className="process-step reveal" style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#111', padding: '20px', borderLeft: '2px solid var(--acid)', borderRadius: '0 8px 8px 0' }}>
          <div style={{ font: '24px var(--mono)', color: 'var(--acid)', opacity: 0.5 }}>{p.step}</div>
          <div>
            <h4 style={{ margin: '0 0 5px', fontSize: '18px', color: '#fff' }}>{p.name}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
