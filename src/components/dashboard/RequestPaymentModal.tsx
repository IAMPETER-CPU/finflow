'use client';

import { useState } from 'react';
import { X, ArrowDownLeft, Copy, Check, QrCode, Share2, CheckCircle2 } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency } from '@/lib/utils';

export default function RequestPaymentModal() {
  const { requestPaymentModalOpen, setRequestPaymentModalOpen } = useUiStore();

  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientEmail, setClientEmail] = useState('sarah.j@techventures.io');
  const [amount, setAmount] = useState('150000');
  const [description, setDescription] = useState('UI Consulting Deposit (Milestone 2)');
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  if (!requestPaymentModalOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `FLW-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedLink(`https://pay.finflow.io/req/${ref}`);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setRequestPaymentModalOpen(false);
    setGeneratedLink(null);
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 z-50 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Payment</h3>
              <p className="text-xs text-slate-400">Generate instant client checkout link</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payer / Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Client Email Address
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Requested Amount (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="150000"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Note / Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment purpose"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all mt-4"
            >
              Generate Payment Link →
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4 animate-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Payment Request Ready
              </h4>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {formatCurrency(parseFloat(amount) || 0)}
              </p>
              <p className="text-xs text-slate-400">Request for {clientName}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase">
                Shareable Payment Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shrink-0 flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-100"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert(`Payment request sent to ${clientEmail} via email.`)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Simulate Send Email</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
