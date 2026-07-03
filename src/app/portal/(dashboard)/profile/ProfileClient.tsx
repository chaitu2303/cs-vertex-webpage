"use client"

import React, { useState } from 'react'
import { updateProfile } from '../../actions'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function ProfileClient({ customer, userEmail }: { customer: any, userEmail: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    const res = await updateProfile(formData)
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(true)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/portal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#111', color: '#888', textDecoration: 'none', transition: 'all 0.2s' }} className="back-btn">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Edit Profile</h1>
          <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>Update your account details and contact information.</p>
        </div>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '16px', padding: '32px' }}>
        {success && <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>Profile updated successfully.</div>}
        {error && <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
            <input type="email" defaultValue={userEmail} disabled style={{ width: '100%', padding: '14px', background: '#050505', border: '1px solid #222', borderRadius: '10px', color: '#666', fontSize: '14px', outline: 'none', cursor: 'not-allowed' }} />
            <div style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>Email address cannot be changed currently.</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
            <input type="text" name="name" defaultValue={customer?.name || ''} required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Company Name</label>
            <input type="text" name="company" defaultValue={customer?.company || ''} style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
            <input type="tel" name="phone" defaultValue={customer?.phone || ''} style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={submitting} style={{ background: '#fff', color: '#000', padding: '14px 32px', borderRadius: '10px', border: 'none', fontWeight: 600, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .back-btn:hover { background: #222 !important; color: #fff !important; transform: translateX(-2px); }
      `}</style>
    </div>
  )
}
