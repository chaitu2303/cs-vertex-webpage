"use client"


import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Check, Save } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Workshop {
  id: string
  title: string
  description: string | null
  date: string | null
  time: string | null
  speaker: string | null
  mode: string | null
  seats: number | null
  banner: string | null
  status: string
  published: boolean
}

export default function WebinarsAdminPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Workshop>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchWorkshops = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/workshops')
      const data = await res.json()
      setWorkshops(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const handleEdit = (p: Workshop) => {
    setFormData({
      ...p,
      date: p.date ? new Date(p.date).toISOString().split('T')[0] : ''
    })
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ status: 'Upcoming', published: true, seats: 100 })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return
    try {
      await fetch(`/api/admin/workshops/${id}`, { method: 'DELETE' })
      setWorkshops(workshops.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/workshops/${editingId}` : '/api/admin/workshops'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const saved = await res.json()
      
      if (editingId) {
        setWorkshops(workshops.map(p => p.id === editingId ? saved : p))
      } else {
        setWorkshops([...workshops, saved])
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
        <h2>Webinars & Workshops</h2>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Plus size={16} /> Add Workshop
        </button>
      </div>

      {loading ? (
        <p>Loading workshops...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {workshops.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {p.banner ? (
                  <img src={p.banner} alt={p.title} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#333' }} />
                )}
                <div>
                  <h4 style={{ margin: 0 }}>{p.title || 'Untitled'} {p.published ? '' : '(Draft)'}</h4>
                  <div style={{ fontSize: '13px', color: '#888', marginTop: '4px', display: 'flex', gap: '10px' }}>
                    <span>{p.date ? new Date(p.date).toLocaleDateString() : 'TBD'}</span>
                    <span>&bull;</span>
                    <span style={{ color: p.status === 'Upcoming' ? '#3498db' : '#95a5a6' }}>{p.status}</span>
                  </div>
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Workshop' : 'New Workshop'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Workshop Banner (16:9 Ratio)</label>
                <ImageUploader 
                   
                  currentImage={formData.banner} 
                  onUploadSuccess={(url) => setFormData({...formData, banner: url})} 
                />
              </div>

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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Date</label>
                  <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', colorScheme: 'dark' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Time</label>
                  <input type="text" value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Speaker</label>
                  <input type="text" value={formData.speaker || ''} onChange={e => setFormData({...formData, speaker: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Mode (Remote / Offline)</label>
                  <input type="text" value={formData.mode || ''} onChange={e => setFormData({...formData, mode: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? true} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Status:
                  <select value={formData.status || 'Upcoming'} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '5px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
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
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



