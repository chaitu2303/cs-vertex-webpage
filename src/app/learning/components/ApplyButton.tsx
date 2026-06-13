"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApplyButton({ type, itemId, isLoggedIn }: { type: 'Internships' | 'Courses' | 'Workshops', itemId: string, isLoggedIn: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleInitialClick = () => {
    if (!isLoggedIn) {
      router.push(`/portal/login?next=/learning/${type.toLowerCase()}`)
      return
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    formData.append('type', type)
    formData.append('itemId', itemId)
    
    // If it's an internship, we have a file upload. 
    // We upload the file to /api/upload first to get the URL
    const file = formData.get('resume') as File
    if (type === 'Internships' && file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Resume file size must be less than 5MB')
        setLoading(false)
        return
      }
      
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('folder', 'resumes')
      
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData })
      if (!uploadRes.ok) {
        setErrorMsg('Failed to upload resume')
        setLoading(false)
        return
      }
      const { url } = await uploadRes.json()
      formData.set('resumeUrl', url)
      formData.delete('resume')
    }

    const res = await fetch('/api/learning/apply', {
      method: 'POST',
      body: formData
    })
    
    if (res.ok) {
      alert('Application submitted successfully! Check your dashboard for updates.')
      setShowModal(false)
      router.push('/portal')
    } else {
      const error = await res.json()
      setErrorMsg(error.message || 'Failed to submit application. You might have already applied.')
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={handleInitialClick}
        style={{ width: '100%', padding: '12px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
      >
        {isLoggedIn ? 'Apply Now' : 'Log in to Apply'}
      </button>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '20px', margin: 0 }}>Apply for {type}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            
            {errorMsg && <div style={{ color: '#ff4444', marginBottom: '15px', fontSize: '13px', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '6px' }}>{errorMsg}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" name="fullName" placeholder="Full Name" required style={inputStyle} />
              <input type="email" name="email" placeholder="Email Address" required style={inputStyle} />
              <input type="tel" name="phone" placeholder="Phone Number" required style={inputStyle} />
              
              {(type === 'Internships' || type === 'Courses') && (
                <input type="text" name="college" placeholder="College / University" required style={inputStyle} />
              )}
              
              {type === 'Internships' && (
                <>
                  <input type="text" name="branch" placeholder="Branch / Department" required style={inputStyle} />
                  <input type="text" name="year" placeholder="Year of Study" required style={inputStyle} />
                  <input type="text" name="skills" placeholder="Top Skills (comma separated)" required style={inputStyle} />
                  <input type="url" name="linkedin" placeholder="LinkedIn URL" style={inputStyle} />
                  <input type="url" name="github" placeholder="GitHub URL" style={inputStyle} />
                  <div>
                    <label style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px', display: 'block' }}>Resume (PDF/DOCX, Max 5MB)</label>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx" required style={{ ...inputStyle, padding: '10px' }} />
                  </div>
                  <textarea name="coverLetter" placeholder="Cover Letter (Optional)" rows={3} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                </>
              )}

              {type === 'Courses' && (
                <>
                  <input type="text" name="qualification" placeholder="Highest Qualification" required style={inputStyle} />
                  <input type="url" name="linkedin" placeholder="LinkedIn URL (Optional)" style={inputStyle} />
                </>
              )}

              {type === 'Workshops' && (
                <>
                  <input type="text" name="organization" placeholder="Organization (Optional)" style={inputStyle} />
                  <input type="text" name="college" placeholder="College (Optional)" style={inputStyle} />
                  <input type="url" name="linkedin" placeholder="LinkedIn URL (Optional)" style={inputStyle} />
                </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', marginTop: '10px' }}
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none'
}
