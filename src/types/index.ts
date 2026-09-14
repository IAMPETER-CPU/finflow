export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory =
  | 'Subscriptions'
  | 'Utilities'
  | 'Client Payment'
  | 'Software'
  | 'Marketing'
  | 'Consulting'
  | 'Office'
  | 'Transfer'
  | 'Payroll';

export interface Transaction {
  id: string;
  name: string;
  avatar?: string;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  timestamp: number;
  amount: number;
  formattedAmount: string;
  status: TransactionStatus;
  reference: string;
  description: string;
  recipientAccount?: string;
  senderAccount?: string;
  merchantLogo?: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'pending';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  company: string;
  totalPaid: number;
  formattedTotalPaid: string;
  transactionCount: number;
  status: CustomerStatus;
  createdAt: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  formattedTotal: string;
  status: InvoiceStatus;
  notes?: string;
}

export type KYCStatus = 'not_started' | 'in_progress' | 'pending_review' | 'verified' | 'action_required';

export interface KYCVerification {
  step: number;
  status: KYCStatus;
  progressPercentage: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    dob: string;
    phone: string;
    address?: string;
  };
  document: {
    type: 'national_id' | 'drivers_license' | 'passport';
    fileName?: string;
    fileSize?: string;
    uploadedAt?: string;
  };
  selfieVerified: boolean;
  submittedAt?: string;
  reviewerNotes?: string;
}

export interface DashboardSummary {
  totalBalance: number;
  formattedBalance: string;
  balanceChange: number;
  totalIncome: number;
  formattedIncome: string;
  incomeChange: number;
  totalExpenses: number;
  formattedExpenses: string;
  expenseChange: number;
  netProfit: number;
  formattedNetProfit: string;
  netProfitChange: number;
  currency: string;
  currencySymbol: string;
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
  actionLabel?: string;
  actionUrl?: string;
}

export type AnalyticsTimeframe = '7d' | '30d' | '3m' | '1y';

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  expense: number;
  profit: number;
}

export interface ExpenseCategoryPoint {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export type ExpenseBreakdownItem = ExpenseCategoryPoint;

export interface MonthlyComparisonPoint {
  month: string;
  income: number;
  expense: number;
}

export interface TopCustomerPoint {
  name: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsData {
  timeframe: AnalyticsTimeframe;
  revenueOverview: RevenueDataPoint[];
  expenseBreakdown: ExpenseCategoryPoint[];
  monthlyComparison: MonthlyComparisonPoint[];
  topCustomers: TopCustomerPoint[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  accountType: string;
  businessName: string;
  currency: string;
  currencySymbol: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'transaction' | 'kyc' | 'system' | 'invoice';
}
