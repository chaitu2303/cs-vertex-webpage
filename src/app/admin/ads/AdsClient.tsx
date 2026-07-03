"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function AdsClient({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState(initialAds)
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Hero Posters & Advertisements</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ background: 'var(--acid)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
        >
          {isAdding ? 'Cancel' : '+ Add Poster'}
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #222', marginBottom: '30px' }}
        >
          <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#fff' }}>Add New Poster</h3>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' }}>Title</label>
              <input type="text" placeholder="e.g. Summer Sale 2026" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' }}>Link URL</label>
              <input type="text" placeholder="https://" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' }}>Placement Area</label>
              <select style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', color: '#fff' }}>
                <option>Homepage Hero</option>
                <option>Sidebar</option>
                <option>Dashboard Banner</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#888', marginBottom: '6px' }}>Image URL</label>
              <input type="text" placeholder="https://..." style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>
          <button style={{ marginTop: '20px', background: '#fff', color: '#000', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', border: 'none' }}>
            Save Poster
          </button>
        </motion.div>
      )}

      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}>
            <tr>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500 }}>Poster Title</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500 }}>Placement</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>No posters added yet.</td>
              </tr>
            ) : (
              ads.map(ad => (
                <tr key={ad.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '16px', color: '#fff' }}>{ad.title}</td>
                  <td style={{ padding: '16px', color: '#ccc' }}>{ad.placementArea}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', background: ad.published ? 'rgba(68, 255, 68, 0.1)' : 'rgba(255,255,255,0.1)', color: ad.published ? '#44ff44' : '#888', borderRadius: '20px', fontSize: '12px' }}>
                      {ad.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--acid)', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
