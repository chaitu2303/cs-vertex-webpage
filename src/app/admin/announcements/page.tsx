export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import AnnouncementsClient from './AnnouncementsClient'



export const revalidate = 0

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
  return <AnnouncementsClient initialAnnouncements={announcements} />
}




