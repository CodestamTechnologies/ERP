import { useState, useEffect, useCallback } from 'react';

interface ProfitLossItem {
  id: string; name: string; amount: number; percentage: number;
  category: 'operating' | 'non-operating'; subItems?: Array<{ name: string; amount: number; }>;
}

interface ProfitLoss {
  totalRevenue: number; totalExpenses: number; grossProfit: number; operatingProfit: number; netProfit: number;
  operatingRevenue: number; nonOperatingRevenue: number; operatingExpenses: number; nonOperatingExpenses: number;
  costOfGoodsSold: number; revenueItems: ProfitLossItem[]; expenseItems: ProfitLossItem[];
}

interface Ratio {
  name: string; value: number; benchmark: number; status: 'good' | 'warning' | 'poor';
  description: string; formula: string;
}

interface Period { id: string; name: string; }

interface Trends {
  previousPeriod: { totalRevenue: number; totalExpenses: number; grossProfit: number; netProfit: number; };
  chartData: Array<{ period: string; revenue: number; expenses: number; profit: number; }>;
}

const mockProfitLoss: ProfitLoss = {
  totalRevenue: 6500000, totalExpenses: 4800000, grossProfit: 3900000, operatingProfit: 2100000, netProfit: 1700000,
  operatingRevenue: 6200000, nonOperatingRevenue: 300000, operatingExpenses: 4200000, nonOperatingExpenses: 600000,
  costOfGoodsSold: 2600000,
  revenueItems: [
    {
      id: '1', name: 'Product Sales', amount: 4800000, percentage: 73.8, category: 'operating',
      subItems: [{ name: 'Product A', amount: 2800000 }, { name: 'Product B', amount: 2000000 }]
    },
    {
      id: '2', name: 'Service Revenue', amount: 1400000, percentage: 21.5, category: 'operating',
      subItems: [{ name: 'Consulting', amount: 800000 }, { name: 'Support', amount: 600000 }]
    },
    {
      id: '3', name: 'Investment Income', amount: 200000, percentage: 3.1, category: 'non-operating',
      subItems: [{ name: 'Interest Income', amount: 120000 }, { name: 'Dividend Income', amount: 80000 }]
    },
    {
      id: '4', name: 'Other Income', amount: 100000, percentage: 1.5, category: 'non-operating',
      subItems: [{ name: 'Rental Income', amount: 60000 }, { name: 'Miscellaneous', amount: 40000 }]
    }
  ],
  expenseItems: [
    {
      id: '1', name: 'Cost of Goods Sold', amount: 2600000, percentage: 54.2, category: 'operating',
      subItems: [{ name: 'Raw Materials', amount: 1600000 }, { name: 'Direct Labor', amount: 1000000 }]
    },
    {
      id: '2', name: 'Salaries & Benefits', amount: 1200000, percentage: 25.0, category: 'operating',
      subItems: [{ name: 'Salaries', amount: 900000 }, { name: 'Benefits', amount: 300000 }]
    },
    {
      id: '3', name: 'Marketing & Sales', amount: 400000, percentage: 8.3, category: 'operating',
      subItems: [{ name: 'Advertising', amount: 250000 }, { name: 'Sales Commission', amount: 150000 }]
    },
    {
      id: '4', name: 'Administrative Expenses', amount: 350000, percentage: 7.3, category: 'operating',
      subItems: [{ name: 'Office Rent', amount: 180000 }, { name: 'Utilities', amount: 170000 }]
    },
    {
      id: '5', name: 'Interest & Taxes', amount: 250000, percentage: 5.2, category: 'non-operating',
      subItems: [{ name: 'Interest Expense', amount: 100000 }, { name: 'Income Tax', amount: 150000 }]
    }
  ]
};

const mockRatios: Ratio[] = [
  {
    name: 'Gross Profit Margin', value: 60.0, benchmark: 40.0, status: 'good',
    description: 'Revenue remaining after direct costs',
    formula: '(Revenue - COGS) / Revenue × 100'
  },
  {
    name: 'Operating Profit Margin', value: 32.3, benchmark: 15.0, status: 'good',
    description: 'Profit from core business operations',
    formula: 'Operating Profit / Revenue × 100'
  },
  {
    name: 'Net Profit Margin', value: 26.2, benchmark: 10.0, status: 'good',
    description: 'Bottom line profitability',
    formula: 'Net Profit / Revenue × 100'
  },
  {
    name: 'Revenue Growth', value: 18.5, benchmark: 10.0, status: 'good',
    description: 'Year-over-year revenue increase',
    formula: '(Current Revenue - Previous Revenue) / Previous Revenue × 100'
  },
  {
    name: 'Expense Ratio', value: 73.8, benchmark: 80.0, status: 'good',
    description: 'Total expenses as percentage of revenue',
    formula: 'Total Expenses / Revenue × 100'
  },
  {
    name: 'EBITDA Margin', value: 35.4, benchmark: 20.0, status: 'good',
    description: 'Earnings before interest, taxes, depreciation, amortization',
    formula: 'EBITDA / Revenue × 100'
  }
];

const mockPeriods: Period[] = [
  { id: 'current', name: 'Current Period' },
  { id: 'q3-2024', name: 'Q3 2024' },
  { id: 'q2-2024', name: 'Q2 2024' },
  { id: 'q1-2024', name: 'Q1 2024' }
];

const mockTrends: Trends = {
  previousPeriod: { totalRevenue: 5500000, totalExpenses: 4200000, grossProfit: 3200000, netProfit: 1300000 },
  chartData: [
    { period: 'Q1 2024', revenue: 5200000, expenses: 3800000, profit: 1400000 },
    { period: 'Q2 2024', revenue: 5400000, expenses: 3900000, profit: 1500000 },
    { period: 'Q3 2024', revenue: 5500000, expenses: 4200000, profit: 1300000 },
    { period: 'Q4 2024', revenue: 6500000, expenses: 4800000, profit: 1700000 }
  ]
};

export const useProfitLoss = () => {
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>(mockProfitLoss);
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
        setProfitLoss(mockProfitLoss);
        setRatios(mockRatios);
        setTrends(mockTrends);
      } catch (error) {
        console.error('Error loading profit & loss data:', error);
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
      console.log('Profit & Loss data exported successfully');
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
      setProfitLoss({ ...mockProfitLoss });
      setRatios([...mockRatios]);
      setTrends({ ...mockTrends });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profitLoss, ratios, trends, periods, loading, isProcessing,
    selectedPeriod, setSelectedPeriod, exportData, refreshData
  };
};