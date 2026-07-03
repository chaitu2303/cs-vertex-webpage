export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import LeadsClient from './LeadsClient'

export const revalidate = 0

export default async function AdminLeadsPage() {
  const leads = await prisma.formSubmission.findMany({ orderBy: { createdAt: 'desc' } })
  return <LeadsClient initialLeads={leads} />
}



