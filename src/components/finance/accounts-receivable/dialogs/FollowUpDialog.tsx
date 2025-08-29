import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CalendarDays, Building2, FileText } from 'lucide-react';
import { format, addDays, addWeeks } from 'date-fns';

interface FollowUpDialogProps {
  isOpen: boolean; onClose: () => void; invoice: any;
  onCreateFollowUp: (invoiceId: string, followUpData: any) => Promise<void>;
  isProcessing: boolean;
}

export const FollowUpDialog = ({ isOpen, onClose, invoice, onCreateFollowUp, isProcessing }: FollowUpDialogProps) => {
  const [followUpData, setFollowUpData] = useState({
    type: 'call', scheduledDate: addDays(new Date(), 3), priority: 'medium', notes: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const followUpTypes = [
    { value: 'call', label: 'Phone Call' }, { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' }, { value: 'letter', label: 'Formal Letter' }
  ];

  const priorities = [
    { value: 'high', label: 'High Priority' }, { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const quickDates = [
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
    { label: 'In 3 Days', date: addDays(new Date(), 3) },
    { label: 'Next Week', date: addWeeks(new Date(), 1) }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    const followUp = {
      ...followUpData, scheduledDate: format(followUpData.scheduledDate, 'yyyy-MM-dd')
    };

    try {
      await onCreateFollowUp(invoice.id, followUp);
      setFollowUpData({ type: 'call', scheduledDate: addDays(new Date(), 3), priority: 'medium', notes: '' });
    } catch (error) { console.error('Error creating follow-up:', error); }
  };

  if (!invoice) return null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(amount);

  const getDaysOverdue = () => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysOverdue = getDaysOverdue();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarDays className="mr-2" size={20} />Schedule Follow-up
          </DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Invoice Information</h3>
            <Badge variant="outline" className={
              invoice.status === 'overdue' ? 'text-red-600 bg-red-50 border-red-200' : 'text-blue-600 bg-blue-50 border-blue-200'
            }>
              {invoice.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Invoice:</span>
              <div className="font-medium flex items-center">
                <FileText size={14} className="mr-1" />
                {invoice.invoiceNumber}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Customer:</span>
              <div className="font-medium flex items-center">
                <Building2 size={14} className="mr-1" />
                {invoice.customerName}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Outstanding:</span>
              <div className="font-bold text-red-600">{formatCurrency(invoice.remainingAmount)}</div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div className={`font-medium ${daysOverdue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'Not overdue'}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Follow-up Type</Label>
              <Select value={followUpData.type} onValueChange={(value) => setFollowUpData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {followUpTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={followUpData.priority} onValueChange={(value) => setFollowUpData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Scheduled Date</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(followUpData.scheduledDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={followUpData.scheduledDate}
                    onSelect={(date) => {
                      if (date) {
                        setFollowUpData(prev => ({ ...prev, scheduledDate: date }));
                        setShowDatePicker(false);
                      }
                    }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Date Selection</Label>
            <div className="flex flex-wrap gap-2">
              {quickDates.map((option) => (
                <Button key={option.label} type="button" variant="outline" size="sm"
                  onClick={() => setFollowUpData(prev => ({ ...prev, scheduledDate: option.date }))}
                  className={format(followUpData.scheduledDate, 'yyyy-MM-dd') === format(option.date, 'yyyy-MM-dd') ? 'bg-blue-50 border-blue-300' : ''}>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Follow-up Notes</Label>
            <Textarea id="notes" value={followUpData.notes}
              onChange={(e) => setFollowUpData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes about this follow-up..." rows={3} />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Follow-up Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-bold">{followUpTypes.find(t => t.value === followUpData.type)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled:</span>
                <span className="font-bold">{format(followUpData.scheduledDate, 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <span className="font-bold">{priorities.find(p => p.value === followUpData.priority)?.label}</span>
              </div>
            </div>
          </div>

          {daysOverdue > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700 mb-2">
                <CalendarDays size={16} className="mr-2" />
                <span className="font-semibold">Overdue Payment Notice</span>
              </div>
              <p className="text-sm text-red-600">
                This invoice is {daysOverdue} days overdue. Consider escalating the follow-up or implementing collection procedures.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Scheduling...' : 'Schedule Follow-up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};