"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addProjectAction, deleteProjectAction, updateProjectAction } from './actions'

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({ 
    title: '', category: '', shortSummary: '', technologies: '', challenge: '', solution: '', impact: '' 
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value))
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateProjectAction(fd)
      if (res.success) {
        setProjects(projects.map(p => p.id === editingId ? { ...p, ...formData } : p))
      }
    } else {
      const res = await addProjectAction(fd)
      if (res.success) {
        setProjects([res.data, ...projects])
      }
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: '', category: '', shortSummary: '', technologies: '', challenge: '', solution: '', impact: '' })
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteProjectAction(fd)
    if (res.success) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const handleEdit = (proj: any) => {
    setFormData({ 
      title: proj.title, category: proj.category, shortSummary: proj.shortSummary || '', 
      technologies: proj.technologies || '', challenge: proj.challenge || '', 
      solution: proj.solution || '', impact: proj.impact || '' 
    })
    setEditingId(proj.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Projects / Case Studies</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData({ title: '', category: '', shortSummary: '', technologies: '', challenge: '', solution: '', impact: '' }) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Project'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Category</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Technologies</label>
                  <input type="text" required value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Short Summary</label>
                  <input type="text" required value={formData.shortSummary} onChange={e => setFormData({...formData, shortSummary: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Challenge</label>
                  <textarea required rows={2} value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Solution</label>
                  <textarea required rows={2} value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Impact</label>
                  <textarea required rows={2} value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Project'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Tech</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No projects found.</td>
              </tr>
            ) : (
              projects.map(proj => (
                <tr key={proj.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{proj.title}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{proj.category}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{proj.technologies}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(proj)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(proj.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .premium-glass-panel {
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }
        .premium-label {
          display: block;
          font-size: 12px;
          color: #aaa;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .premium-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-family: inherit;
          transition: all 0.2s;
        }
        .premium-input:focus {
          outline: none;
          border-color: var(--acid);
          background: rgba(0, 0, 0, 0.6);
        }
        .icon-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn.text-blue:hover { background: rgba(62, 142, 255, 0.15); color: #3e8eff; border-color: rgba(62, 142, 255, 0.3); }
        .icon-btn.text-red:hover { background: rgba(255, 68, 68, 0.15); color: #ff4444; border-color: rgba(255, 68, 68, 0.3); }
      `}</style>
    </div>
  )
}
