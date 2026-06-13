'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitFrontendFeedbackAction(formData: { name: string, email: string, role: string, message: string, rating: number }) {
  try {
    const { name, email, role, message, rating } = formData
    
    // Create the testimonial as unpublished (requires admin approval)
    await prisma.testimonial.create({
      data: {
        clientName: name,
        email: email,
        company: role, // Using role as company for now
        feedback: message,
        rating: rating || 5,
        published: false
      }
    })

    // Notify the admin
    await prisma.notification.create({
      data: {
        userId: 'ADMIN',
        title: 'New Feedback Pending Approval',
        message: `New feedback received from ${name} (${email}). Please review and publish from the Feedback portal.`
      }
    })

    revalidatePath('/admin/feedback')
    revalidatePath('/admin/notifications')
    return { success: true }
  } catch (error) {
    console.error('Feedback submission error:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}
