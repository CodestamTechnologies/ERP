'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReconciliationItem } from '@/types/bankAccount';
import { formatCurrency } from '@/lib/utils/bankAccountUtils';
import { 
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface ReconciliationCardProps {
  item: ReconciliationItem;
  onViewDetails: (item: ReconciliationItem) => void;
  onResolve: (itemId: string, resolution: string) => void;
  onIgnore: (itemId: string, reason: string) => void;
}

const getDiscrepancyTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'missing_transaction': 'text-red-600 bg-red-50 border-red-200',
    'duplicate_transaction': 'text-orange-600 bg-orange-50 border-orange-200',
    'amount_mismatch': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'date_mismatch': 'text-blue-600 bg-blue-50 border-blue-200',
    'unmatched_bank': 'text-purple-600 bg-purple-50 border-purple-200',
    'unmatched_book': 'text-pink-600 bg-pink-50 border-pink-200'
  };
  return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'critical': 'text-red-600 bg-red-50 border-red-200',
    'high': 'text-orange-600 bg-orange-50 border-orange-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'low': 'text-green-600 bg-green-50 border-green-200'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const ReconciliationCard = ({
  item,
  onViewDetails,
  onResolve,
  onIgnore
}: ReconciliationCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'resolved' ? 'bg-green-500' :
                item.status === 'ignored' ? 'bg-gray-400' : 'bg-red-500'
              }`}></div>
              <div>
                <h4 className="font-medium">{item.description}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getDiscrepancyTypeColor(item.type)}>
                    {item.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  {item.reference && (
                    <span className="text-xs text-gray-500">Ref: {item.reference}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
              {item.expectedAmount && (
                <div>
                  <p className="text-gray-500">Expected</p>
                  <p className="font-medium">{formatCurrency(item.expectedAmount, 'USD')}</p>
                </div>
              )}
              {item.actualAmount && (
                <div>
                  <p className="text-gray-500">Actual</p>
                  <p className="font-medium">{formatCurrency(item.actualAmount, 'USD')}</p>
                </div>
              )}
              {item.expectedAmount && item.actualAmount && (
                <div>
                  <p className="text-gray-500">Variance</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(Math.abs(item.expectedAmount - item.actualAmount), 'USD')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(item.actualDate || item.expectedDate || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {item.notes && (
              <div className="bg-gray-50 rounded p-2 text-sm">
                <p className="text-gray-700">{item.notes}</p>
                {item.resolvedBy && (
                  <p className="text-gray-500 text-xs mt-1">
                    Resolved by {item.resolvedBy} on {new Date(item.resolvedAt!).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onViewDetails(item)}
            >
              <Eye size={14} />
            </Button>
            {item.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onResolve(item.id, 'Manually resolved')}
                >
                  <CheckCircle2 size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onIgnore(item.id, 'Ignored by user')}
                >
                  <XCircle size={14} />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};