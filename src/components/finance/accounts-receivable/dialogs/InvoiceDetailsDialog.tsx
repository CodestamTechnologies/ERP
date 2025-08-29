import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Building2, Calendar, DollarSign, Edit, CreditCard, Download } from 'lucide-react';

interface InvoiceDetailsDialogProps {
  isOpen: boolean; onClose: () => void; invoice: any; onEdit: () => void; onRecordPayment: () => void;
  formatCurrency: (amount: number) => string; formatDate: (date: string) => string;
}

export const InvoiceDetailsDialog = ({ isOpen, onClose, invoice, onEdit, onRecordPayment, formatCurrency, formatDate }: InvoiceDetailsDialogProps) => {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2" size={20} />Invoice Details - {invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{invoice.invoiceNumber}</h2>
              <Badge variant="outline" className={getStatusColor(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(invoice.amount)}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="mr-2" size={18} />Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-lg">{invoice.customerName}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2" size={18} />Date Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Invoice Date</label>
                  <div className="font-medium">{formatDate(invoice.invoiceDate)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Due Date</label>
                  <div className="font-medium">{formatDate(invoice.dueDate)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="mr-2" size={18} />Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(invoice.amount)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(invoice.paidAmount)}</div>
                <div className="text-sm text-gray-600">Paid Amount</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(invoice.remainingAmount)}</div>
                <div className="text-sm text-gray-600">Outstanding</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.amount - invoice.taxAmount)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2 col-span-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.items && invoice.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">Rate</th>
                      <th className="text-right p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="text-right p-2">{item.quantity}</td>
                        <td className="text-right p-2">{formatCurrency(item.rate)}</td>
                        <td className="text-right p-2">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {invoice.description && (
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <div className="bg-gray-50 rounded-lg p-3 mt-1">{invoice.description}</div>
            </div>
          )}

          {invoice.paidAmount > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Payment Progress</label>
              <div className="bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(invoice.paidAmount / invoice.amount) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{((invoice.paidAmount / invoice.amount) * 100).toFixed(1)}% collected</span>
                <span>{formatCurrency(invoice.remainingAmount)} remaining</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="flex space-x-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Edit size={16} className="mr-2" />Edit
            </Button>
            {invoice.status !== 'paid' && (
              <Button onClick={onRecordPayment} className="flex-1">
                <CreditCard size={16} className="mr-2" />Record Payment
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};