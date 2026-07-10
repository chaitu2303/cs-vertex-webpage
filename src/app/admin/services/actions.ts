'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'
import { logAudit } from '@/lib/audit'

export async function addServiceAction(formData: FormData) {
  const title = formData.get('title') as string
  const icon = formData.get('icon') as string
  const description = formData.get('description') as string || ''

  try {
    const srv = await prisma.service.create({ data: { title, icon, description } })
    await syncToJSON('services')
    await logAudit('Created Service', title)
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
    await logAudit('Updated Service', title)
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
    const srv = await prisma.service.delete({ where: { id } })
    await syncToJSON('services')
    await logAudit('Deleted Service', srv.title)
    revalidatePath('/admin/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete service' }
  }
}

export async function reorderServicesAction(updates: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      updates.map(update => 
        prisma.service.update({
          where: { id: update.id },
          data: { order: update.order }
        })
      )
    )
    await syncToJSON('services')
    revalidatePath('/admin/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder services' }
  }
}
