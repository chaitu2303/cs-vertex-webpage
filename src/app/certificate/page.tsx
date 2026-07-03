"use client"

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Search, CheckCircle, XCircle, Download, FileText } from 'lucide-react'
import { verifyCertificate } from '../actions/certificate'
import Link from 'next/link'
import Image from 'next/image'
import { MsmeLogo } from '@/components/MsmeLogo'

export default function CertificateVerificationPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    setError('')
    setResult(null)
    
    const res = await verifyCertificate(query.trim())
    if (res.success) {
      setResult(res.certificate)
    } else {
      setError(res.message)
    }
    
    setLoading(false)
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', paddingTop: '100px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4vw' }}>
          <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--acid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000' }}>
              <CheckCircle size={40} strokeWidth={2} />
            </div>
            <div className="section-index" style={{ justifyContent: 'center', marginBottom: '20px' }}><i></i> <span>OFFICIAL REGISTRY</span> <span>/</span> <span>CREDENTIALS</span></div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>Credential <em>Verification Portal</em></h1>
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>Enter the unique 16-digit Certificate ID or registered Email Address to verify the authenticity of credentials issued by CS Vertex.</p>
          </div>

          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px', position: 'relative', marginBottom: '50px' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. CSV-2026-001 or student@email.com"
              style={{
                width: '100%', padding: '24px 30px', paddingRight: '160px',
                background: '#111', border: '1px solid #333',
                borderRadius: '60px', color: '#fff', fontSize: '18px', outline: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                position: 'absolute', right: '10px', top: '10px', bottom: '10px',
                background: 'var(--ink)', color: '#fff', border: '1px solid #333', borderRadius: '50px',
                padding: '0 30px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Searching...' : <><Search size={18} /> VERIFY</>}
            </button>
          </form>

          {error && (
            <div style={{ padding: '20px 30px', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.2)', borderRadius: '12px', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, fontSize: '15px' }}>
              <XCircle size={24} /> {error}
            </div>
          )}

          {result && (
            <div className="cert-card" style={{ width: '100%', maxWidth: '700px', background: '#fff', border: '1px solid #ddd', borderRadius: '16px', overflow: 'hidden', color: '#111', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
              
              {/* Header / Seal Area */}
              <div style={{ padding: '40px 40px 30px', borderBottom: '2px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                    <MsmeLogo />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Credential</div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '32px', color: '#111', fontWeight: 700, letterSpacing: '-0.02em' }}>{result.studentName}</h3>
                    <p style={{ margin: 0, color: '#555', fontSize: '15px' }}>{result.email}</p>
                  </div>
                </div>
                {result.status === 'Valid' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: '#ecfdf5', border: '1px solid #10b981', padding: '10px 20px', borderRadius: '6px', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em' }}>
                      <CheckCircle size={20} strokeWidth={2.5} /> OFFICIAL RECORD
                    </div>
                    <span style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontWeight: 500 }}>Status: VALID</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: '#fef2f2', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '6px', fontSize: '15px', fontWeight: 700, letterSpacing: '0.05em' }}>
                      <XCircle size={20} strokeWidth={2.5} /> REVOKED
                    </div>
                    <span style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontWeight: 500 }}>Status: INVALID</span>
                  </div>
                )}
              </div>
              
              {/* Data Area */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', background: '#fafafa' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}><FileText size={14}/> Program Type</label>
                    <div style={{ color: '#111', fontSize: '16px', fontWeight: 500 }}>{result.type}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Issue Date</label>
                    <div style={{ color: '#111', fontSize: '16px', fontWeight: 500 }}>{new Date(result.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Course / Title</label>
                    <div style={{ color: '#111', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>{result.course}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Certificate Reference ID</label>
                    <div style={{ color: '#2563eb', fontFamily: 'var(--mono, monospace)', fontSize: '18px', fontWeight: 600 }}>{result.certificateId}</div>
                  </div>
                </div>
              </div>


            </div>
          )}
        </div>
        
        {/* Simple Footer */}
        <footer style={{ padding: '40px', borderTop: '1px solid #222', textAlign: 'center', color: '#666', fontSize: '13px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', marginRight: '20px' }}>&larr; Back to Home</Link>
          &copy; 2026 CS Vertex. All Rights Reserved.
        </footer>
      </div>
    </>
  )
}
