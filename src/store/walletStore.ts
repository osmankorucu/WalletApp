import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Transaction, Category, Settings } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Maaş', icon: '💰', color: '#4CAF50', type: 'income' },
  { id: '2', name: 'Alışveriş', icon: '🛒', color: '#FF5722', type: 'expense' },
  { id: '3', name: 'Ulaşım', icon: '🚗', color: '#2196F3', type: 'expense' },
  { id: '4', name: 'Yemek', icon: '🍔', color: '#FFC107', type: 'expense' },
  { id: '5', name: 'Faturalar', icon: '📄', color: '#9C27B0', type: 'expense' },
  { id: '6', name: 'Eğlence', icon: '🎬', color: '#E91E63', type: 'expense' },
  { id: '7', name: 'Sağlık', icon: '🏥', color: '#00BCD4', type: 'expense' },
  { id: '8', name: 'Kira', icon: '🏠', color: '#795548', type: 'expense' },
  { id: '9', name: 'Harcama', icon: '💳', color: '#607D8B', type: 'expense' },
  { id: '10', name: 'Gelir', icon: '📈', color: '#8BC34A', type: 'income' },
];

const DEFAULT_SETTINGS: Settings = {
  currency: 'TRY',
  theme: 'system',
  fontSize: 'medium',
  autoSuggestCategories: true,
  defaultAccountId: null,
  sortAccountsBy: 'name',
  biometricEnabled: false,
  budgetAlerts: true,
  backupEnabled: false,
};

interface WalletStore {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  settings: Settings;
  selectedDate: Date;
  isLoading: boolean;
  
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  getAccountTransactions: (accountId: string, startDate?: Date, endDate?: Date) => Transaction[];
  getAccountBalance: (accountId: string) => number;
  getTotalBalance: () => number;
  
  updateSettings: (updates: Partial<Settings>) => void;
  setSelectedDate: (date: Date) => void;
  
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useWalletStore = create<WalletStore>((set, get) => ({
  accounts: [],
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  settings: DEFAULT_SETTINGS,
  selectedDate: new Date(),
  isLoading: true,

  addAccount: (account) => {
    const newAccount: Account = {
      ...account,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ accounts: [...state.accounts, newAccount] }));
    get().saveData();
  },

  updateAccount: (id, updates) => {
    set((state) => ({
      accounts: state.accounts.map((acc) => 
        acc.id === id ? { ...acc, ...updates } : acc
      ),
    }));
    get().saveData();
  },

  deleteAccount: (id) => {
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
      transactions: state.transactions.filter((t) => t.accountId !== id),
    }));
    get().saveData();
  },

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => {
      const updatedTransactions = [...state.transactions, newTransaction];
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === transaction.accountId) {
          const balanceChange = transaction.type === 'income' 
            ? transaction.amount 
            : -transaction.amount;
          return { ...acc, balance: acc.balance + balanceChange };
        }
        return acc;
      });
      return { transactions: updatedTransactions, accounts: updatedAccounts };
    });
    get().saveData();
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
    get().saveData();
  },

  deleteTransaction: (id) => {
    set((state) => {
      const transaction = state.transactions.find((t) => t.id === id);
      if (!transaction) return state;
      
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === transaction.accountId) {
          const balanceChange = transaction.type === 'income' 
            ? -transaction.amount 
            : transaction.amount;
          return { ...acc, balance: acc.balance + balanceChange };
        }
        return acc;
      });
      
      return {
        transactions: state.transactions.filter((t) => t.id !== id),
        accounts: updatedAccounts,
      };
    });
    get().saveData();
  },

  getAccountTransactions: (accountId, startDate, endDate) => {
    const { transactions } = get();
    return transactions
      .filter((t) => {
        if (t.accountId !== accountId) return false;
        const transDate = new Date(t.date);
        if (startDate && transDate < startDate) return false;
        if (endDate && transDate > endDate) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getAccountBalance: (accountId) => {
    const { accounts } = get();
    const account = accounts.find((a) => a.id === accountId);
    return account?.balance ?? 0;
  },

  getTotalBalance: () => {
    const { accounts } = get();
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  },

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
    }));
    get().saveData();
  },

  setSelectedDate: (date) => set({ selectedDate: date }),

  loadData: async () => {
    try {
      const [accountsData, transactionsData, settingsData] = await Promise.all([
        AsyncStorage.getItem('accounts'),
        AsyncStorage.getItem('transactions'),
        AsyncStorage.getItem('settings'),
      ]);

      set({
        accounts: accountsData ? JSON.parse(accountsData) : [],
        transactions: transactionsData ? JSON.parse(transactionsData) : [],
        settings: settingsData ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsData) } : DEFAULT_SETTINGS,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ isLoading: false });
    }
  },

  saveData: async () => {
    try {
      const { accounts, transactions, settings } = get();
      await Promise.all([
        AsyncStorage.setItem('accounts', JSON.stringify(accounts)),
        AsyncStorage.setItem('transactions', JSON.stringify(transactions)),
        AsyncStorage.setItem('settings', JSON.stringify(settings)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },
}));
