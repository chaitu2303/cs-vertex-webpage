"use client"

import React, { useState, useEffect } from 'react'
import { Pin, Download, ArrowRight, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function NoticeBoard({ announcements }: { announcements: any[] }) {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  
  useEffect(() => setMounted(true), [])

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.content.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  const pinned = filteredAnnouncements.filter(a => a.isPinned)
  const regular = filteredAnnouncements.filter(a => !a.isPinned)

  return (
    <div className="notice-board-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Search Bar */}
      <div className="notice-search" style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Search className="search-icon" size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
        <input 
          type="text" 
          placeholder="Search announcements..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            width: '100%', background: '#111', border: '1px solid #333', 
            borderRadius: '30px', padding: '14px 20px 14px 50px', 
            color: '#fff', fontSize: '15px', outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF5C2A'}
          onBlur={(e) => e.target.style.borderColor = '#333'}
        />
      </div>

      <div className="notice-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
        <AnimatePresence>
          {pinned.map((notice, i) => (
            <motion.div 
              key={notice.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              className="notice-card pinned group" 
              style={{ 
                background: 'rgba(255, 92, 42, 0.03)', border: '1px solid var(--acid)', 
                padding: '24px', borderRadius: '12px', position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(255, 92, 42, 0.1)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--acid)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ font: '10px var(--mono)', color: 'var(--acid)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,92,42,0.1)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pin size={12} strokeWidth={2} /> Pinned • {notice.category}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {mounted ? new Date(notice.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#fff', fontWeight: 600 }}>{notice.title}</h3>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6 }}>{notice.content}</p>
              {notice.fileUrl && (
                <a href={notice.fileUrl} download className="download-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', padding: '10px 20px', border: '1px solid #333', color: '#fff', textDecoration: 'none', fontSize: '13px', borderRadius: '8px', transition: '0.2s', background: '#1a1a1a' }}>
                  <Download size={14} strokeWidth={1.5} className="group-hover:text-[#FF5C2A]" /> Download Attachment
                </a>
              )}
            </motion.div>
          ))}

          {regular.map((notice, i) => (
            <motion.div 
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: (pinned.length + i) * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              className="notice-card group" 
              style={{ border: '1px solid #222', background: '#0d0d0d', padding: '24px', borderRadius: '12px', transition: 'all 0.3s ease' }}
              whileHover={{ y: -5, borderColor: '#444' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ font: '10px var(--mono)', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {notice.category}
                </span>
                <span style={{ fontSize: '12px', color: '#555' }}>
                  {mounted ? new Date(notice.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#eee', fontWeight: 500 }}>{notice.title}</h4>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5 }}>{notice.content}</p>
              {notice.fileUrl && (
                <a href={notice.fileUrl} download style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '15px', color: 'var(--acid)', textDecoration: 'none', fontSize: '13px', transition: '0.2s' }}>
                  Download Attachment <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredAnnouncements.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            No announcements found matching "{search}"
          </motion.div>
        )}
      </div>
    </div>
  )
}
