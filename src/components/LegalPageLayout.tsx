import React from 'react'

export function LegalPageLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <div style={{ background: '#090a0a', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px', color: '#ccc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 4vw' }}>
        <h1 style={{ fontSize: '48px', color: '#fff', marginBottom: '15px', fontWeight: 500 }}>{title}</h1>
        <p style={{ color: 'var(--acid)', font: '11px var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '60px' }}>Last Updated: {lastUpdated}</p>
        
        <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '15px', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
      <style>{`
        .legal-content h2 { color: '#fff'; font-size: 24px; margin: 20px 0 10px; font-weight: 500; }
        .legal-content h3 { color: '#eee'; font-size: 18px; margin: 15px 0 5px; font-weight: 500; }
        .legal-content p { margin: 0; }
        .legal-content ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .legal-content a { color: var(--acid); text-decoration: underline; }
      `}</style>
    </div>
  )
}
