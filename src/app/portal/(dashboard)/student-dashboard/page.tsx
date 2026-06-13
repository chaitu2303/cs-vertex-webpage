import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/portal/login')

  const customer = await prisma.customer.findUnique({ where: { id: user.id } })
  if (!customer) return <div>Customer profile not found</div>

  const [internships, courses, workshops] = await Promise.all([
    prisma.internshipApplication.findMany({ where: { userId: customer.id }, include: { internship: true }, orderBy: { createdAt: 'desc' } }),
    prisma.courseRegistration.findMany({ where: { userId: customer.id }, include: { course: true }, orderBy: { createdAt: 'desc' } }),
    prisma.workshopRegistration.findMany({ where: { userId: customer.id }, include: { workshop: true }, orderBy: { createdAt: 'desc' } })
  ])

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '10px' }}>My Learning Dashboard</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Track your applications for Internships, Courses, and Workshops.</p>
      
      <div style={{ display: 'grid', gap: '40px' }}>
        
        {/* Internships */}
        <section>
          <h2 style={{ fontSize: '20px', color: 'var(--acid)', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>Internship Applications</h2>
          {internships.length === 0 ? (
            <div style={{ padding: '30px', background: '#111', borderRadius: '8px', border: '1px solid #222', color: '#888' }}>
              You haven't applied for any internships. <Link href="/learning/internships" style={{ color: 'var(--acid)' }}>Browse internships</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {internships.map(app => (
                <div key={app.id} style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px' }}>{app.internship.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: app.status === 'Approved' ? 'rgba(0,255,0,0.1)' : app.status === 'Rejected' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
                    color: app.status === 'Approved' ? '#0f0' : app.status === 'Rejected' ? '#f00' : '#ff0' 
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Courses */}
        <section>
          <h2 style={{ fontSize: '20px', color: 'var(--acid)', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>Course Registrations</h2>
          {courses.length === 0 ? (
            <div style={{ padding: '30px', background: '#111', borderRadius: '8px', border: '1px solid #222', color: '#888' }}>
              You haven't registered for any courses. <Link href="/learning/courses" style={{ color: 'var(--acid)' }}>Browse courses</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {courses.map(app => (
                <div key={app.id} style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px' }}>{app.course.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Registered on {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: app.status === 'Approved' ? 'rgba(0,255,0,0.1)' : app.status === 'Rejected' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
                    color: app.status === 'Approved' ? '#0f0' : app.status === 'Rejected' ? '#f00' : '#ff0' 
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Workshops */}
        <section>
          <h2 style={{ fontSize: '20px', color: 'var(--acid)', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>Workshop Enrollments</h2>
          {workshops.length === 0 ? (
            <div style={{ padding: '30px', background: '#111', borderRadius: '8px', border: '1px solid #222', color: '#888' }}>
              You haven't enrolled in any workshops. <Link href="/learning/workshops" style={{ color: 'var(--acid)' }}>Browse workshops</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {workshops.map(app => (
                <div key={app.id} style={{ background: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', margin: '0 0 5px' }}>{app.workshop.title}</h3>
                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Enrolled on {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: app.status === 'Approved' ? 'rgba(0,255,0,0.1)' : app.status === 'Rejected' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,0,0.1)',
                    color: app.status === 'Approved' ? '#0f0' : app.status === 'Rejected' ? '#f00' : '#ff0' 
                  }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
