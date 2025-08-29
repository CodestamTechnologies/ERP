import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface ProfitabilityCardProps {
  title: string; value: number; benchmark: number; description: string;
  formatPercentage: (value: number) => string;
}

export const ProfitabilityCard = ({ title, value, benchmark, description, formatPercentage }: ProfitabilityCardProps) => {
  const getStatus = () => {
    if (value >= benchmark) return 'good';
    if (value >= benchmark * 0.8) return 'warning';
    return 'poor';
  };

  const status = getStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <TrendingUp size={20} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'poor': return <TrendingDown size={20} className="text-red-600" />;
      default: return <Target size={20} className="text-gray-600" />;
    }
  };

  const progressValue = Math.min(100, (value / benchmark) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target size={18} className="mr-2 text-purple-600" />
              {title}
            </CardTitle>
            <Badge variant="outline" className={getStatusColor()}>
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {formatPercentage(value)}
              </div>
              <div className="text-sm text-gray-500">{description}</div>
            </div>
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">vs Benchmark</span>
              <span className="font-medium">{formatPercentage(benchmark)}</span>
            </div>
            <Progress value={progressValue} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Performance: {progressValue.toFixed(1)}%</span>
              <span className={
                value >= benchmark ? 'text-green-600' : 
                value >= benchmark * 0.8 ? 'text-yellow-600' : 'text-red-600'
              }>
                {value >= benchmark ? 'Exceeds' : 
                 value >= benchmark * 0.8 ? 'Meets' : 'Below'} Target
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Industry Avg:</span>
              <span className="font-medium">{formatPercentage(benchmark)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};