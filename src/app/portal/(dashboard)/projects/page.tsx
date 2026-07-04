import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { FolderKanban, ArrowRight } from 'lucide-react'

export default async function CustomerProjectsPage() {
  const user = await getCachedUser()
  if (!user) return null

  const customerId = user.id

  let customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer) {
    try {
      customer = await prisma.customer.create({
        data: { id: customerId, email: user.email || `${customerId}@no-email.placeholder.com` }
      })
    } catch (err) {
      // Fallback in case of concurrent creation
      customer = await prisma.customer.findUnique({ where: { id: customerId } })
      if (!customer) throw err;
    }
  }

  const projects = await prisma.clientProject.findMany({
    where: { customerId },
    include: {
      milestones: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Project Tracker</h1>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Monitor progress, milestones, and updates for your active projects.</p>
        </div>
        <Link href="/portal/quotes" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 20px',
          background: '#FF5A2A',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(255, 90, 42, 0.3)'
        }}>
          Request a Quote &rarr;
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #1e1e1e', borderRadius: '16px', padding: '64px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', minHeight: '400px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <FolderKanban size={24} style={{ color: '#FF5A2A' }} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>No Active Projects</h2>
          <p style={{ fontSize: '13px', color: '#555', maxWidth: '360px', lineHeight: 1.6, margin: '0 0 24px' }}>
            You don't have any active projects being tracked. Once your quote is approved, your project will appear here.
          </p>
          <Link href="/portal/quotes" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#FF5A2A', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            Request a Quote <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {projects.map(project => (
            <div key={project.id} style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
              {/* Project Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{project.name}</h2>
                  <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>Started {project.startDate.toLocaleDateString()}</p>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: project.status === 'Active' ? 'rgba(16,185,129,0.1)' : project.status === 'Completed' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)',
                  color: project.status === 'Active' ? '#10b981' : project.status === 'Completed' ? '#3b82f6' : '#888'
                }}>
                  {project.status}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #111', fontSize: '13px', color: '#888', lineHeight: 1.6 }}>
                  {project.description}
                </div>
              )}

              {/* Progress */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #111' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>Overall Progress</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF5A2A' }}>{project.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${project.progress}%`, height: '100%', background: 'linear-gradient(90deg, #FF5A2A, #ff8c00)', borderRadius: '3px', transition: 'width 1s ease' }} />
                </div>
              </div>

              {/* Milestones */}
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Milestones</h3>
                {project.milestones.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#444' }}>No milestones defined yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {project.milestones.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#060606', borderRadius: '8px', border: '1px solid #111' }}>
                        <div>
                          <p style={{ fontSize: '13px', color: '#ededed', margin: '0 0 2px', fontWeight: 500 }}>{m.title}</p>
                          <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>{m.dueDate ? `Due: ${m.dueDate.toLocaleDateString()}` : 'No due date'}</p>
                        </div>
                        <span style={{
                          fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                          background: m.status === 'Completed' ? 'rgba(16,185,129,0.1)' : m.status === 'In Progress' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                          color: m.status === 'Completed' ? '#10b981' : m.status === 'In Progress' ? '#f59e0b' : '#555'
                        }}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
