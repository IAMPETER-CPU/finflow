'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  Send,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { defaultTransactions, defaultCustomers } from '@/lib/mock-data/seed';
import { formatCurrency } from '@/lib/utils';

export default function SearchModal() {
  const router = useRouter();
  const {
    searchModalOpen,
    setSearchModalOpen,
    setSelectedTransactionId,
    setSendMoneyModalOpen,
    setCreateInvoiceModalOpen,
    setAddCustomerModalOpen,
  } = useUiStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const quickPages = [
    { name: 'Overview Dashboard', href: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Transactions History', href: '/dashboard/transactions', icon: ArrowLeftRight },
    { name: 'Financial Analytics', href: '/dashboard/analytics', icon: PieChart },
    { name: 'Customer Directory', href: '/dashboard/customers', icon: Users },
    { name: 'Invoices & Billing', href: '/dashboard/invoices', icon: FileText },
    { name: 'KYC Verification', href: '/dashboard/verification', icon: ShieldCheck },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const quickActions = [
    { name: 'Send Money / Transfer', action: () => setSendMoneyModalOpen(true), icon: Send },
    { name: 'Create New Invoice', action: () => setCreateInvoiceModalOpen(true), icon: FileText },
    { name: 'Add New Customer', action: () => setAddCustomerModalOpen(true), icon: UserPlus },
  ];

  const q = query.toLowerCase().trim();

  const filteredPages = quickPages.filter((p) => p.name.toLowerCase().includes(q));
  const filteredTxns = defaultTransactions.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.reference.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  );
  const filteredCustomers = defaultCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
  );

  const handleNavigate = (href: string) => {
    router.push(href);
    setSearchModalOpen(false);
    setQuery('');
  };

  const handleSelectTxn = (id: string) => {
    setSelectedTransactionId(id);
    setSearchModalOpen(false);
    setQuery('');
  };

  const handleSelectAction = (action: () => void) => {
    setSearchModalOpen(false);
    setQuery('');
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Search Palette Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 z-50 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything (transactions, customers, invoices, pages)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-4 pr-1">
          {/* Quick Actions (when query is empty or matches) */}
          {(!query || query.length < 3) && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Quick Actions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.name}
                      onClick={() => handleSelectAction(act.action)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all text-left"
                    >
                      <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="truncate">{act.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Navigation
              </p>
              <div className="space-y-1">
                {filteredPages.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.name}
                      onClick={() => handleNavigate(p.href)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">{p.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Transactions */}
          {filteredTxns.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Transactions ({filteredTxns.length})
              </p>
              <div className="space-y-1">
                {filteredTxns.slice(0, 5).map((txn) => (
                  <button
                    key={txn.id}
                    onClick={() => handleSelectTxn(txn.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                        {txn.merchantLogo || '⇄'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                          {txn.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          {txn.reference} • {txn.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-extrabold shrink-0 ${
                        txn.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {formatCurrency(txn.amount)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Customers ({filteredCustomers.length})
              </p>
              <div className="space-y-1">
                {filteredCustomers.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate('/dashboard/customers')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{c.company} • {c.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {formatCurrency(c.totalPaid)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredTxns.length === 0 && filteredCustomers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
