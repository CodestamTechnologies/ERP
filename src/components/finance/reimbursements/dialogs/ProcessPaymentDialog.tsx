'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reimbursement, PaymentMethod } from '@/hooks/useReimbursements';
import { 
  Send,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface ProcessPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reimbursement: Reimbursement | null;
  paymentMethods: PaymentMethod[];
  onProcess: (reimbursementId: string, paymentMethodId?: string) => void;
  isProcessing: boolean;
}

export const ProcessPaymentDialog = ({
  isOpen,
  onClose,
  reimbursement,
  paymentMethods,
  onProcess,
  isProcessing
}: ProcessPaymentDialogProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [bankAccount, setBankAccount] = useState('');
  const [notes, setNotes] = useState('');

  if (!reimbursement) return null;

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
  const defaultMethod = paymentMethods.find(m => m.isDefault);

  const handleProcess = () => {
    const methodId = selectedPaymentMethod || defaultMethod?.id;
    onProcess(reimbursement.id, methodId);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedPaymentMethod('');
    setBankAccount('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={24} className="text-blue-600" />
            Process Payment
          </DialogTitle>
          <DialogDescription>
            Process payment for approved reimbursement
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Reimbursement Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Reimbursement Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Employee</p>
                    <p className="font-medium">{reimbursement.employeeName}</p>
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
                    <p className="text-xs text-gray-500">Approved Date</p>
                    <p className="font-medium">
                      {reimbursement.approvedDate ? new Date(reimbursement.approvedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                      {reimbursement.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-700">{reimbursement.title}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder={defaultMethod ? `${defaultMethod.name} (Default)` : "Select payment method"} />
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
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Method Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Type</p>
                      <p className="font-semibold capitalize">{selectedMethod.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Processing Time</p>
                      <p className="font-semibold">{selectedMethod.settings.processingTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Fees</p>
                      <p className="font-semibold">
                        {selectedMethod.settings.fees === 0 ? 'Free' : `$${selectedMethod.settings.fees}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">Transaction Limit</p>
                      <p className="font-semibold">
                        ${selectedMethod.settings.limits?.perTransaction?.toLocaleString() || 'No limit'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bank Account (if applicable) */}
            {(selectedMethod?.type === 'bank_transfer' || (!selectedMethod && defaultMethod?.type === 'bank_transfer')) && (
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account (Optional)</Label>
                <Input
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Account ending in... (leave blank for default)"
                />
              </div>
            )}

            {/* Processing Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Processing Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this payment processing..."
                rows={3}
              />
            </div>
          </div>

          {/* Processing Information */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">Payment Processing Information</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Payment will be processed immediately upon confirmation</li>
                    <li>• Processing time depends on the selected payment method</li>
                    <li>• Employee will receive notification once payment is completed</li>
                    <li>• Transaction details will be recorded for audit purposes</li>
                    <li>• This action cannot be undone once processing begins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-3">Processing Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                  <p className="font-bold text-lg text-green-800">${reimbursement.amount.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Payment Amount</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                  <p className="font-bold text-lg text-blue-800">
                    {(selectedMethod || defaultMethod)?.name || 'Default Method'}
                  </p>
                  <p className="text-sm text-blue-700">Payment Method</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                  <p className="font-bold text-lg text-purple-800">
                    {(selectedMethod || defaultMethod)?.settings.processingTime || 'N/A'}
                  </p>
                  <p className="text-sm text-purple-700">Processing Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
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
                Process Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};