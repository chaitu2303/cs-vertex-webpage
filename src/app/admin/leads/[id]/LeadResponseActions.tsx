"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle, Trash2, Archive } from 'lucide-react'
import { updateLeadStatusAction, deleteLeadAction } from '../actions'
import { toast } from 'react-hot-toast'

export default function LeadResponseActions({ leadId, currentStatus, customerEmail, customerName }: { leadId: string, currentStatus: string, customerEmail: string, customerName: string }) {
  const [status, setStatus] = useState(currentStatus)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true)
    const fd = new FormData()
    fd.append('id', leadId)
    fd.append('status', newStatus)
    
    const res = await updateLeadStatusAction(fd)
    if (res.success) {
      setStatus(newStatus)
      toast.success(`Marked as ${newStatus}`)
      router.refresh()
    } else {
      toast.error('Failed to update status')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    setLoading(true)
    const fd = new FormData()
    fd.append('id', leadId)
    
    const res = await deleteLeadAction(fd)
    if (res.success) {
      toast.success('Lead deleted')
      router.push('/admin/leads')
    } else {
      toast.error('Failed to delete')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
      <h2 className="text-lg font-bold text-white mb-4 border-b border-[#222] pb-4">Actions</h2>
      
      <div className="space-y-3">
        <a 
          href={`mailto:${customerEmail}?subject=Re: Your Consultation Request with CS Vertex`}
          className="flex items-center gap-3 w-full p-3 bg-white text-black rounded font-bold hover:bg-gray-200 transition-colors"
        >
          <Mail size={18} /> Reply via Email
        </a>
        
        {status !== 'Responded' && (
          <button 
            disabled={loading}
            onClick={() => handleStatusUpdate('Responded')}
            className="flex items-center gap-3 w-full p-3 bg-[#222] text-white rounded hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            <CheckCircle size={18} className="text-green-400" /> Mark as Contacted
          </button>
        )}

        {status !== 'Closed' && (
          <button 
            disabled={loading}
            onClick={() => handleStatusUpdate('Closed')}
            className="flex items-center gap-3 w-full p-3 bg-[#222] text-white rounded hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            <Archive size={18} className="text-yellow-400" /> Mark as Closed
          </button>
        )}

        <button 
          disabled={loading}
          onClick={handleDelete}
          className="flex items-center gap-3 w-full p-3 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors disabled:opacity-50 mt-4"
        >
          <Trash2 size={18} /> Delete Lead
        </button>
      </div>
    </div>
  )
}
