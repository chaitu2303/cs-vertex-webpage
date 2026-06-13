"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit2, X } from 'lucide-react'
import { addFAQAction, deleteFAQAction, updateFAQAction } from './actions'

export default function ContentClient({ initialFaqs }: { initialFaqs: any[] }) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({ question: '', answer: '', published: true })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('question', formData.question)
    fd.append('answer', formData.answer)
    fd.append('published', formData.published ? 'true' : 'false')
    
    if (editingId) {
      fd.append('id', editingId)
      const res = await updateFAQAction(fd)
      if (res.success) {
        setFaqs(faqs.map(f => f.id === editingId ? { ...f, ...formData } : f))
      }
    } else {
      const res = await addFAQAction(fd)
      if (res.success) {
        setFaqs([res.data, ...faqs])
      }
    }
    
    setIsAdding(false)
    setEditingId(null)
    setFormData({ question: '', answer: '', published: true })
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteFAQAction(fd)
    if (res.success) {
      setFaqs(faqs.filter(f => f.id !== id))
    }
  }

  const handleEdit = (faq: any) => {
    setFormData({ question: faq.question, answer: faq.answer, published: faq.published })
    setEditingId(faq.id)
    setIsAdding(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Homepage Content (FAQs)</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData({ question: '', answer: '', published: true }) }}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add FAQ'}
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
                <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="premium-label">Question</label>
                  <input type="text" required value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label">Answer</label>
                  <textarea required rows={3} value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="premium-input" />
                </div>
                <div>
                  <label className="premium-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} style={{ width: '16px', height: '16px' }} />
                    Published
                  </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button type="submit" disabled={loading} style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', border: 'none', width: '100%' }}>
                    {loading ? 'Saving...' : 'Save FAQ'}
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
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Question</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Answer</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No FAQs found.</td>
              </tr>
            ) : (
              faqs.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500, width: '30%' }}>{f.question}</td>
                  <td style={{ padding: '16px 24px', color: '#ccc', width: '50%' }}>{f.answer}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleEdit(f)} className="icon-btn text-blue"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(f.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
