'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reimbursement, PaymentMethod } from '@/hooks/useReimbursements';
import { 
  Send,
  Users,
  DollarSign,
  AlertTriangle,
  User,
  Building,
  CreditCard
} from 'lucide-react';
import { useState } from 'react';

interface BulkPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reimbursements: Reimbursement[];
  paymentMethods: PaymentMethod[];
  onBulkProcess: (reimbursementIds: string[], paymentMethodId: string) => void;
  isProcessing: boolean;
}

export const BulkPaymentDialog = ({
  isOpen,
  onClose,
  reimbursements,
  paymentMethods,
  onBulkProcess,
  isProcessing
}: BulkPaymentDialogProps) => {
  const [selectedReimbursements, setSelectedReimbursements] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleReimbursementToggle = (reimbursementId: string, checked: boolean) => {
    if (checked) {
      setSelectedReimbursements([...selectedReimbursements, reimbursementId]);
    } else {
      setSelectedReimbursements(selectedReimbursements.filter(id => id !== reimbursementId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReimbursements(reimbursements.map(reimb => reimb.id));
    } else {
      setSelectedReimbursements([]);
    }
  };

  const handleBulkProcess = () => {
    if (selectedReimbursements.length === 0 || !selectedPaymentMethod) return;
    
    onBulkProcess(selectedReimbursements, selectedPaymentMethod);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedReimbursements([]);
    setSelectedPaymentMethod('');
    setNotes('');
  };

  const selectedTotal = reimbursements
    .filter(reimb => selectedReimbursements.includes(reimb.id))
    .reduce((sum, reimb) => sum + reimb.amount, 0);

  const defaultMethod = paymentMethods.find(m => m.isDefault);
  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Bulk Payment Processing
          </DialogTitle>
          <DialogDescription>
            Select multiple reimbursements to process payments at once
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-800">{reimbursements.length}</p>
                  <p className="text-sm text-blue-700">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">{selectedReimbursements.length}</p>
                  <p className="text-sm text-blue-700">Selected</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-800">${selectedTotal.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method for all payments" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.filter(m => m.isActive).map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        <span>{method.name}</span>
                        {method.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Details */}
            {selectedMethod && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-900 mb-2">Selected Payment Method</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-green-700">Method</p>
                      <p className="font-semibold">{selectedMethod.name}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Type</p>
                      <p className="font-semibold capitalize">{selectedMethod.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Processing Time</p>
                      <p className="font-semibold">{selectedMethod.settings.processingTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Fees</p>
                      <p className="font-semibold">
                        {selectedMethod.settings.fees === 0 ? 'Free' : `$${selectedMethod.settings.fees} each`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAll"
                checked={selectedReimbursements.length === reimbursements.length && reimbursements.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="selectAll" className="font-medium">
                Select All Reimbursements ({reimbursements.length})
              </Label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedReimbursements.length} of {reimbursements.length} selected
            </div>
          </div>

          {/* Reimbursements List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reimbursements.map((reimbursement) => (
              <Card key={reimbursement.id} className={`hover:bg-gray-50 ${
                selectedReimbursements.includes(reimbursement.id) ? 'ring-2 ring-blue-200 bg-blue-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={reimbursement.id}
                        checked={selectedReimbursements.includes(reimbursement.id)}
                        onCheckedChange={(checked) => handleReimbursementToggle(reimbursement.id, !!checked)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{reimbursement.title}</h4>
                          <Badge variant="outline" className={
                            reimbursement.priority === 'urgent' ? 'text-red-600 bg-red-50 border-red-200' :
                            reimbursement.priority === 'high' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                            'text-yellow-600 bg-yellow-50 border-yellow-200'
                          }>
                            {reimbursement.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>{reimbursement.employeeName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building size={14} className="text-gray-400" />
                            <span>{reimbursement.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="font-semibold">${reimbursement.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-gray-500">
                            {reimbursement.reimbursementNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Processing Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Processing Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes that will be applied to all selected payments..."
              rows={3}
            />
          </div>

          {/* Warning */}
          {selectedReimbursements.length > 0 && selectedPaymentMethod && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Bulk Payment Confirmation</h4>
                    <p className="text-sm text-yellow-800">
                      You are about to process {selectedReimbursements.length} payments 
                      totaling ${selectedTotal.toLocaleString()} using {selectedMethod?.name}. 
                      This action cannot be undone.
                    </p>
                    {selectedMethod?.settings.fees && selectedMethod.settings.fees > 0 && (
                      <p className="text-sm text-yellow-800 mt-1">
                        <strong>Note:</strong> Processing fees of ${selectedMethod.settings.fees} 
                        will apply to each payment (Total: ${(selectedMethod.settings.fees * selectedReimbursements.length).toFixed(2)}).
                      </p>
                    )}
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
            onClick={handleBulkProcess}
            disabled={isProcessing || selectedReimbursements.length === 0 || !selectedPaymentMethod}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Process {selectedReimbursements.length} Payments
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};