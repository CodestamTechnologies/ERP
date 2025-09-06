'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Invoice } from '@/hooks/useInvoices';
import { FileText, User, Calendar, DollarSign, Send, CreditCard, Printer, Download } from 'lucide-react';
interface PaymentData {
  amount: number;
  paymentDate?: string;
  paymentMethod?: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  reference?: string;
  notes?: string;
}
interface InvoiceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSend: (invoice: Invoice) => void;
  onRecordPayment: (invoiceId: string, paymentData: PaymentData) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'sent': 'text-blue-600 bg-blue-50 border-blue-200',
    'paid': 'text-green-600 bg-green-50 border-green-200',
    'overdue': 'text-red-600 bg-red-50 border-red-200',
    'cancelled': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const InvoiceDetailsDialog = ({
  isOpen,
  onClose,
  invoice,
  onSend,
  onRecordPayment,
  isProcessing
}: InvoiceDetailsDialogProps) => {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText size={24} className="text-indigo-600" />
            <div>
              <span>{invoice.invoiceNumber}</span>
              <p className="text-sm text-gray-500 font-normal">{invoice.customerName}</p>
            </div>
          </DialogTitle>
          <DialogDescription>Invoice details and payment information</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invoice Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                  <p className="text-gray-600">{invoice.customerName}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-gray-500">Issue Date</p><p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-gray-500">Due Date</p><p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-gray-500">Total Amount</p><p className="font-bold text-lg">${invoice.totalAmount.toLocaleString()}</p></div>
                <div><p className="text-xs text-gray-500">Balance</p><p className="font-bold text-lg">${invoice.balanceAmount.toLocaleString()}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Invoice Items</h3>
              <div className="space-y-3">
                {invoice.lineItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="md:col-span-2"><p className="font-medium">{item.description}</p></div>
                      <div><p className="text-sm">Qty: {item.quantity}</p></div>
                      <div><p className="text-sm">Price: ${item.unitPrice.toFixed(2)}</p></div>
                      <div><p className="font-bold">${item.totalAmount.toFixed(2)}</p></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div></div>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${invoice.subtotal.toFixed(2)}</span></div>
                    {invoice.discountAmount > 0 && <div className="flex justify-between"><span>Discount:</span><span>-${invoice.discountAmount.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span>Tax:</span><span>${invoice.taxAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>${invoice.totalAmount.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Payment History</h3>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">${payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}</p>
                      </div>
                      {payment.reference && <p className="text-sm text-gray-500">Ref: {payment.reference}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <Card>
              <CardContent className="p-4">
                {invoice.notes && <div className="mb-4"><h4 className="font-medium mb-2">Notes</h4><p className="text-sm text-gray-700">{invoice.notes}</p></div>}
                {invoice.terms && <div><h4 className="font-medium mb-2">Terms</h4><p className="text-sm text-gray-700">{invoice.terms}</p></div>}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="outline"><Printer size={16} className="mr-2" />Print</Button>
          <Button variant="outline"><Download size={16} className="mr-2" />Download</Button>
          
          {invoice.status === 'draft' && (
            <Button onClick={() => onSend(invoice)} disabled={isProcessing}>
              <Send size={16} className="mr-2" />Send Invoice
            </Button>
          )}
          
          {(invoice.status === 'sent' || invoice.status === 'overdue') && invoice.balanceAmount > 0 && (
            <Button onClick={() => onRecordPayment(invoice.id, { amount: invoice.balanceAmount })} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              <CreditCard size={16} className="mr-2" />Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};