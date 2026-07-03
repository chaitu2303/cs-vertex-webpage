"use client"

import React, { useState } from 'react'
import { requestProject } from '../../actions'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function RequestProjectClient({ customer, userEmail }: { customer: any, userEmail: string }) {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    await requestProject(formData)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/portal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: '#111', color: '#888', textDecoration: 'none', transition: 'all 0.2s' }} className="back-btn">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Request a Project</h1>
          <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>Fill out the details below and our team will get started on your request.</p>
        </div>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '16px', padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="form-grid" style={{ gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Project Type</label>
              <select name="projectType" required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                <option value="New Development">New Development</option>
                <option value="Redesign / Upgrade">Redesign / Upgrade</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Service Category</label>
              <select name="service" required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}>
                <option value="Web App / Platform">Web App / Platform</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="IoT / Embedded / Robotics">IoT / Embedded / Robotics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-grid" style={{ gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Estimated Budget</label>
              <input type="text" name="budget" placeholder="e.g. $5,000 - $10,000" required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Expected Timeline</label>
              <input type="text" name="timeline" placeholder="e.g. 1-2 Months" required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Project Description</label>
            <textarea name="description" rows={5} placeholder="Describe your project goals, features, and requirements..." required style={{ width: '100%', padding: '14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>File Upload (Optional)</label>
            <div style={{ padding: '24px', border: '1px dashed #333', borderRadius: '10px', background: '#0a0a0a', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>Drag and drop files here, or click to browse</p>
              <input type="file" style={{ marginTop: '12px', fontSize: '12px' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={submitting} style={{ background: '#FF5A2A', color: '#fff', padding: '14px 32px', borderRadius: '10px', border: 'none', fontWeight: 600, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Request</>}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        .back-btn:hover { background: #222 !important; color: #fff !important; transform: translateX(-2px); }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
