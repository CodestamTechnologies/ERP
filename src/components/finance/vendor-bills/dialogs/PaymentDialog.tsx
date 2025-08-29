import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Building2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: any;
  onProcessPayment: (billId: string, paymentData: any) => Promise<void>;
  isProcessing: boolean;
}

export const PaymentDialog = ({
  isOpen,
  onClose,
  bill,
  onProcessPayment,
  isProcessing
}: PaymentDialogProps) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'bank_transfer',
    paymentDate: new Date(),
    reference: '',
    notes: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'online', label: 'Online Payment' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bill) return;

    const payment = {
      ...paymentData,
      amount: parseFloat(paymentData.amount) || 0,
      paymentDate: format(paymentData.paymentDate, 'yyyy-MM-dd')
    };

    try {
      await onProcessPayment(bill.id, payment);
      // Reset form
      setPaymentData({
        amount: '',
        paymentMethod: 'bank_transfer',
        paymentDate: new Date(),
        reference: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const maxAmount = bill?.remainingAmount || 0;
    
    if (amount <= maxAmount) {
      setPaymentData(prev => ({ ...prev, amount: value }));
    }
  };

  const setFullAmount = () => {
    if (bill) {
      setPaymentData(prev => ({ ...prev, amount: bill.remainingAmount.toString() }));
    }
  };

  if (!bill) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2" size={20} />
            Process Payment
          </DialogTitle>
          <DialogDescription>
            Process payment for vendor bill and update payment records.
          </DialogDescription>
        </DialogHeader>

        {/* Bill Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Bill Information</h3>
            <Badge variant="outline" className={getStatusColor(bill.status)}>
              {bill.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Bill Number:</span>
              <div className="font-medium">{bill.billNumber}</div>
            </div>
            <div>
              <span className="text-gray-500">Vendor:</span>
              <div className="font-medium flex items-center">
                <Building2 size={14} className="mr-1" />
                {bill.vendorName}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Bill Date:</span>
              <div className="font-medium">{new Date(bill.billDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-500">Due Date:</span>
              <div className="font-medium">{new Date(bill.dueDate).toLocaleDateString()}</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-gray-500 block">Total Amount</span>
              <div className="font-bold text-lg">{formatCurrency(bill.amount)}</div>
            </div>
            <div className="text-center">
              <span className="text-gray-500 block">Paid Amount</span>
              <div className="font-bold text-lg text-green-600">{formatCurrency(bill.paidAmount)}</div>
            </div>
            <div className="text-center">
              <span className="text-gray-500 block">Remaining</span>
              <div className="font-bold text-lg text-red-600">{formatCurrency(bill.remainingAmount)}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹) *</Label>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  required
                  max={bill.remainingAmount}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={setFullAmount}
                  className="whitespace-nowrap"
                >
                  Full Amount
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Maximum: {formatCurrency(bill.remainingAmount)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={paymentData.paymentMethod} 
                onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(paymentData.paymentDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentData.paymentDate}
                    onSelect={(date) => {
                      if (date) {
                        setPaymentData(prev => ({ ...prev, paymentDate: date }));
                        setShowDatePicker(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <Label htmlFor="reference">Transaction Reference</Label>
              <Input
                id="reference"
                value={paymentData.reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="TXN123456789"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Payment Notes</Label>
            <Textarea
              id="notes"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this payment..."
              rows={3}
            />
          </div>

          {/* Payment Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span className="font-bold">
                  {paymentData.amount ? formatCurrency(parseFloat(paymentData.amount)) : '₹0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Remaining After Payment:</span>
                <span className="font-bold">
                  {paymentData.amount 
                    ? formatCurrency(bill.remainingAmount - parseFloat(paymentData.amount))
                    : formatCurrency(bill.remainingAmount)
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status After Payment:</span>
                <span className="font-bold">
                  {paymentData.amount && parseFloat(paymentData.amount) >= bill.remainingAmount 
                    ? 'Fully Paid' 
                    : 'Partially Paid'
                  }
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !paymentData.amount}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Process Payment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};