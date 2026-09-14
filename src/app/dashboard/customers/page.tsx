'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus, Mail, Phone, Building, DollarSign, Loader2 } from 'lucide-react';
import { Customer } from '@/types';
import AddCustomerModal from '@/components/customers/AddCustomerModal';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency } from '@/lib/utils';

export default function CustomersPage() {
  const { setAddCustomerModalOpen } = useUiStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/customers?q=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      return json.data as Customer[];
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage your client contacts, track total billings, and create targeted invoices.
          </p>
        </div>

        <button
          onClick={() => setAddCustomerModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by client name, email, company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Customer Directory Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">Loading customer database...</p>
        </div>
      ) : customers?.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          No clients found matching your search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers?.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {cust.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3" /> {cust.company}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    cust.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                  }`}
                >
                  {cust.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.phone}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Total Paid</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {formatCurrency(cust.totalPaid)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Transactions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {cust.transactionCount} payments
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Customer Modal / Drawer detail */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 z-50 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Customer Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
              <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedCustomer.name}</h4>
                <p className="text-xs text-slate-500">{selectedCustomer.company}</p>
                <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1">{selectedCustomer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Total Revenue Generated</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(selectedCustomer.totalPaid)}
                </span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Completed Purchases</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {selectedCustomer.transactionCount} transactions
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/25"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Add customer modal */}
      <AddCustomerModal />
    </div>
  );
}
