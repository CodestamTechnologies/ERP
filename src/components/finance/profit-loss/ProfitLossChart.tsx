import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ProfitLossChartProps {
  data: any; formatCurrency: (amount: number) => string;
}

export const ProfitLossChart = ({ data, formatCurrency }: ProfitLossChartProps) => {
  const pieData = [
    { name: 'Operating Revenue', value: data.operatingRevenue, color: '#10B981' },
    { name: 'Non-Operating Revenue', value: data.nonOperatingRevenue, color: '#059669' },
    { name: 'Operating Expenses', value: data.operatingExpenses, color: '#EF4444' },
    { name: 'Non-Operating Expenses', value: data.nonOperatingExpenses, color: '#DC2626' }
  ];

  const waterfallData = [
    { name: 'Revenue', value: data.totalRevenue, cumulative: data.totalRevenue },
    { name: 'COGS', value: -data.costOfGoodsSold, cumulative: data.totalRevenue - data.costOfGoodsSold },
    { name: 'Operating Exp', value: -(data.operatingExpenses - data.costOfGoodsSold), cumulative: data.operatingProfit },
    { name: 'Non-Op Exp', value: -data.nonOperatingExpenses, cumulative: data.netProfit },
    { name: 'Net Profit', value: data.netProfit, cumulative: data.netProfit }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses Breakdown</CardTitle>
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
          <CardTitle>Profit Waterfall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="cumulative" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};