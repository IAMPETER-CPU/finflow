import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  const symbol = currency === 'NGN' ? '₦' : '$';
  const absAmount = Math.abs(amount);
  
  let formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(absAmount);

  // Compact shorthand formatting for large numbers if needed
  if (absAmount >= 1000000000) {
    formatted = (absAmount / 1000000000).toFixed(2) + 'B';
  } else if (absAmount >= 100000000) {
    formatted = (absAmount / 1000000).toFixed(1) + 'M';
  }

  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
}

export function formatExactCurrency(amount: number, currencySymbol: string = '₦'): string {
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${currencySymbol}${formatted}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
