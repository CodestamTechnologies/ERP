import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CalendarDays, Building2, FileText, Clock } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

interface Bill {
  id: string;
  billNumber: string;
  vendorName: string;
  remainingAmount: number;
  dueDate: string;
  status: string;
}

interface ScheduleData {
  amount: number;
  scheduledDate: string;
  frequency: string;
  paymentMethod: string;
  autoProcess: boolean;
  notes: string;
}

interface SchedulePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onSchedulePayment: (billId: string, scheduleData: ScheduleData) => Promise<void>;
  isProcessing: boolean;
}

export const SchedulePaymentDialog = ({
  isOpen,
  onClose,
  bill,
  onSchedulePayment,
  isProcessing
}: SchedulePaymentDialogProps) => {
  const [scheduleData, setScheduleData] = useState({
    amount: '',
    scheduledDate: new Date(),
    frequency: 'once',
    paymentMethod: 'bank_transfer',
    autoProcess: false,
    notes: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'online', label: 'Online Payment' }
  ];

  const frequencies = [
    { value: 'once', label: 'One-time Payment' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const quickDateOptions = [
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'Next Week', date: addWeeks(new Date(), 1) },
    { label: 'Next Month', date: addMonths(new Date(), 1) },
    { label: 'Due Date', date: bill ? new Date(bill.dueDate) : new Date() }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bill) return;

    const schedule = {
      ...scheduleData,
      amount: parseFloat(scheduleData.amount) || bill.remainingAmount,
      scheduledDate: format(scheduleData.scheduledDate, 'yyyy-MM-dd')
    };

    try {
      await onSchedulePayment(bill.id, schedule);
      // Reset form
      setScheduleData({
        amount: '',
        scheduledDate: new Date(),
        frequency: 'once',
        paymentMethod: 'bank_transfer',
        autoProcess: false,
        notes: ''
      });
    } catch (error) {
      console.error('Error scheduling payment:', error);
    }
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const maxAmount = bill?.remainingAmount || 0;
    
    if (amount <= maxAmount) {
      setScheduleData(prev => ({ ...prev, amount: value }));
    }
  };

  const setFullAmount = () => {
    if (bill) {
      setScheduleData(prev => ({ ...prev, amount: bill.remainingAmount.toString() }));
    }
  };

  const setQuickDate = (date: Date) => {
    setScheduleData(prev => ({ ...prev, scheduledDate: date }));
  };

  if (!bill) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarDays className="mr-2" size={20} />
            Schedule Payment
          </DialogTitle>
          <DialogDescription>
            Schedule a future payment for this vendor bill with automated processing options.
          </DialogDescription>
        </DialogHeader>

        {/* Bill Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Bill Information</h3>
            <Badge variant="outline" className={getStatusColor(bill.status)}>
              {bill.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Bill Number:</span>
              <div className="font-medium flex items-center">
                <FileText size={14} className="mr-1" />
                {bill.billNumber}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Vendor:</span>
              <div className="font-medium flex items-center">
                <Building2 size={14} className="mr-1" />
                {bill.vendorName}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Due Date:</span>
              <div className={`font-medium flex items-center ${
                daysUntilDue < 0 ? 'text-red-600' :
                daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-900'
              }`}>
                <Clock size={14} className="mr-1" />
                {new Date(bill.dueDate).toLocaleDateString()}
                <span className="ml-2 text-xs">
                  ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                    daysUntilDue === 0 ? 'Due today' :
                    `${daysUntilDue} days left`})
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Remaining Amount:</span>
              <div className="font-bold text-lg">{formatCurrency(bill.remainingAmount)}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₹) *</Label>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={scheduleData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={bill.remainingAmount.toString()}
                  required
                  max={bill.remainingAmount}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={setFullAmount}
                  className="whitespace-nowrap"
                >
                  Full Amount
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Maximum: {formatCurrency(bill.remainingAmount)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={scheduleData.paymentMethod} 
                onValueChange={(value) => setScheduleData(prev => ({ ...prev, paymentMethod: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Payment Frequency</Label>
              <Select 
                value={scheduleData.frequency} 
                onValueChange={(value) => setScheduleData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(scheduleData.scheduledDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleData.scheduledDate}
                    onSelect={(date) => {
                      if (date instanceof Date) {
                        setScheduleData(prev => ({ ...prev, scheduledDate: date }));
                        setShowDatePicker(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quick Date Selection */}
          <div className="space-y-2">
            <Label>Quick Date Selection</Label>
            <div className="flex flex-wrap gap-2">
              {quickDateOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickDate(option.date)}
                  className={
                    format(scheduleData.scheduledDate, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd')
                      ? 'bg-blue-50 border-blue-300'
                      : ''
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Auto Process Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoProcess"
              checked={scheduleData.autoProcess}
              onChange={(e) => setScheduleData(prev => ({ ...prev, autoProcess: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="autoProcess" className="text-sm">
              Automatically process payment on scheduled date
            </Label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Schedule Notes</Label>
            <Textarea
              id="notes"
              value={scheduleData.notes}
              onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this scheduled payment..."
              rows={3}
            />
          </div>

          {/* Schedule Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Schedule Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span className="font-bold">
                  {scheduleData.amount ? formatCurrency(parseFloat(scheduleData.amount)) : formatCurrency(bill.remainingAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled Date:</span>
                <span className="font-bold">{format(scheduleData.scheduledDate, 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold">
                  {paymentMethods.find(m => m.value === scheduleData.paymentMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-bold">
                  {frequencies.find(f => f.value === scheduleData.frequency)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto Process:</span>
                <span className="font-bold">{scheduleData.autoProcess ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Warning for Late Scheduling */}
          {scheduleData.scheduledDate > new Date(bill.dueDate) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center text-yellow-700 mb-2">
                <Clock size={16} className="mr-2" />
                <span className="font-semibold">Late Payment Notice</span>
              </div>
              <p className="text-sm text-yellow-600">
                The scheduled payment date is after the bill&apos;s due date. 
                This may result in late fees or impact vendor relationships.
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </div>
              ) : (
                'Schedule Payment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};