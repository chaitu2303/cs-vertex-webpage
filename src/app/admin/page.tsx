import React, { Suspense } from 'react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'



async function DashboardStats() {
  const [
    teamCount,
    projectCount,
    serviceCount,
    leadCount,
    testimonialCount,
    quoteCount
  ] = await Promise.all([
    prisma.teamMember.count(),
    prisma.project.count(),
    prisma.service.count(),
    prisma.formSubmission.count(),
    prisma.testimonial.count(),
    prisma.quote.count()
  ])

  const stats = [
    { label: 'Quotes', value: quoteCount },
    { label: 'Form Leads', value: leadCount },
    { label: 'Team Members', value: teamCount },
    { label: 'Projects', value: projectCount },
    { label: 'Services', value: serviceCount },
    { label: 'Testimonials', value: testimonialCount },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {stats.map(stat => (
        <div key={stat.label} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--acid)', marginBottom: '5px' }}>{stat.value}</div>
          <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px', height: '100px', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '30px' }}>Dashboard Overview</h1>
      
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div style={{ marginTop: '40px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Welcome to the CS Vertex CMS</h2>
        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6 }}>
          Use the sidebar to navigate between different management modules. Any changes made here will be instantly reflected on the main public-facing website.
          Future-proofing is built in—you no longer need a developer to update projects, team members, notices, or learning content.
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

