'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Bill, BillLineItem } from '@/hooks/useInvoices';
import { Plus, Trash2, Calculator, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onUpdateBill: (billId: string, billData: Partial<Bill>) => Promise<void>;
  isProcessing: boolean;
}

export const EditBillDialog = ({
  isOpen,
  onClose,
  bill,
  onUpdateBill,
  isProcessing
}: EditBillDialogProps) => {
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [billDate, setBillDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'draft' | 'pending' | 'approved' | 'paid' | 'overdue'>('draft');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<Partial<BillLineItem>[]>([]);

  // Initialize form with bill data
  useEffect(() => {
    if (bill) {
      setVendorName(bill.vendorName);
      setVendorEmail(bill.vendorEmail);
      setBillDate(bill.billDate.split('T')[0]);
      setDueDate(bill.dueDate.split('T')[0]);
      setStatus(bill.status);
      setNotes(bill.notes || '');
      setLineItems(bill.lineItems);
    }
  }, [bill]);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      totalAmount: 0,
      category: ''
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, updates: Partial<BillLineItem>) => {
    const updatedItems = lineItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, ...updates };
        const quantity = updatedItem.quantity || 0;
        const unitPrice = updatedItem.unitPrice || 0;
        const taxRate = updatedItem.taxRate || 0;
        const subtotal = quantity * unitPrice;
        const taxAmount = subtotal * (taxRate / 100);
        updatedItem.totalAmount = subtotal + taxAmount;
        return updatedItem;
      }
      return item;
    });
    setLineItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
    const totalTax = lineItems.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      return sum + (itemSubtotal * ((item.taxRate || 0) / 100));
    }, 0);
    return { subtotal, totalTax, totalAmount: subtotal + totalTax };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bill || !vendorName || lineItems.length === 0) return;

    const totals = calculateTotals();
    const billData: Partial<Bill> = {
      vendorName,
      vendorEmail,
      billDate: new Date(billDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      status,
      notes,
      subtotal: totals.subtotal,
      taxAmount: totals.totalTax,
      totalAmount: totals.totalAmount,
      balanceAmount: totals.totalAmount - (bill.paidAmount || 0),
      lineItems: lineItems.map((item, index) => ({
        ...item,
        id: item.id || `line-${Date.now()}-${index}`
      })) as BillLineItem[]
    };

    try {
      await onUpdateBill(bill.id, billData);
      onClose();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  if (!bill) return null;

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit size={24} className="text-blue-600" />
            Edit Bill - {bill.billNumber}
          </DialogTitle>
          <DialogDescription>
            Update bill information and line items
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                id="vendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorEmail">Vendor Email</Label>
              <Input
                id="vendorEmail"
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billDate">Bill Date</Label>
              <Input
                id="billDate"
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Bill Items</h3>
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
            
            {lineItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={item.description || ''}
                        onChange={(e) => updateLineItem(index, { description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={item.category || ''} 
                        onValueChange={(value) => updateLineItem(index, { category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Services">Services</SelectItem>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Total</Label>
                        <div className="text-lg font-bold">${(item.totalAmount || 0).toFixed(2)}</div>
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

          {/* Bill Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Calculator size={18} />
                Bill Summary
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-green-700">Subtotal</p>
                  <p className="text-xl font-bold text-green-800">${totals.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Tax</p>
                  <p className="text-xl font-bold text-green-800">${totals.totalTax.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Total</p>
                  <p className="text-2xl font-bold text-green-900">${totals.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              {bill.paidAmount > 0 && (
                <div className="mt-3 text-center">
                  <p className="text-sm text-green-700">Paid Amount</p>
                  <p className="text-lg font-bold text-green-800">${bill.paidAmount.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Balance: ${(totals.totalAmount - bill.paidAmount).toFixed(2)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this bill..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !vendorName || totals.totalAmount === 0}>
              {isProcessing ? 'Updating...' : 'Update Bill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};