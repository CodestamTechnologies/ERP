'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BillLineItem } from '@/hooks/useInvoices';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useState } from 'react';
interface BillData {
  vendorName: string;
  vendorEmail: string;
  billDate: string;
  dueDate: string;
  notes: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  lineItems: Array<BillLineItem & { id: string }>;
}
interface CreateBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBill: (billData: BillData) => Promise<void>;
  isProcessing: boolean;
}

export const CreateBillDialog = ({
  isOpen,
  onClose,
  onCreateBill,
  isProcessing
}: CreateBillDialogProps) => {
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<Partial<BillLineItem>[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 0, totalAmount: 0 }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, taxRate: 0, totalAmount: 0 }]);
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
    if (!vendorName || lineItems.length === 0) return;

    const totals = calculateTotals();
    const billData = {
      vendorName, vendorEmail, billDate, dueDate, notes,
      subtotal: totals.subtotal, taxAmount: totals.totalTax, totalAmount: totals.totalAmount,
      lineItems: lineItems.map((item, index) => ({
        id: `line-${Date.now()}-${index}`,
        description: item.description || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        taxRate: item.taxRate || 0,
        totalAmount: item.totalAmount || 0,
        category: item.category
      }))
    };

    try {
      await onCreateBill(billData);
      handleClose();
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setVendorName(''); setVendorEmail(''); setNotes('');
    setBillDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, taxRate: 0, totalAmount: 0 }]);
  };

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogDescription>Create a new vendor bill for payment processing</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input id="vendorName" value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorEmail">Vendor Email</Label>
              <Input id="vendorEmail" type="email" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billDate">Bill Date</Label>
              <Input id="billDate" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Bill Items</h3>
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus size={16} className="mr-2" />Add Item
              </Button>
            </div>
            
            {lineItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={item.description || ''} onChange={(e) => updateLineItem(index, { description: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" min="0" step="0.01" value={item.quantity || ''} onChange={(e) => updateLineItem(index, { quantity: parseFloat(e.target.value) || 0 })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Price</Label>
                      <Input type="number" min="0" step="0.01" value={item.unitPrice || ''} onChange={(e) => updateLineItem(index, { unitPrice: parseFloat(e.target.value) || 0 })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax %</Label>
                      <Input type="number" min="0" max="100" step="0.01" value={item.taxRate || ''} onChange={(e) => updateLineItem(index, { taxRate: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Total</Label>
                        <div className="text-lg font-bold">${(item.totalAmount || 0).toFixed(2)}</div>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeLineItem(index)} disabled={lineItems.length === 1}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Calculator size={18} />Bill Summary
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-sm text-green-700">Subtotal</p><p className="text-xl font-bold">${totals.subtotal.toFixed(2)}</p></div>
                <div><p className="text-sm text-green-700">Tax</p><p className="text-xl font-bold">${totals.totalTax.toFixed(2)}</p></div>
                <div><p className="text-sm text-green-700">Total</p><p className="text-2xl font-bold">${totals.totalAmount.toFixed(2)}</p></div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isProcessing || !vendorName || totals.totalAmount === 0}>
              {isProcessing ? 'Creating...' : 'Create Bill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};