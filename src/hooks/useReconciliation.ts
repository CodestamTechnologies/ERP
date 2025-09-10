'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ReconciliationItem,
  ReconciliationStatement,
  ReconciliationRule,
  ReconciliationSummary,
  BankStatementTransaction,
  BookTransaction,
  ReconciliationMatch,
  ReconciliationFilters,
  BankAccount
} from '@/types/bankAccount';

// Mock data for demonstration
const MOCK_RECONCILIATION_STATEMENTS: ReconciliationStatement[] = [
  {
    id: 'stmt-001',
    accountId: 'acc-001',
    statementDate: '2024-01-31',
    openingBalance: 120000.00,
    closingBalance: 125000.50,
    totalDebits: 45000.00,
    totalCredits: 50000.50,
    transactionCount: 156,
    status: 'completed',
    matchedTransactions: 142,
    unmatchedTransactions: 14,
    discrepancies: 3,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
    uploadedBy: 'John Doe',
    fileName: 'chase_statement_jan_2024.pdf',
    fileSize: 2048576
  },
  {
    id: 'stmt-002',
    accountId: 'acc-002',
    statementDate: '2024-01-31',
    openingBalance: 2450000.00,
    closingBalance: 2500000.00,
    totalDebits: 150000.00,
    totalCredits: 200000.00,
    transactionCount: 89,
    status: 'in_progress',
    matchedTransactions: 76,
    unmatchedTransactions: 13,
    discrepancies: 5,
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-01T14:20:00Z',
    uploadedBy: 'Jane Smith',
    fileName: 'hdfc_statement_jan_2024.csv',
    fileSize: 1024000
  },
  {
    id: 'stmt-003',
    accountId: 'acc-003',
    statementDate: '2024-01-31',
    openingBalance: 82000.75,
    closingBalance: 85000.75,
    totalDebits: 25000.00,
    totalCredits: 28000.00,
    transactionCount: 67,
    status: 'pending',
    matchedTransactions: 0,
    unmatchedTransactions: 67,
    discrepancies: 0,
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2024-02-01T11:30:00Z',
    uploadedBy: 'Mike Johnson',
    fileName: 'deutsche_statement_jan_2024.xlsx',
    fileSize: 3072000
  }
];

const MOCK_RECONCILIATION_ITEMS: ReconciliationItem[] = [
  {
    id: 'recon-001',
    accountId: 'acc-001',
    transactionId: 'txn-001',
    type: 'amount_mismatch',
    description: 'Payment to Vendor ABC - Amount discrepancy',
    expectedAmount: 5000.00,
    actualAmount: 5050.00,
    expectedDate: '2024-01-15',
    actualDate: '2024-01-15',
    status: 'pending',
    priority: 'high',
    category: 'Vendor Payments',
    reference: 'INV-2024-001',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 'recon-002',
    accountId: 'acc-001',
    transactionId: 'txn-002',
    type: 'missing_transaction',
    description: 'Bank fee not recorded in books',
    actualAmount: 25.00,
    actualDate: '2024-01-20',
    status: 'pending',
    priority: 'medium',
    category: 'Bank Charges',
    reference: 'BANK-FEE-001',
    createdAt: '2024-02-01T09:20:00Z',
    updatedAt: '2024-02-01T09:20:00Z'
  },
  {
    id: 'recon-003',
    accountId: 'acc-002',
    transactionId: 'txn-003',
    type: 'date_mismatch',
    description: 'Customer payment - Date discrepancy',
    expectedAmount: 15000.00,
    actualAmount: 15000.00,
    expectedDate: '2024-01-18',
    actualDate: '2024-01-19',
    status: 'resolved',
    resolvedBy: 'Jane Smith',
    resolvedAt: '2024-02-01T14:00:00Z',
    notes: 'Confirmed with customer - payment processed on 19th due to weekend',
    priority: 'low',
    category: 'Customer Payments',
    reference: 'CUST-PAY-045',
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-01T14:00:00Z'
  },
  {
    id: 'recon-004',
    accountId: 'acc-001',
    transactionId: 'txn-004',
    type: 'duplicate_transaction',
    description: 'Duplicate entry for office rent payment',
    expectedAmount: 8000.00,
    actualAmount: 8000.00,
    expectedDate: '2024-01-01',
    actualDate: '2024-01-01',
    status: 'pending',
    priority: 'critical',
    category: 'Office Expenses',
    reference: 'RENT-JAN-2024',
    createdAt: '2024-02-01T09:45:00Z',
    updatedAt: '2024-02-01T09:45:00Z'
  },
  {
    id: 'recon-005',
    accountId: 'acc-002',
    transactionId: 'txn-005',
    type: 'unmatched_bank',
    description: 'Unknown deposit in bank statement',
    actualAmount: 2500.00,
    actualDate: '2024-01-25',
    status: 'pending',
    priority: 'high',
    category: 'Unknown',
    reference: 'UNK-DEP-001',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z'
  }
];

const MOCK_RECONCILIATION_RULES: ReconciliationRule[] = [
  {
    id: 'rule-001',
    name: 'Auto-match exact amounts and dates',
    description: 'Automatically match transactions with identical amounts and dates',
    conditions: [
      { field: 'amount', operator: 'equals', value: 0 },
      { field: 'date', operator: 'equals', value: '' }
    ],
    actions: [
      { type: 'auto_match' }
    ],
    isActive: true,
    priority: 1,
    matchCount: 1247,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'rule-002',
    name: 'Categorize bank fees',
    description: 'Automatically categorize transactions containing "BANK FEE" or "SERVICE CHARGE"',
    conditions: [
      { field: 'description', operator: 'contains', value: 'BANK FEE' }
    ],
    actions: [
      { type: 'categorize', value: 'Bank Charges' }
    ],
    isActive: true,
    priority: 2,
    matchCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rule-003',
    name: 'Flag large transactions',
    description: 'Flag transactions over $10,000 for manual review',
    conditions: [
      { field: 'amount', operator: 'greater_than', value: 10000 }
    ],
    actions: [
      { type: 'flag', value: 'Large Transaction' }
    ],
    isActive: true,
    priority: 3,
    matchCount: 23,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const MOCK_BANK_STATEMENT_TRANSACTIONS: BankStatementTransaction[] = [
  {
    id: 'bank-txn-001',
    date: '2024-01-15',
    description: 'PAYMENT TO VENDOR ABC',
    reference: 'TXN123456',
    debit: 5050.00,
    balance: 119950.00,
    category: 'Vendor Payments',
    isMatched: false,
    matchConfidence: 85
  },
  {
    id: 'bank-txn-002',
    date: '2024-01-20',
    description: 'BANK SERVICE CHARGE',
    reference: 'FEE789',
    debit: 25.00,
    balance: 119925.00,
    category: 'Bank Charges',
    isMatched: false
  },
  {
    id: 'bank-txn-003',
    date: '2024-01-19',
    description: 'CUSTOMER PAYMENT - ABC CORP',
    reference: 'DEP456789',
    credit: 15000.00,
    balance: 134925.00,
    category: 'Customer Payments',
    isMatched: true,
    matchedTransactionId: 'book-txn-003',
    matchConfidence: 95
  }
];

const MOCK_BOOK_TRANSACTIONS: BookTransaction[] = [
  {
    id: 'book-txn-001',
    date: '2024-01-15',
    description: 'Payment to Vendor ABC - Invoice INV-2024-001',
    reference: 'INV-2024-001',
    amount: 5000.00,
    type: 'debit',
    category: 'Vendor Payments',
    isMatched: false,
    matchConfidence: 85
  },
  {
    id: 'book-txn-002',
    date: '2024-01-18',
    description: 'Customer Payment - ABC Corp',
    reference: 'CUST-PAY-045',
    amount: 15000.00,
    type: 'credit',
    category: 'Customer Payments',
    isMatched: true,
    matchedStatementId: 'bank-txn-003',
    matchConfidence: 95
  }
];

export const useReconciliation = () => {
  const [statements, setStatements] = useState<ReconciliationStatement[]>([]);
  const [reconciliationItems, setReconciliationItems] = useState<ReconciliationItem[]>([]);
  const [rules, setRules] = useState<ReconciliationRule[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankStatementTransaction[]>([]);
  const [bookTransactions, setBookTransactions] = useState<BookTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReconciliationFilters>({
    search: '',
    accountId: [],
    status: [],
    type: [],
    priority: [],
    dateRange: '30days',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatements(MOCK_RECONCILIATION_STATEMENTS);
      setReconciliationItems(MOCK_RECONCILIATION_ITEMS);
      setRules(MOCK_RECONCILIATION_RULES);
      setBankTransactions(MOCK_BANK_STATEMENT_TRANSACTIONS);
      setBookTransactions(MOCK_BOOK_TRANSACTIONS);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const summary = useMemo((): ReconciliationSummary => {
    const totalStatements = statements.length;
    const pendingReconciliations = statements.filter(s => s.status === 'pending' || s.status === 'in_progress').length;
    const completedReconciliations = statements.filter(s => s.status === 'completed').length;
    const totalDiscrepancies = reconciliationItems.length;
    const resolvedDiscrepancies = reconciliationItems.filter(item => item.status === 'resolved').length;
    const pendingDiscrepancies = reconciliationItems.filter(item => item.status === 'pending').length;
    
    const totalVariance = reconciliationItems.reduce((sum, item) => {
      if (item.expectedAmount && item.actualAmount) {
        return sum + Math.abs(item.expectedAmount - item.actualAmount);
      }
      return sum + (item.actualAmount || item.expectedAmount || 0);
    }, 0);

    const averageReconciliationTime = 4.5; // Mock average in hours
    const lastReconciliationDate = statements.length > 0 ? 
      statements.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt : 
      undefined;
    
    const reconciliationAccuracy = totalDiscrepancies > 0 ? 
      (resolvedDiscrepancies / totalDiscrepancies) * 100 : 100;

    return {
      totalStatements,
      pendingReconciliations,
      completedReconciliations,
      totalDiscrepancies,
      resolvedDiscrepancies,
      pendingDiscrepancies,
      totalVariance,
      averageReconciliationTime,
      lastReconciliationDate,
      reconciliationAccuracy
    };
  }, [statements, reconciliationItems]);

  // Filter reconciliation items
  const filteredItems = useMemo(() => {
    return reconciliationItems.filter(item => {
      const matchesSearch = filters.search === '' || 
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.reference && item.reference.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesAccount = filters.accountId.length === 0 || 
        filters.accountId.includes(item.accountId);
      
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(item.status);
      
      const matchesType = filters.type.length === 0 || 
        filters.type.includes(item.type);
      
      const matchesPriority = filters.priority.length === 0 || 
        filters.priority.includes(item.priority);

      return matchesSearch && matchesAccount && matchesStatus && matchesType && matchesPriority;
    }).sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (filters.sortBy) {
        case 'amount':
          aValue = a.actualAmount || a.expectedAmount || 0;
          bValue = b.actualAmount || b.expectedAmount || 0;
          break;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // date
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
  }, [reconciliationItems, filters]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<ReconciliationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const uploadStatement = useCallback(async (file: File, accountId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newStatement: ReconciliationStatement = {
        id: `stmt-${Date.now()}`,
        accountId,
        statementDate: new Date().toISOString().split('T')[0],
        openingBalance: Math.random() * 100000,
        closingBalance: Math.random() * 100000,
        totalDebits: Math.random() * 50000,
        totalCredits: Math.random() * 50000,
        transactionCount: Math.floor(Math.random() * 100) + 20,
        status: 'pending',
        matchedTransactions: 0,
        unmatchedTransactions: Math.floor(Math.random() * 100) + 20,
        discrepancies: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedBy: 'Current User',
        fileName: file.name,
        fileSize: file.size
      };
      
      setStatements(prev => [newStatement, ...prev]);
    } catch (error) {
      console.error('Error uploading statement:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const startReconciliation = useCallback(async (statementId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate reconciliation process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      setStatements(prev => prev.map(stmt => 
        stmt.id === statementId ? {
          ...stmt,
          status: 'in_progress',
          updatedAt: new Date().toISOString()
        } : stmt
      ));
      
      // Simulate finding discrepancies
      setTimeout(() => {
        setStatements(prev => prev.map(stmt => 
          stmt.id === statementId ? {
            ...stmt,
            status: 'completed',
            matchedTransactions: stmt.transactionCount - 5,
            unmatchedTransactions: 5,
            discrepancies: 3,
            updatedAt: new Date().toISOString()
          } : stmt
        ));
      }, 3000);
      
    } catch (error) {
      console.error('Error starting reconciliation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const resolveDiscrepancy = useCallback(async (itemId: string, resolution: string, notes?: string) => {
    setReconciliationItems(prev => prev.map(item => 
      item.id === itemId ? {
        ...item,
        status: 'resolved',
        resolvedBy: 'Current User',
        resolvedAt: new Date().toISOString(),
        notes: notes || resolution,
        updatedAt: new Date().toISOString()
      } : item
    ));
  }, []);

  const ignoreDiscrepancy = useCallback(async (itemId: string, reason?: string) => {
    setReconciliationItems(prev => prev.map(item => 
      item.id === itemId ? {
        ...item,
        status: 'ignored',
        notes: reason || 'Ignored by user',
        updatedAt: new Date().toISOString()
      } : item
    ));
  }, []);

  const createRule = useCallback(async (rule: Omit<ReconciliationRule, 'id' | 'matchCount' | 'createdAt' | 'updatedAt'>) => {
    const newRule: ReconciliationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      matchCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setRules(prev => [newRule, ...prev]);
  }, []);

  const updateRule = useCallback(async (ruleId: string, updates: Partial<ReconciliationRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? {
        ...rule,
        ...updates,
        updatedAt: new Date().toISOString()
      } : rule
    ));
  }, []);

  const deleteRule = useCallback(async (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  const runAutoReconciliation = useCallback(async (statementId: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate auto-reconciliation process
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Update statement with auto-match results
      setStatements(prev => prev.map(stmt => 
        stmt.id === statementId ? {
          ...stmt,
          matchedTransactions: stmt.matchedTransactions + 10,
          unmatchedTransactions: Math.max(0, stmt.unmatchedTransactions - 10),
          updatedAt: new Date().toISOString()
        } : stmt
      ));
      
    } catch (error) {
      console.error('Error running auto-reconciliation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportReconciliationReport = useCallback(async (statementId: string) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statement = statements.find(s => s.id === statementId);
    if (!statement) return;
    
    const csvContent = [
      'Date,Description,Reference,Bank Amount,Book Amount,Status,Variance',
      ...reconciliationItems
        .filter(item => item.accountId === statement.accountId)
        .map(item => [
          item.actualDate || item.expectedDate || '',
          `"${item.description}"`,
          item.reference || '',
          item.actualAmount || '',
          item.expectedAmount || '',
          item.status,
          item.actualAmount && item.expectedAmount ? 
            Math.abs(item.actualAmount - item.expectedAmount) : ''
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reconciliation_report_${statement.statementDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [statements, reconciliationItems]);

  return {
    // Data
    statements,
    reconciliationItems: filteredItems,
    allReconciliationItems: reconciliationItems,
    rules,
    bankTransactions,
    bookTransactions,
    summary,
    
    // State
    loading,
    filters,
    isProcessing,
    selectedStatement,
    
    // Actions
    updateFilters,
    uploadStatement,
    startReconciliation,
    resolveDiscrepancy,
    ignoreDiscrepancy,
    createRule,
    updateRule,
    deleteRule,
    runAutoReconciliation,
    exportReconciliationReport,
    setSelectedStatement
  };
};