import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Building2, FileText, DollarSign, Clock, 
  TrendingUp, Mail, Phone, MapPin 
} from 'lucide-react';

interface VendorSummaryCardProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentTerms: string;
    totalOutstanding: number;
    totalPaid: number;
    billsCount: number;
    status: string;
  };
  bills: Array<{
    id: string;
    status: string;
    amount: number;
    remainingAmount: number;
  }>;
  onViewBills: () => void;
  formatCurrency: (amount: number) => string;
}

export const VendorSummaryCard = ({
  vendor,
  bills,
  onViewBills,
  formatCurrency
}: VendorSummaryCardProps) => {
  const pendingBills = bills.filter(bill => bill.status !== 'paid').length;
  const overdueBills = bills.filter(bill => bill.status === 'overdue').length;
  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paymentRatio = totalBillAmount > 0 ? (vendor.totalPaid / (vendor.totalPaid + vendor.totalOutstanding)) * 100 : 0;

  const getStatusColor = () => {
    switch (vendor.status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor()}>
                  {vendor.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-2" />
              <span className="truncate">{vendor.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-2" />
              <span>{vendor.phone}</span>
            </div>
            <div className="flex items-start text-sm text-gray-600">
              <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{vendor.address}</span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Outstanding:</span>
              <span className="font-bold text-red-600">
                {formatCurrency(vendor.totalOutstanding)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Paid:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(vendor.totalPaid)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment Terms:</span>
              <span className="font-medium text-gray-900">{vendor.paymentTerms}</span>
            </div>
          </div>

          {/* Payment Performance */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Performance:</span>
              <span className="font-medium">{paymentRatio.toFixed(1)}%</span>
            </div>
            <Progress value={paymentRatio} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Paid: {formatCurrency(vendor.totalPaid)}</span>
              <span>Outstanding: {formatCurrency(vendor.totalOutstanding)}</span>
            </div>
          </div>

          {/* Bills Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">{bills.length}</div>
              <div className="text-xs text-gray-600">Total Bills</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Clock size={16} className="text-yellow-600" />
              </div>
              <div className="text-lg font-bold text-yellow-600">{pendingBills}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp size={16} className="text-red-600" />
              </div>
              <div className="text-lg font-bold text-red-600">{overdueBills}</div>
              <div className="text-xs text-gray-600">Overdue</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewBills}
              className="flex-1"
            >
              <FileText size={14} className="mr-1" />
              View Bills ({bills.length})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={vendor.totalOutstanding === 0}
            >
              <DollarSign size={14} className="mr-1" />
              Pay All
            </Button>
          </div>

          {/* Quick Stats */}
          {vendor.totalOutstanding > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Next Payment Due:</span>
                <span className="font-medium text-orange-600">
                  {bills.filter(b => b.status !== 'paid').length > 0 ? 'Check bills' : 'No pending'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};