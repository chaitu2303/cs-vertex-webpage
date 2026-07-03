import fs from 'fs'
import path from 'path'
import { prisma } from './prisma'

const dataDir = path.join(process.cwd(), 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export async function syncToJSON(key: string) {
  const filePath = path.join(dataDir, `${key}.json`)
  try {
    let data: any = []
    if (key === 'projects') {
      data = await prisma.project.findMany({ orderBy: { order: 'asc' } })
    } else if (key === 'services') {
      data = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    } else if (key === 'team') {
      data = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
    } else if (key === 'announcements') {
      data = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
    } else if (key === 'testimonials') {
      data = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    } else if (key === 'courses') {
      data = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
    } else if (key === 'internships') {
      data = await prisma.internship.findMany({ orderBy: { createdAt: 'desc' } })
    } else if (key === 'workshops') {
      data = await prisma.workshop.findMany({ orderBy: { createdAt: 'desc' } })
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return data
  } catch (error) {
    console.error(`Failed to sync key ${key} to JSON:`, error)
  }
}

export async function readFromJSON<T>(key: string, fetchFallback: () => Promise<T>): Promise<T> {
  const filePath = path.join(dataDir, `${key}.json`)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as T
    }
  } catch (e) {
    console.error(`Error reading ${key}.json:`, e)
  }
  
  const data = await fetchFallback()
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error(`Error writing fallback to ${key}.json:`, e)
  }
  return data
}
