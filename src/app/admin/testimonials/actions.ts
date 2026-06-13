"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  await prisma.testimonial.update({
    where: { id },
    data: { published: !currentStatus }
  });
  revalidatePath('/admin/testimonials');
  revalidatePath('/'); // refresh homepage cache as well
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({
    where: { id }
  });
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}
