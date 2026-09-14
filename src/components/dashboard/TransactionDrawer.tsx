'use client';

import { useQuery } from '@tanstack/react-query';
import { X, Download, ShieldCheck, Copy, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function TransactionDrawer() {
  const { selectedTransactionId, setSelectedTransactionId } = useUiStore();
  const [copied, setCopied] = useState(false);

  const { data: transaction } = useQuery({
    queryKey: ['transaction', selectedTransactionId],
    queryFn: async () => {
      if (!selectedTransactionId) return null;
      const res = await fetch(`/api/transactions/${selectedTransactionId}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!selectedTransactionId,
  });

  if (!selectedTransactionId) return null;

  const handleClose = () => setSelectedTransactionId(null);

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isIncome = transaction?.type === 'income';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Side Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between z-50 animate-in slide-in-from-right duration-200">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transaction Details</h3>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {transaction ? (
              <div className="mt-5 space-y-5">
                {/* Main Recipient Card */}
                <div className="text-center bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center mx-auto shadow-xs">
                    {transaction.avatar ? (
                      <img src={transaction.avatar} alt={transaction.name} className="w-12 h-12 rounded-xl object-cover" />
                    ) : isIncome ? (
                      <ArrowDownLeft className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {transaction.name}
                  </h4>
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </p>

                  <div className="inline-block mt-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        transaction.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : transaction.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>

                {/* Metadata List */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Reference ID</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                      <span>{transaction.reference}</span>
                      <button
                        onClick={() => copyRef(transaction.reference)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Date & Time</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDateTime(transaction.date)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Category</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {transaction.category}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">
                      {isIncome ? 'Sender Account' : 'Recipient Account'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {transaction.senderAccount || transaction.recipientAccount || 'FinFlow Direct'}
                    </span>
                  </div>

                  <div className="py-2">
                    <span className="text-slate-400 block mb-1">Description</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl text-xs">
                      {transaction.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">Loading details...</div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => alert(`Official Receipt PDF for ${transaction?.reference} generated.`)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified by FinFlow Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
