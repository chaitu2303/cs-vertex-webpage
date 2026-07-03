"use client"

import React, { useState, useEffect } from 'react'
import { Settings, Globe, Bell, Shield, Database, Mail, Upload, Loader2, CheckCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const [msmePdf, setMsmePdf] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle'|'uploading'|'success'|'error'>('idle')
  
  useEffect(() => {
    fetch('/api/admin/settings?key=msme_certificate_pdf')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) setMsmePdf(data.value)
      })
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadStatus('uploading')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        const fileUrl = data.url
        setMsmePdf(fileUrl)
        
        // Save to settings DB
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'msme_certificate_pdf', value: fileUrl })
        })
        
        setUploadStatus('success')
        setTimeout(() => setUploadStatus('idle'), 3000)
      } else {
        setUploadStatus('error')
      }
    } catch (err) {
      console.error(err)
      setUploadStatus('error')
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#ededed]">Settings</h1>
        <p className="mt-2 text-[14px] text-[#888]">Manage your site configuration and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Site Info */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe size={18} className="text-[#FF5A2A]" />
            <h2 className="text-[15px] font-semibold text-[#ededed]">Site Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Site Name', value: 'CS Vertex', readOnly: true },
              { label: 'Domain', value: 'csvertex.com', readOnly: true },
              { label: 'Contact Email', value: 'hello@csvertex.com', readOnly: true },
              { label: 'Phone', value: '+91 72889 77131', readOnly: true },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', fontFamily: 'var(--font-dm-mono, monospace)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</label>
                <input defaultValue={f.value} readOnly={f.readOnly} style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ededed', outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        {/* MSME Settings */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={18} className="text-[#FF5A2A]" />
            <h2 className="text-[15px] font-semibold text-[#ededed]">MSME & Legal Settings</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', fontFamily: 'var(--font-dm-mono, monospace)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>MSME Certificate PDF</label>
              
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={msmePdf} 
                  onChange={e => setMsmePdf(e.target.value)} 
                  placeholder="/assets/msme.pdf"
                  style={{ flex: 1, background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ededed', outline: 'none' }} 
                />
                
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                  />
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: '#222', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: '1px solid #333' }}>
                    {uploadStatus === 'uploading' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload New PDF'}
                  </button>
                </div>
              </div>
              
              {uploadStatus === 'success' && (
                <div className="mt-2 text-[12px] text-green-500 flex items-center gap-1">
                   <CheckCircle size={12} /> Successfully uploaded and saved
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="mt-2 text-[12px] text-red-500">Failed to upload PDF.</div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={18} className="text-[#FF5A2A]" />
            <h2 className="text-[15px] font-semibold text-[#ededed]">Notification Preferences</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'New Lead Notification', desc: 'Get notified when a new contact form is submitted' },
              { label: 'Quote Requests', desc: 'Get notified for new quote requests' },
              { label: 'Portal Sign-ups', desc: 'Get notified when a client registers' },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between p-4 rounded-lg bg-[#111] border border-[#1e1e1e]">
                <div>
                  <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 600 }}>{n.label}</p>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{n.desc}</p>
                </div>
                <div style={{ width: '40px', height: '22px', background: '#FF5A2A', borderRadius: '11px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: '3px', top: '3px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={18} className="text-[#FF5A2A]" />
            <h2 className="text-[15px] font-semibold text-[#ededed]">Security</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-lg bg-[#111] border border-[#1e1e1e] flex items-center justify-between">
              <div>
                <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 600 }}>Admin Password</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Last changed: Never</p>
              </div>
              <button style={{ padding: '8px 16px', background: 'rgba(255,90,42,0.1)', border: '1px solid rgba(255,90,42,0.25)', color: '#FF5A2A', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Change</button>
            </div>
            <div className="p-4 rounded-lg bg-[#111] border border-[#1e1e1e] flex items-center justify-between">
              <div>
                <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 600 }}>Rate Limiting</p>
                <p style={{ fontSize: '12px', color: '#0f0' }}>Active - 100 req/min per IP</p>
              </div>
              <span style={{ fontSize: '11px', color: '#0f0', background: 'rgba(0,255,0,0.08)', border: '1px solid rgba(0,255,0,0.2)', borderRadius: '6px', padding: '4px 10px' }}>ENABLED</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database size={18} className="text-[#FF5A2A]" />
            <h2 className="text-[15px] font-semibold text-[#ededed]">Database</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Database Type', value: 'SQLite (Prisma)' },
              { label: 'Status', value: '?? Connected' },
              { label: 'Sync Method', value: 'JSON File Sync' },
              { label: 'Last Sync', value: 'Real-time on mutation' },
            ].map(f => (
              <div key={f.label} className="p-4 rounded-lg bg-[#111] border border-[#1e1e1e]">
                <p style={{ fontSize: '11px', color: '#666', fontFamily: 'var(--font-dm-mono, monospace)', letterSpacing: '0.08em', marginBottom: '4px' }}>{f.label}</p>
                <p style={{ fontSize: '13px', color: '#ededed' }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



