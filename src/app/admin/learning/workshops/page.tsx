import { prisma } from '@/lib/prisma'
import WorkshopsClient from './WorkshopsClient'

export const revalidate = 0

export default async function WorkshopsAdminPage() {
  const workshops = await prisma.workshop.findMany({ orderBy: { createdAt: 'desc' } })
  return <WorkshopsClient initialWorkshops={workshops} />
}
