'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Treemap
} from 'recharts';
import { 
  Building2, TrendingUp, CreditCard, PiggyBank, Users, 
  ShoppingCart, Zap, Car, Home, Briefcase 
} from 'lucide-react';
import { formatIndianCurrency } from '@/lib/components-imp-utils/finance';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeFlow: number;
  operatingFlow: number;
  investingFlow: number;
  financingFlow: number;
}

interface CashFlowSummary {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  cashFlowGrowth: number;
  burnRate: number;
  runway: number;
}

interface CashFlowBreakdownProps {
  data: CashFlowData[];
  summary: CashFlowSummary;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const CashFlowBreakdown = ({ data, summary }: CashFlowBreakdownProps) => {
  // Cash Flow Categories Data
  const cashFlowCategories = [
    {
      name: 'Operating Activities',
      value: Math.abs(summary.operatingCashFlow),
      percentage: (Math.abs(summary.operatingCashFlow) / Math.abs(summary.netCashFlow)) * 100,
      icon: <Building2 className="h-5 w-5" />,
      color: '#3b82f6',
      description: 'Core business operations'
    },
    {
      name: 'Investing Activities',
      value: Math.abs(summary.investingCashFlow),
      percentage: (Math.abs(summary.investingCashFlow) / Math.abs(summary.netCashFlow)) * 100,
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#10b981',
      description: 'Asset purchases and investments'
    },
    {
      name: 'Financing Activities',
      value: Math.abs(summary.financingCashFlow),
      percentage: (Math.abs(summary.financingCashFlow) / Math.abs(summary.netCashFlow)) * 100,
      icon: <CreditCard className="h-5 w-5" />,
      color: '#f59e0b',
      description: 'Debt and equity transactions'
    }
  ];

  // Detailed Expense Breakdown (Mock Data)
  const expenseBreakdown = [
    { category: 'Payroll & Benefits', amount: 450000, icon: <Users className="h-4 w-4" />, color: '#3b82f6' },
    { category: 'Office & Operations', amount: 180000, icon: <Building2 className="h-4 w-4" />, color: '#10b981' },
    { category: 'Marketing & Sales', amount: 120000, icon: <Briefcase className="h-4 w-4" />, color: '#f59e0b' },
    { category: 'Technology & Software', amount: 95000, icon: <Zap className="h-4 w-4" />, color: '#ef4444' },
    { category: 'Travel & Transport', amount: 65000, icon: <Car className="h-4 w-4" />, color: '#8b5cf6' },
    { category: 'Rent & Utilities', amount: 85000, icon: <Home className="h-4 w-4" />, color: '#06b6d4' },
  ];

  // Revenue Sources (Mock Data)
  const revenueBreakdown = [
    { source: 'Product Sales', amount: 680000, percentage: 68, color: '#3b82f6' },
    { source: 'Service Revenue', amount: 220000, percentage: 22, color: '#10b981' },
    { source: 'Consulting', amount: 80000, percentage: 8, color: '#f59e0b' },
    { source: 'Other Income', amount: 20000, percentage: 2, color: '#ef4444' },
  ];

  // Prepare data for charts
  const pieChartData = cashFlowCategories.map(cat => ({
    name: cat.name,
    value: cat.value,
    color: cat.color
  }));

  const monthlyBreakdown = data.slice(-12).map(item => ({
    month: item.date,
    operating: item.operatingFlow,
    investing: item.investingFlow,
    financing: item.financingFlow
  }));

  return (
    <div className="space-y-6">
      {/* Cash Flow Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {cashFlowCategories.map((category, index) => (
          <Card key={category.name} className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                  <div style={{ color: category.color }}>
                    {category.icon}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.percentage.toFixed(1)}%
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-2xl font-bold mb-2" style={{ color: category.color }}>
                  {formatIndianCurrency(category.value)}
                </p>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              
              <div className="mt-4">
                <Progress 
                  value={category.percentage} 
                  className="h-2"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Distribution Pie Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Cash Flow Distribution</CardTitle>
            <CardDescription>Breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatIndianCurrency(value || 0)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatIndianCurrency(value), 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown Bar Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Activity Breakdown</CardTitle>
            <CardDescription>Cash flow by activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatIndianCurrency(value),
                      name === 'operating' ? 'Operating' : 
                      name === 'investing' ? 'Investing' : 'Financing'
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="operating" fill="#3b82f6" name="Operating" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="investing" fill="#10b981" name="Investing" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="financing" fill="#f59e0b" name="Financing" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-700">Major Expense Categories</CardTitle>
            <CardDescription>Top spending areas in your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseBreakdown.map((expense, index) => (
                <div key={expense.category} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${expense.color}20` }}>
                      <div style={{ color: expense.color }}>
                        {expense.icon}
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">{expense.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatIndianCurrency(expense.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {((expense.amount / summary.totalOutflow) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">Revenue Sources</CardTitle>
            <CardDescription>Income streams contributing to cash inflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((revenue, index) => (
                <div key={revenue.source} className="p-3 bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{revenue.source}</span>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatIndianCurrency(revenue.amount)}</p>
                      <p className="text-xs text-gray-500">{revenue.percentage}%</p>
                    </div>
                  </div>
                  <Progress 
                    value={revenue.percentage} 
                    className="h-2"
                    style={{ backgroundColor: `${revenue.color}20` }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlowBreakdown;