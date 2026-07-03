"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Plus, Edit2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/careers')
      .then(res => res.json())
      .then(data => setCareers(data || []))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career?')) return
    await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' })
    setCareers(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#ededed]">Careers Management</h1>
          <p className="mt-2 text-[14px] text-[#888]">Manage open career positions on the website.</p>
        </div>
        <Link href="/admin/careers/new" style={{ padding: '8px 16px', background: 'var(--acid)', color: '#000', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Add Position
        </Link>
      </div>

      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#222] bg-[#111]">
              <th className="p-4 text-[12px] font-medium text-[#888] uppercase tracking-wider">Title</th>
              <th className="p-4 text-[12px] font-medium text-[#888] uppercase tracking-wider">Department</th>
              <th className="p-4 text-[12px] font-medium text-[#888] uppercase tracking-wider">Type</th>
              <th className="p-4 text-[12px] font-medium text-[#888] uppercase tracking-wider">Status</th>
              <th className="p-4 text-[12px] font-medium text-[#888] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => (
              <tr key={career.id} className="border-b border-[#1e1e1e] hover:bg-[#111] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-[#888]" />
                    <span className="text-[14px] font-medium text-[#ededed]">{career.title}</span>
                  </div>
                </td>
                <td className="p-4 text-[13px] text-[#888]">{career.department}</td>
                <td className="p-4 text-[13px] text-[#888]">{career.type}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${career.status === 'Open' ? 'bg-[rgba(212,255,62,0.1)] text-[var(--acid)]' : 'bg-[#222] text-[#888]'}`}>
                    {career.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/careers/${career.id}`} className="p-2 text-[#888] hover:text-[#fff] bg-[#1a1a1a] rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(career.id)} className="p-2 text-[#888] hover:text-[#ef4444] bg-[#1a1a1a] rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {careers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[13px] text-[#666]">
                  No career positions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
