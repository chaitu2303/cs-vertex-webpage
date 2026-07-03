"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save, Copy } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Poster {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image: string
  thumbnail: string | null
  buttonText: string | null
  buttonUrl: string | null
  category: string
  priority: number
  displayOrder: number
  featured: boolean
  published: boolean
  openInModal: boolean
  showOnHome: boolean
  showInOffers: boolean
  scheduleDate: string | null
  expiryDate: string | null
  status: string
  views: number
  clicks: number
}

export default function PostersAdminPage() {
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Poster>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchPosters = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posters')
      const data = await res.json()
      setPosters(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosters()
  }, [])

  const handleEdit = (p: Poster) => {
    setFormData(p)
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ 
      published: false, 
      displayOrder: 0, 
      priority: 0,
      showOnHome: true,
      category: 'Offers',
      status: 'Draft'
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return
    try {
      await fetch(`/api/admin/posters/${id}`, { method: 'DELETE' })
      setPosters(posters.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDuplicate = async (p: Poster) => {
    try {
      const copyData = { ...p, id: undefined, title: p.title + ' (Copy)' }
      const res = await fetch('/api/admin/posters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copyData)
      })
      const saved = await res.json()
      setPosters([saved, ...posters])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/posters/${editingId}` : '/api/admin/posters'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const saved = await res.json()
      
      if (editingId) {
        setPosters(posters.map(p => p.id === editingId ? saved : p))
      } else {
        setPosters([saved, ...posters])
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
        <h2>Posters & Announcements</h2>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Plus size={16} /> Add Poster
        </button>
      </div>

      {loading ? (
        <p>Loading posters...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#111', borderBottom: '1px solid #222' }}>
              <th style={{ padding: '12px' }}>Preview</th>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Order</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posters.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px' }}>
                  {p.image ? (
                    <img src={p.image} alt={p.title} style={{ width: '80px', height: '45px', objectFit: 'contain', background: '#000', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '80px', height: '45px', background: '#333', borderRadius: '4px' }} />
                  )}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.title}</td>
                <td style={{ padding: '12px' }}>{p.category}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', background: p.published ? '#1a472a' : '#333', color: p.published ? '#4ade80' : '#aaa', borderRadius: '12px', fontSize: '12px' }}>
                    {p.published ? 'Published' : p.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{p.displayOrder}</td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(p)} style={{ padding: '6px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' }}><Edit size={14} /></button>
                  <button onClick={() => handleDuplicate(p)} style={{ padding: '6px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' }}><Copy size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '6px', background: '#4a0000', color: '#ff6b6b', border: '1px solid #660000', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', width: '100%', maxWidth: '800px', borderRadius: '12px', border: '1px solid #222', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Poster' : 'New Poster'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Poster Image *</label>
                <ImageUploader 
                  currentImage={formData.image} 
                  onUploadSuccess={(url) => setFormData({...formData, image: url})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Title *</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Category *</label>
                  <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}>
                    <option value="Offers">Offers</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Events">Events</option>
                    <option value="Hiring">Hiring</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Subtitle / Offer Tag</label>
                  <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Description</label>
                <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Button Text</label>
                  <input type="text" value={formData.buttonText || ''} onChange={e => setFormData({...formData, buttonText: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Button URL</label>
                  <input type="text" value={formData.buttonUrl || ''} onChange={e => setFormData({...formData, buttonUrl: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Priority (Higher = first)</label>
                  <input type="number" value={formData.priority || 0} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Display Order</label>
                  <input type="number" value={formData.displayOrder || 0} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px', padding: '15px', background: '#0a0a0a', borderRadius: '6px', border: '1px solid #222' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? false} onChange={e => setFormData({...formData, published: e.target.checked, status: e.target.checked ? 'Published' : 'Draft'})} />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.showOnHome ?? true} onChange={e => setFormData({...formData, showOnHome: e.target.checked})} />
                  Show on Homepage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.featured ?? false} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                  Featured
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving || !formData.image} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Poster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
