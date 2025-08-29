import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CreateInvoiceDialogProps {
  isOpen: boolean; onClose: () => void; onCreateInvoice: (invoiceData: any) => Promise<void>;
  customers: Array<{ id: string; name: string; }>;
  isProcessing: boolean;
}

export const CreateInvoiceDialog = ({
  isOpen, onClose, onCreateInvoice, customers, isProcessing
}: CreateInvoiceDialogProps) => {
  const [formData, setFormData] = useState({
    customerId: '', invoiceDate: new Date(), dueDate: new Date(),
    description: '', taxRate: '18', discountAmount: '',
    items: [{ name: '', quantity: 1, rate: 0, amount: 0 }]
  });
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const calculateItemAmount = (quantity: number, rate: number) => quantity * rate;
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * parseFloat(formData.taxRate)) / 100;
  const discountAmount = parseFloat(formData.discountAmount) || 0;
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = calculateItemAmount(newItems[index].quantity, newItems[index].rate);
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    const invoiceData = {
      ...formData,
      customerName: customer?.name || '',
      invoiceDate: format(formData.invoiceDate, 'yyyy-MM-dd'),
      dueDate: format(formData.dueDate, 'yyyy-MM-dd'),
      amount: totalAmount,
      taxAmount,
      discountAmount
    };

    try {
      await onCreateInvoice(invoiceData);
      setFormData({
        customerId: '', invoiceDate: new Date(), dueDate: new Date(),
        description: '', taxRate: '18', discountAmount: '',
        items: [{ name: '', quantity: 1, rate: 0, amount: 0 }]
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Generate a new invoice for your customer with detailed line items.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={formData.customerId} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))} required>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Invoice Date *</Label>
              <Popover open={showInvoiceDatePicker} onOpenChange={setShowInvoiceDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.invoiceDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.invoiceDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, invoiceDate: date }));
                        setShowInvoiceDatePicker(false);
                      }
                    }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dueDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.dueDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, dueDate: date }));
                        setShowDueDatePicker(false);
                      }
                    }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the invoice" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus size={16} className="mr-2" />Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label>Item Name</Label>
                    <Input value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Item description" required />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="col-span-2">
                    <Label>Rate (₹)</Label>
                    <Input type="number" step="0.01" value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2">
                    <Label>Amount (₹)</Label>
                    <Input value={item.amount.toFixed(2)} readOnly className="bg-gray-50" />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" step="0.01" value={formData.taxRate}
                onChange={(e) => setFormData(prev => ({ ...prev, taxRate: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountAmount">Discount Amount (₹)</Label>
              <Input id="discountAmount" type="number" step="0.01" value={formData.discountAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: e.target.value }))}
                placeholder="0.00" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Invoice Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({formData.taxRate}%):</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};