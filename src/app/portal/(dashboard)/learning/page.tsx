import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, BookOpen, Wrench, ArrowRight } from 'lucide-react'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  let customer = await prisma.customer.findUnique({ where: { id: user.id } })
  if (!customer) {
    try {
      customer = await prisma.customer.create({ data: { id: user.id, email: user.email || `${user.id}@no-email.placeholder.com` } })
    } catch (err) {
      customer = await prisma.customer.findUnique({ where: { id: user.id } })
      if (!customer) throw err;
    }
  }

  const [internships, courses, workshops] = await Promise.all([
    prisma.internshipApplication.findMany({ where: { userId: customer.id }, include: { internship: true }, orderBy: { createdAt: 'desc' } }),
    prisma.courseRegistration.findMany({ where: { userId: customer.id }, include: { course: true }, orderBy: { createdAt: 'desc' } }),
    prisma.workshopRegistration.findMany({ where: { userId: customer.id }, include: { workshop: true }, orderBy: { createdAt: 'desc' } })
  ])

  const statusStyle = (s: string) => {
    if (s === 'Approved' || s === 'Completed') return { bg: 'rgba(16,185,129,0.1)', text: '#10b981' }
    if (s === 'Rejected') return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' }
    return { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' }
  }

  const sections = [
    {
      title: 'Internship Applications',
      icon: GraduationCap,
      color: '#FF5A2A',
      data: internships,
      getTitle: (a: any) => a.internship?.title || 'Unknown Internship',
      emptyMsg: 'No internship applications yet.',
      browseHref: '/learning/internships',
      browseLabel: 'Browse Internships',
    },
    {
      title: 'Course Registrations',
      icon: BookOpen,
      color: '#3b82f6',
      data: courses,
      getTitle: (a: any) => a.course?.title || 'Unknown Course',
      emptyMsg: 'No course registrations yet.',
      browseHref: '/learning/courses',
      browseLabel: 'Browse Courses',
    },
    {
      title: 'Workshop Enrollments',
      icon: Wrench,
      color: '#8b5cf6',
      data: workshops,
      getTitle: (a: any) => a.workshop?.title || 'Unknown Workshop',
      emptyMsg: 'No workshop enrollments yet.',
      browseHref: '/learning/workshops',
      browseLabel: 'Browse Workshops',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>My Learning</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Track your internship applications, courses, and workshop enrollments.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map(({ title, icon: Icon, color, data, getTitle, emptyMsg, browseHref, browseLabel }) => (
          <div key={title} style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>{title}</h2>
                {data.length > 0 && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: `${color}15`, color, fontWeight: 600 }}>{data.length}</span>}
              </div>
              <Link href={browseHref} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555', textDecoration: 'none' }}>
                {browseLabel} <ArrowRight size={12} />
              </Link>
            </div>

            {data.length === 0 ? (
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 12px' }}>{emptyMsg}</p>
                <Link href={browseHref} style={{ fontSize: '12px', color, textDecoration: 'none', fontWeight: 600 }}>
                  {browseLabel} →
                </Link>
              </div>
            ) : (
              <div>
                {data.map((app: any, idx: number) => {
                  const sc = statusStyle(app.status)
                  return (
                    <div key={app.id} style={{
                      padding: '14px 24px',
                      borderBottom: idx < data.length - 1 ? '1px solid #0d0d0d' : 'none',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', color: '#ededed', fontWeight: 500, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getTitle(app)}
                        </p>
                        <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: sc.bg, color: sc.text, flexShrink: 0 }}>
                        {app.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
