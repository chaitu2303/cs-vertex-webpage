"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCareerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    requirements: '',
    status: 'Open',
    published: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/admin/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    router.push('/admin/careers')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-8">Add New Position</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Department</label>
            <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Location</label>
            <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none">
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#888] mb-2 uppercase tracking-wider">Requirements</label>
          <textarea required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} rows={5} className="w-full bg-[#111] border border-[#222] rounded-lg p-3 text-[14px] text-[#ededed] outline-none" />
        </div>
        <button type="submit" className="px-6 py-3 bg-[var(--acid)] text-[#000] font-semibold rounded-lg text-[14px]">
          Create Position
        </button>
      </form>
    </div>
  )
}
