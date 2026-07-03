"use client"

import React, { useState, useRef } from 'react'
import { 
  Trash2, Edit2, X, Plus, Eye, EyeOff, Archive, 
  Copy, Image as ImageIcon, Upload, Star, Flame, 
  Calendar, Tag, ExternalLink, GripVertical
} from 'lucide-react'
import { addAnnouncementAction, deleteAnnouncementAction, updateAnnouncementAction, toggleAnnouncementAction, duplicateAnnouncementAction } from './actions'

const CATEGORIES = [
  'Announcement', 'Offer', 'Brochure', 'Packages',
  'Recruitment', 'Internship', 'Webinar', 'Event',
  'Festival Offer', 'Product Launch', 'Company Update',
  'Marketing', 'Others'
]

const BUTTON_PRESETS = [
  'Contact Us', 'Grab Offer', 'Download Brochure', 'Learn More',
  'Apply Now', 'Register Today', 'View Pricing', 'Get Started',
  'Register', 'Join Now', 'View Details', 'Explore More'
]

type AnnFormData = {
  title: string
  subtitle: string
  category: string
  content: string
  offerTag: string
  buttonText: string
  buttonUrl: string
  fileUrl: string
  isPinned: boolean
  isFeatured: boolean
  published: boolean
  status: string
  priority: number
  order: number
  startDate: string
  endDate: string
}

const EMPTY_FORM: AnnFormData = {
  title: '', subtitle: '', category: 'Company Update', content: '',
  offerTag: '', buttonText: '', buttonUrl: '', fileUrl: '',
  isPinned: false, isFeatured: false, published: true,
  status: 'Active', priority: 0, order: 0,
  startDate: '', endDate: ''
}

export default function AnnouncementsClient({ initialAnnouncements }: { initialAnnouncements: any[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<AnnFormData>(EMPTY_FORM)
  const [preview, setPreview] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const fileRef = useRef<HTMLInputElement>(null)

  const f = (k: keyof AnnFormData, v: any) => setForm(p => ({ ...p, [k]: v }))

  // Upload image
  const handleImageUpload = async (file: File) => {
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { alert('File too large. Max 20MB.'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'brochures')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        f('fileUrl', data.url)
        setPreview(data.url)
      }
    } catch { alert('Upload failed') }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateAnnouncementAction(fd)
      if (res.success) {
        setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a))
      }
    } else {
      const res = await addAnnouncementAction(fd)
      if (res.success) setAnnouncements(prev => [res.data, ...prev])
    }
    closeForm()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    const fd = new FormData(); fd.append('id', id)
    const res = await deleteAnnouncementAction(fd)
    if (res.success) setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const handleToggle = async (id: string, field: string, value: boolean) => {
    const fd = new FormData()
    fd.append('id', id); fd.append('field', field); fd.append('value', String(!value))
    const res = await toggleAnnouncementAction(fd)
    if (res.success) setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, [field]: !value } : a))
  }

  const handleDuplicate = async (id: string) => {
    const fd = new FormData(); fd.append('id', id)
    const res = await duplicateAnnouncementAction(fd)
    if (res.success) setAnnouncements(prev => [res.data, ...prev])
  }

  const handleEdit = (ann: any) => {
    setForm({
      title: ann.title || '', subtitle: ann.subtitle || '',
      category: ann.category || 'Company Update', content: ann.content || '',
      offerTag: ann.offerTag || '', buttonText: ann.buttonText || '',
      buttonUrl: ann.buttonUrl || '', fileUrl: ann.fileUrl || '',
      isPinned: ann.isPinned || false, isFeatured: ann.isFeatured || false,
      published: ann.published ?? true, status: ann.status || 'Active',
      priority: ann.priority || 0, order: ann.order || 0,
      startDate: ann.startDate ? ann.startDate.substring(0, 10) : '',
      endDate: ann.endDate ? ann.endDate.substring(0, 10) : ''
    })
    setPreview(ann.fileUrl || null)
    setEditingId(ann.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false); setEditingId(null)
    setForm(EMPTY_FORM); setPreview(null)
  }

  const filtered = filterStatus === 'all'
    ? announcements
    : filterStatus === 'active'
    ? announcements.filter(a => a.published && a.status !== 'Archived')
    : filterStatus === 'hidden'
    ? announcements.filter(a => !a.published || a.status === 'Hidden')
    : announcements.filter(a => a.status === 'Archived')

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>Announcements &amp; Offers</h2>
          <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0' }}>Manage your Notice Board — fully controls what appears on the website</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); setPreview(null) }}
          style={{ background: '#FF6B2C', color: '#000', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
        >
          <Plus size={16} /> Add Notice
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[['all', 'All'], ['active', 'Active'], ['hidden', 'Hidden'], ['Archived', 'Archived']].map(([v, l]) => (
          <button key={v} onClick={() => setFilterStatus(v)}
            style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              background: filterStatus === v ? '#FF6B2C' : 'transparent',
              borderColor: filterStatus === v ? '#FF6B2C' : 'rgba(255,255,255,0.1)',
              color: filterStatus === v ? '#000' : '#888'
            }}
          >{l}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#555', alignSelf: 'center' }}>{filtered.length} items</span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '860px', background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', margin: 'auto' }}>
            {/* Form header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>{editingId ? '✏️ Edit Notice' : '➕ Add Notice'}</h3>
              <button onClick={closeForm} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Image Upload */}
              <div>
                <label style={labelStyle}>Poster / Brochure Image</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed rgba(255,107,44,0.3)', borderRadius: '12px', padding: '20px', cursor: 'pointer', background: 'rgba(255,107,44,0.03)', transition: 'all 0.2s', textAlign: 'center', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', position: 'relative' }}
                >
                  {preview ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img src={preview} alt="Preview" style={{ maxHeight: '220px', objectFit: 'contain', borderRadius: '8px', display: 'block', margin: '0 auto' }} />
                      <button type="button" onClick={e => { e.stopPropagation(); f('fileUrl', ''); setPreview(null) }}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {uploading ? <div style={{ color: '#FF6B2C' }}>Uploading...</div> : (
                        <>
                          <Upload size={28} color="#FF6B2C" opacity={0.6} />
                          <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Drag &amp; drop or click to upload (JPG, PNG, WEBP — Max 20MB)</p>
                        </>
                      )}
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]) }} />
                </div>
                {/* OR manual URL */}
                <input type="text" placeholder="Or enter image URL manually" value={form.fileUrl} onChange={e => { f('fileUrl', e.target.value); setPreview(e.target.value) }} style={{ ...inputStyle, marginTop: '8px', fontSize: '12px' }} />
              </div>

              {/* Title & Subtitle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input type="text" value={form.title} onChange={e => f('title', e.target.value)} style={inputStyle} placeholder="e.g. Summer Internship Drive 2025" />
                </div>
                <div>
                  <label style={labelStyle}>Subtitle</label>
                  <input type="text" value={form.subtitle} onChange={e => f('subtitle', e.target.value)} style={inputStyle} placeholder="Short supporting line" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} value={form.content} onChange={e => f('content', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief description visible on the card..." />
              </div>

              {/* Category, Offer Tag, Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={e => f('category', e.target.value)} style={{ ...inputStyle, appearance: 'auto' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Offer Tag (Optional)</label>
                  <input type="text" value={form.offerTag} onChange={e => f('offerTag', e.target.value)} style={inputStyle} placeholder="e.g. 50% OFF, FREE, LIMITED" />
                </div>
                <div>
                  <label style={labelStyle}>Priority (0–10)</label>
                  <input type="number" min={0} max={10} value={form.priority} onChange={e => f('priority', Number(e.target.value))} style={inputStyle} />
                </div>
              </div>

              {/* Button */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Button Text</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {BUTTON_PRESETS.slice(0, 6).map(p => (
                      <button key={p} type="button" onClick={() => f('buttonText', p)}
                        style={{ fontSize: '10px', padding: '3px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', background: form.buttonText === p ? '#FF6B2C' : 'transparent', color: form.buttonText === p ? '#000' : '#888', cursor: 'pointer' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <input type="text" value={form.buttonText} onChange={e => f('buttonText', e.target.value)} style={inputStyle} placeholder="e.g. Apply Now" />
                </div>
                <div>
                  <label style={labelStyle}>Button URL</label>
                  <input type="url" value={form.buttonUrl} onChange={e => f('buttonUrl', e.target.value)} style={inputStyle} placeholder="https://..." />
                </div>
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Start Date (Optional)</label>
                  <input type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End Date / Expiry (Optional)</label>
                  <input type="date" value={form.endDate} onChange={e => f('endDate', e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* Status checkboxes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {([
                  ['published', 'Active (Show on site)'],
                  ['isPinned', 'Pinned (Show first)'],
                  ['isFeatured', 'Featured ⭐'],
                ] as [keyof AnnFormData, string][]).map(([k, label]) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#ccc' }}>
                    <input type="checkbox" checked={Boolean(form[k])} onChange={e => f(k, e.target.checked)} style={{ width: '15px', height: '15px', accentColor: '#FF6B2C' }} />
                    {label}
                  </label>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', color: '#ccc' }}>Status:</label>
                  <select value={form.status} onChange={e => f('status', e.target.value)} style={{ ...inputStyle, padding: '4px 10px', fontSize: '12px', width: 'auto' }}>
                    <option value="Active">Active</option>
                    <option value="Hidden">Hidden</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeForm} style={{ padding: '11px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: '#FF6B2C', color: '#000', cursor: loading ? 'wait' : 'pointer', fontWeight: 700, fontSize: '14px' }}>
                  {loading ? 'Saving...' : editingId ? 'Update Notice' : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#444', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px' }}>
            <ImageIcon size={40} opacity={0.3} style={{ display: 'block', margin: '0 auto 12px' }} />
            <p style={{ margin: 0 }}>No announcements found. Click &quot;Add Notice&quot; to create one.</p>
          </div>
        )}

        {filtered.map(ann => (
          <div key={ann.id} style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', display: 'flex', gap: '0', transition: 'border-color 0.2s' }}>
            {/* Thumb */}
            {ann.fileUrl && (
              <div style={{ width: '100px', flexShrink: 0, background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={ann.fileUrl} alt={ann.title} style={{ width: '100px', height: '80px', objectFit: 'contain', objectPosition: 'center', display: 'block', padding: '4px' }} />
              </div>
            )}
            <div style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minWidth: 0 }}>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#FF6B2C', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,107,44,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{ann.category}</span>
                  {ann.isFeatured && <span style={{ fontSize: '10px', color: '#F59E0B' }}>⭐ Featured</span>}
                  {ann.isPinned && <span style={{ fontSize: '10px', color: '#60A5FA' }}>📌 Pinned</span>}
                  {ann.offerTag && <span style={{ fontSize: '10px', color: '#FBBF24', background: 'rgba(251,191,36,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{ann.offerTag}</span>}
                </div>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '14px', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.title}</p>
                {ann.subtitle && <p style={{ color: '#666', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.subtitle}</p>}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                  background: ann.published && ann.status !== 'Hidden' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: ann.published && ann.status !== 'Hidden' ? '#22C55E' : '#EF4444'
                }}>
                  {ann.status || (ann.published ? 'Active' : 'Hidden')}
                </span>
                {ann.priority >= 5 && <span style={{ fontSize: '10px', color: '#EF4444' }}>🔥 Priority {ann.priority}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <ActionBtn title="Toggle visibility" icon={ann.published ? <EyeOff size={14} /> : <Eye size={14} />} onClick={() => handleToggle(ann.id, 'published', ann.published)} />
                <ActionBtn title="Duplicate" icon={<Copy size={14} />} onClick={() => handleDuplicate(ann.id)} />
                <ActionBtn title="Edit" icon={<Edit2 size={14} />} onClick={() => handleEdit(ann)} color="blue" />
                <ActionBtn title="Delete" icon={<Trash2 size={14} />} onClick={() => handleDelete(ann.id)} color="red" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        select option { background: #111; color: #fff; }
      `}</style>
    </div>
  )
}

function ActionBtn({ title, icon, onClick, color }: { title: string; icon: React.ReactNode; onClick: () => void; color?: 'blue' | 'red' }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '7px', cursor: 'pointer', color: color === 'blue' ? '#60A5FA' : color === 'red' ? '#EF4444' : '#888',
        transition: 'all 0.2s'
      }}
    >
      {icon}
    </button>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 600, color: '#888',
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px'
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
  color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s',
  outline: 'none'
}
