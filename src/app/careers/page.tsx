import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Briefcase } from 'lucide-react'
import { JobApplyButton, InternshipApplyButton } from '@/components/RecruitmentButtons'

export const metadata: Metadata = {
  title: 'Careers | CS Vertex — Join Our Team',
  description: 'Join CS Vertex and help build innovative software, AI, embedded systems, and learning solutions. Explore internships, full-time roles, and opportunities for students and professionals.',
}

export const dynamic = 'force-dynamic'

export default async function CareersPage() {
  const openPositions = await prisma.careerPosition.findMany({
    where: { published: true, status: 'Open' },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="careers-page">

      {/* ── Hero ── */}
      <section className="careers-hero">
        <div className="careers-container">
          <div className="careers-hero-label">CAREERS AT CS VERTEX</div>
          <h1 className="careers-hero-title">
            Build the Future of<br /><em>Technology</em> With Us
          </h1>
          <p className="careers-hero-sub">
            We're a remote-first technology startup building innovative software, AI systems, embedded solutions, and learning platforms. We welcome engineers, designers, researchers, and students who are passionate about creating real-world impact.
          </p>
          <div className="careers-hero-actions">
            <JobApplyButton className="careers-btn-primary" />
            <InternshipApplyButton className="careers-btn-secondary" />
          </div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section className="careers-section" style={{ background: '#0a0a0a' }}>
        <div className="careers-container">
          <div className="careers-section-label">JOIN US</div>
          <h2 className="careers-section-title">Open Positions</h2>
          
          <div style={{ marginTop: '40px' }}>
            {openPositions.length > 0 ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {openPositions.map((pos) => (
                  <div key={pos.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontWeight: 600 }}>{pos.title}</h3>
                      <div style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '14px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14}/> {pos.department}</span>
                        <span>•</span>
                        <span>{pos.location}</span>
                        <span>•</span>
                        <span>{pos.type}</span>
                      </div>
                    </div>
                    <JobApplyButton className="apply-now-link" />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '16px' }}>No openings available at the moment. Please check again later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="careers-section">
        <div className="careers-container">
          <div className="careers-section-label">WHY CS VERTEX</div>
          <h2 className="careers-section-title">A Place to Learn, Build, and Grow</h2>
          <p className="careers-section-sub">CS Vertex is more than a company — it's a collaborative environment where talent meets opportunity. We believe in building great products through great people.</p>

          <div className="careers-values-grid">
            {[
              { icon: '🌐', title: 'Remote-First', desc: 'Work from anywhere. Our team collaborates across cities and time zones with flexibility and trust.' },
              { icon: '🚀', title: 'Real Projects', desc: 'Work on live client projects, AI products, and internal platforms — not toy exercises.' },
              { icon: '🎓', title: 'Learning Culture', desc: 'Continuous learning is part of our DNA. We support skill development, experimentation, and innovation.' },
              { icon: '🤝', title: 'Mentorship', desc: 'Get direct guidance from experienced engineers and domain experts throughout your journey.' },
              { icon: '💡', title: 'Innovation', desc: 'Bring your ideas. We encourage creative problem-solving and engineering excellence.' },
              { icon: '📜', title: 'Certificates', desc: 'Earn verified certificates upon successful program completion to strengthen your professional profile.' },
              { icon: '🔒', title: 'Transparent Process', desc: 'Clear communication, honest feedback, and a respectful working environment at every level.' },
              { icon: '📈', title: 'Career Growth', desc: 'As we grow, you grow. Early contributors have the opportunity to take on leadership roles.' },
            ].map(v => (
              <div key={v.title} className="careers-value-card">
                <span className="careers-value-icon">{v.icon}</span>
                <h3 className="careers-value-title">{v.title}</h3>
                <p className="careers-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments / Opportunities ── */}
      <section className="careers-section careers-dark">
        <div className="careers-container">
          <div className="careers-section-label">OPPORTUNITIES</div>
          <h2 className="careers-section-title">Areas We're Building In</h2>
          <p className="careers-section-sub">CS Vertex is growing across multiple technology domains. Whether you're a seasoned professional or a motivated student, there's a place for you.</p>

          <div className="careers-dept-grid">
            {[
              {
                dept: 'Software Engineering',
                desc: 'Build modern web applications, enterprise platforms, APIs, backend systems, admin dashboards, ERP, CRM, SaaS, and mobile applications.',
                skills: ['React', 'Next.js', 'Node.js', 'Python', 'Java', 'MySQL', 'MongoDB'],
              },
              {
                dept: 'Artificial Intelligence & ML',
                desc: 'Develop AI models, intelligent automation systems, computer vision, natural language processing, recommendation engines, and predictive analytics.',
                skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'LangChain', 'FastAPI'],
              },
              {
                dept: 'Embedded Systems & IoT',
                desc: 'Design hardware-software integrated solutions using microcontrollers, sensors, IoT platforms, firmware, robotics, and edge computing.',
                skills: ['Embedded C', 'Arduino', 'ESP32', 'Raspberry Pi', 'MQTT', 'IoT Cloud'],
              },
              {
                dept: 'Cybersecurity',
                desc: 'Work on vulnerability assessments, penetration testing, secure coding practices, network security, and infrastructure protection.',
                skills: ['Network Security', 'Pen Testing', 'Secure Coding', 'VAPT', 'Linux'],
              },
              {
                dept: 'UI/UX Design',
                desc: 'Design modern user interfaces, product experiences, brand identity, motion graphics, and interactive digital systems.',
                skills: ['Figma', 'UI Design', 'Motion Design', 'Brand Identity', 'Prototyping'],
              },
              {
                dept: 'Operations & Coordination',
                desc: 'Manage client communication, project documentation, workflow coordination, quality assurance, and team operations.',
                skills: ['Project Management', 'Documentation', 'Client Communication', 'QA'],
              },
            ].map(d => (
              <div key={d.dept} className="careers-dept-card">
                <h3 className="careers-dept-title">{d.dept}</h3>
                <p className="careers-dept-desc">{d.desc}</p>
                <div className="careers-dept-skills">
                  {d.skills.map(s => <span key={s} className="careers-skill-chip">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internship Program ── */}
      <section id="internship" className="careers-section">
        <div className="careers-container">
          <div className="careers-section-label">INTERNSHIP PROGRAM</div>
          <h2 className="careers-section-title">Real Experience. Real Projects.</h2>
          <p className="careers-section-sub">Our internship program is designed for students and fresh graduates who want to gain practical industry exposure by working on live projects under the guidance of experienced mentors.</p>

          <div className="careers-intern-grid">
            <div className="careers-intern-info">
              <h3>What Interns Work On</h3>
              <ul className="careers-intern-list">
                {[
                  'Live client software projects',
                  'Internal product development',
                  'Artificial intelligence research & implementation',
                  'Embedded systems and IoT prototyping',
                  'Web application development',
                  'UI/UX design projects',
                  'Cybersecurity assessments',
                  'Documentation and technical writing',
                ].map(item => (
                  <li key={item}>
                    <span className="careers-check">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="careers-intern-benefits">
              <h3>What You Gain</h3>
              <div className="careers-benefit-list">
                {[
                  { label: 'Certificate', desc: 'Verified certificate upon successful completion based on performance.' },
                  { label: 'Industry Mentorship', desc: 'Direct guidance from domain experts and senior engineers.' },
                  { label: 'Portfolio Building', desc: 'Real project contributions to showcase to future employers.' },
                  { label: 'Resume Support', desc: 'Help crafting a professional resume that highlights your internship work.' },
                  { label: 'Interview Prep', desc: 'Mock interviews, technical Q&A, and career guidance sessions.' },
                  { label: 'Career Guidance', desc: 'Advice on career paths, specialisations, and industry opportunities.' },
                ].map(b => (
                  <div key={b.label} className="careers-benefit-item">
                    <strong>{b.label}</strong>
                    <p>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="careers-intern-note">
            <p>Internship schedules, fees, duration, batch availability, and eligibility criteria may change. Updated details are shared via official channels at the time of application. Certificates are issued upon successful completion based on performance evaluation.</p>
          </div>
        </div>
      </section>

      {/* ── Hiring Process ── */}
      <section className="careers-section careers-dark">
        <div className="careers-container">
          <div className="careers-section-label">HIRING PROCESS</div>
          <h2 className="careers-section-title">How to Join CS Vertex</h2>
          <p className="careers-section-sub">Our selection process is straightforward, transparent, and focused on finding people who are genuinely passionate about technology and building things.</p>

          <div className="careers-process-steps">
            {[
              { step: '01', title: 'Application Submission', desc: 'Send your resume and a brief introduction to hello@csvertex.com with the role or department you are interested in.' },
              { step: '02', title: 'Resume Screening', desc: 'Our team reviews your application to assess your background, skills, and fit for the available opportunities.' },
              { step: '03', title: 'Technical Assessment', desc: 'Shortlisted candidates are given a practical task relevant to the role — a coding challenge, design brief, or technical exercise.' },
              { step: '04', title: 'Interview', desc: 'A conversation with our team to understand your experience, problem-solving approach, and alignment with CS Vertex values.' },
              { step: '05', title: 'Final Selection', desc: 'Selected candidates receive a formal offer or internship confirmation with details of responsibilities and expectations.' },
              { step: '06', title: 'Onboarding', desc: 'We guide you through onboarding, introduce you to the team, set up your tools, and help you contribute from day one.' },
            ].map((s, i) => (
              <div key={s.step} className="careers-step">
                <div className="careers-step-number">{s.step}</div>
                <div className="careers-step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < 5 && <div className="careers-step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="careers-cta">
        <div className="careers-container">
          <h2 className="careers-cta-title">Ready to Join the Team?</h2>
          <p className="careers-cta-sub">Send your resume and a brief introduction to our team. We'd love to hear from you.</p>
          <div className="careers-hero-actions">
            <JobApplyButton className="careers-btn-primary" text="Send Application" />
            <InternshipApplyButton className="careers-btn-secondary" text="View Internships" />
          </div>
          <p className="careers-cta-email">hello@csvertex.com</p>
        </div>
      </section>

      <style>{`
        .careers-page {
          background: #050505;
          color: #ededed;
          font-family: var(--font-manrope, sans-serif);
          min-height: 100vh;
        }
        .careers-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Hero */
        .careers-hero {
          padding: 100px 0 80px;
          border-bottom: 1px solid #161616;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,90,42,0.06) 0%, transparent 60%);
        }
        .careers-hero-label {
          font-size: 11px;
          font-family: monospace;
          letter-spacing: 0.18em;
          color: #FF5A2A;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .careers-hero-title {
          font-size: clamp(36px, 5vw, 62px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0 0 24px;
        }
        .careers-hero-title em {
          font-style: italic;
          color: #FF5A2A;
        }
        .careers-hero-sub {
          font-size: 17px;
          color: #888;
          line-height: 1.7;
          max-width: 620px;
          margin: 0 0 36px;
        }
        .careers-hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .careers-btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          background: #FF5A2A;
          color: #fff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .careers-btn-primary:hover { background: #e04a1e; transform: translateY(-1px); }
        .careers-btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 12px 28px;
          background: transparent;
          color: #ededed;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .careers-btn-secondary:hover { border-color: #FF5A2A; color: #FF5A2A; }

        /* Sections */
        .careers-section { padding: 80px 0; border-bottom: 1px solid #161616; }
        .careers-dark { background: #080808; }
        .careers-section-label {
          font-size: 10px;
          font-family: monospace;
          letter-spacing: 0.18em;
          color: #FF5A2A;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .careers-section-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0 0 14px;
        }
        .careers-section-sub {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          max-width: 640px;
          margin: 0 0 48px;
        }

        /* Values grid */
        .careers-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .careers-value-card {
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 22px 20px;
          transition: border-color 0.2s ease;
        }
        .careers-value-card:hover { border-color: rgba(255,90,42,0.25); }
        .careers-value-icon { font-size: 26px; display: block; margin-bottom: 12px; }
        .careers-value-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 8px; }
        .careers-value-desc { font-size: 13px; color: #666; line-height: 1.6; margin: 0; }

        /* Departments */
        .careers-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .careers-dept-card {
          background: #0c0c0c;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          padding: 24px 22px;
          transition: border-color 0.2s ease;
        }
        .careers-dept-card:hover { border-color: rgba(255,90,42,0.2); }
        .careers-dept-title { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 10px; }
        .careers-dept-desc { font-size: 13px; color: #666; line-height: 1.6; margin: 0 0 16px; }
        .careers-dept-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .careers-skill-chip {
          font-size: 10px;
          font-family: monospace;
          color: #555;
          background: rgba(255,255,255,0.03);
          border: 1px solid #1e1e1e;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }

        /* Internship */
        .careers-intern-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        @media (max-width: 700px) { .careers-intern-grid { grid-template-columns: 1fr; } }
        .careers-intern-info h3, .careers-intern-benefits h3 {
          font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 20px;
        }
        .careers-intern-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .careers-intern-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #888; }
        .careers-check { color: #FF5A2A; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
        .careers-benefit-list { display: flex; flex-direction: column; gap: 14px; }
        .careers-benefit-item { padding: 14px 16px; background: #0c0c0c; border: 1px solid #1a1a1a; border-radius: 10px; }
        .careers-benefit-item strong { font-size: 13px; color: #FF5A2A; display: block; margin-bottom: 4px; }
        .careers-benefit-item p { font-size: 12px; color: #666; margin: 0; line-height: 1.5; }
        .careers-intern-note {
          background: rgba(255,90,42,0.04);
          border: 1px solid rgba(255,90,42,0.12);
          border-radius: 10px;
          padding: 16px 20px;
          font-size: 12px;
          color: #666;
          line-height: 1.6;
        }
        .careers-intern-note p { margin: 0; }

        /* Hiring steps */
        .careers-process-steps { display: flex; flex-direction: column; gap: 0; }
        .careers-step { display: flex; align-items: flex-start; gap: 20px; position: relative; padding-bottom: 32px; }
        .careers-step:last-child { padding-bottom: 0; }
        .careers-step-number {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,90,42,0.1); border: 1px solid rgba(255,90,42,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-family: monospace; font-weight: 700; color: #FF5A2A;
          flex-shrink: 0; position: relative; z-index: 1;
        }
        .careers-step-content { padding-top: 8px; }
        .careers-step-content h3 { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .careers-step-content p { font-size: 13px; color: #666; line-height: 1.6; margin: 0; max-width: 520px; }
        .careers-step-connector {
          position: absolute;
          left: 22px;
          top: 44px;
          bottom: 0;
          width: 1px;
          background: #1a1a1a;
        }

        /* CTA */
        .careers-cta {
          padding: 80px 0;
          text-align: center;
          background: radial-gradient(ellipse at 50% 50%, rgba(255,90,42,0.05) 0%, transparent 70%);
        }
        .careers-cta-title { font-size: clamp(26px, 3.5vw, 38px); font-weight: 700; color: #fff; margin: 0 0 14px; letter-spacing: -0.02em; }
        .careers-cta-sub { font-size: 15px; color: #666; margin: 0 0 32px; }
        .careers-cta .careers-hero-actions { justify-content: center; }
        .careers-cta-email { margin-top: 20px; font-size: 13px; color: #444; }

        @media (max-width: 600px) {
          .careers-hero { padding: 70px 0 50px; }
          .careers-section { padding: 56px 0; }
          .careers-cta { padding: 56px 0; }
        }
        .apply-now-link {
          padding: 10px 24px;
          background: var(--acid);
          color: #000;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </main>
  )
}
