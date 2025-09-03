'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/hooks/useInvoices';
import { 
  FileText,
  User,
  Calendar,
  DollarSign,
  Eye,
  Send,
  Copy,
  Trash2,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PaymentData {
  amount: number;
  paymentMethod?: string;
  paymentDate?: string;
  reference?: string;
  notes?: string;
}

interface InvoiceCardProps {
  invoice: Invoice;
  onViewDetails: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
  onDuplicate: (invoiceId: string) => void;
  onDelete: (invoiceId: string) => void;
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return <CheckCircle size={16} className="text-green-600" />;
    case 'overdue':
      return <AlertTriangle size={16} className="text-red-600" />;
    case 'sent':
      return <Send size={16} className="text-blue-600" />;
    default:
      return <FileText size={16} className="text-gray-600" />;
  }
};

export const InvoiceCard = ({
  invoice,
  onViewDetails,
  onSend,
  onDuplicate,
  onDelete,
  onRecordPayment,
  isProcessing
}: InvoiceCardProps) => {
  const isOverdue = invoice.status === 'overdue';
  const isPaid = invoice.status === 'paid';
  const isDraft = invoice.status === 'draft';

  return (
    <Card className={`hover:shadow-sm transition-shadow ${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500">{invoice.customerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium text-sm truncate">{invoice.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">${invoice.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="font-bold text-lg">${invoice.balanceAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {invoice.paidAmount > 0 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Paid:</strong> ${invoice.paidAmount.toLocaleString()} 
                  {invoice.payments.length > 0 && (
                    <span className="ml-2">
                      (Last payment: {new Date(invoice.payments[invoice.payments.length - 1].paymentDate).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            )}

            {isOverdue && (
              <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <p className="text-sm text-red-800">
                  <strong>Overdue:</strong> Payment was due {Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
            )}

            {invoice.notes && (
              <div className="text-sm text-gray-600 mb-2">
                <p><strong>Notes:</strong> {invoice.notes}</p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Created: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              {invoice.sentAt && (
                <p>Sent: {new Date(invoice.sentAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(invoice.status)}
              <Badge variant="outline" className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(invoice)}
              >
                <Eye size={14} className="mr-2" />
                View
              </Button>

              {isDraft && (
                <Button 
                  size="sm"
                  onClick={() => onSend(invoice)}
                  disabled={isProcessing}
                >
                  <Send size={14} className="mr-2" />
                  Send
                </Button>
              )}

              {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                <Button 
                  size="sm"
                  onClick={() => onRecordPayment(invoice.id, { amount: invoice.balanceAmount })}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard size={14} className="mr-2" />
                  Record Payment
                </Button>
              )}

              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDuplicate(invoice.id)}
                disabled={isProcessing}
              >
                <Copy size={14} className="mr-2" />
                Duplicate
              </Button>

              {isDraft && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDelete(invoice.id)}
                  disabled={isProcessing}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};