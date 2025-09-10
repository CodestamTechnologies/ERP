'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PayrollBatch } from '@/hooks/useSalaryDisbursement';
import { 
  Calendar,
  Users,
  DollarSign,
  Play,
  FileText,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PayrollBatchCardProps {
  batch: PayrollBatch;
  onProcess: (batch: PayrollBatch) => void;
  onGenerateSlips: (batchId: string) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'processing': 'text-blue-600 bg-blue-50 border-blue-200',
    'approved': 'text-purple-600 bg-purple-50 border-purple-200',
    'completed': 'text-green-600 bg-green-50 border-green-200',
    'cancelled': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-600" />;
    case 'processing':
      return <Clock size={16} className="text-blue-600" />;
    case 'approved':
      return <CheckCircle size={16} className="text-purple-600" />;
    default:
      return <Calendar size={16} className="text-gray-600" />;
  }
};

export const PayrollBatchCard = ({
  batch,
  onProcess,
  onGenerateSlips,
  isProcessing
}: PayrollBatchCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{batch.batchName}</h3>
                <p className="text-sm text-gray-500">
                  Pay Period: {batch.payPeriod} • Created by {batch.createdBy}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="font-semibold">{batch.employeeCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold">${(batch.totalAmount / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Period</p>
                  <p className="font-semibold">
                    {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-semibold">
                    {new Date(batch.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {batch.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{batch.notes}</p>
              </div>
            )}

            {batch.approvedBy && (
              <div className="text-sm text-gray-600 mb-4">
                <p>Approved by {batch.approvedBy} on {new Date(batch.approvedAt!).toLocaleDateString()}</p>
              </div>
            )}
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
                  variant="outline"
                  onClick={() => onGenerateSlips(batch.id)}
                  disabled={isProcessing}
                >
                  <FileText size={14} className="mr-2" />
                  Generate Slips
                </Button>
              )}
              
              {batch.status === 'approved' && (
                <Button 
                  size="sm"
                  onClick={() => onProcess(batch)}
                  disabled={isProcessing}
                >
                  <Send size={14} className="mr-2" />
                  Process
                </Button>
              )}

              {batch.status === 'processing' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onProcess(batch)}
                  disabled={isProcessing}
                >
                  <Play size={14} className="mr-2" />
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};