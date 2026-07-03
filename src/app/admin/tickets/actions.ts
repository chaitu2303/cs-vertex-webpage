'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



export async function updateTicketStatusAction(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  try {
    const t = await prisma.supportTicket.update({ where: { id }, data: { status } })
    revalidatePath('/admin/tickets')
    return { success: true, data: t }
  } catch (error) {
    return { success: false, error: 'Failed to update ticket status' }
  }
}

export async function deleteTicketAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.supportTicket.delete({ where: { id } })
    revalidatePath('/admin/tickets')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete ticket' }
  }
}

