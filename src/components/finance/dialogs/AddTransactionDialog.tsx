'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction, Account } from '@/hooks/useFinance';
import { Plus, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transactionData: Partial<Transaction>) => Promise<void>;
  accounts: Account[];
  isProcessing: boolean;
}

const TRANSACTION_CATEGORIES = {
  income: [
    'Sales Revenue',
    'Consulting Revenue',
    'Investment Income',
    'Interest Income',
    'Other Income'
  ],
  expense: [
    'Office Supplies',
    'Marketing',
    'Utilities',
    'Travel',
    'Equipment',
    'Software',
    'Professional Services',
    'Insurance',
    'Rent',
    'Other Expenses'
  ]
};

export const AddTransactionDialog = ({
  isOpen,
  onClose,
  onAddTransaction,
  accounts,
  isProcessing
}: AddTransactionDialogProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [reference, setReference] = useState('');
  const [tags, setTags] = useState('');

  const selectedAccount = accounts.find(acc => acc.id === accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !accountId) {
      return;
    }

    const transactionData: Partial<Transaction> = {
      type,
      category,
      amount,
      description,
      date,
      accountId,
      account: selectedAccount?.name || '',
      reference: reference || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'completed'
    };

    try {
      await onAddTransaction(transactionData);
      handleClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setType('expense');
    setCategory('');
    setAmount(0);
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setAccountId('');
    setReference('');
    setTags('');
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(''); // Reset category when type changes
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-green-600" />
            Quick Entry - Add Transaction
          </DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Essential Fields Only - Compact Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_CATEGORIES[type].map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account *</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Invoice #, Receipt #"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter transaction description..."
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="business, travel, equipment"
              />
            </div>

            {/* Account Balance Preview - Compact */}
            {selectedAccount && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-gray-600">Current: ₹{selectedAccount.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`font-medium ${
                        type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        New: ₹{(selectedAccount.balance + (type === 'income' ? amount : -amount)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction Summary - Compact */}
            {category && amount > 0 && selectedAccount && (
              <Card className={`${type === 'income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <p className={`font-medium ${type === 'income' ? 'text-green-900' : 'text-red-900'}`}>
                        {type === 'income' ? '+' : '-'}₹{amount.toLocaleString()}
                      </p>
                      <p className="text-gray-600">{category}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600">{selectedAccount.name}</p>
                      <p className="text-gray-500">{new Date(date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || !category || !amount || !accountId}
            className="min-w-[100px]"
          >
            {isProcessing ? 'Adding...' : 'Add Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};