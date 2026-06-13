"use client"

import React from 'react'

export function NoticeBoard({ announcements }: { announcements: any[] }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const pinned = announcements.filter(a => a.isPinned)
  const regular = announcements.filter(a => !a.isPinned)

  return (
    <div className="notice-board" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>
      
      {/* Main Board */}
      <div className="board-main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {pinned.map(notice => (
          <div key={notice.id} className="notice-card pinned" style={{ background: 'rgba(255, 92, 42, 0.05)', border: '1px solid var(--acid)', padding: '30px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ font: '10px var(--mono)', color: 'var(--acid)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,92,42,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                📌 Pinned • {notice.category}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {mounted ? new Date(notice.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '10px', color: '#fff' }}>{notice.title}</h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6 }}>{notice.content}</p>
            {notice.fileUrl && (
              <a href={notice.fileUrl} download className="download-btn" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', border: '1px solid #444', color: '#fff', textDecoration: 'none', fontSize: '13px', borderRadius: '4px' }}>
                ↓ Download Brochure / Details
              </a>
            )}
          </div>
        ))}

        {regular.map(notice => (
          <div key={notice.id} className="notice-card" style={{ borderBottom: '1px solid #222', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ font: '10px var(--mono)', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {notice.category}
              </span>
              <span style={{ fontSize: '12px', color: '#555' }}>
                {mounted ? new Date(notice.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#eee' }}>{notice.title}</h4>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5 }}>{notice.content}</p>
            {notice.fileUrl && (
              <a href={notice.fileUrl} download style={{ display: 'inline-block', marginTop: '15px', color: 'var(--acid)', textDecoration: 'none', fontSize: '13px' }}>
                Download Attachment →
              </a>
            )}
          </div>
        ))}
      </div>


    </div>
  )
}
