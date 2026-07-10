import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Sorting
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Filters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sourcePage = searchParams.get('sourcePage');
    const dateRange = searchParams.get('dateRange'); // 'today', 'week', 'month', etc.

    // Build Prisma Where Clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { interest: { contains: search } }
      ];
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (sourcePage && sourcePage !== 'All') {
      where.sourcePage = sourcePage;
    }

    if (dateRange) {
      const now = new Date();
      if (dateRange === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0));
        where.createdAt = { gte: today };
      } else if (dateRange === 'week') {
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        where.createdAt = { gte: lastWeek };
      } else if (dateRange === 'month') {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        where.createdAt = { gte: lastMonth };
      }
    }

    const [total, data] = await Promise.all([
      prisma.notifyMe.count({ where }),
      prisma.notifyMe.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limit,
        include: {
          notes: { orderBy: { createdAt: 'desc' } },
          activities: { orderBy: { createdAt: 'desc' } }
        }
      })
    ]);

    // Top Summary Cards
    const summary = await prisma.notifyMe.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    const summaryData = {
      total: await prisma.notifyMe.count(),
      new: summary.find(s => s.status === 'New')?._count._all || 0,
      contacted: summary.find(s => s.status === 'Contacted')?._count._all || 0,
      inProgress: summary.find(s => s.status === 'In Progress')?._count._all || 0,
      converted: summary.find(s => s.status === 'Converted')?._count._all || 0,
      closed: summary.find(s => s.status === 'Closed')?._count._all || 0,
    };

    // Charts Analytics (For Recharts)
    const allLeads = await prisma.notifyMe.findMany();
    
    // 1. Leads by Month
    const monthlyMap: Record<string, number> = {};
    allLeads.forEach(lead => {
      const month = lead.createdAt.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });
    const leadsByMonth = Object.keys(monthlyMap).map(name => ({ name, value: monthlyMap[name] }));

    // 2. Leads by Source
    const sourceMap: Record<string, number> = {};
    allLeads.forEach(lead => {
      const source = lead.sourcePage || 'General';
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });
    const leadsBySource = Object.keys(sourceMap).map(name => ({ name, value: sourceMap[name] }));

    // 3. Status Distribution
    const statusDist = summary.map(s => ({ name: s.status, value: s._count._all }));

    // 4. Interest Categories
    const interestMap: Record<string, number> = {};
    allLeads.forEach(lead => {
      const interest = lead.interest || 'Other';
      interestMap[interest] = (interestMap[interest] || 0) + 1;
    });
    const interestCategories = Object.keys(interestMap).map(name => ({ name, value: interestMap[name] }));

    // 5. Conversion Rate (Converted / Total * 100)
    const convertedTotal = summary.find(s => s.status === 'Converted')?._count._all || 0;
    const conversionRate = allLeads.length > 0 ? (convertedTotal / allLeads.length) * 100 : 0;

    return NextResponse.json({
      data,
      summary: summaryData,
      analytics: {
        leadsByMonth,
        leadsBySource,
        statusDist,
        interestCategories,
        conversionRate: conversionRate.toFixed(1)
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Failed to fetch requests:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    await prisma.notifyMe.deleteMany({
      where: { id: { in: ids } }
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Failed to delete requests:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
