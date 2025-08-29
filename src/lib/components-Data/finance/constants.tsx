import {
  FinanceIcon,
  ChartIcon,
  PaymentIcon,
  WarningIcon,
  OrderIcon,
  UserIcon,
  SettingsIcon,
  DashboardIcon,
  InvoiceIcon
} from '@/components/Icons';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  Building2,
  Target,
  Shield,
  Package,
  ArrowUpDown,
  Landmark,
  Receipt,
  CheckCircle,
  Plus,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

export const FINANCE_QUICK_ACTIONS = [
  { name: 'Create Invoice', icon: <FileText size={20} className="text-blue-600" />, color: 'blue', description: 'Generate new customer invoice' },
  { name: 'Add Transaction', icon: <Plus size={20} className="text-green-600" />, color: 'green', description: 'Record income or expense' },
  { name: 'Bank Reconciliation', icon: <CheckCircle size={20} className="text-purple-600" />, color: 'purple', description: 'Match bank statements' },
  { name: 'Generate Report', icon: <BarChart3 size={20} className="text-orange-600" />, color: 'orange', description: 'Create financial reports' },
  { name: 'Budget Planning', icon: <Target size={20} className="text-red-600" />, color: 'red', description: 'Set spending limits' },
  { name: 'Tax Filing', icon: <Shield size={20} className="text-indigo-600" />, color: 'indigo', description: 'Manage tax compliance' },
  { name: 'Expense Claims', icon: <Receipt size={20} className="text-teal-600" />, color: 'teal', description: 'Process employee expenses' },
  { name: 'Asset Management', icon: <Package size={20} className="text-pink-600" />, color: 'pink', description: 'Track fixed assets' },
];

export const FINANCE_TABS = [
  { id: 'overview', name: 'Overview', icon: <BarChart3 size={16} className="text-blue-600" /> },
  { id: 'accounts', name: 'Accounts', icon: <Building2 size={16} className="text-green-600" /> },
  { id: 'transactions', name: 'Transactions', icon: <ArrowUpDown size={16} className="text-purple-600" /> },
  { id: 'invoices', name: 'Invoices', icon: <FileText size={16} className="text-orange-600" /> },
  { id: 'budgets', name: 'Budgets', icon: <Target size={16} className="text-red-600" /> },
  { id: 'reports', name: 'Reports', icon: <PieChartIcon size={16} className="text-indigo-600" /> },
];

export const FINANCE_STATS_CONFIG = [
  { 
    key: 'totalBalance',
    name: 'Total Balance', 
    icon: <DollarSign size={24} className="text-blue-600" />,
    targetMultiplier: 1.1
  },
  { 
    key: 'monthlyRevenue',
    name: 'Monthly Revenue', 
    icon: <TrendingUp size={24} className="text-green-600" />,
    targetMultiplier: 1.15
  },
  { 
    key: 'monthlyExpenses',
    name: 'Monthly Expenses', 
    icon: <TrendingDown size={24} className="text-red-600" />,
    targetMultiplier: 0.9
  },
  { 
    key: 'netProfit',
    name: 'Net Profit', 
    icon: <Calculator size={24} className="text-purple-600" />,
    targetMultiplier: 1.2
  },
];

export const ACCOUNT_TYPES = {
  bank: { icon: <Building2 size={16} className="text-blue-600" />, color: 'text-blue-600' },
  cash: { icon: <DollarSign size={16} className="text-green-600" />, color: 'text-green-600' },
  credit: { icon: <PaymentIcon size={16} className="text-red-600" />, color: 'text-red-600' },
  investment: { icon: <TrendingUp size={16} className="text-purple-600" />, color: 'text-purple-600' },
};

export const REPORT_TYPES = [
  { 
    name: 'Profit & Loss Statement', 
    description: 'Income and expenses summary', 
    icon: <BarChart3 size={24} className="text-blue-600" />,
    color: 'text-blue-600',
    href: '/finance/profit-loss'
  },
  { 
    name: 'Balance Sheet', 
    description: 'Assets, liabilities, and equity', 
    icon: <PieChartIcon size={24} className="text-green-600" />,
    color: 'text-green-600',
    href: '/finance/balance-sheet'
  },
  { 
    name: 'Cash Flow Statement', 
    description: 'Cash inflows and outflows', 
    icon: <TrendingUp size={24} className="text-purple-600" />,
    color: 'text-purple-600',
    href: '/finance/cash-flow'
  },
  { 
    name: 'Budget vs Actual', 
    description: 'Budget performance analysis', 
    icon: <Target size={24} className="text-orange-600" />,
    color: 'text-orange-600',
    href: '/finance/budget-analysis'
  },
  { 
    name: 'Accounts Receivable', 
    description: 'Outstanding customer payments', 
    icon: <UserIcon size={24} className="text-red-600" />,
    color: 'text-red-600',
    href: '/finance/accounts-receivable'
  },
  { 
    name: 'Accounts Payable', 
    description: 'Outstanding vendor payments', 
    icon: <Building2 size={24} className="text-indigo-600" />,
    color: 'text-indigo-600',
    href: '/finance/vendor-bills'
  },
];