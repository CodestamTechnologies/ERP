import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CreditCard, CalendarDays, AlertTriangle, Clock, Building2, FileText, TrendingUp } from 'lucide-react';

interface DuePaymentCardProps {
  payment: { id: string; billId: string; billNumber: string; vendorName: string;
    amount: number; dueDate: string; priority: string; daysOverdue: number; status: string; };
  onProcessPayment: () => void; onSchedulePayment: () => void; formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string; getDaysUntilDue: (date: string) => number;
}

export const DuePaymentCard = ({
  payment,
  onProcessPayment,
  onSchedulePayment,
  formatCurrency,
  formatDate,
  getDaysUntilDue
}: DuePaymentCardProps) => {
  const daysUntilDue = getDaysUntilDue(payment.dueDate);
  
  const getStatusColor = () => {
    switch (payment.status) {
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'due_today': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = () => {
    switch (payment.priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'overdue': return <AlertTriangle size={20} className="text-red-600" />;
      case 'due_today': return <Clock size={20} className="text-orange-600" />;
      case 'upcoming': return <TrendingUp size={20} className="text-blue-600" />;
      default: return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getUrgencyLevel = () => {
    if (daysUntilDue < 0) return 'OVERDUE';
    if (daysUntilDue === 0) return 'DUE TODAY';
    if (daysUntilDue <= 3) return 'DUE SOON';
    return 'UPCOMING';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-300 ${
        payment.status === 'overdue' ? 'border-red-200 bg-red-50' :
        payment.status === 'due_today' ? 'border-orange-200 bg-orange-50' :
        'border-blue-200'
      }`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-gray-900">{payment.billNumber}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building2 size={14} className="mr-1" />
                  {payment.vendorName}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge variant="outline" className={getStatusColor()}>
                {getUrgencyLevel()}
              </Badge>
              <Badge variant="outline" className={getPriorityColor()}>
                {payment.priority} priority
              </Badge>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(payment.amount)}
            </div>
            <div className="text-sm text-gray-500">Payment Amount</div>
          </div>

          {/* Due Date Information */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Due Date:</span>
              <span className="font-medium">{formatDate(payment.dueDate)}</span>
            </div>
            
            <div className="text-center">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                daysUntilDue < 0 ? 'bg-red-100 text-red-700' :
                daysUntilDue === 0 ? 'bg-orange-100 text-orange-700' :
                daysUntilDue <= 3 ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                 daysUntilDue === 0 ? 'Due today' :
                 `${daysUntilDue} days remaining`}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          {payment.status === 'overdue' && (
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">
                  Action Required - Payment Overdue
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant={payment.status === 'overdue' ? 'default' : 'outline'}
              size="sm"
              onClick={onProcessPayment}
              className="flex-1"
            >
              <CreditCard size={14} className="mr-1" />
              {payment.status === 'overdue' ? 'Pay Now' : 'Process Payment'}
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
          </div>

          {/* Late Fee Warning */}
          {payment.status === 'overdue' && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center">
              <span className="text-xs text-red-700">
                ⚠️ Late fees may apply for overdue payments
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};