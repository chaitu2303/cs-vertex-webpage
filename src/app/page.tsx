import { prisma } from '@/lib/prisma'
import { Header } from '../components/Header'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectsShowcase } from '../components/ProjectsShowcase'
import { ServiceCard } from '../components/ServiceCard'
import { FormspreeForm } from '../components/FormspreeForm'
import { LearningPlatform } from '../components/LearningPlatform'
import { TechOrbit } from '../components/TechOrbit'
import { NoticeBoard } from '../components/NoticeBoard'
import { FloatingActions } from '../components/FloatingActions'
import { FeedbackForm } from '../components/FeedbackForm'
import { DevelopmentProcess } from '../components/DevelopmentProcess'
import { Newsletter } from '../components/Newsletter'
import { TeamMemberCard } from '../components/TeamMemberCard'
import { AnnouncementBanner } from '../components/AnnouncementBanner'
import { QuoteFlowModal } from '../components/QuoteFlowModal'
import { MultiStepQuoteForm } from '../components/MultiStepQuoteForm'
import { ContactUsButton } from '../components/ContactUsButton'
import { WhyChooseUs } from '../components/WhyChooseUs'
import { LeadershipStats } from '../components/LeadershipStats'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

import { EmptyState } from '../components/EmptyState'

import { redirect } from 'next/navigation'
import { LaunchGate } from '../components/launch/LaunchGate'
import { OpeningDayBanner } from '../components/launch/OpeningDayBanner'

export const revalidate = 60
export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}&next=/portal`)
  }
  const [services, projects, team, announcements, testimonials] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.teamMember.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.announcement.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  ])

  const FORMSPREE_NEWSLETTER = "https://formspree.io/f/placeholder-newsletter"

  return (
    <LaunchGate>
      <QuoteFlowModal />
      <FloatingActions />
      
      {/* Top Utility Bar */}
      <div className="top-utility-bar" style={{ padding: '12px 4vw', background: '#050505', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <div className="utility-group" style={{ display: 'flex', gap: '20px' }}>
          <a href="mailto:hello@csvertex.com" style={{ color: '#aaa', textDecoration: 'none' }}>✉ <span style={{ color: '#fff' }}>hello@csvertex.com</span></a>
          <a href="tel:+917288977131" style={{ color: '#aaa', textDecoration: 'none' }}>☎ <span style={{ color: '#fff' }}>+91 72889 77131</span></a>
        </div>
        <div className="utility-group" style={{ display: 'flex', gap: '20px' }}>
          <a href="https://www.linkedin.com/company/cs-vertex/" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>In <span style={{ color: '#fff' }}>LinkedIn</span></a>
          <a href="https://www.instagram.com/cs_vertex" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>Ig <span style={{ color: '#fff' }}>Instagram</span></a>
        </div>
      </div>

      {/* Main Header with dynamic Portal Dropdown */}
      <Header />

      {/* 01. HERO SECTION */}
      <section id="home" className="hero">
        <div className="hero-grid"></div>
        <div className="hero-image"></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 4vw', position: 'relative', zIndex: 3 }}>
          <div className="hero-copy" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="eyebrow">
              <i></i> 01 / CS VERTEX POSITIONING
            </div>
            <h1>Software <em>&</em><br/>Hardware<br/>Engineering</h1>
            <p className="hero-lede">
              Enterprise AI, IoT networks, custom hardware, and scalable web solutions delivered with zero compromise.
            </p>

          </div>
        </div>
      </section>

      {/* 02. ABOUT CS VERTEX */}
      <section id="about" className="manifesto section-gap" style={{ background: 'var(--paper)', color: 'var(--ink)', borderBottom: '1px solid #ddd', display: 'block' }}>
        <div className="manifesto-body" style={{ gridColumn: '1 / -1', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="section-index"><i></i> <span>02</span> <span>/</span> <span>ABOUT CS VERTEX</span></div>
          <h2 style={{ fontSize: 'clamp(45px, 6vw, 96px)', marginBottom: '50px' }}>About <em>CS Vertex</em></h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', marginTop: '40px' }}>
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--acid)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Who We Are</h3>
              <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, margin: 0 }}>
                CS Vertex is a premier multi-disciplinary technology and engineering partner. We bridge the gap between complex software systems, Next.js web platforms, and custom embedded IoT PCB hardware design.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '10px', textTransform: 'uppercase' }}>Our Mission</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  To empower businesses, clients, and students by architecting scalable systems and deploying robust IoT automation.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '10px', textTransform: 'uppercase' }}>Our Vision</h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Pioneering intelligent automation and custom hardware networks that scale seamlessly from local to global operations.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '80px' }}>
            <LeadershipStats />
          </div>
        </div>
      </section>

      {/* 03. SERVICES & TECHNOLOGY */}
      <section id="services" className="capabilities section-gap">
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="cap-heading">
            <div className="section-index"><i></i> <span>03</span> <span>/</span> <span>SERVICES & TECHNOLOGY</span></div>
            <h2>Our <em>Services & Technology</em></h2>
            <p>End-to-End Delivery. Quality & Scalability. Long-Term Support across Software, AI, and Hardware.</p>
          </div>
          {services.length > 0 ? (
            <div className="cap-stage">
              <TechOrbit />
              <div className="cap-list">
                 {services.map((service, index) => (
                   <article key={service.id} className="cap-item">
                      <span>0{index + 1}</span>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                   </article>
                 ))}
              </div>
            </div>
          ) : (
            <EmptyState message="Services Catalog Coming Soon" height="300px" />
          )}
        </div>
      </section>

      {/* 04. FEATURED PROJECTS */}
      <section id="projects" className="systems section-gap">
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="systems-top">
            <div className="section-index" style={{marginBottom:0}}><i></i> <span>04</span> <span>/</span> <span>FEATURED PROJECTS</span></div>
            <p>ARCHITECTED FOR SCALE</p>
          </div>
          <div className="project-intro" style={{ margin: '0 0 55px 0' }}>
            <h2 style={{ color: 'var(--acid)' }}>Featured <span style={{ color: 'var(--ink)' }}>Projects</span></h2>
            <p>A portfolio of rigorous software implementations, smart IoT ecosystems, and autonomous robotic solutions deployed globally.</p>
          </div>
          {projects.length > 0 ? (
            <ProjectsShowcase projects={projects} />
          ) : (
            <EmptyState message="Projects Showcase Coming Soon" height="300px" />
          )}
        </div>
      </section>

      {/* 05. WHY CHOOSE CS VERTEX */}
      <section id="why-choose-us" className="systems section-gap" style={{ background: '#0B0B0B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-index"><i></i> <span>05</span> <span>/</span> <span>WHY CHOOSE CS VERTEX</span></div>
          <h2 style={{ fontSize: 'clamp(38px, 4.3vw, 70px)', marginBottom: '50px', color: 'var(--acid)', fontWeight: 500, letterSpacing: '-.065em', lineHeight: .93 }}>
            Why Choose <span style={{ color: '#ffffff', fontWeight: 400, fontStyle: 'normal' }}>CS Vertex</span>
          </h2>
          <WhyChooseUs />
        </div>
      </section>

      {/* 06. LEARNING PLATFORM */}
      <LearningPlatform />

      {/* 07. REQUEST A QUOTE */}
      <section id="quote" style={{ background: '#050505', padding: '80px 4vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="section-index" style={{marginBottom: 20}}><i></i> <span>07</span> <span>/</span> <span>REQUEST QUOTE</span></div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '10px' }}>Start a <em>Project</em></h2>
              <p style={{ margin: '20px auto 0', maxWidth: '600px', color: '#888', lineHeight: 1.6 }}>Ready to build? Share your project details and our engineering team will provide a comprehensive technical assessment and budget estimate.</p>
            </div>
            <MultiStepQuoteForm />
          </div>
        </div>
      </section>

      {/* 08. FEEDBACK */}
      <FeedbackForm testimonials={testimonials} />

      {/* 09. LEADERSHIP TEAM */}
      <section id="team" className="team section-gap">
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="team-heading">
            <div className="section-index"><i></i> <span>09</span> <span>/</span> <span>LEADERSHIP TEAM</span></div>
            <h2>Meet The Leadership Team Behind <em>CS Vertex</em></h2>
            <p>Software engineers, embedded systems specialists, AI innovators and product builders driving the next generation of intelligent solutions.</p>
          </div>

          {team.length > 0 ? (
            <div className="leadership-grid" style={{ display: 'grid', gap: '30px', margin: '0 auto', maxWidth: '1200px' }}>
              {team.map(member => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <EmptyState message="Team Roster Coming Soon" height="300px" />
          )}
        </div>
        <style>{`
          .leadership-grid {
             grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
             .leadership-grid {
                grid-template-columns: repeat(3, 1fr);
             }
          }
        `}</style>
      </section>

      {/* 10. ANNOUNCEMENTS & OFFERS */}
      <section id="announcements" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '80px 4vw', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="section-index" style={{marginBottom: 40}}><i></i> <span>10</span> <span>/</span> <span>ANNOUNCEMENTS & OFFERS</span></div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '40px' }}>Announcements / Exclusive <em>Offers</em></h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '40px', alignItems: 'flex-start' }}>
             <div style={{ background: '#111111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
               <img src="/assets/brochures/cs-vertex-packages.png" alt="Pricing Plan Offer" style={{ width: '100%', height: 'auto', display: 'block' }} />
               <div style={{ padding: '24px', background: 'linear-gradient(to right, #111, #1a1a1a)', borderTop: '1px solid #333' }}>
                 <div style={{ display: 'inline-block', background: '#FF5A2A', color: '#000', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.1em', marginBottom: '12px' }}>EARLY BIRD OFFER</div>
                 <h3 style={{ color: '#fff', fontSize: '24px', margin: '0 0 8px', fontWeight: 600 }}>Get 1 Year Free Maintenance</h3>
                 <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px' }}>Sign up now to grab our exclusive early bird offer. Secure, scalable, and fully maintained for a whole year at zero additional cost.</p>
                 <a href="#quote" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#FF5A2A', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>
                   GRAB NOW <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </a>
               </div>
             </div>
             
             <div style={{ background: '#111111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src="/assets/announcement.jpeg" alt="Latest Announcement" style={{ width: '100%', height: 'auto', display: 'block' }} />
             </div>
          </div>
        </div>
      </section>

      {/* 11 & 12. FOOTER */}
      <footer>
        <div className="footer-main">
          <div className="footer-label">CS VERTEX</div>
          <h2>Let&apos;s build <em>together</em></h2>
          <ContactUsButton />
        </div>
        <div className="footer-bottom">
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="#about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="#team">Leadership</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link href="#services">Software Engineering</Link>
            <Link href="#services">IoT & Embedded</Link>
            <Link href="#services">AI & Robotics</Link>
            <Link href="#learning">Learning Platform</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            <Link href="/admin/login" style={{ marginTop: '10px', color: '#666' }}>Admin Access</Link>
          </div>
          <div className="footer-col">
            <h4>Office Info</h4>
            <p style={{ fontSize: '12px', color: '#fff', margin: '0 0 10px', textTransform: 'none', letterSpacing: 'normal' }}>
              <strong>Hours:</strong><br/>
              Monday - Sunday<br/>
              8:00 AM - 12:00 PM IST
            </p>
            <p style={{ fontSize: '12px', color: '#fff', margin: '0 0 10px', textTransform: 'none', letterSpacing: 'normal' }}>
              <strong>Location:</strong><br/>
              Visakhapatnam, Andhra Pradesh, India
            </p>
            <p style={{ fontSize: '12px', color: '#fff', margin: '0', textTransform: 'none', letterSpacing: 'normal' }}>
              <strong>Online Support:</strong><br/>
              24/7 Ticket & Email Assistance
            </p>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <p style={{ fontSize: '12px', color: '#fff', margin: '0 0 10px', textTransform: 'none', letterSpacing: 'normal' }}>hello@csvertex.com<br/>+91 72889 77131</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px', marginBottom: '20px' }}>
               <a href="https://www.linkedin.com/company/cs-vertex/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
               <a href="https://www.instagram.com/cs_vertex" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            
            <h4 style={{ marginTop: '10px' }}>Newsletter</h4>
            <p style={{ fontSize: '12px', color: '#888', textTransform: 'none', letterSpacing: 'normal' }}>Get the latest updates on technology and edge computing.</p>
            <Newsletter actionUrl={FORMSPREE_NEWSLETTER} />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #222', fontSize: '13px', color: '#666' }}>
          &copy; 2026 CS Vertex. All Rights Reserved.
        </div>
      </footer>
    </LaunchGate>
  )
}

