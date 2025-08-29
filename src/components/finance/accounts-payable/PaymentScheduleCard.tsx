import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Building2, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Send,
  Edit,
  FileText
} from 'lucide-react';
import { PaymentSchedule } from '@/types/accountsPayable';

interface PaymentScheduleCardProps {
  payment: PaymentSchedule;
  onProcessPayment: (payment: PaymentSchedule) => void;
  onReschedule: (paymentId: string, scheduleData: any) => void;
  isProcessing: boolean;
}

export const PaymentScheduleCard = ({
  payment,
  onProcessPayment,
  onReschedule,
  isProcessing
}: PaymentScheduleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return '🏦';
      case 'check':
        return '📝';
      case 'cash':
        return '💵';
      case 'credit_card':
        return '💳';
      case 'online':
        return '🌐';
      default:
        return '💰';
    }
  };

  const getDaysUntilScheduled = () => {
    const scheduledDate = new Date(payment.scheduledDate);
    const today = new Date();
    const diffTime = scheduledDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilScheduled = getDaysUntilScheduled();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'scheduled':
        return <Calendar size={16} className="text-orange-600" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'cancelled':
        return <AlertTriangle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {getStatusIcon(payment.status)}
            </div>

            {/* Payment Information */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={18} className="text-gray-600" />
                  <div>
                    <h3 className="font-semibold">{payment.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">{payment.vendorName}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(payment.status)}>
                  {payment.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Amount */}
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">₹{payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Payment Amount</p>
                  </div>
                </div>

                {/* Scheduled Date */}
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(payment.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${
                      daysUntilScheduled < 0 ? 'text-red-500' : 
                      daysUntilScheduled <= 3 ? 'text-orange-500' : 'text-gray-500'
                    }`}>
                      {daysUntilScheduled < 0 ? `${Math.abs(daysUntilScheduled)} days overdue` :
                       daysUntilScheduled === 0 ? 'Due today' :
                       `${daysUntilScheduled} days remaining`}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {payment.paymentMethod.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500">Payment Method</p>
                  </div>
                </div>

                {/* Reference/Approval */}
                <div className="flex items-center space-x-2">
                  {payment.approvalRequired ? (
                    <AlertTriangle size={16} className="text-yellow-500" />
                  ) : (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {payment.referenceNumber || 'Pending'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.approvalRequired ? 'Approval Required' : 'Auto-approved'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
                  <span>By: {payment.createdBy}</span>
                  {payment.actualPaymentDate && (
                    <span>Paid: {new Date(payment.actualPaymentDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                {payment.notes && (
                  <div className="text-xs text-gray-600 max-w-xs truncate">
                    Note: {payment.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {payment.status === 'scheduled' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onProcessPayment(payment)}
                  disabled={isProcessing}
                >
                  <Send size={16} className="mr-1" />
                  Process
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(payment.id, {})}
                  disabled={isProcessing}
                >
                  <Edit size={16} className="mr-1" />
                  Reschedule
                </Button>
              </>
            )}

            {payment.status === 'processing' && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Clock size={16} className="animate-spin" />
                <span>Processing...</span>
              </div>
            )}

            {payment.status === 'completed' && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle size={16} />
                <span>Completed</span>
              </div>
            )}

            {payment.status === 'failed' && (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onProcessPayment(payment)}
                  disabled={isProcessing}
                  className="text-red-600 hover:text-red-700"
                >
                  <AlertTriangle size={16} className="mr-1" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};