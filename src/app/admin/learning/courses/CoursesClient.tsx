"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addCourseAction, deleteCourseAction, updateCourseAction } from '../actions'

export default function CoursesClient({ initialCourses }: { initialCourses: any[] }) {
  const [courses, setCourses] = useState(initialCourses)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultForm = { title: '', description: '', duration: '', level: '', syllabus: '', price: '', trainer: '', banner: '', published: true }
  const [formData, setFormData] = useState(defaultForm)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, typeof value === 'boolean' ? (value ? 'true' : 'false') : value as string)
    })
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateCourseAction(fd)
      if (res.success) setCourses(courses.map(c => c.id === editingId ? { ...c, ...formData } : c))
    } else {
      const res = await addCourseAction(fd)
      if (res.success) setCourses([res.data, ...courses])
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultForm)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteCourseAction(fd)
    if (res.success) setCourses(courses.filter(c => c.id !== id))
  }

  const handleEdit = (course: any) => {
    setFormData({ 
      title: course.title, 
      description: course.description,
      duration: course.duration, 
      level: course.level,
      syllabus: course.syllabus,
      price: course.price,
      trainer: course.trainer,
      banner: course.banner || '',
      published: course.published 
    })
    setEditingId(course.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Manage Courses</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData(defaultForm) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '30px' }}
          >
            <div className="premium-glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Course Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Price</label>
                  <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Duration</label>
                  <input type="text" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Level</label>
                  <input type="text" required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Trainer</label>
                  <input type="text" required value={formData.trainer} onChange={e => setFormData({...formData, trainer: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Banner Image URL</label>
                  <input type="text" value={formData.banner} onChange={e => setFormData({...formData, banner: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Syllabus</label>
                  <textarea required rows={4} value={formData.syllabus} onChange={e => setFormData({...formData, syllabus: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: '16px', height: '16px' }} />
                    Published
                  </label>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Course'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="premium-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Title</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Level</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Duration</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No courses found.</td>
              </tr>
            ) : (
              courses.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{c.title}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{c.level}</td>
                  <td style={{ padding: '16px 24px', color: '#aaa' }}>{c.duration}</td>
                  <td style={{ padding: '16px 24px', color: c.published ? 'var(--acid)' : '#ff4444' }}>{c.published ? 'Published' : 'Draft'}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(c)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .premium-glass-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; }
        .premium-label { display: block; font-size: 12px; color: #aaa; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .premium-input { width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: #fff; transition: all 0.2s; }
        .premium-input:focus { outline: none; border-color: var(--acid); background: rgba(0, 0, 0, 0.6); }
        .icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.text-blue:hover { background: rgba(62, 142, 255, 0.15); color: #3e8eff; border-color: rgba(62, 142, 255, 0.3); }
        .icon-btn.text-red:hover { background: rgba(255, 68, 68, 0.15); color: #ff4444; border-color: rgba(255, 68, 68, 0.3); }
      `}</style>
    </div>
  )
}
