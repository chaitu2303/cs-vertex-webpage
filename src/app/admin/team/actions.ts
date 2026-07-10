'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'
import { logAudit } from '@/lib/audit'

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
    await logAudit('Created Team Member', name, `Role: ${role}`)
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
    await logAudit('Updated Team Member', name, `Role: ${role}`)
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
    const member = await prisma.teamMember.delete({ where: { id } })
    await syncToJSON('team')
    await logAudit('Deleted Team Member', member.name, `Role: ${member.role}`)
    revalidatePath('/admin/team')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete member' }
  }
}

export async function reorderTeamAction(updates: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      updates.map(update => 
        prisma.teamMember.update({
          where: { id: update.id },
          data: { order: update.order }
        })
      )
    )
    await syncToJSON('team')
    revalidatePath('/admin/team')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder' }
  }
}
