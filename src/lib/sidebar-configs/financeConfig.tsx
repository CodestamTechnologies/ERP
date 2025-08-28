import { 
  BarChart3, 
  DollarSign,
  Building2,
  FileText,
  Calculator,
  TrendingUp,
  Target,
  Shield,
  Users,
  Package,
  Settings,
  ArrowUpDown,
  FileSpreadsheet,
  BookOpen,
  Landmark,
  FileBarChart,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const financeServicesConfig: SecondarySidebarConfig = {
  title: 'Finance Management',
  icon: <DollarSign size={20} />,
  iconBgColor: 'bg-green-100',
  iconColor: 'text-green-600',
  stats: [
    {
      label: 'Total Revenue',
      value: '₹2.84Cr',
      icon: <TrendingUp size={16} />,
      color: 'text-green-400'
    },
    {
      label: 'Outstanding',
      value: '₹45.2L',
      icon: <AlertTriangle size={16} />,
      color: 'text-yellow-400'
    },
    {
      label: 'Cash Flow',
      value: '+₹12.8L',
      icon: <Activity size={16} />,
      color: 'text-blue-400'
    },
    {
      label: 'Profit Margin',
      value: '18.5%',
      icon: <PieChart size={16} />,
      color: 'text-purple-400'
    }
  ],
  sections: [
    {
      title: 'Dashboard & Overview',
      icon: <BarChart3 size={18} />,
      layout: 'list',
      options: [
        {
          id: 'finance-dashboard',
          name: 'Finance Dashboard',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Live',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/dashboard'
        },
        {
          id: 'cash-flow-overview',
          name: 'Cash Flow Overview',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/cash-flow'
        },
        {
          id: 'income-expenses',
          name: 'Income vs Expenses',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/income-expenses'
        },
        {
          id: 'outstanding-payments',
          name: 'Outstanding Invoices & Payments',
          icon: <span className="text-blue-600">•</span>,
          badge: '23',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/outstanding'
        },
        {
          id: 'profit-loss-snapshot',
          name: 'Profit/Loss Snapshot',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/profit-loss'
        }
      ]
    },
    {
      title: 'Accounts Management',
      icon: <BookOpen size={18} />,
      layout: 'list',
      options: [
        {
          id: 'chart-of-accounts',
          name: 'Chart of Accounts',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/chart-of-accounts'
        },
        {
          id: 'general-ledger',
          name: 'General Ledger',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/general-ledger'
        },
        {
          id: 'journal-entries',
          name: 'Journal Entries',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/journal-entries'
        },
        {
          id: 'trial-balance',
          name: 'Trial Balance',
          icon: <span className="text-green-600">•</span>,
          badge: null,
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/trial-balance'
        }
      ]
    },
    {
      title: 'Payables & Receivables',
      icon: <ArrowUpDown size={18} />,
      layout: 'list',
      options: [
        {
          id: 'accounts-payable',
          name: 'Accounts Payable',
          icon: <span className="text-red-600">•</span>,
          badge: '₹45.2L',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/finance/accounts-payable'
        },
        {
          id: 'vendor-bills',
          name: 'Vendor Bills & Due Payments',
          icon: <span className="text-red-600">•</span>,
          badge: '12',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/finance/vendor-bills'
        },
        {
          id: 'accounts-receivable',
          name: 'Accounts Receivable',
          icon: <span className="text-green-600">•</span>,
          badge: '₹67.8L',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/accounts-receivable'
        },
        {
          id: 'customer-invoices',
          name: 'Customer Invoices & Collections',
          icon: <span className="text-green-600">•</span>,
          badge: '28',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/finance/customer-invoices'
        },
        {
          id: 'credit-debit-notes',
          name: 'Credit/Debit Notes',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/credit-debit-notes'
        },
        {
          id: 'aging-reports',
          name: 'Aging Reports',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/finance/aging-reports'
        }
      ]
    },
    {
      title: 'Bank & Cash Management',
      icon: <Landmark size={18} />,
      layout: 'list',
      options: [
        {
          id: 'bank-accounts',
          name: 'Bank Accounts Integration',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Connected',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/bank-accounts'
        },
        {
          id: 'bank-reconciliation',
          name: 'Bank Reconciliation',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/bank-reconciliation'
        },
        {
          id: 'cashbook',
          name: 'Cashbook / Petty Cash',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/cashbook'
        },
        {
          id: 'fund-transfers',
          name: 'Fund Transfers',
          icon: <span className="text-blue-600">•</span>,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/finance/fund-transfers'
        }
      ]
    },
    {
      title: 'Invoicing & Billing',
      icon: <FileText size={18} />,
      layout: 'list',
      options: [
        {
          id: 'create-invoices',
          name: 'Create/Send Invoices & Bills',
          icon: <span className="text-indigo-600">•</span>,
          badge: 'Popular',
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/finance/invoices'
        },
        {
          id: 'recurring-invoices',
          name: 'Recurring Invoices',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/finance/recurring-invoices'
        },
        {
          id: 'payment-tracking',
          name: 'Payment Tracking',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/finance/payment-tracking'
        },
        {
          id: 'multi-currency',
          name: 'Multi-Currency & Tax Support',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/finance/multi-currency'
        }
      ]
    },
    {
      title: 'Budgeting & Forecasting',
      icon: <Target size={18} />,
      layout: 'list',
      options: [
        {
          id: 'budget-creation',
          name: 'Budget Creation',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/budget-creation'
        },
        {
          id: 'department-budgets',
          name: 'Department-wise Budgets',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/department-budgets'
        },
        {
          id: 'project-budgets',
          name: 'Project-wise Budgets',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/project-budgets'
        },
        {
          id: 'budget-analysis',
          name: 'Budget vs. Actual Analysis',
          icon: <span className="text-purple-600">•</span>,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/budget-analysis'
        },
        {
          id: 'financial-forecasting',
          name: 'Financial Forecasting',
          icon: <span className="text-purple-600">•</span>,
          badge: 'AI',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/finance/forecasting'
        }
      ]
    },
    {
      title: 'Taxation & Compliance',
      icon: <Shield size={18} />,
      layout: 'list',
      options: [
        {
          id: 'gst-vat-setup',
          name: 'GST/VAT Setup',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/finance/gst-setup'
        },
        {
          id: 'tds-withholding',
          name: 'TDS/Withholding Tax',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/finance/tds'
        },
        {
          id: 'tax-reports',
          name: 'Tax Reports & Filing Support',
          icon: <span className="text-orange-600">•</span>,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/finance/tax-reports'
        }
      ]
    },
    {
      title: 'Payroll & Expenses',
      icon: <Users size={18} />,
      layout: 'list',
      options: [
        {
          id: 'salary-disbursement',
          name: 'Salary Disbursement',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/finance/salary'
        },
        {
          id: 'expense-claims',
          name: 'Expense Claims & Approvals',
          icon: <span className="text-teal-600">•</span>,
          badge: '7',
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/finance/expense-claims'
        },
        {
          id: 'reimbursements',
          name: 'Reimbursements',
          icon: <span className="text-teal-600">•</span>,
          badge: null,
          color: 'text-teal-600',
          bgColor: 'hover:bg-teal-50',
          href: '/finance/reimbursements'
        }
      ]
    },
    {
      title: 'Fixed Assets Management',
      icon: <Package size={18} />,
      layout: 'list',
      options: [
        {
          id: 'asset-register',
          name: 'Asset Register',
          icon: <span className="text-gray-600">•</span>,
          badge: null,
          color: 'text-gray-600',
          bgColor: 'hover:bg-gray-50',
          href: '/finance/asset-register'
        },
        {
          id: 'depreciation-tracking',
          name: 'Depreciation Tracking',
          icon: <span className="text-gray-600">•</span>,
          badge: null,
          color: 'text-gray-600',
          bgColor: 'hover:bg-gray-50',
          href: '/finance/depreciation'
        },
        {
          id: 'asset-disposal',
          name: 'Asset Disposal/Transfer',
          icon: <span className="text-gray-600">•</span>,
          badge: null,
          color: 'text-gray-600',
          bgColor: 'hover:bg-gray-50',
          href: '/finance/asset-disposal'
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: <FileBarChart size={18} />,
      layout: 'list',
      options: [
        {
          id: 'balance-sheet',
          name: 'Balance Sheet',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/balance-sheet'
        },
        {
          id: 'profit-loss-statement',
          name: 'Profit & Loss Statement',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/profit-loss-statement'
        },
        {
          id: 'cash-flow-statement',
          name: 'Cash Flow Statement',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/cash-flow-statement'
        },
        {
          id: 'trial-balance-report',
          name: 'Trial Balance Report',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/trial-balance-report'
        },
        {
          id: 'custom-reports',
          name: 'Custom Financial Reports',
          icon: <span className="text-pink-600">•</span>,
          badge: 'New',
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/custom-reports'
        },
        {
          id: 'export-reports',
          name: 'Export to Excel/PDF',
          icon: <span className="text-pink-600">•</span>,
          badge: null,
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/finance/export'
        }
      ]
    },
    {
      title: 'Settings & Configurations',
      icon: <Settings size={18} />,
      layout: 'list',
      options: [
        {
          id: 'financial-year',
          name: 'Financial Year & Period Closing',
          icon: <span className="text-slate-600">•</span>,
          badge: null,
          color: 'text-slate-600',
          bgColor: 'hover:bg-slate-50',
          href: '/finance/financial-year'
        },
        {
          id: 'currency-rates',
          name: 'Currency & Exchange Rates',
          icon: <span className="text-slate-600">•</span>,
          badge: null,
          color: 'text-slate-600',
          bgColor: 'hover:bg-slate-50',
          href: '/finance/currency'
        },
        {
          id: 'tax-rules',
          name: 'Tax Rules Configuration',
          icon: <span className="text-slate-600">•</span>,
          badge: null,
          color: 'text-slate-600',
          bgColor: 'hover:bg-slate-50',
          href: '/finance/tax-rules'
        },
        {
          id: 'approval-workflows',
          name: 'Approval Workflows',
          icon: <span className="text-slate-600">•</span>,
          badge: null,
          color: 'text-slate-600',
          bgColor: 'hover:bg-slate-50',
          href: '/finance/workflows'
        },
        {
          id: 'role-access',
          name: 'Role-based Access Control',
          icon: <span className="text-slate-600">•</span>,
          badge: null,
          color: 'text-slate-600',
          bgColor: 'hover:bg-slate-50',
          href: '/finance/access-control'
        }
      ]
    }
  ],
  accountInfo: {
    name: 'Finance Department',
    status: 'All systems operational',
    statusColor: 'bg-green-500'
  }
};