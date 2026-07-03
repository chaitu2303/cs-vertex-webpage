import { prisma } from '@/lib/prisma'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, CheckCircle, XCircle, Download, FileText, QrCode } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { MsmeLogo } from '@/components/MsmeLogo'

export const metadata: Metadata = {
  title: 'Verify Certificate | CS Vertex',
  description: 'Verify the authenticity of CS Vertex certificates.',
}

export const dynamic = 'force-dynamic'

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const idParam = params.id as string | undefined;
  
  let certificate = null;
  let hasSearched = false;

  if (idParam) {
    hasSearched = true;
    certificate = await prisma.certificate.findUnique({
      where: { certificateId: idParam },
    });
  }

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, paddingTop: '140px', paddingBottom: '120px' }}>
        <div className="container-1400" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 48px)', color: 'var(--ink)', fontWeight: 800, marginBottom: '16px' }}>
              Certificate Verification
            </h1>
            <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Enter your Certificate ID below to verify its authenticity and download the official digital copy.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ 
            background: 'white', 
            padding: '10px', 
            borderRadius: '100px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            marginBottom: '40px'
          }}>
            <form action="/verify" method="GET" style={{ display: 'flex', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', color: '#888' }}>
                <Search size={20} />
              </div>
              <input 
                type="text" 
                name="id"
                defaultValue={idParam || ''}
                placeholder="e.g. CSV-2026-0001" 
                required
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  padding: '16px 20px',
                  fontSize: '18px',
                  background: 'transparent',
                  color: 'var(--ink)'
                }}
              />
              <button 
                type="submit"
                style={{ 
                  background: 'var(--acid)', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '100px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Verify Certificate
              </button>
            </form>
          </div>

          {/* Verification Results */}
          {hasSearched && (
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '40px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              animation: 'fadeInUp 0.5s ease-out'
            }}>
              {certificate ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '20px' }}>
                      <CheckCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: '24px', color: '#111', fontWeight: 700, margin: '0 0 8px 0' }}>Certificate Verified</h2>
                    <p style={{ color: '#22c55e', fontWeight: 600, margin: 0 }}>This is a valid CS Vertex Certificate.</p>
                  </div>

                  <div style={{ background: '#fcfcfc', borderRadius: '16px', padding: '30px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Candidate Name</span>
                        <span style={{ fontSize: '18px', color: '#111', fontWeight: 600 }}>{certificate.studentName}</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Certificate ID</span>
                        <span style={{ fontSize: '18px', color: '#FF6B2C', fontWeight: 600, fontFamily: 'var(--mono)' }}>{certificate.certificateId}</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ display: 'block', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Course / Program</span>
                        <span style={{ fontSize: '18px', color: '#111', fontWeight: 600 }}>{certificate.course}</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Issue Date</span>
                        <span style={{ fontSize: '18px', color: '#111', fontWeight: 600 }}>
                          {new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Issued By</span>
                          <span style={{ fontSize: '18px', color: '#111', fontWeight: 600 }}>CS Vertex Pvt. Ltd.</span>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: 'rgba(0,0,0,0.1)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            <MsmeLogo />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recognized</span>
                            <span style={{ fontSize: '13px', color: '#111', fontWeight: 600 }}>MSME</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <a 
                      href={certificate.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '14px 28px', background: '#111', color: 'white', borderRadius: '12px',
                        textDecoration: 'none', fontWeight: 600, transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#000'}
                      onMouseOut={e => e.currentTarget.style.background = '#111'}
                    >
                      <FileText size={18} /> View Certificate
                    </a>
                    <a 
                      href={certificate.fileUrl} 
                      download 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '14px 28px', background: 'transparent', color: '#111', borderRadius: '12px',
                        border: '1px solid #ddd', textDecoration: 'none', fontWeight: 600, transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Download size={18} /> Download PDF
                    </a>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '20px' }}>
                    <XCircle size={40} />
                  </div>
                  <h2 style={{ fontSize: '24px', color: '#111', fontWeight: 700, margin: '0 0 12px 0' }}>Certificate Not Found</h2>
                  <p style={{ color: '#666', fontSize: '16px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
                    We couldn't find a certificate matching the ID <strong>"{idParam}"</strong>.<br />
                    Please check the ID and try again, or contact CS Vertex support.
                  </p>
                  <Link href="/contact" style={{ color: '#FF6B2C', fontWeight: 600, textDecoration: 'none' }}>
                    Contact Support →
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
