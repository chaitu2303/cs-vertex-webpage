"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addAnnouncementAction, deleteAnnouncementAction, updateAnnouncementAction } from './actions'

export default function AnnouncementsClient({ initialAnnouncements }: { initialAnnouncements: any[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({ title: '', content: '', link: '', active: true })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('content', formData.content)
    fd.append('link', formData.link)
    fd.append('active', formData.active ? 'true' : 'false')
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateAnnouncementAction(fd)
      if (res.success) {
        setAnnouncements(announcements.map(a => a.id === editingId ? { ...a, ...formData } : a))
      }
    } else {
      const res = await addAnnouncementAction(fd)
      if (res.success) {
        setAnnouncements([res.data, ...announcements])
      }
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: '', content: '', link: '', active: true })
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteAnnouncementAction(fd)
    if (res.success) {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  const handleEdit = (ann: any) => {
    setFormData({ title: ann.title, content: ann.content || '', link: ann.link || '', active: ann.active })
    setEditingId(ann.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Announcements Management</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData({ title: '', content: '', link: '', active: true }) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Announcement'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Announcement' : 'Add New Announcement'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Link (Optional)</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Content</label>
                  <textarea required rows={2} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} style={{ width: '16px', height: '16px' }} />
                    Active (Show on site)
                  </label>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Announcement'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Content</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No announcements found.</td>
              </tr>
            ) : (
              announcements.map(ann => (
                <tr key={ann.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{ann.title}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{ann.content}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 8px', background: ann.active ? 'rgba(68,255,68,0.1)' : 'rgba(255,68,68,0.1)', color: ann.active ? '#44ff44' : '#ff4444', borderRadius: '4px', fontSize: '12px' }}>
                      {ann.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(ann)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(ann.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
