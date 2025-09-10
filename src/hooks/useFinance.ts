'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Types for Finance System
export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit' | 'investment';
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  lastTransaction: string;
  accountNumber?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  account: string;
  accountId: string;
  reference?: string;
  tags: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  status: 'on-track' | 'over-budget' | 'under-budget';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  items: number;
  paidAmount: number;
  balanceAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceStats {
  totalBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  profitMargin: number;
  overdueInvoices: number;
  pendingInvoiceAmount: number;
  totalIncome: number;
  totalExpenses: number;
  accountsCount: number;
  transactionsCount: number;
  budgetUtilization: number;
}

// Mock Data
const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    name: 'Primary Business Account',
    type: 'bank',
    balance: 2450000,
    currency: 'INR',
    status: 'active',
    lastTransaction: '2024-01-15',
    accountNumber: '****1234',
    bankName: 'HDFC Bank',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'acc-002',
    name: 'Savings Account',
    type: 'bank',
    balance: 850000,
    currency: 'INR',
    status: 'active',
    lastTransaction: '2024-01-14',
    accountNumber: '****5678',
    bankName: 'ICICI Bank',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: 'acc-003',
    name: 'Petty Cash',
    type: 'cash',
    balance: 25000,
    currency: 'INR',
    status: 'active',
    lastTransaction: '2024-01-15',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'acc-004',
    name: 'Business Credit Card',
    type: 'credit',
    balance: -125000,
    currency: 'INR',
    status: 'active',
    lastTransaction: '2024-01-15',
    accountNumber: '****9012',
    bankName: 'SBI Card',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'acc-005',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: 1200000,
    currency: 'INR',
    status: 'active',
    lastTransaction: '2024-01-12',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    type: 'income',
    category: 'Sales Revenue',
    amount: 125000,
    description: 'Payment from TechCorp Solutions',
    date: '2024-01-15',
    status: 'completed',
    account: 'Primary Business Account',
    accountId: 'acc-001',
    reference: 'INV-2024-001',
    tags: ['sales', 'b2b'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'txn-002',
    type: 'expense',
    category: 'Office Supplies',
    amount: 15000,
    description: 'Stationery and office equipment',
    date: '2024-01-15',
    status: 'completed',
    account: 'Primary Business Account',
    accountId: 'acc-001',
    tags: ['office', 'supplies'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'txn-003',
    type: 'income',
    category: 'Consulting Revenue',
    amount: 75000,
    description: 'Consulting services for Q1',
    date: '2024-01-14',
    status: 'completed',
    account: 'Primary Business Account',
    accountId: 'acc-001',
    reference: 'INV-2024-002',
    tags: ['consulting', 'services'],
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-14T14:00:00Z'
  },
  {
    id: 'txn-004',
    type: 'expense',
    category: 'Marketing',
    amount: 45000,
    description: 'Digital marketing campaign',
    date: '2024-01-14',
    status: 'pending',
    account: 'Business Credit Card',
    accountId: 'acc-004',
    tags: ['marketing', 'digital'],
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z'
  },
  {
    id: 'txn-005',
    type: 'expense',
    category: 'Utilities',
    amount: 8500,
    description: 'Electricity and internet bills',
    date: '2024-01-13',
    status: 'completed',
    account: 'Primary Business Account',
    accountId: 'acc-001',
    tags: ['utilities', 'bills'],
    createdAt: '2024-01-13T16:00:00Z',
    updatedAt: '2024-01-13T16:00:00Z'
  }
];

const MOCK_BUDGETS: Budget[] = [
  {
    id: 'bud-001',
    category: 'Marketing',
    allocated: 200000,
    spent: 145000,
    period: 'monthly',
    status: 'on-track',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'bud-002',
    category: 'Operations',
    allocated: 500000,
    spent: 520000,
    period: 'monthly',
    status: 'over-budget',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'bud-003',
    category: 'R&D',
    allocated: 300000,
    spent: 180000,
    period: 'monthly',
    status: 'under-budget',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'bud-004',
    category: 'HR & Payroll',
    allocated: 800000,
    spent: 785000,
    period: 'monthly',
    status: 'on-track',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

const MOCK_INVOICES: FinanceInvoice[] = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'INV-2024-001',
    customer: 'TechCorp Solutions',
    customerId: 'cust-001',
    amount: 125000,
    status: 'paid',
    dueDate: '2024-01-20',
    issueDate: '2024-01-05',
    items: 3,
    paidAmount: 125000,
    balanceAmount: 0,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'INV-2024-002',
    customer: 'Global Enterprises',
    customerId: 'cust-002',
    amount: 250000,
    status: 'sent',
    dueDate: '2024-01-25',
    issueDate: '2024-01-10',
    items: 5,
    paidAmount: 0,
    balanceAmount: 250000,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'INV-2024-003',
    invoiceNumber: 'INV-2024-003',
    customer: 'Innovation Labs',
    customerId: 'cust-003',
    amount: 85000,
    status: 'overdue',
    dueDate: '2024-01-12',
    issueDate: '2023-12-28',
    items: 2,
    paidAmount: 0,
    balanceAmount: 85000,
    createdAt: '2023-12-28T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'INV-2024-004',
    invoiceNumber: 'INV-2024-004',
    customer: 'StartupXYZ',
    customerId: 'cust-004',
    amount: 45000,
    status: 'draft',
    dueDate: '2024-01-30',
    issueDate: '2024-01-15',
    items: 1,
    paidAmount: 0,
    balanceAmount: 45000,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export const useFinance = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(MOCK_ACCOUNTS);
      setTransactions(MOCK_TRANSACTIONS);
      setBudgets(MOCK_BUDGETS);
      setInvoices(MOCK_INVOICES);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate finance statistics
  const stats = useMemo((): FinanceStats => {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalIncome = completedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = completedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
    const pendingInvoiceAmount = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.balanceAmount, 0);
    const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetUtilization = totalBudgetAllocated > 0 ? (totalBudgetSpent / totalBudgetAllocated) * 100 : 0;

    // Calculate monthly figures (mock calculation)
    const currentMonth = new Date().getMonth();
    const monthlyTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).getMonth();
      return transactionMonth === currentMonth && t.status === 'completed';
    });
    const monthlyRevenue = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      monthlyRevenue,
      monthlyExpenses,
      netProfit,
      profitMargin,
      overdueInvoices,
      pendingInvoiceAmount,
      totalIncome,
      totalExpenses,
      accountsCount: accounts.length,
      transactionsCount: transactions.length,
      budgetUtilization
    };
  }, [accounts, transactions, budgets, invoices]);

  // Account management functions
  const addAccount = useCallback(async (accountData: Partial<Account>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        name: accountData.name || '',
        type: accountData.type || 'bank',
        balance: accountData.balance || 0,
        currency: accountData.currency || 'INR',
        status: accountData.status || 'active',
        lastTransaction: new Date().toISOString().split('T')[0],
        accountNumber: accountData.accountNumber,
        bankName: accountData.bankName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAccounts(prev => [newAccount, ...prev]);
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateAccount = useCallback(async (accountId: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, ...updates, updatedAt: new Date().toISOString() } : account
    ));
  }, []);

  const deleteAccount = useCallback(async (accountId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Transaction management functions
  const addTransaction = useCallback(async (transactionData: Partial<Transaction>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: transactionData.type || 'expense',
        category: transactionData.category || '',
        amount: transactionData.amount || 0,
        description: transactionData.description || '',
        date: transactionData.date || new Date().toISOString().split('T')[0],
        status: transactionData.status || 'completed',
        account: transactionData.account || '',
        accountId: transactionData.accountId || '',
        reference: transactionData.reference,
        tags: transactionData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update account balance
      if (newTransaction.status === 'completed') {
        setAccounts(prev => prev.map(account => {
          if (account.id === newTransaction.accountId) {
            const balanceChange = newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount;
            return {
              ...account,
              balance: account.balance + balanceChange,
              lastTransaction: newTransaction.date,
              updatedAt: new Date().toISOString()
            };
          }
          return account;
        }));
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateTransaction = useCallback(async (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === transactionId ? { ...transaction, ...updates, updatedAt: new Date().toISOString() } : transaction
    ));
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Budget management functions
  const addBudget = useCallback(async (budgetData: Partial<Budget>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBudget: Budget = {
        id: `bud-${Date.now()}`,
        category: budgetData.category || '',
        allocated: budgetData.allocated || 0,
        spent: budgetData.spent || 0,
        period: budgetData.period || 'monthly',
        status: budgetData.status || 'on-track',
        startDate: budgetData.startDate || new Date().toISOString().split('T')[0],
        endDate: budgetData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBudgets(prev => [newBudget, ...prev]);
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateBudget = useCallback(async (budgetId: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId ? { ...budget, ...updates, updatedAt: new Date().toISOString() } : budget
    ));
  }, []);

  const deleteBudget = useCallback(async (budgetId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Utility functions
  const syncAccounts = useCallback(async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock sync - in real app, this would sync with bank APIs
      console.log('Accounts synced successfully');
    } catch (error) {
      console.error('Error syncing accounts:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportReport = useCallback(async (reportType: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let csvContent = '';
      let filename = '';
      
      switch (reportType) {
        case 'transactions':
          csvContent = [
            'Date,Type,Category,Description,Amount,Status,Account',
            ...transactions.map(t => [
              t.date,
              t.type,
              t.category,
              `"${t.description}"`,
              t.amount,
              t.status,
              `"${t.account}"`
            ].join(','))
          ].join('\n');
          filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'accounts':
          csvContent = [
            'Name,Type,Balance,Status,Last Transaction',
            ...accounts.map(a => [
              `"${a.name}"`,
              a.type,
              a.balance,
              a.status,
              a.lastTransaction
            ].join(','))
          ].join('\n');
          filename = `accounts_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'budgets':
          csvContent = [
            'Category,Allocated,Spent,Status,Period',
            ...budgets.map(b => [
              b.category,
              b.allocated,
              b.spent,
              b.status,
              b.period
            ].join(','))
          ].join('\n');
          filename = `budgets_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [transactions, accounts, budgets]);

  const reconcileAccount = useCallback(async (accountId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock reconciliation
      console.log(`Account ${accountId} reconciled successfully`);
    } catch (error) {
      console.error('Error reconciling account:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    accounts,
    transactions,
    budgets,
    invoices,
    stats,
    loading,
    isProcessing,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    syncAccounts,
    exportReport,
    reconcileAccount
  };
};