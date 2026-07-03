"use client"


import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Check, Save } from 'lucide-react'

interface Internship {
  id: string
  title: string | null
  description: string | null
  duration: string
  mode: string | null
  location: string | null
  requirements: string | null
  benefits: string
  lastDate: string | null
  seats: number | null
  status: string
  published: boolean
}

export default function InternshipsAdminPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Internship>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/internships')
      const data = await res.json()
      setInternships(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  const handleEdit = (p: Internship) => {
    setFormData({
      ...p,
      lastDate: p.lastDate ? new Date(p.lastDate).toISOString().split('T')[0] : ''
    })
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ status: 'Open', published: true, benefits: '', duration: '' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) return
    try {
      await fetch(`/api/admin/internships/${id}`, { method: 'DELETE' })
      setInternships(internships.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/internships/${editingId}` : '/api/admin/internships'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const saved = await res.json()
      
      if (editingId) {
        setInternships(internships.map(p => p.id === editingId ? saved : p))
      } else {
        setInternships([saved, ...internships])
      }
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page-container" style={{ padding: '20px', color: '#fff', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Internships Management</h2>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Plus size={16} /> Add Internship
        </button>
      </div>

      {loading ? (
        <p>Loading internships...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {internships.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div>
                <h4 style={{ margin: 0 }}>{p.title || 'Untitled Internship'} {p.published ? '' : '(Draft)'}</h4>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px', display: 'flex', gap: '10px' }}>
                  <span>{p.duration}</span>
                  <span>&bull;</span>
                  <span style={{ color: p.status === 'Open' ? '#2ecc71' : '#e74c3c' }}>{p.status}</span>
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Internship' : 'New Internship'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Title</label>
                <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Description</label>
                <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Duration (e.g., 3 Months)</label>
                  <input required type="text" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Mode (e.g., Remote, On-site)</label>
                  <input type="text" value={formData.mode || ''} onChange={e => setFormData({...formData, mode: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Location</label>
                  <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Last Date to Apply</label>
                  <input type="date" value={formData.lastDate || ''} onChange={e => setFormData({...formData, lastDate: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', colorScheme: 'dark' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Requirements</label>
                <textarea rows={2} value={formData.requirements || ''} onChange={e => setFormData({...formData, requirements: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Benefits</label>
                <textarea required rows={2} value={formData.benefits || ''} onChange={e => setFormData({...formData, benefits: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? true} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Status:
                  <select value={formData.status || 'Open'} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '5px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Seats:
                  <input type="number" value={formData.seats || ''} onChange={e => setFormData({...formData, seats: parseInt(e.target.value) || null})} style={{ width: '60px', padding: '5px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



