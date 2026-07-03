"use client"

import React, { useState, useEffect } from 'react'
import { Search, ChevronDown, CheckCircle } from 'lucide-react'

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  isPinned: boolean
  isFeatured: boolean
  viewCount: number
}

const CATEGORIES = ["All", "Web", "AI", "Cybersecurity", "IoT", "Billing", "General", "Careers"]

export function FAQSection({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [openId, setOpenId] = useState<string | null>(null)
  
  // Track which FAQs have already had their view count incremented this session to avoid spam
  const [viewedFaqs, setViewedFaqs] = useState<Set<string>>(new Set())

  // We could also re-fetch client side if needed, but initialFaqs is fine.

  const handleToggle = async (id: string) => {
    if (openId === id) {
      setOpenId(null)
      return
    }
    
    setOpenId(id)

    // Increment view count if not already viewed in this session
    if (!viewedFaqs.has(id)) {
      try {
        await fetch(`/api/public/faqs/${id}/view`, { method: 'PATCH' })
        setViewedFaqs(prev => new Set(prev).add(id))
      } catch (err) {
        console.error("Failed to increment view count", err)
      }
    }
  }

  const filteredFaqs = faqs.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase()) || 
                        f.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Sort: Pinned first, then Featured, then by original order
  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return 0 // Preserve server order
  })

  return (
    <section id="faq" className="section-gap" style={{ background: '#Fdfbf7', color: '#111' }}>
      <div className="container-1400">
        <div className="section-index" style={{ color: '#555' }}><i><style>{`#faq .section-index i { background: #555 !important; } #faq .section-index span { color: #555 !important; }`}</style></i> <span>10</span> <span>/</span> <span>FAQ</span></div>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(38px, 4.3vw, 70px)', color: 'var(--acid)', fontWeight: 500, letterSpacing: '-.065em', lineHeight: .93, marginBottom: '20px' }}>
            Frequently Asked <span style={{ color: '#111', fontWeight: 400, fontStyle: 'normal' }}>Questions</span>
          </h2>
          <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to know about our services, process, billing, and technology stack.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="faq-controls">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {sortedFaqs.length > 0 ? (
            sortedFaqs.map(faq => {
              const isOpen = openId === faq.id
              return (
                <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''} ${faq.isPinned ? 'pinned' : ''}`}>
                  <button className="faq-question" onClick={() => handleToggle(faq.id)}>
                    <div className="faq-q-content">
                      {faq.isPinned && <span className="pinned-badge">PINNED</span>}
                      {faq.isFeatured && <span className="featured-badge">FEATURED</span>}
                      <span>{faq.question}</span>
                    </div>
                    <div className={`faq-icon ${isOpen ? 'rotated' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="empty-faq text-center text-gray-500 py-10" style={{ color: '#888' }}>
              No questions found matching your criteria.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .faq-controls {
          max-width: 800px;
          margin: 0 auto 40px auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .search-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 30px;
          padding: 16px 20px 16px 50px;
          color: #111;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          border-color: #FF6B2C;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        .category-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cat-btn {
          background: transparent;
          border: 1px solid #ddd;
          color: #666;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          background: rgba(255, 107, 44, 0.1);
          color: #111;
          border-color: #FF6B2C;
        }

        .cat-btn.active {
          background: #FF6B2C;
          color: white;
          border-color: #FF6B2C;
          font-weight: 600;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .faq-item.pinned {
          border-color: rgba(255, 107, 44, 0.4);
          background: linear-gradient(to right, #fff, rgba(255, 107, 44, 0.03));
        }

        .faq-item:hover {
          border-color: #ddd;
        }

        .faq-item.open {
          border-color: #FF6B2C;
          box-shadow: 0 4px 20px rgba(255, 107, 44, 0.08);
        }

        .faq-question {
          width: 100%;
          text-align: left;
          padding: 24px;
          background: transparent;
          border: none;
          color: #111;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .faq-q-content {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-right: 20px;
        }

        .pinned-badge {
          background: var(--acid);
          color: black;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .featured-badge {
          background: #FF6B2C;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .faq-icon {
          color: #FF6B2C;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-icon.rotated {
          transform: rotate(180deg);
        }

        .faq-answer-wrapper {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-answer {
          padding: 0 24px 24px 24px;
          color: #aaa;
          font-size: 15px;
          line-height: 1.7;
        }

        @media (max-width: 600px) {
          .faq-question {
            font-size: 16px;
            padding: 16px;
          }
          .faq-answer {
            padding: 0 16px 16px 16px;
          }
        }
      `}</style>
    </section>
  )
}
