'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentBatch } from '@/hooks/useReimbursements';
import { 
  Package,
  Users,
  DollarSign,
  Calendar,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  User
} from 'lucide-react';

interface PaymentBatchCardProps {
  batch: PaymentBatch;
  onProcess: (batchId: string) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'processing': 'text-blue-600 bg-blue-50 border-blue-200',
    'completed': 'text-green-600 bg-green-50 border-green-200',
    'failed': 'text-red-600 bg-red-50 border-red-200',
    'cancelled': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-600" />;
    case 'processing':
      return <Clock size={16} className="text-blue-600" />;
    case 'failed':
      return <AlertTriangle size={16} className="text-red-600" />;
    default:
      return <Package size={16} className="text-gray-600" />;
  }
};

export const PaymentBatchCard = ({
  batch,
  onProcess,
  isProcessing
}: PaymentBatchCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{batch.title}</h3>
                <p className="text-sm text-gray-500">{batch.batchNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Reimbursements</p>
                  <p className="font-bold text-lg">{batch.reimbursementCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">${batch.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium text-sm">
                    {new Date(batch.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="font-medium text-sm">{batch.createdBy}</p>
                </div>
              </div>
            </div>

            {batch.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-700">{batch.description}</p>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                  {batch.paymentMethod.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {batch.processedAt && (
              <div className="text-sm text-blue-600 mb-2">
                <p>Processing started: {new Date(batch.processedAt).toLocaleString()}</p>
              </div>
            )}

            {batch.completedAt && (
              <div className="text-sm text-green-600 mb-2">
                <p>Completed: {new Date(batch.completedAt).toLocaleString()}</p>
              </div>
            )}

            {batch.status === 'failed' && batch.failureReason && (
              <div className="bg-red-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-red-800">
                  <strong>Failed:</strong> {batch.failureReason}
                </p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Batch includes {batch.reimbursementIds.length} reimbursement(s)</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(batch.status)}
              <Badge variant="outline" className={getStatusColor(batch.status)}>
                {batch.status}
              </Badge>
            </div>

            <div className="flex gap-2">
              {batch.status === 'draft' && (
                <Button 
                  size="sm"
                  onClick={() => onProcess(batch.id)}
                  disabled={isProcessing}
                >
                  <Play size={14} className="mr-2" />
                  Process Batch
                </Button>
              )}

              {batch.status === 'processing' && (
                <Button size="sm" variant="outline" disabled>
                  <Clock size={14} className="mr-2" />
                  Processing...
                </Button>
              )}

              {batch.status === 'completed' && (
                <Button size="sm" variant="outline">
                  <CheckCircle size={14} className="mr-2" />
                  View Report
                </Button>
              )}

              {batch.status === 'failed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onProcess(batch.id)}
                  disabled={isProcessing}
                >
                  <Play size={14} className="mr-2" />
                  Retry
                </Button>
              )}

              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};