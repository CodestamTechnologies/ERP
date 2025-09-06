'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Approval } from '@/hooks/useExpenseClaims';
import { 
  Users,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  User,
  Building
} from 'lucide-react';
import { useState } from 'react';

interface BulkApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  approvals: Approval[];
  onBulkApprove: (claimIds: string[], comments?: string) => void;
  isProcessing: boolean;
}

export const BulkApprovalDialog = ({
  isOpen,
  onClose,
  approvals,
  onBulkApprove,
  isProcessing
}: BulkApprovalDialogProps) => {
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [comments, setComments] = useState('');

  const handleApprovalToggle = (approvalId: string, checked: boolean) => {
    if (checked) {
      setSelectedApprovals([...selectedApprovals, approvalId]);
    } else {
      setSelectedApprovals(selectedApprovals.filter(id => id !== approvalId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApprovals(approvals.map(approval => approval.claimId));
    } else {
      setSelectedApprovals([]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedApprovals.length === 0) return;
    
    onBulkApprove(selectedApprovals, comments);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedApprovals([]);
    setComments('');
  };

  const selectedTotal = approvals
    .filter(approval => selectedApprovals.includes(approval.claimId))
    .reduce((sum, approval) => sum + approval.amount, 0);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'urgent': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Bulk Approval
          </DialogTitle>
          <DialogDescription>
            Select multiple claims to approve at once
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-800">{approvals.length}</p>
                  <p className="text-sm text-blue-700">Total Claims</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">{selectedApprovals.length}</p>
                  <p className="text-sm text-blue-700">Selected</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">${selectedTotal.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Select All */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAll"
                checked={selectedApprovals.length === approvals.length && approvals.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="selectAll" className="font-medium">
                Select All Claims ({approvals.length})
              </Label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedApprovals.length} of {approvals.length} selected
            </div>
          </div>

          {/* Approvals List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {approvals.map((approval) => (
              <Card key={approval.id} className={`hover:bg-gray-50 ${
                selectedApprovals.includes(approval.claimId) ? 'ring-2 ring-blue-200 bg-blue-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={approval.id}
                        checked={selectedApprovals.includes(approval.claimId)}
                        onCheckedChange={(checked) => handleApprovalToggle(approval.claimId, !!checked)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{approval.claimTitle}</h4>
                          <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                            {approval.priority}
                          </Badge>
                          {approval.requiresAttention && (
                            <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
                              <AlertTriangle size={12} className="mr-1" />
                              Attention
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>{approval.employeeName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building size={14} className="text-gray-400" />
                            <span>{approval.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="font-semibold">${approval.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-gray-500">
                            Waiting {approval.daysWaiting} day(s)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Approval Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments that will be applied to all selected approvals..."
              rows={3}
            />
          </div>

          {/* Warning */}
          {selectedApprovals.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Bulk Approval Confirmation</h4>
                    <p className="text-sm text-yellow-800">
                      You are about to approve {selectedApprovals.length} expense claims 
                      totaling ${selectedTotal.toLocaleString()}. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkApprove}
            disabled={isProcessing || selectedApprovals.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                Approve {selectedApprovals.length} Claims
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};