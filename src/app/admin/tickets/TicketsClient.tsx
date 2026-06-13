"use client"

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { updateTicketStatusAction, deleteTicketAction } from './actions'

export default function TicketsClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const fd = new FormData()
    fd.append('id', id)
    fd.append('status', status)
    
    const res = await updateTicketStatusAction(fd)
    if (res.success) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t))
    }
    setUpdating(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this support ticket?')) return
    const fd = new FormData()
    fd.append('id', id)
    const res = await deleteTicketAction(fd)
    if (res.success) {
      setTickets(tickets.filter(t => t.id !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Support Tickets</h2>
      </div>

      <div className="premium-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Ticket ID</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Subject</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No tickets found.</td>
              </tr>
            ) : (
              tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px', color: '#888', fontFamily: 'monospace' }}>#{t.id.slice(0,6)}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{t.customer?.name || 'Unknown'}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{t.customer?.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{t.subject}</div>
                    <div style={{ color: '#888', fontSize: '13px' }}>{t.message}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <select 
                      value={t.status} 
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                      disabled={updating === t.id}
                      style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(0,0,0,0.6)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: t.status === 'Resolved' ? '#44ff44' : t.status === 'In Progress' ? '#3e8eff' : '#ffaa00', 
                        borderRadius: '6px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(t.id)} className="icon-btn text-red"><Trash2 size={16} /></button>
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
