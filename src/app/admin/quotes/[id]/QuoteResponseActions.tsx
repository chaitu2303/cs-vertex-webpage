"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuoteResponseActions({ quoteId, customerId, currentStatus }: { quoteId: string, customerId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAction = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this quote as "${newStatus}"?`)) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, customerId })
      })

      if (res.ok) {
        alert('Quote status updated successfully.')
        router.refresh()
      } else {
        alert('Failed to update quote.')
      }
    } catch (err) {
      alert('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button 
        onClick={() => handleAction('Under Review')} 
        disabled={loading || currentStatus === 'Under Review'}
        className="w-full p-3 bg-yellow-900/30 text-yellow-500 font-bold rounded border border-yellow-900/50 hover:bg-yellow-900/50 transition disabled:opacity-50"
      >
        Mark as Under Review
      </button>
      
      <button 
        onClick={() => handleAction('Proposal Sent')} 
        disabled={loading || currentStatus === 'Proposal Sent'}
        className="w-full p-3 bg-blue-900/30 text-blue-500 font-bold rounded border border-blue-900/50 hover:bg-blue-900/50 transition disabled:opacity-50"
      >
        Mark as Proposal Sent
      </button>
      
      <button 
        onClick={() => handleAction('Approved')} 
        disabled={loading || currentStatus === 'Approved'}
        className="w-full p-3 bg-green-900/30 text-green-500 font-bold rounded border border-green-900/50 hover:bg-green-900/50 transition disabled:opacity-50"
      >
        Approve Project
      </button>

      <button 
        onClick={() => handleAction('Rejected')} 
        disabled={loading || currentStatus === 'Rejected'}
        className="w-full p-3 bg-red-900/30 text-red-500 font-bold rounded border border-red-900/50 hover:bg-red-900/50 transition disabled:opacity-50"
      >
        Reject Quote
      </button>
    </div>
  )
}
