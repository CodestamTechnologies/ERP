'use client';

import { Card, CardContent } from '@/components/ui/card';
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
  maskAccountNumber,
  getBankAccountHealth,
  formatLastSync
} from '@/lib/utils/bankAccountUtils';
import { 
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

interface AccountCardProps {
  account: BankAccount;
  showBalances: boolean;
  isSyncing: boolean;
  onViewDetails: (account: BankAccount) => void;
  onEdit: (account: BankAccount) => void;
  onDelete: (account: BankAccount) => void;
  onSync: (accountId: string) => void;
}

export const AccountCard = ({
  account,
  showBalances,
  isSyncing,
  onViewDetails,
  onEdit,
  onDelete,
  onSync
}: AccountCardProps) => {
  const health = getBankAccountHealth(account);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getRegionFlag(account.country)}</span>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{account.accountName}</h3>
                  <p className="text-sm text-gray-500">{account.bankName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                  {account.accountType}
                </Badge>
                <Badge variant="outline" className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
                <Badge variant="outline" className={getConnectionStatusColor(account.connectionStatus)}>
                  {getConnectionStatusIcon(account.connectionStatus)} {account.connectionStatus}
                </Badge>
                {account.isDefault && (
                  <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                    <Star size={12} className="mr-1" />
                    Default
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-mono text-sm">{maskAccountNumber(account.accountNumber)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-semibold text-lg">
                  {showBalances ? formatCurrency(account.balance, account.currency) : '••••••'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="font-semibold text-lg text-green-600">
                  {showBalances ? formatCurrency(account.availableBalance, account.currency) : '••••••'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {account.country}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatLastSync(account.lastSyncAt)}
                </span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    health.status === 'excellent' ? 'bg-green-500' :
                    health.status === 'good' ? 'bg-blue-500' :
                    health.status === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="capitalize">{health.status} Health</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onViewDetails(account)}
                >
                  <Eye size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onSync(account.id)}
                  disabled={isSyncing || account.connectionStatus === 'disconnected'}
                >
                  <RefreshCw size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onEdit(account)}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onDelete(account)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};