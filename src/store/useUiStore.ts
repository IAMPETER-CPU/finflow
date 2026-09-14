import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Search Palette
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  // Modals & Drawers
  sendMoneyModalOpen: boolean;
  setSendMoneyModalOpen: (open: boolean) => void;

  requestPaymentModalOpen: boolean;
  setRequestPaymentModalOpen: (open: boolean) => void;

  createInvoiceModalOpen: boolean;
  setCreateInvoiceModalOpen: (open: boolean) => void;

  addCustomerModalOpen: boolean;
  setAddCustomerModalOpen: (open: boolean) => void;

  selectedTransactionId: string | null;
  setSelectedTransactionId: (id: string | null) => void;

  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  theme: 'dark',
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('finflow-theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finflow-theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    set({ theme });
  },

  searchModalOpen: false,
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),

  sendMoneyModalOpen: false,
  setSendMoneyModalOpen: (open) => set({ sendMoneyModalOpen: open }),

  requestPaymentModalOpen: false,
  setRequestPaymentModalOpen: (open) => set({ requestPaymentModalOpen: open }),

  createInvoiceModalOpen: false,
  setCreateInvoiceModalOpen: (open) => set({ createInvoiceModalOpen: open }),

  addCustomerModalOpen: false,
  setAddCustomerModalOpen: (open) => set({ addCustomerModalOpen: open }),

  selectedTransactionId: null,
  setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),

  selectedCustomerId: null,
  setSelectedCustomerId: (id) => set({ selectedCustomerId: id }),
}));
