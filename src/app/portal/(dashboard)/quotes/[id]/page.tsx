import { prisma } from '@/lib/prisma'
import { getCachedUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CustomerQuoteDetailsPage({ params }: { params: { id: string } }) {
  const user = await getCachedUser()

  if (!user) redirect('/portal/login')

  const quote = await prisma.quote.findUnique({
    where: { id: params.id, customerId: user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  if (!quote) return <div className="p-8 text-center text-red-500">Quote not found or access denied.</div>

  async function addMessage(formData: FormData) {
    'use server'
    const text = formData.get('text') as string
    if (!text.trim()) return

    await prisma.quoteMessage.create({
      data: {
        quoteId: params.id,
        sender: 'Customer',
        text
      }
    })

    // Notify Admin
    await prisma.notification.create({
      data: {
        userId: 'ADMIN',
        title: 'New Client Message',
        message: `Client replied to Quote Request: ${quote!.service}`
      }
    })

    revalidatePath(`/portal/quotes/${params.id}`)
    revalidatePath(`/admin/quotes/${params.id}`)
  }

  return (
    <div>
      <Link href="/portal/quotes" className="text-gray-500 hover:text-white mb-6 inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Back to My Quotes
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{quote.service}</h1>
          <p className="text-gray-400">Submitted on: {quote.createdAt.toLocaleDateString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-md font-bold ${
          quote.status === 'Pending Review' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' :
          quote.status === 'Proposal Sent' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
          quote.status === 'Approved' ? 'bg-green-900/50 text-green-400 border border-green-800' :
          quote.status === 'Completed' ? 'bg-purple-900/50 text-purple-400 border border-purple-800' :
          'bg-[#222] text-gray-400'
        }`}>
          {quote.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Project Details */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Initial Request</h3>
            <div className="mb-4">
              <span className="text-xs text-gray-500 block">Your Budget</span>
              <p className="text-white font-medium">{quote.budget || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Description</span>
              <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{quote.description}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-blue-900/30">
            <h3 className="text-sm text-blue-400 uppercase tracking-widest mb-4">CS Vertex Assessment</h3>
            <div className="mb-4">
              <span className="text-xs text-gray-500 block">Estimated Cost</span>
              <p className="text-white font-medium text-lg">{quote.estimatedCost || 'Pending evaluation...'}</p>
            </div>
            <div className="mb-6">
              <span className="text-xs text-gray-500 block">Estimated Timeline</span>
              <p className="text-white font-medium">{quote.timeline || 'Pending evaluation...'}</p>
            </div>
            
            {quote.proposalUrl ? (
              <a href={quote.proposalUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 transition">
                Download Proposal PDF
              </a>
            ) : (
              <div className="p-3 bg-[#222] text-gray-500 text-center rounded-md text-sm">
                Proposal not yet generated
              </div>
            )}
          </div>

        </div>

        {/* Discussion */}
        <div className="lg:col-span-2">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222] h-full flex flex-col">
            <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-6">Project Discussion</h3>
            
            <div className="flex-1 space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
              {quote.messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'Customer' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500 mb-1">{msg.sender === 'Customer' ? 'You' : 'CS Vertex'} • {msg.createdAt.toLocaleDateString()}</span>
                  <div className={`px-4 py-3 rounded-lg max-w-[80%] ${msg.sender === 'Customer' ? 'bg-[#ff5c2a] text-black' : 'bg-[#222] text-white border border-[#333]'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {quote.messages.length === 0 && <p className="text-gray-500 text-center text-sm py-8">Start the discussion...</p>}
            </div>

            <form action={addMessage} className="flex gap-2 mt-auto">
              <input name="text" required placeholder="Type your message..." className="flex-1 p-3 bg-black border border-[#333] text-white rounded-md" />
              <button type="submit" className="px-6 py-3 bg-[#ff5c2a] text-black font-bold rounded-md">Send</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
