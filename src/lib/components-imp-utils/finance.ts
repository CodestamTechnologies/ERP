import { cn } from '@/lib/utils';

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'completed' && 'bg-green-100 text-green-800',
    status === 'pending' && 'bg-yellow-100 text-yellow-800',
    status === 'failed' && 'bg-red-100 text-red-800',
    status === 'paid' && 'bg-green-100 text-green-800',
    status === 'sent' && 'bg-blue-100 text-blue-800',
    status === 'overdue' && 'bg-red-100 text-red-800',
    status === 'draft' && 'bg-gray-100 text-gray-800',
    status === 'on-track' && 'bg-green-100 text-green-800',
    status === 'over-budget' && 'bg-red-100 text-red-800',
    status === 'under-budget' && 'bg-blue-100 text-blue-800',
    status === 'active' && 'bg-green-100 text-green-800',
    status === 'inactive' && 'bg-gray-100 text-gray-800'
  );
};

export const getAccountTypeIcon = (type: string) => {
  const icons = {
    bank: '🏦',
    cash: '💵',
    credit: '💳',
    investment: '📈',
  };
  return icons[type as keyof typeof icons] || '🏦';
};

export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};

export const getChangeType = (current: number, previous: number): 'positive' | 'negative' => {
  return current >= previous ? 'positive' : 'negative';
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const generateMockData = () => {
  const accounts = [
    { id: 'acc1', name: 'Primary Business Account', type: 'bank', balance: 2450000, currency: 'INR', status: 'active', lastTransaction: '2024-01-15' },
    { id: 'acc2', name: 'Savings Account', type: 'bank', balance: 850000, currency: 'INR', status: 'active', lastTransaction: '2024-01-14' },
    { id: 'acc3', name: 'Petty Cash', type: 'cash', balance: 25000, currency: 'INR', status: 'active', lastTransaction: '2024-01-15' },
    { id: 'acc4', name: 'Business Credit Card', type: 'credit', balance: -125000, currency: 'INR', status: 'active', lastTransaction: '2024-01-15' },
    { id: 'acc5', name: 'Investment Portfolio', type: 'investment', balance: 1200000, currency: 'INR', status: 'active', lastTransaction: '2024-01-12' },
  ];

  const transactions = [
    { id: 'txn1', type: 'income', category: 'Sales Revenue', amount: 125000, description: 'Payment from TechCorp Solutions', date: '2024-01-15', status: 'completed', account: 'Primary Business Account', reference: 'INV-2024-001', tags: ['sales', 'b2b'] },
    { id: 'txn2', type: 'expense', category: 'Office Supplies', amount: 15000, description: 'Stationery and office equipment', date: '2024-01-15', status: 'completed', account: 'Primary Business Account', tags: ['office', 'supplies'] },
    { id: 'txn3', type: 'income', category: 'Consulting Revenue', amount: 75000, description: 'Consulting services for Q1', date: '2024-01-14', status: 'completed', account: 'Primary Business Account', reference: 'INV-2024-002', tags: ['consulting', 'services'] },
    { id: 'txn4', type: 'expense', category: 'Marketing', amount: 45000, description: 'Digital marketing campaign', date: '2024-01-14', status: 'pending', account: 'Business Credit Card', tags: ['marketing', 'digital'] },
    { id: 'txn5', type: 'expense', category: 'Utilities', amount: 8500, description: 'Electricity and internet bills', date: '2024-01-13', status: 'completed', account: 'Primary Business Account', tags: ['utilities', 'bills'] },
  ];

  const invoices = [
    { id: 'INV-2024-001', customer: 'TechCorp Solutions', amount: 125000, status: 'paid', dueDate: '2024-01-20', issueDate: '2024-01-05', items: 3 },
    { id: 'INV-2024-002', customer: 'Global Enterprises', amount: 250000, status: 'sent', dueDate: '2024-01-25', issueDate: '2024-01-10', items: 5 },
    { id: 'INV-2024-003', customer: 'Innovation Labs', amount: 85000, status: 'overdue', dueDate: '2024-01-12', issueDate: '2023-12-28', items: 2 },
    { id: 'INV-2024-004', customer: 'StartupXYZ', amount: 45000, status: 'draft', dueDate: '2024-01-30', issueDate: '2024-01-15', items: 1 },
  ];

  const budgets = [
    { id: 'bud1', category: 'Marketing', allocated: 200000, spent: 145000, period: 'monthly', status: 'on-track' },
    { id: 'bud2', category: 'Operations', allocated: 500000, spent: 520000, period: 'monthly', status: 'over-budget' },
    { id: 'bud3', category: 'R&D', allocated: 300000, spent: 180000, period: 'monthly', status: 'under-budget' },
    { id: 'bud4', category: 'HR & Payroll', allocated: 800000, spent: 785000, period: 'monthly', status: 'on-track' },
  ];

  return { accounts, transactions, invoices, budgets };
};

// Define interfaces for type safety
interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  status: string;
  lastTransaction: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  account: string;
  reference?: string;
  tags: string[];
}

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'sent' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
  items: number;
}

export const calculateFinanceStats = (accounts: Account[], transactions: Transaction[], invoices: Invoice[]) => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const pendingInvoiceAmount = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    overdueInvoices,
    pendingInvoiceAmount
  };
};