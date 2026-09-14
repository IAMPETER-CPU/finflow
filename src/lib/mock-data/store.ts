import { defaultTransactions, defaultCustomers, defaultInvoices, defaultDashboardSummary } from './seed';
import { Transaction, Customer, Invoice } from '@/types';

// In-memory singletons for API Route Handlers during server lifecycle
export const inMemoryTransactions: Transaction[] = [...defaultTransactions];
export const inMemoryCustomers: Customer[] = [...defaultCustomers];
export const inMemoryInvoices: Invoice[] = [...defaultInvoices];
export const inMemoryDashboardSummary = { ...defaultDashboardSummary };

export function addInMemoryTransaction(txn: Transaction) {
  inMemoryTransactions.unshift(txn);
}

export function addInMemoryCustomer(cust: Customer) {
  inMemoryCustomers.unshift(cust);
}

export function addInMemoryInvoice(inv: Invoice) {
  inMemoryInvoices.unshift(inv);
}
