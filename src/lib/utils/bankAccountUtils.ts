import { BankAccount, BankTransaction, BankAccountAlert } from '@/types/bankAccount';

export const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    'CNY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF',
    'SGD': 'S$',
    'HKD': 'HK$',
    'AED': 'د.إ',
    'SAR': 'ر.س',
    'ZAR': 'R',
    'BRL': 'R$',
    'MXN': '$',
    'RUB': '₽',
    'KRW': '₩',
    'THB': '฿',
    'MYR': 'RM',
    'IDR': 'Rp',
    'PHP': '₱',
    'VND': '₫',
    'TWD': 'NT$',
    'NZD': 'NZ$',
    'NOK': 'kr',
    'SEK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'TRY': '₺',
    'ILS': '₪',
    'EGP': 'ج.م',
    'NGN': '₦',
    'KES': 'KSh',
    'GHS': '₵',
    'MAD': 'د.م.',
    'TND': 'د.ت',
    'DZD': 'د.ج',
    'LBP': 'ل.ل',
    'JOD': 'د.ا',
    'KWD': 'د.ك',
    'QAR': 'ر.ق',
    'OMR': 'ر.ع.',
    'BHD': 'د.ب',
    'PKR': '₨',
    'BDT': '৳',
    'LKR': '₨',
    'NPR': '₨',
    'MMK': 'K',
    'KHR': '៛',
    'LAK': '₭',
    'UZS': 'лв',
    'KZT': '₸',
    'GEL': '₾',
    'AMD': '֏',
    'AZN': '₼',
    'BGN': 'лв',
    'RON': 'lei',
    'HRK': 'kn',
    'RSD': 'дин.',
    'MKD': 'ден',
    'ALL': 'L',
    'BAM': 'КМ',
    'MDL': 'L',
    'UAH': '₴',
    'BYN': 'Br',
    'LTL': 'Lt',
    'LVL': 'Ls',
    'EEK': 'kr'
  };

  const symbol = currencySymbols[currency] || currency;
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace(/^/, symbol + ' ');
  } catch {
    return `${symbol} ${amount.toFixed(2)}`;
  }
};

export const getAccountTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    'checking': 'text-blue-600 bg-blue-50 border-blue-200',
    'savings': 'text-green-600 bg-green-50 border-green-200',
    'business': 'text-purple-600 bg-purple-50 border-purple-200',
    'credit': 'text-red-600 bg-red-50 border-red-200',
    'investment': 'text-orange-600 bg-orange-50 border-orange-200',
  };
  return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'active': 'text-green-600 bg-green-50 border-green-200',
    'inactive': 'text-gray-600 bg-gray-50 border-gray-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'suspended': 'text-orange-600 bg-orange-50 border-orange-200',
    'closed': 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getConnectionStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'connected': 'text-green-600 bg-green-50 border-green-200',
    'disconnected': 'text-red-600 bg-red-50 border-red-200',
    'error': 'text-red-600 bg-red-50 border-red-200',
    'syncing': 'text-blue-600 bg-blue-50 border-blue-200',
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getConnectionStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'connected': '🟢',
    'disconnected': '🔴',
    'error': '⚠️',
    'syncing': '🔄',
  };
  return icons[status] || '⚪';
};

export const getRegionFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪', 'NO': '🇳🇴',
    'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'PL': '🇵🇱',
    'CZ': '🇨🇿', 'HU': '🇭🇺', 'SK': '🇸🇰', 'SI': '🇸🇮', 'HR': '🇭🇷', 'BG': '🇧🇬',
    'RO': '🇷🇴', 'EE': '🇪🇪', 'LV': '🇱🇻', 'LT': '🇱🇹', 'MT': '🇲🇹', 'CY': '🇨🇾',
    'LU': '🇱🇺', 'IN': '🇮🇳', 'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'AU': '🇦🇺',
    'NZ': '🇳🇿', 'CA': '🇨🇦', 'MX': '🇲🇽', 'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱',
    'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪', 'UY': '🇺🇾', 'PY': '🇵🇾', 'BO': '🇧🇴',
    'EC': '🇪🇨', 'GY': '🇬🇾', 'SR': '🇸🇷', 'FK': '🇫🇰', 'RU': '🇷🇺', 'TR': '🇹🇷',
    'SA': '🇸🇦', 'AE': '🇦🇪', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
    'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'IL': '🇮🇱',
    'PS': '🇵🇸', 'EG': '🇪🇬', 'LY': '🇱🇾', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'MA': '🇲🇦',
    'SD': '🇸🇩', 'SS': '🇸🇸', 'ET': '🇪🇹', 'ER': '🇪🇷', 'DJ': '🇩🇯', 'SO': '🇸🇴',
    'KE': '🇰🇪', 'UG': '🇺🇬', 'TZ': '🇹🇿', 'RW': '🇷🇼', 'BI': '🇧🇮', 'MG': '🇲🇬',
    'MU': '🇲🇺', 'SC': '🇸🇨', 'KM': '🇰🇲', 'MZ': '🇲🇿', 'ZW': '🇿🇼', 'ZM': '🇿🇲',
    'MW': '🇲🇼', 'BW': '🇧🇼', 'NA': '🇳🇦', 'ZA': '🇿🇦', 'LS': '🇱🇸', 'SZ': '🇸🇿',
    'AO': '🇦🇴', 'CD': '🇨🇩', 'CG': '🇨🇬', 'CF': '🇨🇫', 'CM': '🇨🇲', 'GQ': '🇬🇶',
    'GA': '🇬🇦', 'ST': '🇸🇹', 'TD': '🇹🇩', 'NE': '🇳🇪', 'NG': '🇳🇬', 'BJ': '🇧🇯',
    'TG': '🇹🇬', 'GH': '🇬🇭', 'CI': '🇨🇮', 'LR': '🇱🇷', 'SL': '🇸🇱', 'GN': '🇬🇳',
    'GW': '🇬🇼', 'GM': '🇬🇲', 'SN': '🇸🇳', 'MR': '🇲🇷', 'ML': '🇲🇱', 'BF': '🇧🇫',
    'CV': '🇨🇻', 'TH': '🇹🇭', 'VN': '🇻🇳', 'LA': '🇱🇦', 'KH': '🇰🇭', 'MM': '🇲🇲',
    'MY': '🇲🇾', 'SG': '🇸🇬', 'ID': '🇮🇩', 'BN': '🇧🇳', 'PH': '🇵🇭', 'TW': '🇹🇼',
    'HK': '🇭🇰', 'MO': '🇲🇴', 'MN': '🇲🇳', 'KZ': '🇰🇿', 'KG': '🇰🇬', 'TJ': '🇹🇯',
    'UZ': '🇺🇿', 'TM': '🇹🇲', 'AF': '🇦🇫', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰',
    'MV': '🇲🇻', 'BT': '🇧🇹', 'NP': '🇳🇵'
  };
  return flags[country] || '🌍';
};

export const getAlertSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    'low': 'text-blue-600 bg-blue-50 border-blue-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'high': 'text-orange-600 bg-orange-50 border-orange-200',
    'critical': 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const maskAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length <= 4) return accountNumber;
  const visibleDigits = 4;
  const maskedPart = '*'.repeat(accountNumber.length - visibleDigits);
  return maskedPart + accountNumber.slice(-visibleDigits);
};

export const validateIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};

export const validateSWIFT = (swift: string): boolean => {
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(swift);
};

export const formatAccountNumber = (accountNumber: string, country: string): string => {
  switch (country) {
    case 'US':
      // Format: XXXX-XXXX-XXXX
      return accountNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    case 'GB':
      // Format: XX-XX-XX XXXXXXXX
      return accountNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{8})/, '$1-$2-$3 $4');
    case 'DE':
      // Format: XXXX XXXX XXXX XXXX XX
      return accountNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{2})/, '$1 $2 $3 $4 $5');
    case 'IN':
      // Format: XXXX-XXXX-XXXX
      return accountNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    default:
      return accountNumber;
  }
};

export const getBankAccountHealth = (account: BankAccount): {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
} => {
  let score = 100;
  const issues: string[] = [];

  // Connection status
  if (account.connectionStatus === 'disconnected') {
    score -= 30;
    issues.push('Account is disconnected');
  } else if (account.connectionStatus === 'error') {
    score -= 40;
    issues.push('Connection error detected');
  }

  // Account status
  if (account.status === 'inactive') {
    score -= 20;
    issues.push('Account is inactive');
  } else if (account.status === 'suspended') {
    score -= 50;
    issues.push('Account is suspended');
  }

  // Balance checks
  if (account.limits?.minimumBalance && account.balance < account.limits.minimumBalance) {
    score -= 25;
    issues.push('Balance below minimum requirement');
  }

  // Last sync
  if (account.lastSyncAt) {
    const lastSync = new Date(account.lastSyncAt);
    const daysSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceSync > 7) {
      score -= 15;
      issues.push('Account not synced recently');
    }
  }

  let status: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 90) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'fair';
  else status = 'poor';

  return { score: Math.max(0, score), status, issues };
};

export const generateAccountSummary = (accounts: BankAccount[]): {
  totalBalance: number;
  totalAvailableBalance: number;
  accountsByType: Record<string, number>;
  accountsByStatus: Record<string, number>;
  accountsByCurrency: Record<string, { count: number; balance: number }>;
  healthyAccounts: number;
  connectedAccounts: number;
} => {
  const summary = {
    totalBalance: 0,
    totalAvailableBalance: 0,
    accountsByType: {} as Record<string, number>,
    accountsByStatus: {} as Record<string, number>,
    accountsByCurrency: {} as Record<string, { count: number; balance: number }>,
    healthyAccounts: 0,
    connectedAccounts: 0,
  };

  accounts.forEach(account => {
    // Convert all balances to USD for total calculation (simplified)
    const usdRate = account.currency === 'USD' ? 1 : 0.85; // Simplified conversion
    summary.totalBalance += account.balance * usdRate;
    summary.totalAvailableBalance += account.availableBalance * usdRate;

    // Count by type
    summary.accountsByType[account.accountType] = (summary.accountsByType[account.accountType] || 0) + 1;

    // Count by status
    summary.accountsByStatus[account.status] = (summary.accountsByStatus[account.status] || 0) + 1;

    // Count by currency
    if (!summary.accountsByCurrency[account.currency]) {
      summary.accountsByCurrency[account.currency] = { count: 0, balance: 0 };
    }
    summary.accountsByCurrency[account.currency].count += 1;
    summary.accountsByCurrency[account.currency].balance += account.balance;

    // Health and connection status
    const health = getBankAccountHealth(account);
    if (health.status === 'excellent' || health.status === 'good') {
      summary.healthyAccounts += 1;
    }

    if (account.connectionStatus === 'connected') {
      summary.connectedAccounts += 1;
    }
  });

  return summary;
};

export const exportAccountsToCSV = (accounts: BankAccount[]): void => {
  const headers = [
    'Account Name', 'Account Number', 'Bank Name', 'Account Type', 'Currency',
    'Balance', 'Available Balance', 'Status', 'Connection Status', 'Country',
    'Last Sync', 'Created At'
  ];

  const csvContent = [
    headers.join(','),
    ...accounts.map(account => [
      `"${account.accountName}"`,
      `"${account.accountNumber}"`,
      `"${account.bankName}"`,
      account.accountType,
      account.currency,
      account.balance,
      account.availableBalance,
      account.status,
      account.connectionStatus,
      account.country,
      account.lastSyncAt || 'Never',
      account.createdAt
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `bank_accounts_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatLastSync = (lastSyncAt?: string): string => {
  if (!lastSyncAt) return 'Never synced';
  
  const lastSync = new Date(lastSyncAt);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return lastSync.toLocaleDateString();
};