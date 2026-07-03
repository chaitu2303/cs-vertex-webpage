"use client"

import React, { useEffect } from 'react'

export default function PortalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Portal Error:', error)
  }, [error])

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '40px auto', background: '#111', borderRadius: '12px', border: '1px solid #330000', textAlign: 'center' }}>
      <h2 style={{ color: '#ff4444', fontSize: '20px', marginBottom: '15px' }}>Something went wrong!</h2>
      <p style={{ color: '#888', marginBottom: '25px', fontSize: '14px', lineHeight: 1.6 }}>
        We encountered an error loading your portal data. Please try again or contact support if the issue persists.
      </p>
      <button 
        onClick={() => reset()} 
        style={{ padding: '10px 24px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  )
}
