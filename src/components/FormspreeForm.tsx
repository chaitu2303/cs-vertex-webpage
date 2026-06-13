"use client"

import { useState } from 'react'

export function FormspreeForm({ formType, actionUrl }: { formType: string, actionUrl: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
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
    return (
      <div className="form-success" style={{ padding: '40px', background: 'rgba(255, 92, 42, 0.1)', border: '1px solid var(--acid)', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--acid)', fontSize: '24px', marginBottom: '10px' }}>Request Received</h3>
        <p style={{ color: '#888' }}>Thank you for reaching out. Our enterprise team will review your details and contact you shortly.</p>
        <button onClick={() => setStatus('idle')} style={{ marginTop: '20px', padding: '10px 20px', background: 'transparent', border: '1px solid #555', color: '#fff', cursor: 'pointer' }}>Send Another</button>
      </div>
    )
  }

  return (
    <form className="cs-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <input type="text" name="name" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="Business Email" required />
      </div>
      
      <div className="form-grid">
        <input type="tel" name="phone" placeholder="Mobile Number" required />
        <input type="text" name="company" placeholder="Company Name" />
      </div>

      {formType === 'Quote' && (
        <div className="form-grid">
          <select name="service" required>
            <option value="">Select Service Required...</option>
            <option value="Software Development">Software Development</option>
            <option value="AI Solutions">AI Solutions</option>
            <option value="IoT Ecosystems">IoT Ecosystems</option>
            <option value="Robotics">Robotics</option>
            <option value="Embedded Systems">Embedded Systems</option>
            <option value="Other">Other</option>
          </select>
          <select name="budget" required>
            <option value="">Select Budget Range...</option>
            <option value="Under $10k">Under $10k</option>
            <option value="$10k - $50k">$10k - $50k</option>
            <option value="$50k - $100k">$50k - $100k</option>
            <option value="$100k+">$100k+</option>
          </select>
        </div>
      )}

      {formType === 'Quote' ? (
        <textarea name="description" placeholder="Project Description & Requirements" rows={5} required></textarea>
      ) : (
        <textarea name="message" placeholder="How can we help?" rows={5} required></textarea>
      )}

      {status === 'error' && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '10px' }}>Oops! There was a problem submitting your form.</p>}

      <button type="submit" className="primary-action submit-btn" disabled={status === 'loading'} style={{ marginTop: '20px', width: '100%', padding: '15px', background: 'var(--acid)', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
        {status === 'loading' ? 'Sending...' : `Submit ${formType} Request`}
      </button>
    </form>
  )
}
