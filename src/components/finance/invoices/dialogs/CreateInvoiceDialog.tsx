'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Customer, InvoiceTemplate, InvoiceLineItem } from '@/hooks/useInvoices';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useState } from 'react';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoiceData: any) => Promise<void>;
  customers: Customer[];
  templates: InvoiceTemplate[];
  isProcessing: boolean;
}

export const CreateInvoiceDialog = ({
  isOpen,
  onClose,
  onCreateInvoice,
  customers,
  templates,
  isProcessing
}: CreateInvoiceDialogProps) => {
  const [customerId, setCustomerId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('Payment due within 30 days');
  const [lineItems, setLineItems] = useState<Partial<InvoiceLineItem>[]>([
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discountRate: 0,
      totalAmount: 0
    }
  ]);

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedTemplate = templates.find(t => t.id === templateId) || templates.find(t => t.isDefault);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discountRate: 0,
      totalAmount: 0
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, updates: Partial<InvoiceLineItem>) => {
    const updatedItems = lineItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, ...updates };
        // Calculate total amount
        const quantity = updatedItem.quantity || 0;
        const unitPrice = updatedItem.unitPrice || 0;
        const taxRate = updatedItem.taxRate || 0;
        const discountRate = updatedItem.discountRate || 0;
        
        const subtotal = quantity * unitPrice;
        const discountAmount = subtotal * (discountRate / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxRate / 100);
        const totalAmount = taxableAmount + taxAmount;
        
        updatedItem.totalAmount = totalAmount;
        return updatedItem;
      }
      return item;
    });
    setLineItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
    const totalDiscount = lineItems.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + (itemSubtotal * ((item.discountRate || 0) / 100));
    }, 0);
    const taxableAmount = subtotal - totalDiscount;
    const totalTax = lineItems.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      const itemDiscount = itemSubtotal * ((item.discountRate || 0) / 100);
      const itemTaxable = itemSubtotal - itemDiscount;
      return sum + (itemTaxable * ((item.taxRate || 0) / 100));
    }, 0);
    const totalAmount = taxableAmount + totalTax;

    return { subtotal, totalDiscount, totalTax, totalAmount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || lineItems.length === 0) {
      return;
    }

    const totals = calculateTotals();
    
    const invoiceData = {
      customerId,
      customerName: selectedCustomer?.name,
      customerEmail: selectedCustomer?.email,
      customerAddress: selectedCustomer ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state} ${selectedCustomer.zipCode}` : '',
      issueDate,
      dueDate,
      templateId: templateId || selectedTemplate?.id,
      notes,
      terms,
      subtotal: totals.subtotal,
      taxAmount: totals.totalTax,
      discountAmount: totals.totalDiscount,
      totalAmount: totals.totalAmount,
      lineItems: lineItems.map((item, index) => ({
        ...item,
        id: `line-${Date.now()}-${index}`
      }))
    };

    try {
      await onCreateInvoice(invoiceData);
      handleClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setCustomerId('');
    setTemplateId('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setNotes('');
    setTerms('Payment due within 30 days');
    setLineItems([{
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      discountRate: 0,
      totalAmount: 0
    }]);
  };

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your customer
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedTemplate ? `${selectedTemplate.name} (Default)` : "Select template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.isDefault && '(Default)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Customer Information Display */}
          {selectedCustomer && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    {selectedCustomer.phone && <p><strong>Phone:</strong> {selectedCustomer.phone}</p>}
                  </div>
                  <div>
                    <p><strong>Address:</strong> {selectedCustomer.address}</p>
                    <p><strong>City:</strong> {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}</p>
                    <p><strong>Payment Terms:</strong> {selectedCustomer.paymentTerms} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description || ''}
                          onChange={(e) => updateLineItem(index, { description: e.target.value })}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity || ''}
                          onChange={(e) => updateLineItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice || ''}
                          onChange={(e) => updateLineItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.taxRate || ''}
                          onChange={(e) => updateLineItem(index, { taxRate: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label>Total</Label>
                          <div className="text-lg font-bold text-green-600">
                            ${(item.totalAmount || 0).toFixed(2)}
                          </div>
                        </div>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Invoice Totals */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Calculator size={18} />
                Invoice Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-green-700">Subtotal</p>
                  <p className="text-xl font-bold text-green-800">${totals.subtotal.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Discount</p>
                  <p className="text-xl font-bold text-green-800">-${totals.totalDiscount.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Tax</p>
                  <p className="text-xl font-bold text-green-800">${totals.totalTax.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700">Total</p>
                  <p className="text-2xl font-bold text-green-900">${totals.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the customer..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Payment Terms</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Payment terms and conditions..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !customerId || totals.totalAmount === 0}>
              {isProcessing ? 'Creating...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};