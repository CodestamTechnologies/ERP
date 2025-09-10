'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Budget } from '@/hooks/useFinance';
import { Target, Plus } from 'lucide-react';
import { useState } from 'react';

interface CreateBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBudget: (budgetData: Partial<Budget>) => Promise<void>;
  isProcessing: boolean;
}

const BUDGET_CATEGORIES = [
  'Marketing',
  'Operations',
  'R&D',
  'HR & Payroll',
  'Office Supplies',
  'Travel',
  'Equipment',
  'Software',
  'Professional Services',
  'Insurance',
  'Rent',
  'Utilities',
  'Other'
];

export const CreateBudgetDialog = ({
  isOpen,
  onClose,
  onCreateBudget,
  isProcessing
}: CreateBudgetDialogProps) => {
  const [category, setCategory] = useState('');
  const [allocated, setAllocated] = useState<number>(0);
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  // Calculate end date based on period
  const calculateEndDate = (start: string, period: string) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    
    switch (period) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate.toISOString().split('T')[0];
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setEndDate(calculateEndDate(date, period));
  };

  const handlePeriodChange = (newPeriod: 'monthly' | 'quarterly' | 'yearly') => {
    setPeriod(newPeriod);
    if (startDate) {
      setEndDate(calculateEndDate(startDate, newPeriod));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !allocated) {
      return;
    }

    const budgetData: Partial<Budget> = {
      category,
      allocated,
      spent: 0,
      period,
      status: 'on-track',
      startDate,
      endDate: endDate || calculateEndDate(startDate, period)
    };

    try {
      await onCreateBudget(budgetData);
      handleClose();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setCategory('');
    setAllocated(0);
    setPeriod('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
  };

  // Initialize end date on first render
  useState(() => {
    if (startDate && !endDate) {
      setEndDate(calculateEndDate(startDate, period));
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-purple-600" />
            Create Budget
          </DialogTitle>
          <DialogDescription>
            Set spending limits and track expenses by category
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Budget Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target size={16} />
                Budget Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allocated">Budget Amount *</Label>
                  <Input
                    id="allocated"
                    type="number"
                    step="0.01"
                    min="0"
                    value={allocated}
                    onChange={(e) => setAllocated(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Budget Period</Label>
                  <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Summary - Compact */}
          {category && allocated > 0 && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-3">
                <h4 className="font-medium text-purple-900 mb-2">Budget Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-purple-700">Category:</p>
                    <p className="font-semibold">{category}</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Amount:</p>
                    <p className="font-semibold">₹{allocated.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Period:</p>
                    <p className="font-semibold capitalize">{period}</p>
                  </div>
                  <div>
                    <p className="text-purple-700">Duration:</p>
                    <p className="font-semibold">
                      {period === 'monthly' ? '1 Month' : 
                       period === 'quarterly' ? '3 Months' : 
                       '12 Months'}
                    </p>
                  </div>
                </div>
                {allocated > 0 && period !== 'monthly' && (
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Monthly Average:</span>
                      <span className="font-semibold">
                        ₹{(allocated / (period === 'quarterly' ? 3 : 12)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !category || !allocated}>
              {isProcessing ? 'Creating...' : 'Create Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};