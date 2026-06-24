"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Fetch User
    import('@/utils/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    })
    const sections = ['home', 'about', 'services', 'projects', 'why-choose-us', 'learning', 'quote', 'team']
    
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px', // Center-based trigger range
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach(id => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [])

  return (
    <header className="site-header">
      <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" className="logo">
          <img src="/logo-nav.png" alt="CS Vertex Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', transform: 'scale(1.2)', transformOrigin: 'left center' }} />
        </Link>
      </div>
      
      <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'home' ? 'active' : ''}>Home</a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'about' ? 'active' : ''}>About</a>
        <a href="#services" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'services' ? 'active' : ''}>Services</a>
        <a href="#projects" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'projects' ? 'active' : ''}>Projects</a>
        <a href="#why-choose-us" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'why-choose-us' ? 'active' : ''}>Why Choose Us</a>
        <a href="#learning" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'learning' ? 'active' : ''}>Learning</a>
        <a href="#quote" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'quote' ? 'active' : ''}>Quote</a>
        <a href="#team" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'team' ? 'active' : ''}>Team</a>
        
        <div 
          className="portal-menu-wrapper" 
          style={{ display: 'inline-block', position: 'relative' }}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <Link href="/portal" onClick={() => setMobileMenuOpen(false)} style={{ opacity: 1, color: 'var(--acid)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            Customer Portal {user ? '✓' : ''}
          </Link>
          {dropdownOpen && user && (
            <div className="portal-dropdown" style={{ display: 'flex' }}>
              <Link href="/portal" className="dropdown-link">Dashboard</Link>
              <Link href="/portal/projects" className="dropdown-link">My Projects</Link>
              <Link href="/portal/student-dashboard" className="dropdown-link">Learning</Link>
            </div>
          )}
        </div>
      </nav>
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .portal-dropdown {
          animation: dropdownFade 0.2s ease-out;
        }
        .dropdown-link {
          padding: 10px 16px;
          color: #eee;
          text-decoration: none;
          font-size: 13px;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .dropdown-link:hover {
          background: rgba(212, 255, 62, 0.1);
          color: var(--acid);
          padding-left: 20px;
        }
        @media(max-width:900px) {
          .desktop-nav {
            display: none;
          }
          .desktop-nav.mobile-open {
            display: flex !important;
            flex-direction: column;
            align-items: flex-start;
            position: fixed;
            top: 100px;
            left: 0;
            width: 100%;
            background: #050505;
            padding: 20px 4vw;
            border-bottom: 1px solid #333;
            z-index: 49;
          }
          .desktop-nav.mobile-open a, .desktop-nav.mobile-open .portal-menu-wrapper {
            width: 100%;
            text-align: left;
            font-size: 14px;
            padding: 15px 0;
            border-bottom: 1px solid #222;
          }
        }
      `}</style>
      
      <div className="header-cta">
        <a href="#quote" className="primary-action" style={{ padding: '8px 20px', fontSize: '14px' }}>
          Get Quote
        </a>
      </div>

      <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
        <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
        <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -4px)' : 'none' }}></span>
      </button>
    </header>
  )
}
