'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpenseClaim } from '@/hooks/useExpenseClaims';
import { 
  Receipt,
  User,
  Building,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Send,
  FileText,
  Paperclip
} from 'lucide-react';

interface ExpenseClaimCardProps {
  claim: ExpenseClaim;
  onViewDetails: (claim: ExpenseClaim) => void;
  onSubmit: (claimId: string) => void;
  onEdit: (claimId: string, updates: Partial<ExpenseClaim>) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'approved': 'text-green-600 bg-green-50 border-green-200',
    'rejected': 'text-red-600 bg-red-50 border-red-200',
    'paid': 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
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

export const ExpenseClaimCard = ({
  claim,
  onViewDetails,
  onSubmit,
  onEdit,
  isProcessing
}: ExpenseClaimCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <Receipt size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{claim.title}</h3>
                <p className="text-sm text-gray-500">{claim.claimNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employee</p>
                  <p className="font-medium text-sm">{claim.employeeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm">{claim.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-lg">${claim.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium text-sm">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">{claim.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getCategoryColor(claim.category)}>
                  {claim.category}
                </Badge>
                {claim.receipts.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Paperclip size={12} />
                    <span>{claim.receipts.length} receipt(s)</span>
                  </div>
                )}
                {claim.expenses.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText size={12} />
                    <span>{claim.expenses.length} expense(s)</span>
                  </div>
                )}
              </div>
            </div>

            {claim.submittedAt && (
              <div className="text-sm text-gray-600 mb-2">
                <p>Submitted: {new Date(claim.submittedAt).toLocaleDateString()}</p>
              </div>
            )}

            {claim.approvedAt && (
              <div className="text-sm text-green-600 mb-2">
                <p>Approved by {claim.approvedBy} on {new Date(claim.approvedAt).toLocaleDateString()}</p>
              </div>
            )}

            {claim.rejectedAt && (
              <div className="bg-red-50 rounded-lg p-3 mb-2">
                <p className="text-sm text-red-800">
                  <strong>Rejected:</strong> {claim.rejectionReason}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  By {claim.rejectedBy} on {new Date(claim.rejectedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge variant="outline" className={getStatusColor(claim.status)}>
              {claim.status}
            </Badge>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(claim)}
              >
                <Eye size={14} className="mr-2" />
                View
              </Button>

              {claim.status === 'draft' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(claim.id, {})}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onSubmit(claim.id)}
                    disabled={isProcessing}
                  >
                    <Send size={14} className="mr-2" />
                    Submit
                  </Button>
                </>
              )}

              {claim.status === 'rejected' && (
                <Button 
                  size="sm"
                  onClick={() => onEdit(claim.id, { status: 'draft' })}
                  disabled={isProcessing}
                >
                  <Edit size={14} className="mr-2" />
                  Revise
                </Button>
              )}

              {claim.status === 'approved' && (
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