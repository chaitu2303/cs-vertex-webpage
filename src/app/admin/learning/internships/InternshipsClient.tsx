"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addInternshipAction, deleteInternshipAction, updateInternshipAction } from '../actions'

export default function InternshipsClient({ initialInternships }: { initialInternships: any[] }) {
  const [internships, setInternships] = useState(initialInternships)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultForm = { title: '', description: '', duration: '', mode: '', location: '', requirements: '', benefits: '', lastDate: '', seats: '', status: 'Open', published: true }
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
      const res = await updateInternshipAction(fd)
      if (res.success) setInternships(internships.map(i => i.id === editingId ? { ...i, ...formData } : i))
    } else {
      const res = await addInternshipAction(fd)
      if (res.success) setInternships([res.data, ...internships])
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultForm)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this internship?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteInternshipAction(fd)
    if (res.success) setInternships(internships.filter(i => i.id !== id))
  }

  const handleEdit = (item: any) => {
    setFormData({ 
      title: item.title, 
      description: item.description,
      duration: item.duration, 
      mode: item.mode,
      location: item.location,
      requirements: item.requirements,
      benefits: item.benefits,
      lastDate: item.lastDate ? new Date(item.lastDate).toISOString().split('T')[0] : '',
      seats: item.seats.toString(),
      status: item.status,
      published: item.published 
    })
    setEditingId(item.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Manage Internships</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData(defaultForm) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Internship'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Internship' : 'Add New Internship'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Duration</label>
                  <input type="text" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Mode (e.g. Remote/Hybrid)</label>
                  <input type="text" required value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Total Seats</label>
                  <input type="number" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Last Date to Apply</label>
                  <input type="date" required value={formData.lastDate} onChange={e => setFormData({...formData, lastDate: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Requirements</label>
                  <textarea required rows={3} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Benefits</label>
                  <textarea required rows={3} value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="premium-input">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="premium-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '30px' }}>
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: '16px', height: '16px' }} />
                    Published
                  </label>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Internship'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Mode</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Seats</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Visibility</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No internships found.</td>
              </tr>
            ) : (
              internships.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{i.title}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{i.mode}</td>
                  <td style={{ padding: '16px 24px', color: '#aaa' }}>{i.seats}</td>
                  <td style={{ padding: '16px 24px', color: i.published ? 'var(--acid)' : '#ff4444' }}>{i.published ? 'Published' : 'Draft'}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(i)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
