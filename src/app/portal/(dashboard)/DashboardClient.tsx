"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { logout, updateProfile } from '../actions'

type DashboardClientProps = {
  user: any
  customer: any
  quotes: any[]
  projects: any[]
  notifications: any[]
}

export default function DashboardClient({ user, customer, quotes, projects, notifications }: DashboardClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    company: customer?.company || '',
    phone: customer?.phone || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('company', formData.company)
    fd.append('phone', formData.phone)
    await updateProfile(fd)
    setIsEditing(false)
    setSaving(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: '#eee', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', animation: 'fadeInDown 0.6s ease-out' }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '8px', color: '#fff', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Welcome back, <span style={{ color: 'var(--acid)' }}>{customer?.name || user.email?.split('@')[0]}</span>
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '15px' }}>Here is what's happening with your projects today.</p>
        </div>
        
        <form action={logout}>
           <button 
             type="submit" 
             className="signout-btn"
             style={{ 
               padding: '10px 24px', 
               background: 'rgba(255, 68, 68, 0.1)', 
               border: '1px solid rgba(255, 68, 68, 0.3)', 
               color: '#ff4444', 
               borderRadius: '8px', 
               cursor: 'pointer',
               fontWeight: 500,
               transition: 'all 0.2s',
             }}
             onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
             onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'; e.currentTarget.style.transform = 'none' }}
           >
             Sign Out
           </button>
        </form>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '50px' }}>
        
        <div className="glass-card kpi-card" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#888', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Total Quotes</h3>
            <div style={{ padding: '8px', background: 'rgba(212, 255, 62, 0.1)', borderRadius: '8px', color: 'var(--acid)' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '15px 0 0', color: '#fff' }}>{quotes.length}</p>
        </div>

        <div className="glass-card kpi-card" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#888', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Active Projects</h3>
            <div style={{ padding: '8px', background: 'rgba(62, 142, 255, 0.1)', borderRadius: '8px', color: '#3e8eff' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '15px 0 0', color: '#fff' }}>{projects.filter(p => p.status === 'Active').length}</p>
        </div>

        <div className="glass-card kpi-card" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#888', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Unread Notifications</h3>
            <div style={{ padding: '8px', background: 'rgba(255, 92, 42, 0.1)', borderRadius: '8px', color: '#ff5c2a' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '15px 0 0', color: '#fff' }}>{notifications.filter(n => !n.isRead).length}</p>
        </div>

      </div>

      <div className="dashboard-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Projects Section */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.4s' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: '#fff' }}>Project Progress</h2>
            </div>
            <div style={{ padding: '24px' }}>
              {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ marginBottom: '16px', opacity: 0.5 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  <p>No active projects yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {projects.map(p => (
                    <div key={p.id} className="project-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontWeight: 600, fontSize: '16px', color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--acid)', background: 'rgba(212, 255, 62, 0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>{p.status}</div>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--acid), #a4e600)', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: '#888', marginTop: '8px', fontWeight: 500 }}>{p.progress}% Complete</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quotes Section */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.5s' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: '#fff' }}>Recent Quotes</h2>
              <Link href="/#quote" className="btn-outline">Request Quote</Link>
            </div>
            <div style={{ padding: '24px' }}>
              {quotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#666' }}>No quotes found.</div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {quotes.slice(0, 5).map(q => (
                    <div key={q.id} className="quote-item">
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{q.service}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>Budget: {q.budget || 'N/A'}</div>
                      </div>
                      <div style={{ padding: '6px 12px', background: q.status === 'Approved' ? 'rgba(68, 255, 68, 0.1)' : q.status === 'Rejected' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', fontSize: '12px', color: q.status === 'Approved' ? '#44ff44' : q.status === 'Rejected' ? '#ff4444' : '#fff', fontWeight: 500 }}>
                        {q.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Premium Analytics Section */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.55s' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: '#fff' }}>Project Activity Analytics</h2>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Your engagement and project progress metrics</p>
            </div>
            <div style={{ padding: '40px 24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '10px' }}>
              {[40, 65, 30, 80, 50, 95, 70].map((val, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', padding: '4px' }}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: `${val}%`,
                        background: 'linear-gradient(180deg, var(--acid), rgba(212, 255, 62, 0.2))', 
                        borderRadius: '4px',
                        animation: `growUp 1s cubic-bezier(0.1, 0.8, 0.2, 1) ${0.6 + i * 0.1}s both`,
                        transformOrigin: 'bottom'
                      }} 
                      className="bar-chart-fill"
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#888' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Profile Section */}
          <div className="glass-card profile-card" style={{ animationDelay: '0.6s' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: '#fff' }}>Profile Details</h2>
               {!isEditing && (
                 <button onClick={() => setIsEditing(true)} className="btn-text">Edit</button>
               )}
             </div>

             {isEditing ? (
               <form onSubmit={handleSaveProfile} className="profile-form">
                 <div className="form-group">
                   <label>Full Name</label>
                   <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="form-group">
                   <label>Company</label>
                   <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                 </div>
                 <div className="form-group">
                   <label>Phone</label>
                   <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                 </div>
                 <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                   <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                   <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">Cancel</button>
                 </div>
               </form>
             ) : (
               <div className="profile-details">
                 <div className="detail-row">
                   <span className="label">Email</span>
                   <span className="value">{user.email}</span>
                 </div>
                 <div className="detail-row">
                   <span className="label">Name</span>
                   <span className="value">{customer?.name || '-'}</span>
                 </div>
                 <div className="detail-row">
                   <span className="label">Company</span>
                   <span className="value">{customer?.company || '-'}</span>
                 </div>
                 <div className="detail-row">
                   <span className="label">Phone</span>
                   <span className="value">{customer?.phone || '-'}</span>
                 </div>
               </div>
             )}
          </div>

          {/* Notifications Section */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.7s' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600, color: '#fff' }}>Recent Notifications</h2>
            </div>
            <div style={{ padding: '0' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>All caught up!</div>
              ) : (
                <div>
                  {notifications.map(n => (
                    <div key={n.id} className="notification-item" style={{ background: n.isRead ? 'transparent' : 'rgba(255,92,42,0.05)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.isRead ? 'transparent' : '#ff5c2a', marginTop: '6px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{n.title}</div>
                        <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.5 }}>{n.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        .glass-card {
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          animation: fadeInUp 0.6s ease-out both;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .kpi-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .project-item, .quote-item {
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .project-item:hover, .quote-item:hover {
          background: rgba(255,255,255,0.04);
          transform: scale(1.01);
        }
        .quote-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-item {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 15px;
          transition: background 0.2s;
        }
        .notification-item:hover {
          background: rgba(255,255,255,0.02) !important;
        }
        .notification-item:last-child {
          border-bottom: none;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-row .label {
          color: #888;
          font-size: 14px;
        }
        .detail-row .value {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .btn-text {
          background: transparent;
          border: none;
          color: var(--acid);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-text:hover { opacity: 0.8; }

        .btn-outline {
          padding: 8px 16px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.4);
        }

        .btn-primary {
          padding: 8px 16px;
          border: none;
          background: var(--acid);
          color: #000;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 255, 62, 0.3);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          color: #aaa;
          margin-bottom: 6px;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--acid);
        }
      `}</style>
    </div>
  )
}
