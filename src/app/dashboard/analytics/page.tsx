'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AnalyticsTimeframe } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, PieChart as PieIcon, BarChart3, Users, DollarSign, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('30d');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?timeframe=${timeframe}`);
      const json = await res.json();
      return json.data;
    },
  });

  const timeframes: { label: string; value: AnalyticsTimeframe }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '3 Months', value: '3m' },
    { label: '1 Year', value: '1y' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Analytics & Intelligence
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Deep dive into revenue growth, spending breakdown, and customer valuation.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Computing analytical insights...</p>
        </div>
      ) : (
        <>
          {/* Top Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">₦4,500,000</p>
              <p className="text-xs text-emerald-500 font-bold mt-2">↑ 24.8% growth vs last period</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit Margin</span>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">65.5%</p>
              <p className="text-xs text-emerald-500 font-bold mt-2">High profitability index</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Transaction Size</span>
                <BarChart3 className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">₦310,000</p>
              <p className="text-xs text-slate-400 font-medium mt-2">Based on completed invoices</p>
            </div>
          </div>

          {/* Charts Row 1: Large Growth Area Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue & Profit Growth Trend</h3>
                <p className="text-xs text-slate-400">Historical performance metrics</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.revenueOverview || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="profArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold border-b border-slate-800 pb-1">{label}</p>
                            <p className="text-indigo-400 font-medium">Revenue: {formatCurrency(payload[0].value as number)}</p>
                            <p className="text-emerald-400 font-medium">Profit: {formatCurrency(payload[1]?.value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revArea)" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#profArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2: Bar Comparison & Top Clients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Bar Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Income vs Expenses</h3>
                  <p className="text-xs text-slate-400">Comparative financial breakdown</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.monthlyComparison || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                              <p className="text-emerald-400">Income: {formatCurrency(payload[0].value as number)}</p>
                              <p className="text-rose-400">Expense: {formatCurrency(payload[1].value as number)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Clients Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Revenue Clients</h3>
                  <p className="text-xs text-slate-400">Clients contributing most to total earnings</p>
                </div>
              </div>

              <div className="space-y-4">
                {analytics?.topCustomers?.map((client: any, idx: number) => (
                  <div key={client.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">
                        {idx + 1}. {client.name}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(client.amount)} ({client.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                        style={{ width: `${client.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
