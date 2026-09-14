'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, FileText, Download, CheckCircle2, Clock, AlertTriangle, FileCode, Loader2 } from 'lucide-react';
import { Invoice } from '@/types';
import CreateInvoiceModal from '@/components/invoices/CreateInvoiceModal';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function InvoicesPage() {
  const { setCreateInvoiceModalOpen } = useUiStore();
  const [statusTab, setStatusTab] = useState('all');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', statusTab],
    queryFn: async () => {
      const res = await fetch(`/api/invoices?status=${statusTab}`);
      const json = await res.json();
      return json.data as Invoice[];
    },
  });

  const getStatusBadge = (s: Invoice['status']) => {
    switch (s) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
            <FileCode className="w-3 h-3" /> Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Invoices & Billing
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Create, issue, and manage client invoices with automated billing calculations.
          </p>
        </div>

        <button
          onClick={() => setCreateInvoiceModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm self-start w-fit">
        {['all', 'paid', 'pending', 'overdue', 'draft'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusTab(st)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              statusTab === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium">Fetching invoice ledger...</p>
          </div>
        ) : invoices?.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No invoices found for selected status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Invoice Number</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Issue Date</th>
                  <th className="pb-3 px-3">Due Date</th>
                  <th className="pb-3 px-3">Total Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {invoices?.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{inv.customerName}</p>
                      <p className="text-[11px] text-slate-400">{inv.customerEmail}</p>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {formatDate(inv.issueDate)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="py-3.5 px-3 font-extrabold text-sm text-slate-900 dark:text-white">
                      {formatCurrency(inv.total)}
                    </td>

                    <td className="py-3.5 px-3">{getStatusBadge(inv.status)}</td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloaded Invoice ${inv.invoiceNumber} PDF`)}
                        className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors inline-flex items-center gap-1 font-bold text-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateInvoiceModal />
    </div>
  );
}
