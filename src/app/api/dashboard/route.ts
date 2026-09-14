import { NextResponse } from 'next/server';
import {
  defaultUser,
  defaultDashboardSummary,
  defaultKycStatus,
  defaultTransactions,
  defaultInsights,
  defaultNotifications,
} from '@/lib/mock-data/seed';
import { delay } from '@/lib/utils';

export async function GET() {
  // Artificial network delay to demonstrate loading skeletons
  await delay(600);

  return NextResponse.json({
    success: true,
    user: defaultUser,
    summary: defaultDashboardSummary,
    kyc: defaultKycStatus,
    recentTransactions: defaultTransactions.slice(0, 5),
    insights: defaultInsights,
    notifications: defaultNotifications,
  });
}
