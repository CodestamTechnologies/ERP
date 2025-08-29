'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/hooks/useInvoices';
import { CreditCard, DollarSign, Calendar, User, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentTrackingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onRecordPayment: (invoiceId: string, paymentData: any) => void;
  isProcessing: boolean;
}

export const PaymentTrackingDialog = ({
  isOpen,
  onClose,
  invoices,
  onRecordPayment,
  isProcessing
}: PaymentTrackingDialogProps) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const outstandingInvoices = invoices.filter(inv => inv.balanceAmount > 0);
  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvoiceId || !paymentAmount) return;

    const paymentData = {
      amount: parseFloat(paymentAmount),
      paymentDate,
      paymentMethod,
      reference,
      notes
    };

    onRecordPayment(selectedInvoiceId, paymentData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedInvoiceId('');
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('bank_transfer');
    setReference('');
    setNotes('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'sent': 'text-blue-600 bg-blue-50 border-blue-200',
      'overdue': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={24} className="text-green-600" />
            Payment Tracking
          </DialogTitle>
          <DialogDescription>
            Record payments for outstanding invoices
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Outstanding Invoices Summary */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-orange-900 mb-3">Outstanding Invoices Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-800">{outstandingInvoices.length}</p>
                  <p className="text-sm text-orange-700">Outstanding</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-800">
                    ${outstandingInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-700">Total Amount</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-800">
                    {outstandingInvoices.filter(inv => inv.status === 'overdue').length}
                  </p>
                  <p className="text-sm text-orange-700">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Invoices List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <h4 className="font-medium">Outstanding Invoices</h4>
            {outstandingInvoices.map((invoice) => (
              <Card key={invoice.id} className={`cursor-pointer transition-colors ${
                selectedInvoiceId === invoice.id ? 'ring-2 ring-blue-200 bg-blue-50' : 'hover:bg-gray-50'
              }`} onClick={() => setSelectedInvoiceId(invoice.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{invoice.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${invoice.balanceAmount.toLocaleString()}</p>
                      <Badge variant="outline" className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          {selectedInvoice && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-green-900 mb-3">Record Payment for {selectedInvoice.invoiceNumber}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-green-700">Customer</p><p className="font-semibold">{selectedInvoice.customerName}</p></div>
                    <div><p className="text-green-700">Total Amount</p><p className="font-semibold">${selectedInvoice.totalAmount.toLocaleString()}</p></div>
                    <div><p className="text-green-700">Paid Amount</p><p className="font-semibold">${selectedInvoice.paidAmount.toLocaleString()}</p></div>
                    <div><p className="text-green-700">Balance Due</p><p className="font-semibold">${selectedInvoice.balanceAmount.toLocaleString()}</p></div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedInvoice.balanceAmount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={selectedInvoice.balanceAmount.toString()}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPaymentAmount(selectedInvoice.balanceAmount.toString())}
                  >
                    Full Amount
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Transaction ID, Check #, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about this payment..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isProcessing || !paymentAmount}>
                  {isProcessing ? (
                    <>Recording...</>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Record Payment
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedInvoiceId('')}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};