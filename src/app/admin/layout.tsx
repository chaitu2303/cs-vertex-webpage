import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const hasSession = !!cookieStore.get('admin_session')?.value

  return (
    <AdminLayoutClient hasSession={hasSession}>
      {children}
    </AdminLayoutClient>
  )
}
