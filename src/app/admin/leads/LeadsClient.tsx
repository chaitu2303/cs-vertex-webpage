"use client"

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteLeadAction, updateLeadStatusAction } from './actions'

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const fd = new FormData()
    fd.append('id', id)
    fd.append('status', status)
    
    const res = await updateLeadStatusAction(fd)
    if (res.success) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
    }
    setUpdating(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteLeadAction(fd)
    if (res.success) {
      setLeads(leads.filter(l => l.id !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Leads & Contacts</h2>
      </div>

      <div className="premium-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Contact Info</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Message Data</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>No leads found.</td>
              </tr>
            ) : (
              leads.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: 'var(--acid)', fontWeight: 500 }}>{l.formType}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{l.name}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{l.email}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{l.phone}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#ccc', fontSize: '13px' }}>
                    {l.data ? l.data.substring(0, 100) + (l.data.length > 100 ? '...' : '') : 'No additional data'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <select 
                      value={l.status} 
                      onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                      disabled={updating === l.id}
                      style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(0,0,0,0.6)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: l.status === 'Responded' ? '#44ff44' : l.status === 'Reviewed' ? '#3e8eff' : '#ffaa00', 
                        borderRadius: '6px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Responded">Responded</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(l.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .premium-glass-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; }
        .icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .icon-btn.text-red:hover { background: rgba(255, 68, 68, 0.15); color: #ff4444; border-color: rgba(255, 68, 68, 0.3); }
      `}</style>
    </div>
  )
}
