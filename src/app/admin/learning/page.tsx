export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminLearningOverview() {
  const [
    internshipCount,
    courseCount,
    workshopCount,
    pendingInternships,
    pendingCourses,
    pendingWorkshops
  ] = await Promise.all([
    prisma.internship.count(),
    prisma.course.count(),
    prisma.workshop.count(),
    prisma.internshipApplication.count({ where: { status: 'Pending' } }),
    prisma.courseRegistration.count({ where: { status: 'Pending' } }),
    prisma.workshopRegistration.count({ where: { status: 'Pending' } }),
  ])

  const totalPending = pendingInternships + pendingCourses + pendingWorkshops

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '20px' }}>Learning Platform Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--acid)', marginBottom: '5px' }}>{internshipCount}</div>
          <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Internships</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--acid)', marginBottom: '5px' }}>{courseCount}</div>
          <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Courses</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--acid)', marginBottom: '5px' }}>{workshopCount}</div>
          <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Workshops</div>
        </div>
        <div style={{ background: totalPending > 0 ? 'rgba(255, 68, 68, 0.1)' : '#111', border: totalPending > 0 ? '1px solid rgba(255, 68, 68, 0.3)' : '1px solid #222', borderRadius: '8px', padding: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 600, color: totalPending > 0 ? '#ff4444' : 'var(--acid)', marginBottom: '5px' }}>{totalPending}</div>
          <div style={{ fontSize: '13px', color: totalPending > 0 ? '#ff4444' : '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Applications</div>
        </div>
      </div>

      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '30px' }}>
        <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '15px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/admin/learning/internships" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Manage Internships</Link>
          <Link href="/admin/learning/courses" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Manage Courses</Link>
          <Link href="/admin/learning/workshops" style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Manage Workshops</Link>
          <Link href="/admin/learning/applications" style={{ background: 'var(--acid)', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Review Applications</Link>
        </div>
      </div>
    </div>
  )
}



