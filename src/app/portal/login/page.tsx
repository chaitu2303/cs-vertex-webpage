"use client"

import { useState } from 'react'
import { login } from '../actions'
import Link from 'next/link'
import { X } from 'lucide-react'
import { toast } from 'react-hot-toast'

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal`,
      },
    })
    if (error) {
      setError(error.message)
      toast.error(error.message)
      setLoading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Logged in successfully.')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#000', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: '#111', borderRadius: '12px', border: '1px solid #333', position: 'relative' }}>
        <Link href="/" style={{ position: 'absolute', top: '15px', right: '15px', color: '#888' }}>
          <X size={20} />
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Welcome Back</h1>
        <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Log into your CS Vertex Client Portal</p>
        
        {error && <div style={{ padding: '12px', background: 'rgba(255,0,0,0.1)', color: '#ff4444', marginBottom: '20px', borderRadius: '6px', fontSize: '13px' }}>{error}</div>}

        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#ccc', marginBottom: '8px' }}>Email Address</label>
            <input name="email" type="email" required style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#ccc', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input name="password" type={showPassword ? "text" : "password"} required style={{ width: '100%', padding: '12px 48px 12px 12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--mono)',
                  userSelect: 'none',
                  padding: '4px'
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <Link href="/portal/forgot-password" style={{ fontSize: '12px', color: 'var(--acid)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ padding: '14px', background: 'var(--acid)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
          <span style={{ color: '#888', fontSize: '12px' }}>or continue with</span>
          <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p style={{ marginTop: '30px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
          Don't have an account? <a href="/portal/signup" style={{ color: 'var(--acid)', textDecoration: 'none' }}>Create a new account</a>
        </p>
      </div>
    </div>
  )
}
