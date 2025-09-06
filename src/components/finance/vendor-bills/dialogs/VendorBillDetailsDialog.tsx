import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Building2, Calendar, DollarSign, 
  Edit, CreditCard, Download, Mail, Phone 
} from 'lucide-react';

interface VendorBill {
  id: string;
  billNumber: string;
  vendorName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  taxAmount: number;
  discountAmount: number;
  status: string;
  priority: string;
  billDate: string;
  dueDate: string;
  paymentTerms: string;
  reference?: string;
  category: string;
  description?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  attachments?: string[];
}

interface VendorBillDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: VendorBill | null;
  onEdit: () => void;
  onProcessPayment: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export const VendorBillDetailsDialog = ({
  isOpen,
  onClose,
  bill,
  onEdit,
  onProcessPayment,
  formatCurrency,
  formatDate
}: VendorBillDetailsDialogProps) => {
  if (!bill) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2" size={20} />
            Bill Details - {bill.billNumber}
          </DialogTitle>
          <DialogDescription>
            Complete information and payment history for this vendor bill.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{bill.billNumber}</h2>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={getStatusColor(bill.status)}>
                  {bill.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(bill.priority)}>
                  {bill.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(bill.amount)}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
          </div>

          <Separator />

          {/* Vendor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="mr-2" size={18} />
                Vendor Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Vendor Name</label>
                  <div className="font-medium">{bill.vendorName}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Terms</label>
                  <div className="font-medium">{bill.paymentTerms}</div>
                </div>
                {bill.reference && (
                  <div>
                    <label className="text-sm text-gray-500">Reference/PO</label>
                    <div className="font-medium">{bill.reference}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2" size={18} />
                Date Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Bill Date</label>
                  <div className="font-medium">{formatDate(bill.billDate)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Due Date</label>
                  <div className="font-medium">{formatDate(bill.dueDate)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Days Until Due</label>
                  <div className={`font-medium ${
                    daysUntilDue < 0 ? 'text-red-600' :
                    daysUntilDue <= 7 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                     daysUntilDue === 0 ? 'Due today' :
                     `${daysUntilDue} days remaining`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="mr-2" size={18} />
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(bill.amount)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(bill.paidAmount)}</div>
                <div className="text-sm text-gray-600">Paid Amount</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(bill.remainingAmount)}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(bill.amount - bill.taxAmount + bill.discountAmount)}
                  </span>
                </div>
                {bill.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(bill.discountAmount)}
                    </span>
                  </div>
                )}
                {bill.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span className="font-medium">{formatCurrency(bill.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(bill.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Category */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Category</label>
                <div className="font-medium">
                  <Badge variant="secondary">{bill.category}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Created</label>
                <div className="font-medium">{formatDate(bill.createdAt)}</div>
              </div>
            </div>
            
            {bill.description && (
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <div className="bg-gray-50 rounded-lg p-3 mt-1">
                  {bill.description}
                </div>
              </div>
            )}
          </div>

          {/* Approval Information */}
          {bill.approvedBy && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Approval Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Approved By:</span>
                  <div className="font-medium">{bill.approvedBy}</div>
                </div>
                <div>
                  <span className="text-gray-500">Approved On:</span>
                  <div className="font-medium">{formatDate(bill.approvedAt!)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {bill.attachments && bill.attachments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Attachments</label>
              <div className="space-y-2">
                {bill.attachments.map((attachment: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-blue-600" />
                      <span className="text-sm">{attachment}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Progress */}
          {bill.paidAmount > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Payment Progress</label>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(bill.paidAmount / bill.amount) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{((bill.paidAmount / bill.amount) * 100).toFixed(1)}% paid</span>
                <span>{formatCurrency(bill.remainingAmount)} remaining</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="flex space-x-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
            {bill.status !== 'paid' && (
              <Button onClick={onProcessPayment} className="flex-1">
                <CreditCard size={16} className="mr-2" />
                Process Payment
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};