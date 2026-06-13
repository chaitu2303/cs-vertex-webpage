'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendApplicationStatusEmail } from '@/lib/email'

// COURSES
export async function addCourseAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  try {
    const c = await prisma.course.create({ 
      data: { 
        title: data.title as string,
        description: data.description as string,
        duration: data.duration as string,
        level: data.level as string,
        syllabus: data.syllabus as string,
        price: data.price as string,
        trainer: data.trainer as string,
        banner: data.banner as string,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to add course' }
  }
}

export async function updateCourseAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  try {
    const c = await prisma.course.update({ 
      where: { id: data.id as string }, 
      data: { 
        title: data.title as string,
        description: data.description as string,
        duration: data.duration as string,
        level: data.level as string,
        syllabus: data.syllabus as string,
        price: data.price as string,
        trainer: data.trainer as string,
        banner: data.banner as string,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to update course' }
  }
}

export async function deleteCourseAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete course' }
  }
}

// INTERNSHIPS
export async function addInternshipAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  const seats = parseInt(data.seats as string) || 0
  const lastDate = new Date(data.lastDate as string)
  try {
    const c = await prisma.internship.create({ 
      data: { 
        title: data.title as string,
        description: data.description as string,
        duration: data.duration as string,
        mode: data.mode as string,
        location: data.location as string,
        requirements: data.requirements as string,
        benefits: data.benefits as string,
        status: data.status as string,
        lastDate,
        seats,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to add internship' }
  }
}

export async function updateInternshipAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  const seats = parseInt(data.seats as string) || 0
  const lastDate = new Date(data.lastDate as string)
  try {
    const c = await prisma.internship.update({ 
      where: { id: data.id as string }, 
      data: { 
        title: data.title as string,
        description: data.description as string,
        duration: data.duration as string,
        mode: data.mode as string,
        location: data.location as string,
        requirements: data.requirements as string,
        benefits: data.benefits as string,
        status: data.status as string,
        lastDate,
        seats,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to update internship' }
  }
}

export async function deleteInternshipAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.internship.delete({ where: { id } })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete internship' }
  }
}

// WORKSHOPS
export async function addWorkshopAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  const seats = parseInt(data.seats as string) || 0
  const date = new Date(data.date as string)
  try {
    const c = await prisma.workshop.create({ 
      data: { 
        title: data.title as string,
        description: data.description as string,
        time: data.time as string,
        speaker: data.speaker as string,
        mode: data.mode as string,
        status: data.status as string,
        banner: data.banner as string,
        date,
        seats,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to add workshop' }
  }
}

export async function updateWorkshopAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const published = data.published === 'true'
  const seats = parseInt(data.seats as string) || 0
  const date = new Date(data.date as string)
  try {
    const c = await prisma.workshop.update({ 
      where: { id: data.id as string }, 
      data: { 
        title: data.title as string,
        description: data.description as string,
        time: data.time as string,
        speaker: data.speaker as string,
        mode: data.mode as string,
        status: data.status as string,
        banner: data.banner as string,
        date,
        seats,
        published 
      } 
    })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true, data: c }
  } catch (error) {
    return { success: false, error: 'Failed to update workshop' }
  }
}

export async function deleteWorkshopAction(formData: FormData) {
  const id = formData.get('id') as string
  try {
    await prisma.workshop.delete({ where: { id } })
    revalidatePath('/admin/learning')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete workshop' }
  }
}
// APPLICATIONS (Approvals / Rejections)
export async function updateApplicationStatus(id: string, type: string, status: string) {
  try {
    let customerId = ''
    let title = ''
    let customerEmail = ''
    let customerName = ''

    if (type === 'Internships') {
      const app = await prisma.internshipApplication.update({ where: { id }, data: { status }, include: { internship: true, customer: true } })
      customerId = app.userId
      title = app.internship.title
      customerEmail = app.customer.email
      customerName = app.customer.name || 'Student'
    } else if (type === 'Courses') {
      const app = await prisma.courseRegistration.update({ where: { id }, data: { status }, include: { course: true, customer: true } })
      customerId = app.userId
      title = app.course.title
      customerEmail = app.customer.email
      customerName = app.customer.name || 'Student'
    } else if (type === 'Workshops') {
      const app = await prisma.workshopRegistration.update({ where: { id }, data: { status }, include: { workshop: true, customer: true } })
      customerId = app.userId
      title = app.workshop.title
      customerEmail = app.customer.email
      customerName = app.customer.name || 'Student'
    }

    // Send in-app notification
    if (customerId) {
      await prisma.notification.create({
        data: {
          userId: customerId,
          title: `Application ${status}`,
          message: `Your application for "${title}" has been ${status.toLowerCase()}.`
        }
      })
      
      // Send Email Notification
      await sendApplicationStatusEmail(customerEmail, customerName, title, status)
    }

    revalidatePath('/admin/learning/applications')
    revalidatePath('/portal')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update status' }
  }
}

