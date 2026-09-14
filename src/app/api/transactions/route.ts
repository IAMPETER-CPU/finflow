import { NextRequest, NextResponse } from 'next/server';
import { inMemoryTransactions } from '@/lib/mock-data/store';
import { delay } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await delay(500);

  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type') || 'all';
  const status = searchParams.get('status') || 'all';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let filtered = [...inMemoryTransactions];

  if (q) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  if (type !== 'all') {
    filtered = filtered.filter((t) => t.type === type);
  }

  if (status !== 'all') {
    filtered = filtered.filter((t) => t.status === status);
  }

  if (category !== 'all') {
    filtered = filtered.filter((t) => t.category === category);
  }

  // Sort by date descending
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}
