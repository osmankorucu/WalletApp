// Types for Wallet App

export type AccountType = 'cash' | 'bank' | 'credit_card';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'income' | 'expense';
  name: string;
  category: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Settings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  autoSuggestCategories: boolean;
  defaultAccountId: string | null;
  sortAccountsBy: 'name' | 'balance' | 'createdAt';
  biometricEnabled: boolean;
  budgetAlerts: boolean;
  backupEnabled: boolean;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  settings: Settings;
  selectedDate: string;
}
