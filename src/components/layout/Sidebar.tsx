'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useKycStore } from '@/store/useKycStore';
import { defaultUser } from '@/lib/mock-data/seed';
import Logo from '@/components/ui/Logo';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  isKyc?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
];

const manageNavItems: NavItem[] = [
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
];

const accountNavItems: NavItem[] = [
  { name: 'Verification (KYC)', href: '/dashboard/verification', icon: ShieldCheck, isKyc: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { kyc } = useKycStore();

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1 mb-5">
      <h3 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
        {title}
      </h3>
      {items.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/dashboard/overview' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        const isKyc = Boolean(item.isKyc);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group relative flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150',
              isActive
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive
                    ? 'text-white dark:text-slate-950'
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                )}
              />
              <span>{item.name}</span>
            </div>

            {isKyc ? (
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  kyc.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                )}
              >
                {kyc.status === 'verified' ? '✓' : `${kyc.progressPercentage}%`}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 px-4 py-5 justify-between transition-colors">
      <div>
        {/* Minimalist FinFlow Logo */}
        <div className="px-3 mb-7">
          <Link href="/dashboard/overview">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-1">
          {renderNavGroup('MAIN', mainNavItems)}
          {renderNavGroup('MANAGE', manageNavItems)}
          {renderNavGroup('ACCOUNT', accountNavItems)}
        </nav>
      </div>

      {/* User Profile Card Footer */}
      <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
        <Link
          href="/dashboard/settings"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 shrink-0">
              <img
                src={defaultUser.avatar}
                alt={defaultUser.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {defaultUser.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{defaultUser.accountType}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
        </Link>
      </div>
    </aside>
  );
}
