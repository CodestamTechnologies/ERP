import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface RevenueCardProps {
  revenue: { id: string; name: string; amount: number; percentage: number; category: string;
    subItems?: Array<{ name: string; amount: number; }>; };
  viewMode: 'detailed' | 'summary'; formatCurrency: (amount: number) => string; index: number;
}

export const RevenueCard = ({ revenue, viewMode, formatCurrency, index }: RevenueCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-green-800">
              <TrendingUp size={18} className="mr-2" />
              {revenue.name}
            </CardTitle>
            <Badge variant="outline" className={
              revenue.category === 'operating' ? 'text-green-600 bg-green-50 border-green-200' : 'text-blue-600 bg-blue-50 border-blue-200'
            }>
              {revenue.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(revenue.amount)}</div>
              <div className="text-sm text-gray-500">{revenue.percentage}% of total revenue</div>
            </div>
            <div className="flex items-center text-green-600">
              <DollarSign size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Revenue Contribution</span>
              <span className="font-medium">{revenue.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={revenue.percentage} className="w-full" />
          </div>

          {viewMode === 'detailed' && revenue.subItems && revenue.subItems.length > 0 && (
            <div className="space-y-2">
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-1">Breakdown ({revenue.subItems.length} items)</span>
              </button>
              
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  {revenue.subItems.map((subItem, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">{subItem.name}</span>
                      <span className="font-medium">{formatCurrency(subItem.amount)}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Type: {revenue.category === 'operating' ? 'Core Business' : 'Other Income'}</span>
              <span>Growth: {revenue.category === 'operating' ? 'High' : 'Stable'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};