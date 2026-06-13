"use client"

import React, { useState, useRef } from 'react'
import { uploadMedia, deleteMedia } from './actions'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

export default function MediaClient({ initialFiles }: { initialFiles: any[] }) {
  const [files, setFiles] = useState(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await uploadMedia(formData)
    if (res.success) {
      setFiles([{ name: file.name, url: res.url }, ...files])
    } else {
      alert('Upload failed: ' + res.error)
    }
    setUploading(false)
  }

  const handleDelete = async (e: React.MouseEvent, filename: string) => {
    e.stopPropagation() // Prevent triggering the copy-url click
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return
    
    setDeletingFile(filename)
    const res = await deleteMedia(filename)
    if (res.success) {
      setFiles(files.filter(f => f.name !== filename))
    } else {
      alert('Delete failed: ' + res.error)
    }
    setDeletingFile(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff' }}>Media Library</h2>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: 'none' }} 
            accept="image/*,video/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ 
              background: 'var(--acid)', 
              color: '#000', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontWeight: 600, 
              cursor: uploading ? 'not-allowed' : 'pointer', 
              border: 'none',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Uploading...' : '+ Upload File'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {files.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#111', borderRadius: '12px', color: '#666' }}>
            No media files found. Upload your first image!
          </div>
        ) : (
          files.map((f, i) => (
            <motion.div 
              key={f.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{ 
                background: '#111', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid #222',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + f.url)
                alert('URL copied to clipboard!')
              }}
            >
              <div style={{ height: '150px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img src={f.url} alt={f.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                
                <button
                  onClick={(e) => handleDelete(e, f.name)}
                  disabled={deletingFile === f.name}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(20, 20, 20, 0.8)',
                    border: '1px solid #333',
                    color: '#ff4444',
                    padding: '6px',
                    borderRadius: '6px',
                    cursor: deletingFile === f.name ? 'not-allowed' : 'pointer',
                    opacity: deletingFile === f.name ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(4px)'
                  }}
                  onMouseOver={(e) => { if (deletingFile !== f.name) e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)' }}
                  onMouseOut={(e) => { if (deletingFile !== f.name) e.currentTarget.style.background = 'rgba(20, 20, 20, 0.8)' }}
                  title="Delete media"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ padding: '12px', borderTop: '1px solid #222' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#ccc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {f.name}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#666' }}>Click to copy URL</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
