"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'



export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      return { error: error.message }
    }
  } catch (err: any) {
    return { error: err.message || 'Network error: Failed to connect to the authentication server.' }
  }

  revalidatePath('/portal')
  redirect('/portal')
}

import { sendWelcomeEmail, sendVerificationEmail, sendAdminNotificationNewUser } from '@/lib/email'

export async function signup(formData: FormData) {
  const supabaseAdmin = createAdminClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    company: formData.get('company') as string,
  }

  let authData;
  try {
    // Generate signup link (this creates the user without sending the default Supabase email)
    const { data: resultData, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
        }
      }
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        return { error: 'An account with this email already exists.' }
      }
      return { error: error.message }
    }
    authData = resultData;
  } catch (err: any) {
    return { error: err.message || 'Network error: Failed to connect to the authentication server.' }
  }

  // Create Customer profile in Prisma
  if (authData.user) {
    try {
      await prisma.customer.create({
        data: {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          company: data.company,
        }
      })
      
      // Send Custom HTML Verification Email
      if (authData.properties?.action_link) {
        await sendVerificationEmail(data.email, authData.properties.action_link)
      }

      // Notify Admin
      const ip = 'Hidden' // IP logging would require headers() which isn't passed here easily, but we can set to generic or get from request later.
      await sendAdminNotificationNewUser(data.email, data.name, ip, 'Customer')
      
    } catch (e) {
      console.error('Failed to create customer profile', e)
    }
  }

  // Do NOT redirect, return success to show toast
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const company = formData.get('company') as string
  const phone = formData.get('phone') as string

  try {
    await prisma.customer.update({
      where: { id: user.id },
      data: { name, company, phone }
    })
  } catch (e) {
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/portal')
  return { success: true }
}

export async function requestProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const projectType = formData.get('projectType') as string
  const service = formData.get('service') as string
  const budget = formData.get('budget') as string
  const timeline = formData.get('timeline') as string
  const description = formData.get('description') as string

  try {
    const customer = await prisma.customer.findUnique({ where: { id: user.id } })
    
    await prisma.quote.create({
      data: {
        customerId: user.id,
        service: `${projectType} - ${service}`,
        description: description,
        budget: budget,
        timeline: timeline,
        status: 'Pending Review'
      }
    })
  } catch (e) {
    console.error('Failed to request project', e)
    return { error: 'Failed to request project' }
  }

  revalidatePath('/portal')
  revalidatePath('/admin/quotes')
  redirect('/portal/projects')
}
