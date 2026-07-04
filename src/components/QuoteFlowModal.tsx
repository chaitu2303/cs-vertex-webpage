"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MultiStepQuoteForm } from './MultiStepQuoteForm'
import { X } from 'lucide-react'

export function QuoteFlowModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Lazy client-side initialization — avoids SSR env var issues
  const supabaseRef = React.useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    return supabaseRef.current
  }
  
  useEffect(() => {
    const supabase = getSupabase()

    const checkHash = () => {
      if (window.location.hash === '#quote-modal') {
        setIsOpen(true)
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
    
    checkHash()
    window.addEventListener('hashchange', checkHash)

    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-quote-modal', handleOpen)
    
    supabase.auth.getSession().then(({ data }) => setIsAuthenticated(!!data.session))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })
    
    return () => {
      window.removeEventListener('hashchange', checkHash)
      window.removeEventListener('open-quote-modal', handleOpen)
      subscription.unsubscribe()
    }
  }, [])
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = getSupabase()
    let res
    if (authMode === 'signin') {
      res = await supabase.auth.signInWithPassword({ email, password })
    } else {
      res = await supabase.auth.signUp({ email, password })
    }
    
    if (res.error) {
      setError(res.error.message)
    } else if (authMode === 'signup' && !res.data?.session) {
       setError("Check your email for the confirmation link.")
    }
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '?modal=quote' }
    })
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
       <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#0B0B0B', borderRadius: '16px', border: '1px solid #333', width: '100%', maxWidth: isAuthenticated ? '700px' : '400px', padding: isAuthenticated ? '0' : '40px', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          
          <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
             <X size={16} strokeWidth={1.5} />
          </button>
          
          {isAuthenticated === null ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading secure portal...</div>
          ) : isAuthenticated ? (
             <div style={{ padding: '0', maxHeight: '90vh', overflowY: 'auto' }}>
               <MultiStepQuoteForm />
             </div>
          ) : (
            <div className="auth-form fade-in">
              <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>{authMode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
              <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Please authenticate to access the enterprise quote system.</p>
              
              <button onClick={handleGoogleAuth} style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', borderRadius: '6px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#555', fontSize: '12px', textTransform: 'uppercase' }}>
                <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
                <span style={{ padding: '0 10px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#333' }}></div>
              </div>

              {error && <div style={{ padding: '10px', background: 'rgba(255,0,0,0.1)', color: '#ff4444', marginBottom: '20px', borderRadius: '6px', fontSize: '13px' }}>{error}</div>}

              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', background: '#111111', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', background: '#111111', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px' }} />
                <button type="submit" disabled={loading} style={{ padding: '12px', background: 'var(--acid)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Processing...' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <p style={{ marginTop: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} style={{ background: 'none', border: 'none', color: 'var(--acid)', cursor: 'pointer', padding: 0, fontSize: '13px', textDecoration: 'underline' }}>
                  {authMode === 'signin' ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          )}
       </div>
    </div>
  )
}
