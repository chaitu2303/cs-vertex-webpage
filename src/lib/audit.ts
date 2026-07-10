import { prisma } from './prisma'

export async function logAudit(action: string, resource: string, details?: string, ipAddress?: string, adminId?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        resource,
        details,
        ipAddress,
        adminId
      }
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}
