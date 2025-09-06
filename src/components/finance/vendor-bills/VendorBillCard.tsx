import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Eye, CreditCard, CalendarDays, FileText, Clock, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';

interface VendorBillCardProps {
  bill: { id: string; billNumber: string; vendorName: string; billDate: string; dueDate: string;
    amount: number; paidAmount: number; remainingAmount: number; status: string; priority: string;
    description?: string; category: string; };
  isSelected: boolean; onSelect: (selected: boolean) => void; onViewDetails: () => void;
  onProcessPayment: () => void; onSchedulePayment: () => void; formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string; getDaysUntilDue: (date: string) => number;
  getStatusColor: (status: string) => string; getPriorityColor: (priority: string) => string;
}

export const VendorBillCard = ({
  bill,
  isSelected,
  onSelect,
  onViewDetails,
  onProcessPayment,
  onSchedulePayment,
  formatCurrency,
  formatDate,
  getDaysUntilDue,
  getStatusColor,
  getPriorityColor
}: VendorBillCardProps) => {
  const daysUntilDue = getDaysUntilDue(bill.dueDate);
  
  const getStatusIcon = () => {
    switch (bill.status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'overdue': return <AlertTriangle size={16} className="text-red-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      default: return <FileText size={16} className="text-blue-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${bill.status === 'overdue' ? 'border-red-200' : ''}`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
              />
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <h3 className="font-semibold text-gray-900">{bill.billNumber}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building2 size={14} className="mr-1" />
                  {bill.vendorName}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge variant="outline" className={getStatusColor(bill.status)}>
                {bill.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(bill.priority)}>
                {bill.priority}
              </Badge>
            </div>
          </div>

          {/* Amount Information */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Amount:</span>
              <span className="font-bold text-lg">{formatCurrency(bill.amount)}</span>
            </div>
            
            {bill.paidAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Paid:</span>
                <span className="text-green-600 font-medium">{formatCurrency(bill.paidAmount)}</span>
              </div>
            )}
            
            {bill.remainingAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Remaining:</span>
                <span className="text-red-600 font-medium">{formatCurrency(bill.remainingAmount)}</span>
              </div>
            )}
          </div>

          {/* Date Information */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Bill Date:</span>
              <span>{formatDate(bill.billDate)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Due Date:</span>
              <span className={
                daysUntilDue < 0 ? 'text-red-600 font-medium' :
                daysUntilDue <= 7 ? 'text-yellow-600 font-medium' : 'text-gray-900'
              }>
                {formatDate(bill.dueDate)}
              </span>
            </div>
            <div className="text-center">
              <span className={`text-xs px-2 py-1 rounded-full ${
                daysUntilDue < 0 ? 'bg-red-100 text-red-700' :
                daysUntilDue <= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                 daysUntilDue === 0 ? 'Due today' :
                 `${daysUntilDue} days left`}
              </span>
            </div>
          </div>

          {/* Description */}
          {bill.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{bill.description}</p>
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <Badge variant="secondary" className="text-xs">
              {bill.category}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              <Eye size={14} className="mr-1" />
              View
            </Button>
            
            {bill.status !== 'paid' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onProcessPayment}
                  className="flex-1"
                >
                  <CreditCard size={14} className="mr-1" />
                  Pay
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSchedulePayment}
                  className="flex-1"
                >
                  <CalendarDays size={14} className="mr-1" />
                  Schedule
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};