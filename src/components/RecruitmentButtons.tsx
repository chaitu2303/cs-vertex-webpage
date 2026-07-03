"use client"

import React, { useState } from 'react'
import { RecruitmentModal } from './RecruitmentModal'

export function JobApplyButton({ className, text = "Apply Now" }: { className?: string, text?: string }) {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>{text}</button>
      <RecruitmentModal isOpen={open} onClose={() => setOpen(false)} type="job" />
    </>
  )
}

export function InternshipApplyButton({ className, text = "Internship Program" }: { className?: string, text?: string }) {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>{text}</button>
      <RecruitmentModal isOpen={open} onClose={() => setOpen(false)} type="internship" />
    </>
  )
}
