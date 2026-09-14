'use client';

import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertOctagon, ChevronRight } from 'lucide-react';
import { Transaction } from '@/types';
import { useUiStore } from '@/store/useUiStore';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { setSelectedTransactionId } = useUiStore();

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-2.5 h-2.5" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
            <AlertOctagon className="w-2.5 h-2.5" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <p className="text-[11px] text-slate-400">Live payment activity across your account</p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-xs font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {transactions.map((txn) => {
          const isIncome = txn.type === 'income';

          return (
            <div
              key={txn.id}
              onClick={() => setSelectedTransactionId(txn.id)}
              className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar / Icon */}
                {txn.avatar ? (
                  <img
                    src={txn.avatar}
                    alt={txn.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold border border-slate-200/60 dark:border-slate-700/60',
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    )}
                  >
                    {txn.merchantLogo ? (
                      txn.merchantLogo
                    ) : isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {txn.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {txn.category} • {formatDateTime(txn.date)}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span
                  className={cn(
                    'text-xs sm:text-sm font-bold block',
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  )}
                >
                  {txn.formattedAmount}
                </span>
                <div className="mt-0.5">{getStatusBadge(txn.status)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
