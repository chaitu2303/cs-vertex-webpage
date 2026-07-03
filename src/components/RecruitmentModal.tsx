"use client"

import React, { useState, useEffect } from 'react'
import { Briefcase, X, CheckCircle, Upload } from 'lucide-react'

type ModalType = 'job' | 'internship'

interface RecruitmentModalProps {
  isOpen: boolean
  onClose: () => void
  type: ModalType
}

export function RecruitmentModal({ isOpen, onClose, type }: RecruitmentModalProps) {
  const [openings, setOpenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'loading' | 'no-openings' | 'form' | 'success'>('loading')
  const [formData, setFormData] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setView('loading')
      setFormData({})
      // Fetch open positions
      const endpoint = type === 'job' ? '/api/recruitment/jobs' : '/api/recruitment/internships'
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setOpenings(data)
            setView('form')
            // Pre-select first option if needed, but let's let them select
          } else {
            setView('no-openings')
          }
        })
        .catch(() => setView('no-openings'))
        .finally(() => setLoading(false))
    }
  }, [isOpen, type])

  if (!isOpen) return null

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/recruitment/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: type === 'job' ? 'Job' : 'Internship'
        })
      })
      setView('success')
    } catch (error) {
      console.error(error)
    }
    setSubmitting(false)
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const endpoint = type === 'job' ? '/api/recruitment/jobs' : '/api/recruitment/internships'
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setView('success')
    } catch (error) {
      console.error(error)
    }
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>

        {view === 'loading' && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading opportunities...</p>
          </div>
        )}

        {view === 'success' && (
          <div className="success-state">
            <CheckCircle size={64} color="#FF6A2A" style={{ marginBottom: '20px' }} />
            <h2>Application Submitted Successfully</h2>
            <p>Thank you for your interest in CS Vertex. Our recruitment team will review your application and contact you if shortlisted.</p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        )}

        {view === 'no-openings' && (
          <div className="no-openings-state">
            <Briefcase size={48} color="#FF6A2A" style={{ marginBottom: '20px' }} />
            <h2>{type === 'job' ? 'No Current Openings' : 'Internship Applications Closed'}</h2>
            <p>
              {type === 'job' 
                ? "We currently don't have any active job openings. Please check back later or follow our social media pages." 
                : "We are not accepting internship applications at the moment. Please visit again soon."}
            </p>
            
            <form onSubmit={handleNotifySubmit} className="notify-form">
              <h3>Notify Me</h3>
              <p className="sub-text">Leave your details and we'll let you know when roles open up.</p>
              <input required type="text" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone Number (Optional)" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input required type="text" placeholder="Interested Role (e.g. Frontend Developer)" onChange={e => setFormData({...formData, interestedRole: e.target.value})} />
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Notify Me'}
              </button>
            </form>
          </div>
        )}

        {view === 'form' && (
          <div className="form-state">
            <h2>{type === 'job' ? 'Apply for a Position' : 'Internship Application'}</h2>
            <form onSubmit={handleApplicationSubmit} className="application-form">
              
              <div className="form-group">
                <label>Select Role *</label>
                <select required onChange={e => setFormData({...formData, [type === 'job' ? 'careerPositionId' : 'internshipId']: e.target.value})}>
                  <option value="">-- Choose Role --</option>
                  {openings.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input required type="text" onChange={e => setFormData({...formData, fullName: e.target.value})} /></div>
                <div className="form-group"><label>Email *</label><input required type="email" onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              </div>
              
              <div className="form-row">
                <div className="form-group"><label>Phone *</label><input required type="tel" onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                {type === 'job' && <div className="form-group"><label>Location</label><input type="text" onChange={e => setFormData({...formData, location: e.target.value})} /></div>}
              </div>

              {type === 'internship' && (
                <>
                  <div className="form-row">
                    <div className="form-group"><label>College *</label><input required type="text" onChange={e => setFormData({...formData, college: e.target.value})} /></div>
                    <div className="form-group"><label>Degree</label><input type="text" onChange={e => setFormData({...formData, degree: e.target.value})} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Branch *</label><input required type="text" onChange={e => setFormData({...formData, branch: e.target.value})} /></div>
                    <div className="form-group"><label>Current Year</label><input type="text" onChange={e => setFormData({...formData, currentYear: e.target.value})} /></div>
                  </div>
                </>
              )}

              {type === 'job' && (
                <div className="form-row">
                  <div className="form-group"><label>Highest Qualification</label><input type="text" onChange={e => setFormData({...formData, qualification: e.target.value})} /></div>
                  <div className="form-group"><label>Experience (Years)</label><input type="text" onChange={e => setFormData({...formData, experience: e.target.value})} /></div>
                </div>
              )}

              <div className="form-group"><label>Skills</label><input type="text" placeholder="React, Node.js, Python..." onChange={e => setFormData({...formData, skills: e.target.value})} /></div>
              
              <div className="form-row">
                <div className="form-group"><label>LinkedIn URL</label><input type="url" onChange={e => setFormData({...formData, linkedin: e.target.value})} /></div>
                <div className="form-group"><label>GitHub URL</label><input type="url" onChange={e => setFormData({...formData, github: e.target.value})} /></div>
              </div>
              
              <div className="form-group"><label>Portfolio URL</label><input type="url" onChange={e => setFormData({...formData, portfolio: e.target.value})} /></div>

              {/* Note: File upload logic will go here. For now it's a URL or placeholder */}
              <div className="form-group"><label>Resume URL (Google Drive / DropBox) *</label><input required type="url" onChange={e => setFormData({...formData, resumeUrl: e.target.value})} /></div>

              <div className="form-group"><label>Cover Letter / Why Join Us?</label><textarea rows={3} onChange={e => setFormData({...formData, coverLetter: e.target.value})}></textarea></div>
              
              <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }
        .modal-content {
          background: #111;
          border: 1px solid rgba(255,106,42,0.2);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,106,42,0.1);
        }
        .close-btn {
          position: absolute;
          top: 20px; right: 20px;
          background: none; border: none;
          color: #888;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover { color: #fff; }
        
        .loading-state, .success-state, .no-openings-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .modal-content h2 {
          color: #fff;
          font-size: 28px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .modal-content p {
          color: #888;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .notify-form {
          width: 100%;
          background: rgba(255,255,255,0.02);
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .notify-form h3 { color: #fff; margin-bottom: 5px; }
        .notify-form .sub-text { font-size: 13px; margin-bottom: 20px; }
        
        input, select, textarea {
          width: 100%;
          background: #000;
          border: 1px solid #333;
          color: #fff;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #FF6A2A;
        }
        
        .btn-primary {
          background: #FF6A2A;
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #e64a19;
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }
        .form-row .form-group { flex: 1; }
        .form-group label {
          display: block;
          color: #aaa;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(255,106,42,0.2);
          border-top-color: #FF6A2A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 600px) {
          .form-row { flex-direction: column; gap: 0; }
          .modal-content { padding: 30px 20px; }
        }
      `}</style>
    </div>
  )
}
