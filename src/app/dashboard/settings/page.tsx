'use client';

import { useState } from 'react';
import { User, Shield, Bell, Check, Sparkles } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function SettingsPage() {
  const { user, updateUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [businessName, setBusinessName] = useState(user.businessName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || 'Sara Williams',
      email: email.trim() || 'sara.williams@finflow.io',
      businessName: businessName.trim() || 'Williams Creative & Tech Ltd',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCycleAvatar = () => {
    const seeds = ['Sara', 'Williams', 'Alex', 'Taylor', 'Jordan', 'Morgan'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}_${Date.now()}`;
    updateUser({ avatar: newAvatar });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Manage your personal profile, business details, notifications, and security preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold">
        {[
          { id: 'profile', label: 'Business Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'notifications' | 'security')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            {saved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully! Changes applied across the dashboard.</span>
              </div>
            )}

            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <button
                  type="button"
                  onClick={handleCycleAvatar}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Change Avatar</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-1">Click to generate a fresh avatar</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registered Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all mt-4"
            >
              Save Changes
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { title: 'Payment Alerts', desc: 'Receive instant notifications on payment arrivals and transfers.' },
                { title: 'KYC & Security Alerts', desc: 'Alerts regarding verification and account security.' },
                { title: 'Invoice Reminders', desc: 'Automated status updates for client invoices.' },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Security & Authenticator</h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase">Active</span>
              </div>
              <p className="text-slate-400">Account protected via TOTP Authenticator App.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
