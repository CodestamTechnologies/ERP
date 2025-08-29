import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface RatioAnalysisCardProps {
  ratio: { name: string; value: number; benchmark: number; status: 'good' | 'warning' | 'poor';
    description: string; formula: string; };
  formatPercentage: (value: number) => string; index: number;
}

export const RatioAnalysisCard = ({ ratio, formatPercentage, index }: RatioAnalysisCardProps) => {
  const getStatusColor = () => {
    switch (ratio.status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (ratio.status) {
      case 'good': return <TrendingUp size={20} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'poor': return <TrendingDown size={20} className="text-red-600" />;
      default: return <Calculator size={20} className="text-gray-600" />;
    }
  };

  const progressValue = Math.min(100, (ratio.value / ratio.benchmark) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Calculator size={18} className="mr-2 text-blue-600" />
              {ratio.name}
            </CardTitle>
            <Badge variant="outline" className={getStatusColor()}>
              {ratio.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {ratio.name.includes('Ratio') || ratio.name.includes('Turnover') ? 
                  ratio.value.toFixed(2) : formatPercentage(ratio.value)}
              </div>
              <div className="text-sm text-gray-500">Current Value</div>
            </div>
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">vs Benchmark</span>
              <span className="font-medium">
                {ratio.name.includes('Ratio') || ratio.name.includes('Turnover') ? 
                  ratio.benchmark.toFixed(2) : formatPercentage(ratio.benchmark)}
              </span>
            </div>
            <Progress value={progressValue} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Performance: {progressValue.toFixed(1)}%</span>
              <span className={
                ratio.value >= ratio.benchmark ? 'text-green-600' : 
                ratio.value >= ratio.benchmark * 0.8 ? 'text-yellow-600' : 'text-red-600'
              }>
                {ratio.value >= ratio.benchmark ? 'Above' : 
                 ratio.value >= ratio.benchmark * 0.8 ? 'Near' : 'Below'} Target
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm font-medium text-gray-700">Description</div>
            <div className="text-xs text-gray-600">{ratio.description}</div>
            <div className="text-xs text-gray-500 font-mono bg-white p-2 rounded border">
              Formula: {ratio.formula}
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Industry Avg:</span>
              <span className="font-medium">
                {ratio.name.includes('Ratio') || ratio.name.includes('Turnover') ? 
                  ratio.benchmark.toFixed(2) : formatPercentage(ratio.benchmark)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};