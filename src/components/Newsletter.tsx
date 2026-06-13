"use client"

import { useState } from 'react'

export function Newsletter({ actionUrl }: { actionUrl: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)

    if (actionUrl.includes('placeholder-newsletter')) {
      // Mock success for testing purposes when using placeholder URL
      await new Promise(resolve => setTimeout(resolve, 800))
      setStatus('success')
      form.reset()
      return
    }

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p style={{ color: 'var(--acid)', fontSize: '13px', margin: '20px 0 0' }}>✓ Subscribed successfully. Welcome to the CS Vertex loop.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Enter your email address" 
          required 
          style={{ flex: 1, padding: '12px 15px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px', fontSize: '14px' }}
        />
        <button 
          type="submit" 
          disabled={status === 'loading'}
          style={{ padding: '0 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p style={{ color: '#ff4444', fontSize: '12px', margin: '5px 0 0', fontFamily: 'var(--sans)' }}>
          Submission failed. Please check your network or configure a valid Formspree endpoint.
        </p>
      )}
    </div>
  )
}
