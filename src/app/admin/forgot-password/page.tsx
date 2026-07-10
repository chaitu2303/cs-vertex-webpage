"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.message || 'Password reset link sent successfully.')
      } else {
        setError(data.error || 'Failed to send reset link.')
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0a', padding: '20px' }}>
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Image src="/assets/logo.png" alt="CS Vertex" width={200} height={40} style={{ height: '40px', width: 'auto', marginBottom: '30px' }} />
        
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Reset Password</h1>
        <p style={{ color: '#F5F1EA', fontSize: '14px', marginBottom: '30px' }}>Enter your admin email to receive a reset link.</p>
        
        {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(0,255,0,0.1)', color: '#44ff44', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{message}</div>}

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '10px' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Link href="/admin/login" style={{ color: 'var(--acid)', fontSize: '13px', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>

        <p style={{ color: '#F5F1EA', fontSize: '11px', marginTop: '30px' }}>&copy; {new Date().getFullYear()} CS Vertex Internal Systems. All rights reserved.</p>
      </div>
    </div>
  )
}
