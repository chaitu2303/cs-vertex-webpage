import { readFromJSON } from '@/lib/cms'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { ApplyButton } from '../components/ApplyButton'

export const revalidate = 0

export default async function InternshipsPage() {
  const internships = await readFromJSON('internships', () => prisma.internship.findMany({ 
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  }))
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Available Internships</h2>
      
      {internships.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: '#111', borderRadius: '12px', border: '1px solid #222', color: '#888' }}>
          No internships are currently open for applications. Check back later!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {internships.map(i => (
            <div key={i.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '20px', color: '#fff', margin: 0 }}>{i.title}</h3>
                <span style={{ background: i.status === 'Open' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)', color: i.status === 'Open' ? '#0f0' : '#f00', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{i.status}</span>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6, flexGrow: 1 }}>{i.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Duration</span>{i.duration}</div>
                <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Mode</span>{i.mode}</div>
                <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Location</span>{i.location}</div>
                <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}><span style={{ color: '#666', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Seats</span>{i.seats}</div>
              </div>

              {i.status === 'Open' ? (
                <ApplyButton type="Internships" itemId={i.id} isLoggedIn={!!user} />
              ) : (
                <button disabled style={{ width: '100%', padding: '12px', background: '#222', color: '#666', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'not-allowed' }}>Applications Closed</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
