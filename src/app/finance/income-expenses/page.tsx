'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useIncomeExpenses } from '@/hooks/useIncomeExpenses';
import { 
  formatIndianCurrency, 
  formatCompactCurrency, 
  getStatusColor, 
  getCategoryColor,
  getVarianceColor,
  getVarianceIcon,
  getGrowthColor,
  getAlertSeverityColor,
  formatDate,
  getRecurringFrequencyText,
  calculateBudgetHealth
} from '@/lib/utils/financeUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Plus,
  Download,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  Building,
  User,
  CreditCard,
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { IncomeItem, ExpenseItem } from '@/types/finance';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const IncomeExpensesPage = () => {
  const {
    incomeData,
    expenseData,
    stats,
    trendData,
    budgetComparison,
    alerts,
    loading,
    filters,
    isExporting,
    updateFilters,
    handleExport,
    addIncomeItem,
    addExpenseItem,
    updateIncomeItem,
    updateExpenseItem,
    deleteIncomeItem,
    deleteExpenseItem
  } = useIncomeExpenses();

  const [activeTab, setActiveTab] = useState('overview');
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IncomeItem | ExpenseItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeItem | ExpenseItem | null>(null);

  const budgetHealth = calculateBudgetHealth(budgetComparison);

  // Chart data preparations
  const categoryData = [
    ...Object.entries(
      incomeData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value, type: 'income' })),
    ...Object.entries(
      expenseData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value, type: 'expense' }))
  ];

  const STATS_CARDS = [
    {
      title: 'Total Income',
      value: formatCompactCurrency(stats.totalIncome),
      change: stats.incomeGrowth,
      icon: <TrendingUp size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: formatCompactCurrency(stats.totalIncome * 1.1),
      progress: Math.min(100, (stats.totalIncome / (stats.totalIncome * 1.1)) * 100)
    },
    {
      title: 'Total Expenses',
      value: formatCompactCurrency(stats.totalExpenses),
      change: stats.expenseGrowth,
      icon: <TrendingDown size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      target: formatCompactCurrency(stats.totalExpenses * 0.9),
      progress: Math.min(100, ((stats.totalExpenses * 0.9) / stats.totalExpenses) * 100)
    },
    {
      title: 'Net Income',
      value: formatCompactCurrency(stats.netIncome),
      change: stats.netIncomeGrowth,
      icon: <DollarSign size={24} />,
      color: stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.netIncome >= 0 ? 'bg-green-50' : 'bg-red-50',
      target: formatCompactCurrency(stats.netIncome * 1.2),
      progress: stats.netIncome > 0 ? Math.min(100, (stats.netIncome / (stats.netIncome * 1.2)) * 100) : 0
    },
    {
      title: 'Profit Margin',
      value: `${stats.profitMargin.toFixed(1)}%`,
      change: '+2.3%',
      icon: <PieChart size={24} />,
      color: stats.profitMargin >= 15 ? 'text-green-600' : stats.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats.profitMargin >= 15 ? 'bg-green-50' : stats.profitMargin >= 10 ? 'bg-yellow-50' : 'bg-red-50',
      target: '20%',
      progress: Math.min(100, (stats.profitMargin / 20) * 100)
    }
  ];

  const handleViewDetails = (item: IncomeItem | ExpenseItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (item: IncomeItem | ExpenseItem) => {
    setEditingItem(item);
    if ('source' in item) {
      setIsIncomeDialogOpen(true);
    } else {
      setIsExpenseDialogOpen(true);
    }
  };

  const handleDelete = async (item: IncomeItem | ExpenseItem) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if ('source' in item) {
        await deleteIncomeItem(item.id);
      } else {
        await deleteExpenseItem(item.id);
      }
    }
  };

  const handleSubmitIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const incomeData = {
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      source: formData.get('source') as string,
      recurring: formData.get('recurring') === 'on',
      frequency: formData.get('frequency') as 'monthly' | 'quarterly' | 'yearly' | undefined,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.get('status') as 'confirmed' | 'pending' | 'projected',
      paymentMethod: formData.get('paymentMethod') as string,
      reference: formData.get('reference') as string
    };

    try {
      if (editingItem && 'source' in editingItem) {
        await updateIncomeItem(editingItem.id, incomeData);
      } else {
        await addIncomeItem(incomeData);
      }
      setIsIncomeDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving income item:', error);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const expenseData = {
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      vendor: formData.get('vendor') as string,
      recurring: formData.get('recurring') === 'on',
      frequency: formData.get('frequency') as 'monthly' | 'quarterly' | 'yearly' | undefined,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.get('status') as 'paid' | 'pending' | 'overdue' | 'projected',
      paymentMethod: formData.get('paymentMethod') as string,
      reference: formData.get('reference') as string,
      approvedBy: formData.get('approvedBy') as string,
      department: formData.get('department') as string
    };

    try {
      if (editingItem && 'vendor' in editingItem) {
        await updateExpenseItem(editingItem.id, expenseData);
      } else {
        await addExpenseItem(expenseData);
      }
      setIsExpenseDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving expense item:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 size={28} className="mr-3 text-blue-600" />
            Income vs Expenses
          </h1>
          <p className="text-gray-600 mt-1">Track and analyze your financial performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Exporting...
              </div>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export
              </>
            )}
          </Button>
          <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                <Plus size={16} className="mr-2" />
                Add Income
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus size={16} className="mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-yellow-700">
              <AlertTriangle size={20} className="mr-2" />
              Financial Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm opacity-80">{alert.message}</p>
                    </div>
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        Action Required
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {alerts.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  +{alerts.length - 3} more alerts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stat.bgColor} mr-3`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getGrowthColor(stat.change)}`}>
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses Trend</CardTitle>
                <CardDescription>Financial performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                      <Tooltip 
                        formatter={(value, name) => [formatIndianCurrency(value as number), name]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Income"
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Expenses"
                      />
                      <Line
                        type="monotone"
                        dataKey="netIncome"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Net Income"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData.filter(item => item.type === 'income')}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.filter(item => item.type === 'income').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData.filter(item => item.type === 'expense')}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.filter(item => item.type === 'expense').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            {/* Income Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search income items..."
                    value={filters.searchTerm}
                    onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {incomeData.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-green-50`}>
                              <ArrowUpRight size={16} className="text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{item.description}</h3>
                              <p className="text-sm text-gray-500">{item.category} • {item.subcategory}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {item.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(item.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard size={14} />
                              {item.paymentMethod}
                            </span>
                            {item.recurring && (
                              <Badge variant="outline" className="text-xs">
                                {getRecurringFrequencyText(item.frequency)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatIndianCurrency(item.amount)}
                          </p>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(item)}>
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            {/* Expense Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search expense items..."
                    value={filters.searchTerm}
                    onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {expenseData.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-red-50`}>
                              <ArrowDownRight size={16} className="text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{item.description}</h3>
                              <p className="text-sm text-gray-500">{item.category} • {item.subcategory}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Building size={14} />
                              {item.vendor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(item.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={14} />
                              {item.department}
                            </span>
                            {item.recurring && (
                              <Badge variant="outline" className="text-xs">
                                {getRecurringFrequencyText(item.frequency)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">
                            {formatIndianCurrency(item.amount)}
                          </p>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(item)}>
                              <Eye size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                              <Edit size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            {/* Budget Health Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{budgetHealth.onTrackCount}</div>
                  <div className="text-sm text-gray-600">On Track</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{budgetHealth.overBudgetCount}</div>
                  <div className="text-sm text-gray-600">Over Budget</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{budgetHealth.underBudgetCount}</div>
                  <div className="text-sm text-gray-600">Under Target</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCompactCurrency(budgetHealth.totalVariance)}</div>
                  <div className="text-sm text-gray-600">Total Variance</div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
                <CardDescription>Compare budgeted amounts with actual performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
                      <Tooltip 
                        formatter={(value, name) => [formatIndianCurrency(value as number), name]}
                      />
                      <Legend />
                      <Bar dataKey="budgeted" fill="#94A3B8" name="Budgeted" />
                      <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget Details */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetComparison.map((item) => (
                    <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.category}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Budgeted</p>
                            <p className="font-medium">{formatIndianCurrency(item.budgeted)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Actual</p>
                            <p className="font-medium">{formatIndianCurrency(item.actual)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Variance</p>
                            <p className={`font-medium ${getVarianceColor(item.variance, item.type)}`}>
                              {getVarianceIcon(item.variance, item.type)} {formatIndianCurrency(Math.abs(item.variance))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
          </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Income Dialog */}
      <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Income Item' : 'Add Income Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the income details below.' : 'Fill in the details to add a new income item.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitIncome} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={editingItem && 'source' in editingItem ? editingItem.category : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Revenue">Sales Revenue</SelectItem>
                  <SelectItem value="Service Revenue">Service Revenue</SelectItem>
                  <SelectItem value="Investment Income">Investment Income</SelectItem>
                  <SelectItem value="Other Income">Other Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input 
                id="subcategory" 
                name="subcategory" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.subcategory : ''} 
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.description : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.amount : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.date : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input 
                id="source" 
                name="source" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.source : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select name="paymentMethod" defaultValue={editingItem && 'source' in editingItem ? editingItem.paymentMethod : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online Payment">Online Payment</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={editingItem && 'source' in editingItem ? editingItem.status : 'confirmed'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="projected">Projected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input 
                id="reference" 
                name="reference" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.reference : ''} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                defaultValue={editingItem && 'source' in editingItem ? editingItem.tags.join(', ') : ''} 
                placeholder="e.g., recurring, primary, consulting"
              />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch 
                id="recurring" 
                name="recurring" 
                defaultChecked={editingItem && 'source' in editingItem ? editingItem.recurring : false}
              />
              <Label htmlFor="recurring">Recurring Income</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (if recurring)</Label>
              <Select name="frequency" defaultValue={editingItem && 'source' in editingItem ? editingItem.frequency : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="md:col-span-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsIncomeDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Income' : 'Add Income'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Expense Item' : 'Add Expense Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the expense details below.' : 'Fill in the details to add a new expense item.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={editingItem && 'vendor' in editingItem ? editingItem.category : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operating Expenses">Operating Expenses</SelectItem>
                  <SelectItem value="Personnel Costs">Personnel Costs</SelectItem>
                  <SelectItem value="Marketing Expenses">Marketing Expenses</SelectItem>
                  <SelectItem value="Technology Expenses">Technology Expenses</SelectItem>
                  <SelectItem value="Other Expenses">Other Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input 
                id="subcategory" 
                name="subcategory" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.subcategory : ''} 
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.description : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.amount : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.date : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input 
                id="vendor" 
                name="vendor" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.vendor : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                name="department" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.department : ''} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select name="paymentMethod" defaultValue={editingItem && 'vendor' in editingItem ? editingItem.paymentMethod : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online Payment">Online Payment</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={editingItem && 'vendor' in editingItem ? editingItem.status : 'pending'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="projected">Projected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvedBy">Approved By</Label>
              <Input 
                id="approvedBy" 
                name="approvedBy" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.approvedBy : ''} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input 
                id="reference" 
                name="reference" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.reference : ''} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                defaultValue={editingItem && 'vendor' in editingItem ? editingItem.tags.join(', ') : ''} 
                placeholder="e.g., recurring, fixed, variable"
              />
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <Switch 
                id="recurring" 
                name="recurring" 
                defaultChecked={editingItem && 'vendor' in editingItem ? editingItem.recurring : false}
              />
              <Label htmlFor="recurring">Recurring Expense</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (if recurring)</Label>
              <Select name="frequency" defaultValue={editingItem && 'vendor' in editingItem ? editingItem.frequency : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="md:col-span-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? 'Update Expense' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {'source' in selectedItem ? 'Income' : 'Expense'} Details - {selectedItem.id}
                </DialogTitle>
                <DialogDescription>
                  Complete information for this {'source' in selectedItem ? 'income' : 'expense'} item
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">{selectedItem.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subcategory:</span>
                        <span className="font-medium">{selectedItem.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium">{formatIndianCurrency(selectedItem.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{formatDate(selectedItem.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          {'source' in selectedItem ? 'Source:' : 'Vendor:'}
                        </span>
                        <span className="font-medium">
                          {'source' in selectedItem ? selectedItem.source : (selectedItem as ExpenseItem).vendor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method:</span>
                        <span className="font-medium">{selectedItem.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reference:</span>
                        <span className="font-medium">{selectedItem.reference}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedItem.status)}>
                          {selectedItem.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {'vendor' in selectedItem && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium">{selectedItem.department}</span>
                        </div>
                        {selectedItem.approvedBy && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Approved By:</span>
                            <span className="font-medium">{selectedItem.approvedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedItem.recurring && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recurring Details</h3>
                      <p className="text-gray-700">
                        This is a {getRecurringFrequencyText(selectedItem.frequency).toLowerCase()} {'source' in selectedItem ? 'income' : 'expense'}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsDetailDialogOpen(false);
                  handleEdit(selectedItem);
                }}>
                  Edit {'source' in selectedItem ? 'Income' : 'Expense'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncomeExpensesPage;