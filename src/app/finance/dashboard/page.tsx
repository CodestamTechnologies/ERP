'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useMemo } from 'react';
import { FinanceIcon } from '@/components/Icons';
import QuickActions from '@/components/common/QuickActions';
import RecentActivities from '@/components/RecentActivities';
import { useFinance } from '@/hooks/useFinance';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { 
  DollarSign, TrendingUp, TrendingDown, Calculator, AlertTriangle, Clock, Building2, Target,
  RefreshCw, Download, Plus, Search, Eye, Edit, Trash2
} from 'lucide-react';
import { 
  FINANCE_QUICK_ACTIONS, 
  FINANCE_TABS, 
  FINANCE_STATS_CONFIG, 
  ACCOUNT_TYPES, 
  REPORT_TYPES 
} from '@/lib/components-Data/finance/constants';
import { 
  formatIndianCurrency, 
  getStatusColor, 
  calculatePercentage,
  formatPercentage
} from '@/lib/components-imp-utils/finance';

// Import dialog components
import { AddAccountDialog } from '@/components/finance/dialogs/AddAccountDialog';
import { AddTransactionDialog } from '@/components/finance/dialogs/AddTransactionDialog';
import { CreateBudgetDialog } from '@/components/finance/dialogs/CreateBudgetDialog';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const FinanceDashboard = () => {
  const {
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
  } = useFinance();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  
  // Dialog states
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);

  // Chart data
  const cashFlowData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const income = Math.random() * 50000 + 20000;
      const expenses = Math.random() * 40000 + 15000;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income, expenses, netFlow: income - expenses
      });
    }
    return data;
  }, []);

  const expenseByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense' && t.status === 'completed')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Stats data
  const FINANCE_STATS = FINANCE_STATS_CONFIG.map(config => {
    const value = stats[config.key as keyof typeof stats] as number;
    const target = value * config.targetMultiplier;
    const progress = Math.min(100, config.targetMultiplier > 1 ? (value / target) * 100 : (target / value) * 100);
    
    return {
      ...config,
      value: formatIndianCurrency(value),
      change: formatPercentage(Math.random() * 20 - 5), // Mock change
      changeType: Math.random() > 0.5 ? 'positive' : 'negative',
      target: formatIndianCurrency(target),
      progress
    };
  });

  // Event handlers
  const handleAddAccount = async (accountData: any) => {
    try {
      await addAccount(accountData);
      alert('Account added successfully!');
    } catch (error) {
      alert('Error adding account. Please try again.');
    }
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      await addTransaction(transactionData);
      alert('Transaction added successfully!');
    } catch (error) {
      alert('Error adding transaction. Please try again.');
    }
  };

  const handleCreateBudget = async (budgetData: any) => {
    try {
      await addBudget(budgetData);
      alert('Budget created successfully!');
    } catch (error) {
      alert('Error creating budget. Please try again.');
    }
  };

  const handleSyncAccounts = async () => {
    try {
      await syncAccounts();
      alert('Accounts synced successfully!');
    } catch (error) {
      alert('Error syncing accounts. Please try again.');
    }
  };

  const handleExportReport = async (reportType: string = 'transactions') => {
    try {
      await exportReport(reportType);
      alert('Report exported successfully!');
    } catch (error) {
      alert('Error exporting report. Please try again.');
    }
  };

  const handleReconcileAccount = async (accountId: string) => {
    try {
      await reconcileAccount(accountId);
      alert('Account reconciled successfully!');
    } catch (error) {
      alert('Error reconciling account. Please try again.');
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(accountId);
        alert('Account deleted successfully!');
      } catch (error) {
        alert('Error deleting account. Please try again.');
      }
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transactionId);
        alert('Transaction deleted successfully!');
      } catch (error) {
        alert('Error deleting transaction. Please try again.');
      }
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
        alert('Budget deleted successfully!');
      } catch (error) {
        alert('Error deleting budget. Please try again.');
      }
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAccount = selectedAccount === 'all' || transaction.accountId === selectedAccount;
      
      return matchesSearch && matchesAccount;
    });
  }, [transactions, searchTerm, selectedAccount]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Outstanding Invoices', value: stats.overdueInvoices, icon: <AlertTriangle className="h-8 w-8 text-orange-600" />, color: 'text-orange-600' },
                { name: 'Pending Receivables', value: formatIndianCurrency(stats.pendingInvoiceAmount), icon: <Clock className="h-8 w-8 text-blue-600" />, color: 'text-blue-600' },
                { name: 'Active Accounts', value: accounts.filter(a => a.status === 'active').length, icon: <Building2 className="h-8 w-8 text-green-600" />, color: 'text-green-600' },
                { name: 'Budget Utilization', value: `${stats.budgetUtilization.toFixed(1)}%`, icon: <Target className="h-8 w-8 text-purple-600" />, color: 'text-purple-600' },
              ].map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.name}</p>
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      </div>
                      {metric.icon}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Trend</CardTitle>
                  <CardDescription>Daily income vs expenses over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                        <Tooltip formatter={(value, name) => [`₹${value}`, name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net Flow']} />
                        <Legend />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} name="Income" />
                        <Area type="monotone" dataKey="expenses" stackId="2" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} name="Expenses" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expense Distribution</CardTitle>
                  <CardDescription>Breakdown of expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseByCategory}
                          cx="50%" cy="50%" labelLine={false}
                          label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80} fill="#8884d8" dataKey="value"
                        >
                          {expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Balances */}
            <Card>
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>Current balances across all accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accounts.map(acc => ({ name: acc.name, balance: acc.balance }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Balance']} />
                      <Bar dataKey="balance" name="Balance">
                        {accounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#00C49F' : '#FF8042'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'accounts':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>Manage all your financial accounts</CardDescription>
                </div>
                <Button onClick={() => setIsAddAccountOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => (
                  <motion.div key={account.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="mr-2 text-lg">{ACCOUNT_TYPES[account.type as keyof typeof ACCOUNT_TYPES]?.icon}</span>
                            <span className="font-medium">{account.name}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(account.status)}>{account.status}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Balance:</span>
                            <span className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatIndianCurrency(account.balance)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Type:</span>
                            <span className="text-sm font-medium capitalize">{account.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Last Transaction:</span>
                            <span className="text-sm">{account.lastTransaction}</span>
                          </div>
                          {account.accountNumber && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Account:</span>
                              <span className="text-sm">{account.accountNumber}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReconcileAccount(account.id)} disabled={isProcessing}>
                            Reconcile
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteAccount(account.id)} disabled={isProcessing}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'transactions':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Track all financial transactions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-[200px]" />
                  </div>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddTransactionOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.reference && <div className="text-sm text-gray-500">Ref: {transaction.reference}</div>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{transaction.category}</Badge></TableCell>
                      <TableCell>
                        <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatIndianCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell><Badge variant="outline" className={getStatusColor(transaction.status)}>{transaction.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm"><Eye size={16} /></Button>
                          <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTransaction(transaction.id)} disabled={isProcessing}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'budgets':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Budget Management</CardTitle>
                  <CardDescription>Monitor and control spending across categories</CardDescription>
                </div>
                <Button onClick={() => setIsCreateBudgetOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => (
                  <motion.div key={budget.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{budget.category}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(budget.status)}>{budget.status}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteBudget(budget.id)} disabled={isProcessing}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Budget Utilization</span>
                              <span className="font-medium">{calculatePercentage(budget.spent, budget.allocated).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculatePercentage(budget.spent, budget.allocated)} className="w-full" />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Spent: {formatIndianCurrency(budget.spent)}</span>
                              <span>Allocated: {formatIndianCurrency(budget.allocated)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Remaining:</span>
                            <span className={`font-medium ${budget.allocated - budget.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatIndianCurrency(budget.allocated - budget.spent)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Period:</span>
                            <span className="font-medium capitalize">{budget.period}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye size={14} className="mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit size={14} className="mr-1" />
                            Edit Budget
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate comprehensive financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {REPORT_TYPES.map((report) => (
                  <Card key={report.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <span className={report.color}>{report.icon}</span>
                        <h4 className="font-medium ml-3">{report.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExportReport('transactions')} disabled={isProcessing}>
                          <Download size={14} className="mr-1" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FinanceIcon size={32} className="text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Feature in Progress</h3>
                <p className="text-sm text-gray-500">This tab is currently being developed and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FinanceIcon size={28} className="mr-3" />
            Finance Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Comprehensive financial management and analytics</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-green-600">All systems operational</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSyncAccounts} disabled={isProcessing}>
            <RefreshCw size={16} className="mr-2" />
            Sync Accounts
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('transactions')} disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <Plus size={16} className="mr-2" />
            Quick Entry
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FINANCE_STATS.map((stat) => (
          <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">{stat.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {stat.target}</span>
                    <span>{stat.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={stat.progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="border-b p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              {FINANCE_TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2 whitespace-nowrap">
                  {tab.icon}<span>{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <QuickActions
            title="Financial Operations"
            description="Frequently used financial operations for quick access"
            actions={FINANCE_QUICK_ACTIONS.map(action => ({
              ...action,
              onClick: () => {
                if (action.name === 'Create Invoice') {
                  window.location.href = '/finance/invoices';
                } else if (action.name === 'Add Transaction') {
                  setIsAddTransactionOpen(true);
                } else if (action.name === 'Bank Reconciliation') {
                  window.location.href = '/finance/bank-reconciliation';
                } else if (action.name === 'Generate Report') {
                  handleExportReport('transactions');
                } else if (action.name === 'Budget Planning') {
                  setIsCreateBudgetOpen(true);
                } else {
                  alert(`${action.name} functionality coming soon!`);
                }
              }
            }))}
            columns={{ sm: 2, md: 4, lg: 6, xl: 8 }}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivities
            activities={[
              { id: '1', type: 'payment', message: 'Payment received from TechCorp', time: '5 minutes ago', priority: 'high', icon: '💰' },
              { id: '2', type: 'expense', message: 'Office supplies expense recorded', time: '15 minutes ago', priority: 'medium', icon: '📝' },
              { id: '3', type: 'invoice', message: 'Invoice sent to Global Enterprises', time: '1 hour ago', priority: 'medium', icon: '📄' },
              { id: '4', type: 'budget', message: 'Marketing budget updated', time: '2 hours ago', priority: 'low', icon: '📊' },
            ]}
            loading={false}
            onActivityClick={() => {}}
            title="Recent Activities"
            description="Latest financial activities"
            emptyStateTitle="No activities yet"
            emptyStateDescription="Activities will appear here as they occur"
            maxHeight="max-h-96"
            showPriority={true}
          />
        </div>
      </div>

      {/* Dialogs */}
      <AddAccountDialog
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
        isProcessing={isProcessing}
      />

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onAddTransaction={handleAddTransaction}
        accounts={accounts}
        isProcessing={isProcessing}
      />

      <CreateBudgetDialog
        isOpen={isCreateBudgetOpen}
        onClose={() => setIsCreateBudgetOpen(false)}
        onCreateBudget={handleCreateBudget}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default FinanceDashboard;