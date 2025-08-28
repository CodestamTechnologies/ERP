export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'credit' | 'investment';
  bankName: string;
  bankCode: string;
  swiftCode?: string;
  iban?: string;
  routingNumber?: string;
  sortCode?: string;
  bsb?: string; // Australia
  ifsc?: string; // India
  branchCode?: string;
  currency: string;
  balance: number;
  availableBalance: number;
  country: string;
  region: 'domestic' | 'international';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'closed';
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  bankLogo?: string;
  bankWebsite?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  features: {
    realTimeSync: boolean;
    transactionHistory: boolean;
    balanceInquiry: boolean;
    transferSupport: boolean;
    billPayment: boolean;
  };
  limits?: {
    dailyTransferLimit?: number;
    monthlyTransferLimit?: number;
    minimumBalance?: number;
  };
  fees?: {
    monthlyFee?: number;
    transactionFee?: number;
    internationalTransferFee?: number;
  };
}

export interface BankTransaction {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  category?: string;
  date: string;
  balanceAfter: number;
  reference: string;
  counterparty?: {
    name: string;
    accountNumber?: string;
    bankName?: string;
  };
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  tags: string[];
  isReconciled: boolean;
  createdAt: string;
}

export interface BankIntegrationProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  supportedCountries: string[];
  supportedBanks: string[];
  features: string[];
  connectionType: 'api' | 'screen_scraping' | 'open_banking' | 'manual';
  isActive: boolean;
  setupComplexity: 'easy' | 'medium' | 'complex';
  cost: 'free' | 'paid' | 'premium';
  documentation?: string;
}

export interface BankConnectionConfig {
  providerId: string;
  credentials: Record<string, any>;
  settings: {
    syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual';
    autoReconcile: boolean;
    notifyOnTransactions: boolean;
    categorizeTransactions: boolean;
  };
}

export interface BankAccountStats {
  totalAccounts: number;
  connectedAccounts: number;
  totalBalance: number;
  totalAvailableBalance: number;
  accountsByType: Record<string, number>;
  accountsByCountry: Record<string, number>;
  accountsByStatus: Record<string, number>;
  recentTransactions: number;
  pendingReconciliations: number;
}

export interface BankAccountFilters {
  search: string;
  accountType: string[];
  status: string[];
  country: string[];
  region: string[];
  currency: string[];
  sortBy: 'name' | 'balance' | 'lastSync' | 'created';
  sortOrder: 'asc' | 'desc';
}

export interface BankAccountAlert {
  id: string;
  accountId: string;
  type: 'low_balance' | 'sync_error' | 'suspicious_activity' | 'limit_exceeded' | 'connection_lost';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Enhanced Reconciliation Types
export interface ReconciliationItem {
  id: string;
  accountId: string;
  transactionId: string;
  type: 'missing_transaction' | 'duplicate_transaction' | 'amount_mismatch' | 'date_mismatch' | 'unmatched_bank' | 'unmatched_book';
  description: string;
  expectedAmount?: number;
  actualAmount?: number;
  expectedDate?: string;
  actualDate?: string;
  status: 'pending' | 'resolved' | 'ignored';
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationStatement {
  id: string;
  accountId: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  transactionCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  matchedTransactions: number;
  unmatchedTransactions: number;
  discrepancies: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ReconciliationRule {
  id: string;
  name: string;
  description: string;
  accountId?: string; // null means applies to all accounts
  conditions: {
    field: 'amount' | 'description' | 'reference' | 'date' | 'category';
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between';
    value: string | number;
    value2?: string | number; // for 'between' operator
  }[];
  actions: {
    type: 'auto_match' | 'categorize' | 'flag' | 'ignore';
    value?: string;
  }[];
  isActive: boolean;
  priority: number;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationSummary {
  totalStatements: number;
  pendingReconciliations: number;
  completedReconciliations: number;
  totalDiscrepancies: number;
  resolvedDiscrepancies: number;
  pendingDiscrepancies: number;
  totalVariance: number;
  averageReconciliationTime: number; // in hours
  lastReconciliationDate?: string;
  reconciliationAccuracy: number; // percentage
}

export interface BankStatementTransaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  debit?: number;
  credit?: number;
  balance: number;
  category?: string;
  isMatched: boolean;
  matchedTransactionId?: string;
  matchConfidence?: number; // 0-100
}

export interface BookTransaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  isMatched: boolean;
  matchedStatementId?: string;
  matchConfidence?: number; // 0-100
}

export interface ReconciliationMatch {
  id: string;
  statementTransactionId: string;
  bookTransactionId: string;
  matchType: 'exact' | 'fuzzy' | 'manual';
  confidence: number;
  variance?: number;
  notes?: string;
  matchedBy?: string;
  matchedAt: string;
}

export interface ReconciliationFilters {
  search: string;
  accountId: string[];
  status: string[];
  type: string[];
  priority: string[];
  dateRange: string;
  sortBy: 'date' | 'amount' | 'priority' | 'status';
  sortOrder: 'asc' | 'desc';
}