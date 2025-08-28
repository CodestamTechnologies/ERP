'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod } from '@/hooks/useReimbursements';
import { 
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: () => void;
}

const getMethodIcon = (type: string) => {
  switch (type) {
    case 'bank_transfer':
      return <CreditCard size={24} className="text-blue-600" />;
    case 'check':
      return <FileText size={24} className="text-green-600" />;
    case 'cash':
      return <Banknote size={24} className="text-orange-600" />;
    case 'digital_wallet':
      return <Smartphone size={24} className="text-purple-600" />;
    default:
      return <CreditCard size={24} className="text-gray-600" />;
  }
};

const getMethodColor = (type: string) => {
  const colors: Record<string, string> = {
    'bank_transfer': 'text-blue-600 bg-blue-50 border-blue-200',
    'check': 'text-green-600 bg-green-50 border-green-200',
    'cash': 'text-orange-600 bg-orange-50 border-orange-200',
    'digital_wallet': 'text-purple-600 bg-purple-50 border-purple-200'
  };
  return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const PaymentMethodCard = ({
  method,
  onEdit
}: PaymentMethodCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              {getMethodIcon(method.type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{method.name}</h3>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {method.isDefault && (
              <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                Default
              </Badge>
            )}
            {method.isActive ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <XCircle size={16} className="text-red-600" />
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getMethodColor(method.type)}>
              {method.type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className={method.isActive ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}>
              {method.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {method.settings.processingTime && (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-600">Processing Time: {method.settings.processingTime}</span>
            </div>
          )}

          {method.settings.fees !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={14} className="text-gray-400" />
              <span className="text-gray-600">
                Fees: {method.settings.fees === 0 ? 'Free' : `$${method.settings.fees}`}
              </span>
            </div>
          )}
        </div>

        {method.settings.bankName && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-sm mb-2">Bank Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Bank:</strong> {method.settings.bankName}</p>
              {method.settings.accountNumber && (
                <p><strong>Account:</strong> {method.settings.accountNumber}</p>
              )}
              {method.settings.routingNumber && (
                <p><strong>Routing:</strong> {method.settings.routingNumber}</p>
              )}
            </div>
          </div>
        )}

        {method.settings.limits && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-sm mb-2">Transaction Limits</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {method.settings.limits.perTransaction && (
                <p><strong>Per Transaction:</strong> ${method.settings.limits.perTransaction.toLocaleString()}</p>
              )}
              {method.settings.limits.daily && (
                <p><strong>Daily:</strong> ${method.settings.limits.daily.toLocaleString()}</p>
              )}
              {method.settings.limits.monthly && (
                <p><strong>Monthly:</strong> ${method.settings.limits.monthly.toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>Created: {new Date(method.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(method.updatedAt).toLocaleDateString()}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Settings size={14} className="mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};