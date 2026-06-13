"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (res.ok) {
        // Fallback to hard redirect if client router hangs
        window.location.href = '/admin'
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
        setLoading(false)
      }
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0a', padding: '20px' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <img src="/assets/logo.png" alt="CS Vertex" style={{ height: '40px', marginBottom: '30px' }} />
        
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Admin Portal</h1>
        <p style={{ color: '#F5F1EA', fontSize: '14px', marginBottom: '30px' }}>Enter your credentials to access the CMS.</p>
        
        {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <p style={{ color: '#F5F1EA', fontSize: '11px', marginTop: '30px' }}>&copy; {new Date().getFullYear()} CS Vertex Internal Systems. All rights reserved.</p>
      </div>
    </div>
  )
}
