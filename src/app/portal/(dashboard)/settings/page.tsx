import { getCachedUser } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Settings, User, Lock, Bell } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function PortalSettingsPage() {
  const user = await getCachedUser()
  if (!user) redirect('/portal/login')

  const customer = await prisma.customer.findUnique({ where: { id: user.id } })

  async function updateProfile(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const company = formData.get('company') as string
    const phone = formData.get('phone') as string
    await prisma.customer.upsert({
      where: { id: user!.id },
      create: { id: user!.id, email: user!.email!, name, company, phone },
      update: { name, company, phone }
    })
    revalidatePath('/portal/settings')
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ededed', margin: 0, letterSpacing: '-0.02em' }}>Account Settings</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>Manage your profile, preferences, and account details.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>

        {/* Profile Settings */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={15} style={{ color: '#555' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Profile Information</h2>
          </div>
          <form action={updateProfile} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input name="name" defaultValue={customer?.name || ''} placeholder="Your name" style={{ width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Company</label>
                <input name="company" defaultValue={customer?.company || ''} placeholder="Your company" style={{ width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Phone Number</label>
              <input name="phone" defaultValue={customer?.phone || ''} placeholder="+91 XXXXX XXXXX" style={{ width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#ededed', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#555', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input value={user.email || ''} disabled style={{ width: '100%', padding: '10px 14px', background: '#060606', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#444', fontSize: '13px', boxSizing: 'border-box', cursor: 'not-allowed' }} />
              <p style={{ fontSize: '11px', color: '#333', margin: '4px 0 0' }}>Email cannot be changed. Contact support if needed.</p>
            </div>
            <button type="submit" style={{ padding: '11px 20px', background: '#FF5A2A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={15} style={{ color: '#555' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', margin: 0 }}>Account Security</h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#060606', border: '1px solid #111', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 500, margin: '0 0 2px' }}>Password</p>
                <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>Last changed: Not available</p>
              </div>
              <a href="/portal/forgot-password" style={{ fontSize: '12px', color: '#FF5A2A', textDecoration: 'none', fontWeight: 600 }}>Change →</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#060606', border: '1px solid #111', borderRadius: '8px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#ededed', fontWeight: 500, margin: '0 0 2px' }}>Account Status</p>
                <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>Active Client Account</p>
              </div>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
