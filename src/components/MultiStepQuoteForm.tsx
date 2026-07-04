"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, Laptop, Brain, Cpu, Bot, Cloud, X } from 'lucide-react'

export function MultiStepQuoteForm({ actionUrl }: { actionUrl?: string }) {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  // Auth States for inline login
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const [formData, setFormData] = useState<Record<string, any>>({
    service: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setUserId(session?.user?.id || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      setUserId(session?.user?.id || null)
    })

    const pending = localStorage.getItem('pending_quote_data')
    if (pending) {
      try {
        const parsed = JSON.parse(pending)
        setFormData(parsed)
        setStep(3)
        localStorage.removeItem('pending_quote_data')
      } catch (e) {}
    }

    return () => subscription.unsubscribe()
  }, [])

  const updateForm = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }))

  const nextStep = () => {
    if (step === 1) {
      if (!formData.service) return alert('Please select a service')
      if (!isAuthenticated) {
        setShowAuthModal(true)
        return
      }
    }
    
    // Validation for step 2 happens dynamically if required
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const formatDescription = () => {
    let desc = `**Service:** ${formData.service}\n\n`
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'service') {
        // Format camelCase or spaced keys nicely
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        desc += `**${label}:**\n${value}\n\n`
      }
    }
    return desc
  }

  const submitQuote = async (uid: string) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: formData.service,
          budget: formData.budget || 'N/A',
          description: formatDescription(),
          customerId: uid
        })
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return alert('User ID missing. Please authenticate.')
    await submitQuote(userId)
  }

  const handleAuthAndContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return alert('Email and password required')
    setAuthLoading(true)
    setAuthError('')

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Registration successful! Check your email.')
      }
      setShowAuthModal(false)
      setStep(s => s + 1)
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    localStorage.setItem('pending_quote_data', JSON.stringify(formData))
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/?restore=true' }
    })
  }

  if (isAuthenticated === null) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#F5F1EA' }}>Loading secure portal...</div>
  }

  if (status === 'success') {
    return (
      <div style={{ background: '#0a0a0a', padding: '50px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--acid)', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--acid)', marginBottom: '20px' }}>
          <CheckCircle size={48} strokeWidth={1.5} />
        </div>
        <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '10px' }}>Request Received</h3>
        <p style={{ color: '#F5F1EA', marginBottom: '30px', fontSize: '15px' }}>Our enterprise engineering team is reviewing your project details. You can track updates in your Client Dashboard.</p>
        <button onClick={() => router.push('/portal/quotes')} style={{ padding: '14px 28px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Go to Dashboard</button>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '700px', margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* 3-Step Progress Indicator */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--acid)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'background 0.3s, box-shadow 0.3s', boxShadow: i <= step ? '0 0 10px rgba(255,92,42,0.5)' : 'none' }} />
          ))}
        </div>

        <div style={{ minHeight: '260px' }}>
          {step === 1 && (
            <div className="fade-in">
              <h3 style={{ color: '#fff', marginBottom: '25px', fontSize: '20px', fontWeight: 500 }}>1. Project Service</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {[
                  { id: 'Software Engineering', title: 'Software Engineering', desc: 'Web, Mobile, SaaS, ERP', icon: <Laptop size={24} strokeWidth={1.5} className="hover-orange-icon" /> },
                  { id: 'AI Solutions', title: 'AI Solutions', desc: 'ML, NLP, Computer Vision', icon: <Brain size={24} strokeWidth={1.5} className="hover-orange-icon" /> },
                  { id: 'IoT / Embedded / Robotics', title: 'IoT / Embedded / Robotics', desc: 'Hardware, Sensors, Automation', icon: <Cpu size={24} strokeWidth={1.5} className="hover-orange-icon" /> },
                  { id: 'Cloud / DevOps', title: 'Cloud / DevOps', desc: 'AWS/GCP/Azure, CI/CD, Scaling', icon: <Cloud size={24} strokeWidth={1.5} className="hover-orange-icon" /> },
                ].map(svc => (
                  <div 
                    key={svc.id}
                    onClick={() => setFormData({ ...formData, service: svc.id })}
                    style={{
                      background: formData.service === svc.id ? 'rgba(255,92,42,0.1)' : 'rgba(255,255,255,0.02)',
                      border: formData.service === svc.id ? '1px solid var(--acid)' : '1px solid rgba(255,255,255,0.08)',
                      padding: '20px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>{svc.icon}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>{svc.title}</div>
                      <div style={{ color: '#F5F1EA', fontSize: '12px', lineHeight: 1.4 }}>{svc.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in" style={{ display: 'grid', gap: '15px' }}>
              <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '20px', fontWeight: 500 }}>2. {formData.service} Details</h3>
              
              {formData.service === 'Software Engineering' && (
                <>
                  <input type="text" placeholder="Project Name" value={formData.projectName || ''} onChange={e => updateForm('projectName', e.target.value)} style={inputStyle} />
                  <select value={formData.projectType || ''} onChange={e => updateForm('projectType', e.target.value)} style={inputStyle}>
                    <option value="">Project Type *</option>
                    <option value="Website">Website</option>
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="SaaS">SaaS</option>
                    <option value="ERP/CRM">ERP/CRM</option>
                  </select>
                  <textarea placeholder="Required Features *" rows={3} value={formData.features || ''} onChange={e => updateForm('features', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <input type="text" placeholder="Existing Website (optional)" value={formData.existingWebsite || ''} onChange={e => updateForm('existingWebsite', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Target Users" value={formData.targetUsers || ''} onChange={e => updateForm('targetUsers', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Timeline (e.g., 3 months)" value={formData.timeline || ''} onChange={e => updateForm('timeline', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Budget (USD)" value={formData.budget || ''} onChange={e => updateForm('budget', e.target.value)} style={inputStyle} />
                </>
              )}

              {formData.service === 'AI Solutions' && (
                <>
                  <textarea placeholder="AI Use Case *" rows={3} value={formData.aiUseCase || ''} onChange={e => updateForm('aiUseCase', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <select value={formData.dataAvailable || ''} onChange={e => updateForm('dataAvailable', e.target.value)} style={inputStyle}>
                    <option value="">Existing Data Available? *</option>
                    <option value="Yes - Clean Data">Yes - Clean Data</option>
                    <option value="Yes - Raw Data">Yes - Raw Data</option>
                    <option value="No">No</option>
                  </select>
                  <input type="text" placeholder="Model Type (e.g., NLP, Vision)" value={formData.modelType || ''} onChange={e => updateForm('modelType', e.target.value)} style={inputStyle} />
                  <textarea placeholder="Integration Requirements" rows={2} value={formData.integration || ''} onChange={e => updateForm('integration', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <input type="text" placeholder="Timeline" value={formData.timeline || ''} onChange={e => updateForm('timeline', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Budget" value={formData.budget || ''} onChange={e => updateForm('budget', e.target.value)} style={inputStyle} />
                </>
              )}

              {formData.service === 'IoT / Embedded' && (
                <>
                  <input type="text" placeholder="Hardware Type" value={formData.hardwareType || ''} onChange={e => updateForm('hardwareType', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Sensors Required" value={formData.sensors || ''} onChange={e => updateForm('sensors', e.target.value)} style={inputStyle} />
                  <select value={formData.connectivity || ''} onChange={e => updateForm('connectivity', e.target.value)} style={inputStyle}>
                    <option value="">Connectivity Type *</option>
                    <option value="WiFi">WiFi</option>
                    <option value="Bluetooth/BLE">Bluetooth/BLE</option>
                    <option value="Cellular (4G/5G)">Cellular (4G/5G)</option>
                    <option value="LoRaWAN">LoRaWAN</option>
                    <option value="Other">Other</option>
                  </select>
                  <select value={formData.stage || ''} onChange={e => updateForm('stage', e.target.value)} style={inputStyle}>
                    <option value="">Prototype or Production? *</option>
                    <option value="Prototype">Prototype (PoC)</option>
                    <option value="Production">Production Batch</option>
                  </select>
                  <input type="number" placeholder="Quantity Expected" value={formData.quantity || ''} onChange={e => updateForm('quantity', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Timeline" value={formData.timeline || ''} onChange={e => updateForm('timeline', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Budget" value={formData.budget || ''} onChange={e => updateForm('budget', e.target.value)} style={inputStyle} />
                </>
              )}

              {formData.service === 'Robotics' && (
                <>
                  <input type="text" placeholder="Robot Type (e.g., AMR, Arm)" value={formData.robotType || ''} onChange={e => updateForm('robotType', e.target.value)} style={inputStyle} />
                  <textarea placeholder="Use Case *" rows={3} value={formData.useCase || ''} onChange={e => updateForm('useCase', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <textarea placeholder="Hardware Requirements" rows={2} value={formData.hardware || ''} onChange={e => updateForm('hardware', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <textarea placeholder="AI Requirements (e.g., Vision, Nav)" rows={2} value={formData.aiReqs || ''} onChange={e => updateForm('aiReqs', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <input type="text" placeholder="Timeline" value={formData.timeline || ''} onChange={e => updateForm('timeline', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Budget" value={formData.budget || ''} onChange={e => updateForm('budget', e.target.value)} style={inputStyle} />
                </>
              )}

              {formData.service === 'Cloud / DevOps' && (
                <>
                  <textarea placeholder="Existing Infrastructure *" rows={3} value={formData.existingInfra || ''} onChange={e => updateForm('existingInfra', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <select value={formData.cloudProvider || ''} onChange={e => updateForm('cloudProvider', e.target.value)} style={inputStyle}>
                    <option value="">Preferred Cloud Provider *</option>
                    <option value="AWS">AWS</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Azure">Azure</option>
                    <option value="Agnostic">Agnostic</option>
                  </select>
                  <textarea placeholder="Scalability Requirements" rows={2} value={formData.scalability || ''} onChange={e => updateForm('scalability', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                  <input type="text" placeholder="Timeline" value={formData.timeline || ''} onChange={e => updateForm('timeline', e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Budget" value={formData.budget || ''} onChange={e => updateForm('budget', e.target.value)} style={inputStyle} />
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3 style={{ color: '#fff', marginBottom: '25px', fontSize: '20px', fontWeight: 500 }}>3. Review & Submit</h3>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '15px', color: '#F5F1EA', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', maxHeight: '300px', overflowY: 'auto' }}>
                {Object.entries(formData).map(([key, val]) => (
                  <div key={key}>
                    <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</strong>
                    <div style={{ color: '#fff', marginTop: '4px' }}>{val || '-'}</div>
                  </div>
                ))}
              </div>

              {status === 'error' && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '15px', textAlign: 'center' }}>Submission failed. Please check your network and try again.</p>}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}>Back</button>
          ) : <div />}
          
          {step < 3 ? (
            <button type="button" onClick={nextStep} style={{ padding: '12px 24px', background: '#fff', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>Continue</button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={status === 'loading'} style={{ padding: '12px 28px', background: 'var(--acid)', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
              {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>

        <style>{`
          .fade-in { animation: fadeIn 0.4s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>

      {/* Mandatory Auth Modal */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#111', border: '1px solid #333', padding: '40px', borderRadius: '16px', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#F5F1EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} strokeWidth={1.5} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Account Required</h3>
            <p style={{ color: '#F5F1EA', fontSize: '14px', marginBottom: '25px', lineHeight: 1.5 }}>Please log in or create an account to proceed with your quote request.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => { setAuthMode('signin'); setAuthError(''); }} style={{ flex: 1, padding: '10px', background: authMode === 'signin' ? 'rgba(255,92,42,0.1)' : 'transparent', border: authMode === 'signin' ? '1px solid var(--acid)' : '1px solid #333', color: authMode === 'signin' ? 'var(--acid)' : '#aaa', borderRadius: '6px', cursor: 'pointer' }}>Sign In</button>
              <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} style={{ flex: 1, padding: '10px', background: authMode === 'signup' ? 'rgba(255,92,42,0.1)' : 'transparent', border: authMode === 'signup' ? '1px solid var(--acid)' : '1px solid #333', color: authMode === 'signup' ? 'var(--acid)' : '#aaa', borderRadius: '6px', cursor: 'pointer' }}>Create Account</button>
            </div>

            <form onSubmit={handleAuthAndContinue} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} style={subInputStyle} />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={subInputStyle} />
              {authMode === 'signin' && <div style={{textAlign: 'right'}}><a href="/portal/forgot-password" style={{ color: 'var(--acid)', fontSize: '12px', textDecoration: 'none' }}>Forgot Password?</a></div>}
              {authError && <p style={{ color: '#ff4444', fontSize: '12px', margin: 0 }}>{authError}</p>}
              <button type="submit" disabled={authLoading} style={{ padding: '14px', background: 'var(--acid)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                {authLoading ? 'Authenticating...' : (authMode === 'signin' ? 'Login & Continue' : 'Create Account & Continue')}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#333' }} />
                <span style={{ padding: '0 10px', fontSize: '11px', color: '#555', textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#333' }} />
              </div>
              <button type="button" onClick={handleGoogleAuth} style={{ padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', height: '16px' }} />
                Continue with Google
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
  padding: '16px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
}

const subInputStyle = {
  width: '100%',
  padding: '14px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s'
}
