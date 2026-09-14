import { NextRequest, NextResponse } from 'next/server';
import { defaultAnalytics } from '@/lib/mock-data/seed';
import { delay } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await delay(600);

  const searchParams = request.nextUrl.searchParams;
  const timeframe = searchParams.get('timeframe') || '30d';

  const analytics = defaultAnalytics[timeframe] || defaultAnalytics['30d'];

  return NextResponse.json({
    success: true,
    data: analytics,
  });
}
