"use server"

import { prisma } from '@/lib/prisma'

export async function getAdminAnalytics() {
  const now = new Date()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    projectsCount,
    clientProjectsCount,
    activeClientProjects,
    quotesCount,
    pendingQuotesCount,
    approvedQuotesCount,
    certificatesCount,
    courseCount,
    customerCount,
    supportTicketsCount,
    openTicketsCount,
    internshipApplicationsCount,
    jobApplicationsCount,
    analyticsAggregate,
    lastMonthAnalytics,
    uniqueVisitorsCount,
    workshopCount,
    notifyMeCount,
    announcementsCount,
    auditLogs,
    recentQuotes,
    recentCustomers,
    recentTickets,
    analyticsDaily,
    testimonialCount,
    consultationCount,
    notificationCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.clientProject.count(),
    prisma.clientProject.count({ where: { status: 'Active' } }),
    prisma.quote.count(),
    prisma.quote.count({ where: { status: 'Pending Review' } }),
    prisma.quote.count({ where: { status: 'Approved' } }),
    prisma.certificate.count(),
    prisma.course.count(),
    prisma.customer.count(),
    prisma.supportTicket.count(),
    prisma.supportTicket.count({ where: { status: 'Open' } }),
    prisma.internshipApplication.count(),
    prisma.jobApplication.count(),
    // Analytics uses `date` field, not `createdAt`
    prisma.analytics.aggregate({ _sum: { views: true } }),
    prisma.analytics.aggregate({
      _sum: { views: true },
      where: { date: { gte: startOfLastMonth, lte: endOfLastMonth } }
    }),
    prisma.analytics.count(),
    prisma.workshop.count(),
    prisma.notifyMe.count(),
    prisma.announcement.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, service: true, status: true, createdAt: true, budget: true,
        customer: { select: { name: true } }
      }
    }),
    prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, company: true }
    }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, subject: true, status: true, createdAt: true }
    }),
    // Analytics uses `date` for filtering
    prisma.analytics.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: 'asc' },
      select: { views: true, date: true }
    }),
    prisma.testimonial.count(),
    prisma.consultation.count(),
    prisma.notification.count(),
  ])

  // Build daily traffic for last 7 days
  const dailyMap: Record<string, number> = {}
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const key = days[d.getDay()]
    dailyMap[key] = 0
  }
  analyticsDaily.forEach(a => {
    const key = days[a.date.getDay()]
    dailyMap[key] = (dailyMap[key] || 0) + (a.views || 1)
  })
  const trafficTrend = Object.entries(dailyMap).map(([day, visits]) => ({ day, visits }))

  const thisMonthViews = analyticsAggregate._sum.views || 0
  const lastMonthViews = lastMonthAnalytics._sum.views || 0
  const viewsGrowth = lastMonthViews > 0
    ? Math.round(((thisMonthViews - lastMonthViews) / lastMonthViews) * 100)
    : 0

  return {
    projectsCount,
    clientProjectsCount,
    activeClientProjects,
    quotesCount,
    pendingQuotesCount,
    approvedQuotesCount,
    certificatesCount,
    courseCount,
    customerCount,
    supportTicketsCount,
    openTicketsCount,
    internshipApplicationsCount,
    jobApplicationsCount,
    workshopCount,
    notifyMeCount,
    announcementsCount,
    testimonialCount,
    consultationCount,
    notificationCount,
    viewsCount: thisMonthViews,
    uniqueVisitorsCount,
    viewsGrowth,
    auditLogs: auditLogs.map(log => ({
      action: log.action,
      resource: log.resource,
      admin: log.adminId || 'System',
      ipAddress: log.ipAddress || 'Internal',
      time: log.createdAt.toLocaleTimeString(),
    })),
    recentQuotes: recentQuotes.map(q => ({
      id: q.id,
      name: q.customer.name,
      service: q.service,
      status: q.status,
      budget: q.budget || 'N/A',
      time: q.createdAt.toLocaleDateString(),
    })),
    recentCustomers: recentCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      company: c.company || '—',
      time: c.createdAt.toLocaleDateString(),
    })),
    recentTickets: recentTickets.map(t => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
      time: t.createdAt.toLocaleDateString(),
    })),
    trafficTrend,
  }
}
