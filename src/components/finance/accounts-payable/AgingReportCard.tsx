import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AgingBucket } from '@/types/accountsPayable';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AgingReportCardProps {
  bucket: AgingBucket;
  index: number;
}

export const AgingReportCard = ({ bucket, index }: AgingReportCardProps) => {
  const getIcon = () => {
    switch (index) {
      case 0:
        return <TrendingUp size={24} className="text-green-600" />;
      case 1:
        return <Minus size={24} className="text-yellow-600" />;
      case 2:
        return <TrendingDown size={24} className="text-orange-600" />;
      case 3:
        return <TrendingDown size={24} className="text-red-600" />;
      default:
        return <Minus size={24} className="text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (index) {
      case 0:
        return 'bg-green-50';
      case 1:
        return 'bg-yellow-50';
      case 2:
        return 'bg-orange-50';
      case 3:
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getProgressColor = () => {
    switch (index) {
      case 0:
        return 'bg-green-500';
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getBgColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {bucket.range}
          </CardTitle>
          {getIcon()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Amount */}
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(bucket.amount)}
          </p>
          <p className="text-sm text-gray-600">
            {bucket.count} invoice{bucket.count !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Percentage</span>
            <span className="font-medium">{bucket.percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(bucket.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Risk Level</span>
            <span className={`font-medium ${
              index === 0 ? 'text-green-600' :
              index === 1 ? 'text-yellow-600' :
              index === 2 ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {index === 0 ? 'Low' :
               index === 1 ? 'Medium' :
               index === 2 ? 'High' :
               'Critical'}
            </span>
          </div>
        </div>

        {/* Average per Invoice */}
        {bucket.count > 0 && (
          <div className="text-xs text-gray-600">
            Avg per invoice: {formatCurrency(bucket.amount / bucket.count)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};