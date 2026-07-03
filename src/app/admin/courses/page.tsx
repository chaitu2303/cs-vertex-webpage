"use client"


import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Check, Save } from 'lucide-react'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Course {
  id: string
  title: string
  description: string | null
  duration: string
  level: string | null
  syllabus: string | null
  price: string | null
  trainer: string | null
  banner: string | null
  published: boolean
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Course>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleEdit = (p: Course) => {
    setFormData(p)
    setEditingId(p.id)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setFormData({ published: true, duration: '', level: 'Beginner' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
      setCourses(courses.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const saved = await res.json()
      
      if (editingId) {
        setCourses(courses.map(p => p.id === editingId ? saved : p))
      } else {
        setCourses([saved, ...courses])
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
        <h2>Courses Management</h2>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <Plus size={16} /> Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {courses.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {p.banner ? (
                  <img src={p.banner} alt={p.title} style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#333' }} />
                )}
                <div>
                  <h4 style={{ margin: 0 }}>{p.title || 'Untitled Course'} {p.published ? '' : '(Draft)'}</h4>
                  <span style={{ fontSize: '13px', color: '#888' }}>{p.duration} &bull; {p.level}</span>
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
              <h3 style={{ margin: 0 }}>{editingId ? 'Edit Course' : 'New Course'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Course Banner (16:9 Ratio)</label>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Duration (e.g., 6 Weeks)</label>
                  <input required type="text" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Level (e.g., Beginner)</label>
                  <input type="text" value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Price</label>
                  <input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Trainer Name</label>
                  <input type="text" value={formData.trainer || ''} onChange={e => setFormData({...formData, trainer: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Syllabus (Link or Text)</label>
                <textarea rows={2} value={formData.syllabus || ''} onChange={e => setFormData({...formData, syllabus: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.published ?? true} onChange={e => setFormData({...formData, published: e.target.checked})} />
                  Published
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



