'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useReconciliationPage } from '@/hooks/useReconciliationPage';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { 
  BarChart3,
  Upload,
  Search,
  CheckCircle,
  Clock,
  FileCheck,
  Settings,
  RefreshCw,
  Target,
  TrendingUp,
  Shuffle
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { ReconciliationStatsCard } from '@/components/reconciliation/ReconciliationStatsCard';
import { StatementUploadCard } from '@/components/reconciliation/StatementUploadCard';
import { DiscrepancyCard } from '@/components/reconciliation/DiscrepancyCard';
import { ReconciliationRuleCard } from '@/components/reconciliation/ReconciliationRuleCard';
import { UploadStatementDialog } from '@/components/reconciliation/dialogs/UploadStatementDialog';
import { RuleManagementDialog } from '@/components/reconciliation/dialogs/RuleManagementDialog';

const BankReconciliationPage = () => {
  const {
    statements,
    reconciliationItems,
    rules,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    uploadStatement,
    startReconciliation,
    resolveDiscrepancy,
    ignoreDiscrepancy,
    runAutoReconciliation,
    exportReconciliationReport,
    createRule,
    updateRule,
    deleteRule
  } = useReconciliationPage();

  const { accounts } = useBankAccounts();

  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const STATS_CARDS = [
    {
      title: 'Total Statements',
      value: summary.totalStatements.toString(),
      change: `${summary.completedReconciliations} completed`,
      icon: <FileCheck size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: summary.totalStatements > 0 ? (summary.completedReconciliations / summary.totalStatements) * 100 : 0
    },
    {
      title: 'Pending Items',
      value: summary.pendingDiscrepancies.toString(),
      change: `${summary.totalDiscrepancies} total discrepancies`,
      icon: <Clock size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: summary.totalDiscrepancies > 0 ? (summary.pendingDiscrepancies / summary.totalDiscrepancies) * 100 : 0
    },
    {
      title: 'Accuracy Rate',
      value: `${summary.reconciliationAccuracy.toFixed(1)}%`,
      change: `${summary.averageReconciliationTime}h avg time`,
      icon: <Target size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: summary.reconciliationAccuracy
    },
    {
      title: 'Total Variance',
      value: `$${(summary.totalVariance / 1000).toFixed(1)}K`,
      change: 'Across all accounts',
      icon: <TrendingUp size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      progress: 65
    }
  ];

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
            Bank Reconciliation
          </h1>
          <p className="text-gray-600 mt-1">Reconcile bank statements and resolve discrepancies</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsRuleDialogOpen(true)}>
            <Settings size={16} className="mr-2" />
            Rules
          </Button>
          <Button variant="outline" disabled={isProcessing}>
            <RefreshCw size={16} className="mr-2" />
            Auto Reconcile
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload size={16} className="mr-2" />
            Upload Statement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <ReconciliationStatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
              <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsUploadDialogOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Upload size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Upload Statement</h3>
                    <p className="text-sm text-gray-600">Upload bank statements for reconciliation</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Shuffle size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Auto Match</h3>
                    <p className="text-sm text-gray-600">Automatically match transactions</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsRuleDialogOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Settings size={32} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Manage Rules</h3>
                    <p className="text-sm text-gray-600">Configure reconciliation rules</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statements.slice(0, 3).map((statement) => (
                      <div key={statement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileCheck size={20} className="text-blue-600" />
                          <div>
                            <p className="font-medium">{statement.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {accounts.find(acc => acc.id === statement.accountId)?.accountName}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          statement.status === 'completed' ? 'text-green-600 bg-green-50 border-green-200' :
                          statement.status === 'in_progress' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          'text-yellow-600 bg-yellow-50 border-yellow-200'
                        }>
                          {statement.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statements" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search statements..."
                    className="pl-10"
                  />
                </div>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Statements List */}
              <div className="space-y-4">
                {statements.map((statement) => (
                  <StatementUploadCard
                    key={statement.id}
                    statement={statement}
                    account={accounts.find(acc => acc.id === statement.accountId)}
                    isProcessing={isProcessing}
                    onStartReconciliation={startReconciliation}
                    onRunAutoReconciliation={runAutoReconciliation}
                    onExportReport={exportReconciliationReport}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discrepancies" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search discrepancies..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={filters.status[0] || 'all'} 
                  onValueChange={(value) => updateFilters({ 
                    status: value === 'all' ? [] : [value] 
                  })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="ignored">Ignored</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.priority[0] || 'all'} 
                  onValueChange={(value) => updateFilters({ 
                    priority: value === 'all' ? [] : [value] 
                  })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discrepancies List */}
              <div className="space-y-4">
                {reconciliationItems.map((item) => (
                  <DiscrepancyCard
                    key={item.id}
                    item={item}
                    onResolve={resolveDiscrepancy}
                    onIgnore={ignoreDiscrepancy}
                  />
                ))}
                
                {reconciliationItems.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No discrepancies found</h3>
                    <p className="text-gray-500">All transactions have been successfully reconciled</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              {/* Rules Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Reconciliation Rules</h3>
                  <p className="text-gray-600">Automate reconciliation with custom rules</p>
                </div>
                <Button onClick={() => setIsRuleDialogOpen(true)}>
                  <Settings size={16} className="mr-2" />
                  Add Rule
                </Button>
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                {rules.map((rule) => (
                  <ReconciliationRuleCard
                    key={rule.id}
                    rule={rule}
                    onUpdate={updateRule}
                    onDelete={deleteRule}
                  />
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Upload Statement Dialog */}
      <UploadStatementDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        accounts={accounts}
        onUpload={uploadStatement}
        isProcessing={isProcessing}
      />

      {/* Rule Management Dialog */}
      <RuleManagementDialog
        isOpen={isRuleDialogOpen}
        onClose={() => setIsRuleDialogOpen(false)}
        accounts={accounts}
        onCreateRule={createRule}
      />
    </div>
  );
};

export default BankReconciliationPage;