import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Building2, FileText, DollarSign, Clock, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

interface CustomerSummaryCardProps {
  customer: { id: string; name: string; email: string; phone: string; address: string;
    totalOutstanding: number; totalPaid: number; invoicesCount: number; status: string; };
  invoices: Array<{ id: string; status: string; amount: number; remainingAmount: number; }>;
  onViewInvoices: () => void; formatCurrency: (amount: number) => string;
}

export const CustomerSummaryCard = ({
  customer, invoices, onViewInvoices, formatCurrency
}: CustomerSummaryCardProps) => {
  const pendingInvoices = invoices.filter(invoice => invoice.status !== 'paid').length;
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collectionRatio = totalInvoiceAmount > 0 ? (customer.totalPaid / (customer.totalPaid + customer.totalOutstanding)) * 100 : 0;

  const getStatusColor = () => {
    switch (customer.status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{customer.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor()}>{customer.status}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-2" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-2" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-start text-sm text-gray-600">
              <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{customer.address}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Outstanding:</span>
              <span className="font-bold text-red-600">{formatCurrency(customer.totalOutstanding)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Collected:</span>
              <span className="font-bold text-green-600">{formatCurrency(customer.totalPaid)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Collection Rate:</span>
              <span className="font-medium">{collectionRatio.toFixed(1)}%</span>
            </div>
            <Progress value={collectionRatio} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Collected: {formatCurrency(customer.totalPaid)}</span>
              <span>Outstanding: {formatCurrency(customer.totalOutstanding)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">{invoices.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <Clock size={16} className="text-yellow-600" />
              </div>
              <div className="text-lg font-bold text-yellow-600">{pendingInvoices}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-2">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp size={16} className="text-red-600" />
              </div>
              <div className="text-lg font-bold text-red-600">{overdueInvoices}</div>
              <div className="text-xs text-gray-600">Overdue</div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={onViewInvoices} className="flex-1">
              <FileText size={14} className="mr-1" />View Invoices ({invoices.length})
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1" disabled={customer.totalOutstanding === 0}>
              <DollarSign size={14} className="mr-1" />Follow Up
            </Button>
          </div>

          {customer.totalOutstanding > 0 && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Next Follow-up:</span>
                <span className="font-medium text-orange-600">
                  {overdueInvoices > 0 ? 'Immediate' : 'In 7 days'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};