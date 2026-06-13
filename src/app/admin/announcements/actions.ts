'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



export async function addAnnouncementAction(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const link = formData.get('link') as string
  const active = formData.get('active') === 'true'

  try {
    const ann = await prisma.announcement.create({ data: { title, content, fileUrl: link, published: active, category: 'Company Update' } })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true, data: ann }
  } catch (error) {
    return { success: false, error: 'Failed to add announcement' }
  }
}

export async function updateAnnouncementAction(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const link = formData.get('link') as string
  const active = formData.get('active') === 'true'

  try {
    const ann = await prisma.announcement.update({ where: { id }, data: { title, content, fileUrl: link, published: active, category: 'Company Update' } })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true, data: ann }
  } catch (error) {
    return { success: false, error: 'Failed to update announcement' }
  }
}

export async function deleteAnnouncementAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.announcement.delete({ where: { id } })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete announcement' }
  }
}

