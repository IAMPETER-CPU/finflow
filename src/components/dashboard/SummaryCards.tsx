'use client';

import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';
import { DashboardSummary } from '@/types';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      amount: summary.formattedBalance,
      change: summary.balanceChange,
      isPositive: summary.balanceChange >= 0,
      icon: Wallet,
    },
    {
      title: 'Total Income',
      amount: summary.formattedIncome,
      change: summary.incomeChange,
      isPositive: summary.incomeChange >= 0,
      icon: ArrowDownLeft,
    },
    {
      title: 'Total Expenses',
      amount: summary.formattedExpenses,
      change: summary.expenseChange,
      isPositive: summary.expenseChange < 0,
      icon: ArrowUpRight,
    },
    {
      title: 'Net Profit',
      amount: summary.formattedNetProfit,
      change: summary.netProfitChange,
      isPositive: summary.netProfitChange >= 0,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.change >= 0 ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.title}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.amount}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3.5 text-xs">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px]',
                  card.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                )}
              >
                <TrendIcon className="w-3 h-3" />
                {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
              </span>
              <span className="text-slate-400 text-[11px]">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
