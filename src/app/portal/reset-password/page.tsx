"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle implicit flow hash manually since SSR client may ignore it
    const hash = window.location.hash
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) {
            window.history.replaceState(null, '', window.location.pathname)
            setStatus('idle')
          }
        })
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStatus('idle')
      } else if (session) {
        setStatus('idle')
      } else {
        const timer = setTimeout(() => {
          supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
              toast.error('Invalid or expired reset link. Please try again.')
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

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setStatus('error')
      toast.error(error.message)
    } else {
      setStatus('success')
      toast.success('Password changed successfully.')
      
      // Trigger confirmation email
      try {
        await fetch('/api/auth/password-changed', { method: 'POST' })
      } catch (err) {
        console.error('Failed to send confirmation email', err)
      }

      setTimeout(() => router.push('/portal/login'), 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a0a', padding: '20px' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px', fontWeight: 500 }}>Set New Password</h1>

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
