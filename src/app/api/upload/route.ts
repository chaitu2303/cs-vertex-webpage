import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'misc'

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 })
    }

    // Validation: 5MB size limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 })
    }

    // Validation: Allowed MIME types
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF, DOCX, JPG, and PNG are allowed.' }, { status: 400 })
    }

    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')
    const filePath = `${folder}/${Date.now()}-${safeFilename}`

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Failed to upload file to Supabase.' }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath)

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
