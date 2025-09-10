'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BankAccount } from '@/types/bankAccount';
import { 
  formatCurrency, 
  getAccountTypeColor, 
  getStatusColor, 
  getConnectionStatusColor,
  getConnectionStatusIcon,
  getRegionFlag,
  formatLastSync
} from '@/lib/utils/bankAccountUtils';

interface AccountDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount | null;
  onEdit: (account: BankAccount) => void;
}

export const AccountDetailDialog = ({
  isOpen,
  onClose,
  account,
  onEdit
}: AccountDetailDialogProps) => {
  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getRegionFlag(account.country)}</span>
            {account.accountName}
          </DialogTitle>
          <DialogDescription>
            Complete details for {account.bankName} account
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono">{account.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Name:</span>
                  <span className="font-medium">{account.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                    {account.accountType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Currency:</span>
                  <span className="font-medium">{account.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Country:</span>
                  <span className="font-medium">
                    {getRegionFlag(account.country)} {account.country}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Banking Codes</h3>
              <div className="space-y-3">
                {account.swiftCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">SWIFT Code:</span>
                    <span className="font-mono">{account.swiftCode}</span>
                  </div>
                )}
                {account.iban && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">IBAN:</span>
                    <span className="font-mono text-sm">{account.iban}</span>
                  </div>
                )}
                {account.routingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Routing Number:</span>
                    <span className="font-mono">{account.routingNumber}</span>
                  </div>
                )}
                {account.ifsc && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">IFSC Code:</span>
                    <span className="font-mono">{account.ifsc}</span>
                  </div>
                )}
                {account.sortCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sort Code:</span>
                    <span className="font-mono">{account.sortCode}</span>
                  </div>
                )}
                {account.bsb && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">BSB:</span>
                    <span className="font-mono">{account.bsb}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Balance & Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Balance:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(account.balance, account.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Available Balance:</span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrency(account.availableBalance, account.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant="outline" className={getStatusColor(account.status)}>
                    {account.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Connection:</span>
                  <Badge variant="outline" className={getConnectionStatusColor(account.connectionStatus)}>
                    {getConnectionStatusIcon(account.connectionStatus)} {account.connectionStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Sync:</span>
                  <span className="font-medium">{formatLastSync(account.lastSyncAt)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Features</h3>
              <div className="space-y-2">
                {Object.entries(account.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span className="text-gray-500 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {account.limits && (
              <div>
                <h3 className="text-lg font-medium mb-3">Limits & Fees</h3>
                <div className="space-y-3">
                  {account.limits.dailyTransferLimit && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Transfer Limit:</span>
                      <span className="font-medium">
                        {formatCurrency(account.limits.dailyTransferLimit, account.currency)}
                      </span>
                    </div>
                  )}
                  {account.limits.monthlyTransferLimit && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Transfer Limit:</span>
                      <span className="font-medium">
                        {formatCurrency(account.limits.monthlyTransferLimit, account.currency)}
                      </span>
                    </div>
                  )}
                  {account.limits.minimumBalance && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minimum Balance:</span>
                      <span className="font-medium">
                        {formatCurrency(account.limits.minimumBalance, account.currency)}
                      </span>
                    </div>
                  )}
                  {account.fees?.monthlyFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Fee:</span>
                      <span className="font-medium">
                        {formatCurrency(account.fees.monthlyFee, account.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {account.contactInfo && (
              <div>
                <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {account.contactInfo.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium">{account.contactInfo.phone}</span>
                    </div>
                  )}
                  {account.contactInfo.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{account.contactInfo.email}</span>
                    </div>
                  )}
                  {account.contactInfo.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium text-right max-w-xs">{account.contactInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => {
            onClose();
            onEdit(account);
          }}>
            Edit Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};