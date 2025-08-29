import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentRecordDialogProps {
  isOpen: boolean; onClose: () => void; invoice: any;
  onRecordPayment: (invoiceId: string, paymentData: any) => Promise<void>;
  isProcessing: boolean;
}

export const PaymentRecordDialog = ({ isOpen, onClose, invoice, onRecordPayment, isProcessing }: PaymentRecordDialogProps) => {
  const [paymentData, setPaymentData] = useState({
    amount: '', paymentMethod: 'bank_transfer', paymentDate: new Date(), reference: '', notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' }, { value: 'credit_card', label: 'Credit Card' },
    { value: 'online', label: 'Online Payment' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    const payment = {
      ...paymentData, amount: parseFloat(paymentData.amount) || 0,
      paymentDate: format(paymentData.paymentDate, 'yyyy-MM-dd')
    };

    try {
      await onRecordPayment(invoice.id, payment);
      setPaymentData({ amount: '', paymentMethod: 'bank_transfer', paymentDate: new Date(), reference: '', notes: '' });
    } catch (error) { console.error('Error recording payment:', error); }
  };

  const setFullAmount = () => {
    if (invoice) setPaymentData(prev => ({ ...prev, amount: invoice.remainingAmount.toString() }));
  };

  if (!invoice) return null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2" size={20} />Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Invoice Information</h3>
            <Badge variant="outline">{invoice.status}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Invoice:</span><div className="font-medium">{invoice.invoiceNumber}</div></div>
            <div><span className="text-gray-500">Customer:</span><div className="font-medium">{invoice.customerName}</div></div>
            <div><span className="text-gray-500">Total:</span><div className="font-bold text-lg">{formatCurrency(invoice.amount)}</div></div>
            <div><span className="text-gray-500">Outstanding:</span><div className="font-bold text-lg text-red-600">{formatCurrency(invoice.remainingAmount)}</div></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹) *</Label>
              <div className="flex space-x-2">
                <Input id="amount" type="number" step="0.01" value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00" required max={invoice.remainingAmount} />
                <Button type="button" variant="outline" onClick={setFullAmount}>Full Amount</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))} required>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(paymentData.paymentDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={paymentData.paymentDate}
                    onSelect={(date) => {
                      if (date) {
                        setPaymentData(prev => ({ ...prev, paymentDate: date }));
                        setShowDatePicker(false);
                      }
                    }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" value={paymentData.reference}
                onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Transaction reference" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..." rows={3} />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span className="font-bold">{paymentData.amount ? formatCurrency(parseFloat(paymentData.amount)) : '₹0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining After Payment:</span>
                <span className="font-bold">
                  {paymentData.amount ? formatCurrency(invoice.remainingAmount - parseFloat(paymentData.amount)) : formatCurrency(invoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button type="submit" disabled={isProcessing || !paymentData.amount}>
              {isProcessing ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};