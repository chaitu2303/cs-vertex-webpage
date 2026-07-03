'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { syncToJSON } from '@/lib/cms'

export async function addProjectAction(formData: FormData) {
  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || null
  const category = (formData.get('category') as string) || null
  const shortSummary = (formData.get('shortSummary') as string) || null
  const challenge = (formData.get('challenge') as string) || ''
  const solution = (formData.get('solution') as string) || ''
  const technologies = (formData.get('technologies') as string) || ''
  const impact = (formData.get('impact') as string) || ''
  const objectives = (formData.get('objectives') as string) || null
  const features = (formData.get('features') as string) || null
  const outcomes = (formData.get('outcomes') as string) || null
  const useCase = (formData.get('useCase') as string) || null
  const image = (formData.get('image') as string) || null
  const galleryImages = (formData.get('galleryImages') as string) || null
  const timeline = (formData.get('timeline') as string) || null
  const github = (formData.get('github') as string) || null
  const liveDemo = (formData.get('liveDemo') as string) || null
  const documentation = (formData.get('documentation') as string) || null
  const status = (formData.get('status') as string) || 'Active'
  
  const isFeatured = formData.get('isFeatured') === 'true'
  const published = formData.get('published') !== 'false'
  const order = parseInt((formData.get('order') as string) || '0', 10)

  try {
    const proj = await prisma.project.create({
      data: { 
        title, slug, category, shortSummary, challenge, solution, technologies, impact,
        objectives, features, outcomes, useCase, image, galleryImages, timeline,
        github, liveDemo, documentation, status, isFeatured, published, order
      }
    })
    await syncToJSON('projects')
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
  const slug = (formData.get('slug') as string) || null
  const category = (formData.get('category') as string) || null
  const shortSummary = (formData.get('shortSummary') as string) || null
  const challenge = (formData.get('challenge') as string) || ''
  const solution = (formData.get('solution') as string) || ''
  const technologies = (formData.get('technologies') as string) || ''
  const impact = (formData.get('impact') as string) || ''
  const objectives = (formData.get('objectives') as string) || null
  const features = (formData.get('features') as string) || null
  const outcomes = (formData.get('outcomes') as string) || null
  const useCase = (formData.get('useCase') as string) || null
  const image = (formData.get('image') as string) || null
  const galleryImages = (formData.get('galleryImages') as string) || null
  const timeline = (formData.get('timeline') as string) || null
  const github = (formData.get('github') as string) || null
  const liveDemo = (formData.get('liveDemo') as string) || null
  const documentation = (formData.get('documentation') as string) || null
  const status = (formData.get('status') as string) || 'Active'

  const isFeatured = formData.get('isFeatured') === 'true'
  const published = formData.get('published') !== 'false'
  const order = parseInt((formData.get('order') as string) || '0', 10)

  try {
    const proj = await prisma.project.update({
      where: { id },
      data: { 
        title, slug, category, shortSummary, challenge, solution, technologies, impact,
        objectives, features, outcomes, useCase, image, galleryImages, timeline,
        github, liveDemo, documentation, status, isFeatured, published, order
      }
    })
    await syncToJSON('projects')
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
    await syncToJSON('projects')
    revalidatePath('/admin/projects')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function updateProjectOrderAction(updates: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      updates.map(u => 
        prisma.project.update({
          where: { id: u.id },
          data: { order: u.order }
        })
      )
    )
    await syncToJSON('projects')
    revalidatePath('/admin/projects')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to reorder projects' }
  }
}
