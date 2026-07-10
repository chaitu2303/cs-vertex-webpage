"use client"

import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Plus, X, Save, GripVertical, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  role: string
  expertise: string | null
  bio: string
  image: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  email: string | null
  portfolioUrl: string | null
  published: boolean
  order: number
}

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '', role: '', expertise: '', bio: '', image: '',
    linkedinUrl: '', githubUrl: '', email: '', portfolioUrl: '',
    published: true, order: 0
  })

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      setTeam(data)
    } catch (e) {
      toast.error('Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData(member)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingMember(null)
    setFormData({
      name: '', role: '', expertise: '', bio: '', image: '',
      linkedinUrl: '', githubUrl: '', email: '', portfolioUrl: '',
      published: true, order: team.length
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Team member deleted')
        setTeam(team.filter(t => t.id !== id))
      } else {
        toast.error('Failed to delete')
      }
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editingMember ? 'PUT' : 'POST'
      const url = editingMember ? `/api/admin/team/${editingMember.id}` : '/api/admin/team'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingMember ? 'Updated successfully' : 'Created successfully')
        setIsModalOpen(false)
        fetchTeam()
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Failed to save')
      }
    } catch (e) {
      toast.error('Network error while saving')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, published: !member.published })
      })
      if (res.ok) {
        setTeam(team.map(t => t.id === member.id ? { ...t, published: !t.published } : t))
        toast.success(`Member ${member.published ? 'hidden' : 'published'}`)
      }
    } catch (e) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div style={{ padding: '30px', color: '#fff', minHeight: '100vh', background: '#050505', fontFamily: 'var(--sans)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: '0 0 5px 0' }}>Team Management</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Manage the leadership team displayed on the About page.</p>
        </div>
        <button 
          onClick={handleCreate} 
          style={{ padding: '10px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#1a1a1a', borderBottom: '1px solid #222' }}>
            <tr>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px', width: '50px' }}>Order</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Profile</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Role</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Status</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading team...</td></tr>
            ) : team.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No team members found.</td></tr>
            ) : (
              team.map((member, index) => (
                <tr key={member.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '16px', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GripVertical size={16} style={{ cursor: 'grab' }} />
                      {member.order}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {member.image ? (
                        <img src={member.image} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500, color: '#fff' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{member.email || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>{member.role}</td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => togglePublished(member)}
                      style={{ 
                        padding: '4px 10px', 
                        background: member.published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: member.published ? '#10b981' : '#ef4444',
                        border: `1px solid ${member.published ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {member.published ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {member.published ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(member)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(member.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <>
          <div onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998 }}></div>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#111', width: '100%', maxWidth: '600px', borderRadius: '12px', border: '1px solid #222', zIndex: 9999, maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Full Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Role / Title *</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Image URL</label>
                <input value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="/assets/team/photo.jpg" style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Bio *</label>
                <textarea required rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Email</label>
                  <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>LinkedIn URL</label>
                  <input type="url" value={formData.linkedinUrl || ''} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>GitHub URL</label>
                  <input type="url" value={formData.githubUrl || ''} onChange={e => setFormData({...formData, githubUrl: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Expertise (Tags)</label>
                  <input value={formData.expertise || ''} onChange={e => setFormData({...formData, expertise: e.target.value})} placeholder="e.g. AI, React, Embedded" style={{ width: '100%', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#ccc', fontSize: '14px' }}>
                  <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: 'var(--acid)' }} />
                  Published on Website
                </label>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '13px' }}>Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} style={{ width: '100px', padding: '10px 12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #222', paddingTop: '20px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>

            </form>
          </div>
        </>
      )}

    </div>
  )
}
