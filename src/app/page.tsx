import { Mail, Phone, CheckCircle, FileText } from 'lucide-react'
import { Linkedin, Instagram } from '@/components/BrandIcons'
import { prisma } from '@/lib/prisma'
import { Header } from '../components/Header'
import { ProjectCard } from '../components/ProjectCard'
import dynamic from 'next/dynamic'
const ProjectsShowcase = dynamic(() => import('../components/ProjectsShowcase').then(m => m.ProjectsShowcase))
const PosterGallery = dynamic(() => import('@/components/PosterGallery').then(m => m.PosterGallery))
const LearningPlatform = dynamic(() => import('../components/LearningPlatform').then(m => m.LearningPlatform))
const OurProcess = dynamic(() => import('../components/OurProcess').then(m => m.OurProcess))
const ClientReviews = dynamic(() => import('../components/ClientReviews').then(m => m.ClientReviews))
const TechOrbit = dynamic(() => import('../components/TechOrbit').then(m => m.TechOrbit))
const FeedbackForm = dynamic(() => import('../components/FeedbackForm').then(m => m.FeedbackForm))
const MultiStepQuoteForm = dynamic(() => import('../components/MultiStepQuoteForm').then(m => m.MultiStepQuoteForm))
const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs').then(m => m.WhyChooseUs))
import Footer from '@/components/Footer'
import { HeroLogoAnimation } from '../components/HeroLogoAnimation'
import { NoticeBoard } from '../components/NoticeBoard'
import { FloatingActions } from '../components/FloatingActions'
import { DevelopmentProcess } from '../components/DevelopmentProcess'
import { Newsletter } from '../components/Newsletter'
import { TeamMemberCard } from '../components/TeamMemberCard'
import { AnnouncementBanner } from '../components/AnnouncementBanner'
import { QuoteFlowModal } from '../components/QuoteFlowModal'
import { ContactUsButton } from '../components/ContactUsButton'
import { ServiceCard } from '../components/ServiceCard'
import { FormspreeForm } from '../components/FormspreeForm'
import { LeadershipStats } from '../components/LeadershipStats'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ClientsMarquee } from '../components/ClientsMarquee'
import { MsmeLogo } from '@/components/MsmeLogo'

import { EmptyState } from '../components/EmptyState'

import { redirect } from 'next/navigation'
import { OpeningDayBanner } from '../components/launch/OpeningDayBanner'
import { FAQSection } from '../components/FAQ'

import { readFromJSON } from '@/lib/cms'

export const revalidate = 60; // force rebuild
export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  if (params.code) {
    redirect(`/auth/callback?code=${params.code}&next=/portal`)
  }
  const [services, projects, team, announcements, testimonials, internships, courses, workshops, clients, posters, faqs] = await Promise.all([
    readFromJSON('services', () => prisma.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } })),
    readFromJSON('projects', () => prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } })),
    readFromJSON('team', () => prisma.teamMember.findMany({ where: { published: true }, orderBy: { order: 'asc' } })),
    readFromJSON('announcements', () => prisma.announcement.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })),
    readFromJSON('testimonials', () => prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })),
    readFromJSON('internships', () => prisma.internship.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })),
    readFromJSON('courses', () => prisma.course.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })),
    readFromJSON('workshops', () => prisma.workshop.findMany({ where: { published: true }, orderBy: { date: 'asc' } })),
    readFromJSON('clients', () => prisma.clientLogo.findMany({ where: { published: true }, orderBy: { order: 'asc' } })),
    readFromJSON('posters', () => prisma.poster.findMany({ where: { published: true, showOnHome: true }, orderBy: { displayOrder: 'asc' } })),
    readFromJSON('faqs', () => prisma.fAQ.findMany({ where: { published: true }, orderBy: [{ isPinned: 'desc' }, { order: 'asc' }] })),
  ])

  const msmePdfSetting = await prisma.siteSetting.findUnique({ where: { key: 'msme_certificate_pdf' } })
  const finalMsmePdfUrl = msmePdfSetting?.value || "/assets/msme.pdf"

  const FORMSPREE_NEWSLETTER = "https://formspree.io/f/placeholder-newsletter"

  return (
    <>
      <QuoteFlowModal />
      <FloatingActions />
      
      {/* Top Utility Bar */}
      <div className="top-utility-bar" style={{ padding: '12px 4vw', background: '#050505', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <div className="utility-group" style={{ display: 'flex', gap: '20px' }}>
          <a href="mailto:hello@csvertex.com" className="group" style={{ color: '#aaa', textDecoration: 'none' }}>
            <Mail size={14} strokeWidth={1.5} className="hover-orange-icon" /> <span style={{ color: '#fff' }}>hello@csvertex.com</span>
          </a>
          <a href="tel:+917288977131" className="group" style={{ color: '#aaa', textDecoration: 'none' }}>
            <Phone size={14} strokeWidth={1.5} className="hover-orange-icon" /> <span style={{ color: '#fff' }}>+91 72889 77131</span>
          </a>
        </div>
        <div className="utility-group" style={{ display: 'flex', gap: '20px' }}>
          <a href="https://www.linkedin.com/company/cs-vertex/" className="group" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>
            <Linkedin size={14} strokeWidth={1.5} className="hover-orange-icon" /> <span style={{ color: '#fff' }}>LinkedIn</span>
          </a>
          <a href="https://www.instagram.com/cs_vertex" className="group" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa', textDecoration: 'none' }}>
            <Instagram size={14} strokeWidth={1.5} className="hover-orange-icon" /> <span style={{ color: '#fff' }}>Instagram</span>
          </a>
        </div>
      </div>

      {/* Main Header with dynamic Portal Dropdown */}
      <Header />

      {/* 01. HERO SECTION */}
      <section id="home" className="hero">
        <div className="hero-grid"></div>
        <div className="hero-image">
          <Image 
            src="/assets/vertex-hero.png" 
            alt="CS Vertex Hero" 
            fill 
            priority
            style={{ objectFit: 'cover', objectPosition: 'center right', opacity: 0.3, mixBlendMode: 'screen' }} 
          />
        </div>
        <div className="container-1400 hero-container" style={{ position: 'relative', zIndex: 3, padding: '0 4vw' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '40px' }}>

            {/* LEFT: Copy */}
            <div style={{ flex: '1 1 480px', maxWidth: '620px' }}>
              <div className="eyebrow">
                <i></i> 01 / ENGINEERING EXCELLENCE
              </div>

              <h1 style={{ marginTop: '22px' }}>
                Enterprise<br/>
                <em>Digital</em><br/>
                Engineering
              </h1>

              <p className="hero-lede" style={{ marginTop: '20px' }}>
                We engineer secure software, AI-powered solutions, embedded systems, and modern digital platforms for startups, enterprises, and global businesses.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
                <a href="#quote" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'var(--acid)', color: '#000',
                  padding: '14px 24px', borderRadius: '4px',
                  fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'opacity 0.2s',
                  whiteSpace: 'nowrap'
                }}>
                  Get Free Consultation →
                </a>
                <a href="#services" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'transparent', color: 'var(--paper)',
                  padding: '13px 24px', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'border-color 0.2s',
                  whiteSpace: 'nowrap'
                }}>
                  Explore Services
                </a>
              </div>

              {/* Trust Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '28px' }}>
                {['MSME Registered', 'Secure Development', 'End-to-End Solutions', 'Remote Worldwide'].map(badge => (
                  <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--acid)', fontSize: '11px', fontWeight: 700 }}>✓</span>
                    <span style={{ color: '#888', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Logo Animation */}
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="hero-logo-anim-wrap" style={{ width: '460px', height: '460px' }}>
                <HeroLogoAnimation />
              </div>
            </div>

          </div>

          {/* Bottom: Clients Marquee */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            <ClientsMarquee logos={clients} />
          </div>
        </div>
      </section>


      {/* 02. ABOUT CS VERTEX */}

      {/* 02. ABOUT CS VERTEX */}
      <section id="about" className="manifesto section-gap" style={{ background: 'var(--paper)', color: 'var(--ink)', borderBottom: '1px solid #ddd', display: 'block' }}>
        <div className="container-1400">
          <div className="section-index"><i></i> <span>02</span> <span>/</span> <span>ABOUT CS VERTEX</span></div>
          <h2 style={{ fontSize: 'clamp(45px, 6vw, 96px)', marginBottom: '50px' }}>About <em>CS Vertex</em></h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', marginTop: '40px' }}>
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--acid)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company Overview</h3>
              <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, margin: 0 }}>
                CS Vertex is a premier multi-disciplinary technology and engineering partner. We bridge the gap between complex software systems, Next.js web platforms, and custom embedded IoT PCB hardware design.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1000px', marginTop: '20px' }}>
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
        <div className="container-1400">
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

      {/* OUR PROCESS */}
      <OurProcess />
      {/* 04. FEATURED PROJECTS */}
      <section id="projects" className="systems section-gap">
        <div className="container-1400">
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
        <div className="container-1400">
          <div className="section-index"><i></i> <span>05</span> <span>/</span> <span>WHY CHOOSE CS VERTEX</span></div>
          <h2 style={{ fontSize: 'clamp(38px, 4.3vw, 70px)', marginBottom: '50px', color: 'var(--acid)', fontWeight: 500, letterSpacing: '-.065em', lineHeight: .93 }}>
            Why Choose <span style={{ color: '#ffffff', fontWeight: 400, fontStyle: 'normal' }}>CS Vertex</span>
          </h2>
          <WhyChooseUs />
        </div>
      </section>

      {/* 06. LEARNING PLATFORM */}
      <LearningPlatform internships={internships} courses={courses} workshops={workshops} />

      {/* 07. REQUEST A QUOTE */}
      <section id="quote" className="section-gap" style={{ background: '#050505' }}>
        <div className="container-1400">
          <div className="section-index" style={{marginBottom: 20}}><i></i> <span>07</span> <span>/</span> <span>REQUEST QUOTE</span></div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '10px', letterSpacing: '0.04em', wordSpacing: '0.12em' }}>Start a <em>Project</em></h2>
              <p style={{ margin: '20px auto 0', maxWidth: '600px', color: '#888', lineHeight: 1.6 }}>Ready to build? Share your project details and our engineering team will provide a comprehensive technical assessment and budget estimate.</p>
            </div>
            <MultiStepQuoteForm />
          </div>
        </div>
      </section>

      {/* 08. CLIENT REVIEWS */}
      <ClientReviews testimonials={testimonials} />

      {/* 09. FEEDBACK */}
      <FeedbackForm testimonials={testimonials} />
      {/* 09. LEADERSHIP TEAM MOVED TO ABOUT SECTION */}

      {/* 10. FAQ SECTION */}
      <FAQSection initialFaqs={faqs} />


      {/* 10. ANNOUNCEMENTS & OFFERS */}
      <section id="announcements" className="section-gap" style={{ background: 'var(--paper)', color: 'var(--ink)', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
        <div className="container-1400">
          <div className="section-index" style={{marginBottom: 40}}><i></i> <span>10</span> <span>/</span> <span>ANNOUNCEMENTS & OFFERS</span></div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '40px' }}>Announcements / Exclusive <em>Offers</em></h2>
          
          <PosterGallery posters={posters} />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  )
}

