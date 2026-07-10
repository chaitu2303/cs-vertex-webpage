import { prisma } from '@/lib/prisma'
import { Header } from '@/components/Header'
import Footer from '@/components/Footer'
import { TeamMemberCard } from '@/components/TeamMemberCard'
import { EmptyState } from '@/components/EmptyState'
import { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'
import { GradientHeading } from '@/components/ui/GradientHeading'
import Link from 'next/link'
import Image from 'next/image'
import { MsmeLogo } from '@/components/MsmeLogo'
import { CheckCircle, FileText } from 'lucide-react'
export const metadata: Metadata = {
  title: 'About | CS Vertex',
  description: 'Learn about CS Vertex and meet our leadership team.',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const team = await prisma.teamMember.findMany({ 
    where: { published: true }, 
    orderBy: { order: 'asc' } 
  })
  const msmePdfSetting = await prisma.siteSetting.findUnique({ where: { key: 'msme_certificate_pdf' } })
  const finalMsmePdfUrl = msmePdfSetting?.value || "/assets/msme.pdf"

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, paddingTop: '140px' }}>
        
        {/* LEADERSHIP SECTION */}
        <section id="leadership" style={{ padding: '60px 0 120px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="container-1400">
            <FadeUp>
              <div className="section-index" style={{ marginBottom: '30px' }}><i></i> <span>01</span> <span>/</span> <span>LEADERSHIP TEAM</span></div>
              <div className="team-heading" style={{ marginBottom: '60px' }}>
                <GradientHeading as="h1" style={{ fontSize: 'clamp(48px, 6vw, 64px)', marginBottom: '20px' }}>
                  Leadership Team
                </GradientHeading>
                <p style={{ color: '#666666', maxWidth: '700px', margin: '0', fontSize: '18px', lineHeight: 1.6 }}>
                  Software engineers, embedded systems specialists, AI innovators and product builders driving the next generation of intelligent solutions.
                </p>
              </div>
            </FadeUp>

            {team.length > 0 ? (
              <FadeUp delay={0.2}>
                <div className="team-flex-container">
                  {team.map(member => (
                    <div className="team-flex-item" key={member.id}>
                      <TeamMemberCard member={member} />
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  .team-flex-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 30px;
                    justify-content: center;
                    align-items: stretch;
                  }
                  .team-flex-item {
                    width: calc(16.666% - 25px);
                    display: flex;
                  }
                  .team-flex-item > * {
                    width: 100%;
                    height: 100%;
                  }
                  @media (max-width: 1200px) {
                    .team-flex-item { width: calc(25% - 22.5px); }
                  }
                  @media (max-width: 1024px) {
                    .team-flex-item { width: calc(33.333% - 20px); }
                  }
                  @media (max-width: 768px) {
                    .team-flex-item { width: calc(50% - 15px); }
                  }
                  @media (max-width: 480px) {
                    .team-flex-item { width: 100%; }
                  }
                `}} />
              </FadeUp>
            ) : (
              <EmptyState message="Team Roster Coming Soon" height="300px" />
            )}
          </div>
        </section>

        {/* COMPANY SECTION */}
        <section id="company" style={{ padding: '120px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="container-1400">
            <FadeUp>
              <div className="section-index" style={{ marginBottom: '30px' }}><i></i> <span>02</span> <span>/</span> <span>COMPANY</span></div>
              <GradientHeading as="h2" style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '40px' }}>
                About CS Vertex
              </GradientHeading>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: '#FF6A2A', marginBottom: '16px', fontWeight: 700 }}>Who We Are</h3>
                  <p style={{ color: '#666666', fontSize: '18px', lineHeight: 1.7, marginBottom: '24px' }}>
                    CS Vertex is a premier technology enterprise specializing in scalable software architecture, artificial intelligence platforms, IoT integrations, and custom hardware engineering. We build robust digital foundations for businesses looking to innovate and scale globally.
                  </p>
                  <h3 style={{ fontSize: '20px', color: '#FF6A2A', marginBottom: '16px', fontWeight: 700 }}>Technology Expertise</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['Enterprise Software', 'Artificial Intelligence', 'Embedded Systems', 'IoT', 'Cybersecurity', 'Cloud Computing'].map(tech => (
                      <span key={tech} style={{ padding: '6px 14px', background: 'rgba(0,0,0,0.04)', borderRadius: '20px', fontSize: '14px', fontWeight: 600, color: '#444444' }}>{tech}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', color: '#FF6A2A', marginBottom: '16px', fontWeight: 700 }}>Why Businesses Choose Us</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Uncompromised Code Quality',
                      'End-to-End Product Development',
                      'Agile & Transparent Processes',
                      'Global Remote Services',
                      'Long-Term Technical Partnerships'
                    ].map(reason => (
                      <li key={reason} style={{ color: '#666666', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#FF6A2A', fontSize: '20px' }}>•</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* VISION SECTION */}
        <section id="vision" style={{ padding: '120px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div className="container-1400">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
              <div style={{ flex: '1 1 500px' }}>
                <FadeUp>
                  <div className="section-index" style={{ marginBottom: '30px' }}><i></i> <span>03</span> <span>/</span> <span>VISION</span></div>
                  <GradientHeading as="h2" style={{ fontSize: 'clamp(48px, 6vw, 64px)', marginBottom: '30px' }}>
                    Future Vision
                  </GradientHeading>
                  <p style={{ color: '#666666', fontSize: '18px', lineHeight: 1.7, marginBottom: '24px' }}>
                    We envision a future where intelligent enterprise solutions seamlessly integrate software, hardware, and AI to solve the world's most complex challenges. Our goal is to pioneer the next wave of global digital transformation.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                    <div>
                      <h4 style={{ color: '#444444', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Global Expansion</h4>
                      <p style={{ color: '#666666', fontSize: '15px' }}>Scaling our enterprise solutions to serve global markets.</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#444444', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>AI & Innovation</h4>
                      <p style={{ color: '#666666', fontSize: '15px' }}>Pushing the boundaries of artificial intelligence.</p>
                    </div>
                  </div>
                </FadeUp>
              </div>
              <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                <FadeUp delay={0.2}>
                  <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255, 106, 42, 0.1)" strokeWidth="2"/>
                    <circle cx="50" cy="50" r="30" stroke="rgba(255, 106, 42, 0.2)" strokeWidth="4"/>
                    <circle cx="50" cy="50" r="15" fill="#FF6A2A"/>
                    <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" stroke="#FF6A2A" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION SECTION */}
        <section id="mission" style={{ padding: '120px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="container-1400">
            <FadeUp>
              <div className="section-index" style={{ marginBottom: '30px' }}><i></i> <span>04</span> <span>/</span> <span>MISSION</span></div>
              <GradientHeading as="h2" style={{ fontSize: 'clamp(48px, 6vw, 64px)', marginBottom: '60px' }}>
                Mission
              </GradientHeading>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {[
                  { title: 'Customer-First', desc: 'Prioritizing client success through tailored engineering.' },
                  { title: 'Quality & Innovation', desc: 'Delivering uncompromised quality and cutting-edge solutions.' },
                  { title: 'Secure Development', desc: 'Embedding security into the core of our software lifecycle.' },
                  { title: 'Long-Term Partnerships', desc: 'Building trust through transparency and reliability.' },
                  { title: 'Continuous Learning', desc: 'Staying ahead of the curve in a rapidly evolving industry.' }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '30px', background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 106, 42, 0.1)', color: '#FF6A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '20px' }}>
                      {i + 1}
                    </div>
                    <h3 style={{ fontSize: '20px', color: '#444444', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ color: '#666666', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* MSME SECTION */}
        <section id="msme" style={{ padding: '120px 0' }}>
          <div className="container-1400">
            <FadeUp>
              <div className="section-index" style={{ marginBottom: '30px' }}><i></i> <span>05</span> <span>/</span> <span>CREDENTIALS</span></div>
              <GradientHeading as="h2" style={{ fontSize: 'clamp(48px, 6vw, 64px)', marginBottom: '20px' }}>
                MSME Registered
              </GradientHeading>
              <p style={{ color: '#666666', fontSize: '18px', maxWidth: '600px', marginBottom: '50px' }}>
                CS Vertex is officially registered under the Ministry of Micro, Small and Medium Enterprises, Government of India.
              </p>

              <div className="msme-premium-card-about">
                <div className="msme-card-content">
                  <h3 style={{ color: '#111', fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>Registration Details</h3>
                  
                  <div className="msme-details-grid">
                    <div>
                      <span className="msme-label">Enterprise Type</span>
                      <span className="msme-value">Micro Enterprise</span>
                    </div>

                    <div>
                      <span className="msme-label">Udyam Registration Number</span>
                      <span className="msme-value" style={{ color: 'var(--acid)', fontFamily: 'var(--mono)' }}>UDYAM-XX-XX-XXXXXXX</span>
                    </div>
                    <div>
                      <span className="msme-label">Verified Status</span>
                      <span className="msme-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                        <CheckCircle size={18} /> Government Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="msme-card-logo">
                  <div className="msme-logo-container-large">
                    <MsmeLogo />
                  </div>
                </div>
              </div>

              <style>{`
                .msme-premium-card-about {
                  background: #fff;
                  border: 1px solid rgba(0,0,0,0.08);
                  border-radius: 24px;
                  overflow: hidden;
                  display: flex;
                  flex-wrap: wrap;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
                  transition: all 0.3s ease;
                  animation: msmeFadeIn 0.5s ease forwards;
                }
                .msme-premium-card-about:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 16px 50px rgba(0,0,0,0.06);
                }
                .msme-card-content {
                  flex: 1 1 500px;
                  padding: 50px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                }
                .msme-card-logo {
                  flex: 0 0 350px;
                  padding: 50px;
                  background: #fcfcfc;
                  border-left: 1px solid rgba(0,0,0,0.05);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .msme-logo-container-large {
                  width: 200px;
                  height: 200px;
                  animation: msmeScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .msme-details-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 24px;
                  margin-bottom: 40px;
                }
                .msme-label {
                  display: block;
                  color: #888;
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  font-weight: 600;
                  margin-bottom: 6px;
                }
                .msme-value {
                  color: #111;
                  font-size: 18px;
                  font-weight: 600;
                }
                .msme-card-actions {
                  display: flex;
                  gap: 16px;
                }
                .msme-btn-primary {
                  padding: 14px 28px;
                  background: var(--acid);
                  color: #fff;
                  border-radius: 14px;
                  font-size: 15px;
                  font-weight: 600;
                  text-decoration: none;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  box-shadow: 0 4px 14px rgba(255,90,42,0.3);
                  transition: all 0.2s ease;
                }
                .msme-btn-primary:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(255,90,42,0.4);
                }
                .msme-btn-primary:hover .msme-btn-icon {
                  transform: scale(1.1);
                }
                .msme-btn-secondary {
                  padding: 14px 28px;
                  background: transparent;
                  color: #444;
                  border: 1px solid #ddd;
                  border-radius: 14px;
                  font-size: 15px;
                  font-weight: 600;
                  text-decoration: none;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  transition: all 0.2s ease;
                }
                .msme-btn-secondary:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 16px rgba(0,0,0,0.05);
                  border-color: #bbb;
                  color: var(--acid);
                }
                .msme-btn-secondary:hover .msme-btn-icon {
                  transform: scale(1.1);
                }
                .msme-btn-icon {
                  transition: transform 0.2s ease;
                }
                @keyframes msmeFadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes msmeScale {
                  from { transform: scale(0.8); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                @media (max-width: 900px) {
                  .msme-details-grid { grid-template-columns: 1fr; }
                  .msme-card-logo { border-left: none; border-top: 1px solid rgba(0,0,0,0.05); flex: 1 1 100%; order: 1; padding: 40px; }
                  .msme-card-content { order: 2; padding: 40px; }
                  .msme-logo-container-large { width: 150px; height: 150px; }
                }
                @media (max-width: 600px) {
                  .msme-card-actions { flex-direction: column; }
                  .msme-btn-primary, .msme-btn-secondary { justify-content: center; width: 100%; }
                }
              `}</style>
            </FadeUp>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
