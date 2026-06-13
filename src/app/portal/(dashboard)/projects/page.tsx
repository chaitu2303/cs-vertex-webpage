import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'



export default async function CustomerProjectsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/portal/login')
  }

  const customerId = session.user.id
  
  // Ensure customer exists
  let customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer) {
    customer = await prisma.customer.create({
      data: { id: customerId, email: session.user.email || '' }
    })
  }

  const projects = await prisma.clientProject.findMany({
    where: { customerId },
    include: {
      milestones: { orderBy: { createdAt: 'asc' } },
      messages: { orderBy: { createdAt: 'desc' }, take: 5 }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Tracker</h1>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 bg-[#111] border border-[#222] rounded-xl text-center">
          <h3 className="text-xl mb-4">No Active Projects</h3>
          <p className="text-gray-400 mb-6">You don't have any active projects being tracked currently. If you recently requested a quote, your project will appear here once approved.</p>
          <Link href="/portal/quotes" className="px-6 py-3 bg-[#ff5c2a] text-black font-bold rounded-md">
            Request a Quote
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {projects.map(project => (
            <div key={project.id} className="p-6 bg-[#0a0a0a] border border-[#222] rounded-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                  <p className="text-gray-400 text-sm">Started: {project.startDate.toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  project.status === 'Active' ? 'bg-green-900 text-green-300' :
                  project.status === 'Completed' ? 'bg-blue-900 text-blue-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Progress</span>
                  <span className="font-bold text-[#ff5c2a]">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff5c2a] transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b border-[#222] pb-2">Milestones</h3>
                <div className="space-y-4">
                  {project.milestones.map(m => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-[#111] rounded-lg">
                      <div>
                        <p className="font-medium">{m.title}</p>
                        <p className="text-xs text-gray-500">{m.dueDate ? `Due: ${m.dueDate.toLocaleDateString()}` : 'No due date'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        m.status === 'Completed' ? 'bg-green-900/50 text-green-400' :
                        m.status === 'In Progress' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-[#222] text-gray-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                  {project.milestones.length === 0 && <p className="text-gray-500 text-sm">No milestones defined yet.</p>}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

