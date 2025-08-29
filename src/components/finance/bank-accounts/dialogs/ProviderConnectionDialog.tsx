'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { BankIntegrationProvider } from '@/types/bankAccount';
import { getRegionFlag, getAccountTypeColor, formatCurrency } from '@/lib/utils/bankAccountUtils';
import { 
  Building,
  Key,
  Database,
  Globe,
  FileText,
  CheckCircle,
  Info,
  Shield,
  ExternalLink,
  Plus,
  ArrowLeft,
  ArrowRight,
  Zap,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface ProviderConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  provider: BankIntegrationProvider | null;
  connectionStep: number;
  connectionData: any;
  connectionError: string | null;
  discoveredAccounts: any[];
  selectedAccountsToAdd: string[];
  isConnecting: boolean;
  onNextStep: () => void;
  onPrevStep: () => void;
  onConnectionDataChange: (data: any) => void;
  onTestConnection: () => void;
  onAccountSelectionChange: (accountId: string, selected: boolean) => void;
  onAddSelectedAccounts: () => void;
  onManualAdd: () => void;
}

export const ProviderConnectionDialog = ({
  isOpen,
  onClose,
  provider,
  connectionStep,
  connectionData,
  connectionError,
  discoveredAccounts,
  selectedAccountsToAdd,
  isConnecting,
  onNextStep,
  onPrevStep,
  onConnectionDataChange,
  onTestConnection,
  onAccountSelectionChange,
  onAddSelectedAccounts,
  onManualAdd
}: ProviderConnectionDialogProps) => {
  if (!provider) return null;

  const renderConnectionStep = () => {
    switch (connectionStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect to {provider.name}</h3>
              <p className="text-gray-600">{provider.description}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">What you'll get:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Security & Privacy</h4>
                  <p className="text-sm text-blue-800">
                    Your banking credentials are encrypted and securely transmitted. We never store your login details.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Supported Countries</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.supportedCountries.map(country => (
                    <Badge key={country} variant="outline" className="text-xs">
                      {getRegionFlag(country)} {country}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Connection Type</h4>
                <Badge variant="outline" className={
                  provider.connectionType === 'api' ? 'text-green-600 bg-green-50 border-green-200' :
                  provider.connectionType === 'open_banking' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  'text-orange-600 bg-orange-50 border-orange-200'
                }>
                  {provider.connectionType.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Credentials</h3>
              <p className="text-gray-600">
                Provide your banking credentials to establish a secure connection
              </p>
            </div>

            {connectionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-sm text-red-800">{connectionError}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {provider.connectionType === 'api' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username / Customer ID</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your banking username"
                      value={connectionData.username || ''}
                      onChange={(e) => onConnectionDataChange({...connectionData, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your banking password"
                      value={connectionData.password || ''}
                      onChange={(e) => onConnectionDataChange({...connectionData, password: e.target.value})}
                    />
                  </div>
                  {provider.id === 'yodlee' && (
                    <div className="space-y-2">
                      <Label htmlFor="securityQuestion">Security Question Answer</Label>
                      <Input
                        id="securityQuestion"
                        type="text"
                        placeholder="Answer to your security question"
                        value={connectionData.securityQuestion || ''}
                        onChange={(e) => onConnectionDataChange({...connectionData, securityQuestion: e.target.value})}
                      />
                    </div>
                  )}
                </>
              )}

              {provider.connectionType === 'open_banking' && (
                <div className="text-center py-8">
                  <Globe size={48} className="mx-auto text-blue-500 mb-4" />
                  <h4 className="font-medium mb-2">Open Banking Integration</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    You'll be redirected to your bank's secure login page
                  </p>
                  <Button onClick={onTestConnection} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink size={16} className="mr-2" />
                        Connect via Open Banking
                      </>
                    )}
                  </Button>
                </div>
              )}

              {provider.connectionType === 'manual' && (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-500 mb-4" />
                  <h4 className="font-medium mb-2">Manual Integration</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    You'll need to manually enter account details and upload statements
                  </p>
                  <Button onClick={onManualAdd}>
                    <Plus size={16} className="mr-2" />
                    Add Account Manually
                  </Button>
                </div>
              )}
            </div>

            {provider.connectionType === 'api' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Security Notice</h4>
                    <p className="text-sm text-yellow-800">
                      We use bank-level encryption to protect your credentials. Your login information is never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Accounts</h3>
              <p className="text-gray-600">
                Choose which accounts you'd like to connect to your ERP system
              </p>
            </div>

            <div className="space-y-4">
              {discoveredAccounts.map((account) => (
                <Card key={account.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={account.id}
                          checked={selectedAccountsToAdd.includes(account.id)}
                          onCheckedChange={(checked) => onAccountSelectionChange(account.id, !!checked)}
                        />
                        <div>
                          <h4 className="font-medium">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.bankName} • {account.accountNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                          {account.accountType}
                        </Badge>
                        <p className="font-semibold mt-1">
                          {formatCurrency(account.balance, account.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {discoveredAccounts.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="font-medium mb-2">No Accounts Found</h4>
                <p className="text-sm text-gray-600">
                  We couldn't find any accounts with the provided credentials. Please check and try again.
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Connection Successful</h4>
                  <p className="text-sm text-green-800">
                    Found {discoveredAccounts.length} account(s). Select the ones you want to add to your ERP system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building size={20} className="text-gray-600" />
            </div>
            Connect to {provider.name}
          </DialogTitle>
          <DialogDescription>
            Step {connectionStep} of 3: Setting up your bank account integration
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              connectionStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${connectionStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              connectionStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${connectionStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              connectionStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="py-4">
          {renderConnectionStep()}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {connectionStep > 1 && (
              <Button variant="outline" onClick={onPrevStep}>
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {connectionStep === 1 && (
              <Button onClick={onNextStep}>
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            {connectionStep === 2 && provider.connectionType === 'api' && (
              <Button 
                onClick={onTestConnection} 
                disabled={isConnecting || !connectionData.username || !connectionData.password}
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            )}
            {connectionStep === 3 && (
              <Button 
                onClick={onAddSelectedAccounts}
                disabled={isConnecting || selectedAccountsToAdd.length === 0}
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Adding Accounts...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Add {selectedAccountsToAdd.length} Account(s)
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};