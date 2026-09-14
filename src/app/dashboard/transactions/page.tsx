'use client';

import TransactionsTable from '@/components/transactions/TransactionsTable';
import TransactionDrawer from '@/components/dashboard/TransactionDrawer';
import SendMoneyModal from '@/components/dashboard/SendMoneyModal';
import { useUiStore } from '@/store/useUiStore';
import { ArrowUpRight } from 'lucide-react';

export default function TransactionsPage() {
  const { setSendMoneyModalOpen } = useUiStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transactions History
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            View, search, filter, and audit all incoming and outgoing business transactions.
          </p>
        </div>

        <button
          onClick={() => setSendMoneyModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Transactions Management Table */}
      <TransactionsTable />

      {/* Slide-out details drawer & modal */}
      <TransactionDrawer />
      <SendMoneyModal />
    </div>
  );
}
