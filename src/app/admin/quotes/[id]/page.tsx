import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuoteResponseActions from './QuoteResponseActions'



export default async function QuoteDetail({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { customer: true }
  })

  if (!quote) return redirect('/admin/quotes')

  return (
    <div>
      <Link href="/admin/quotes" className="text-gray-500 text-sm hover:text-white mb-6 inline-block">
        &larr; Back to Quotes
      </Link>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quote #{quote.id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-400">Submitted on {quote.createdAt.toLocaleDateString()} at {quote.createdAt.toLocaleTimeString()}</p>
        </div>
        <div>
          <span className="px-4 py-2 bg-[#222] text-white rounded font-bold uppercase tracking-widest text-sm">
            Status: {quote.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#222] pb-4">Project Requirements</h2>
            <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {quote.description}
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Actions */}
        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-[#222] pb-4">Customer Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Name</span>
                <span className="text-white">{quote.customer.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Email</span>
                <span className="text-white">{quote.customer.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Company</span>
                <span className="text-white">{quote.customer.company || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-[#222] pb-4">Admin Actions</h2>
            <QuoteResponseActions quoteId={quote.id} customerId={quote.customerId} currentStatus={quote.status} />
          </div>
        </div>

      </div>
    </div>
  )
}
