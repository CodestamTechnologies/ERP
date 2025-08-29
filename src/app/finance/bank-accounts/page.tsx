'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useReconciliation } from '@/hooks/useReconciliation';
import { getAlertSeverityColor } from '@/lib/utils/bankAccountUtils';
import { 
  Landmark,
  Plus,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  EyeOff,
  Eye,
  Upload,
  Settings,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { BankAccount, BankIntegrationProvider, ReconciliationItem } from '@/types/bankAccount';

// Import components
import { AccountCard } from '@/components/finance/bank-accounts/AccountCard';
import { ProviderCard } from '@/components/finance/bank-accounts/ProviderCard';
import { ReconciliationCard } from '@/components/finance/bank-accounts/ReconciliationCard';
import { StatementCard } from '@/components/finance/bank-accounts/StatementCard';
import { StatsCard } from '@/components/finance/bank-accounts/StatsCard';
import { ProviderConnectionDialog } from '@/components/finance/bank-accounts/dialogs/ProviderConnectionDialog';
import { AddAccountDialog } from '@/components/finance/bank-accounts/dialogs/AddAccountDialog';
import { AccountDetailDialog } from '@/components/finance/bank-accounts/dialogs/AccountDetailDialog';

const BankAccountsPage = () => {
  const {
    accounts,
    providers,
    alerts,
    stats,
    loading,
    filters,
    isExporting,
    isSyncing,
    updateFilters,
    addAccount,
    updateAccount,
    deleteAccount,
    syncAccount,
    syncAllAccounts,
    handleExport,
    markAlertAsRead,
    dismissAlert
  } = useBankAccounts();

  const {
    statements,
    reconciliationItems,
    summary: reconciliationSummary,
    loading: reconciliationLoading,
    filters: reconciliationFilters,
    isProcessing,
    updateFilters: updateReconciliationFilters,
    uploadStatement,
    startReconciliation,
    resolveDiscrepancy,
    ignoreDiscrepancy,
    runAutoReconciliation,
    exportReconciliationReport
  } = useReconciliation();

  // State management
  const [activeTab, setActiveTab] = useState('accounts');
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<BankIntegrationProvider | null>(null);
  const [isAccountDetailDialogOpen, setIsAccountDetailDialogOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  
  // Provider connection states
  const [connectionStep, setConnectionStep] = useState(1);
  const [connectionData, setConnectionData] = useState<any>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [discoveredAccounts, setDiscoveredAccounts] = useState<any[]>([]);
  const [selectedAccountsToAdd, setSelectedAccountsToAdd] = useState<string[]>([]);

  // Reconciliation states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isReconciliationDetailOpen, setIsReconciliationDetailOpen] = useState(false);
  const [selectedReconciliationItem, setSelectedReconciliationItem] = useState<ReconciliationItem | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  // Stats cards configuration
  const STATS_CARDS = [
    {
      title: 'Total Accounts',
      value: stats.totalAccounts.toString(),
      change: '+2 this month',
      icon: <Landmark size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: Math.min(100, (stats.totalAccounts / 10) * 100)
    },
    {
      title: 'Connected Accounts',
      value: stats.connectedAccounts.toString(),
      change: `${((stats.connectedAccounts / stats.totalAccounts) * 100).toFixed(0)}% connected`,
      icon: <RefreshCw size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: (stats.connectedAccounts / stats.totalAccounts) * 100
    },
    {
      title: 'Total Balance',
      value: showBalances ? `$${(stats.totalBalance / 1000000).toFixed(1)}M` : '••••••',
      change: '+5.2% this month',
      icon: <Download size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: 85
    },
    {
      title: 'Available Balance',
      value: showBalances ? `$${(stats.totalAvailableBalance / 1000000).toFixed(1)}M` : '••••••',
      change: '+3.8% this month',
      icon: <AlertTriangle size={24} />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      progress: 78
    }
  ];

  const RECONCILIATION_STATS_CARDS = [
    {
      title: 'Pending Reconciliations',
      value: reconciliationSummary.pendingReconciliations.toString(),
      change: `${reconciliationSummary.totalStatements} total statements`,
      icon: <AlertCircle size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: reconciliationSummary.totalStatements > 0 ? 
        (reconciliationSummary.pendingReconciliations / reconciliationSummary.totalStatements) * 100 : 0
    },
    {
      title: 'Total Discrepancies',
      value: reconciliationSummary.totalDiscrepancies.toString(),
      change: `${reconciliationSummary.resolvedDiscrepancies} resolved`,
      icon: <AlertTriangle size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      progress: reconciliationSummary.totalDiscrepancies > 0 ? 
        (reconciliationSummary.resolvedDiscrepancies / reconciliationSummary.totalDiscrepancies) * 100 : 100
    },
    {
      title: 'Total Variance',
      value: `$${(reconciliationSummary.totalVariance / 1000).toFixed(1)}K`,
      change: 'Across all accounts',
      icon: <Download size={24} />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      progress: 65
    },
    {
      title: 'Accuracy Rate',
      value: `${reconciliationSummary.reconciliationAccuracy.toFixed(1)}%`,
      change: `${reconciliationSummary.averageReconciliationTime}h avg time`,
      icon: <CheckCircle size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: reconciliationSummary.reconciliationAccuracy
    }
  ];

  // Event handlers
  const handleViewAccountDetails = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsAccountDetailDialogOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setIsAddAccountDialogOpen(true);
  };

  const handleDeleteAccount = async (account: BankAccount) => {
    if (confirm(`Are you sure you want to delete ${account.accountName}?`)) {
      await deleteAccount(account.id);
    }
  };

  const handleConnectProvider = (provider: BankIntegrationProvider) => {
    setSelectedProvider(provider);
    setConnectionStep(1);
    setConnectionData({});
    setConnectionError(null);
    setDiscoveredAccounts([]);
    setSelectedAccountsToAdd([]);
    setIsProviderDialogOpen(true);
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAccounts = [
        {
          id: 'discovered-1',
          name: 'Business Checking Account',
          accountNumber: '****1234',
          bankName: selectedProvider?.name === 'Plaid' ? 'Chase Bank' : 'Wells Fargo',
          accountType: 'checking',
          balance: 45000.50,
          currency: 'USD'
        },
        {
          id: 'discovered-2',
          name: 'Savings Account',
          accountNumber: '****5678',
          bankName: selectedProvider?.name === 'Plaid' ? 'Chase Bank' : 'Wells Fargo',
          accountType: 'savings',
          balance: 125000.00,
          currency: 'USD'
        }
      ];
      
      setDiscoveredAccounts(mockAccounts);
      setConnectionStep(3);
    } catch (error) {
      setConnectionError('Failed to connect to your bank. Please check your credentials and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddSelectedAccounts = async () => {
    setIsConnecting(true);
    
    try {
      for (const accountId of selectedAccountsToAdd) {
        const discoveredAccount = discoveredAccounts.find(acc => acc.id === accountId);
        if (discoveredAccount) {
          const newAccount = {
            accountName: discoveredAccount.name,
            accountNumber: discoveredAccount.accountNumber.replace('****', Math.random().toString().slice(2, 10)),
            accountType: discoveredAccount.accountType as any,
            bankName: discoveredAccount.bankName,
            bankCode: selectedProvider?.id.toUpperCase() || 'BANK',
            currency: discoveredAccount.currency,
            balance: discoveredAccount.balance,
            availableBalance: discoveredAccount.balance,
            country: 'US',
            region: 'domestic' as const,
            status: 'active' as const,
            connectionStatus: 'connected' as const,
            isDefault: false,
            features: {
              realTimeSync: true,
              transactionHistory: true,
              balanceInquiry: true,
              transferSupport: true,
              billPayment: false
            }
          };
          
          await addAccount(newAccount);
        }
      }
      
      setIsProviderDialogOpen(false);
      setConnectionStep(1);
      setConnectionData({});
      setSelectedAccountsToAdd([]);
      setDiscoveredAccounts([]);
    } catch (error) {
      setConnectionError('Failed to add accounts. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const accountData = {
      accountName: formData.get('accountName') as string,
      accountNumber: formData.get('accountNumber') as string,
      accountType: formData.get('accountType') as 'checking' | 'savings' | 'business' | 'credit' | 'investment',
      bankName: formData.get('bankName') as string,
      bankCode: formData.get('bankCode') as string,
      swiftCode: formData.get('swiftCode') as string,
      iban: formData.get('iban') as string,
      routingNumber: formData.get('routingNumber') as string,
      sortCode: formData.get('sortCode') as string,
      bsb: formData.get('bsb') as string,
      ifsc: formData.get('ifsc') as string,
      branchCode: formData.get('branchCode') as string,
      currency: formData.get('currency') as string,
      balance: Number(formData.get('balance')),
      availableBalance: Number(formData.get('availableBalance')),
      country: formData.get('country') as string,
      region: formData.get('region') as 'domestic' | 'international',
      status: formData.get('status') as 'active' | 'inactive' | 'pending' | 'suspended' | 'closed',
      connectionStatus: 'disconnected' as const,
      isDefault: formData.get('isDefault') === 'on',
      bankWebsite: formData.get('bankWebsite') as string,
      features: {
        realTimeSync: formData.get('realTimeSync') === 'on',
        transactionHistory: formData.get('transactionHistory') === 'on',
        balanceInquiry: formData.get('balanceInquiry') === 'on',
        transferSupport: formData.get('transferSupport') === 'on',
        billPayment: formData.get('billPayment') === 'on'
      },
      limits: {
        dailyTransferLimit: Number(formData.get('dailyTransferLimit')) || undefined,
        monthlyTransferLimit: Number(formData.get('monthlyTransferLimit')) || undefined,
        minimumBalance: Number(formData.get('minimumBalance')) || undefined
      },
      fees: {
        monthlyFee: Number(formData.get('monthlyFee')) || undefined,
        transactionFee: Number(formData.get('transactionFee')) || undefined,
        internationalTransferFee: Number(formData.get('internationalTransferFee')) || undefined
      }
    };

    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, accountData);
      } else {
        await addAccount(accountData);
      }
      setIsAddAccountDialogOpen(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(file);
  };

  const handleUploadStatement = async () => {
    if (!uploadingFile || !selectedAccount) return;
    
    try {
      await uploadStatement(uploadingFile, selectedAccount.id);
      setIsUploadDialogOpen(false);
      setUploadingFile(null);
    } catch (error) {
      console.error('Error uploading statement:', error);
    }
  };

  const handleViewReconciliationDetails = (item: ReconciliationItem) => {
    setSelectedReconciliationItem(item);
    setIsReconciliationDetailOpen(true);
  };

  if (loading || reconciliationLoading) {
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
            <Landmark size={28} className="mr-3 text-blue-600" />
            Bank Account Integration
          </h1>
          <p className="text-gray-600 mt-1">Connect and manage bank accounts from around the world</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            size="sm"
          >
            {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2">{showBalances ? 'Hide' : 'Show'} Balances</span>
          </Button>
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={syncAllAccounts}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                Sync All
              </>
            )}
          </Button>
          <Button onClick={() => {
            setEditingAccount(null);
            setIsAddAccountDialogOpen(true);
          }}>
            <Plus size={16} className="mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.isRead).length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle size={20} className="mr-2" />
              Account Alerts ({alerts.filter(alert => !alert.isRead).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.filter(alert => !alert.isRead).slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm opacity-80">{alert.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(activeTab === 'reconciliation' ? RECONCILIATION_STATS_CARDS : STATS_CARDS).map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accounts">My Accounts</TabsTrigger>
              <TabsTrigger value="providers">Integration Providers</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="accounts" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search accounts..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value as any })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Account Name</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                    <SelectItem value="lastSync">Last Sync</SelectItem>
                    <SelectItem value="created">Date Added</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter size={16} className="mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Accounts Grid */}
              <div className="grid gap-6">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    showBalances={showBalances}
                    isSyncing={isSyncing}
                    onViewDetails={handleViewAccountDetails}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                    onSync={syncAccount}
                  />
                ))}
              </div>

              {accounts.length === 0 && (
                <div className="text-center py-12">
                  <Landmark size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bank accounts connected</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first bank account</p>
                  <Button onClick={() => {
                    setEditingAccount(null);
                    setIsAddAccountDialogOpen(true);
                  }}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Account
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="providers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onConnect={handleConnectProvider}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-6">
              {/* Reconciliation Header Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload size={16} className="mr-2" />
                    Upload Statement
                  </Button>
                  <Button variant="outline">
                    <Settings size={16} className="mr-2" />
                    Manage Rules
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={reconciliationFilters.dateRange} 
                    onValueChange={(value) => updateReconciliationFilters({ dateRange: value })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bank Statements Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck size={20} />
                    Bank Statements
                  </CardTitle>
                  <CardDescription>
                    Upload and manage bank statements for reconciliation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statements.map((statement) => (
                      <StatementCard
                        key={statement.id}
                        statement={statement}
                        account={accounts.find(acc => acc.id === statement.accountId)}
                        isProcessing={isProcessing}
                        onStartReconciliation={startReconciliation}
                        onRunAutoReconciliation={runAutoReconciliation}
                        onExportReport={exportReconciliationReport}
                      />
                    ))}
                    
                    {statements.length === 0 && (
                      <div className="text-center py-8">
                        <FileCheck size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No statements uploaded</h3>
                        <p className="text-gray-500 mb-4">Upload your first bank statement to start reconciliation</p>
                        <Button onClick={() => setIsUploadDialogOpen(true)}>
                          <Upload size={16} className="mr-2" />
                          Upload Statement
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Discrepancies Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    Reconciliation Discrepancies
                  </CardTitle>
                  <CardDescription>
                    Review and resolve discrepancies found during reconciliation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search discrepancies..."
                        value={reconciliationFilters.search}
                        onChange={(e) => updateReconciliationFilters({ search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    <Select 
                      value={reconciliationFilters.status[0] || 'all'} 
                      onValueChange={(value) => updateReconciliationFilters({ 
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
                  </div>

                  <div className="space-y-4">
                    {reconciliationItems.map((item) => (
                      <ReconciliationCard
                        key={item.id}
                        item={item}
                        onViewDetails={handleViewReconciliationDetails}
                        onResolve={resolveDiscrepancy}
                        onIgnore={ignoreDiscrepancy}
                      />
                    ))}
                    
                    {reconciliationItems.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No discrepancies found</h3>
                        <p className="text-gray-500">All transactions have been successfully reconciled</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Add Account Dialog */}
      <AddAccountDialog
        isOpen={isAddAccountDialogOpen}
        onClose={() => {
          setIsAddAccountDialogOpen(false);
          setEditingAccount(null);
        }}
        editingAccount={editingAccount}
        onSubmit={handleSubmitAccount}
      />

      {/* Account Detail Dialog */}
      <AccountDetailDialog
        isOpen={isAccountDetailDialogOpen}
        onClose={() => setIsAccountDetailDialogOpen(false)}
        account={selectedAccount}
        onEdit={handleEditAccount}
      />

      {/* Provider Connection Dialog */}
      <ProviderConnectionDialog
        isOpen={isProviderDialogOpen}
        onClose={() => setIsProviderDialogOpen(false)}
        provider={selectedProvider}
        connectionStep={connectionStep}
        connectionData={connectionData}
        connectionError={connectionError}
        discoveredAccounts={discoveredAccounts}
        selectedAccountsToAdd={selectedAccountsToAdd}
        isConnecting={isConnecting}
        onNextStep={() => setConnectionStep(prev => prev + 1)}
        onPrevStep={() => setConnectionStep(prev => prev - 1)}
        onConnectionDataChange={setConnectionData}
        onTestConnection={handleTestConnection}
        onAccountSelectionChange={(accountId, selected) => {
          if (selected) {
            setSelectedAccountsToAdd([...selectedAccountsToAdd, accountId]);
          } else {
            setSelectedAccountsToAdd(selectedAccountsToAdd.filter(id => id !== accountId));
          }
        }}
        onAddSelectedAccounts={handleAddSelectedAccounts}
        onManualAdd={() => {
          setIsProviderDialogOpen(false);
          setEditingAccount(null);
          setIsAddAccountDialogOpen(true);
        }}
      />

      {/* Upload Statement Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Bank Statement</DialogTitle>
            <DialogDescription>
              Upload a bank statement file for reconciliation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account">Select Account</Label>
              <Select onValueChange={(value) => setSelectedAccount(accounts.find(acc => acc.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountName} - {account.bankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Statement File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-gray-500">
                Supported formats: PDF, CSV, Excel (.xlsx, .xls)
              </p>
            </div>
            {uploadingFile && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>File:</strong> {uploadingFile.name}<br />
                  <strong>Size:</strong> {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadStatement}
              disabled={!uploadingFile || !selectedAccount || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccountsPage;