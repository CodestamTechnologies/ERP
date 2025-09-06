'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vendor } from '@/hooks/useReimbursements';
import { 
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  DollarSign,
  Calendar,
  Edit,
  Eye
} from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
}

const getVendorTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'employee': 'text-blue-600 bg-blue-50 border-blue-200',
    'contractor': 'text-green-600 bg-green-50 border-green-200',
    'supplier': 'text-purple-600 bg-purple-50 border-purple-200',
    'other': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              {vendor.type === 'employee' ? (
                <User size={24} className="text-blue-600" />
              ) : (
                <Building size={24} className="text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{vendor.name}</h3>
              <p className="text-sm text-gray-500">{vendor.email}</p>
            </div>
          </div>
          <Badge variant="outline" className={vendor.isActive ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}>
            {vendor.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getVendorTypeColor(vendor.type)}>
              {vendor.type}
            </Badge>
            {vendor.preferredPaymentMethod && (
              <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">
                {vendor.preferredPaymentMethod.replace('_', ' ')}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>{vendor.email}</span>
            </div>
            {vendor.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>{vendor.phone}</span>
              </div>
            )}
            {vendor.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={14} />
                <span className="truncate">{vendor.address}</span>
              </div>
            )}
          </div>
        </div>

        {vendor.bankDetails && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <CreditCard size={14} />
              Bank Details
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Bank:</strong> {vendor.bankDetails.bankName}</p>
              <p><strong>Account:</strong> {vendor.bankDetails.accountNumber}</p>
              <p><strong>Routing:</strong> {vendor.bankDetails.routingNumber}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign size={14} className="text-green-600" />
              <span className="text-xs text-gray-500">Total Paid</span>
            </div>
            <p className="font-bold text-lg text-green-600">
              ${vendor.totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar size={14} className="text-blue-600" />
              <span className="text-xs text-gray-500">Last Payment</span>
            </div>
            <p className="font-medium text-sm">
              {vendor.lastPaymentDate 
                ? new Date(vendor.lastPaymentDate).toLocaleDateString()
                : 'Never'
              }
            </p>
          </div>
        </div>

        {vendor.paymentTerms && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Payment Terms:</strong> {vendor.paymentTerms}
            </p>
          </div>
        )}

        {vendor.taxId && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Tax ID:</strong> {vendor.taxId}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>Created: {new Date(vendor.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(vendor.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye size={14} className="mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Edit size={14} className="mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};