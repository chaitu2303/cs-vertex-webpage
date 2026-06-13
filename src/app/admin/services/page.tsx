import { prisma } from '@/lib/prisma'
import ServicesClient from './ServicesClient'



export const revalidate = 0

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
  return <ServicesClient initialServices={services} />
}

