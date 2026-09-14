'use client';

import { useQuery } from '@tanstack/react-query';
import KycBanner from '@/components/dashboard/KycBanner';
import SummaryCards from '@/components/dashboard/SummaryCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RevenueChart from '@/components/dashboard/RevenueChart';
import ExpenseBreakdownChart from '@/components/dashboard/ExpenseBreakdownChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FinancialInsights from '@/components/dashboard/FinancialInsights';
import { Loader2 } from 'lucide-react';

export default function OverviewPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      return json;
    },
  });

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-slate-600 dark:text-slate-300 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading FinFlow Financial Command Center...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-16 text-center text-rose-500 font-semibold text-sm">
        Failed to load dashboard data. Please try refreshing.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. KYC Verification Banner */}
      <KycBanner />

      {/* 2. Financial Metrics Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* 3. Interactive Quick Actions */}
      <QuickActions />

      {/* 4. Financial Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ExpenseBreakdownChart />
        </div>
      </div>

      {/* 5. Recent Transactions Feed */}
      <RecentTransactions transactions={data.recentTransactions} />

      {/* 6. Smart Financial Insights */}
      <FinancialInsights insights={data.insights} />
    </div>
  );
}
