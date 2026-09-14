'use client';

import { ArrowUpRight, ArrowDownLeft, PlusCircle, UserPlus } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';

export default function QuickActions() {
  const {
    setSendMoneyModalOpen,
    setRequestPaymentModalOpen,
    setCreateInvoiceModalOpen,
    setAddCustomerModalOpen,
  } = useUiStore();

  const actions = [
    {
      label: 'Send Money',
      icon: ArrowUpRight,
      onClick: () => setSendMoneyModalOpen(true),
      isPrimary: true,
    },
    {
      label: 'Request Payment',
      icon: ArrowDownLeft,
      onClick: () => setRequestPaymentModalOpen(true),
      isPrimary: false,
    },
    {
      label: 'Create Invoice',
      icon: PlusCircle,
      onClick: () => setCreateInvoiceModalOpen(true),
      isPrimary: false,
    },
    {
      label: 'Add Customer',
      icon: UserPlus,
      onClick: () => setAddCustomerModalOpen(true),
      isPrimary: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Quick Actions
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Instant execution</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.onClick}
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 active:scale-[0.98] ${
                act.isPrimary
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100'
                  : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
