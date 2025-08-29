'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/hooks/useReimbursements';
import { 
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  Plus
} from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMethod: (methodData: Partial<PaymentMethod>) => Promise<void>;
  isProcessing: boolean;
}

export const PaymentMethodDialog = ({
  isOpen,
  onClose,
  onAddMethod,
  isProcessing
}: PaymentMethodDialogProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank_transfer' | 'check' | 'cash' | 'digital_wallet'>('bank_transfer');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  
  // Bank transfer settings
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  
  // General settings
  const [processingTime, setProcessingTime] = useState('');
  const [fees, setFees] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number | undefined>();
  const [monthlyLimit, setMonthlyLimit] = useState<number | undefined>();
  const [perTransactionLimit, setPerTransactionLimit] = useState<number | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type) {
      return;
    }

    const methodData: Partial<PaymentMethod> = {
      name,
      type,
      description,
      isActive,
      isDefault,
      settings: {
        ...(type === 'bank_transfer' && {
          bankName,
          accountNumber,
          routingNumber,
          swiftCode: swiftCode || undefined
        }),
        processingTime: processingTime || undefined,
        fees,
        limits: {
          ...(dailyLimit && { daily: dailyLimit }),
          ...(monthlyLimit && { monthly: monthlyLimit }),
          ...(perTransactionLimit && { perTransaction: perTransactionLimit })
        }
      }
    };

    try {
      await onAddMethod(methodData);
      handleClose();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setName('');
    setType('bank_transfer');
    setDescription('');
    setIsActive(true);
    setIsDefault(false);
    setBankName('');
    setAccountNumber('');
    setRoutingNumber('');
    setSwiftCode('');
    setProcessingTime('');
    setFees(0);
    setDailyLimit(undefined);
    setMonthlyLimit(undefined);
    setPerTransactionLimit(undefined);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return <CreditCard size={20} className="text-blue-600" />;
      case 'check':
        return <FileText size={20} className="text-green-600" />;
      case 'cash':
        return <Banknote size={20} className="text-orange-600" />;
      case 'digital_wallet':
        return <Smartphone size={20} className="text-purple-600" />;
      default:
        return <CreditCard size={20} className="text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={24} className="text-blue-600" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Configure a new payment method for processing reimbursements
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Method Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Primary Bank Account"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Payment Type</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="check">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      Check
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <Banknote size={16} />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="digital_wallet">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} />
                      Digital Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this payment method..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label htmlFor="isDefault">Set as Default</Label>
            </div>
          </div>

          {/* Bank Transfer Settings */}
          {type === 'bank_transfer' && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  {getTypeIcon(type)}
                  Bank Transfer Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g., Chase Bank"
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
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="021000021"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code (Optional)</Label>
                    <Input
                      id="swiftCode"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      placeholder="CHASUS33"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* General Settings */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Processing Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Processing Time</Label>
                  <Input
                    id="processingTime"
                    value={processingTime}
                    onChange={(e) => setProcessingTime(e.target.value)}
                    placeholder="e.g., 1-2 business days"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fees">Processing Fees ($)</Label>
                  <Input
                    id="fees"
                    type="number"
                    step="0.01"
                    value={fees}
                    onChange={(e) => setFees(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Limits */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Transaction Limits (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perTransactionLimit">Per Transaction ($)</Label>
                  <Input
                    id="perTransactionLimit"
                    type="number"
                    value={perTransactionLimit || ''}
                    onChange={(e) => setPerTransactionLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={dailyLimit || ''}
                    onChange={(e) => setDailyLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={monthlyLimit || ''}
                    onChange={(e) => setMonthlyLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="500000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3">Payment Method Preview</h4>
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(type)}
                <div>
                  <p className="font-semibold">{name || 'Payment Method Name'}</p>
                  <p className="text-sm text-gray-600">{description || 'Payment method description'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Type</p>
                  <p className="font-semibold capitalize">{type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-blue-700">Processing Time</p>
                  <p className="font-semibold">{processingTime || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-blue-700">Fees</p>
                  <p className="font-semibold">{fees === 0 ? 'Free' : `$${fees}`}</p>
                </div>
                <div>
                  <p className="text-blue-700">Status</p>
                  <p className="font-semibold">{isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !name}>
              {isProcessing ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};