'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExpenseClaim } from '@/hooks/useExpenseClaims';
import { 
  Receipt,
  User,
  Building,
  DollarSign,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Paperclip
} from 'lucide-react';
import { useState } from 'react';

interface ClaimDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ExpenseClaim | null;
  onApprove: (claimId: string, comments?: string) => void;
  onReject: (claimId: string, reason: string) => void;
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

export const ClaimDetailsDialog = ({
  isOpen,
  onClose,
  claim,
  onApprove,
  onReject,
  isProcessing
}: ClaimDetailsDialogProps) => {
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!claim) return null;

  const handleApprove = () => {
    onApprove(claim.id, approvalComments);
    setApprovalComments('');
    setShowApprovalForm(false);
    onClose();
  };

  const handleReject = () => {
    onReject(claim.id, rejectionReason);
    setRejectionReason('');
    setShowRejectionForm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Receipt size={24} className="text-teal-600" />
            <div>
              <span>{claim.title}</span>
              <p className="text-sm text-gray-500 font-normal">{claim.claimNumber}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed view of expense claim and approval workflow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Claim Overview */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Claim Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Employee</p>
                    <p className="font-medium">{claim.employeeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium">{claim.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-bold text-lg">${claim.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(claim.status)}>
                  {claim.status}
                </Badge>
                <Badge variant="outline" className={getCategoryColor(claim.category)}>
                  {claim.category}
                </Badge>
              </div>

              {claim.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">{claim.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expense Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Expense Items</h3>
              <div className="space-y-3">
                {claim.expenses.map((expense, index) => (
                  <div key={expense.id} className="border rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="font-medium">{expense.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold">${expense.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Receipt</p>
                        {expense.receiptId ? (
                          <Button size="sm" variant="outline">
                            <Download size={12} className="mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">No receipt</span>
                        )}
                      </div>
                    </div>
                    {expense.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Notes</p>
                        <p className="text-sm text-gray-700">{expense.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receipts */}
          {claim.receipts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Paperclip size={18} />
                  Receipts ({claim.receipts.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {claim.receipts.map((receipt) => (
                    <div key={receipt.id} className="border rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{receipt.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(receipt.fileSize / 1024).toFixed(1)} KB • 
                          Uploaded {new Date(receipt.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download size={12} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval History */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Approval History</h3>
              <div className="space-y-3">
                {claim.approvalHistory.map((history) => (
                  <div key={history.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {history.action === 'approved' ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : history.action === 'rejected' ? (
                        <XCircle size={16} className="text-red-600" />
                      ) : (
                        <Clock size={16} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">{history.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">by {history.approverName}</p>
                      {history.comments && (
                        <p className="text-sm text-gray-700 mt-1 italic">{history.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rejection Details */}
          {claim.status === 'rejected' && claim.rejectionReason && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-red-900 mb-2">Rejection Details</h3>
                <p className="text-sm text-red-800">{claim.rejectionReason}</p>
                <p className="text-xs text-red-600 mt-2">
                  Rejected by {claim.rejectedBy} on {new Date(claim.rejectedAt!).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Approval Forms */}
          {showApprovalForm && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-900 mb-3">Approve Claim</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="approvalComments">Comments (Optional)</Label>
                    <Textarea
                      id="approvalComments"
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                      placeholder="Add any comments about this approval..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} disabled={isProcessing}>
                      <CheckCircle size={16} className="mr-2" />
                      Confirm Approval
                    </Button>
                    <Button variant="outline" onClick={() => setShowApprovalForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showRejectionForm && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-red-900 mb-3">Reject Claim</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejecting this claim..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleReject} 
                      disabled={isProcessing || !rejectionReason.trim()}
                      variant="destructive"
                    >
                      <XCircle size={16} className="mr-2" />
                      Confirm Rejection
                    </Button>
                    <Button variant="outline" onClick={() => setShowRejectionForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {claim.status === 'pending' && (
            <>
              <Button 
                variant="outline"
                onClick={() => setShowRejectionForm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
              <Button 
                onClick={() => setShowApprovalForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={16} className="mr-2" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};