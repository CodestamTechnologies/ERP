'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BankAccount } from '@/types/bankAccount';
import { Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface UploadStatementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onUpload: (file: File, accountId: string) => Promise<void>;
  isProcessing: boolean;
}

export const UploadStatementDialog = ({
  isOpen,
  onClose,
  accounts,
  onUpload,
  isProcessing
}: UploadStatementDialogProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadingFile || !selectedAccount) return;
    
    try {
      await onUpload(uploadingFile, selectedAccount);
      onClose();
      setUploadingFile(null);
      setSelectedAccount('');
    } catch (error) {
      console.error('Error uploading statement:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setUploadingFile(null);
    setSelectedAccount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>
            Upload a bank statement file for reconciliation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="account">Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountName} - {account.bankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Statement File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-gray-500">
              Supported formats: PDF, CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          {uploadingFile && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <strong>File:</strong> {uploadingFile.name}<br />
                <strong>Size:</strong> {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!uploadingFile || !selectedAccount || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};