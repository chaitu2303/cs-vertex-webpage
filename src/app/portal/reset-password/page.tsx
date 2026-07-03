"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Listen for recovery state or session establishment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('idle')
        setMessage('')
      } else if (session) {
        setStatus('idle')
        setMessage('')
      } else {
        // Wait a brief moment to allow tokens to be processed and cookies set
        const timer = setTimeout(() => {
          supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
              setMessage('Invalid or expired reset link. Please try again.')
              setStatus('error')
            }
          })
        }, 1500)
        return () => clearTimeout(timer)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('success')
      setMessage('Password changed successfully.')
      setTimeout(() => router.push('/'), 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0a', padding: '20px' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Set New Password</h1>
        
        {message && (
          <div style={{ background: status === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: status === 'error' ? '#ff4444' : '#44ff44', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="New Password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              style={{ width: '100%', padding: '14px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: '10px' }}
            >
              {status === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
