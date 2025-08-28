'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Account } from '@/hooks/useFinance';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (accountData: Partial<Account>) => Promise<void>;
  isProcessing: boolean;
}

export const AddAccountDialog = ({
  isOpen,
  onClose,
  onAddAccount,
  isProcessing
}: AddAccountDialogProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'cash' | 'credit' | 'investment'>('bank');
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState('INR');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      return;
    }

    const accountData: Partial<Account> = {
      name,
      type,
      balance,
      currency,
      accountNumber: accountNumber || undefined,
      bankName: bankName || undefined,
      status: 'active'
    };

    try {
      await onAddAccount(accountData);
      handleClose();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setName('');
    setType('bank');
    setBalance(0);
    setCurrency('INR');
    setAccountNumber('');
    setBankName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Add New Account
          </DialogTitle>
          <DialogDescription>
            Add a new financial account to track your money
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Building2 size={16} />
                Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Primary Business Account"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={type} onValueChange={(value: any) => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="cash">Cash Account</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="investment">Investment Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Opening Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
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
            </CardContent>
          </Card>

          {/* Bank Details (only for bank accounts) */}
          {(type === 'bank' || type === 'credit') && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Bank Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g., HDFC Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="****1234"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview - Compact */}
          {name && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <h4 className="font-medium text-blue-900 mb-2">Account Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Type:</strong> {type.charAt(0).toUpperCase() + type.slice(1)}</p>
                  </div>
                  <div>
                    <p><strong>Balance:</strong> {currency} {balance.toLocaleString()}</p>
                    {bankName && <p><strong>Bank:</strong> {bankName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !name}>
              {isProcessing ? 'Adding...' : 'Add Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};