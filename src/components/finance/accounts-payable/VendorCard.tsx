import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import { Vendor } from '@/types/accountsPayable';

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails: (vendor: Vendor) => void;
  onCreatePayable: () => void;
}

export const VendorCard = ({
  vendor,
  onViewDetails,
  onCreatePayable
}: VendorCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'blocked':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{vendor.displayName}</CardTitle>
              <p className="text-sm text-gray-600">{vendor.category}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(vendor.status)}>
            {vendor.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            <span className="text-gray-600">{vendor.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone size={14} className="text-gray-400" />
            <span className="text-gray-600">{vendor.phone}</span>
          </div>
          {vendor.website && (
            <div className="flex items-center space-x-2 text-sm">
              <Globe size={14} className="text-gray-400" />
              <a 
                href={vendor.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {vendor.website.replace('https://', '')}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600">
              {vendor.address.city}, {vendor.address.state}
            </span>
          </div>
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <DollarSign size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Current Balance</span>
            </div>
            <p className="font-semibold text-red-600">
              {formatCurrency(vendor.currentBalance)}
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Total Purchases</span>
            </div>
            <p className="font-semibold text-gray-900">
              {formatCurrency(vendor.totalPurchases)}
            </p>
          </div>
        </div>

        {/* Payment Terms and Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Payment Terms</span>
            </div>
            <p className="text-sm font-medium">{vendor.paymentTerms}</p>
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">Avg Payment Days</span>
            </div>
            <p className="text-sm font-medium">{vendor.averagePaymentDays} days</p>
          </div>
        </div>

        {/* Tags */}
        {vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {vendor.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {vendor.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{vendor.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Contact Person */}
        {vendor.contactPerson.name && (
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1">Contact Person</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">{vendor.contactPerson.name}</p>
              {vendor.contactPerson.designation && (
                <p className="text-xs text-gray-600">{vendor.contactPerson.designation}</p>
              )}
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <span>{vendor.contactPerson.email}</span>
                <span>{vendor.contactPerson.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(vendor)}
            className="flex-1"
          >
            <Eye size={16} className="mr-2" />
            View Details
          </Button>
          <Button
            size="sm"
            onClick={onCreatePayable}
            className="flex-1"
          >
            <Plus size={16} className="mr-2" />
            New Bill
          </Button>
        </div>

        {/* Last Transaction */}
        {vendor.lastTransactionDate && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Last transaction: {new Date(vendor.lastTransactionDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};