'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod, ReimbursementLineItem } from '@/hooks/useReimbursements';
import { Plus, Trash2, Upload, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface CreateReimbursementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReimbursement: (reimbursementData: any) => Promise<void>;
  paymentMethods: PaymentMethod[];
  isProcessing: boolean;
}

export const CreateReimbursementDialog = ({
  isOpen,
  onClose,
  onCreateReimbursement,
  paymentMethods,
  isProcessing
}: CreateReimbursementDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('medium');
  const [lineItems, setLineItems] = useState<Partial<ReimbursementLineItem>[]>([
    {
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, updates: Partial<ReimbursementLineItem>) => {
    setLineItems(lineItems.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || lineItems.length === 0) {
      return;
    }

    const totalAmount = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

    const reimbursementData = {
      title,
      description,
      type,
      department,
      priority,
      amount: totalAmount,
      lineItems: lineItems.map((item, index) => ({
        ...item,
        id: `line-${Date.now()}-${index}`
      }))
    };

    try {
      await onCreateReimbursement(reimbursementData);
      handleClose();
    } catch (error) {
      console.error('Error creating reimbursement:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setDescription('');
    setType('');
    setDepartment('');
    setPriority('medium');
    setLineItems([{
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    }]);
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Reimbursement</DialogTitle>
          <DialogDescription>
            Submit a new reimbursement request for approval and payment
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Reimbursement Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Business Travel Expenses"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
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
              <Label>Total Amount</Label>
              <div className="text-2xl font-bold text-green-600">
                ${totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this reimbursement request..."
              rows={3}
            />
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Expense Items</h3>
              <Button type="button" variant="outline" onClick={addLineItem}>
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={item.date || ''}
                          onChange={(e) => updateLineItem(index, { date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description || ''}
                          onChange={(e) => updateLineItem(index, { description: e.target.value })}
                          placeholder="Item description"
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
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Lodging">Lodging</SelectItem>
                            <SelectItem value="Meals">Meals</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Training">Training</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.amount || ''}
                          onChange={(e) => updateLineItem(index, { amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button type="button" variant="outline" size="sm" className="flex-1">
                          <Upload size={14} className="mr-1" />
                          Receipt
                        </Button>
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
                    {item.notes && (
                      <div className="mt-3">
                        <Label>Notes</Label>
                        <Textarea
                          value={item.notes || ''}
                          onChange={(e) => updateLineItem(index, { notes: e.target.value })}
                          placeholder="Additional notes for this item..."
                          rows={2}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method Preference */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} />
                Payment Preference
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Payment Method</Label>
                  <Select defaultValue={paymentMethods.find(m => m.isDefault)?.id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.filter(m => m.isActive).map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bank Account (if applicable)</Label>
                  <Input placeholder="Account ending in..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-2">Reimbursement Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-800">{lineItems.length}</p>
                  <p className="text-sm text-green-700">Line Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">${totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Total Amount</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800 capitalize">{priority}</p>
                  <p className="text-sm text-green-700">Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || totalAmount === 0}>
              {isProcessing ? 'Creating...' : 'Create Reimbursement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};