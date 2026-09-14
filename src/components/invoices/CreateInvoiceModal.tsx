'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { formatCurrency } from '@/lib/utils';
import { Customer } from '@/types';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateInvoiceModal() {
  const { createInvoiceModalOpen, setCreateInvoiceModalOpen } = useUiStore();
  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState('John Doe');
  const [customerEmail, setCustomerEmail] = useState('john.doe@example.com');
  const [dueDate, setDueDate] = useState('2026-09-15');
  const [notes, setNotes] = useState('Thank you for choosing FinFlow services.');
  const [errorMsg, setErrorMsg] = useState('');

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Fintech Web Application Development (Milestone 1)', quantity: 1, unitPrice: 250000 },
  ]);

  const { data: customers } = useQuery({
    queryKey: ['customers', ''],
    queryFn: async () => {
      const res = await fetch('/api/customers');
      const json = await res.json();
      return json.data as Customer[];
    },
  });

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 50000 },
    ]);
  };

  const removeItemRow = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItemRow = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);

  const createInvoiceMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invoice creation failed');
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      handleClose();
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate invoice');
    },
  });

  if (!createInvoiceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || items.length === 0) {
      setErrorMsg('Customer name and at least one item line are required.');
      return;
    }

    createInvoiceMutation.mutate({
      customerName,
      customerEmail,
      dueDate,
      items,
      notes,
    });
  };

  const handleClose = () => {
    setCreateInvoiceModalOpen(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 z-50 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Invoice</h3>
              <p className="text-xs text-slate-400">Build and issue professional client invoices</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Client
              </label>
              <select
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  const found = customers?.find((c) => c.name === e.target.value);
                  if (found) setCustomerEmail(found.email);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
              >
                {customers?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
              />
            </div>
          </div>

          {/* Dynamic Line Items */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Invoice Items
            </label>

            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItemRow(item.id, 'description', e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItemRow(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                  className="w-16 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-center"
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItemRow(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-28 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                />
                <span className="w-24 text-right text-xs font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItemRow(item.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
            >
              <Plus className="w-4 h-4" /> Add Item Line
            </button>
          </div>

          {/* Subtotal & Total Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tax (0%)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₦0</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Grand Total</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createInvoiceMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25"
            >
              {createInvoiceMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
