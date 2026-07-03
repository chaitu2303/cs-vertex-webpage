import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Bell, CheckCheck } from 'lucide-react'

export default async function CustomerNotificationsPage() {
  const user = await getCachedUser()
  if (!user) return null

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  async function markAllRead() {
    'use server'
    const u = await getCachedUser()
    if (!u) return
    await prisma.notification.updateMany({
      where: { userId: u.id, isRead: false },
      data: { isRead: true }
    })
    revalidatePath('/portal/notifications')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Notifications</h1>
          <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button type="submit" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', background: 'transparent', color: '#FF5A2A',
              border: '1px solid rgba(255,90,42,0.3)', borderRadius: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer'
            }}>
              <CheckCheck size={14} /> Mark all read
            </button>
          </form>
        )}
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,90,42,0.08)', border: '1px solid rgba(255,90,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Bell size={22} style={{ color: '#FF5A2A' }} />
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#ededed', margin: '0 0 8px' }}>No notifications</h2>
            <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>You're all caught up! Notifications from your projects will appear here.</p>
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div key={n.id} style={{
              display: 'flex', gap: '14px', padding: '16px 24px 16px 21px',
              borderBottom: idx < notifications.length - 1 ? '1px solid #0d0d0d' : 'none',
              background: n.isRead ? 'transparent' : 'rgba(255,90,42,0.02)',
              borderLeft: n.isRead ? '3px solid transparent' : '3px solid #FF5A2A',
              transition: 'background 0.15s'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.isRead ? '#1e1e1e' : '#FF5A2A', flexShrink: 0, marginTop: '5px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ fontSize: '14px', color: '#ededed', fontWeight: n.isRead ? 400 : 600, margin: 0 }}>{n.title}</p>
                  <span style={{ fontSize: '11px', color: '#3a3a3a', flexShrink: 0, marginLeft: '16px' }}>{n.createdAt.toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
