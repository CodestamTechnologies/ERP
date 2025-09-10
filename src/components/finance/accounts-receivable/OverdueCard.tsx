import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { CreditCard, CalendarDays, AlertTriangle, Building2, FileText } from 'lucide-react';

interface OverdueCardProps {
  invoice: { id: string; invoiceNumber: string; customerName: string; dueDate: string;
    amount: number; remainingAmount: number; description?: string; };
  onRecordPayment: () => void; onFollowUp: () => void; formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string; getDaysUntilDue: (date: string) => number;
}

export const OverdueCard = ({
  invoice, onRecordPayment, onFollowUp, formatCurrency, formatDate, getDaysUntilDue
}: OverdueCardProps) => {
  const daysOverdue = Math.abs(getDaysUntilDue(invoice.dueDate));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-lg transition-all duration-300 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={20} className="text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building2 size={14} className="mr-1" />
                  {invoice.customerName}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">
              OVERDUE
            </Badge>
          </div>

          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {formatCurrency(invoice.remainingAmount)}
            </div>
            <div className="text-sm text-gray-500">Outstanding Amount</div>
          </div>

          <div className="bg-white rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Due Date:</span>
              <span className="font-medium text-red-600">{formatDate(invoice.dueDate)}</span>
            </div>
            
            <div className="text-center">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-100 text-red-700">
                {daysOverdue} days overdue
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Immediate Action Required</span>
            </div>
          </div>

          {invoice.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{invoice.description}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="default" size="sm" onClick={onRecordPayment} className="flex-1 bg-red-600 hover:bg-red-700">
              <CreditCard size={14} className="mr-1" />Record Payment
            </Button>
            
            <Button variant="outline" size="sm" onClick={onFollowUp} className="flex-1">
              <CalendarDays size={14} className="mr-1" />Follow Up
            </Button>
          </div>

          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center">
            <span className="text-xs text-red-700">
              ⚠️ Consider charging late fees or suspending services
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};