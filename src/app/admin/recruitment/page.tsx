"use client"

import React, { useEffect, useState } from 'react'
import { Briefcase, GraduationCap, Users, Bell, Search, Edit2, Trash2 } from 'lucide-react'

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async (tab: string) => {
    setLoading(true)
    let endpoint = ''
    if (tab === 'jobs') endpoint = '/api/admin/careers'
    if (tab === 'internships') endpoint = '/api/admin/internships'
    if (tab === 'job-applications') endpoint = '/api/admin/job-applications' // Needs to be created
    if (tab === 'internship-applications') endpoint = '/api/admin/internship-applications' // Needs to be created
    if (tab === 'notify-me') endpoint = '/api/admin/notify-me' // Needs to be created

    try {
      const res = await fetch(endpoint)
      const json = await res.json()
      setData(json || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#ededed]">Recruitment Management</h1>
        <p className="mt-2 text-[14px] text-[#888]">Manage jobs, internships, applications, and waitlists.</p>
      </div>

      <div className="flex gap-4 border-b border-[#222]">
        {[
          { id: 'jobs', label: 'Job Openings', icon: Briefcase },
          { id: 'internships', label: 'Internship Programs', icon: GraduationCap },
          { id: 'job-applications', label: 'Job Applications', icon: Users },
          { id: 'internship-applications', label: 'Internship Apps', icon: Users },
          { id: 'notify-me', label: 'Notify Me List', icon: Bell },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-[#FF5A2A] text-[#FF5A2A]' : 'border-transparent text-[#888] hover:text-[#fff]'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
        {loading ? (
          <div className="text-[#888] text-center py-10">Loading...</div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg text-white font-medium capitalize">{activeTab.replace('-', ' ')}</h2>
              {/* Add buttons for Jobs and Internships */}
              {(activeTab === 'jobs' || activeTab === 'internships') && (
                <button className="bg-[#FF5A2A] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Add New
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222] bg-[#111]">
                    <th className="p-4 text-[12px] font-medium text-[#888] uppercase">Details</th>
                    <th className="p-4 text-[12px] font-medium text-[#888] uppercase">Status</th>
                    <th className="p-4 text-[12px] font-medium text-[#888] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? data.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-[#1e1e1e] hover:bg-[#111]">
                      <td className="p-4">
                        <div className="text-sm text-white font-medium">{item.title || item.fullName || item.name}</div>
                        <div className="text-xs text-[#888] mt-1">{item.department || item.email || item.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-[#222] rounded-full text-[#888]">{item.status || item.type || 'N/A'}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[#888] hover:text-white p-2"><Edit2 size={14}/></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-[#666] text-sm">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
