'use client'

import React, { useEffect, useState } from 'react'

import { Mail, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react'

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/email-logs')
      const data = await res.json()
      if (data.data) {
        setLogs(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={24} />
          Email Delivery Logs
        </h1>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--acid)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Status</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Recipient</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Event / Template</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Subject</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Resend ID</th>
              <th style={{ padding: '16px', color: '#888', fontWeight: 500, fontSize: '14px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                  {loading ? 'Loading logs...' : 'No email logs found.'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {log.status === 'SENT' && <CheckCircle size={16} color="#10B981" />}
                      {log.status === 'FAILED' && <AlertCircle size={16} color="#EF4444" />}
                      {log.status === 'PENDING' && <Clock size={16} color="#F59E0B" />}
                      <span style={{ fontSize: '14px', 
                        color: log.status === 'SENT' ? '#10B981' : log.status === 'FAILED' ? '#EF4444' : '#F59E0B'
                      }}>
                        {log.status}
                      </span>
                    </div>
                    {log.errorMessage && (
                      <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', maxWidth: '200px', wordWrap: 'break-word' }}>
                        {log.errorMessage}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#ddd' }}>{log.to}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#bbb' }}>
                    <span style={{ background: '#222', padding: '4px 8px', borderRadius: '4px' }}>
                      {log.templateName || 'custom'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#ddd' }}>{log.subject}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#888', fontFamily: 'monospace' }}>
                    {log.resendId || '-'}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#888' }}>
                    {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
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
