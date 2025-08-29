import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface CreateVendorBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBill: (billData: any) => Promise<void>;
  vendors: Array<{ id: string; name: string; paymentTerms: string }>;
  isProcessing: boolean;
}

export const CreateVendorBillDialog = ({
  isOpen,
  onClose,
  onCreateBill,
  vendors,
  isProcessing
}: CreateVendorBillDialogProps) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    billDate: new Date(),
    dueDate: new Date(),
    amount: '',
    taxAmount: '',
    discountAmount: '',
    description: '',
    category: '',
    priority: 'medium',
    paymentTerms: '',
    reference: ''
  });

  const [showBillDatePicker, setShowBillDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const categories = [
    'Technology',
    'Office Supplies',
    'Marketing',
    'Facilities',
    'Legal',
    'Consulting',
    'Travel',
    'Utilities',
    'Insurance',
    'Other'
  ];

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    setFormData(prev => ({
      ...prev,
      vendorId,
      paymentTerms: vendor?.paymentTerms || ''
    }));

    // Calculate due date based on payment terms
    if (vendor?.paymentTerms) {
      const days = parseInt(vendor.paymentTerms.replace(/\D/g, '')) || 30;
      const dueDate = new Date(formData.billDate);
      dueDate.setDate(dueDate.getDate() + days);
      setFormData(prev => ({ ...prev, dueDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vendor = vendors.find(v => v.id === formData.vendorId);
    const billData = {
      ...formData,
      vendorName: vendor?.name || '',
      billDate: format(formData.billDate, 'yyyy-MM-dd'),
      dueDate: format(formData.dueDate, 'yyyy-MM-dd'),
      amount: parseFloat(formData.amount) || 0,
      taxAmount: parseFloat(formData.taxAmount) || 0,
      discountAmount: parseFloat(formData.discountAmount) || 0,
      attachments: []
    };

    try {
      await onCreateBill(billData);
      // Reset form
      setFormData({
        vendorId: '',
        billDate: new Date(),
        dueDate: new Date(),
        amount: '',
        taxAmount: '',
        discountAmount: '',
        description: '',
        category: '',
        priority: 'medium',
        paymentTerms: '',
        reference: ''
      });
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vendor Bill</DialogTitle>
          <DialogDescription>
            Add a new bill from a vendor to track payments and due dates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor Selection */}
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Select value={formData.vendorId} onValueChange={handleVendorChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <Label htmlFor="reference">Reference/PO Number</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="PO-2024-001"
              />
            </div>

            {/* Bill Date */}
            <div className="space-y-2">
              <Label>Bill Date *</Label>
              <Popover open={showBillDatePicker} onOpenChange={setShowBillDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.billDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.billDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, billDate: date }));
                        setShowBillDatePicker(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dueDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, dueDate: date }));
                        setShowDueDatePicker(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Bill Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            {/* Tax Amount */}
            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax Amount (₹)</Label>
              <Input
                id="taxAmount"
                type="number"
                step="0.01"
                value={formData.taxAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, taxAmount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            {/* Discount Amount */}
            <div className="space-y-2">
              <Label htmlFor="discountAmount">Discount Amount (₹)</Label>
              <Input
                id="discountAmount"
                type="number"
                step="0.01"
                value={formData.discountAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                placeholder="Net 30"
                readOnly={!!formData.vendorId}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the bill..."
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Bill'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};