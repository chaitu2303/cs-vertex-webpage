"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { published: !currentStatus }
  });
  await logAudit('Updated Testimonial', testimonial.clientName, `Published: ${!currentStatus}`);
  revalidatePath('/admin/testimonials');
  revalidatePath('/'); // refresh homepage cache as well
}

export async function deleteTestimonial(id: string) {
  const testimonial = await prisma.testimonial.delete({
    where: { id }
  });
  await logAudit('Deleted Testimonial', testimonial.clientName);
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

export async function reorderTestimonialsAction(updates: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      updates.map(update => 
        prisma.testimonial.update({
          where: { id: update.id },
          data: { order: update.order }
        })
      )
    )
    revalidatePath('/admin/testimonials')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder' }
  }
}
