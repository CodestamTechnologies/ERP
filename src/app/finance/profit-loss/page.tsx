'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Download, RefreshCw, DollarSign, 
  BarChart3, PieChart, Calculator, Target, AlertTriangle
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useProfitLoss } from '@/hooks/useProfitLoss';
import { ProfitLossChart } from '@/components/finance/profit-loss/ProfitLossChart';
import { RevenueCard } from '@/components/finance/profit-loss/RevenueCard';
import { ExpenseCard } from '@/components/finance/profit-loss/ExpenseCard';
import { ProfitabilityCard } from '@/components/finance/profit-loss/ProfitabilityCard';
import { ProfitLossTrendChart } from '@/components/finance/profit-loss/ProfitLossTrendChart';
import { RatioAnalysisCard } from '@/components/finance/balance-sheet/RatioAnalysisCard';

const ProfitLossPage = () => {
  const {
    profitLoss, periods, ratios, trends, loading, isProcessing,
    selectedPeriod, setSelectedPeriod, exportData, refreshData
  } = useProfitLoss();

  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');

  const statsData = useMemo(() => [
    {
      name: 'Total Revenue',
      value: `₹${(profitLoss.totalRevenue / 100000).toFixed(1)}L`,
      change: '+18.5%', changeType: 'positive' as const,
      icon: <TrendingUp size={20} />, progress: 92
    },
    {
      name: 'Total Expenses',
      value: `₹${(profitLoss.totalExpenses / 100000).toFixed(1)}L`,
      change: '+12.3%', changeType: 'negative' as const,
      icon: <TrendingDown size={20} />, progress: 75
    },
    {
      name: 'Gross Profit',
      value: `₹${(profitLoss.grossProfit / 100000).toFixed(1)}L`,
      change: '+22.1%', changeType: 'positive' as const,
      icon: <DollarSign size={20} />, progress: 88
    },
    {
      name: 'Net Profit',
      value: `₹${(profitLoss.netProfit / 100000).toFixed(1)}L`,
      change: '+25.8%', changeType: 'positive' as const,
      icon: <Target size={20} />, progress: 95
    }
  ], [profitLoss]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
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
            Profit & Loss Statement
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive income statement analysis with revenue, expenses, and profitability metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />Export
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={isProcessing}>
            <RefreshCw size={16} className="mr-2" />Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <div className="text-blue-600">{stat.icon}</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <Progress value={stat.progress} className="w-full" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profit Equation */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Profit & Loss Equation</h3>
            <div className="flex items-center justify-center space-x-4 text-lg font-bold flex-wrap">
              <div className="bg-white rounded-lg p-4 shadow-sm m-2">
                <div className="text-green-600">Revenue</div>
                <div className="text-2xl">{formatCurrency(profitLoss.totalRevenue)}</div>
              </div>
              <div className="text-green-600 text-2xl">-</div>
              <div className="bg-white rounded-lg p-4 shadow-sm m-2">
                <div className="text-red-600">Expenses</div>
                <div className="text-2xl">{formatCurrency(profitLoss.totalExpenses)}</div>
              </div>
              <div className="text-green-600 text-2xl">=</div>
              <div className="bg-white rounded-lg p-4 shadow-sm m-2">
                <div className={profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {profitLoss.netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                </div>
                <div className="text-2xl">{formatCurrency(Math.abs(profitLoss.netProfit))}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Profit Margin: <span className="font-semibold text-green-600">
                {((profitLoss.netProfit / profitLoss.totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full overflow-x-auto flex justify-start">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 size={16} className="text-blue-600" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span>Revenue</span>
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex items-center space-x-2">
                  <TrendingDown size={16} className="text-red-600" />
                  <span>Expenses</span>
                </TabsTrigger>
                <TabsTrigger value="profitability" className="flex items-center space-x-2">
                  <Target size={16} className="text-purple-600" />
                  <span>Profitability</span>
                </TabsTrigger>
                <TabsTrigger value="ratios" className="flex items-center space-x-2">
                  <Calculator size={16} className="text-orange-600" />
                  <span>Ratios</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center space-x-2">
                  <PieChart size={16} className="text-indigo-600" />
                  <span>Trends</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2 ml-4">
              <Button variant={viewMode === 'detailed' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('detailed')}>Detailed</Button>
              <Button variant={viewMode === 'summary' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('summary')}>Summary</Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <ProfitLossChart data={profitLoss} formatCurrency={formatCurrency} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-green-800 flex items-center">
                          <TrendingUp size={18} className="mr-2" />
                          Revenue Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Operating Revenue:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.operatingRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Non-Operating Revenue:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.nonOperatingRevenue)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Revenue:</span>
                            <span>{formatCurrency(profitLoss.totalRevenue)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-red-800 flex items-center">
                          <TrendingDown size={18} className="mr-2" />
                          Expense Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Operating Expenses:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.operatingExpenses)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Non-Operating Expenses:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.nonOperatingExpenses)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Expenses:</span>
                            <span>{formatCurrency(profitLoss.totalExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-purple-800 flex items-center">
                          <Target size={18} className="mr-2" />
                          Profitability Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Gross Profit:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.grossProfit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Operating Profit:</span>
                            <span className="font-semibold">{formatCurrency(profitLoss.operatingProfit)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Net Profit:</span>
                            <span className={profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(profitLoss.netProfit)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'revenue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profitLoss.revenueItems.map((revenue, index) => (
                    <RevenueCard key={revenue.id} revenue={revenue} viewMode={viewMode} formatCurrency={formatCurrency} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profitLoss.expenseItems.map((expense, index) => (
                    <ExpenseCard key={expense.id} expense={expense} viewMode={viewMode} formatCurrency={formatCurrency} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'profitability' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfitabilityCard 
                      title="Gross Profit Margin"
                      value={(profitLoss.grossProfit / profitLoss.totalRevenue) * 100}
                      benchmark={40}
                      description="Revenue after direct costs"
                      formatPercentage={formatPercentage}
                    />
                    <ProfitabilityCard 
                      title="Operating Profit Margin"
                      value={(profitLoss.operatingProfit / profitLoss.totalRevenue) * 100}
                      benchmark={15}
                      description="Profit from core operations"
                      formatPercentage={formatPercentage}
                    />
                    <ProfitabilityCard 
                      title="Net Profit Margin"
                      value={(profitLoss.netProfit / profitLoss.totalRevenue) * 100}
                      benchmark={10}
                      description="Bottom line profitability"
                      formatPercentage={formatPercentage}
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Profitability Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Revenue Efficiency</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Revenue per Employee:</span>
                                <span className="font-medium">{formatCurrency(profitLoss.totalRevenue / 50)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Revenue Growth Rate:</span>
                                <span className="font-medium text-green-600">+18.5%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Cost Management</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Cost-to-Revenue Ratio:</span>
                                <span className="font-medium">{formatPercentage((profitLoss.totalExpenses / profitLoss.totalRevenue) * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Expense Growth Rate:</span>
                                <span className="font-medium text-red-600">+12.3%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'ratios' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ratios.map((ratio, index) => (
                    <RatioAnalysisCard key={ratio.name} ratio={ratio} formatPercentage={formatPercentage} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'trends' && (
                <div className="space-y-6">
                  <ProfitLossTrendChart trends={trends} formatCurrency={formatCurrency} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPercentage(((profitLoss.totalRevenue - trends.previousPeriod.totalRevenue) / trends.previousPeriod.totalRevenue) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Revenue Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {formatPercentage(((profitLoss.totalExpenses - trends.previousPeriod.totalExpenses) / trends.previousPeriod.totalExpenses) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Expense Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatPercentage(((profitLoss.grossProfit - trends.previousPeriod.grossProfit) / trends.previousPeriod.grossProfit) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Gross Profit Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPercentage(((profitLoss.netProfit - trends.previousPeriod.netProfit) / trends.previousPeriod.netProfit) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Net Profit Growth</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossPage;