import { NextRequest, NextResponse } from 'next/server';
import { inMemoryTransactions } from '@/lib/mock-data/store';
import { delay } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(400);

  const { id } = await params;
  const found = inMemoryTransactions.find((t) => t.id === id);

  if (!found) {
    return NextResponse.json(
      { success: false, message: 'Transaction not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: found,
  });
}
