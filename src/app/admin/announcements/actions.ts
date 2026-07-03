'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'

function parseAnn(fd: FormData) {
  return {
    title:       fd.get('title') as string,
    subtitle:    (fd.get('subtitle') as string) || null,
    category:    (fd.get('category') as string) || 'Company Update',
    content:     fd.get('content') as string,
    offerTag:    (fd.get('offerTag') as string) || null,
    buttonText:  (fd.get('buttonText') as string) || null,
    buttonUrl:   (fd.get('buttonUrl') as string) || null,
    fileUrl:     (fd.get('fileUrl') as string) || null,
    isPinned:    fd.get('isPinned') === 'true',
    isFeatured:  fd.get('isFeatured') === 'true',
    published:   fd.get('published') === 'true',
    status:      (fd.get('status') as string) || 'Active',
    priority:    parseInt(fd.get('priority') as string || '0', 10),
    order:       parseInt(fd.get('order') as string || '0', 10),
    startDate:   fd.get('startDate') ? new Date(fd.get('startDate') as string) : null,
    endDate:     fd.get('endDate')   ? new Date(fd.get('endDate')   as string) : null,
  }
}

async function sync() {
  await syncToJSON('announcements')
  revalidatePath('/admin/announcements')
  revalidatePath('/')
}

export async function addAnnouncementAction(formData: FormData) {
  try {
    const data = parseAnn(formData)
    const ann = await prisma.announcement.create({ data })
    await sync()
    return { success: true, data: ann }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to add announcement' }
  }
}

export async function updateAnnouncementAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const data = parseAnn(formData)
    const ann = await prisma.announcement.update({ where: { id }, data })
    await sync()
    return { success: true, data: ann }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to update announcement' }
  }
}

export async function deleteAnnouncementAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.announcement.delete({ where: { id } })
    await sync()
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete announcement' }
  }
}

export async function toggleAnnouncementAction(formData: FormData) {
  const id    = formData.get('id') as string
  const field = formData.get('field') as string
  const value = formData.get('value') === 'true'
  try {
    const ann = await prisma.announcement.update({ where: { id }, data: { [field]: value } })
    await sync()
    return { success: true, data: ann }
  } catch (error) {
    return { success: false, error: 'Failed to toggle' }
  }
}

export async function duplicateAnnouncementAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    const src = await prisma.announcement.findUnique({ where: { id } })
    if (!src) return { success: false, error: 'Not found' }
    const { id: _id, createdAt, updatedAt, ...rest } = src
    const copy = await prisma.announcement.create({
      data: { ...rest, title: `${rest.title} (Copy)`, published: false, status: 'Hidden' }
    })
    await sync()
    return { success: true, data: copy }
  } catch (error) {
    return { success: false, error: 'Failed to duplicate' }
  }
}
