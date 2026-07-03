"use client"

import React from 'react'

export function MsmeLogo() {
  return (
    <img 
      src="/assets/msme-logo.png" 
      alt="MSME Logo" 
      style={{ objectFit: 'contain', width: '100%', height: '100%', minHeight: '40px' }}
      onError={(e) => {
        e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Ministry_of_Micro%2C_Small_and_Medium_Enterprises.png'
      }}
      loading="lazy"
    />
  )
}
