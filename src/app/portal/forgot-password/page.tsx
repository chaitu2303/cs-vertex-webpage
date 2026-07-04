"use client"

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/auth/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (!res.ok) {
      setStatus('error')
      toast.error('Failed to send reset link. Please try again.')
    } else {
      setStatus('success')
      toast.success('Password reset link has been sent to your email.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0a', padding: '20px' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Reset Password</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Enter your email to receive a reset link.</p>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            style={{ width: '100%', padding: '14px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '10px' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '13px' }}>
          <Link href="/" style={{ color: 'var(--acid)', textDecoration: 'none' }}>Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
