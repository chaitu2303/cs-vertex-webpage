export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import ApplicationsClient from './ApplicationsClient'

export const revalidate = 0

export default async function ApplicationsAdminPage() {
  const [internshipApps, courseRegs, workshopRegs] = await Promise.all([
    prisma.internshipApplication.findMany({ include: { internship: true, customer: true }, orderBy: { createdAt: 'desc' } }),
    prisma.courseRegistration.findMany({ include: { course: true, customer: true }, orderBy: { createdAt: 'desc' } }),
    prisma.workshopRegistration.findMany({ include: { workshop: true, customer: true }, orderBy: { createdAt: 'desc' } })
  ])

  return <ApplicationsClient 
    internships={internshipApps} 
    courses={courseRegs} 
    workshops={workshopRegs} 
  />
}



