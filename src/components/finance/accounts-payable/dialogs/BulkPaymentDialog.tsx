import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Send, 
  DollarSign, 
  Building2, 
  Calendar, 
  FileText,
  AlertTriangle,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import { PayableInvoice, BulkPaymentRequest } from '@/types/accountsPayable';

interface BulkPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoices: PayableInvoice[];
  onProcessBulkPayment: (invoiceIds: string[], paymentData: BulkPaymentRequest) => void;
  isProcessing: boolean;
}

export const BulkPaymentDialog = ({
  isOpen,
  onClose,
  selectedInvoices,
  onProcessBulkPayment,
  isProcessing
}: BulkPaymentDialogProps) => {
  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    bankAccount: '',
    referenceNumber: '',
    notes: '',
    applyToAll: true
  });

  const [invoiceSelections, setInvoiceSelections] = useState<Record<string, boolean>>(
    selectedInvoices.reduce((acc, invoice) => ({
      ...acc,
      [invoice.id]: true
    }), {})
  );

  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>(
    selectedInvoices.reduce((acc, invoice) => ({
      ...acc,
      [invoice.id]: invoice.balanceAmount
    }), {})
  );

  const getSelectedInvoices = () => {
    return selectedInvoices.filter(invoice => invoiceSelections[invoice.id]);
  };

  const getTotalAmount = () => {
    return getSelectedInvoices().reduce((sum, invoice) => 
      sum + (customAmounts[invoice.id] || invoice.balanceAmount), 0
    );
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending_approval':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleInvoiceSelection = (invoiceId: string, selected: boolean) => {
    setInvoiceSelections(prev => ({
      ...prev,
      [invoiceId]: selected
    }));
  };

  const handleCustomAmountChange = (invoiceId: string, amount: number) => {
    setCustomAmounts(prev => ({
      ...prev,
      [invoiceId]: amount
    }));
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelections = selectedInvoices.reduce((acc, invoice) => ({
      ...acc,
      [invoice.id]: selected
    }), {});
    setInvoiceSelections(newSelections);
  };

  const handleProcessPayment = () => {
    const selectedInvoiceIds = getSelectedInvoices().map(invoice => invoice.id);
    
    const bulkPaymentRequest: BulkPaymentRequest = {
      invoiceIds: selectedInvoiceIds,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      bankAccount: paymentData.bankAccount,
      referenceNumber: paymentData.referenceNumber,
      notes: paymentData.notes
    };

    onProcessBulkPayment(selectedInvoiceIds, bulkPaymentRequest);
  };

  const selectedCount = getSelectedInvoices().length;
  const totalAmount = getTotalAmount();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Send size={24} className="mr-2" />
            Bulk Payment Processing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <p className="text-lg font-bold">{selectedCount}</p>
                    <p className="text-sm text-gray-600">Selected Invoices</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={20} className="text-green-600" />
                  <div>
                    <p className="text-lg font-bold">₹{totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 size={20} className="text-purple-600" />
                  <div>
                    <p className="text-lg font-bold">
                      {new Set(getSelectedInvoices().map(inv => inv.vendorId)).size}
                    </p>
                    <p className="text-sm text-gray-600">Unique Vendors</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-orange-600" />
                  <div>
                    <p className="text-lg font-bold">
                      {getSelectedInvoices().filter(inv => inv.status === 'overdue').length}
                    </p>
                    <p className="text-sm text-gray-600">Overdue Invoices</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({ 
                      ...paymentData, 
                      paymentDate: e.target.value 
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select 
                    value={paymentData.paymentMethod} 
                    onValueChange={(value) => setPaymentData({ 
                      ...paymentData, 
                      paymentMethod: value 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentData.paymentMethod === 'bank_transfer' && (
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account *</Label>
                    <Select 
                      value={paymentData.bankAccount} 
                      onValueChange={(value) => setPaymentData({ 
                        ...paymentData, 
                        bankAccount: value 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hdfc-001">HDFC Bank - ****1234</SelectItem>
                        <SelectItem value="icici-002">ICICI Bank - ****5678</SelectItem>
                        <SelectItem value="sbi-003">SBI - ****9012</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={paymentData.referenceNumber}
                    onChange={(e) => setPaymentData({ 
                      ...paymentData, 
                      referenceNumber: e.target.value 
                    })}
                    placeholder="Batch reference number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Payment Notes</Label>
                  <Textarea
                    id="notes"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ 
                      ...paymentData, 
                      notes: e.target.value 
                    })}
                    placeholder="Additional notes for bulk payment"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Selected Invoices:</span>
                    <span className="font-medium">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentData.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Date:</span>
                    <span className="font-medium">
                      {new Date(paymentData.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Amount:</span>
                    <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Vendor Breakdown */}
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Vendor Breakdown:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {Array.from(new Set(getSelectedInvoices().map(inv => inv.vendorName)))
                      .map(vendorName => {
                        const vendorInvoices = getSelectedInvoices().filter(inv => inv.vendorName === vendorName);
                        const vendorTotal = vendorInvoices.reduce((sum, inv) => 
                          sum + (customAmounts[inv.id] || inv.balanceAmount), 0
                        );
                        return (
                          <div key={vendorName} className="flex justify-between text-sm">
                            <span className="text-gray-600">{vendorName}:</span>
                            <span className="font-medium">₹{vendorTotal.toLocaleString()}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Invoice Selection</span>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedInvoices.every(inv => invoiceSelections[inv.id])}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm">Select All</Label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Checkbox
                      checked={invoiceSelections[invoice.id] || false}
                      onCheckedChange={(checked) => handleInvoiceSelection(invoice.id, checked as boolean)}
                    />
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.vendorName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Balance Amount</p>
                        <p className="font-medium">₹{invoice.balanceAmount.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status.replace('_', ' ')}
                        </Badge>
                        {invoice.status === 'overdue' && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Custom Amount Input */}
                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        max={invoice.balanceAmount}
                        step="0.01"
                        value={customAmounts[invoice.id] || invoice.balanceAmount}
                        onChange={(e) => handleCustomAmountChange(
                          invoice.id, 
                          parseFloat(e.target.value) || 0
                        )}
                        disabled={!invoiceSelections[invoice.id]}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {getSelectedInvoices().some(inv => inv.status === 'overdue') && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={20} className="text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Overdue Invoices Detected</p>
                    <p className="text-sm text-orange-700">
                      {getSelectedInvoices().filter(inv => inv.status === 'overdue').length} invoice(s) 
                      are overdue. Processing these payments may incur late fees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessPayment} 
            disabled={isProcessing || selectedCount === 0 || totalAmount <= 0}
          >
            {isProcessing ? 'Processing...' : `Process ${selectedCount} Payment${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};