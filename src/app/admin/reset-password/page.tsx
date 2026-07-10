"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.')
    }
  }, [token])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      const data = await res.json()
      
      if (res.ok) {
        setMessage('Password has been reset successfully. Redirecting to login...')
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        setError(data.error || 'Failed to reset password.')
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
        
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Create New Password</h1>
        <p style={{ color: '#F5F1EA', fontSize: '14px', marginBottom: '30px' }}>Please enter your new password below.</p>
        
        {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(0,255,0,0.1)', color: '#44ff44', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{message}</div>}

        {!token ? (
           <div style={{ marginTop: '20px' }}>
             <Link href="/admin/login" style={{ color: 'var(--acid)', fontSize: '13px', textDecoration: 'none' }}>
               Back to Login
             </Link>
           </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 48px 14px 14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#888', cursor: 'pointer',
                  fontSize: '11px', fontFamily: 'var(--mono)', userSelect: 'none', padding: '4px'
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 48px 14px 14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '10px' }}
            >
              {loading ? 'Resetting...' : 'Save Password'}
            </button>
          </form>
        )}

        <p style={{ color: '#F5F1EA', fontSize: '11px', marginTop: '30px' }}>&copy; {new Date().getFullYear()} CS Vertex Internal Systems. All rights reserved.</p>
      </div>
    </div>
  )
}

export default function AdminResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
