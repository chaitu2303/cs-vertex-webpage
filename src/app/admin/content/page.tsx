export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import ContentClient from './ContentClient'

export const revalidate = 0

export default async function AdminContentPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' } })
  return <ContentClient initialFaqs={faqs} />
}



