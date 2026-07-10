"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X, Search, GripVertical } from 'lucide-react'
import { addProjectAction, deleteProjectAction, updateProjectAction, updateProjectOrderAction } from './actions'
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown'

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects.sort((a, b) => a.order - b.order))
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('')

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Form State
  const defaultForm = { 
    title: '', slug: '', category: '', shortSummary: '', technologies: '', challenge: '', 
    solution: '', impact: '', objectives: '', features: '', outcomes: '', useCase: '', 
    image: '', galleryImages: '', timeline: '', github: '', liveDemo: '', documentation: '', 
    status: 'Active', isFeatured: false, published: true, order: projects.length 
  }
  const [formData, setFormData] = useState<any>(defaultForm)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => fd.append(key, typeof value === 'boolean' ? value.toString() : String(value || '')))
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateProjectAction(fd)
      if (res.success) {
        setProjects(projects.map(p => p.id === editingId ? { ...p, ...formData, id: p.id } : p))
      }
    } else {
      const res = await addProjectAction(fd)
      if (res.success) {
        setProjects([...projects, res.data])
      }
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultForm)
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
      title: proj.title || '', slug: proj.slug || '', category: proj.category || '', 
      shortSummary: proj.shortSummary || '', technologies: proj.technologies || '', 
      challenge: proj.challenge || '', solution: proj.solution || '', impact: proj.impact || '',
      objectives: proj.objectives || '', features: proj.features || '', outcomes: proj.outcomes || '',
      useCase: proj.useCase || '', image: proj.image || '', galleryImages: proj.galleryImages || '',
      timeline: proj.timeline || '', github: proj.github || '', liveDemo: proj.liveDemo || '',
      documentation: proj.documentation || '', status: proj.status || 'Active', 
      isFeatured: proj.isFeatured || false, published: proj.published !== false, order: proj.order || 0
    })
    setEditingId(proj.id)
    setIsAdding(true)
  }

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newList = [...projects]
    const draggedItem = newList[draggedIndex]
    
    newList.splice(draggedIndex, 1)
    newList.splice(index, 0, draggedItem)
    
    setProjects(newList)
    setDraggedIndex(null)

    const updates = newList.map((p, i) => ({ id: p.id, order: i }))
    await updateProjectOrderAction(updates)
  }

  // --- Filter Logic ---
  const filteredProjects = projects.filter(p => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (p.title || '').toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      (p.technologies || '').toLowerCase().includes(term) ||
      (p.status || '').toLowerCase().includes(term)
    )
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Projects / Case Studies</h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="premium-search">
            <Search size={16} color="#888" />
            <input 
              type="text" 
              placeholder="Search by Name, Category, Tech..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData(defaultForm) }}
            style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
          >
            {isAdding ? 'Cancel' : '+ Add Project'}
          </button>
        </div>
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
                
                <div><label className="premium-label">Project Name *</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" /></div>
                <div><label className="premium-label">Slug</label><input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="premium-input" /></div>
                
                <div>
                  <label className="premium-label">Project Categories *</label>
                  <MultiSelectDropdown value={formData.category} onChange={val => setFormData({...formData, category: val})} />
                </div>
                
                <div>
                  <label className="premium-label">Technologies (Comma separated)</label>
                  <input type="text" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} className="premium-input" placeholder="IoT, ESP32, Python..." />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}><label className="premium-label">Short Description *</label><textarea required rows={2} value={formData.shortSummary} onChange={e => setFormData({...formData, shortSummary: e.target.value})} className="premium-input" /></div>
                
                <div><label className="premium-label">Problem Statement</label><textarea rows={3} value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} className="premium-input" /></div>
                <div><label className="premium-label">Solution</label><textarea rows={3} value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="premium-input" /></div>
                
                <div><label className="premium-label">Features / Long Description</label><textarea rows={3} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="premium-input" /></div>
                <div><label className="premium-label">Impact</label><textarea rows={3} value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} className="premium-input" /></div>

                <div><label className="premium-label">Project Image URL</label><input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="premium-input" /></div>
                <div><label className="premium-label">Gallery Images (JSON array)</label><input type="text" value={formData.galleryImages} onChange={e => setFormData({...formData, galleryImages: e.target.value})} className="premium-input" /></div>
                
                <div><label className="premium-label">GitHub</label><input type="text" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="premium-input" /></div>
                <div><label className="premium-label">Live Demo</label><input type="text" value={formData.liveDemo} onChange={e => setFormData({...formData, liveDemo: e.target.value})} className="premium-input" /></div>

                <div>
                  <label className="premium-label">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="premium-input">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                
                <div><label className="premium-label">Display Order (Priority)</label><input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="premium-input" /></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--acid)' }} />
                  <label htmlFor="isFeatured" className="premium-label" style={{ margin: 0 }}>Featured Project (Show Badge)</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--acid)' }} />
                  <label htmlFor="published" className="premium-label" style={{ margin: 0 }}>Published</label>
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
              <th style={{ width: '40px', padding: '16px 12px' }}></th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Project</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No projects found.</td>
              </tr>
            ) : (
              filteredProjects.map((proj, index) => (
                <tr 
                  key={proj.id} 
                  draggable={!searchTerm}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    transition: 'background 0.2s',
                    opacity: draggedIndex === index ? 0.5 : 1,
                    cursor: searchTerm ? 'default' : 'grab'
                  }} 
                  className="hover:bg-white/5"
                >
                  <td style={{ padding: '16px 12px', color: '#555' }}>
                    <GripVertical size={16} />
                  </td>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>
                    {proj.title}
                    {proj.isFeatured && <span style={{ marginLeft: '10px', fontSize: '10px', background: 'var(--acid)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>FEATURED</span>}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(proj.category || '').split(',').filter(Boolean).map((c: string) => (
                        <span key={c} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{c.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      color: proj.status === 'Active' ? '#4ade80' : proj.status === 'Draft' ? '#facc15' : '#888',
                      fontSize: '12px'
                    }}>● {proj.status}</span>
                  </td>
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
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: inherit;
          transition: all 0.2s;
        }
        .premium-input:focus {
          border-color: var(--acid);
          outline: none;
        }
        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .text-blue { color: #60a5fa; }
        .text-red { color: #f87171; }
        .premium-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          width: 300px;
        }
        .premium-search input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          width: 100%;
          outline: none;
        }
        .premium-search input::placeholder {
          color: #666;
        }
      `}</style>
    </div>
  )
}
