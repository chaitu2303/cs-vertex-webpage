"use client"


import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Check, Save } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Project {
  id: string
  title: string
  category: string | null
  shortSummary: string | null
  challenge: string
  solution: string
  technologies: string
  impact: string
  objectives: string | null
  features: string | null
  outcomes: string | null
  useCase: string | null
  image: string | null
  published: boolean
  order: number
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEdit = (p: Project) => {
    setFormData(p)
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ published: true, order: 0 })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const saved = await res.json()
      
      if (editingId) {
        setProjects(projects.map(p => p.id === editingId ? saved : p))
      } else {
        setProjects([...projects, saved])
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
        <h2>Projects Management</h2>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#333' }} />
                )}
                <div>
                  <h4 style={{ margin: 0 }}>{p.title} {p.published ? '' : '(Draft)'}</h4>
                  <span style={{ fontSize: '13px', color: '#888' }}>{p.category}</span>
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Project Image (16:9 Ratio)</label>
                <ImageUploader 
                  aspectRatio={16/9} 
                  currentImage={formData.image} 
                  onUploadSuccess={(url) => setFormData({...formData, image: url})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Title</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Category</label>
                  <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}>
                    <option value="">Select Category</option>
                    <option value="SOFTWARE ENGINEERING">SOFTWARE ENGINEERING</option>
                    <option value="AI, IOT & EMBEDDED">AI, IOT & EMBEDDED</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Short Summary</label>
                <textarea rows={2} value={formData.shortSummary || ''} onChange={e => setFormData({...formData, shortSummary: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Challenge</label>
                  <textarea required rows={3} value={formData.challenge || ''} onChange={e => setFormData({...formData, challenge: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Solution</label>
                  <textarea required rows={3} value={formData.solution || ''} onChange={e => setFormData({...formData, solution: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Technologies (Comma sep)</label>
                  <input required type="text" value={formData.technologies || ''} onChange={e => setFormData({...formData, technologies: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Impact</label>
                  <input required type="text" value={formData.impact || ''} onChange={e => setFormData({...formData, impact: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? true} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Order: <input type="number" value={formData.order ?? 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} style={{ width: '60px', padding: '5px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



