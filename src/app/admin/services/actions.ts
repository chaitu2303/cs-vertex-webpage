'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'

export async function addServiceAction(formData: FormData) {
  const title = formData.get('title') as string
  const icon = formData.get('icon') as string
  const description = formData.get('description') as string || ''

  try {
    const srv = await prisma.service.create({ data: { title, icon, description } })
    await syncToJSON('services')
    revalidatePath('/admin/services')
    revalidatePath('/')
    return { success: true, data: srv }
  } catch (error) {
    return { success: false, error: 'Failed to add service' }
  }
}

export async function updateServiceAction(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const icon = formData.get('icon') as string
  const description = formData.get('description') as string || ''

  try {
    const srv = await prisma.service.update({ where: { id }, data: { title, icon, description } })
    await syncToJSON('services')
    revalidatePath('/admin/services')
    revalidatePath('/')
    return { success: true, data: srv }
  } catch (error) {
    return { success: false, error: 'Failed to update service' }
  }
}

export async function deleteServiceAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.service.delete({ where: { id } })
    await syncToJSON('services')
    revalidatePath('/admin/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete service' }
  }
}
