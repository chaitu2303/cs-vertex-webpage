"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Layers, Users, BookOpen, Clock, 
  CheckCircle, FileText, FileImage, DollarSign, Briefcase, 
  Settings, LogOut, Menu, X, Search, Bell
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menu = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: Layers },
    { label: 'Team', path: '/admin/team', icon: Users },
    { label: 'Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Webinars', path: '/admin/webinars', icon: Clock },
    { label: 'Certificates', path: '/admin/certificates', icon: CheckCircle },
    { label: 'Marketing Posters', path: '/admin/marketing/posters', icon: FileImage },
    { label: 'Waitlist', path: '/admin/marketing/waitlist', icon: Users },
    { label: 'Clients', path: '/admin/clients', icon: Users },
    { label: 'Quotes & Leads', path: '/admin/quotes', icon: DollarSign },
    { label: 'Recruitment', path: '/admin/recruitment', icon: Briefcase },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111] border border-[#222] rounded-md text-[#FF6B2C]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#222] gap-3">
          <div className="w-8 h-8 rounded bg-[#FF6B2C] flex items-center justify-center font-bold text-black tracking-tighter">CS</div>
          <span className="font-semibold tracking-wide text-white text-sm">Enterprise UI</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
          <div className="mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu
          </div>
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#FF6B2C]/10 text-[#FF6B2C]' 
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#FF6B2C]' : 'opacity-70'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#222]">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <LogOut size={16} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#050505]">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-[#222] bg-[#0a0a0a] sticky top-0 z-30">
          <div className="lg:hidden"></div>
          
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full bg-[#111] border border-[#222] rounded-md py-1.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B2C]/50 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-xs text-gray-500 gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#222] rounded font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#222] rounded font-mono">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B2C] rounded-full"></span>
            </button>
            <div className="h-4 w-[1px] bg-[#222]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-gray-500">CS Vertex Enterprise</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B2C] to-orange-400"></div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
