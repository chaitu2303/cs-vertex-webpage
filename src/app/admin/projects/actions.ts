'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'



export async function addProjectAction(formData: FormData) {
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const shortSummary = formData.get('shortSummary') as string
  const technologies = formData.get('technologies') as string
  const challenge = formData.get('challenge') as string
  const solution = formData.get('solution') as string
  const impact = formData.get('impact') as string

  try {
    const proj = await prisma.project.create({
      data: { title, category, shortSummary, technologies, challenge, solution, impact }
    })
    revalidatePath('/admin/projects')
    revalidatePath('/')
    return { success: true, data: proj }
  } catch (error) {
    return { success: false, error: 'Failed to add project' }
  }
}

export async function updateProjectAction(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const shortSummary = formData.get('shortSummary') as string
  const technologies = formData.get('technologies') as string
  const challenge = formData.get('challenge') as string
  const solution = formData.get('solution') as string
  const impact = formData.get('impact') as string

  try {
    const proj = await prisma.project.update({
      where: { id },
      data: { title, category, shortSummary, technologies, challenge, solution, impact }
    })
    revalidatePath('/admin/projects')
    revalidatePath('/')
    return { success: true, data: proj }
  } catch (error) {
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProjectAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.project.delete({ where: { id } })
    revalidatePath('/admin/projects')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete project' }
  }
}

