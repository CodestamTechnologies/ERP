import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Building2, 
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send
} from 'lucide-react';
import { PayableInvoice } from '@/types/accountsPayable';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: PayableInvoice | null;
  onProcessPayment: (invoiceId: string, paymentData: any) => void;
  onSchedulePayment: (invoiceId: string, scheduleData: any) => void;
  isProcessing: boolean;
}

export const PaymentDialog = ({
  isOpen,
  onClose,
  invoice,
  onProcessPayment,
  onSchedulePayment,
  isProcessing
}: PaymentDialogProps) => {
  const [activeTab, setActiveTab] = useState('payment');
  const [paymentData, setPaymentData] = useState({
    amount: invoice?.balanceAmount || 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    bankAccount: '',
    referenceNumber: '',
    checkNumber: '',
    notes: '',
    applyDiscount: false,
    discountAmount: 0,
    discountReason: ''
  });

  const [scheduleData, setScheduleData] = useState({
    amount: invoice?.balanceAmount || 0,
    scheduledDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    bankAccount: '',
    notes: '',
    approvalRequired: false,
    recurringPayment: false,
    recurringFrequency: 'monthly',
    recurringEndDate: ''
  });

  if (!invoice) return null;

  const handleProcessPayment = () => {
    const finalAmount = paymentData.applyDiscount 
      ? paymentData.amount - paymentData.discountAmount 
      : paymentData.amount;

    onProcessPayment(invoice.id, {
      ...paymentData,
      amount: finalAmount
    });
  };

  const handleSchedulePayment = () => {
    onSchedulePayment(invoice.id, scheduleData);
  };

  const getStatusColor = (status: string) => {
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

  const getDaysUntilDue = () => {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Processing - {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        {/* Invoice Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText size={20} className="mr-2" />
                Invoice Details
              </span>
              <Badge variant="outline" className={getStatusColor(invoice.status)}>
                {invoice.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium">{invoice.vendorName}</p>
                    <p className="text-sm text-gray-600">{invoice.vendorEmail}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Payment Terms: {invoice.paymentTerms}</p>
                  <p>Priority: <span className="capitalize">{invoice.priority}</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <p className={`text-sm ${
                      daysUntilDue < 0 ? 'text-red-500' : 
                      daysUntilDue <= 7 ? 'text-orange-500' : 'text-gray-500'
                    }`}>
                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                       daysUntilDue === 0 ? 'Due today' :
                       `${daysUntilDue} days remaining`}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                  <p>Currency: {invoice.currency}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="font-medium">Total: ₹{invoice.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Paid: ₹{invoice.paidAmount.toLocaleString()}</p>
                    <p className="text-sm font-medium text-red-600">
                      Balance: ₹{invoice.balanceAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {invoice.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">{invoice.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment">Process Payment</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send size={20} className="mr-2" />
                  Process Payment Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount *</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      min="0"
                      max={invoice.balanceAmount}
                      step="0.01"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ 
                        ...paymentData, 
                        amount: parseFloat(e.target.value) || 0 
                      })}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Maximum: ₹{invoice.balanceAmount.toLocaleString()}
                    </p>
                  </div>

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
                </div>

                {/* Payment Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      value={paymentData.referenceNumber}
                      onChange={(e) => setPaymentData({ 
                        ...paymentData, 
                        referenceNumber: e.target.value 
                      })}
                      placeholder="Transaction reference"
                    />
                  </div>
                </div>

                {/* Bank Account / Check Number */}
                {paymentData.paymentMethod === 'bank_transfer' && (
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account</Label>
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

                {paymentData.paymentMethod === 'check' && (
                  <div className="space-y-2">
                    <Label htmlFor="checkNumber">Check Number</Label>
                    <Input
                      id="checkNumber"
                      value={paymentData.checkNumber}
                      onChange={(e) => setPaymentData({ 
                        ...paymentData, 
                        checkNumber: e.target.value 
                      })}
                      placeholder="Check number"
                    />
                  </div>
                )}

                {/* Discount Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="applyDiscount"
                      checked={paymentData.applyDiscount}
                      onCheckedChange={(checked) => setPaymentData({ 
                        ...paymentData, 
                        applyDiscount: checked as boolean 
                      })}
                    />
                    <Label htmlFor="applyDiscount">Apply Early Payment Discount</Label>
                  </div>

                  {paymentData.applyDiscount && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discountAmount">Discount Amount</Label>
                        <Input
                          id="discountAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={paymentData.discountAmount}
                          onChange={(e) => setPaymentData({ 
                            ...paymentData, 
                            discountAmount: parseFloat(e.target.value) || 0 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountReason">Discount Reason</Label>
                        <Input
                          id="discountReason"
                          value={paymentData.discountReason}
                          onChange={(e) => setPaymentData({ 
                            ...paymentData, 
                            discountReason: e.target.value 
                          })}
                          placeholder="Reason for discount"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span>₹{paymentData.amount.toLocaleString()}</span>
                    </div>
                    {paymentData.applyDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₹{paymentData.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Final Amount:</span>
                      <span>₹{(paymentData.amount - (paymentData.applyDiscount ? paymentData.discountAmount : 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Remaining Balance:</span>
                      <span>₹{(invoice.balanceAmount - paymentData.amount + (paymentData.applyDiscount ? paymentData.discountAmount : 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="paymentNotes">Payment Notes</Label>
                  <Textarea
                    id="paymentNotes"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ 
                      ...paymentData, 
                      notes: e.target.value 
                    })}
                    placeholder="Additional notes for this payment"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  Schedule Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleAmount">Amount to Schedule *</Label>
                    <Input
                      id="scheduleAmount"
                      type="number"
                      min="0"
                      max={invoice.balanceAmount}
                      step="0.01"
                      value={scheduleData.amount}
                      onChange={(e) => setScheduleData({ 
                        ...scheduleData, 
                        amount: parseFloat(e.target.value) || 0 
                      })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduleData.scheduledDate}
                      onChange={(e) => setScheduleData({ 
                        ...scheduleData, 
                        scheduledDate: e.target.value 
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedulePaymentMethod">Payment Method *</Label>
                    <Select 
                      value={scheduleData.paymentMethod} 
                      onValueChange={(value) => setScheduleData({ 
                        ...scheduleData, 
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

                  <div className="space-y-2">
                    <Label htmlFor="scheduleBankAccount">Bank Account</Label>
                    <Select 
                      value={scheduleData.bankAccount} 
                      onValueChange={(value) => setScheduleData({ 
                        ...scheduleData, 
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
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="approvalRequired"
                      checked={scheduleData.approvalRequired}
                      onCheckedChange={(checked) => setScheduleData({ 
                        ...scheduleData, 
                        approvalRequired: checked as boolean 
                      })}
                    />
                    <Label htmlFor="approvalRequired">Require approval before processing</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurringPayment"
                      checked={scheduleData.recurringPayment}
                      onCheckedChange={(checked) => setScheduleData({ 
                        ...scheduleData, 
                        recurringPayment: checked as boolean 
                      })}
                    />
                    <Label htmlFor="recurringPayment">Set up recurring payment</Label>
                  </div>
                </div>

                {scheduleData.recurringPayment && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="recurringFrequency">Frequency</Label>
                      <Select 
                        value={scheduleData.recurringFrequency} 
                        onValueChange={(value) => setScheduleData({ 
                          ...scheduleData, 
                          recurringFrequency: value 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recurringEndDate">End Date</Label>
                      <Input
                        id="recurringEndDate"
                        type="date"
                        value={scheduleData.recurringEndDate}
                        onChange={(e) => setScheduleData({ 
                          ...scheduleData, 
                          recurringEndDate: e.target.value 
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* Schedule Notes */}
                <div className="space-y-2">
                  <Label htmlFor="scheduleNotes">Schedule Notes</Label>
                  <Textarea
                    id="scheduleNotes"
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ 
                      ...scheduleData, 
                      notes: e.target.value 
                    })}
                    placeholder="Additional notes for this scheduled payment"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {activeTab === 'payment' ? (
            <Button 
              onClick={handleProcessPayment} 
              disabled={isProcessing || paymentData.amount <= 0}
            >
              {isProcessing ? 'Processing...' : 'Process Payment'}
            </Button>
          ) : (
            <Button 
              onClick={handleSchedulePayment} 
              disabled={isProcessing || scheduleData.amount <= 0}
            >
              {isProcessing ? 'Scheduling...' : 'Schedule Payment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};