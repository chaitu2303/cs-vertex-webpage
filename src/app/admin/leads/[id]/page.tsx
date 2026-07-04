export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LeadResponseActions from './LeadResponseActions'

export default async function LeadDetail({ params }: { params: { id: string } }) {
  const lead = await prisma.formSubmission.findUnique({
    where: { id: params.id }
  })

  if (!lead) return redirect('/admin/leads')

  let parsedData: any = {}
  try {
    if (lead.data) parsedData = JSON.parse(lead.data)
  } catch (e) {}

  return (
    <div>
      <Link href="/admin/leads" className="text-gray-500 text-sm hover:text-white mb-6 inline-block">
        &larr; Back to Leads
      </Link>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Lead / {lead.formType}</h1>
          <p className="text-gray-400">Submitted on {lead.createdAt.toLocaleDateString()} at {lead.createdAt.toLocaleTimeString()}</p>
        </div>
        <div>
          <span className="px-4 py-2 bg-[#222] text-white rounded font-bold uppercase tracking-widest text-sm">
            Status: {lead.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#222] pb-4">Submission Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              {Object.entries(parsedData).map(([k, v]) => (
                <div key={k} className={k === 'description' ? 'col-span-2' : ''}>
                  <strong className="block text-gray-500 uppercase tracking-widest mb-1 text-xs">{k}</strong>
                  <div className="whitespace-pre-wrap">{v as React.ReactNode || 'N/A'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Actions */}
        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-[#222] pb-4">Contact Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Name</span>
                <span className="text-white">{lead.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Company</span>
                <span className="text-white">{lead.company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Email</span>
                <span className="text-white">{lead.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Phone</span>
                <span className="text-white">{lead.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <LeadResponseActions leadId={lead.id} currentStatus={lead.status} customerEmail={lead.email} customerName={lead.name} />
        </div>
      </div>
    </div>
  )
}
