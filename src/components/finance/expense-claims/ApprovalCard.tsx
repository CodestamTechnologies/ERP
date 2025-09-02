'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Approval } from '@/hooks/useExpenseClaims';
import { 
  Clock,
  User,
  Building,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar
} from 'lucide-react';

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (claimId: string, comments?: string) => void;
  onReject: (claimId: string, reason: string) => void;
  onViewDetails: (approval: Approval) => void;
  isProcessing: boolean;
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'text-green-600 bg-green-50 border-green-200',
    'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'high': 'text-orange-600 bg-orange-50 border-orange-200',
    'urgent': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'travel': 'text-blue-600 bg-blue-50 border-blue-200',
    'meals': 'text-green-600 bg-green-50 border-green-200',
    'accommodation': 'text-purple-600 bg-purple-50 border-purple-200',
    'office': 'text-orange-600 bg-orange-50 border-orange-200',
    'transport': 'text-teal-600 bg-teal-50 border-teal-200',
    'other': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const ApprovalCard = ({
  approval,
  onApprove,
  onReject,
  onViewDetails,
  isProcessing
}: ApprovalCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                approval.requiresAttention ? 'bg-red-50' : 'bg-orange-50'
              }`}>
                {approval.requiresAttention ? (
                  <AlertTriangle size={24} className="text-red-600" />
                ) : (
                  <Clock size={24} className="text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{approval.claimTitle}</h3>
                <p className="text-sm text-gray-500">{approval.claimNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="font-medium text-sm">{approval.employeeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm">{approval.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-lg">${approval.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Waiting</p>
                  <p className="font-medium text-sm">{approval.daysWaiting} day(s)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className={getCategoryColor(approval.category)}>
                {approval.category}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                {approval.priority} priority
              </Badge>
              {approval.requiresAttention && (
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
                  Requires Attention
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>Submitted: {new Date(approval.submittedAt).toLocaleDateString()}</p>
              {approval.daysWaiting > 3 && (
                <p className="text-orange-600 mt-1">
                  ⚠️ This claim has been waiting for {approval.daysWaiting} days
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(approval)}
              >
                <Eye size={14} className="mr-2" />
                Details
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => onApprove(approval.claimId, 'Approved via bulk action')}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={14} className="mr-2" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onReject(approval.claimId, 'Requires additional documentation')}
                disabled={isProcessing}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle size={14} className="mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};