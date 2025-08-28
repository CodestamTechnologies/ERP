'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, AreaChart, Area, ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Brain, Target, AlertTriangle, 
  CheckCircle, Calendar, Zap, DollarSign 
} from 'lucide-react';
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

interface CashFlowForecastProps {
  historicalData: CashFlowData[];
  summary: CashFlowSummary;
}

const CashFlowForecast = ({ historicalData, summary }: CashFlowForecastProps) => {
  const [forecastPeriod, setForecastPeriod] = useState('90days');
  const [scenario, setScenario] = useState('realistic');

  // Generate forecast data based on historical trends
  const generateForecast = (period: string, scenarioType: string) => {
    const days = period === '30days' ? 30 : period === '90days' ? 90 : 180;
    const forecastData = [];
    
    // Calculate trends from historical data
    const avgInflow = historicalData.reduce((sum, item) => sum + item.inflow, 0) / historicalData.length;
    const avgOutflow = historicalData.reduce((sum, item) => sum + item.outflow, 0) / historicalData.length;
    
    // Scenario multipliers
    const scenarios = {
      optimistic: { inflowMultiplier: 1.2, outflowMultiplier: 0.9 },
      realistic: { inflowMultiplier: 1.05, outflowMultiplier: 1.02 },
      pessimistic: { inflowMultiplier: 0.85, outflowMultiplier: 1.15 }
    };
    
    const { inflowMultiplier, outflowMultiplier } = scenarios[scenarioType as keyof typeof scenarios];
    
    let cumulativeFlow = historicalData[historicalData.length - 1]?.cumulativeFlow || 0;
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Add some seasonality and randomness
      const seasonalFactor = 1 + 0.1 * Math.sin((i / 30) * Math.PI);
      const randomFactor = 0.9 + Math.random() * 0.2;
      
      const projectedInflow = Math.round(avgInflow * inflowMultiplier * seasonalFactor * randomFactor);
      const projectedOutflow = Math.round(avgOutflow * outflowMultiplier * seasonalFactor * randomFactor);
      const netFlow = projectedInflow - projectedOutflow;
      cumulativeFlow += netFlow;
      
      forecastData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inflow: projectedInflow,
        outflow: projectedOutflow,
        netFlow,
        cumulativeFlow,
        isProjected: true
      });
    }
    
    return forecastData;
  };

  const forecastData = generateForecast(forecastPeriod, scenario);
  
  // Combine historical and forecast data
  const combinedData = [
    ...historicalData.slice(-30).map(item => ({ ...item, isProjected: false })),
    ...forecastData
  ];

  // Calculate forecast metrics
  const forecastSummary = {
    projectedInflow: forecastData.reduce((sum, item) => sum + item.inflow, 0),
    projectedOutflow: forecastData.reduce((sum, item) => sum + item.outflow, 0),
    projectedNetFlow: forecastData.reduce((sum, item) => sum + item.netFlow, 0),
    endingBalance: forecastData[forecastData.length - 1]?.cumulativeFlow || 0,
    minBalance: Math.min(...forecastData.map(item => item.cumulativeFlow)),
    maxBalance: Math.max(...forecastData.map(item => item.cumulativeFlow))
  };

  // Risk indicators
  const riskIndicators = [
    {
      type: 'Cash Shortage Risk',
      level: forecastSummary.minBalance < 500000 ? 'high' : forecastSummary.minBalance < 1000000 ? 'medium' : 'low',
      description: forecastSummary.minBalance < 500000 
        ? 'Projected cash balance may fall below safe levels'
        : 'Cash levels appear stable throughout the forecast period',
      icon: forecastSummary.minBalance < 500000 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
    },
    {
      type: 'Growth Sustainability',
      level: forecastSummary.projectedNetFlow > 0 ? 'low' : 'high',
      description: forecastSummary.projectedNetFlow > 0
        ? 'Positive cash flow trend supports sustainable growth'
        : 'Negative cash flow trend may impact growth plans',
      icon: forecastSummary.projectedNetFlow > 0 ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">AI-Powered Forecast</span>
        </div>
        
        <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Next 30 Days</SelectItem>
            <SelectItem value="90days">Next 90 Days</SelectItem>
            <SelectItem value="180days">Next 6 Months</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={scenario} onValueChange={setScenario}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="optimistic">Optimistic</SelectItem>
            <SelectItem value="realistic">Realistic</SelectItem>
            <SelectItem value="pessimistic">Pessimistic</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="bg-white">
          <Zap className="h-4 w-4 mr-2" />
          Recalculate
        </Button>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Badge className="bg-green-100 text-green-700 text-xs">
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Projected Inflow</h3>
            <p className="text-xl font-bold text-green-700">
              {formatIndianCurrency(forecastSummary.projectedInflow)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <Badge className="bg-red-100 text-red-700 text-xs">Projected</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Projected Outflow</h3>
            <p className="text-xl font-bold text-red-700">
              {formatIndianCurrency(forecastSummary.projectedOutflow)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <Badge className={`text-xs ${
                forecastSummary.projectedNetFlow >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {forecastSummary.projectedNetFlow >= 0 ? 'Positive' : 'Negative'}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Net Cash Flow</h3>
            <p className={`text-xl font-bold ${
              forecastSummary.projectedNetFlow >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {formatIndianCurrency(forecastSummary.projectedNetFlow)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700 text-xs">Ending</Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Projected Balance</h3>
            <p className="text-xl font-bold text-purple-700">
              {formatIndianCurrency(forecastSummary.endingBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Cash Flow Forecast
          </CardTitle>
          <CardDescription>
            Historical data (last 30 days) and projected cash flow for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    name === 'outflow' ? 'Cash Outflow' : 
                    name === 'cumulativeFlow' ? 'Cash Balance' : 'Net Flow'
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
                
                {/* Historical data - solid lines */}
                <Area
                  type="monotone"
                  dataKey="inflow"
                  fill="#10b981"
                  fillOpacity={0.2}
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Cash Inflow"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Cash Outflow"
                  connectNulls={false}
                />
                
                {/* Cumulative balance line */}
                <Line
                  type="monotone"
                  dataKey="cumulativeFlow"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  strokeDasharray={(item: any) => item?.isProjected ? "5 5" : "0"}
                  dot={false}
                  name="Cash Balance"
                />
                
                {/* Add a reference line for minimum safe balance */}
                <Line
                  type="monotone"
                  data={combinedData.map(item => ({ ...item, safeLevel: 500000 }))}
                  dataKey="safeLevel"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Minimum Safe Level"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Risk Assessment
          </CardTitle>
          <CardDescription>
            Potential risks and opportunities identified in the forecast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskIndicators.map((risk, index) => (
              <div 
                key={risk.type}
                className={`p-4 rounded-lg border-l-4 ${
                  risk.level === 'high' ? 'border-red-500 bg-red-50' :
                  risk.level === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${
                    risk.level === 'high' ? 'text-red-600' :
                    risk.level === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {risk.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{risk.type}</h4>
                  <Badge 
                    className={`text-xs ${
                      risk.level === 'high' ? 'bg-red-100 text-red-700' :
                      risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}
                  >
                    {risk.level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{risk.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Scenario Comparison</CardTitle>
          <CardDescription>
            Compare different forecast scenarios to plan for various outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['optimistic', 'realistic', 'pessimistic'].map((scenarioType) => {
              const scenarioData = generateForecast(forecastPeriod, scenarioType);
              const scenarioSummary = {
                netFlow: scenarioData.reduce((sum, item) => sum + item.netFlow, 0),
                endingBalance: scenarioData[scenarioData.length - 1]?.cumulativeFlow || 0
              };
              
              return (
                <div 
                  key={scenarioType}
                  className={`p-4 rounded-lg border-2 ${
                    scenario === scenarioType ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2 capitalize">{scenarioType}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Net Flow:</span>
                      <span className={`font-medium ${
                        scenarioSummary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatIndianCurrency(scenarioSummary.netFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ending Balance:</span>
                      <span className="font-medium text-gray-900">
                        {formatIndianCurrency(scenarioSummary.endingBalance)}
                      </span>
                    </div>
                  </div>
                  {scenario !== scenarioType && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setScenario(scenarioType)}
                    >
                      Switch to {scenarioType}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowForecast;