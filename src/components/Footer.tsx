import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { Linkedin, Instagram } from '@/components/BrandIcons'

export default function Footer() {
  return (
    <footer style={{ background: '#030303', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '60px', color: '#888', fontFamily: 'var(--sans, system-ui, sans-serif)' }}>
      <div className="container-1400" style={{ margin: '0 auto', padding: '0 4vw' }}>
        
        {/* Top Section */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '340px' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <Image src="/logo-nav.png" alt="CS Vertex" width={140} height={45} style={{ objectFit: 'contain' }} />
            </Link>
            <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0, color: '#777', letterSpacing: '0.01em' }}>
              We engineer scalable software, AI platforms, IoT systems, and custom hardware. Delivering uncompromised digital transformation for modern enterprises.
            </p>
            <div style={{ display: 'flex', gap: '14px', marginTop: '5px' }}>
              <a href="https://linkedin.com/company/csvertex" target="_blank" rel="noreferrer" className="footer-social-link">
                <Linkedin size={16} />
              </a>
              <a href="https://instagram.com/csvertex" target="_blank" rel="noreferrer" className="footer-social-link">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--mono)' }}>Company</h4>
            <Link href="/about" className="footer-nav-link">About Us</Link>
            <Link href="/about#team" className="footer-nav-link">Leadership</Link>
            <Link href="/careers" className="footer-nav-link">Careers</Link>
            <Link href="/certificate" className="footer-nav-link">Verify Credentials</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--mono)' }}>Services</h4>
            <Link href="/#services" className="footer-nav-link">Software Engineering</Link>
            <Link href="/#services" className="footer-nav-link">AI Solutions</Link>
            <Link href="/#services" className="footer-nav-link">IoT & Hardware</Link>
            <Link href="/#services" className="footer-nav-link">Cybersecurity</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--mono)' }}>Legal</h4>
            <Link href="/privacy" className="footer-nav-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-nav-link">Terms of Service</Link>
            <Link href="/refunds" className="footer-nav-link">Refund Policy</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--mono)' }}>Connect</h4>
            <a href="mailto:hello@csvertex.com" className="footer-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} /> hello@csvertex.com
            </a>
            <Link href="#quote" className="footer-cta-link" style={{ color: '#000' }}>
              Request Consultation
            </Link>
          </div>

        </div>

        {/* Bottom Section */}
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.02em', color: '#666' }}>
            © {new Date().getFullYear()} CS Vertex. Engineered with precision.
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '10px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
            <span>MSME Registered Enterprise</span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
            margin-bottom: 20px;
          }
        }
        .footer-social-link {
          color: #555;
          transition: color 0.2s, transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .footer-social-link:hover {
          color: var(--acid);
          background: rgba(255,90,42,0.1);
          border-color: rgba(255,90,42,0.3);
          transform: translateY(-2px);
        }
        .footer-nav-link {
          color: #777;
          text-decoration: none;
          font-size: 13.5px;
          transition: color 0.2s, padding-left 0.2s;
        }
        .footer-nav-link:hover {
          color: #fff;
          padding-left: 4px;
        }
        .footer-cta-link {
          display: inline-block;
          margin-top: 4px;
          padding: 10px 20px;
          background: #FF6A2A;
          color: #000;
          font-size: 10px;
          font-family: var(--mono);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid #FF6A2A;
          border-radius: 4px;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
          width: fit-content;
        }
        .footer-cta-link:hover {
          background: #FF7D44;
          border-color: #FF7D44;
          color: #000;
        }
      `}</style>
    </footer>
  )
}
