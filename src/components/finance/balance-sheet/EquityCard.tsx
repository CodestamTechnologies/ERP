import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { TrendingUp, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface EquityCardProps {
  equity: { id: string; name: string; amount: number; percentage: number; category: string;
    subItems?: Array<{ name: string; amount: number; }>; };
  viewMode: 'detailed' | 'summary'; formatCurrency: (amount: number) => string; index: number;
}

export const EquityCard = ({ equity, viewMode, formatCurrency, index }: EquityCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="hover:shadow-lg transition-all duration-300 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-purple-800">
              <TrendingUp size={18} className="mr-2" />
              {equity.name}
            </CardTitle>
            <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
              Equity
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(equity.amount)}</div>
              <div className="text-sm text-gray-500">{equity.percentage}% of total equity</div>
            </div>
            <div className="flex items-center text-purple-600">
              <Star size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Equity Share</span>
              <span className="font-medium">{equity.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={equity.percentage} className="w-full" />
          </div>

          {viewMode === 'detailed' && equity.subItems && equity.subItems.length > 0 && (
            <div className="space-y-2">
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-1">Breakdown ({equity.subItems.length} items)</span>
              </button>
              
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  {equity.subItems.map((subItem, idx) => (
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
              <span>Type: Owner's Equity</span>
              <span>Growth: Positive</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};