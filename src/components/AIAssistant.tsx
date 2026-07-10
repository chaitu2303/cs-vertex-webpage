"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Calculator } from 'lucide-react'

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am the CS Vertex AI Assistant. How can I help you today? Or would you like to try our AI Project Cost Estimator?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Thank you for your message. Currently, I am a demonstration of our AI capabilities. Please contact our human team for detailed technical inquiries or project estimations.' }])
    }, 1000)
  }

  const startEstimator = () => {
    setMessages(prev => [...prev, 
      { role: 'user', content: 'Start AI Cost Estimator' },
      { role: 'assistant', content: 'Great! What kind of project are you looking to build? (e.g. Web App, Mobile App, Custom AI, IoT Hardware)' }
    ])
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="premium-ai-btn"
        title="AI Assistant & Cost Estimator"
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF5C2A, #8B5CF6)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer', boxShadow: '0 0 20px rgba(255, 92, 42, 0.4)',
          zIndex: 9996, transition: 'transform 0.2s', position: 'relative'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        <Bot size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '30px',
              width: '350px',
              height: '500px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              zIndex: 9997,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', background: 'linear-gradient(90deg, #1a1a1a, #0a0a0a)', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF5C2A, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 600 }}>Vertex AI</h3>
                  <span style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }}></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background: m.role === 'user' ? '#FF5C2A' : '#222',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '85%',
                    fontSize: '14px',
                    lineHeight: 1.5
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div style={{ padding: '0 20px 15px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
                <button 
                  onClick={startEstimator}
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 92, 42, 0.1)', color: '#FF5C2A', border: '1px solid rgba(255, 92, 42, 0.3)', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Calculator size={14} /> AI Cost Estimator
                </button>
              </div>
            )}

            {/* Input Area */}
            <div style={{ padding: '15px', borderTop: '1px solid #333', background: '#0a0a0a', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about our services..." 
                style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '10px 15px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <button 
                onClick={handleSend}
                style={{ background: '#FF5C2A', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
