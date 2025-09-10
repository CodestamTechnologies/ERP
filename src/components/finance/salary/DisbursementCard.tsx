'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Disbursement } from '@/hooks/useSalaryDisbursement';
import { 
  User,
  CreditCard,
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface DisbursementCardProps {
  disbursement: Disbursement;
  onProcess: (disbursementId: string) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
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
    case 'pending':
      return <Clock size={16} className="text-yellow-600" />;
    default:
      return <Clock size={16} className="text-gray-600" />;
  }
};

export const DisbursementCard = ({
  disbursement,
  onProcess,
  isProcessing
}: DisbursementCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{disbursement.employeeName}</h3>
                <p className="text-sm text-gray-500">
                  Disbursement ID: {disbursement.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-lg">${disbursement.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Bank Account</p>
                  <p className="font-semibold">{disbursement.bankAccount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-semibold">
                    {new Date(disbursement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Retry Count</p>
                  <p className="font-semibold">{disbursement.retryCount}</p>
                </div>
              </div>
            </div>

            {disbursement.transactionId && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Transaction ID:</strong> {disbursement.transactionId}
                </p>
                {disbursement.processedAt && (
                  <p className="text-sm text-green-700">
                    Processed on {new Date(disbursement.processedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {disbursement.failureReason && (
              <div className="bg-red-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Failure Reason:</strong> {disbursement.failureReason}
                </p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Last Updated: {new Date(disbursement.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(disbursement.status)}
              <Badge variant="outline" className={getStatusColor(disbursement.status)}>
                {disbursement.status}
              </Badge>
            </div>

            <div className="flex gap-2">
              {disbursement.status === 'pending' && (
                <Button 
                  size="sm"
                  onClick={() => onProcess(disbursement.id)}
                  disabled={isProcessing}
                >
                  <Send size={14} className="mr-2" />
                  Process
                </Button>
              )}

              {disbursement.status === 'failed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onProcess(disbursement.id)}
                  disabled={isProcessing}
                >
                  <RefreshCw size={14} className="mr-2" />
                  Retry
                </Button>
              )}

              {disbursement.status === 'completed' && (
                <Button size="sm" variant="outline">
                  <CheckCircle size={14} className="mr-2" />
                  View Receipt
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};