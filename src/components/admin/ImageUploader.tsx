"use client"

import React, { useRef, useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void
  currentImage?: string | null
}

export function ImageUploader({ onUploadSuccess, currentImage }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        alert("Upload Successful")
        onUploadSuccess(data.url)
      } else {
        alert(data.message || "Error uploading image")
      }
    } catch (error) {
      console.error(error)
      alert("Error uploading image")
    } finally {
      setIsUploading(false)
    }
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0])
    }
  }

  return (
    <div className="image-uploader flex flex-col gap-3">
      <div className="current-image-preview flex items-center gap-4">
        {currentImage ? (
          <img src={currentImage} alt="Current" className="w-20 h-20 rounded-lg object-contain bg-[#1a1a1a] border border-[#333]" />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
            <ImageIcon size={32} opacity={0.5} />
          </div>
        )}
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-white py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          <Upload size={16} /> {isUploading ? 'Processing...' : 'Choose Image'}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onSelectFile}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
