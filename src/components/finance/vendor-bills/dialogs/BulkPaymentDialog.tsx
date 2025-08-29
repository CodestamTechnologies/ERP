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
import { CalendarIcon, CreditCard, Building2, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface BulkPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBills: Array<{
    id: string;
    billNumber: string;
    vendorName: string;
    amount: number;
    remainingAmount: number;
    dueDate: string;
    status: string;
  }>;
  onProcessBulkPayment: (billIds: string[], paymentData: any) => Promise<void>;
  isProcessing: boolean;
}

export const BulkPaymentDialog = ({
  isOpen,
  onClose,
  selectedBills,
  onProcessBulkPayment,
  isProcessing
}: BulkPaymentDialogProps) => {
  const [paymentData, setPaymentData] = useState({
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

  const totalAmount = selectedBills.reduce((sum, bill) => sum + bill.remainingAmount, 0);
  const uniqueVendors = [...new Set(selectedBills.map(bill => bill.vendorName))];
  const overdueBills = selectedBills.filter(bill => new Date(bill.dueDate) < new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payment = {
      ...paymentData,
      paymentDate: format(paymentData.paymentDate, 'yyyy-MM-dd'),
      totalAmount
    };

    try {
      await onProcessBulkPayment(selectedBills.map(bill => bill.id), payment);
      // Reset form
      setPaymentData({
        paymentMethod: 'bank_transfer',
        paymentDate: new Date(),
        reference: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error processing bulk payment:', error);
    }
  };

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2" size={20} />
            Bulk Payment Processing
          </DialogTitle>
          <DialogDescription>
            Process payments for multiple vendor bills simultaneously.
          </DialogDescription>
        </DialogHeader>

        {/* Summary Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Payment Summary</h3>
            {overdueBills.length > 0 && (
              <div className="flex items-center text-red-600">
                <AlertTriangle size={16} className="mr-1" />
                <span className="text-sm">{overdueBills.length} overdue bills</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{selectedBills.length}</div>
              <div className="text-sm text-gray-500">Bills Selected</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{uniqueVendors.length}</div>
              <div className="text-sm text-gray-500">Vendors</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{overdueBills.length}</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Selected Bills List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Selected Bills</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-blue-600" />
                  <div>
                    <div className="font-medium">{bill.billNumber}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Building2 size={12} className="mr-1" />
                      {bill.vendorName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(bill.remainingAmount)}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                    {new Date(bill.dueDate) < new Date() && (
                      <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reference">Batch Reference</Label>
              <Input
                id="reference"
                value={paymentData.reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="BATCH-2024-001"
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
              placeholder="Additional notes about this bulk payment..."
              rows={3}
            />
          </div>

          {/* Vendor Breakdown */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Payment Breakdown by Vendor</h4>
            <div className="space-y-2">
              {uniqueVendors.map(vendor => {
                const vendorBills = selectedBills.filter(bill => bill.vendorName === vendor);
                const vendorTotal = vendorBills.reduce((sum, bill) => sum + bill.remainingAmount, 0);
                return (
                  <div key={vendor} className="flex justify-between items-center text-sm">
                    <span className="flex items-center">
                      <Building2 size={14} className="mr-1" />
                      {vendor} ({vendorBills.length} bills)
                    </span>
                    <span className="font-bold">{formatCurrency(vendorTotal)}</span>
                  </div>
                );
              })}
              <Separator />
              <div className="flex justify-between items-center font-bold">
                <span>Total Payment Amount:</span>
                <span className="text-lg">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Warning for Overdue Bills */}
          {overdueBills.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700 mb-2">
                <AlertTriangle size={16} className="mr-2" />
                <span className="font-semibold">Overdue Bills Notice</span>
              </div>
              <p className="text-sm text-red-600">
                {overdueBills.length} of the selected bills are overdue. 
                Processing these payments may help avoid late fees and maintain good vendor relationships.
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || selectedBills.length === 0}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing {selectedBills.length} payments...
                </div>
              ) : (
                `Process ${selectedBills.length} Payments (${formatCurrency(totalAmount)})`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};