import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AssetCardProps {
  asset: { id: string; name: string; amount: number; percentage: number; category: string;
    subItems?: Array<{ name: string; amount: number; }>; };
  viewMode: 'detailed' | 'summary'; formatCurrency: (amount: number) => string; index: number;
}

export const AssetCard = ({ asset, viewMode, formatCurrency, index }: AssetCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
      <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-green-800">
              <Building2 size={18} className="mr-2" />
              {asset.name}
            </CardTitle>
            <Badge variant="outline" className={
              asset.category === 'current' ? 'text-green-600 bg-green-50 border-green-200' : 'text-blue-600 bg-blue-50 border-blue-200'
            }>
              {asset.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(asset.amount)}</div>
              <div className="text-sm text-gray-500">{asset.percentage}% of total assets</div>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Asset Contribution</span>
              <span className="font-medium">{asset.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={asset.percentage} className="w-full" />
          </div>

          {viewMode === 'detailed' && asset.subItems && asset.subItems.length > 0 && (
            <div className="space-y-2">
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-1">Breakdown ({asset.subItems.length} items)</span>
              </button>
              
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  {asset.subItems.map((subItem, idx) => (
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
              <span>Category: {asset.category === 'current' ? 'Current Asset' : 'Non-Current Asset'}</span>
              <span>Liquidity: {asset.category === 'current' ? 'High' : 'Low'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};