"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, X, Check, Save, Copy, Archive, Search, GripVertical } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Project {
  id: string
  title: string
  slug: string | null
  category: string | null
  shortSummary: string | null
  challenge: string
  solution: string
  features: string | null
  technologies: string
  impact: string
  objectives: string | null
  outcomes: string | null
  useCase: string | null
  image: string | null
  galleryImages: string | null
  timeline: string | null
  github: string | null
  liveDemo: string | null
  documentation: string | null
  isFeatured: boolean
  published: boolean
  status: string
  order: number
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      setProjects(data.sort((a: Project, b: Project) => a.order - b.order))
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
    setFormData({ published: true, order: projects.length, status: 'Active', isFeatured: false })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDuplicate = async (p: Project) => {
    if (!confirm(`Duplicate project "${p.title}"?`)) return
    try {
      const newProj = { ...p, id: undefined, title: `${p.title} (Copy)`, slug: `${p.slug}-copy` }
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      })
      const saved = await res.json()
      setProjects([...projects, saved].sort((a, b) => a.order - b.order))
    } catch (e) {
      console.error(e)
    }
  }

  const handleArchive = async (p: Project) => {
    if (!confirm(`Archive project "${p.title}"?`)) return
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, status: 'Archived', published: false })
      })
      const saved = await res.json()
      setProjects(projects.map(pr => pr.id === p.id ? saved : pr))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return
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
        setProjects(projects.map(p => p.id === editingId ? saved : p).sort((a, b) => a.order - b.order))
      } else {
        setProjects([...projects, saved].sort((a, b) => a.order - b.order))
      }
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index
    e.currentTarget.classList.add('dragging')
  }

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = async (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging')
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newProjects = [...projects]
      const draggedProject = newProjects[dragItem.current]
      
      newProjects.splice(dragItem.current, 1)
      newProjects.splice(dragOverItem.current, 0, draggedProject)
      
      // Update orders
      const updatedProjects = newProjects.map((p, i) => ({ ...p, order: i + 1 }))
      setProjects(updatedProjects)
      
      // Save order to DB sequentially
      for (const p of updatedProjects) {
        await fetch(`/api/admin/projects/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: p.order })
        })
      }
    }
    dragItem.current = null
    dragOverItem.current = null
  }

  const filteredProjects = projects.filter(p => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.technologies?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="admin-page-container" style={{ padding: '20px', color: '#fff', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Projects Management</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search by name, tech, category..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 10px 8px 35px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '6px', width: '250px' }}
            />
          </div>
          <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredProjects.map((p, index) => (
            <div 
              key={p.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px', cursor: 'grab' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <GripVertical size={20} color="#444" />
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#333' }} />
                )}
                <div>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {p.title} 
                    {p.status === 'Archived' && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#444', borderRadius: '10px' }}>Archived</span>}
                    {p.status === 'Draft' && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#886600', borderRadius: '10px' }}>Draft</span>}
                    {!p.published && <span style={{ fontSize: '10px', padding: '2px 6px', background: '#660000', borderRadius: '10px' }}>Hidden</span>}
                    {p.isFeatured && <span style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--acid)', color: '#000', borderRadius: '10px' }}>Featured</span>}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    {p.category} | {p.technologies}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(p)} title="Edit" style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' }}><Edit size={16} /></button>
                <button onClick={() => handleDuplicate(p)} title="Duplicate" style={{ padding: '8px', background: '#222', color: '#fff', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' }}><Copy size={16} /></button>
                <button onClick={() => handleArchive(p)} title="Archive" style={{ padding: '8px', background: '#332200', color: '#ffb700', border: '1px solid #554400', borderRadius: '6px', cursor: 'pointer' }}><Archive size={16} /></button>
                <button onClick={() => handleDelete(p.id)} title="Delete" style={{ padding: '8px', background: '#4a0000', color: '#ff6b6b', border: '1px solid #660000', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', width: '100%', maxWidth: '800px', borderRadius: '12px', border: '1px solid #222', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#111', zIndex: 10 }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Project Name</label>
                  <input required type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Slug</label>
                  <input type="text" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Categories (Comma separated, e.g. Web, Mobile, AI)</label>
                  <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Technologies (Comma separated)</label>
                  <input type="text" value={formData.technologies || ''} onChange={e => setFormData({...formData, technologies: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Short Description</label>
                <textarea rows={2} value={formData.shortSummary || ''} onChange={e => setFormData({...formData, shortSummary: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Problem Statement</label>
                <textarea rows={3} value={formData.challenge || ''} onChange={e => setFormData({...formData, challenge: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Solution / Full Description</label>
                <textarea rows={4} value={formData.solution || ''} onChange={e => setFormData({...formData, solution: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Features (Comma separated or bullet points)</label>
                <textarea rows={3} value={formData.features || ''} onChange={e => setFormData({...formData, features: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>GitHub Link</label>
                  <input type="url" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Live Demo Link</label>
                  <input type="url" value={formData.liveDemo || ''} onChange={e => setFormData({...formData, liveDemo: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Project Image Upload</label>
                <ImageUploader 
                  currentImage={formData.image} 
                  onUploadSuccess={(url) => setFormData({...formData, image: url})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? true} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Visibility (Published)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isFeatured ?? false} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
                  Featured Project
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Status: 
                  <select value={formData.status ?? 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '5px', borderRadius: '4px' }}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  Display Order: <input type="number" value={formData.order ?? 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} style={{ width: '60px', padding: '5px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', position: 'sticky', bottom: '-20px', background: '#111', padding: '20px 0', borderTop: '1px solid #222' }}>
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
