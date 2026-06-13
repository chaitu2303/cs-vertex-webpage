"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addWorkshopAction, deleteWorkshopAction, updateWorkshopAction } from '../actions'

export default function WorkshopsClient({ initialWorkshops }: { initialWorkshops: any[] }) {
  const [workshops, setWorkshops] = useState(initialWorkshops)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultForm = { title: '', description: '', date: '', time: '', speaker: '', mode: '', seats: '', banner: '', status: 'Upcoming', published: true }
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
      const res = await updateWorkshopAction(fd)
      if (res.success) setWorkshops(workshops.map(w => w.id === editingId ? { ...w, ...formData } : w))
    } else {
      const res = await addWorkshopAction(fd)
      if (res.success) setWorkshops([res.data, ...workshops])
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData(defaultForm)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workshop?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteWorkshopAction(fd)
    if (res.success) setWorkshops(workshops.filter(w => w.id !== id))
  }

  const handleEdit = (item: any) => {
    setFormData({ 
      title: item.title, 
      description: item.description,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      time: item.time,
      speaker: item.speaker,
      mode: item.mode,
      seats: item.seats.toString(),
      banner: item.banner || '',
      status: item.status,
      published: item.published 
    })
    setEditingId(item.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Manage Workshops</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData(defaultForm) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Workshop'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Workshop' : 'Add New Workshop'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Time</label>
                  <input type="text" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Speaker</label>
                  <input type="text" required value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Mode</label>
                  <input type="text" required value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Total Seats</label>
                  <input type="number" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Banner URL</label>
                  <input type="text" value={formData.banner} onChange={e => setFormData({...formData, banner: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="premium-input">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
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
                    {loading ? 'Saving...' : 'Save Workshop'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Visibility</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workshops.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No workshops found.</td>
              </tr>
            ) : (
              workshops.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{w.title}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{new Date(w.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px', color: '#aaa' }}>{w.status}</td>
                  <td style={{ padding: '16px 24px', color: w.published ? 'var(--acid)' : '#ff4444' }}>{w.published ? 'Published' : 'Draft'}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(w)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(w.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
