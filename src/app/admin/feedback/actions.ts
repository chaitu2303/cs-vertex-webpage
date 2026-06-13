'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addTestimonialAction(formData: FormData) {
  const clientName = formData.get('clientName') as string
  const company = formData.get('company') as string
  const feedback = formData.get('feedback') as string
  const rating = parseInt(formData.get('rating') as string)
  const published = formData.get('published') === 'true'

  try {
    const t = await prisma.testimonial.create({ data: { clientName, company, feedback, rating, published } })
    revalidatePath('/admin/feedback')
    revalidatePath('/')
    return { success: true, data: t }
  } catch (error) {
    return { success: false, error: 'Failed to add testimonial' }
  }
}

export async function updateTestimonialAction(formData: FormData) {
  const id = formData.get('id') as string
  const clientName = formData.get('clientName') as string
  const company = formData.get('company') as string
  const feedback = formData.get('feedback') as string
  const rating = parseInt(formData.get('rating') as string)
  const published = formData.get('published') === 'true'

  try {
    const t = await prisma.testimonial.update({ where: { id }, data: { clientName, company, feedback, rating, published } })
    revalidatePath('/admin/feedback')
    revalidatePath('/')
    return { success: true, data: t }
  } catch (error) {
    return { success: false, error: 'Failed to update testimonial' }
  }
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/admin/feedback')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete testimonial' }
  }
}
