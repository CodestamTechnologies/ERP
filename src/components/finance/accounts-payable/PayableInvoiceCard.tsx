import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Calendar, DollarSign, Building2, Eye, Send, Clock, CheckCircle, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { PayableInvoice } from '@/types/accountsPayable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface PayableInvoiceCardProps {
  invoice: PayableInvoice;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onViewDetails: (invoice: PayableInvoice) => void;
  onProcessPayment: (invoice: PayableInvoice) => void;
  onSchedulePayment: (invoiceId: string, scheduleData: any) => void;
  onSendReminder: (invoiceId: string) => void;
  onApprove: (invoiceId: string) => void;
  onReject: (invoiceId: string, reason: string) => void;
  isProcessing: boolean;
}

export const PayableInvoiceCard = ({ invoice, isSelected, onSelect, onViewDetails, onProcessPayment, onSchedulePayment, onSendReminder, onApprove, onReject, isProcessing }: PayableInvoiceCardProps) => {
  const statusColors = {
    paid: 'text-green-600 bg-green-50 border-green-200',
    overdue: 'text-red-600 bg-red-50 border-red-200',
    pending_approval: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    approved: 'text-blue-600 bg-blue-50 border-blue-200',
    cancelled: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  const priorityColors = {
    urgent: 'text-red-600', high: 'text-orange-600', medium: 'text-yellow-600', low: 'text-green-600'
  };

  const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="mt-1" />
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-red-600" />
                  <div>
                    <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={priorityColors[invoice.priority as keyof typeof priorityColors]}>
                    {invoice.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={statusColors[invoice.status as keyof typeof statusColors] || statusColors.cancelled}>
                    {invoice.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Building2 size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{invoice.vendorName}</p>
                    <p className="text-xs text-gray-500">{invoice.vendorEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">₹{invoice.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Balance: ₹{invoice.balanceAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <p className={`text-xs ${daysUntilDue < 0 ? 'text-red-500' : daysUntilDue <= 7 ? 'text-orange-500' : 'text-gray-500'}`}>
                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days remaining`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Terms: {invoice.paymentTerms}</span>
                  {invoice.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {invoice.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {invoice.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{invoice.tags.length - 2}</Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">Created: {new Date(invoice.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(invoice)}>
              <Eye size={16} className="mr-1" />View
            </Button>

            {invoice.status === 'approved' && invoice.balanceAmount > 0 && (
              <Button size="sm" onClick={() => onProcessPayment(invoice)} disabled={isProcessing}>
                <Send size={16} className="mr-1" />Pay
              </Button>
            )}

            {invoice.status === 'pending_approval' && (
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => onApprove(invoice.id)} disabled={isProcessing} className="text-green-600 hover:text-green-700">
                  <CheckCircle size={16} className="mr-1" />Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => onReject(invoice.id, 'Rejected by user')} disabled={isProcessing} className="text-red-600 hover:text-red-700">
                  <AlertTriangle size={16} className="mr-1" />Reject
                </Button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm"><MoreHorizontal size={16} /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
                  <Eye size={16} className="mr-2" />View Details
                </DropdownMenuItem>
                {invoice.status !== 'paid' && (
                  <>
                    <DropdownMenuItem onClick={() => onSchedulePayment(invoice.id, {})}>
                      <Clock size={16} className="mr-2" />Schedule Payment
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendReminder(invoice.id)}>
                      <Send size={16} className="mr-2" />Send Reminder
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};