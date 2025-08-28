import { IncomeItem, ExpenseItem, BudgetComparison } from '@/types/finance';

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 10000000) { // 1 Crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'confirmed': 'text-green-600 bg-green-50 border-green-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'projected': 'text-blue-600 bg-blue-50 border-blue-200',
    'paid': 'text-green-600 bg-green-50 border-green-200',
    'overdue': 'text-red-600 bg-red-50 border-red-200',
  };
  return statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'Sales Revenue': 'text-green-600',
    'Service Revenue': 'text-blue-600',
    'Investment Income': 'text-purple-600',
    'Operating Expenses': 'text-red-600',
    'Personnel Costs': 'text-orange-600',
    'Marketing Expenses': 'text-pink-600',
    'Technology Expenses': 'text-indigo-600',
  };
  return categoryColors[category] || 'text-gray-600';
};

export const getVarianceColor = (variance: number, type: 'income' | 'expense'): string => {
  if (type === 'income') {
    return variance >= 0 ? 'text-green-600' : 'text-red-600';
  } else {
    return variance <= 0 ? 'text-green-600' : 'text-red-600';
  }
};

export const getVarianceIcon = (variance: number, type: 'income' | 'expense'): string => {
  if (type === 'income') {
    return variance >= 0 ? '↗' : '↘';
  } else {
    return variance <= 0 ? '↗' : '↘';
  }
};

export const calculateGrowthPercentage = (current: number, previous: number): string => {
  if (previous === 0) return '+0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

export const getGrowthColor = (growthString: string): string => {
  const isPositive = growthString.startsWith('+') && !growthString.startsWith('+0');
  return isPositive ? 'text-green-600' : 'text-red-600';
};

export const calculateProfitMargin = (income: number, expenses: number): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

export const calculateExpenseRatio = (expenses: number, income: number): number => {
  if (income === 0) return 0;
  return (expenses / income) * 100;
};

export const getAlertSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  const severityColors = {
    'low': 'text-blue-600 bg-blue-50 border-blue-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'high': 'text-red-600 bg-red-50 border-red-200',
  };
  return severityColors[severity];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRecurringFrequencyText = (frequency?: string): string => {
  const frequencyMap: Record<string, string> = {
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'yearly': 'Yearly'
  };
  return frequency ? frequencyMap[frequency] || frequency : 'One-time';
};

export const calculateBudgetHealth = (budgetComparisons: BudgetComparison[]): {
  overBudgetCount: number;
  underBudgetCount: number;
  onTrackCount: number;
  totalVariance: number;
} => {
  let overBudgetCount = 0;
  let underBudgetCount = 0;
  let onTrackCount = 0;
  let totalVariance = 0;

  budgetComparisons.forEach(comparison => {
    totalVariance += Math.abs(comparison.variance);
    
    if (Math.abs(comparison.variancePercentage) <= 5) {
      onTrackCount++;
    } else if (comparison.type === 'expense' && comparison.variance > 0) {
      overBudgetCount++;
    } else if (comparison.type === 'income' && comparison.variance < 0) {
      underBudgetCount++;
    } else {
      onTrackCount++;
    }
  });

  return {
    overBudgetCount,
    underBudgetCount,
    onTrackCount,
    totalVariance
  };
};

export const exportToCSV = (data: (IncomeItem | ExpenseItem)[], filename: string): void => {
  const headers = [
    'ID', 'Type', 'Category', 'Subcategory', 'Description', 'Amount', 'Date', 
    'Source/Vendor', 'Status', 'Payment Method', 'Reference', 'Tags'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      'amount' in item ? 'Income' : 'Expense',
      item.category,
      item.subcategory,
      `"${item.description}"`,
      item.amount,
      item.date,
      'source' in item ? item.source : (item as ExpenseItem).vendor,
      item.status,
      item.paymentMethod,
      item.reference,
      `"${item.tags.join(', ')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};