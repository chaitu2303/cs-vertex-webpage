'use server'

import { writeFile, readdir, mkdir } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function uploadMedia(formData: FormData) {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const file = formData.get('file') as File
    if (!file) return { error: 'No file provided' }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    await writeFile(join(UPLOAD_DIR, filename), buffer)
    
    revalidatePath('/admin/media')
    return { success: true, url: `/uploads/${filename}` }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to upload' }
  }
}

export async function getMediaFiles() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
      return []
    }
    const files = await readdir(UPLOAD_DIR)
    return files.map(file => ({
      name: file,
      url: `/uploads/${file}`
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

import { unlink } from 'fs/promises'

export async function deleteMedia(filename: string) {
  try {
    const filePath = join(UPLOAD_DIR, filename)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }
    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete media:', error)
    return { error: 'Failed to delete file' }
  }
}
