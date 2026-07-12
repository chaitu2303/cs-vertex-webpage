"use client"

import React, { useState, useEffect } from 'react'
import { Edit, Trash2, X, Save, MessageSquare, ChevronDown, Calendar, Search, Filter, Mail, History, FileText, CheckCircle, Clock, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Note {
  id: string
  text: string
  createdAt: string
  adminId: string | null
}

interface Activity {
  id: string
  action: string
  createdAt: string
  adminId: string | null
}

interface NotifyMeRequest {
  id: string
  name: string
  email: string
  phone: string | null
  interest: string
  message: string | null
  sourcePage: string | null
  status: string
  createdAt: string
  notes?: Note[]
  activities?: Activity[]
}

interface SummaryData {
  total: number
  new: number
  contacted: number
  inProgress: number
  converted: number
  closed: number
}

const statusColors: Record<string, string> = {
  'New': '#3b82f6',
  'Contacted': '#f59e0b',
  'In Progress': '#8b5cf6',
  'Converted': '#10b981',
  'Closed': '#6b7280'
}

export default function NotifyMeCRMPage() {
  const [requests, setRequests] = useState<NotifyMeRequest[]>([])
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateRange, setDateRange] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [selectedLead, setSelectedLead] = useState<NotifyMeRequest | null>(null)
  const [activeTab, setActiveTab] = useState<'Details' | 'Notes' | 'Timeline' | 'Email'>('Details')
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status: statusFilter,
        dateRange
      })
      const res = await fetch(`/api/admin/notify-me?${query.toString()}`)
      const json = await res.json()
      if (res.ok) {
        setRequests(json.data)
        setSummary(json.summary)
        setAnalytics(json.analytics)
        setTotalPages(json.pagination.totalPages)
      } else {
        toast.error(json.error || 'Failed to load data')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const delay = setTimeout(() => {
      fetchRequests()
    }, 400)
    return () => clearTimeout(delay)
  }, [search, statusFilter, dateRange, page])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/notify-me/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`)
        fetchRequests()
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus })
        }
      }
    } catch (e) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    try {
      await fetch(`/api/admin/notify-me`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      })
      toast.success('Lead deleted')
      setSelectedLead(null)
      fetchRequests()
    } catch (e) {
      toast.error('Failed to delete')
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !newNote.trim()) return
    setSavingNote(true)
    try {
      const res = await fetch(`/api/admin/notify-me/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote })
      })
      if (res.ok) {
        toast.success('Note added')
        setNewNote('')
        fetchRequests()
      }
    } catch (e) {
      toast.error('Failed to add note')
    } finally {
      setSavingNote(false)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !emailSubject.trim() || !emailBody.trim()) return
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/admin/notify-me/${selectedLead.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: emailSubject, body: emailBody })
      })
      if (res.ok) {
        toast.success('Email sent successfully')
        setEmailSubject('')
        setEmailBody('')
        fetchRequests()
      }
    } catch (e) {
      toast.error('Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div style={{ padding: '30px', color: '#fff', minHeight: '100vh', background: '#050505', fontFamily: 'var(--sans)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: '0 0 5px 0' }}>Notify Me CRM</h1>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Manage leads, track statuses, and view activities.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '10px 16px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
             Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[
            { label: 'Total Leads', count: summary.total, color: '#fff' },
            { label: 'New', count: summary.new, color: statusColors['New'] },
            { label: 'Contacted', count: summary.contacted, color: statusColors['Contacted'] },
            { label: 'In Progress', count: summary.inProgress, color: statusColors['In Progress'] },
            { label: 'Converted', count: summary.converted, color: statusColors['Converted'] },
            { label: 'Closed', count: summary.closed, color: statusColors['Closed'] },
          ].map(card => (
            <div key={card.label} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#888', fontSize: '13px', fontWeight: 500 }}>{card.label}</span>
              <span style={{ color: card.color, fontSize: '28px', fontWeight: 700 }}>{card.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Charts / Analytics Row */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>Leads by Source</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.leadsBySource} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" stroke="#666" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#ff5c2a" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>Interest Categories</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.interestCategories} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#888" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input 
            type="text" 
            placeholder="Search name, email, phone, interest..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none' }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none', minWidth: '150px' }}>
          <option value="All">All Statuses</option>
          {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none', minWidth: '150px' }}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Data Table */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#1a1a1a', borderBottom: '1px solid #222' }}>
            <tr>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Name & Email</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Interest</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Source</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Status</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px' }}>Date</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '13px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading leads...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No leads found.</td></tr>
            ) : (
              requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#161616'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{req.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{req.email}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>{req.interest}</td>
                  <td style={{ padding: '16px', color: '#888', fontSize: '13px' }}>{req.sourcePage}</td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={req.status} 
                      onChange={e => handleStatusChange(req.id, e.target.value)}
                      style={{ 
                        padding: '6px 12px', 
                        background: `${statusColors[req.status]}20`, 
                        color: statusColors[req.status], 
                        border: `1px solid ${statusColors[req.status]}40`, 
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {Object.keys(statusColors).map(s => <option key={s} value={s} style={{background: '#111', color: '#fff'}}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px', color: '#888', fontSize: '13px' }}>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => setSelectedLead(req)} style={{ padding: '8px 16px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222' }}>
          <span style={{ color: '#888', fontSize: '13px' }}>Page {page} of {totalPages || 1}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
          </div>
        </div>
      </div>

      {/* Sliding Drawer for Lead Details */}
      {selectedLead && (
        <>
          {/* Overlay */}
          <div onClick={() => setSelectedLead(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998, animation: 'fadeIn 0.2s' }}></div>
          
          {/* Drawer */}
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '600px', background: '#0a0a0a', borderLeft: '1px solid #222', zIndex: 9999, display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
            
            {/* Drawer Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{selectedLead.name}</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>{selectedLead.email}</span>
                  <span style={{ 
                    padding: '4px 10px', 
                    background: `${statusColors[selectedLead.status]}20`, 
                    color: statusColors[selectedLead.status], 
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>{selectedLead.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleDelete(selectedLead.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '8px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}><Trash2 size={18} /></button>
                <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '8px', borderRadius: '6px' }} onMouseEnter={e => e.currentTarget.style.background = '#222'} onMouseLeave={e => e.currentTarget.style.background = 'none'}><X size={18} /></button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #222', background: '#111' }}>
              {['Details', 'Notes', 'Timeline', 'Email'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab as any)}
                  style={{ 
                    flex: 1, 
                    padding: '16px', 
                    background: 'none', 
                    border: 'none', 
                    borderBottom: activeTab === tab ? '2px solid var(--acid)' : '2px solid transparent',
                    color: activeTab === tab ? '#fff' : '#888',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab ? 600 : 400,
                    fontSize: '14px',
                    transition: '0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {activeTab === 'Details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '14px' }}>
                      <span style={{ color: '#666' }}>Name</span><span style={{ color: '#fff' }}>{selectedLead.name}</span>
                      <span style={{ color: '#666' }}>Email</span><span style={{ color: '#fff' }}>{selectedLead.email}</span>
                      <span style={{ color: '#666' }}>Phone</span><span style={{ color: '#fff' }}>{selectedLead.phone || '-'}</span>
                      <span style={{ color: '#666' }}>Date</span><span style={{ color: '#fff' }}>{new Date(selectedLead.createdAt).toLocaleString()}</span>
                      <span style={{ color: '#666' }}>Source</span><span style={{ color: '#fff' }}>{selectedLead.sourcePage}</span>
                    </div>
                  </div>

                  <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Request Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '14px' }}>
                      <span style={{ color: '#666' }}>Interest</span>
                      <span style={{ color: '#fff', background: '#222', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>{selectedLead.interest}</span>
                      
                      <span style={{ color: '#666', paddingTop: '10px' }}>Message</span>
                      <div style={{ color: '#ccc', background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginTop: '10px', lineHeight: 1.6 }}>
                        {selectedLead.message || <i>No message provided.</i>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Notes' && (
                <div>
                  <form onSubmit={handleAddNote} style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#aaa', fontSize: '14px' }}>Add Internal Note (Admins Only)</label>
                    <textarea 
                      required
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Write your note here..."
                      style={{ width: '100%', padding: '15px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', minHeight: '120px', outline: 'none', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="submit" disabled={savingNote} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                        {savingNote ? 'Saving...' : 'Save Note'}
                      </button>
                    </div>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      selectedLead.notes.map(note => (
                        <div key={note.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '15px' }}>
                          <div style={{ color: '#fff', fontSize: '14px', lineHeight: 1.5, marginBottom: '10px' }}>{note.text}</div>
                          <div style={{ color: '#666', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Admin ID: {note.adminId || 'System'}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No notes yet.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {selectedLead.activities && selectedLead.activities.length > 0 ? (
                    selectedLead.activities.map((act, idx) => (
                      <div key={act.id} style={{ display: 'flex', gap: '20px', position: 'relative', paddingBottom: '25px' }}>
                        {/* Timeline line */}
                        {idx !== selectedLead.activities!.length - 1 && (
                          <div style={{ position: 'absolute', left: '15px', top: '30px', bottom: 0, width: '2px', background: '#222' }}></div>
                        )}
                        {/* Icon */}
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', zIndex: 2, flexShrink: 0 }}>
                          <History size={14} />
                        </div>
                        {/* Content */}
                        <div style={{ paddingTop: '5px' }}>
                          <div style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{act.action}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>{new Date(act.createdAt).toLocaleString()} &bull; by {act.adminId ? 'Admin' : 'System'}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No activity history.</div>
                  )}
                </div>
              )}

              {activeTab === 'Email' && (
                <div>
                  <form onSubmit={handleSendEmail}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Subject</label>
                      <input 
                        required
                        value={emailSubject}
                        onChange={e => setEmailSubject(e.target.value)}
                        placeholder="e.g. Following up on your CS Vertex inquiry"
                        style={{ width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '6px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>Message Body (HTML Supported)</label>
                      <textarea 
                        required
                        value={emailBody}
                        onChange={e => setEmailBody(e.target.value)}
                        placeholder="Write your email here..."
                        style={{ width: '100%', padding: '15px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '8px', minHeight: '200px', outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="submit" disabled={sendingEmail} style={{ padding: '10px 20px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} /> {sendingEmail ? 'Sending...' : 'Send Email'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}
