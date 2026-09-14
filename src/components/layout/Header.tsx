'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, CheckCircle2, ShieldAlert, CreditCard, Sun, Moon } from 'lucide-react';
import { defaultNotifications, defaultUser } from '@/lib/mock-data/seed';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/lib/utils';

export default function Header() {
  const { toggleSidebar, theme, toggleTheme, setSearchModalOpen } = useUiStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [notificationsList, setNotificationsList] = useState(defaultNotifications);

  // Dynamic Date & Greeting State
  const [greeting, setGreeting] = useState('Good morning');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    const formatted = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(now);
    setCurrentDateStr(formatted);
  }, []);

  const markAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'kyc':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button (Logo and Greeting removed on mobile) */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none shrink-0"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop/Tablet Greeting (Hidden on mobile) */}
          <div className="hidden md:block min-w-0">
            <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
              <span>{greeting}, Peter</span>
              <span>👋</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {currentDateStr || 'Today'} • Financial Overview
            </p>
          </div>
        </div>

        {/* Right Side: Search Trigger, Dark Mode Toggle, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Functional Global Search Trigger Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
            <span className="hidden sm:inline-block">
              Search...
            </span>
            <span className="hidden md:inline-block text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-400">
              ⌘K
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-colors"
            aria-label="Toggle color theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-slate-900 dark:text-white hover:underline font-bold"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-start gap-2.5 p-2.5 rounded-xl transition-colors text-xs',
                        item.read
                          ? 'bg-slate-50/50 dark:bg-slate-800/30'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60'
                      )}
                    >
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0 mt-0.5">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 text-[11px]">
                          {item.message}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with shrink prevention */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-slate-800 shrink-0">
            <img
              src={defaultUser.avatar}
              alt={defaultUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
