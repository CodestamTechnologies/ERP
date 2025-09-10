import { useState, useEffect, useCallback } from 'react';

interface BalanceSheetItem {
  id: string; name: string; amount: number; percentage: number;
  category: 'current' | 'non-current'; subItems?: Array<{ name: string; amount: number; }>;
}

interface BalanceSheet {
  totalAssets: number; totalLiabilities: number; totalEquity: number;
  currentAssets: number; nonCurrentAssets: number; currentLiabilities: number;
  nonCurrentLiabilities: number; shareCapital: number; retainedEarnings: number;
  assets: BalanceSheetItem[]; liabilities: BalanceSheetItem[]; equity: BalanceSheetItem[];
}

interface Ratio {
  name: string; value: number; benchmark: number; status: 'good' | 'warning' | 'poor';
  description: string; formula: string;
}

interface Period { id: string; name: string; }

interface Trends {
  previousPeriod: { totalAssets: number; totalLiabilities: number; totalEquity: number; };
  chartData: Array<{ period: string; assets: number; liabilities: number; equity: number; }>;
}

const mockBalanceSheet: BalanceSheet = {
  totalAssets: 5250000, totalLiabilities: 2100000, totalEquity: 3150000,
  currentAssets: 2800000, nonCurrentAssets: 2450000, currentLiabilities: 1200000,
  nonCurrentLiabilities: 900000, shareCapital: 2000000, retainedEarnings: 1150000,
  assets: [
    {
      id: '1', name: 'Cash & Cash Equivalents', amount: 850000, percentage: 16.2, category: 'current',
      subItems: [{ name: 'Bank Account', amount: 650000 }, { name: 'Petty Cash', amount: 200000 }]
    },
    {
      id: '2', name: 'Accounts Receivable', amount: 1200000, percentage: 22.9, category: 'current',
      subItems: [{ name: 'Trade Receivables', amount: 1000000 }, { name: 'Other Receivables', amount: 200000 }]
    },
    {
      id: '3', name: 'Inventory', amount: 750000, percentage: 14.3, category: 'current',
      subItems: [{ name: 'Raw Materials', amount: 300000 }, { name: 'Finished Goods', amount: 450000 }]
    },
    {
      id: '4', name: 'Property, Plant & Equipment', amount: 1800000, percentage: 34.3, category: 'non-current',
      subItems: [{ name: 'Land & Buildings', amount: 1200000 }, { name: 'Machinery', amount: 600000 }]
    },
    {
      id: '5', name: 'Intangible Assets', amount: 650000, percentage: 12.4, category: 'non-current',
      subItems: [{ name: 'Software', amount: 250000 }, { name: 'Patents', amount: 400000 }]
    }
  ],
  liabilities: [
    {
      id: '1', name: 'Accounts Payable', amount: 650000, percentage: 31.0, category: 'current',
      subItems: [{ name: 'Trade Payables', amount: 500000 }, { name: 'Accrued Expenses', amount: 150000 }]
    },
    {
      id: '2', name: 'Short-term Loans', amount: 350000, percentage: 16.7, category: 'current',
      subItems: [{ name: 'Bank Overdraft', amount: 150000 }, { name: 'Working Capital Loan', amount: 200000 }]
    },
    {
      id: '3', name: 'Current Portion of Long-term Debt', amount: 200000, percentage: 9.5, category: 'current'
    },
    {
      id: '4', name: 'Long-term Loans', amount: 600000, percentage: 28.6, category: 'non-current',
      subItems: [{ name: 'Term Loan', amount: 400000 }, { name: 'Equipment Loan', amount: 200000 }]
    },
    {
      id: '5', name: 'Deferred Tax Liability', amount: 300000, percentage: 14.3, category: 'non-current'
    }
  ],
  equity: [
    {
      id: '1', name: 'Share Capital', amount: 2000000, percentage: 63.5, category: 'current',
      subItems: [{ name: 'Common Stock', amount: 1500000 }, { name: 'Preferred Stock', amount: 500000 }]
    },
    {
      id: '2', name: 'Retained Earnings', amount: 1150000, percentage: 36.5, category: 'current',
      subItems: [{ name: 'Current Year Earnings', amount: 450000 }, { name: 'Previous Years', amount: 700000 }]
    }
  ]
};

const mockRatios: Ratio[] = [
  {
    name: 'Current Ratio', value: 2.33, benchmark: 2.0, status: 'good',
    description: 'Measures ability to pay short-term obligations',
    formula: 'Current Assets / Current Liabilities'
  },
  {
    name: 'Quick Ratio', value: 1.71, benchmark: 1.0, status: 'good',
    description: 'Measures liquidity excluding inventory',
    formula: '(Current Assets - Inventory) / Current Liabilities'
  },
  {
    name: 'Debt-to-Equity', value: 0.67, benchmark: 0.5, status: 'warning',
    description: 'Measures financial leverage',
    formula: 'Total Debt / Total Equity'
  },
  {
    name: 'Asset Turnover', value: 1.2, benchmark: 1.5, status: 'warning',
    description: 'Measures efficiency of asset utilization',
    formula: 'Revenue / Total Assets'
  },
  {
    name: 'Return on Assets', value: 8.6, benchmark: 10.0, status: 'warning',
    description: 'Measures profitability relative to assets',
    formula: 'Net Income / Total Assets'
  },
  {
    name: 'Equity Ratio', value: 60.0, benchmark: 50.0, status: 'good',
    description: 'Measures financial stability',
    formula: 'Total Equity / Total Assets'
  }
];

const mockPeriods: Period[] = [
  { id: 'current', name: 'Current Period' },
  { id: 'q3-2024', name: 'Q3 2024' },
  { id: 'q2-2024', name: 'Q2 2024' },
  { id: 'q1-2024', name: 'Q1 2024' }
];

const mockTrends: Trends = {
  previousPeriod: { totalAssets: 4800000, totalLiabilities: 2000000, totalEquity: 2800000 },
  chartData: [
    { period: 'Q1 2024', assets: 4500000, liabilities: 1800000, equity: 2700000 },
    { period: 'Q2 2024', assets: 4700000, liabilities: 1900000, equity: 2800000 },
    { period: 'Q3 2024', assets: 4800000, liabilities: 2000000, equity: 2800000 },
    { period: 'Q4 2024', assets: 5250000, liabilities: 2100000, equity: 3150000 }
  ]
};

export const useBalanceSheet = () => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet>(mockBalanceSheet);
  const [ratios, setRatios] = useState<Ratio[]>(mockRatios);
  const [trends, setTrends] = useState<Trends>(mockTrends);
  const [periods] = useState<Period[]>(mockPeriods);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBalanceSheet(mockBalanceSheet);
        setRatios(mockRatios);
        setTrends(mockTrends);
      } catch (error) {
        console.error('Error loading balance sheet data:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const exportData = useCallback(async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Balance sheet data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalanceSheet({ ...mockBalanceSheet });
      setRatios([...mockRatios]);
      setTrends({ ...mockTrends });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    balanceSheet, ratios, trends, periods, loading, isProcessing,
    selectedPeriod, setSelectedPeriod, exportData, refreshData
  };
};