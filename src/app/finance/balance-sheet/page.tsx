'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Download, RefreshCw, TrendingUp, TrendingDown, Building2, 
  DollarSign, PieChart, Calculator, FileText, Calendar, ArrowUpDown
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBalanceSheet } from '@/hooks/useBalanceSheet';
import { BalanceSheetChart } from '@/components/finance/balance-sheet/BalanceSheetChart';
import { AssetCard } from '@/components/finance/balance-sheet/AssetCard';
import { LiabilityCard } from '@/components/finance/balance-sheet/LiabilityCard';
import { EquityCard } from '@/components/finance/balance-sheet/EquityCard';
import { RatioAnalysisCard } from '@/components/finance/balance-sheet/RatioAnalysisCard';
import { TrendAnalysisChart } from '@/components/finance/balance-sheet/TrendAnalysisChart';

const BalanceSheetPage = () => {
  const {
    balanceSheet, periods, ratios, trends, loading, isProcessing,
    selectedPeriod, setSelectedPeriod, exportData, refreshData
  } = useBalanceSheet();

  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');

  const statsData = useMemo(() => [
    {
      name: 'Total Assets',
      value: `₹${(balanceSheet.totalAssets / 100000).toFixed(1)}L`,
      change: '+12.5%', changeType: 'positive' as const,
      icon: <Building2 size={20} />, progress: 85
    },
    {
      name: 'Total Liabilities',
      value: `₹${(balanceSheet.totalLiabilities / 100000).toFixed(1)}L`,
      change: '+8.2%', changeType: 'negative' as const,
      icon: <TrendingDown size={20} />, progress: 65
    },
    {
      name: 'Total Equity',
      value: `₹${(balanceSheet.totalEquity / 100000).toFixed(1)}L`,
      change: '+15.8%', changeType: 'positive' as const,
      icon: <TrendingUp size={20} />, progress: 92
    },
    {
      name: 'Working Capital',
      value: `₹${((balanceSheet.currentAssets - balanceSheet.currentLiabilities) / 100000).toFixed(1)}L`,
      change: '+6.3%', changeType: 'positive' as const,
      icon: <Calculator size={20} />, progress: 78
    }
  ], [balanceSheet]);

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
            Balance Sheet Analysis
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive financial position analysis with assets, liabilities, and equity breakdown</p>
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

      {/* Balance Sheet Equation */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Balance Sheet Equation</h3>
            <div className="flex items-center justify-center space-x-4 text-lg font-bold">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-blue-600">Assets</div>
                <div className="text-2xl">{formatCurrency(balanceSheet.totalAssets)}</div>
              </div>
              <div className="text-blue-600 text-2xl">=</div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-red-600">Liabilities</div>
                <div className="text-2xl">{formatCurrency(balanceSheet.totalLiabilities)}</div>
              </div>
              <div className="text-blue-600 text-2xl">+</div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-green-600">Equity</div>
                <div className="text-2xl">{formatCurrency(balanceSheet.totalEquity)}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Balance Check: {balanceSheet.totalAssets === (balanceSheet.totalLiabilities + balanceSheet.totalEquity) ? 
                <span className="text-green-600 font-semibold">✓ Balanced</span> : 
                <span className="text-red-600 font-semibold">⚠ Imbalanced</span>
              }
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
                <TabsTrigger value="assets" className="flex items-center space-x-2">
                  <Building2 size={16} className="text-green-600" />
                  <span>Assets</span>
                </TabsTrigger>
                <TabsTrigger value="liabilities" className="flex items-center space-x-2">
                  <TrendingDown size={16} className="text-red-600" />
                  <span>Liabilities</span>
                </TabsTrigger>
                <TabsTrigger value="equity" className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-purple-600" />
                  <span>Equity</span>
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
                  <BalanceSheetChart data={balanceSheet} formatCurrency={formatCurrency} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-green-800 flex items-center">
                          <Building2 size={18} className="mr-2" />
                          Assets Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Current Assets:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.currentAssets)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Non-Current Assets:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.nonCurrentAssets)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Assets:</span>
                            <span>{formatCurrency(balanceSheet.totalAssets)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-red-800 flex items-center">
                          <TrendingDown size={18} className="mr-2" />
                          Liabilities Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Current Liabilities:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.currentLiabilities)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Non-Current Liabilities:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.nonCurrentLiabilities)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Liabilities:</span>
                            <span>{formatCurrency(balanceSheet.totalLiabilities)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-purple-800 flex items-center">
                          <TrendingUp size={18} className="mr-2" />
                          Equity Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Share Capital:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.shareCapital)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Retained Earnings:</span>
                            <span className="font-semibold">{formatCurrency(balanceSheet.retainedEarnings)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Equity:</span>
                            <span>{formatCurrency(balanceSheet.totalEquity)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {balanceSheet.assets.map((asset, index) => (
                    <AssetCard key={asset.id} asset={asset} viewMode={viewMode} formatCurrency={formatCurrency} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'liabilities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {balanceSheet.liabilities.map((liability, index) => (
                    <LiabilityCard key={liability.id} liability={liability} viewMode={viewMode} formatCurrency={formatCurrency} index={index} />
                  ))}
                </div>
              )}

              {activeTab === 'equity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {balanceSheet.equity.map((equity, index) => (
                    <EquityCard key={equity.id} equity={equity} viewMode={viewMode} formatCurrency={formatCurrency} index={index} />
                  ))}
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
                  <TrendAnalysisChart trends={trends} formatCurrency={formatCurrency} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPercentage(((balanceSheet.totalAssets - trends.previousPeriod.totalAssets) / trends.previousPeriod.totalAssets) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Asset Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {formatPercentage(((balanceSheet.totalLiabilities - trends.previousPeriod.totalLiabilities) / trends.previousPeriod.totalLiabilities) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Liability Growth</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPercentage(((balanceSheet.totalEquity - trends.previousPeriod.totalEquity) / trends.previousPeriod.totalEquity) * 100)}
                        </div>
                        <div className="text-sm text-gray-600">Equity Growth</div>
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

export default BalanceSheetPage;