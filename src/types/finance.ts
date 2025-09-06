export interface IncomeItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  date: string;
  source: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  tags: string[];
  status: 'confirmed' | 'pending' | 'projected';
  paymentMethod: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  tags: string[];
  status: 'paid' | 'pending' | 'overdue' | 'projected';
  paymentMethod: string;
  reference: string;
  approvedBy?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeExpenseCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  subcategories: string[];
  budget?: number;
  description?: string;
}

export interface IncomeExpenseStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeGrowth: string;
  expenseGrowth: string;
  netIncomeGrowth: string;
  profitMargin: number;
  expenseRatio: number;
  topIncomeCategory: string;
  topExpenseCategory: string;
}

export interface IncomeExpenseTrend {
  date: string;
  income: number;
  expenses: number;
  netIncome: number;
}

export interface BudgetComparison {
  category: string;
  type: 'income' | 'expense';
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
}

export interface IncomeExpenseFilters {
  dateRange: string;
  categories: string[];
  status: string[];
  amountRange: {
    min: number;
    max: number;
  };
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface IncomeExpenseAlert {
  id: string;
  type: 'budget_exceeded' | 'unusual_expense' | 'income_drop' | 'payment_overdue';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  amount?: number;
  date: string;
  actionRequired: boolean;
  actionUrl?: string;
}