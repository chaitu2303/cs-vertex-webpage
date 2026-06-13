import { prisma } from '@/lib/prisma'
import FeedbackClient from './FeedbackClient'

export const revalidate = 0

export default async function AdminFeedbackPage() {
  const feedback = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  return <FeedbackClient initialFeedback={feedback} />
}
