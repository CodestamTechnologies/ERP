'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart, Line, AreaChart, Area, ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/components-imp-utils/finance';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeFlow: number;
  operatingFlow: number;
  investingFlow: number;
  financingFlow: number;
}

interface CashFlowSummary {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  cashFlowGrowth: number;
  burnRate: number;
  runway: number;
}

interface CashFlowMetricsProps {
  data: CashFlowData[];
  summary: CashFlowSummary;
  period: string;
}

const CashFlowMetrics = ({ data, summary, period }: CashFlowMetricsProps) => {
  // Calculate additional metrics
  const avgDailyInflow = summary.totalInflow / data.length;
  const avgDailyOutflow = summary.totalOutflow / data.length;
  const inflowGrowth = 8.5; // Mock growth rate
  const outflowGrowth = 3.2; // Mock growth rate

  return (
    <div className="space-y-6">
      {/* Main Cash Flow Chart */}
      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Cash Flow Trend
          </CardTitle>
          <CardDescription>
            Daily cash inflows, outflows, and net cash flow over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatIndianCurrency(value),
                    name === 'inflow' ? 'Cash Inflow' : 
                    name === 'outflow' ? 'Cash Outflow' : 'Net Cash Flow'
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="inflow"
                  fill="#10b981"
                  fillOpacity={0.3}
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Cash Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Cash Outflow"
                />
                <Line
                  type="monotone"
                  dataKey="netFlow"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Net Cash Flow"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inflow Metrics */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
              Cash Inflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Inflow</span>
                <Badge className="bg-green-100 text-green-700">
                  +{inflowGrowth}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {formatIndianCurrency(summary.totalInflow)}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Daily Average</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatIndianCurrency(avgDailyInflow)}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Peak Day</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatIndianCurrency(Math.max(...data.map(d => d.inflow)))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outflow Metrics */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
              Cash Outflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Outflow</span>
                <Badge className="bg-red-100 text-red-700">
                  +{outflowGrowth}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {formatIndianCurrency(summary.totalOutflow)}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Daily Average</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatIndianCurrency(avgDailyOutflow)}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Peak Day</span>
              <p className="text-lg font-semibold text-gray-900">
                {formatIndianCurrency(Math.max(...data.map(d => d.outflow)))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Net Flow Metrics */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Net Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Net Flow</span>
                <Badge className={`${
                  summary.netCashFlow >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {summary.netCashFlow >= 0 ? '+' : ''}{summary.cashFlowGrowth}%
                </Badge>
              </div>
              <p className={`text-2xl font-bold ${
                summary.netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {formatIndianCurrency(summary.netCashFlow)}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Flow Ratio</span>
              <p className="text-lg font-semibold text-gray-900">
                {(summary.totalInflow / summary.totalOutflow).toFixed(2)}:1
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Efficiency</span>
              <div className="mt-1">
                <Progress 
                  value={Math.min(100, (summary.netCashFlow / summary.totalInflow) * 100)} 
                  className="h-2"
                />
                <span className="text-xs text-gray-500 mt-1">
                  {((summary.netCashFlow / summary.totalInflow) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cumulative Cash Flow */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Cumulative Cash Position
          </CardTitle>
          <CardDescription>
            Your cash balance over time showing the cumulative effect of cash flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatIndianCurrency(value), 'Cash Balance']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeFlow"
                  fill="url(#colorGradient)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Cash Balance"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowMetrics;