"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addMemberAction, deleteMemberAction, updateMemberAction } from './actions'

export default function TeamClient({ initialTeam }: { initialTeam: any[] }) {
  const [team, setTeam] = useState(initialTeam)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({ name: '', role: '', email: '', bio: '' })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('role', formData.role)
    fd.append('email', formData.email)
    fd.append('bio', formData.bio)
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateMemberAction(fd)
      if (res.success) {
        setTeam(team.map(m => m.id === editingId ? { ...m, ...formData } : m))
      }
    } else {
      const res = await addMemberAction(fd)
      if (res.success) {
        setTeam([res.data, ...team])
      }
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: '', role: '', email: '', bio: '' })
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteMemberAction(fd)
    if (res.success) {
      setTeam(team.filter(m => m.id !== id))
    }
  }

  const handleEdit = (member: any) => {
    setFormData({ name: member.name, role: member.role, email: member.email || '', bio: member.bio })
    setEditingId(member.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Team Management</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData({ name: '', role: '', email: '', bio: '' }) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Member'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit Member' : 'Add New Member'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="premium-label">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Role</label>
                  <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="premium-label">Bio</label>
                  <textarea required rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="premium-input" />
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save Member'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Role</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No team members found.</td>
              </tr>
            ) : (
              team.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>{member.name}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc' }}>{member.role}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(member)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(member.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
