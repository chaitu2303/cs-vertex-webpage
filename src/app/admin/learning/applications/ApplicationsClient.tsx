"use client"

import React, { useState } from 'react'
import { Check, X as RejectIcon } from 'lucide-react'
import { updateApplicationStatus } from '../actions' // I will create this

export default function ApplicationsClient({ internships, courses, workshops }: { internships: any[], courses: any[], workshops: any[] }) {
  const [activeTab, setActiveTab] = useState('Internships')
  const [data, setData] = useState({ Internships: internships, Courses: courses, Workshops: workshops })
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (id: string, type: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) return
    
    setLoading(id)
    const res = await updateApplicationStatus(id, type, status)
    if (res.success) {
      setData(prev => ({
        ...prev,
        [type]: prev[type as keyof typeof prev].map((item: any) => item.id === id ? { ...item, status } : item)
      }))
    } else {
      alert('Failed to update status.')
    }
    setLoading(null)
  }

  const renderTable = (items: any[], type: string) => (
    <div className="premium-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <tr>
            <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Applicant</th>
            <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Program</th>
            <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Date</th>
            <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '16px 24px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No applications found.</td></tr>
          ) : (
            items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 500 }}>
                  {item.fullName}<br/>
                  <span style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{item.email}</span>
                </td>
                <td style={{ padding: '16px 24px', color: '#ccc' }}>
                  {type === 'Internships' ? item.internship?.title : type === 'Courses' ? item.course?.title : item.workshop?.title}
                </td>
                <td style={{ padding: '16px 24px', color: '#aaa' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                    background: item.status === 'Approved' ? 'rgba(0,255,0,0.1)' : item.status === 'Rejected' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
                    color: item.status === 'Approved' ? '#0f0' : item.status === 'Rejected' ? '#f00' : '#ff0' 
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  {item.status === 'Pending' && (
                    <>
                      <button disabled={loading === item.id} onClick={() => handleStatusChange(item.id, type, 'Approved')} className="icon-btn text-green" title="Approve"><Check size={16} /></button>
                      <button disabled={loading === item.id} onClick={() => handleStatusChange(item.id, type, 'Rejected')} className="icon-btn text-red" title="Reject"><RejectIcon size={16} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Review Applications</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Internships', 'Courses', 'Workshops'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#333' : '#111',
                color: activeTab === tab ? '#fff' : '#888',
                border: '1px solid #333',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderTable(data[activeTab as keyof typeof data], activeTab)}

      <style>{`
        .premium-glass-panel { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; }
        .icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.text-green:hover { background: rgba(0, 255, 0, 0.15); color: #0f0; border-color: rgba(0, 255, 0, 0.3); }
        .icon-btn.text-red:hover { background: rgba(255, 68, 68, 0.15); color: #ff4444; border-color: rgba(255, 68, 68, 0.3); }
        .icon-btn:disabled { opacity: 0.5; cursor: wait; }
      `}</style>
    </div>
  )
}
