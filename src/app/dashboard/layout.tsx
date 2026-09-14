import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import SearchModal from '@/components/layout/SearchModal';
import SendMoneyModal from '@/components/dashboard/SendMoneyModal';
import RequestPaymentModal from '@/components/dashboard/RequestPaymentModal';
import CreateInvoiceModal from '@/components/invoices/CreateInvoiceModal';
import AddCustomerModal from '@/components/customers/AddCustomerModal';
import TransactionDrawer from '@/components/dashboard/TransactionDrawer';
import QueryProvider from '@/components/providers/QueryProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
        {/* Fixed Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Nav Overlay */}
        <MobileNav />

        {/* Global Search Palette Modal */}
        <SearchModal />

        {/* Global Interactive Action Modals */}
        <SendMoneyModal />
        <RequestPaymentModal />
        <CreateInvoiceModal />
        <AddCustomerModal />
        <TransactionDrawer />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
