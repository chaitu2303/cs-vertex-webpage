"use server"

import { prisma } from "@/lib/prisma"

export async function verifyCertificate(query: string) {
  try {
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateId: query },
          { email: query }
        ]
      }
    });
    
    if (!certificate) return { success: false, message: "Certificate not found." };
    
    return { success: true, certificate };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to search certificate." }
  }
}
