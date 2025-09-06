'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BankAccount, 
  BankTransaction, 
  BankIntegrationProvider, 
  BankAccountStats, 
  BankAccountFilters, 
  BankAccountAlert,
  ReconciliationItem,
  BankConnectionConfig
} from '@/types/bankAccount';

// Mock data for demonstration
const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-001',
    accountName: 'Business Checking',
    accountNumber: '1234567890123456',
    accountType: 'checking',
    bankName: 'Chase Bank',
    bankCode: 'CHASUS33',
    swiftCode: 'CHASUS33XXX',
    routingNumber: '021000021',
    currency: 'USD',
    balance: 125000.50,
    availableBalance: 120000.50,
    country: 'US',
    region: 'domestic',
    status: 'active',
    connectionStatus: 'connected',
    lastSyncAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isDefault: true,
    bankLogo: '/images/banks/chase.png',
    bankWebsite: 'https://chase.com',
    contactInfo: {
      phone: '+1-800-935-9935',
      email: 'support@chase.com',
      address: '270 Park Avenue, New York, NY 10017'
    },
    features: {
      realTimeSync: true,
      transactionHistory: true,
      balanceInquiry: true,
      transferSupport: true,
      billPayment: true
    },
    limits: {
      dailyTransferLimit: 50000,
      monthlyTransferLimit: 500000,
      minimumBalance: 1000
    },
    fees: {
      monthlyFee: 25,
      transactionFee: 0.50,
      internationalTransferFee: 15
    }
  },
  {
    id: 'acc-002',
    accountName: 'Savings Account',
    accountNumber: '9876543210987654',
    accountType: 'savings',
    bankName: 'HDFC Bank',
    bankCode: 'HDFCINBB',
    swiftCode: 'HDFCINBBXXX',
    ifsc: 'HDFC0000123',
    currency: 'INR',
    balance: 2500000,
    availableBalance: 2500000,
    country: 'IN',
    region: 'international',
    status: 'active',
    connectionStatus: 'connected',
    lastSyncAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
    isDefault: false,
    bankLogo: '/images/banks/hdfc.png',
    bankWebsite: 'https://hdfcbank.com',
    contactInfo: {
      phone: '+91-22-6160-6161',
      email: 'support@hdfcbank.com',
      address: 'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013'
    },
    features: {
      realTimeSync: true,
      transactionHistory: true,
      balanceInquiry: true,
      transferSupport: true,
      billPayment: false
    },
    limits: {
      dailyTransferLimit: 1000000,
      monthlyTransferLimit: 10000000,
      minimumBalance: 10000
    },
    fees: {
      monthlyFee: 0,
      transactionFee: 5,
      internationalTransferFee: 500
    }
  },
  {
    id: 'acc-003',
    accountName: 'Euro Business Account',
    accountNumber: 'DE89370400440532013000',
    accountType: 'business',
    bankName: 'Deutsche Bank',
    bankCode: 'DEUTDEFF',
    swiftCode: 'DEUTDEFFXXX',
    iban: 'DE89370400440532013000',
    currency: 'EUR',
    balance: 85000.75,
    availableBalance: 82000.75,
    country: 'DE',
    region: 'international',
    status: 'active',
    connectionStatus: 'syncing',
    lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-05T14:20:00Z',
    isDefault: false,
    bankLogo: '/images/banks/deutsche.png',
    bankWebsite: 'https://db.com',
    contactInfo: {
      phone: '+49-69-910-00',
      email: 'service@db.com',
      address: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany'
    },
    features: {
      realTimeSync: false,
      transactionHistory: true,
      balanceInquiry: true,
      transferSupport: true,
      billPayment: true
    },
    limits: {
      dailyTransferLimit: 100000,
      monthlyTransferLimit: 1000000,
      minimumBalance: 5000
    },
    fees: {
      monthlyFee: 15,
      transactionFee: 1.50,
      internationalTransferFee: 25
    }
  },
  {
    id: 'acc-004',
    accountName: 'Investment Portfolio',
    accountNumber: 'GB29NWBK60161331926819',
    accountType: 'investment',
    bankName: 'NatWest',
    bankCode: 'NWBKGB2L',
    swiftCode: 'NWBKGB2LXXX',
    iban: 'GB29NWBK60161331926819',
    sortCode: '601613',
    currency: 'GBP',
    balance: 45000.25,
    availableBalance: 40000.25,
    country: 'GB',
    region: 'international',
    status: 'active',
    connectionStatus: 'error',
    lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-12-20T11:45:00Z',
    updatedAt: '2023-12-20T11:45:00Z',
    isDefault: false,
    bankLogo: '/images/banks/natwest.png',
    bankWebsite: 'https://natwest.com',
    contactInfo: {
      phone: '+44-345-788-8444',
      email: 'support@natwest.com',
      address: '250 Bishopsgate, London EC2M 4AA, United Kingdom'
    },
    features: {
      realTimeSync: false,
      transactionHistory: true,
      balanceInquiry: true,
      transferSupport: false,
      billPayment: false
    },
    limits: {
      dailyTransferLimit: 25000,
      monthlyTransferLimit: 250000,
      minimumBalance: 1000
    },
    fees: {
      monthlyFee: 20,
      transactionFee: 2.00,
      internationalTransferFee: 30
    }
  },
  {
    id: 'acc-005',
    accountName: 'Credit Line',
    accountNumber: '4532015112830366',
    accountType: 'credit',
    bankName: 'American Express',
    bankCode: 'AEIBUS33',
    swiftCode: 'AEIBUS33XXX',
    currency: 'USD',
    balance: -15000.00,
    availableBalance: 35000.00,
    country: 'US',
    region: 'domestic',
    status: 'active',
    connectionStatus: 'disconnected',
    lastSyncAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-11-30T16:30:00Z',
    updatedAt: '2023-11-30T16:30:00Z',
    isDefault: false,
    bankLogo: '/images/banks/amex.png',
    bankWebsite: 'https://americanexpress.com',
    contactInfo: {
      phone: '+1-800-528-4800',
      email: 'support@americanexpress.com',
      address: '200 Vesey Street, New York, NY 10285'
    },
    features: {
      realTimeSync: true,
      transactionHistory: true,
      balanceInquiry: true,
      transferSupport: false,
      billPayment: true
    },
    limits: {
      dailyTransferLimit: 0,
      monthlyTransferLimit: 0,
      minimumBalance: -50000
    },
    fees: {
      monthlyFee: 0,
      transactionFee: 0,
      internationalTransferFee: 0
    }
  }
];

const MOCK_INTEGRATION_PROVIDERS: BankIntegrationProvider[] = [
  {
    id: 'plaid',
    name: 'Plaid',
    logo: '/images/providers/plaid.png',
    description: 'Connect to 11,000+ banks and credit unions across North America',
    supportedCountries: ['US', 'CA'],
    supportedBanks: ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Capital One', 'TD Bank', 'RBC', 'BMO'],
    features: ['Real-time balance', 'Transaction history', 'Account verification', 'Payment initiation'],
    connectionType: 'api',
    isActive: true,
    setupComplexity: 'easy',
    cost: 'paid',
    documentation: 'https://plaid.com/docs'
  },
  {
    id: 'yodlee',
    name: 'Yodlee',
    logo: '/images/providers/yodlee.png',
    description: 'Global financial data aggregation with 17,000+ supported institutions',
    supportedCountries: ['US', 'CA', 'GB', 'AU', 'IN'],
    supportedBanks: ['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Barclays', 'HSBC', 'Lloyds', 'ANZ'],
    features: ['Account aggregation', 'Transaction categorization', 'Risk assessment', 'Fraud detection'],
    connectionType: 'api',
    isActive: true,
    setupComplexity: 'medium',
    cost: 'premium',
    documentation: 'https://developer.yodlee.com'
  },
  {
    id: 'open_banking_eu',
    name: 'Open Banking EU',
    logo: '/images/providers/openbanking.png',
    description: 'PSD2 compliant open banking integration for European banks',
    supportedCountries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'SE', 'DK', 'NO'],
    supportedBanks: ['Deutsche Bank', 'BNP Paribas', 'Santander', 'ING', 'UniCredit', 'Nordea'],
    features: ['Account information', 'Payment initiation', 'Balance check', 'Transaction history'],
    connectionType: 'open_banking',
    isActive: true,
    setupComplexity: 'complex',
    cost: 'free',
    documentation: 'https://openbanking.eu/docs'
  },
  {
    id: 'saltedge',
    name: 'Salt Edge',
    logo: '/images/providers/saltedge.png',
    description: 'Connect to 5000+ banks worldwide with comprehensive coverage',
    supportedCountries: ['GB', 'DE', 'FR', 'IT', 'ES', 'PL', 'RO', 'BG', 'CZ', 'HU', 'SK', 'SI', 'HR', 'EE', 'LV', 'LT'],
    supportedBanks: ['Revolut', 'N26', 'Monzo', 'Starling Bank', 'Wise', 'Bunq'],
    features: ['Account aggregation', 'Payment initiation', 'Categorization', 'Duplicate detection'],
    connectionType: 'api',
    isActive: true,
    setupComplexity: 'medium',
    cost: 'paid',
    documentation: 'https://docs.saltedge.com'
  },
  {
    id: 'finicity',
    name: 'Finicity',
    logo: '/images/providers/finicity.png',
    description: 'Mastercard-powered financial data platform',
    supportedCountries: ['US', 'CA'],
    supportedBanks: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'US Bank', 'PNC Bank'],
    features: ['Open banking', 'Account verification', 'Income verification', 'Asset verification'],
    connectionType: 'api',
    isActive: true,
    setupComplexity: 'easy',
    cost: 'paid',
    documentation: 'https://docs.finicity.com'
  },
  {
    id: 'manual',
    name: 'Manual Entry',
    logo: '/images/providers/manual.png',
    description: 'Manually add and manage bank accounts without API integration',
    supportedCountries: ['*'],
    supportedBanks: ['Any Bank'],
    features: ['Manual balance updates', 'Transaction import', 'CSV upload', 'Basic reconciliation'],
    connectionType: 'manual',
    isActive: true,
    setupComplexity: 'easy',
    cost: 'free',
    documentation: '/docs/manual-integration'
  }
];

const MOCK_ALERTS: BankAccountAlert[] = [
  {
    id: 'alert-001',
    accountId: 'acc-004',
    type: 'sync_error',
    title: 'Sync Error',
    message: 'Unable to sync NatWest Investment Portfolio. Please check connection.',
    severity: 'high',
    isRead: false,
    actionRequired: true,
    actionUrl: '/finance/bank-accounts/acc-004',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alert-002',
    accountId: 'acc-005',
    type: 'connection_lost',
    title: 'Connection Lost',
    message: 'American Express Credit Line has been disconnected for 7 days.',
    severity: 'medium',
    isRead: false,
    actionRequired: true,
    actionUrl: '/finance/bank-accounts/acc-005',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alert-003',
    accountId: 'acc-002',
    type: 'low_balance',
    title: 'Balance Alert',
    message: 'HDFC Savings Account balance is approaching minimum threshold.',
    severity: 'low',
    isRead: true,
    actionRequired: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [providers, setProviders] = useState<BankIntegrationProvider[]>([]);
  const [alerts, setAlerts] = useState<BankAccountAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BankAccountFilters>({
    search: '',
    accountType: [],
    status: [],
    country: [],
    region: [],
    currency: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate API call
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAccounts(MOCK_BANK_ACCOUNTS);
      setProviders(MOCK_INTEGRATION_PROVIDERS);
      setAlerts(MOCK_ALERTS);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate statistics
  const stats = useMemo((): BankAccountStats => {
    const totalAccounts = accounts.length;
    const connectedAccounts = accounts.filter(acc => acc.connectionStatus === 'connected').length;
    
    // Convert all balances to USD for totals (simplified conversion)
    const totalBalance = accounts.reduce((sum, acc) => {
      const rate = acc.currency === 'USD' ? 1 : acc.currency === 'EUR' ? 1.1 : acc.currency === 'GBP' ? 1.25 : acc.currency === 'INR' ? 0.012 : 0.85;
      return sum + (acc.balance * rate);
    }, 0);
    
    const totalAvailableBalance = accounts.reduce((sum, acc) => {
      const rate = acc.currency === 'USD' ? 1 : acc.currency === 'EUR' ? 1.1 : acc.currency === 'GBP' ? 1.25 : acc.currency === 'INR' ? 0.012 : 0.85;
      return sum + (acc.availableBalance * rate);
    }, 0);

    const accountsByType = accounts.reduce((acc, account) => {
      acc[account.accountType] = (acc[account.accountType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const accountsByCountry = accounts.reduce((acc, account) => {
      acc[account.country] = (acc[account.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const accountsByStatus = accounts.reduce((acc, account) => {
      acc[account.status] = (acc[account.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentTransactions = 156; // Mock data
    const pendingReconciliations = 12; // Mock data

    return {
      totalAccounts,
      connectedAccounts,
      totalBalance,
      totalAvailableBalance,
      accountsByType,
      accountsByCountry,
      accountsByStatus,
      recentTransactions,
      pendingReconciliations
    };
  }, [accounts]);

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = filters.search === '' || 
        account.accountName.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.bankName.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.accountNumber.includes(filters.search);
      
      const matchesType = filters.accountType.length === 0 || 
        filters.accountType.includes(account.accountType);
      
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(account.status);
      
      const matchesCountry = filters.country.length === 0 || 
        filters.country.includes(account.country);
      
      const matchesRegion = filters.region.length === 0 || 
        filters.region.includes(account.region);
      
      const matchesCurrency = filters.currency.length === 0 || 
        filters.currency.includes(account.currency);

      return matchesSearch && matchesType && matchesStatus && 
             matchesCountry && matchesRegion && matchesCurrency;
    }).sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (filters.sortBy) {
        case 'balance':
          aValue = a.balance;
          bValue = b.balance;
          break;
        case 'lastSync':
          aValue = a.lastSyncAt ? new Date(a.lastSyncAt).getTime() : 0;
          bValue = b.lastSyncAt ? new Date(b.lastSyncAt).getTime() : 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default: // name
          aValue = a.accountName.toLowerCase();
          bValue = b.accountName.toLowerCase();
      }
      
      if (typeof aValue === 'string') {
        return filters.sortOrder === 'asc' ? 
          aValue.localeCompare(bValue as string) : 
          (bValue as string).localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc' ? 
          (aValue as number) - (bValue as number) : 
          (bValue as number) - (aValue as number);
      }
    });
  }, [accounts, filters]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<BankAccountFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const addAccount = useCallback(async (accountData: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: BankAccount = {
      ...accountData,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAccounts(prev => [...prev, newAccount]);
  }, []);

  const updateAccount = useCallback(async (id: string, updates: Partial<BankAccount>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates, updatedAt: new Date().toISOString() } : account
    ));
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  }, []);

  const syncAccount = useCallback(async (id: string) => {
    setIsSyncing(true);
    // Update account status to syncing
    setAccounts(prev => prev.map(account => 
      account.id === id ? { 
        ...account, 
        connectionStatus: 'syncing',
        updatedAt: new Date().toISOString()
      } : account
    ));

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update account with new sync time and status
    setAccounts(prev => prev.map(account => 
      account.id === id ? { 
        ...account, 
        connectionStatus: 'connected',
        lastSyncAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : account
    ));
    setIsSyncing(false);
  }, []);

  const syncAllAccounts = useCallback(async () => {
    setIsSyncing(true);
    const connectedAccounts = accounts.filter(acc => acc.connectionStatus === 'connected' || acc.connectionStatus === 'error');
    
    for (const account of connectedAccounts) {
      await syncAccount(account.id);
    }
    setIsSyncing(false);
  }, [accounts, syncAccount]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would generate and download the CSV
    const csvContent = [
      'Account Name,Bank Name,Account Type,Currency,Balance,Status,Country',
      ...filteredAccounts.map(acc => 
        `"${acc.accountName}","${acc.bankName}","${acc.accountType}","${acc.currency}",${acc.balance},"${acc.status}","${acc.country}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_accounts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  }, [filteredAccounts]);

  const connectProvider = useCallback(async (providerId: string, config: BankConnectionConfig) => {
    // Simulate provider connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would make API calls to the provider
    console.log('Connecting to provider:', providerId, config);
  }, []);

  const disconnectAccount = useCallback(async (id: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { 
        ...account, 
        connectionStatus: 'disconnected',
        updatedAt: new Date().toISOString()
      } : account
    ));
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  return {
    // Data
    accounts: filteredAccounts,
    allAccounts: accounts,
    providers,
    alerts,
    stats,
    
    // State
    loading,
    filters,
    isExporting,
    isSyncing,
    
    // Actions
    updateFilters,
    addAccount,
    updateAccount,
    deleteAccount,
    syncAccount,
    syncAllAccounts,
    handleExport,
    connectProvider,
    disconnectAccount,
    markAlertAsRead,
    dismissAlert
  };
};