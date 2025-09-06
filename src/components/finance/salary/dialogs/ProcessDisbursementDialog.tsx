'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PayrollBatch } from '@/hooks/useSalaryDisbursement';
import { 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
  Send
} from 'lucide-react';

interface ProcessDisbursementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  batch: PayrollBatch | null;
  onProcess: (disbursementId: string) => Promise<void>;
  isProcessing: boolean;
}

export const ProcessDisbursementDialog = ({
  isOpen,
  onClose,
  batch,
  onProcess,
  isProcessing
}: ProcessDisbursementDialogProps) => {
  if (!batch) return null;

  const handleProcess = async () => {
    try {
      // In a real implementation, this would process all disbursements for the batch
      await onProcess(batch.id);
      onClose();
    } catch (error) {
      console.error('Error processing disbursement:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={24} className="text-blue-600" />
            Process Salary Disbursement
          </DialogTitle>
          <DialogDescription>
            Review and confirm the disbursement details before processing
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Batch Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Batch Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Batch Name</p>
                  <p className="font-medium">{batch.batchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pay Period</p>
                  <p className="font-medium">{batch.payPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee Count</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users size={16} />
                    {batch.employeeCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign size={16} />
                    ${batch.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disbursement Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-blue-900">Disbursement Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <p className="font-bold text-lg">{batch.employeeCount}</p>
                  <p className="text-sm text-blue-700">Employees</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                  <p className="font-bold text-lg">${(batch.totalAmount / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-green-700">Total Amount</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard size={24} className="text-purple-600" />
                  </div>
                  <p className="font-bold text-lg">{batch.employeeCount}</p>
                  <p className="text-sm text-purple-700">Bank Transfers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">Important Information</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Salary disbursements will be processed immediately</li>
                    <li>• Bank transfers typically take 1-2 business days to complete</li>
                    <li>• You will receive email notifications for successful/failed transfers</li>
                    <li>• Failed transfers can be retried from the disbursements tab</li>
                    <li>• This action cannot be undone once processing begins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pre-processing Checklist */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Pre-processing Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">All salary slips have been approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">Employee bank details are verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">Sufficient balance available in company account</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">Payroll batch has been approved by finance team</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Current Status</p>
              <p className="text-sm text-gray-600">Ready for disbursement processing</p>
            </div>
            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
              {batch.status}
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Process Disbursement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};