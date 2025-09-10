import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Building2, FileText } from 'lucide-react';
interface ReminderData {
  template: string;
  customMessage: string;
  includeInvoiceDetails: boolean;
}
interface BulkReminderDialogProps {
  isOpen: boolean; onClose: () => void;
  selectedInvoices: Array<{ id: string; invoiceNumber: string; customerName: string; remainingAmount: number; status: string; }>;
  onSendReminders: (invoiceIds: string[], reminderData: ReminderData) => Promise<void>;
  isProcessing: boolean;
}

export const BulkReminderDialog = ({ isOpen, onClose, selectedInvoices, onSendReminders, isProcessing }: BulkReminderDialogProps) => {
  const [reminderData, setReminderData] = useState({
    template: 'polite', customMessage: '', includeInvoiceDetails: true
  });

  const templates = [
    { value: 'polite', label: 'Polite Reminder' },
    { value: 'urgent', label: 'Urgent Notice' },
    { value: 'final', label: 'Final Notice' },
    { value: 'custom', label: 'Custom Message' }
  ];

  const totalAmount = selectedInvoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0);
  const uniqueCustomers = [...new Set(selectedInvoices.map(invoice => invoice.customerName))];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSendReminders(selectedInvoices.map(invoice => invoice.id), reminderData);
      setReminderData({ template: 'polite', customMessage: '', includeInvoiceDetails: true });
    } catch (error) { console.error('Error sending reminders:', error); }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Send className="mr-2" size={20} />Send Payment Reminders
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Reminder Summary</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{selectedInvoices.length}</div>
              <div className="text-sm text-gray-500">Invoices</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{uniqueCustomers.length}</div>
              <div className="text-sm text-gray-500">Customers</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</div>
              <div className="text-sm text-gray-500">Total Amount</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{selectedInvoices.filter(i => i.status === 'overdue').length}</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          <h4 className="font-semibold text-gray-900">Selected Invoices</h4>
          {selectedInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText size={16} className="text-blue-600" />
                <div>
                  <div className="font-medium">{invoice.invoiceNumber}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Building2 size={12} className="mr-1" />
                    {invoice.customerName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatCurrency(invoice.remainingAmount)}</div>
                <Badge variant="outline" className={
                  invoice.status === 'overdue' ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-200'
                }>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Reminder Template</Label>
            <Select value={reminderData.template} onValueChange={(value) => setReminderData(prev => ({ ...prev, template: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.value} value={template.value}>{template.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reminderData.template === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea id="customMessage" value={reminderData.customMessage}
                onChange={(e) => setReminderData(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Enter your custom reminder message..." rows={4} />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="includeDetails" checked={reminderData.includeInvoiceDetails}
              onChange={(e) => setReminderData(prev => ({ ...prev, includeInvoiceDetails: e.target.checked }))} />
            <Label htmlFor="includeDetails">Include invoice details in reminder</Label>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Customer Breakdown</h4>
            <div className="space-y-2">
              {uniqueCustomers.map(customer => {
                const customerInvoices = selectedInvoices.filter(invoice => invoice.customerName === customer);
                const customerTotal = customerInvoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0);
                return (
                  <div key={customer} className="flex justify-between items-center text-sm">
                    <span className="flex items-center">
                      <Building2 size={14} className="mr-1" />
                      {customer} ({customerInvoices.length} invoices)
                    </span>
                    <span className="font-bold">{formatCurrency(customerTotal)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button type="submit" disabled={isProcessing || selectedInvoices.length === 0}>
              {isProcessing ? 'Sending...' : `Send ${selectedInvoices.length} Reminders`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};