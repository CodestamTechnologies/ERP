'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bill } from '@/hooks/useInvoices';
import { 
  FileText,
  Building,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface BillCardProps {
  bill: Bill;
  onViewDetails: (bill: Bill) => void;
  onEdit: (billId: string, updates: any) => void;
  onDelete: (billId: string) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'approved': 'text-blue-600 bg-blue-50 border-blue-200',
    'paid': 'text-green-600 bg-green-50 border-green-200',
    'overdue': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return <CheckCircle size={16} className="text-green-600" />;
    case 'overdue':
      return <AlertTriangle size={16} className="text-red-600" />;
    case 'pending':
      return <Clock size={16} className="text-yellow-600" />;
    case 'approved':
      return <CheckCircle size={16} className="text-blue-600" />;
    default:
      return <FileText size={16} className="text-gray-600" />;
  }
};

export const BillCard = ({
  bill,
  onViewDetails,
  onEdit,
  onDelete,
  isProcessing
}: BillCardProps) => {
  const isOverdue = bill.status === 'overdue';
  const isPaid = bill.status === 'paid';
  const isDraft = bill.status === 'draft';

  return (
    <Card className={`hover:shadow-sm transition-shadow ${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{bill.billNumber}</h3>
                <p className="text-sm text-gray-500">{bill.vendorName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="font-medium text-sm truncate">{bill.vendorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium text-sm">
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">${bill.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="font-bold text-lg">${bill.balanceAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {bill.paidAmount > 0 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>Paid:</strong> ${bill.paidAmount.toLocaleString()}
                  {bill.payments.length > 0 && (
                    <span className="ml-2">
                      (Last payment: {new Date(bill.payments[bill.payments.length - 1].paymentDate).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            )}

            {isOverdue && (
              <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <p className="text-sm text-red-800">
                  <strong>Overdue:</strong> Payment was due {Math.ceil((new Date().getTime() - new Date(bill.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
            )}

            {bill.notes && (
              <div className="text-sm text-gray-600 mb-2">
                <p><strong>Notes:</strong> {bill.notes}</p>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Bill Date: {new Date(bill.billDate).toLocaleDateString()}</p>
              <p>Created: {new Date(bill.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(bill.status)}
              <Badge variant="outline" className={getStatusColor(bill.status)}>
                {bill.status}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewDetails(bill)}
              >
                <Eye size={14} className="mr-2" />
                View
              </Button>

              {(isDraft || bill.status === 'pending') && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit(bill.id, {})}
                  disabled={isProcessing}
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
              )}

              {bill.status === 'approved' && (
                <Button 
                  size="sm"
                  onClick={() => onEdit(bill.id, { status: 'paid', paidAmount: bill.totalAmount, balanceAmount: 0 })}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={14} className="mr-2" />
                  Mark Paid
                </Button>
              )}

              {isDraft && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDelete(bill.id)}
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