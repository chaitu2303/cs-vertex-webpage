'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addFAQAction(formData: FormData) {
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const published = formData.get('published') === 'true'

  try {
    const f = await prisma.fAQ.create({ data: { question, answer, published } })
    revalidatePath('/admin/content')
    revalidatePath('/')
    return { success: true, data: f }
  } catch (error) {
    return { success: false, error: 'Failed to add FAQ' }
  }
}

export async function updateFAQAction(formData: FormData) {
  const id = formData.get('id') as string
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const published = formData.get('published') === 'true'

  try {
    const f = await prisma.fAQ.update({ where: { id }, data: { question, answer, published } })
    revalidatePath('/admin/content')
    revalidatePath('/')
    return { success: true, data: f }
  } catch (error) {
    return { success: false, error: 'Failed to update FAQ' }
  }
}

export async function deleteFAQAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.fAQ.delete({ where: { id } })
    revalidatePath('/admin/content')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete FAQ' }
  }
}
