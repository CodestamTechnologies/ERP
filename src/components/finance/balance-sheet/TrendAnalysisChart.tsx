import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TrendAnalysisChartProps {
  trends: { chartData: Array<{ period: string; assets: number; liabilities: number; equity: number; }>; };
  formatCurrency: (amount: number) => string;
}

export const TrendAnalysisChart = ({ trends, formatCurrency }: TrendAnalysisChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="assets" stroke="#10B981" strokeWidth={2} name="Assets" />
                <Line type="monotone" dataKey="liabilities" stroke="#EF4444" strokeWidth={2} name="Liabilities" />
                <Line type="monotone" dataKey="equity" stroke="#8B5CF6" strokeWidth={2} name="Equity" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Position Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="assets" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Assets" />
                <Area type="monotone" dataKey="liabilities" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Liabilities" />
                <Area type="monotone" dataKey="equity" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Equity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};