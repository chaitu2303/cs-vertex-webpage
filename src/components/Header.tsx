"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Home, Search, User, Menu, X, Briefcase, Zap, Shield, HelpCircle, BookOpen, FileText, Award } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [dropdownOpen, setDropdownOpen] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Fetch User
    import('@/utils/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    })
    const sections = ['home', 'about', 'services', 'projects', 'why-choose-us', 'learning', 'quote', 'leadership', 'company', 'vision', 'mission', 'msme']
    
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <header className="site-header">
      <div className="brand">
        <Link 
          href="/" 
          className="logo" 
          onClick={() => {
            if (typeof window !== 'undefined' && window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Image src="/logo-nav.png" alt="CS Vertex Logo" width={140} height={50} priority style={{ objectFit: 'contain' }} />
        </Link>
      </div>
      
      <nav className="desktop-nav">
        <Link 
          href="/" 
          className={activeSection === 'home' ? 'active' : ''}
        >Home</Link>
        <div 
          className="nav-dropdown-wrapper" 
          onMouseEnter={() => setDropdownOpen('about')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/about" 
            className={['leadership', 'company', 'vision', 'mission', 'msme'].includes(activeSection) || activeSection === 'about' ? 'active' : ''}
          >
            <span>About <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'about' && (
            <div className="nav-dropdown">
              <Link href="/about" className="dropdown-link about-link">About Overview</Link>
              <Link href="/about#leadership" className="dropdown-link about-link">Leadership Team</Link>
              <Link href="/about#company" className="dropdown-link about-link">Company</Link>
              <Link href="/about#vision" className="dropdown-link about-link">Vision</Link>
              <Link href="/about#mission" className="dropdown-link about-link">Mission</Link>
              <Link href="/about#msme" className="dropdown-link about-link">MSME</Link>
            </div>
          )}
        </div>

        <div 
          className="nav-dropdown-wrapper" 
          onMouseEnter={() => setDropdownOpen('services')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/#services" 
            className={activeSection === 'services' ? 'active' : ''}
          >
            <span>Services <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'services' && (
            <div className="nav-dropdown mega-dropdown">
              <div className="mega-col">
                <span className="mega-title">Core Services</span>
                <Link href="/#services" className="dropdown-link">All Services</Link>
                <Link href="/#services" className="dropdown-link">Software Engineering</Link>
                <Link href="/#services" className="dropdown-link">AI Solutions</Link>
                <Link href="/#services" className="dropdown-link">Cybersecurity</Link>
                <Link href="/#services" className="dropdown-link">IoT & Embedded</Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/#projects" className={activeSection === 'projects' ? 'active' : ''}>Projects</Link>
        <Link href="/#why-choose-us" className={activeSection === 'why-choose-us' ? 'active' : ''}>Why Choose Us</Link>
        
        <div 
          className="nav-dropdown-wrapper" 
          onMouseEnter={() => setDropdownOpen('learning')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/#learning" 
            className={activeSection === 'learning' ? 'active' : ''}
          >
            <span>Learning <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'learning' && (
            <div className="nav-dropdown">
              <Link href="/#learning" className="dropdown-link">Learning Home</Link>
              <Link href="/#learning" className="dropdown-link">Courses</Link>
              <Link href="/#learning" className="dropdown-link">Internships</Link>
              <Link href="/certificate" className="dropdown-link">Verify Certificates</Link>
            </div>
          )}
        </div>

        <div 
          className="portal-menu-wrapper" 
          onMouseEnter={() => setDropdownOpen('portal')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/portal" 
            className="portal-btn-desktop"
          >
            Customer Portal {user ? <CheckCircle size={14} strokeWidth={2} /> : ''}
          </Link>
          {dropdownOpen === 'portal' && user && (
            <div className="portal-dropdown">
              <Link href="/portal" className="dropdown-link">Dashboard</Link>
              <Link href="/portal/projects" className="dropdown-link">My Projects</Link>
              <Link href="/portal/learning" className="dropdown-link">Learning</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Toggle button */}
      <button className="menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
      </button>

      {/* Premium Glassmorphism Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu-overlay"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-menu-panel"
            >
              <div className="mobile-menu-header">
                <Image src="/logo-nav.png" alt="CS Vertex Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
                <button onClick={() => setMobileMenuOpen(false)} className="close-btn" aria-label="Close menu"><X size={28} color="#fff" /></button>
              </div>

              <div className="mobile-menu-links">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <Home size={20} className="mobile-icon" /> Home
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <Briefcase size={20} className="mobile-icon" /> About
                </Link>
                <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <Zap size={20} className="mobile-icon" /> Services
                </Link>
                <Link href="/#projects" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <Shield size={20} className="mobile-icon" /> Projects
                </Link>
                <Link href="/#why-choose-us" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <HelpCircle size={20} className="mobile-icon" /> Why Choose Us
                </Link>
                <Link href="/#learning" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  <BookOpen size={20} className="mobile-icon" /> Learning
                </Link>
                <div style={{ paddingLeft: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link href="/announcements" onClick={() => setMobileMenuOpen(false)} className="mobile-link" style={{ fontSize: '15px' }}>
                    <FileText size={16} className="mobile-icon" /> Notice Board
                  </Link>
                  <Link href="/certificate" onClick={() => setMobileMenuOpen(false)} className="mobile-link" style={{ fontSize: '15px' }}>
                    <Award size={16} className="mobile-icon" /> Verify Certificates
                  </Link>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="mobile-bottom-actions">
                <Link href="/portal" className="mobile-portal-btn" onClick={() => setMobileMenuOpen(false)}>
                  <User size={18} /> {user ? 'Customer Dashboard' : 'Customer Sign In'}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 9999;
          height: clamp(70px, 8vh, 100px);
          min-height: 70px;
          padding: 0 4vw;
          border-bottom: 1px solid var(--line);
          background: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .brand a {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .desktop-nav {
          display: flex;
          gap: 36px;
          align-items: center;
          margin: auto;
        }
        
        .desktop-nav > a, .nav-dropdown-wrapper > a {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.62;
          transition: 0.3s;
          padding: 8px 0;
          position: relative;
        }

        .desktop-nav > a:hover, .nav-dropdown-wrapper > a:hover, .desktop-nav > a.active, .nav-dropdown-wrapper > a.active {
          opacity: 1;
          color: var(--acid);
        }

        .desktop-nav > a.active::after, .nav-dropdown-wrapper > a.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--acid);
          box-shadow: 0 0 8px var(--acid);
        }

        .nav-dropdown-wrapper, .portal-menu-wrapper {
          position: relative;
          display: inline-block;
        }

        .nav-dropdown, .portal-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 8px;
          min-width: 200px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          z-index: 50;
          animation: dropdownFade 0.2s ease-out;
        }

        .mega-dropdown {
          flex-direction: row;
          gap: 40px;
          padding: 30px;
          width: max-content;
        }
        .mega-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mega-title {
          font-size: 11px;
          font-family: var(--mono);
          color: var(--acid);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
          border-bottom: 1px solid #333;
          padding-bottom: 5px;
        }

        .dropdown-link {
          padding: 8px 12px;
          color: #eee;
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .dropdown-link:hover {
          background: rgba(255, 90, 42, 0.1);
          color: var(--acid);
          padding-left: 16px;
        }

        .portal-btn-desktop {
          opacity: 1 !important;
          color: #000 !important;
          background: var(--acid) !important;
          padding: 6px 16px !important;
          border-radius: 30px !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          transition: 0.3s;
        }
        .portal-btn-desktop:hover {
          background: var(--acid-hover) !important;
          box-shadow: var(--glow-acid);
        }

        .menu-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          min-width: 48px;
          min-height: 48px;
          margin-left: auto;
          z-index: 9998;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* --- PREMIUM MOBILE MENU --- */
        @media (max-width: 900px) {
          .desktop-nav {
            display: none;
          }
          .menu-toggle-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
          }
          
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9998;
            display: flex;
            justify-content: flex-end;
          }

          .mobile-menu-panel {
            width: 85vw;
            max-width: 400px;
            height: 100dvh;
            background: rgba(15, 15, 15, 0.95);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            box-shadow: -20px 0 50px rgba(0,0,0,0.8);
          }

          .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }

          .close-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .mobile-menu-links {
            padding: 30px 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
            flex-grow: 1;
          }

          .mobile-link {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 18px;
            font-weight: 500;
            color: #fff;
            text-decoration: none;
            transition: 0.3s;
          }

          .mobile-link:hover {
            color: var(--acid);
            transform: translateX(10px);
          }

          .mobile-icon {
            color: var(--acid);
            opacity: 0.8;
          }

          .mobile-bottom-actions {
            padding: 24px;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            gap: 12px;
            background: rgba(0,0,0,0.2);
          }

          .mobile-portal-btn {
            flex-grow: 1;
            background: var(--acid);
            color: #000;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 13px;
            min-height: 48px;
            padding: 0 20px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
          }
        }
      `}</style>
    </header>
  )
}
