"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CompanyBrochure() {
  const [activeTab, setActiveTab] = useState<'packages' | 'profile'>('packages')

  useEffect(() => {
    // Add print styles dynamically
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        @page { size: A4 portrait; margin: 0; }
        body { background: white !important; color: black !important; }
        .no-print { display: none !important; }
        .print-page { page-break-after: always; height: 100vh; padding: 40px; box-sizing: border-box; }
        .dark-text { color: #111 !important; }
        .acid-accent { color: #ff5c2a !important; }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      
      {/* Header */}
      <header className="no-print" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff', fontSize: '18px', fontWeight: 600 }}>
          <img src="/assets/logo/csvertex-logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>CS VERTEX</span>
        </Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('packages')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'packages' ? 'var(--acid)' : 'transparent',
              border: activeTab === 'packages' ? '1px solid var(--acid)' : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === 'packages' ? '#000' : '#fff',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            Service Packages
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'profile' ? 'var(--acid)' : 'transparent',
              border: activeTab === 'profile' ? '1px solid var(--acid)' : '1px solid rgba(255,255,255,0.1)',
              color: activeTab === 'profile' ? '#000' : '#fff',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            Corporate Profile
          </button>
        </div>
      </header>

      {/* Floating Download/Print Button */}
      <div className="no-print" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
        {activeTab === 'packages' ? (
          <a 
            href="/assets/brochures/cs-vertex-packages.png" 
            download="CS_VERTEX_PACKAGES.png"
            style={{ 
              display: 'inline-block',
              background: 'var(--acid)', 
              color: '#000', 
              padding: '16px 32px', 
              borderRadius: '30px', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(255,92,42,0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ↓ Download Packages Poster
          </a>
        ) : (
          <button 
            onClick={() => window.print()}
            style={{ 
              background: 'var(--acid)', 
              color: '#000', 
              padding: '16px 32px', 
              borderRadius: '30px', 
              fontWeight: 'bold', 
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255,92,42,0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Print Profile (PDF)
          </button>
        )}
      </div>

      {/* TAB 1: SERVICE PACKAGES POSTER DISPLAY */}
      {activeTab === 'packages' && (
        <main className="no-print" style={{ padding: '40px 4vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: '#fff', background: 'linear-gradient(to right, #ff5c2a, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Service Packages & Pricing
            </h1>
            <p style={{ color: '#888', marginTop: '10px', fontSize: '15px' }}>View our official enterprise packages poster below. You can download a high-resolution version using the button below.</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.01)', 
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '900px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img 
              src="/assets/brochures/cs-vertex-packages.png" 
              alt="CS Vertex Packages Poster" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }} 
            />
          </div>
        </main>
      )}

      {/* TAB 2: CORPORATE PROFILE (Original printable design) */}
      {(activeTab === 'profile' || typeof window === 'undefined') && (
        <div className={activeTab === 'profile' ? 'fade-in' : 'print-only'}>
          {/* PAGE 1: COVER */}
          <div className="print-page flex flex-col justify-center items-center text-center bg-[#050505] text-white" style={{ minHeight: '100vh', padding: '4vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="text-6xl font-bold mb-4" style={{ fontSize: '70px', margin: '0 0 10px 0' }}>CS VERTEX</h1>
            <p className="text-[#ff5c2a] text-xl tracking-[0.2em] uppercase mb-16" style={{ color: 'var(--acid)', fontSize: '20px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 60px 0' }}>Enterprise Engineering</p>
            <p className="max-w-2xl text-gray-400 text-lg leading-relaxed" style={{ color: '#aaa', maxWidth: '600px', fontSize: '18px', lineHeight: 1.6, textAlign: 'center', margin: '0 0 100px 0' }}>
              Pioneering the future of scalable enterprise web architecture, native mobile solutions, 
              artificial intelligence, and custom embedded hardware.
            </p>
            <div className="mt-auto pb-12 text-sm text-gray-500 uppercase tracking-widest" style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 'auto' }}>
              Corporate Profile & Services • 2026
            </div>
          </div>

          {/* PAGE 2: ABOUT */}
          <div className="print-page bg-white text-black" style={{ minHeight: '100vh', padding: '80px', background: '#fff', color: '#111' }}>
            <h2 className="text-4xl font-bold mb-12" style={{ fontSize: '36px', color: 'var(--acid)', marginBottom: '50px' }}>About CS Vertex</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
              <div>
                <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '25px' }}>
                  CS Vertex is not just a software agency; we are a holistic technology partner capable of handling the entire product lifecycle—from PCB hardware design to global cloud deployments.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.7 }}>
                  We specialize in deep-tech solutions for enterprise, government, and high-growth startup sectors, ensuring absolute security, performance, and scalability.
                </p>
              </div>
              <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '12px', borderLeft: '4px solid var(--acid)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '20px' }}>Core Competencies</h3>
                <ul style={{ display: 'grid', gap: '15px', listStyle: 'none', padding: 0, fontWeight: 500 }}>
                  <li>✓ Enterprise Web Architecture</li>
                  <li>✓ Native iOS & Android Apps</li>
                  <li>✓ AI & Machine Learning Integration</li>
                  <li>✓ IoT & Embedded Hardware Design</li>
                  <li>✓ Cloud DevOps & Security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PAGE 3: SERVICES */}
          <div className="print-page bg-[#f9f9f9] text-black" style={{ minHeight: '100vh', padding: '80px', background: '#f5f5f5', color: '#111' }}>
            <h2 className="text-4xl font-bold mb-12" style={{ fontSize: '36px', color: 'var(--acid)', marginBottom: '50px' }}>Our Expertise</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>Software & Web</h3>
                <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>High-availability web applications, distributed microservices, and massive real-time data pipelines.</p>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Tech: Next.js, Node.js, Go, PostgreSQL, AWS</p>
              </div>
              <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>AI & Data Science</h3>
                <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>Custom LLMs, predictive analytics, computer vision, and autonomous agent orchestration.</p>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Tech: PyTorch, TensorFlow, OpenAI, HuggingFace</p>
              </div>
              <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>Mobile Platforms</h3>
                <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>Fluid, native-grade iOS and Android experiences with complex device hardware interactions.</p>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Tech: React Native, Swift, Kotlin, Flutter</p>
              </div>
              <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>Hardware & IoT</h3>
                <p style={{ color: '#555', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>Custom PCB design, firmware development, edge computing, and industrial IoT networking.</p>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Tech: C/C++, Rust, ARM, ESP32, Altium</p>
              </div>
            </div>
          </div>

          {/* PAGE 4: CONTACT */}
          <div className="print-page bg-[#050505] text-white flex flex-col justify-center items-center text-center" style={{ minHeight: '100vh', padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 className="text-5xl font-bold mb-12" style={{ fontSize: '48px', marginBottom: '50px' }}>Let's Build The Future</h2>
            
            <div style={{ display: 'grid', gap: '20px', fontSize: '20px', marginBottom: '60px' }}>
              <p><strong style={{ color: 'var(--acid)' }}>Email:</strong> hello@csvertex.com</p>
              <p><strong style={{ color: 'var(--acid)' }}>Phone:</strong> +91 72889 77131</p>
              <p><strong style={{ color: 'var(--acid)' }}>Web:</strong> www.csvertex.com</p>
            </div>

            <div style={{ padding: '30px', border: '1px solid #333', borderRadius: '12px', background: '#111', width: '100%', maxWidth: '400px' }}>
              <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Global Headquarters</p>
              <p style={{ fontSize: '18px', marginTop: '10px', margin: '10px 0 0 0' }}>Hyderabad, Telangana, India</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media print {
          .print-only { display: block !important; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>
    </div>
  )
}
