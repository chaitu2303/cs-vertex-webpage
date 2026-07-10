"use client"

import React from 'react'
import Image from 'next/image'

export function MsmeLogo() {
  return (
    <Image 
      src="/assets/msme-logo.png" 
      alt="MSME Logo" 
      width={120}
      height={40}
      style={{ objectFit: 'contain', minHeight: '40px' }}
    />
  )
}
