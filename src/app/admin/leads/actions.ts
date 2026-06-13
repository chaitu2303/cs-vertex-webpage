'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatusAction(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  try {
    const l = await prisma.formSubmission.update({ where: { id }, data: { status } })
    revalidatePath('/admin/leads')
    return { success: true, data: l }
  } catch (error) {
    return { success: false, error: 'Failed to update lead status' }
  }
}

export async function deleteLeadAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.formSubmission.delete({ where: { id } })
    revalidatePath('/admin/leads')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete lead' }
  }
}
