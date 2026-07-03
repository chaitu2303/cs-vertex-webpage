"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

import Image from 'next/image'

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
      <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
        <Link 
          href="/" 
          className="logo" 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => {
            if (typeof window !== 'undefined' && window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Image src="/logo-nav.png" alt="CS Vertex Logo" width={140} height={50} priority style={{ objectFit: 'contain' }} />
        </Link>
      </div>
      
      <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link 
          href="/" 
          onClick={() => {
            setMobileMenuOpen(false);
            if (typeof window !== 'undefined' && window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }} 
          className={activeSection === 'home' ? 'active' : ''}
        >Home</Link>
        <div 
          className="nav-dropdown-wrapper" 
          style={{ display: 'inline-block', position: 'relative' }}
          onMouseEnter={() => setDropdownOpen('about')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/about" 
            onClick={(e) => {
              if (window.innerWidth <= 900) {
                e.preventDefault();
                setDropdownOpen(dropdownOpen === 'about' ? '' : 'about');
              } else {
                setMobileMenuOpen(false);
              }
            }} 
            className={['leadership', 'company', 'vision', 'mission', 'msme'].includes(activeSection) || activeSection === 'about' ? 'active' : ''}
          >
            <span style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>About <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'about' && (
            <div className="nav-dropdown" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/about" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>About Overview</Link>
              <Link href="/about#leadership" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Leadership Team</Link>
              <Link href="/about#company" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Company</Link>
              <Link href="/about#vision" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Vision</Link>
              <Link href="/about#mission" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Mission</Link>
              <Link href="/about#msme" className="dropdown-link about-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>MSME</Link>
            </div>
          )}
        </div>

        <div 
          className="nav-dropdown-wrapper" 
          style={{ display: 'inline-block', position: 'relative' }}
          onMouseEnter={() => setDropdownOpen('services')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/#services" 
            onClick={(e) => {
              if (window.innerWidth <= 900) {
                e.preventDefault();
                setDropdownOpen(dropdownOpen === 'services' ? '' : 'services');
              } else {
                setMobileMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }} 
            className={activeSection === 'services' ? 'active' : ''}
          >
            <span style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>Services <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'services' && (
            <div className="nav-dropdown mega-dropdown">
              <div className="mega-col">
                <span className="mega-title">Core Services</span>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>All Services</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Software Engineering</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>AI Solutions</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Cybersecurity</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>IoT & Embedded</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>VAPT</Link>
                <Link href="/#services" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Enterprise Solutions</Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/#projects" onClick={(e) => { 
          setMobileMenuOpen(false); 
          if (typeof window !== 'undefined' && window.location.pathname === '/') {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); 
          }
        }} className={activeSection === 'projects' ? 'active' : ''}>Projects</Link>
        <Link href="/#why-choose-us" onClick={(e) => { 
          setMobileMenuOpen(false); 
          if (typeof window !== 'undefined' && window.location.pathname === '/') {
            e.preventDefault();
            document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' }); 
          }
        }} className={activeSection === 'why-choose-us' ? 'active' : ''}>Why Choose Us</Link>
        
        <div 
          className="nav-dropdown-wrapper" 
          style={{ display: 'inline-block', position: 'relative' }}
          onMouseEnter={() => setDropdownOpen('learning')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/#learning" 
            onClick={(e) => {
              if (window.innerWidth <= 900) {
                e.preventDefault();
                setDropdownOpen(dropdownOpen === 'learning' ? '' : 'learning');
              } else {
                setMobileMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }} 
            className={activeSection === 'learning' ? 'active' : ''}
          >
            <span style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>Learning <span className="mobile-chevron">▼</span></span>
          </Link>
          {dropdownOpen === 'learning' && (
            <div className="nav-dropdown" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/#learning" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Learning Home</Link>
              <Link href="/#learning" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Courses</Link>
              <Link href="/#learning" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Internships</Link>
              <Link href="/#learning" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Workshops</Link>
              <Link href="/certificate" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Verify Certificates</Link>
            </div>
          )}
        </div>

        <div 
          className="portal-menu-wrapper" 
          style={{ display: 'inline-block', position: 'relative' }}
          onMouseEnter={() => setDropdownOpen('portal')}
          onMouseLeave={() => setDropdownOpen('')}
        >
          <Link 
            href="/portal" 
            onClick={(e) => {
              if (window.innerWidth <= 900 && user) {
                e.preventDefault();
                setDropdownOpen(dropdownOpen === 'portal' ? '' : 'portal');
              } else {
                setMobileMenuOpen(false);
              }
            }}
            style={{ opacity: 1, color: '#000', background: 'var(--acid)', padding: '6px 16px', borderRadius: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Customer Portal {user ? <CheckCircle size={14} strokeWidth={2} /> : ''}
          </Link>
          {dropdownOpen === 'portal' && user && (
            <div className="portal-dropdown" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/portal" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Dashboard</Link>
              <Link href="/portal/projects" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>My Projects</Link>
              <Link href="/portal/student-dashboard" className="dropdown-link" onClick={() => { setMobileMenuOpen(false); setDropdownOpen(''); }}>Learning</Link>
            </div>
          )}
        </div>
      </nav>
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .portal-dropdown, .nav-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.8);
          animation: dropdownFade 0.2s ease-out;
          z-index: 50;
        }
        .mega-dropdown {
          display: flex !important;
          flex-direction: row !important;
          gap: 40px;
          padding: 30px;
          width: max-content;
        }
        .mega-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .desktop-nav a { display: flex; align-items: center; }
        .mobile-chevron { display: none; }
        .mega-title {
          font-size: 11px;
          font-family: var(--mono, monospace);
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
          background: rgba(212, 255, 62, 0.1);
          color: var(--acid);
          padding-left: 16px;
        }
        .about-link {
          border-left: 0px solid transparent;
          transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .about-link:hover {
          border-left: 3px solid #FF6A2A;
          color: #FF6A2A;
          padding-left: 16px;
          background: rgba(255, 106, 42, 0.1);
          transform: translateX(4px);
        }
        @media(max-width:900px) {
          .desktop-nav {
            display: none;
          }
          .mobile-chevron { display: inline-block; font-size: 10px; }
          .desktop-nav.mobile-open {
            display: flex !important;
            flex-direction: column;
            align-items: flex-start;
            position: absolute;
            top: 100px; /* Adjusted for 100px header */
            left: 0;
            width: 100%;
            height: calc(100vh - 100px);
            overflow-y: auto;
            background: #050505;
            padding: 0 4vw 80px 4vw;
            border-bottom: 1px solid #333;
            z-index: 49;
            -webkit-overflow-scrolling: touch;
          }
          .desktop-nav.mobile-open > a, 
          .desktop-nav.mobile-open .nav-dropdown-wrapper > a,
          .desktop-nav.mobile-open .portal-menu-wrapper > a {
            width: 100%;
            text-align: left;
            font-size: 14px;
            padding: 20px 0;
            border-bottom: 1px solid #222;
            color: #fff;
            font-weight: 500;
            letter-spacing: 0.1em;
          }
          .desktop-nav.mobile-open .portal-menu-wrapper {
            width: 100%;
            border-bottom: none;
            padding-top: 15px;
          }
          .desktop-nav.mobile-open .nav-dropdown-wrapper {
            width: 100%;
            display: block !important;
          }
          .desktop-nav.mobile-open .nav-dropdown, 
          .desktop-nav.mobile-open .portal-dropdown {
            position: static !important;
            transform: none !important;
            left: auto !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            padding: 10px 0 10px 15px !important;
            min-width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            animation: none !important;
            border-left: 2px solid #333 !important;
            margin: 0 !important;
          }
          .desktop-nav.mobile-open .nav-dropdown a, 
          .desktop-nav.mobile-open .portal-dropdown a {
            border-bottom: none !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
            color: #aaa;
            letter-spacing: 0.05em;
          }
          .desktop-nav.mobile-open .nav-dropdown a:hover {
            color: var(--acid);
          }
          .desktop-nav.mobile-open .mega-dropdown {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 10px 0 10px 20px !important;
          }
          .desktop-nav.mobile-open .mega-col {
            gap: 12px !important;
          }
          .desktop-nav.mobile-open .mega-title {
            margin-bottom: 5px !important;
          }
          .menu-toggle {
            display: flex;
            flex-direction: column;
            gap: 6px;
            z-index: 100;
            padding: 10px;
          }
          .menu-toggle span {
            display: block;
            width: 28px;
            height: 2px;
            background: #fff;
            transition: all 0.3s ease;
          }
        }
        @media(max-width: 768px) {
          .brand a img { width: 140px !important; height: auto !important; }
        }
      `}</style>
      

      <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ marginLeft: 'auto' }}>
        <span style={{ transform: mobileMenuOpen ? 'translateY(8px) rotate(45deg)' : 'none' }}></span>
        <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
        <span style={{ transform: mobileMenuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }}></span>
      </button>
    </header>
  )
}
