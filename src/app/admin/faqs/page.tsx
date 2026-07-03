"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, GripVertical, Pin, Star, Eye, EyeOff } from 'lucide-react'

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  isPinned: boolean
  isFeatured: boolean
  viewCount: number
  published: boolean
  order: number
}

const CATEGORIES = ["Web", "AI", "Cybersecurity", "IoT", "Billing", "General", "Careers"]

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form State
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('General')
  const [isPinned, setIsPinned] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [published, setPublished] = useState(true)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/faqs')
      if (res.ok) {
        const data = await res.json()
        setFaqs(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { question, answer, category, isPinned, isFeatured, published, order: faqs.length }
    
    try {
      if (editingId) {
        await fetch(`/api/admin/faqs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/admin/faqs', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }
      setIsModalOpen(false)
      fetchFaqs()
    } catch (err) {
      console.error("Save error", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    fetchFaqs()
  }

  const openAddModal = () => {
    setEditingId(null)
    setQuestion('')
    setAnswer('')
    setCategory('General')
    setIsPinned(false)
    setIsFeatured(false)
    setPublished(true)
    setIsModalOpen(true)
  }

  const openEditModal = (faq: FAQ) => {
    setEditingId(faq.id)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setCategory(faq.category)
    setIsPinned(faq.isPinned)
    setIsFeatured(faq.isFeatured)
    setPublished(faq.published)
    setIsModalOpen(true)
  }

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || f.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="admin-page p-8 bg-[#0B0B0B] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage FAQs</h1>
          <p className="text-gray-400">Add, edit, and organize frequently asked questions.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B2C] hover:bg-[#ff8049] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus size={20} /> Add New FAQ
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search questions or answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FF6B2C]"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-[#333] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#FF6B2C]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading FAQs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333] text-gray-400 text-sm">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Question</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Views</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.map((faq, index) => (
                  <tr key={faq.id} className="border-b border-[#222] hover:bg-[#151515] transition">
                    <td className="p-4 text-gray-500">
                      <GripVertical size={16} className="cursor-move" />
                    </td>
                    <td className="p-4">
                      <div className="font-medium flex items-center gap-2">
                        {faq.question}
                        {faq.isPinned && <Pin size={14} className="text-[#FF6B2C]" />}
                        {faq.isFeatured && <Star size={14} className="text-yellow-500" />}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-md mt-1">{faq.answer}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-[#222] text-xs rounded-full text-gray-300">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {faq.published ? (
                        <span className="text-green-500 flex items-center gap-1 text-sm"><Eye size={14}/> Published</span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1 text-sm"><EyeOff size={14}/> Draft</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {faq.viewCount}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(faq)} className="text-blue-400 hover:text-blue-300 p-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(faq.id)} className="text-red-400 hover:text-red-300 p-2 ml-2">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFaqs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No FAQs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#151515] border border-[#333] rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Question</label>
                <input 
                  type="text" required
                  value={question} onChange={e => setQuestion(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-[#333] rounded-lg p-3 text-white focus:border-[#FF6B2C] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Answer</label>
                <textarea 
                  required rows={4}
                  value={answer} onChange={e => setAnswer(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-[#333] rounded-lg p-3 text-white focus:border-[#FF6B2C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select 
                    value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0B0B0B] border border-[#333] rounded-lg p-3 text-white focus:border-[#FF6B2C] outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-6 mt-4 pt-4 border-t border-[#333]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="accent-[#FF6B2C]" />
                  <span className="text-sm">Pin to Top</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-[#FF6B2C]" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-[#FF6B2C]" />
                  <span className="text-sm">Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" className="bg-[#FF6B2C] hover:bg-[#ff8049] text-white px-6 py-2 rounded-lg transition font-medium">
                  {editingId ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
