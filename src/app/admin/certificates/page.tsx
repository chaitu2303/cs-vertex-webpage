"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Certificate {
  id: string
  certificateId: string
  studentName: string
  email: string
  course: string
  type: string
  issueDate: string
  status: string
  fileUrl: string
  qrCodeUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Certificate>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/certificates')
      const data = await res.json()
      setCertificates(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const handleEdit = (p: Certificate) => {
    setFormData({
      ...p,
      issueDate: new Date(p.issueDate).toISOString().split('T')[0] // format as YYYY-MM-DD
    })
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ 
      status: 'Valid', 
      type: 'Course',
      issueDate: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    try {
      await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
      setCertificates(certificates.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/certificates/${editingId}` : '/api/admin/certificates'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchCertificates()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Certificates Management</h2>
        <button 
          onClick={handleCreateNew}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> New Certificate
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#111', borderRadius: '12px', border: '1px dashed #333', color: '#888' }}>
          No certificates found. Create one to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {certificates.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {p.fileUrl ? (
                  <img src={p.fileUrl} alt={p.studentName} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#333' }} />
                )}
                <div>
                  <h4 style={{ margin: 0 }}>{p.studentName} - {p.course}</h4>
                  <span style={{ fontSize: '13px', color: '#888' }}>ID: {p.certificateId} &bull; Type: {p.type} &bull; Status: {p.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(p)} style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' }}><Edit size={16} /></button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: '8px', background: '#4a0000', color: '#ff6b6b', border: '1px solid #660000', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', width: '100%', maxWidth: '700px', borderRadius: '12px', border: '1px solid #222', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Certificate' : 'New Certificate'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Certificate File/Image</label>
                  <ImageUploader 
                     
                    currentImage={formData.fileUrl} 
                    onUploadSuccess={(url) => setFormData({...formData, fileUrl: url})} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>QR Code Image (Optional)</label>
                  <ImageUploader 
                     
                    currentImage={formData.qrCodeUrl} 
                    onUploadSuccess={(url) => setFormData({...formData, qrCodeUrl: url})} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Certificate ID</label>
                  <input required type="text" value={formData.certificateId || ''} onChange={e => setFormData({...formData, certificateId: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Issue Date</label>
                  <input required type="date" value={formData.issueDate || ''} onChange={e => setFormData({...formData, issueDate: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Student Name</label>
                  <input required type="text" value={formData.studentName || ''} onChange={e => setFormData({...formData, studentName: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Email</label>
                  <input required type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Course / Program Name</label>
                  <input required type="text" value={formData.course || ''} onChange={e => setFormData({...formData, course: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Type</label>
                  <select required value={formData.type || 'Course'} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}>
                    <option value="Course">Course</option>
                    <option value="Internship">Internship</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Status</label>
                  <select required value={formData.status || 'Valid'} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}>
                    <option value="Valid">Valid</option>
                    <option value="Revoked">Revoked</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
