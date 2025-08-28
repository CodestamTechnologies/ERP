'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/hooks/useInvoices';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  CreditCard,
  Plus,
  Eye
} from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onCreateInvoice: () => void;
}

export const CustomerCard = ({
  customer,
  onCreateInvoice
}: CustomerCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <Badge variant="outline" className={customer.isActive ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}>
            {customer.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            <span className="text-gray-600">{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-400" />
              <span className="text-gray-600">{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600 truncate">
              {customer.city}, {customer.state} {customer.zipCode}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-3">Financial Summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign size={14} className="text-green-600" />
                <span className="text-xs text-gray-500">Total Invoiced</span>
              </div>
              <p className="font-bold text-lg text-green-600">
                ${customer.totalInvoiced.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CreditCard size={14} className="text-blue-600" />
                <span className="text-xs text-gray-500">Total Paid</span>
              </div>
              <p className="font-bold text-lg text-blue-600">
                ${customer.totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
          
          {customer.outstandingAmount > 0 && (
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign size={14} className="text-orange-600" />
                <span className="text-xs text-gray-500">Outstanding</span>
              </div>
              <p className="font-bold text-lg text-orange-600">
                ${customer.outstandingAmount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Terms:</span>
            <span className="font-medium">{customer.paymentTerms} days</span>
          </div>
          {customer.creditLimit && (
            <div className="flex justify-between">
              <span className="text-gray-500">Credit Limit:</span>
              <span className="font-medium">${customer.creditLimit.toLocaleString()}</span>
            </div>
          )}
          {customer.lastInvoiceDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Last Invoice:</span>
              <span className="font-medium">
                {new Date(customer.lastInvoiceDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye size={14} className="mr-1" />
              View
            </Button>
            <Button size="sm" onClick={onCreateInvoice}>
              <Plus size={14} className="mr-1" />
              Invoice
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};