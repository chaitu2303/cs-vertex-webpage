import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { ApplyButton } from '../components/ApplyButton'

export const revalidate = 0

export default async function WorkshopsPage() {
  const workshops = await prisma.workshop.findMany({ 
    where: { published: true },
    orderBy: { date: 'asc' }
  })
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Upcoming Workshops</h2>
      
      {workshops.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#111', borderRadius: '12px', border: '1px solid #222', color: '#888' }}>
          No upcoming workshops at the moment. Check back later!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {workshops.map(w => (
            <div key={w.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {w.banner && (
                <div style={{ height: '180px', background: `url(${w.banner}) center/cover` }} />
              )}
              <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{w.title}</h3>
                  <span style={{ background: w.status === 'Upcoming' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,0,0.1)', color: w.status === 'Upcoming' ? '#0f0' : '#ff0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{w.status}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6, flexGrow: 1 }}>{w.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', fontSize: '13px' }}>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Date</span>{new Date(w.date).toLocaleDateString()}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Time</span>{w.time}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Speaker</span>{w.speaker}</div>
                  <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Mode</span>{w.mode}</div>
                </div>

                {w.status === 'Upcoming' ? (
                  <ApplyButton type="Workshops" itemId={w.id} isLoggedIn={!!user} />
                ) : (
                  <button disabled style={{ width: '100%', padding: '12px', background: '#222', color: '#666', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'not-allowed' }}>Workshop Ended</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
