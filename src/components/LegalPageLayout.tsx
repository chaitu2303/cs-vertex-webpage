import React from 'react'

export interface LegalSection {
  id: string
  title: string
}

export interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  sections?: LegalSection[]
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, sections, children }: LegalPageLayoutProps) {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px', color: '#a0a0a0' }}>
      
      {/* Premium Header Gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 62, 0, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4vw', position: 'relative' }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: '#fff', marginBottom: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</h1>
          <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px' }}>
            <p style={{ color: 'var(--acid)', font: '12px var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Last Updated: {lastUpdated}</p>
          </div>
        </div>
        
        <div className="legal-container">
          {/* Sidebar */}
          {sections && sections.length > 0 && (
            <aside className="legal-sidebar">
              <div className="sticky-nav">
                <h4 style={{ color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', fontWeight: 600 }}>Contents</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {sections.map(sec => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`} className="toc-link">{sec.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="legal-content">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        .legal-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .legal-container {
            grid-template-columns: 280px 1fr;
            gap: 80px;
          }
        }
        .legal-sidebar {
          display: none;
        }
        @media (min-width: 1024px) {
          .legal-sidebar {
            display: block;
          }
        }
        .sticky-nav {
          position: sticky;
          top: 120px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }
        .toc-link {
          color: #888;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          display: block;
          line-height: 1.4;
        }
        .toc-link:hover {
          color: var(--acid);
          transform: translateX(4px);
        }
        
        .legal-content {
          font-size: 16px;
          line-height: 1.8;
          color: #a0a0a0;
        }
        .legal-content section {
          margin-bottom: 60px;
          scroll-margin-top: 120px;
        }
        .legal-content h2 { 
          color: #fff; 
          font-size: 28px; 
          margin: 0 0 20px; 
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .legal-content h2 span {
          color: var(--acid);
          margin-right: 12px;
          font-family: var(--mono);
          font-size: 20px;
        }
        .legal-content h3 { 
          color: #eee; 
          font-size: 20px; 
          margin: 30px 0 15px; 
          font-weight: 500; 
        }
        .legal-content p { 
          margin: 0 0 20px; 
        }
        .legal-content ul { 
          padding-left: 0; 
          margin: 0 0 30px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          list-style: none;
        }
        .legal-content ul li {
          position: relative;
          padding-left: 24px;
        }
        .legal-content ul li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--acid);
          font-size: 18px;
          line-height: 1.6;
        }
        .legal-content a { 
          color: #fff; 
          text-decoration: none; 
          border-bottom: 1px solid var(--acid);
          transition: all 0.2s;
        }
        .legal-content a:hover {
          color: var(--acid);
        }
      `}</style>
    </div>
  )
}
