'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BankAccount } from '@/types/bankAccount';
import { getRegionFlag } from '@/lib/utils/bankAccountUtils';

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount: BankAccount | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddAccountDialog = ({
  isOpen,
  onClose,
  editingAccount,
  onSubmit
}: AddAccountDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
          <DialogDescription>
            {editingAccount ? 'Update your bank account details.' : 'Connect a new bank account to your ERP system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input 
                  id="accountName" 
                  name="accountName" 
                  defaultValue={editingAccount?.accountName || ''} 
                  required 
                  placeholder="e.g., Business Checking Account"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName" 
                  name="bankName" 
                  defaultValue={editingAccount?.bankName || ''} 
                  required 
                  placeholder="e.g., Chase Bank"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select name="accountType" defaultValue={editingAccount?.accountType || 'checking'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select name="currency" defaultValue={editingAccount?.currency || 'USD'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select name="country" defaultValue={editingAccount?.country || 'US'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">{getRegionFlag('US')} United States</SelectItem>
                      <SelectItem value="GB">{getRegionFlag('GB')} United Kingdom</SelectItem>
                      <SelectItem value="DE">{getRegionFlag('DE')} Germany</SelectItem>
                      <SelectItem value="FR">{getRegionFlag('FR')} France</SelectItem>
                      <SelectItem value="IN">{getRegionFlag('IN')} India</SelectItem>
                      <SelectItem value="CA">{getRegionFlag('CA')} Canada</SelectItem>
                      <SelectItem value="AU">{getRegionFlag('AU')} Australia</SelectItem>
                      <SelectItem value="JP">{getRegionFlag('JP')} Japan</SelectItem>
                      <SelectItem value="CN">{getRegionFlag('CN')} China</SelectItem>
                      <SelectItem value="SG">{getRegionFlag('SG')} Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select name="region" defaultValue={editingAccount?.region || 'domestic'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Domestic</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Details</h3>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber" 
                  name="accountNumber" 
                  defaultValue={editingAccount?.accountNumber || ''} 
                  required 
                  placeholder="Enter full account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankCode">Bank Code</Label>
                <Input 
                  id="bankCode" 
                  name="bankCode" 
                  defaultValue={editingAccount?.bankCode || ''} 
                  placeholder="Bank identifier code"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT Code</Label>
                  <Input 
                    id="swiftCode" 
                    name="swiftCode" 
                    defaultValue={editingAccount?.swiftCode || ''} 
                    placeholder="e.g., CHASUS33XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input 
                    id="iban" 
                    name="iban" 
                    defaultValue={editingAccount?.iban || ''} 
                    placeholder="International Bank Account Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number (US)</Label>
                  <Input 
                    id="routingNumber" 
                    name="routingNumber" 
                    defaultValue={editingAccount?.routingNumber || ''} 
                    placeholder="9-digit routing number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortCode">Sort Code (UK)</Label>
                  <Input 
                    id="sortCode" 
                    name="sortCode" 
                    defaultValue={editingAccount?.sortCode || ''} 
                    placeholder="6-digit sort code"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code (India)</Label>
                  <Input 
                    id="ifsc" 
                    name="ifsc" 
                    defaultValue={editingAccount?.ifsc || ''} 
                    placeholder="e.g., HDFC0000123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bsb">BSB (Australia)</Label>
                  <Input 
                    id="bsb" 
                    name="bsb" 
                    defaultValue={editingAccount?.bsb || ''} 
                    placeholder="6-digit BSB number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Balance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input 
                    id="balance" 
                    name="balance" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingAccount?.balance || ''} 
                    required 
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableBalance">Available Balance</Label>
                  <Input 
                    id="availableBalance" 
                    name="availableBalance" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingAccount?.availableBalance || ''} 
                    required 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select name="status" defaultValue={editingAccount?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isDefault" 
                  name="isDefault" 
                  defaultChecked={editingAccount?.isDefault || false}
                />
                <Label htmlFor="isDefault">Set as default account</Label>
              </div>
            </div>

            {/* Features & Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Features & Limits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="realTimeSync" 
                    name="realTimeSync" 
                    defaultChecked={editingAccount?.features.realTimeSync || false}
                  />
                  <Label htmlFor="realTimeSync">Real-time sync</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="transactionHistory" 
                    name="transactionHistory" 
                    defaultChecked={editingAccount?.features.transactionHistory || true}
                  />
                  <Label htmlFor="transactionHistory">Transaction history</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="transferSupport" 
                    name="transferSupport" 
                    defaultChecked={editingAccount?.features.transferSupport || false}
                  />
                  <Label htmlFor="transferSupport">Transfer support</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="billPayment" 
                    name="billPayment" 
                    defaultChecked={editingAccount?.features.billPayment || false}
                  />
                  <Label htmlFor="billPayment">Bill payment</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyTransferLimit">Daily Transfer Limit</Label>
                <Input 
                  id="dailyTransferLimit" 
                  name="dailyTransferLimit" 
                  type="number"
                  defaultValue={editingAccount?.limits?.dailyTransferLimit || ''} 
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyTransferLimit">Monthly Transfer Limit</Label>
                <Input 
                  id="monthlyTransferLimit" 
                  name="monthlyTransferLimit" 
                  type="number"
                  defaultValue={editingAccount?.limits?.monthlyTransferLimit || ''} 
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumBalance">Minimum Balance</Label>
                <Input 
                  id="minimumBalance" 
                  name="minimumBalance" 
                  type="number"
                  step="0.01"
                  defaultValue={editingAccount?.limits?.minimumBalance || ''} 
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAccount ? 'Update Account' : 'Add Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};