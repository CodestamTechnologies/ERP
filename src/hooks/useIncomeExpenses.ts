'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  IncomeItem, 
  ExpenseItem, 
  IncomeExpenseStats, 
  IncomeExpenseTrend, 
  BudgetComparison,
  IncomeExpenseFilters,
  IncomeExpenseAlert
} from '@/types/finance';

// Mock data - In a real app, this would come from an API
const MOCK_INCOME_DATA: IncomeItem[] = [
  {
    id: 'INC-001',
    category: 'Sales Revenue',
    subcategory: 'Product Sales',
    description: 'Q4 Product Sales Revenue',
    amount: 2500000,
    date: '2024-01-15',
    source: 'Online Store',
    recurring: true,
    frequency: 'monthly',
    tags: ['recurring', 'primary'],
    status: 'confirmed',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-2024-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'INC-002',
    category: 'Service Revenue',
    subcategory: 'Consulting',
    description: 'Business Consulting Services',
    amount: 850000,
    date: '2024-01-20',
    source: 'TechCorp Solutions',
    recurring: false,
    tags: ['consulting', 'one-time'],
    status: 'confirmed',
    paymentMethod: 'Check',
    reference: 'REF-2024-002',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'INC-003',
    category: 'Investment Income',
    subcategory: 'Interest',
    description: 'Bank Interest Income',
    amount: 45000,
    date: '2024-01-25',
    source: 'HDFC Bank',
    recurring: true,
    frequency: 'monthly',
    tags: ['interest', 'passive'],
    status: 'confirmed',
    paymentMethod: 'Bank Credit',
    reference: 'REF-2024-003',
    createdAt: '2024-01-25T09:15:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  },
  {
    id: 'INC-004',
    category: 'Sales Revenue',
    subcategory: 'Subscription',
    description: 'Monthly Subscription Revenue',
    amount: 320000,
    date: '2024-01-30',
    source: 'SaaS Platform',
    recurring: true,
    frequency: 'monthly',
    tags: ['subscription', 'recurring'],
    status: 'confirmed',
    paymentMethod: 'Online Payment',
    reference: 'REF-2024-004',
    createdAt: '2024-01-30T16:45:00Z',
    updatedAt: '2024-01-30T16:45:00Z'
  }
];

const MOCK_EXPENSE_DATA: ExpenseItem[] = [
  {
    id: 'EXP-001',
    category: 'Operating Expenses',
    subcategory: 'Office Rent',
    description: 'Monthly Office Rent',
    amount: 150000,
    date: '2024-01-01',
    vendor: 'Property Management Co.',
    recurring: true,
    frequency: 'monthly',
    tags: ['rent', 'fixed'],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-EXP-001',
    approvedBy: 'Finance Manager',
    department: 'Administration',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'EXP-002',
    category: 'Personnel Costs',
    subcategory: 'Salaries',
    description: 'Monthly Salary Disbursement',
    amount: 1200000,
    date: '2024-01-05',
    vendor: 'Payroll Department',
    recurring: true,
    frequency: 'monthly',
    tags: ['salary', 'personnel'],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-EXP-002',
    approvedBy: 'HR Manager',
    department: 'Human Resources',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: 'EXP-003',
    category: 'Marketing Expenses',
    subcategory: 'Digital Marketing',
    description: 'Google Ads Campaign',
    amount: 75000,
    date: '2024-01-10',
    vendor: 'Google Inc.',
    recurring: false,
    tags: ['marketing', 'advertising'],
    status: 'paid',
    paymentMethod: 'Credit Card',
    reference: 'REF-EXP-003',
    approvedBy: 'Marketing Manager',
    department: 'Marketing',
    createdAt: '2024-01-10T12:30:00Z',
    updatedAt: '2024-01-10T12:30:00Z'
  },
  {
    id: 'EXP-004',
    category: 'Technology Expenses',
    subcategory: 'Software Licenses',
    description: 'Annual Software Licenses',
    amount: 180000,
    date: '2024-01-15',
    vendor: 'Microsoft Corporation',
    recurring: true,
    frequency: 'yearly',
    tags: ['software', 'licenses'],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-EXP-004',
    approvedBy: 'IT Manager',
    department: 'Information Technology',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  },
  {
    id: 'EXP-005',
    category: 'Operating Expenses',
    subcategory: 'Utilities',
    description: 'Electricity Bill',
    amount: 25000,
    date: '2024-01-20',
    vendor: 'State Electricity Board',
    recurring: true,
    frequency: 'monthly',
    tags: ['utilities', 'electricity'],
    status: 'pending',
    paymentMethod: 'Online Payment',
    reference: 'REF-EXP-005',
    approvedBy: 'Finance Manager',
    department: 'Administration',
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  }
];

export const useIncomeExpenses = () => {
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IncomeExpenseFilters>({
    dateRange: '30days',
    categories: [],
    status: [],
    amountRange: { min: 0, max: 10000000 },
    searchTerm: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isExporting, setIsExporting] = useState(false);

  // Simulate API call
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIncomeData(MOCK_INCOME_DATA);
      setExpenseData(MOCK_EXPENSE_DATA);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate statistics
  const stats = useMemo((): IncomeExpenseStats => {
    const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    // Mock growth calculations (in real app, compare with previous period)
    const incomeGrowth = '+12.5%';
    const expenseGrowth = '+8.3%';
    const netIncomeGrowth = '+18.7%';
    
    const profitMargin = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    
    // Find top categories
    const incomeByCategory = incomeData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const expenseByCategory = expenseData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topIncomeCategory = Object.entries(incomeByCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    
    const topExpenseCategory = Object.entries(expenseByCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      incomeGrowth,
      expenseGrowth,
      netIncomeGrowth,
      profitMargin,
      expenseRatio,
      topIncomeCategory,
      topExpenseCategory
    };
  }, [incomeData, expenseData]);

  // Generate trend data
  const trendData = useMemo((): IncomeExpenseTrend[] => {
    const days = filters.dateRange === '7days' ? 7 : 
                 filters.dateRange === '30days' ? 30 : 
                 filters.dateRange === '90days' ? 90 : 365;
    
    const data: IncomeExpenseTrend[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayIncome = incomeData
        .filter(item => item.date === dateString)
        .reduce((sum, item) => sum + item.amount, 0);
      
      const dayExpenses = expenseData
        .filter(item => item.date === dateString)
        .reduce((sum, item) => sum + item.amount, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: dayIncome,
        expenses: dayExpenses,
        netIncome: dayIncome - dayExpenses
      });
    }
    
    return data;
  }, [incomeData, expenseData, filters.dateRange]);

  // Generate budget comparison data
  const budgetComparison = useMemo((): BudgetComparison[] => {
    // Mock budget data - in real app, this would come from budget settings
    const mockBudgets = [
      { category: 'Sales Revenue', type: 'income' as const, budgeted: 3000000 },
      { category: 'Service Revenue', type: 'income' as const, budgeted: 800000 },
      { category: 'Operating Expenses', type: 'expense' as const, budgeted: 200000 },
      { category: 'Personnel Costs', type: 'expense' as const, budgeted: 1300000 },
      { category: 'Marketing Expenses', type: 'expense' as const, budgeted: 100000 },
      { category: 'Technology Expenses', type: 'expense' as const, budgeted: 150000 }
    ];

    return mockBudgets.map(budget => {
      const actualData = budget.type === 'income' ? incomeData : expenseData;
      const actual = actualData
        .filter(item => item.category === budget.category)
        .reduce((sum, item) => sum + item.amount, 0);
      
      const variance = actual - budget.budgeted;
      const variancePercentage = budget.budgeted > 0 ? (variance / budget.budgeted) * 100 : 0;

      return {
        category: budget.category,
        type: budget.type,
        budgeted: budget.budgeted,
        actual,
        variance,
        variancePercentage
      };
    });
  }, [incomeData, expenseData]);

  // Generate alerts
  const alerts = useMemo((): IncomeExpenseAlert[] => {
    const alertList: IncomeExpenseAlert[] = [];
    
    // Budget exceeded alerts
    budgetComparison.forEach(comparison => {
      if (comparison.type === 'expense' && comparison.variance > 0) {
        alertList.push({
          id: `budget-${comparison.category}`,
          type: 'budget_exceeded',
          title: 'Budget Exceeded',
          message: `${comparison.category} has exceeded budget by ₹${comparison.variance.toLocaleString()}`,
          severity: comparison.variancePercentage > 20 ? 'high' : 'medium',
          category: comparison.category,
          amount: comparison.variance,
          date: new Date().toISOString().split('T')[0],
          actionRequired: true,
          actionUrl: '/finance/budget-analysis'
        });
      }
    });

    // Overdue payments
    expenseData.forEach(expense => {
      if (expense.status === 'overdue') {
        alertList.push({
          id: `overdue-${expense.id}`,
          type: 'payment_overdue',
          title: 'Payment Overdue',
          message: `Payment to ${expense.vendor} is overdue (₹${expense.amount.toLocaleString()})`,
          severity: 'high',
          category: expense.category,
          amount: expense.amount,
          date: expense.date,
          actionRequired: true,
          actionUrl: `/finance/expenses/${expense.id}`
        });
      }
    });

    return alertList;
  }, [budgetComparison, expenseData]);

  // Filter and sort data
  const filteredIncomeData = useMemo(() => {
    return incomeData.filter(item => {
      const matchesSearch = filters.searchTerm === '' || 
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(item.category);
      
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(item.status);
      
      const matchesAmount = item.amount >= filters.amountRange.min && 
        item.amount <= filters.amountRange.max;

      return matchesSearch && matchesCategory && matchesStatus && matchesAmount;
    }).sort((a, b) => {
      const aValue = filters.sortBy === 'amount' ? a.amount : 
                    filters.sortBy === 'date' ? new Date(a.date).getTime() : 
                    a.description.localeCompare(b.description);
      const bValue = filters.sortBy === 'amount' ? b.amount : 
                    filters.sortBy === 'date' ? new Date(b.date).getTime() : 
                    b.description.localeCompare(a.description);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [incomeData, filters]);

  const filteredExpenseData = useMemo(() => {
    return expenseData.filter(item => {
      const matchesSearch = filters.searchTerm === '' || 
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(item.category);
      
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(item.status);
      
      const matchesAmount = item.amount >= filters.amountRange.min && 
        item.amount <= filters.amountRange.max;

      return matchesSearch && matchesCategory && matchesStatus && matchesAmount;
    }).sort((a, b) => {
      const aValue = filters.sortBy === 'amount' ? a.amount : 
                    filters.sortBy === 'date' ? new Date(a.date).getTime() : 
                    a.description.localeCompare(b.description);
      const bValue = filters.sortBy === 'amount' ? b.amount : 
                    filters.sortBy === 'date' ? new Date(b.date).getTime() : 
                    b.description.localeCompare(a.description);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [expenseData, filters]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<IncomeExpenseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  }, []);

  const addIncomeItem = useCallback(async (item: Omit<IncomeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: IncomeItem = {
      ...item,
      id: `INC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIncomeData(prev => [...prev, newItem]);
  }, []);

  const addExpenseItem = useCallback(async (item: Omit<ExpenseItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ExpenseItem = {
      ...item,
      id: `EXP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExpenseData(prev => [...prev, newItem]);
  }, []);

  const updateIncomeItem = useCallback(async (id: string, updates: Partial<IncomeItem>) => {
    setIncomeData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  }, []);

  const updateExpenseItem = useCallback(async (id: string, updates: Partial<ExpenseItem>) => {
    setExpenseData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
  }, []);

  const deleteIncomeItem = useCallback(async (id: string) => {
    setIncomeData(prev => prev.filter(item => item.id !== id));
  }, []);

  const deleteExpenseItem = useCallback(async (id: string) => {
    setExpenseData(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    // Data
    incomeData: filteredIncomeData,
    expenseData: filteredExpenseData,
    stats,
    trendData,
    budgetComparison,
    alerts,
    
    // State
    loading,
    filters,
    isExporting,
    
    // Actions
    updateFilters,
    handleExport,
    addIncomeItem,
    addExpenseItem,
    updateIncomeItem,
    updateExpenseItem,
    deleteIncomeItem,
    deleteExpenseItem
  };
};