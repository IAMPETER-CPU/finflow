'use client';

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
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { useKycStore } from '@/store/useKycStore';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';

const navItems = [
  { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Verification (KYC)', href: '/dashboard/verification', icon: ShieldCheck },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, theme, toggleTheme } = useUiStore();
  const { kyc } = useKycStore();
  const { user } = useUserStore();

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 shadow-2xl p-5 flex flex-col justify-between z-50 animate-in slide-in-from-left duration-200 border-r border-slate-200 dark:border-slate-800">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-slate-900">
            <Logo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard/overview' && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.name.includes('KYC') && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase',
                        kyc.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      )}
                    >
                      {kyc.status === 'verified' ? '✓' : `${kyc.progressPercentage}%`}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: Theme Toggle & Profile Info */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Quick Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">{theme}</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-1.5 rounded-xl">
            <div className="relative w-10 h-10 shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user.accountType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
