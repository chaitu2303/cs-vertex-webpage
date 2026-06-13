import { prisma } from '@/lib/prisma'
import TicketsClient from './TicketsClient'



export const revalidate = 0

export default async function AdminTicketsPage() {
  const tickets = await prisma.supportTicket.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  })
  return <TicketsClient initialTickets={tickets} />
}

