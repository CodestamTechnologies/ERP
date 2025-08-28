'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Target, Wallet, Brain, 
  ArrowUpRight, ArrowDownRight, Building2, CreditCard, 
  FileText, Clock, Eye, Filter, Search, RefreshCw, Download,
  CheckCircle, AlertTriangle, Plus, Edit, Trash2
} from 'lucide-react';
import { formatIndianCurrency } from '@/lib/components-imp-utils/finance';

// Types
interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeFlow: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'inflow' | 'outflow';
  amount: number;
  account: string;
  status: 'completed' | 'pending' | 'scheduled';
  reference?: string;
}

interface CashFlowSummary {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  runway: number;
  burnRate: number;
}

// Constants
const CASH_FLOW_TABS = [
  { id: 'overview', name: 'Overview', icon: <Activity size={16} className="text-blue-600" /> },
  { id: 'analysis', name: 'Analysis', icon: <Brain size={16} className="text-green-600" /> },
  { id: 'transactions', name: 'Transactions', icon: <FileText size={16} className="text-purple-600" /> },
  { id: 'forecast', name: 'Forecast', icon: <TrendingUp size={16} className="text-orange-600" /> },
];

// Data generators
const generateCashFlowData = (period: string): CashFlowData[] => {
  const days = period === '7days' ? 7 : period === '30days' ? 30 : period === '90days' ? 90 : 365;
  const data: CashFlowData[] = [];
  let cumulativeFlow = 2500000;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const inflow = Math.round(50000 + Math.random() * 100000);
    const outflow = Math.round(30000 + Math.random() * 80000);
    const netFlow = inflow - outflow;
    cumulativeFlow += netFlow;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      inflow, outflow, netFlow, cumulativeFlow
    });
  }
  return data;
};

const generateTransactions = (): Transaction[] => [
  { id: 'CF001', date: '2024-01-15', description: 'Customer Payment - TechCorp Solutions', category: 'Sales Revenue', type: 'inflow', amount: 125000, account: 'Primary Business Account', status: 'completed', reference: 'INV-2024-001' },
  { id: 'CF002', date: '2024-01-15', description: 'Office Rent Payment', category: 'Operating Expenses', type: 'outflow', amount: 45000, account: 'Primary Business Account', status: 'completed' },
  { id: 'CF003', date: '2024-01-14', description: 'Consulting Revenue - Global Enterprises', category: 'Service Revenue', type: 'inflow', amount: 75000, account: 'Primary Business Account', status: 'completed', reference: 'INV-2024-002' },
  { id: 'CF004', date: '2024-01-14', description: 'Marketing Campaign Payment', category: 'Marketing', type: 'outflow', amount: 25000, account: 'Business Credit Card', status: 'pending' },
  { id: 'CF005', date: '2024-01-13', description: 'Equipment Purchase', category: 'Capital Expenditure', type: 'outflow', amount: 85000, account: 'Primary Business Account', status: 'completed' },
  { id: 'CF006', date: '2024-01-13', description: 'Product Sales - Innovation Labs', category: 'Sales Revenue', type: 'inflow', amount: 95000, account: 'Primary Business Account', status: 'completed', reference: 'INV-2024-003' },
  { id: 'CF007', date: '2024-01-12', description: 'Payroll Processing', category: 'Payroll', type: 'outflow', amount: 180000, account: 'Primary Business Account', status: 'completed' },
  { id: 'CF008', date: '2024-01-12', description: 'Investment Income', category: 'Investment Returns', type: 'inflow', amount: 15000, account: 'Investment Account', status: 'completed' },
];

// Components
const MetricCard = ({ title, value, change, changeType, icon, description }: any) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
        <Badge variant={changeType === 'positive' ? 'default' : 'destructive'} className="text-xs">
          {change}
        </Badge>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

const InsightCard = ({ icon, title, description, recommendation, priority }: any) => (
  <Card className={`border-l-4 ${priority === 'high' ? 'border-red-500' : priority === 'medium' ? 'border-yellow-500' : 'border-green-500'}`}>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${priority === 'high' ? 'bg-red-50' : priority === 'medium' ? 'bg-yellow-50' : 'bg-green-50'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-700 mb-3">{description}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600 mb-1">Recommendation:</p>
            <p className="text-xs text-gray-700">{recommendation}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const CashFlowOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTransaction, setNewTransaction] = useState({
    description: '', amount: '', type: 'inflow', category: '', account: ''
  });

  // Generate data
  const cashFlowData = useMemo(() => generateCashFlowData(selectedPeriod), [selectedPeriod]);
  const [transactions, setTransactions] = useState<Transaction[]>(generateTransactions());

  // Calculate summary
  const summary: CashFlowSummary = useMemo(() => {
    const totalInflow = cashFlowData.reduce((sum, item) => sum + item.inflow, 0);
    const totalOutflow = cashFlowData.reduce((sum, item) => sum + item.outflow, 0);
    const netCashFlow = totalInflow - totalOutflow;
    const avgDailyOutflow = totalOutflow / cashFlowData.length;
    const currentBalance = cashFlowData[cashFlowData.length - 1]?.cumulativeFlow || 0;
    const runway = avgDailyOutflow > 0 ? Math.floor(currentBalance / avgDailyOutflow) : 0;
    
    return { totalInflow, totalOutflow, netCashFlow, runway, burnRate: avgDailyOutflow };
  }, [cashFlowData]);

  // Handlers
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    
    const transaction: Transaction = {
      id: `CF${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
      category: newTransaction.category || 'General',
      type: newTransaction.type as 'inflow' | 'outflow',
      amount: parseFloat(newTransaction.amount),
      account: newTransaction.account || 'Primary Business Account',
      status: 'completed'
    };
    
    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ description: '', amount: '', type: 'inflow', category: '', account: '' });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Net Cash Flow"
                value={formatIndianCurrency(summary.netCashFlow)}
                change="+12.5%"
                changeType="positive"
                icon={<Activity className="h-5 w-5 text-blue-600" />}
                description="Total inflow minus outflow"
              />
              <MetricCard
                title="Current Balance"
                value={formatIndianCurrency(cashFlowData[cashFlowData.length - 1]?.cumulativeFlow || 0)}
                change="+5.2%"
                changeType="positive"
                icon={<Wallet className="h-5 w-5 text-green-600" />}
                description="Available cash balance"
              />
              <MetricCard
                title="Cash Runway"
                value={`${summary.runway} days`}
                change="+15 days"
                changeType="positive"
                icon={<Target className="h-5 w-5 text-purple-600" />}
                description="Days until cash depletion"
              />
              <MetricCard
                title="Daily Burn Rate"
                value={formatIndianCurrency(summary.burnRate)}
                change="-3.1%"
                changeType="positive"
                icon={<TrendingDown className="h-5 w-5 text-orange-600" />}
                description="Average daily outflow"
              />
            </div>

            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Financial Health</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cash Flow Ratio</span>
                        <span className="font-semibold text-blue-600">{(summary.totalInflow / summary.totalOutflow).toFixed(2)}:1</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Operating Efficiency</span>
                        <span className="font-semibold text-green-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Liquidity Score</span>
                        <span className="font-semibold text-purple-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Cash flow improved 12.5% vs previous period
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Runway extended to {summary.runway} days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Collection period optimized to 28 days
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Trend - Compact Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Cash Flow Trend
                </CardTitle>
                <CardDescription>Net cash flow over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => [formatIndianCurrency(value), 'Net Flow']} />
                      <Line type="monotone" dataKey="netFlow" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            {/* Performance Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-700">Cash Inflows</h4>
                      <p className="text-2xl font-bold text-green-800">{formatIndianCurrency(summary.totalInflow)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p><strong>Primary Sources:</strong> Customer payments (65%), Service revenue (25%), Investment returns (10%)</p>
                    <p className="mt-2"><strong>Growth:</strong> 8.5% increase from previous period</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <ArrowDownRight className="h-6 w-6 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-700">Cash Outflows</h4>
                      <p className="text-2xl font-bold text-red-800">{formatIndianCurrency(summary.totalOutflow)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p><strong>Major Expenses:</strong> Payroll (35%), Operations (25%), Marketing (15%), Equipment (25%)</p>
                    <p className="mt-2"><strong>Control:</strong> 3.2% increase, well managed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-700">Net Position</h4>
                      <p className="text-2xl font-bold text-blue-800">{formatIndianCurrency(summary.netCashFlow)}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p><strong>Efficiency:</strong> {((summary.netCashFlow / summary.totalInflow) * 100).toFixed(1)}% retention rate</p>
                    <p className="mt-2"><strong>Trend:</strong> Consistent positive growth</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InsightCard
                icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                title="Strong Liquidity Position"
                description="Current cash runway of 67 days provides excellent operational security and exceeds industry benchmarks."
                recommendation="Maintain current cash management practices. Consider strategic investments for growth."
                priority="low"
              />
              <InsightCard
                icon={<Clock className="h-5 w-5 text-yellow-600" />}
                title="Collection Optimization"
                description="Average collection period of 28 days is good but can be improved to industry-leading 25 days."
                recommendation="Implement automated payment reminders and early payment discounts."
                priority="medium"
              />
              <InsightCard
                icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                title="Growth Opportunity"
                description="12.5% cash flow growth indicates sustainable expansion potential with proper planning."
                recommendation="Allocate 15% of excess cash for strategic growth initiatives."
                priority="low"
              />
              <InsightCard
                icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
                title="Seasonal Planning"
                description="Historical data shows 20% variance during seasonal periods requiring proactive management."
                recommendation="Establish ₹10L credit line as buffer for seasonal cash flow variations."
                priority="medium"
              />
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Performance Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Key Ratios</h4>
                    <div className="space-y-3">
                      {[
                        { metric: 'Current Ratio', value: '2.4', benchmark: '2.0', status: 'above' },
                        { metric: 'Quick Ratio', value: '1.8', benchmark: '1.5', status: 'above' },
                        { metric: 'Cash Ratio', value: '0.9', benchmark: '0.7', status: 'above' },
                        { metric: 'Operating Cash Flow Margin', value: '18%', benchmark: '15%', status: 'above' }
                      ].map((item) => (
                        <div key={item.metric} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{item.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.value}</span>
                            <Badge variant={item.status === 'above' ? 'default' : 'destructive'} className="text-xs">
                              {item.status === 'above' ? 'Above' : 'Below'} Industry
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Improvement Areas</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-700 mb-1">Payment Terms</h5>
                        <p className="text-xs text-blue-600">Negotiate 40-day payment terms with suppliers to improve working capital by ₹2.5L</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-700 mb-1">Cash Forecasting</h5>
                        <p className="text-xs text-green-600">Implement 13-week rolling forecasts for better cash management precision</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h5 className="font-medium text-purple-700 mb-1">Investment Strategy</h5>
                        <p className="text-xs text-purple-600">Consider short-term investments for excess cash to generate additional returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            {/* Add Transaction Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Add New Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inflow">Inflow</SelectItem>
                      <SelectItem value="outflow">Outflow</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Category"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <Button onClick={handleAddTransaction} className="w-full">
                    Add Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
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
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              {transaction.reference && (
                                <div className="text-sm text-gray-500">Ref: {transaction.reference}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${transaction.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'inflow' ? '+' : '-'}{formatIndianCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'forecast':
        return (
          <div className="space-y-6">
            {/* Forecast Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-700">30-Day Forecast</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-800 mb-2">₹8.5L</p>
                  <p className="text-xs text-gray-600">Projected net inflow based on current trends and seasonal patterns</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-700">Cash Position</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-800 mb-2">₹33.5L</p>
                  <p className="text-xs text-gray-600">Expected cash balance at end of forecast period</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-700">Risk Level</h4>
                  </div>
                  <p className="text-2xl font-bold text-orange-800 mb-2">Low</p>
                  <p className="text-xs text-gray-600">Based on historical patterns and current runway</p>
                </CardContent>
              </Card>
            </div>

            {/* Forecast Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Forecast Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Assumptions</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-700 mb-1">Revenue Growth</h5>
                        <p className="text-sm text-blue-600">5% monthly growth based on pipeline and market trends</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-700 mb-1">Collection Period</h5>
                        <p className="text-sm text-green-600">Maintained at 28 days with 95% collection rate</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h5 className="font-medium text-yellow-700 mb-1">Operating Expenses</h5>
                        <p className="text-sm text-yellow-600">2% monthly increase aligned with business growth</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Scenario Planning</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-green-700">Optimistic</h5>
                          <p className="text-xs text-green-600">+20% revenue growth</p>
                        </div>
                        <span className="font-bold text-green-800">₹12.2L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-blue-700">Realistic</h5>
                          <p className="text-xs text-blue-600">Current trend continues</p>
                        </div>
                        <span className="font-bold text-blue-800">₹8.5L</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-red-700">Conservative</h5>
                          <p className="text-xs text-red-600">-15% revenue impact</p>
                        </div>
                        <span className="font-bold text-red-800">₹4.8L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                    <h5 className="font-medium text-green-700 mb-2">Growth Investment</h5>
                    <p className="text-sm text-green-600 mb-3">
                      With strong cash position, consider investing ₹5L in marketing and sales expansion to accelerate growth.
                    </p>
                    <Badge className="bg-green-100 text-green-700">High Impact</Badge>
                  </div>
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                    <h5 className="font-medium text-blue-700 mb-2">Working Capital Optimization</h5>
                    <p className="text-sm text-blue-600 mb-3">
                      Negotiate extended payment terms with suppliers to improve cash conversion cycle by 7 days.
                    </p>
                    <Badge className="bg-blue-100 text-blue-700">Medium Impact</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity size={28} className="mr-3 text-blue-600" />
            Cash Flow Overview
          </h1>
          <p className="text-gray-600 mt-1">Monitor and analyze your cash flow patterns and trends</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw size={16} className="mr-2 text-blue-600" />
            Refresh
          </Button>
          <Button>
            <Download size={16} className="mr-2 text-white" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="border-b p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              {CASH_FLOW_TABS.map((tab) => (
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
    </div>
  );
};

export default CashFlowOverview;