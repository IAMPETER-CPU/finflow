'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, AlertOctagon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Transaction } from '@/types';
import { useUiStore } from '@/store/useUiStore';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function TransactionsTable() {
  const { setSelectedTransactionId } = useUiStore();

  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', q, type, status, category, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        q,
        type,
        status,
        category,
        page: String(page),
        limit: '8',
      });
      const res = await fetch(`/api/transactions?${params.toString()}`);
      const json = await res.json();
      return json;
    },
  });

  const getStatusBadge = (s: Transaction['status']) => {
    switch (s) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
            <AlertOctagon className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-5">
      {/* Controls & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by recipient, ref ID, description..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setPage(1);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-bold capitalize transition-all',
                  type === t
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-3 py-2 rounded-xl outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Client Payment">Client Payment</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Utilities">Utilities</option>
            <option value="Software">Software</option>
            <option value="Marketing">Marketing</option>
            <option value="Consulting">Consulting</option>
            <option value="Office">Office</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 px-3">Transaction</th>
              <th className="pb-3 px-3">Category</th>
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3">Amount</th>
              <th className="pb-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                  Fetching transaction records...
                </td>
              </tr>
            ) : data?.data?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No matching transaction records found.
                </td>
              </tr>
            ) : (
              data?.data?.map((txn: Transaction) => {
                const isIncome = txn.type === 'income';

                return (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTransactionId(txn.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {txn.avatar ? (
                          <img
                            src={txn.avatar}
                            alt={txn.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0',
                              isIncome
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            )}
                          >
                            {txn.merchantLogo ? (
                              txn.merchantLogo
                            ) : isIncome ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {txn.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">{txn.reference}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {txn.category}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {formatDateTime(txn.date)}
                    </td>

                    <td
                      className={cn(
                        'py-3.5 px-3 font-extrabold text-sm',
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      )}
                    >
                      {txn.formattedAmount}
                    </td>

                    <td className="py-3.5 px-3">{getStatusBadge(txn.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data?.pagination && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <p className="text-slate-400 font-medium">
            Showing Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total transactions)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page >= data.pagination.totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
