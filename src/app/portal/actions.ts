"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'



export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/portal')
  redirect('/portal')
}

import { sendWelcomeEmail } from '@/lib/email'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    company: formData.get('company') as string,
  }

  // Create user in Supabase Auth
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
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
      
      // Send Welcome Email
      await sendWelcomeEmail(data.email, data.name || 'Valued Customer')
    } catch (e) {
      console.error('Failed to create customer profile', e)
    }
  }

  revalidatePath('/portal')
  redirect('/portal')
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

