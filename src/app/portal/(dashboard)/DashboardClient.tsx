"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { updateProfile } from '../actions'
import {
  FolderKanban, FileText, Bell, Activity,
  ArrowRight, ChevronRight
} from 'lucide-react'

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

  const unreadCount = notifications.filter(n => !n.isRead).length
  const activeProjects = projects.filter(p => p.status === 'Active')

  const kpiCards = [
    { label: 'Active Projects', value: activeProjects.length, icon: FolderKanban, color: '#3b82f6', href: '/portal/projects' },
    { label: 'Total Quotes', value: quotes.length, icon: FileText, color: '#FF5A2A', href: '/portal/quotes' },
    { label: 'Notifications', value: unreadCount, icon: Bell, color: '#f59e0b', href: '/portal/notifications' },
    { label: 'Learning', value: 0, icon: Activity, color: '#10b981', href: '/portal/learning' },
  ]

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome back, <span style={{ color: '#FF5A2A' }}>{customer?.name || user.email?.split('@')[0]}</span>
        </h1>
        <p style={{ color: '#555', marginTop: '6px', fontSize: '14px' }}>Here is what's happening with your projects today.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpiCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', margin: '0 0 12px' }}>{label}</p>
                  <p style={{ fontSize: '36px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1 }}>{value}</p>
                </div>
                <div style={{ padding: '10px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="dash-grid">

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Project Progress */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Project Progress</h2>
              <Link href="/portal/projects" className="view-all-link">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="dash-card-body">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FolderKanban size={28} style={{ color: '#FF5A2A' }} />
                  </div>
                  <h3>No active projects yet.</h3>
                  <p>Your projects will appear here once our team sets them up for you.</p>
                  <Link href="/portal/request-project" className="action-btn" style={{ background: '#FF5A2A', padding: '12px 24px', borderRadius: '8px', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 600, marginTop: '16px' }}>Request Project <ArrowRight size={14} /></Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {projects.map(p => (
                    <div key={p.id} className="project-row">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>{p.name}</span>
                        <span style={{ fontSize: '12px', color: '#FF5A2A', fontWeight: 600 }}>{p.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: 'linear-gradient(90deg, #FF5A2A, #ff8c00)', borderRadius: '2px', transition: 'width 1s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#444' }}>{p.status}</span>
                        <Link href="/portal/projects" style={{ fontSize: '11px', color: '#FF5A2A', textDecoration: 'none' }}>View Details →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Quotes */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Recent Quotes</h2>
              <Link href="/portal/quotes" className="view-all-link">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              {quotes.length === 0 ? (
                <div style={{ padding: '24px', color: '#555', fontSize: '13px', textAlign: 'center' }}>
                  No quotes submitted yet. <Link href="/portal/quotes" style={{ color: '#FF5A2A' }}>Submit your first quote →</Link>
                </div>
              ) : (
                quotes.slice(0, 4).map(q => (
                  <Link key={q.id} href={`/portal/quotes/${q.id}`} style={{ textDecoration: 'none' }}>
                    <div className="table-row-link">
                      <div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{q.service}</div>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{new Date(q.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`status-badge ${q.status?.toLowerCase().replace(' ', '-')}`}>{q.status}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Client Profile */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Client Profile</h2>
              <Link href="/portal/profile" className="edit-btn" style={{ textDecoration: 'none' }}>Edit</Link>
            </div>
            <div className="dash-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { icon: '👤', label: customer?.name || 'Not set' },
                  { icon: '🏢', label: customer?.company || 'Not set' },
                  { icon: '📞', label: customer?.phone || 'Not provided' },
                ].map(({ icon, label }, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #111' }}>
                    <span style={{ fontSize: '14px' }}>{icon}</span>
                    <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Notifications</h2>
              <Link href="/portal/notifications" className="view-all-link">View All <ChevronRight size={14} /></Link>
            </div>
            <div className="dash-card-body" style={{ padding: 0 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', color: '#555', fontSize: '13px', textAlign: 'center' }}>All caught up! No new notifications.</div>
              ) : (
                notifications.slice(0, 4).map(n => (
                  <Link key={n.id} href="/portal/notifications" style={{ textDecoration: 'none' }}>
                    <div className="table-row-link">
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.isRead ? '#333' : '#FF5A2A', flexShrink: 0, marginTop: '5px' }} />
                        <div>
                          <div style={{ fontSize: '13px', color: '#ededed', fontWeight: n.isRead ? 400 : 600 }}>{n.title}</div>
                          <div style={{ fontSize: '12px', color: '#555', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .kpi-card {
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .kpi-card:hover {
          border-color: rgba(255,90,42,0.25);
          transform: translateY(-2px);
        }
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 20px;
        }
        @media (max-width: 1000px) {
          .dash-grid { grid-template-columns: 1fr; }
        }
        .dash-card {
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 12px;
          overflow: hidden;
        }
        .dash-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #111;
        }
        .dash-card-header h2 {
          font-size: 14px;
          font-weight: 600;
          color: #ededed;
          margin: 0;
        }
        .dash-card-body {
          padding: 20px;
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }
        .view-all-link:hover { color: #FF5A2A; }
        .edit-btn {
          font-size: 12px;
          color: #FF5A2A;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .empty-state {
          text-align: center;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .empty-icon {
          width: 56px; height: 56px; border-radius: 12px;
          background: rgba(255,90,42,0.08);
          border: 1px solid rgba(255,90,42,0.15);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .empty-state h3 { font-size: 15px; color: '#ededed'; margin: 0 0 8px; }
        .empty-state p { font-size: 13px; color: '#555'; margin: 0 0 16px; line-height: 1.5; }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: #FF5A2A;
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .action-btn:hover { background: #e04a1e; }
        .project-row {
          padding: 12px 0;
          border-bottom: 1px solid #111;
        }
        .project-row:last-child { border-bottom: none; }
        .table-row-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-bottom: 1px solid #0d0d0d;
          transition: background 0.15s;
          cursor: pointer;
        }
        .table-row-link:hover { background: rgba(255,255,255,0.02); }
        .table-row-link:last-child { border-bottom: none; }
        .status-badge {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
          white-space: nowrap;
        }
        .status-badge.pending, .status-badge.pending-review { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .status-badge.approved, .status-badge.completed { background: rgba(16,185,129,0.1); color: #10b981; }
        .status-badge.rejected { background: rgba(239,68,68,0.1); color: #ef4444; }
        .status-badge.in-progress { background: rgba(59,130,246,0.1); color: #3b82f6; }
      `}</style>
    </div>
  )
}
