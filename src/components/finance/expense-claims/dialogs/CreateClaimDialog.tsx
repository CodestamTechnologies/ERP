'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ExpensePolicy, ExpenseItem } from '@/hooks/useExpenseClaims';
import { Plus, Trash2, Upload, Receipt } from 'lucide-react';
import { useState } from 'react';

interface CreateClaimDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateClaim: (claimData: any) => Promise<void>;
  policies: ExpensePolicy[];
  isProcessing: boolean;
}

export const CreateClaimDialog = ({
  isOpen,
  onClose,
  onCreateClaim,
  policies,
  isProcessing
}: CreateClaimDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [expenses, setExpenses] = useState<Partial<ExpenseItem>[]>([
    {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: 0,
      currency: 'USD',
      isReimbursable: true
    }
  ]);

  const addExpense = () => {
    setExpenses([...expenses, {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: category || '',
      amount: 0,
      currency: 'USD',
      isReimbursable: true
    }]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, updates: Partial<ExpenseItem>) => {
    setExpenses(expenses.map((expense, i) => 
      i === index ? { ...expense, ...updates } : expense
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || expenses.length === 0) {
      return;
    }

    const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const claimData = {
      title,
      description,
      category,
      department,
      amount: totalAmount,
      expenses: expenses.map((exp, index) => ({
        ...exp,
        id: `exp-${Date.now()}-${index}`
      }))
    };

    try {
      await onCreateClaim(claimData);
      handleClose();
    } catch (error) {
      console.error('Error creating claim:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setDescription('');
    setCategory('');
    setDepartment('');
    setExpenses([{
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: 0,
      currency: 'USD',
      isReimbursable: true
    }]);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const applicablePolicy = policies.find(p => p.category === category);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Expense Claim</DialogTitle>
          <DialogDescription>
            Submit a new expense claim for reimbursement
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Claim Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Business Trip to New York"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="meals">Meals</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Provide details about this expense claim..."
              rows={3}
            />
          </div>

          {/* Policy Information */}
          {applicablePolicy && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Policy Information</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Policy:</strong> {applicablePolicy.name}</p>
                  {applicablePolicy.dailyLimit && (
                    <p><strong>Daily Limit:</strong> ${applicablePolicy.dailyLimit.toLocaleString()}</p>
                  )}
                  {applicablePolicy.monthlyLimit && (
                    <p><strong>Monthly Limit:</strong> ${applicablePolicy.monthlyLimit.toLocaleString()}</p>
                  )}
                  <p><strong>Requires Receipt:</strong> {applicablePolicy.requiresReceipt ? 'Yes' : 'No'}</p>
                  <p><strong>Requires Approval:</strong> {applicablePolicy.requiresApproval ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expenses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Expense Items</h3>
              <Button type="button" variant="outline" onClick={addExpense}>
                <Plus size={16} className="mr-2" />
                Add Expense
              </Button>
            </div>
            
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={expense.date || ''}
                          onChange={(e) => updateExpense(index, { date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={expense.description || ''}
                          onChange={(e) => updateExpense(index, { description: e.target.value })}
                          placeholder="Expense description"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={expense.amount || ''}
                          onChange={(e) => updateExpense(index, { amount: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Receipt</Label>
                        <Button type="button" variant="outline" size="sm" className="w-full">
                          <Upload size={14} className="mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => removeExpense(index)}
                          disabled={expenses.length === 1}
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

          {/* Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-2">Claim Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-800">{expenses.length}</p>
                  <p className="text-sm text-green-700">Expense Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">${totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Total Amount</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-800">
                    {expenses.filter(e => e.isReimbursable).length}
                  </p>
                  <p className="text-sm text-green-700">Reimbursable</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || totalAmount === 0}>
              {isProcessing ? 'Creating...' : 'Create Claim'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};