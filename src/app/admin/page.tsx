"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  FolderKanban, Users, CheckCircle, FileText,
  DollarSign, Activity, Globe, MessageSquare,
  GraduationCap, Briefcase, Bell, TrendingUp,
  ArrowUpRight, ArrowDownRight, RefreshCw, ExternalLink,
  Ticket, UserCheck, BookOpen, Award, Radio
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts'
import { getAdminAnalytics } from './actions'

const COLORS = ['#FF6B2C', '#5c7df8', '#22C55E', '#A855F7', '#EAB308', '#06B6D4']

// Animated number counter
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    let start = 0
    const end = value
    const duration = 1200
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{prefix}{display.toLocaleString()}{suffix}</>
}

// 3D Particle Canvas
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    let raf: number
    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 107, 44, ${p.opacity})`
        ctx.fill()
      })
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 107, 44, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

// 3D rotating ring loader
function PulseRing({ size = 48, color = '#FF6B2C', value = 0, max = 100 }: { size?: number; color?: string; value?: number; max?: number }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100)
  const r = size / 2 - 4
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ - (circ * pct) / 100}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease' }}
      />
    </svg>
  )
}

type AnalyticsData = Awaited<ReturnType<typeof getAdminAnalytics>>

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [time, setTime] = useState(new Date())
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    setRefreshing(true)
    const result = await getAdminAnalytics()
    setData(result)
    setLastRefresh(new Date())
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    loadData()
    const timer = setInterval(() => setTime(new Date()), 1000)
    const autoRefresh = setInterval(() => loadData(), 60000) // auto refresh every 60s
    return () => { clearInterval(timer); clearInterval(autoRefresh) }
  }, [loadData])

  const TABS = ['Overview', 'CRM & Sales', 'Academy', 'Support', 'Security Log']

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'approved': case 'open': case 'completed': return '#22C55E'
      case 'pending': case 'in_progress': return '#F59E0B'
      case 'closed': case 'rejected': return '#EF4444'
      default: return '#888'
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,107,44,0.2)', borderRadius: '50%', animation: 'spin 3s linear infinite' }} />
        <div style={{ position: 'absolute', inset: '8px', border: '2px solid rgba(255,107,44,0.4)', borderRadius: '50%', animation: 'spin 2s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: '20px', background: '#FF6B2C', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <p style={{ color: '#666', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading Analytics…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )

  if (!data) return null

  const overviewCards = [
    {
      label: 'Total Page Views', value: data.viewsCount, growth: data.viewsGrowth,
      icon: Globe, color: '#FF6B2C', link: '/admin/content', suffix: '',
      sub: `${data.uniqueVisitorsCount} unique sessions`
    },
    {
      label: 'Registered Clients', value: data.customerCount, growth: null,
      icon: Users, color: '#5c7df8', link: '/admin/customers', suffix: '',
      sub: 'All portal users'
    },
    {
      label: 'Active Projects', value: data.activeClientProjects, growth: null,
      icon: FolderKanban, color: '#22C55E', link: '/admin/projects', suffix: '',
      sub: `${data.clientProjectsCount} total tracked`
    },
    {
      label: 'Quotes Generated', value: data.quotesCount, growth: null,
      icon: FileText, color: '#A855F7', link: '/admin/quotes', suffix: '',
      sub: `${data.pendingQuotesCount} pending review`
    },
    {
      label: 'Certificates Issued', value: data.certificatesCount, growth: null,
      icon: Award, color: '#EAB308', link: '/admin/certificates', suffix: '',
      sub: 'Verified on-chain'
    },
    {
      label: 'Support Tickets', value: data.supportTicketsCount, growth: null,
      icon: Ticket, color: '#06B6D4', link: '/admin/tickets', suffix: '',
      sub: `${data.openTicketsCount} open right now`
    },
  ]

  return (
    <div style={{ paddingBottom: '60px' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(255,107,44,0.2)} 50%{box-shadow:0 0 40px rgba(255,107,44,0.4)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .card-3d { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-3d:hover { transform: translateY(-4px) rotateX(2deg); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .tab-btn { transition: all 0.2s ease; }
        .stat-card { animation: slideUp 0.5s ease forwards; }
        .glow-ring { animation: glow 3s ease-in-out infinite; }
        .float-icon { animation: float 4s ease-in-out infinite; }
        .badge-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      `}</style>

      {/* ── Header Banner ── */}
      <div style={{
        marginBottom: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, #0d0d0d 0%, #111 50%, #0a0a0a 100%)',
        border: '1px solid #1e1e1e', padding: '28px 32px', position: 'relative', overflow: 'hidden', minHeight: '140px'
      }} className="glow-ring">
        <ParticleField />
        {/* Gradient orb */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(255,107,44,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ padding: '3px 10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '20px', fontSize: '11px', color: '#22C55E', fontWeight: 600, letterSpacing: '0.06em' }}>
                ● LIVE DASHBOARD
              </span>
              <span style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace' }}>
                Updated: {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
              CS Vertex <span style={{ color: '#FF6B2C' }}>Command Center</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Real-time analytics and operations management</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Live clock */}
            <div style={{ background: 'rgba(255,107,44,0.08)', border: '1px solid rgba(255,107,44,0.2)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#FF6B2C', fontFamily: 'monospace', lineHeight: 1 }}>
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
            {/* Refresh */}
            <button
              onClick={loadData}
              disabled={refreshing}
              style={{
                background: refreshing ? 'rgba(255,107,44,0.05)' : 'rgba(255,107,44,0.1)',
                border: '1px solid rgba(255,107,44,0.25)', borderRadius: '12px',
                padding: '10px 16px', color: '#FF6B2C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600
              }}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Syncing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '5px', width: 'fit-content', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            className="tab-btn"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === tab ? '#FF6B2C' : 'transparent',
              color: activeTab === tab ? '#fff' : '#555',
              boxShadow: activeTab === tab ? '0 4px 14px rgba(255,107,44,0.3)' : 'none',
            }}
          >{tab}</button>
        ))}
      </div>

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {overviewCards.map((card, i) => (
              <Link key={card.label} href={card.link} style={{ textDecoration: 'none' }}>
                <div
                  className="card-3d stat-card"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: 'linear-gradient(145deg, #0d0d0d, #111)',
                    border: `1px solid #1e1e1e`,
                    borderRadius: '18px', padding: '22px', cursor: 'pointer', position: 'relative', overflow: 'hidden'
                  }}
                >
                  {/* Accent glow */}
                  <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: `radial-gradient(circle, ${card.color}20, transparent 70%)`, pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div
                      className="float-icon"
                      style={{ animationDelay: `${i * 0.3}s`, padding: '10px', background: `${card.color}15`, borderRadius: '12px', border: `1px solid ${card.color}25` }}
                    >
                      <card.icon size={20} style={{ color: card.color }} />
                    </div>
                    {card.growth !== null && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '20px',
                        background: card.growth >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: card.growth >= 0 ? '#22C55E' : '#EF4444',
                      }}>
                        {card.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(card.growth)}%
                      </span>
                    )}
                  </div>
                  <PulseRing size={40} color={card.color} value={card.value} max={Math.max(card.value * 2, 10)} />
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      <AnimatedCounter value={card.value} suffix={card.suffix} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', fontWeight: 500 }}>{card.label}</div>
                    <div style={{ fontSize: '11px', color: '#444', marginTop: '3px' }}>{card.sub}</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                    <ExternalLink size={12} style={{ color: '#333' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Courses', value: data.courseCount, color: '#A855F7', icon: BookOpen },
              { label: 'Workshops', value: data.workshopCount, color: '#06B6D4', icon: GraduationCap },
              { label: 'Internship Apps', value: data.internshipApplicationsCount, color: '#22C55E', icon: Briefcase },
              { label: 'Job Apps', value: data.jobApplicationsCount, color: '#EAB308', icon: UserCheck },
              { label: 'Testimonials', value: data.testimonialCount, color: '#F472B6', icon: MessageSquare },
              { label: 'Consultations', value: data.consultationCount, color: '#34D399', icon: Radio },
              { label: 'Notify Me', value: data.notifyMeCount, color: '#FB923C', icon: Bell },
              { label: 'Announcements', value: data.announcementsCount, color: '#60A5FA', icon: Activity },
            ].map((m, i) => (
              <div key={m.label} style={{
                background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '14px',
                padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px',
                transition: 'border-color 0.2s', cursor: 'default'
              }}>
                <m.icon size={16} style={{ color: m.color }} />
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                  <AnimatedCounter value={m.value} />
                </div>
                <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Traffic Chart + Live Feed */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px', minHeight: '360px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Website Traffic — Last 7 Days</h3>
                  <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Real page view counts from analytics table</p>
                </div>
                <span style={{ fontSize: '12px', color: '#FF6B2C', background: 'rgba(255,107,44,0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(255,107,44,0.2)' }}>
                  Live Data
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.trafficTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                  <XAxis dataKey="day" stroke="#333" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#333" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #222', borderRadius: '10px', fontSize: '13px' }}
                    itemStyle={{ color: '#FF6B2C', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#FF6B2C" strokeWidth={2.5} fillOpacity={1} fill="url(#tg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Live Audit Feed */}
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Live Activity Log</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#22C55E' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  Real-time
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '300px', overflowY: 'auto' }}>
                {data.auditLogs.length > 0 ? data.auditLogs.map((log, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    background: i === 0 ? 'rgba(255,107,44,0.04)' : 'transparent',
                    borderLeft: i === 0 ? '2px solid #FF6B2C' : '2px solid transparent',
                    transition: 'background 0.2s'
                  }}>
                    <Activity size={13} style={{ color: '#FF6B2C', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#ccc', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.action}
                      </div>
                      <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{log.resource}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#333', fontFamily: 'monospace', flexShrink: 0 }}>{log.time}</span>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', color: '#444', padding: '40px 0', fontSize: '13px' }}>No activity logged yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Quotes */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Recent Quotes</h3>
              <Link href="/admin/quotes" style={{ fontSize: '12px', color: '#FF6B2C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View all <ExternalLink size={11} />
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Client', 'Service', 'Budget', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#444', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #111' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentQuotes.length > 0 ? data.recentQuotes.map((q, i) => (
                    <tr key={q.id} style={{ borderBottom: '1px solid #0d0d0d' }}>
                      <td style={{ padding: '12px', color: '#ccc', fontWeight: 500 }}>{q.name}</td>
                      <td style={{ padding: '12px', color: '#888' }}>{q.service}</td>
                      <td style={{ padding: '12px', color: '#FF6B2C', fontWeight: 600 }}>{q.budget}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: `${getStatusColor(q.status)}15`, color: getStatusColor(q.status), padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                          {q.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#444', fontSize: '12px' }}>{q.time}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#444' }}>No quotes yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CRM & SALES TAB ══════════ */}
      {activeTab === 'CRM & Sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Funnel stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Quotes', value: data.quotesCount, color: '#FF6B2C' },
              { label: 'Pending Review', value: data.pendingQuotesCount, color: '#F59E0B' },
              { label: 'Approved', value: data.approvedQuotesCount, color: '#22C55E' },
              { label: 'Total Clients', value: data.customerCount, color: '#5c7df8' },
              { label: 'Consultations', value: data.consultationCount, color: '#A855F7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: s.color }}>
                  <AnimatedCounter value={s.value} />
                </div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quote funnel chart */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px', height: '320px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>Quote Conversion Pipeline</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart
                data={[
                  { name: 'Total Quotes', value: data.quotesCount, fill: '#FF6B2C' },
                  { name: 'Pending', value: data.pendingQuotesCount, fill: '#F59E0B' },
                  { name: 'Approved', value: data.approvedQuotesCount, fill: '#22C55E' },
                ]}
                layout="vertical" margin={{ left: 10, right: 30 }}
              >
                <XAxis type="number" stroke="#222" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#555" fontSize={12} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #222', borderRadius: '10px' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {[{ fill: '#FF6B2C' }, { fill: '#F59E0B' }, { fill: '#22C55E' }].map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent customers table */}
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Recent Clients</h3>
              <Link href="/admin/customers" style={{ fontSize: '12px', color: '#FF6B2C', textDecoration: 'none' }}>View all →</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Company', 'Joined'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#444', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentCustomers.length > 0 ? data.recentCustomers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #0d0d0d' }}>
                    <td style={{ padding: '12px', color: '#ccc', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '12px', color: '#888' }}>{c.email}</td>
                    <td style={{ padding: '12px', color: '#666' }}>{c.company}</td>
                    <td style={{ padding: '12px', color: '#444', fontSize: '12px' }}>{c.time}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#444' }}>No clients yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ ACADEMY TAB ══════════ */}
      {activeTab === 'Academy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Live Courses', value: data.courseCount, color: '#A855F7', icon: BookOpen },
              { label: 'Workshops', value: data.workshopCount, color: '#06B6D4', icon: GraduationCap },
              { label: 'Certificates Issued', value: data.certificatesCount, color: '#EAB308', icon: Award },
              { label: 'Internship Applications', value: data.internshipApplicationsCount, color: '#22C55E', icon: Briefcase },
              { label: 'Job Applications', value: data.jobApplicationsCount, color: '#FF6B2C', icon: UserCheck },
            ].map(m => (
              <div key={m.label} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '22px' }}>
                <m.icon size={22} style={{ color: m.color, marginBottom: '12px' }} />
                <div style={{ fontSize: '32px', fontWeight: 800, color: m.color }}>
                  <AnimatedCounter value={m.value} />
                </div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px', height: '320px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>Academy Overview</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart
                data={[
                  { name: 'Courses', value: data.courseCount },
                  { name: 'Workshops', value: data.workshopCount },
                  { name: 'Internship Apps', value: data.internshipApplicationsCount },
                  { name: 'Job Apps', value: data.jobApplicationsCount },
                  { name: 'Certificates', value: data.certificatesCount },
                ]}
                margin={{ left: -20, right: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                <XAxis dataKey="name" stroke="#333" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#333" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #222', borderRadius: '10px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ══════════ SUPPORT TAB ══════════ */}
      {activeTab === 'Support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Tickets', value: data.supportTicketsCount, color: '#06B6D4' },
              { label: 'Open Tickets', value: data.openTicketsCount, color: '#EF4444' },
              { label: 'Notifications Sent', value: data.notificationCount, color: '#A855F7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '22px' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: s.color }}>
                  <AnimatedCounter value={s.value} />
                </div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Recent Support Tickets</h3>
              <Link href="/admin/tickets" style={{ fontSize: '12px', color: '#FF6B2C', textDecoration: 'none' }}>View all →</Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Subject', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#444', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentTickets.length > 0 ? data.recentTickets.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #0d0d0d' }}>
                    <td style={{ padding: '12px', color: '#ccc', fontWeight: 500 }}>{t.subject}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: `${getStatusColor(t.status)}15`, color: getStatusColor(t.status), padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#444', fontSize: '12px' }}>{t.time}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#444' }}>No tickets yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ SECURITY LOG TAB ══════════ */}
      {activeTab === 'Security Log' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '18px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: 0 }}>Admin Audit Log</h3>
                <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>All administrative actions are recorded in real-time</p>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#22C55E', background: 'rgba(34,197,94,0.08)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s ease-in-out infinite' }} />
                System Active
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Action', 'Resource', 'Admin', 'IP Address', 'Time'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#444', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #111', background: '#080808' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.auditLogs.length > 0 ? data.auditLogs.map((log, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #0d0d0d', background: i === 0 ? 'rgba(255,107,44,0.02)' : 'transparent' }}>
                      <td style={{ padding: '12px 14px', color: '#ccc', fontWeight: 500 }}>{log.action}</td>
                      <td style={{ padding: '12px 14px', color: '#888' }}>{log.resource}</td>
                      <td style={{ padding: '12px 14px', color: '#666' }}>{log.admin}</td>
                      <td style={{ padding: '12px 14px', color: '#444', fontFamily: 'monospace', fontSize: '12px' }}>{log.ipAddress}</td>
                      <td style={{ padding: '12px 14px', color: '#444', fontSize: '12px' }}>{log.time}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#444' }}>
                        No admin actions have been logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System health */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'System Uptime', value: '99.99%', color: '#22C55E' },
              { label: 'DB Status', value: 'Online', color: '#22C55E' },
              { label: 'Auth Layer', value: 'Active', color: '#22C55E' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
