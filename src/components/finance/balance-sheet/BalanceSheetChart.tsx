import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BalanceSheetChartProps {
  data: any; formatCurrency: (amount: number) => string;
}

export const BalanceSheetChart = ({ data, formatCurrency }: BalanceSheetChartProps) => {
  const pieData = [
    { name: 'Current Assets', value: data.currentAssets, color: '#10B981' },
    { name: 'Non-Current Assets', value: data.nonCurrentAssets, color: '#059669' },
    { name: 'Current Liabilities', value: data.currentLiabilities, color: '#EF4444' },
    { name: 'Non-Current Liabilities', value: data.nonCurrentLiabilities, color: '#DC2626' },
    { name: 'Equity', value: data.totalEquity, color: '#8B5CF6' }
  ];

  const barData = [
    { name: 'Assets', current: data.currentAssets, nonCurrent: data.nonCurrentAssets },
    { name: 'Liabilities', current: data.currentLiabilities, nonCurrent: data.nonCurrentLiabilities },
    { name: 'Equity', current: data.totalEquity, nonCurrent: 0 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current vs Non-Current Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="current" name="Current" fill="#3B82F6" />
                <Bar dataKey="nonCurrent" name="Non-Current" fill="#1D4ED8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};