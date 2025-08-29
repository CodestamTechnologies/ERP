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
import { Plus, Trash2, Upload, Calculator } from 'lucide-react';
import { Vendor, PayableLineItem } from '@/types/accountsPayable';

interface CreatePayableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePayable: (payableData: any) => void;
  vendors: Vendor[];
  isProcessing: boolean;
}

export const CreatePayableDialog = ({
  isOpen,
  onClose,
  onCreatePayable,
  vendors,
  isProcessing
}: CreatePayableDialogProps) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    paymentTerms: 'Net 30',
    priority: 'medium',
    currency: 'INR',
    exchangeRate: 1,
    notes: '',
    tags: [] as string[],
    attachments: [] as string[]
  });

  const [lineItems, setLineItems] = useState<PayableLineItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: 18,
      taxAmount: 0,
      accountCode: '',
      projectId: '',
      departmentId: ''
    }
  ]);

  const [newTag, setNewTag] = useState('');

  const selectedVendor = vendors.find(v => v.id === formData.vendorId);

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTax = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = subtotal + totalTax;
    return { subtotal, totalTax, total };
  };

  const { subtotal, totalTax, total } = calculateTotals();

  const updateLineItem = (index: number, field: keyof PayableLineItem, value: any) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate totals for this line item
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      const item = updatedItems[index];
      item.totalPrice = item.quantity * item.unitPrice;
      item.taxAmount = (item.totalPrice * item.taxRate) / 100;
    }
    
    setLineItems(updatedItems);
  };

  const addLineItem = () => {
    const newItem: PayableLineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: 18,
      taxAmount: 0,
      accountCode: '',
      projectId: '',
      departmentId: ''
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payableData = {
      ...formData,
      vendorName: selectedVendor?.name || '',
      vendorEmail: selectedVendor?.email || '',
      subtotal,
      taxAmount: totalTax,
      totalAmount: total,
      lineItems
    };

    onCreatePayable(payableData);
  };

  const calculateDueDate = (paymentTerms: string) => {
    const invoiceDate = new Date(formData.invoiceDate);
    let daysToAdd = 30; // Default

    if (paymentTerms.includes('Net ')) {
      daysToAdd = parseInt(paymentTerms.replace('Net ', ''));
    } else if (paymentTerms === 'Due on receipt') {
      daysToAdd = 0;
    } else if (paymentTerms === 'COD') {
      daysToAdd = 0;
    }

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    
    setFormData({
      ...formData,
      paymentTerms,
      dueDate: dueDate.toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Payable Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="additional">Additional Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Vendor Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Select 
                    value={formData.vendorId} 
                    onValueChange={(value) => setFormData({ ...formData, vendorId: value })}
                    required
                  >
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

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    placeholder="Enter invoice number"
                    required
                  />
                </div>
              </div>

              {/* Vendor Information Display */}
              {selectedVendor && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{selectedVendor.name}</p>
                        <p className="text-gray-600">{selectedVendor.email}</p>
                        <p className="text-gray-600">{selectedVendor.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Terms: {selectedVendor.paymentTerms}</p>
                        <p className="text-gray-600">Category: {selectedVendor.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Balance: ₹{selectedVendor.currentBalance.toLocaleString()}</p>
                        <p className="text-gray-600">Credit Limit: ₹{selectedVendor.creditLimit.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dates and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms *</Label>
                  <Select 
                    value={formData.paymentTerms} 
                    onValueChange={calculateDueDate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Description and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter invoice description"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Line Items</h3>
                <Button type="button" onClick={addLineItem} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <Label>Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Unit Price *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Tax Rate (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.taxRate}
                          onChange={(e) => updateLineItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Account Code</Label>
                        <Input
                          value={item.accountCode || ''}
                          onChange={(e) => updateLineItem(index, 'accountCode', e.target.value)}
                          placeholder="Account code"
                        />
                      </div>
                      
                      <div>
                        <Label>Project</Label>
                        <Input
                          value={item.projectId || ''}
                          onChange={(e) => updateLineItem(index, 'projectId', e.target.value)}
                          placeholder="Project ID"
                        />
                      </div>
                      
                      <div>
                        <Label>Department</Label>
                        <Input
                          value={item.departmentId || ''}
                          onChange={(e) => updateLineItem(index, 'departmentId', e.target.value)}
                          placeholder="Department"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-4 text-sm">
                      <span>Subtotal: ₹{item.totalPrice.toLocaleString()}</span>
                      <span>Tax: ₹{item.taxAmount.toLocaleString()}</span>
                      <span className="font-semibold">
                        Total: ₹{(item.totalPrice + item.taxAmount).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Totals Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-end space-x-8 text-sm">
                    <div className="text-right">
                      <p>Subtotal:</p>
                      <p>Total Tax:</p>
                      <p className="font-bold text-lg">Total Amount:</p>
                    </div>
                    <div className="text-right">
                      <p>₹{subtotal.toLocaleString()}</p>
                      <p>₹{totalTax.toLocaleString()}</p>
                      <p className="font-bold text-lg">₹{total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional" className="space-y-4">
              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or comments"
                  rows={4}
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Drag and drop files here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DOC</p>
                  <Button type="button" variant="outline" className="mt-2">
                    Choose Files
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Creating...' : 'Create Payable Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};