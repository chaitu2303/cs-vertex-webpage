"use client"

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  aspectRatio?: number // e.g. 1 for 1:1, 16/9, etc.
  onUploadSuccess: (url: string) => void
  currentImage?: string | null
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageUploader({ aspectRatio, onUploadSuccess, currentImage }: ImageUploaderProps) {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isUploading, setIsUploading] = useState(false)
  
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No 2d context')

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    const cropWidth = crop.width * scaleX
    const cropHeight = crop.height * scaleY

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'))
            return
          }
          resolve(blob)
        },
        'image/jpeg',
        0.95
      )
    })
  }

  const handleUpload = async () => {
    if (!imgRef.current) return
    
    setIsUploading(true)
    try {
      let fileToUpload: Blob;
      
      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
        fileToUpload = await getCroppedImg(imgRef.current, completedCrop)
      } else {
        // If no crop (e.g. no aspect ratio enforced), just get the image blob from src
        const res = await fetch(imgSrc)
        fileToUpload = await res.blob()
      }

      const formData = new FormData()
      formData.append('file', fileToUpload, 'upload.jpg')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      if (data.success) {
        onUploadSuccess(data.url)
        setImgSrc('') // Close modal on success
      } else {
        alert(data.message || 'Upload failed')
      }
    } catch (e) {
      console.error(e)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="image-uploader">
      <div className="current-image-preview">
        {currentImage ? (
          <img src={currentImage} alt="Current" className="preview-thumbnail" />
        ) : (
          <div className="preview-placeholder">
            <ImageIcon size={32} opacity={0.5} />
          </div>
        )}
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn"
        >
          <Upload size={16} /> Choose New Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onSelectFile}
          style={{ display: 'none' }}
        />
      </div>

      {imgSrc && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <div className="crop-header">
              <h3>Crop Image</h3>
              <button type="button" onClick={() => setImgSrc('')} className="close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>

            <div className="crop-footer">
              <button 
                type="button" 
                onClick={handleUpload} 
                disabled={isUploading}
                className="save-btn"
              >
                {isUploading ? 'Uploading...' : <><Check size={16} /> Save & Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .image-uploader {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .current-image-preview {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .preview-thumbnail, .preview-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          background: #1a1a1a;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2a2a2a;
          border: 1px solid #444;
          color: #fff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }
        .upload-btn:hover {
          background: #333;
          border-color: #666;
        }
        .crop-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(5px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .crop-modal {
          background: #0c0c0c;
          border: 1px solid #222;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .crop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #222;
        }
        .crop-header h3 {
          margin: 0;
          font-size: 16px;
          color: #fff;
        }
        .close-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
        }
        .close-btn:hover {
          color: #fff;
        }
        .crop-container {
          padding: 20px;
          background: #050505;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }
        .crop-footer {
          padding: 16px 20px;
          border-top: 1px solid #222;
          display: flex;
          justify-content: flex-end;
        }
        .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--acid, #FF5A2A);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
