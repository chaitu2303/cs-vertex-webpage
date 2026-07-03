import { readFromJSON } from '@/lib/cms'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { ApplyButton } from '../components/ApplyButton'

export const revalidate = 0

export default async function CoursesPage() {
  const courses = await readFromJSON('courses', () => prisma.course.findMany({ 
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  }))
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Available Courses</h2>
      
      {courses.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#111', borderRadius: '12px', border: '1px solid #222', color: '#888' }}>
          No courses are currently available. Check back later!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {courses.map(c => (
            <div key={c.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {c.banner && (
                <div style={{ height: '180px', background: `url(${c.banner}) center/cover` }} />
              )}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', color: '#fff', margin: '0 0 10px' }}>{c.title}</h3>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6, flexGrow: 1 }}>{c.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', fontSize: '13px' }}>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Duration</span>{c.duration}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Level</span>{c.level}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Trainer</span>{c.trainer}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Price</span>{c.price}</div>
                </div>

                <ApplyButton type="Courses" itemId={c.id} isLoggedIn={!!user} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
