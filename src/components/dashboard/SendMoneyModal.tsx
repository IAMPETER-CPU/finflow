'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Send, Loader2, CheckCircle2, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';

export default function SendMoneyModal() {
  const { sendMoneyModalOpen, setSendMoneyModalOpen } = useUiStore();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [recipient, setRecipient] = useState('John Doe');
  const [account, setAccount] = useState('GTBank •••• 4912');
  const [amount, setAmount] = useState('50000');
  const [category, setCategory] = useState('Client Payment');
  const [description, setDescription] = useState('Website Maintenance Retainer');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  const transferMutation = useMutation({
    mutationFn: async (data: { recipient: string; recipientAccount: string; amount: string; category: string; description: string }) => {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Transfer failed');
      }
      return json;
    },
    onSuccess: (data) => {
      setCompletedTxn(data.transaction);
      setStep(4);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Transfer failed');
      setStep(1);
    },
  });

  if (!sendMoneyModalOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const num = parseFloat(amount);
    if (!recipient.trim() || !num || num <= 0) {
      setErrorMessage('Please enter a valid recipient name and amount.');
      return;
    }
    setStep(2);
  };

  const handleConfirmTransfer = () => {
    setStep(3);
    transferMutation.mutate({
      recipient,
      recipientAccount: account,
      amount,
      category,
      description,
    });
  };

  const handleClose = () => {
    setSendMoneyModalOpen(false);
    setStep(1);
    setErrorMessage('');
    setCompletedTxn(null);
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
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Money</h3>
              <p className="text-xs text-slate-400">Direct simulated bank transfer</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Input Form */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="mt-5 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-400 outline-none font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank / Account
                </label>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="e.g. GTBank •••• 4912"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
                >
                  <option value="Client Payment">Client Payment</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Software">Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description / Note
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment description"
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all mt-4"
            >
              Continue to Confirmation →
            </button>
          </form>
        )}

        {/* Step 2: Confirmation Summary */}
        {step === 2 && (
          <div className="mt-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Transfer To</span>
                <span className="font-bold text-slate-900 dark:text-white">{recipient}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Account Number</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{account}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Category</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{category}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Processing Fee</span>
                <span className="font-bold text-emerald-500">₦0 (Free Promo)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Charge</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Simulated 256-bit encrypted bank transfer protocol</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Loading Processing State */}
        {step === 3 && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-slate-600 dark:text-slate-300 animate-spin mx-auto" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Processing Transfer...
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Simulating banking settlement network and generating receipt...
            </p>
          </div>
        )}

        {/* Step 4: Success State */}
        {step === 4 && completedTxn && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Payment Successful
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {formatCurrency(Math.abs(completedTxn.amount))} sent to {completedTxn.name}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Reference ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {completedTxn.reference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-500">✓ Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(completedTxn.date).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert(`Receipt downloaded for ${completedTxn.reference}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
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
