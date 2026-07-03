export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import InternshipsClient from './InternshipsClient'

export const revalidate = 0

export default async function InternshipsAdminPage() {
  const internships = await prisma.internship.findMany({ orderBy: { createdAt: 'desc' } })
  return <InternshipsClient initialInternships={internships} />
}



