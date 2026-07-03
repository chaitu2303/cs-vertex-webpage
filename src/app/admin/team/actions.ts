'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'

export async function addMemberAction(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const email = formData.get('email') as string
  const bio = formData.get('bio') as string
  const linkedinUrl = formData.get('linkedinUrl') as string || null
  const githubUrl = formData.get('githubUrl') as string || null

  try {
    const member = await prisma.teamMember.create({
      data: { name, role, email, bio, linkedinUrl, githubUrl }
    })
    await syncToJSON('team')
    revalidatePath('/admin/team')
    revalidatePath('/')
    return { success: true, data: member }
  } catch (error) {
    console.error('Error adding member:', error)
    return { success: false, error: 'Failed to add member' }
  }
}

export async function updateMemberAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const email = formData.get('email') as string
  const bio = formData.get('bio') as string
  const linkedinUrl = formData.get('linkedinUrl') as string || null
  const githubUrl = formData.get('githubUrl') as string || null

  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: { name, role, email, bio, linkedinUrl, githubUrl }
    })
    await syncToJSON('team')
    revalidatePath('/admin/team')
    revalidatePath('/')
    return { success: true, data: member }
  } catch (error) {
    console.error('Error updating member:', error)
    return { success: false, error: 'Failed to update member' }
  }
}

export async function deleteMemberAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.teamMember.delete({ where: { id } })
    await syncToJSON('team')
    revalidatePath('/admin/team')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete member' }
  }
}
