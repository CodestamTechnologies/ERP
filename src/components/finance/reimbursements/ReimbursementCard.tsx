'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reimbursement } from '@/hooks/useReimbursements';
import { 
  CreditCard,
  User,
  Building,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Paperclip,
  AlertTriangle
} from 'lucide-react';

interface ReimbursementCardProps {
  reimbursement: Reimbursement;
  onViewDetails: (reimbursement: Reimbursement) => void;
  onApprove: (reimbursementId: string, comments?: string) => void;
  onReject: (reimbursementId: string, reason: string) => void;
  onProcessPayment: (reimbursement: Reimbursement) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'approved': 'text-blue-600 bg-blue-50 border-blue-200',
    'rejected': 'text-red-600 bg-red-50 border-red-200',
    'paid': 'text-green-600 bg-green-50 border-green-200',
    'cancelled': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'expense': 'text-blue-600 bg-blue-50 border-blue-200',
    'travel': 'text-green-600 bg-green-50 border-green-200',
    'advance': 'text-purple-600 bg-purple-50 border-purple-200',
    'other': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'text-green-600 bg-green-50 border-green-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'high': 'text-orange-600 bg-orange-50 border-orange-200',
    'urgent': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const ReimbursementCard = ({
  reimbursement,
  onViewDetails,
  onApprove,
  onReject,
  onProcessPayment,
  isProcessing
}: ReimbursementCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <CreditCard size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{reimbursement.title}</h3>
                <p className="text-sm text-gray-500">{reimbursement.reimbursementNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="font-medium text-sm">{reimbursement.employeeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm">{reimbursement.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-lg">${reimbursement.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Requested</p>
                  <p className="font-medium text-sm">
                    {new Date(reimbursement.requestedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">{reimbursement.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor(reimbursement.type)}>
                  {reimbursement.type}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(reimbursement.priority)}>
                  {reimbursement.priority} priority
                </Badge>
                {reimbursement.receipts.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Paperclip size={12} />
                    <span>{reimbursement.receipts.length} receipt(s)</span>
                  </div>
                )}
                {reimbursement.lineItems.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText size={12} />
                    <span>{reimbursement.lineItems.length} item(s)</span>
                  </div>
                )}
              </div>
            </div>

            {reimbursement.approvedDate && (
              <div className="text-sm text-blue-600 mb-2">
                <p>Approved by {reimbursement.approvedBy} on {new Date(reimbursement.approvedDate).toLocaleDateString()}</p>
              </div>
            )}

            {reimbursement.paidDate && (
              <div className="text-sm text-green-600 mb-2">
                <p>Paid on {new Date(reimbursement.paidDate).toLocaleDateString()}</p>
                {reimbursement.paymentDetails?.transactionId && (
                  <p className="text-xs">Transaction ID: {reimbursement.paymentDetails.transactionId}</p>
                )}
              </div>
            )}

            {reimbursement.status === 'rejected' && reimbursement.rejectionReason && (
              <div className="bg-red-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-red-800">
                  <strong>Rejected:</strong> {reimbursement.rejectionReason}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  By {reimbursement.rejectedBy} on {new Date(reimbursement.rejectedDate!).toLocaleDateString()}
                </p>
              </div>
            )}

            {reimbursement.priority === 'urgent' && reimbursement.status === 'pending' && (
              <div className="bg-red-50 rounded-lg p-3 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <p className="text-sm text-red-800">
                  <strong>Urgent:</strong> This reimbursement requires immediate attention
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge variant="outline" className={getStatusColor(reimbursement.status)}>
              {reimbursement.status}
            </Badge>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(reimbursement)}
              >
                <Eye size={14} className="mr-2" />
                View
              </Button>

              {reimbursement.status === 'pending' && (
                <>
                  <Button 
                    size="sm"
                    onClick={() => onApprove(reimbursement.id, 'Approved via quick action')}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={14} className="mr-2" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onReject(reimbursement.id, 'Requires additional documentation')}
                    disabled={isProcessing}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle size={14} className="mr-2" />
                    Reject
                  </Button>
                </>
              )}

              {reimbursement.status === 'approved' && (
                <Button 
                  size="sm"
                  onClick={() => onProcessPayment(reimbursement)}
                  disabled={isProcessing}
                >
                  <Send size={14} className="mr-2" />
                  Process Payment
                </Button>
              )}

              {reimbursement.status === 'paid' && (
                <Button size="sm" variant="outline">
                  <FileText size={14} className="mr-2" />
                  Receipt
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};