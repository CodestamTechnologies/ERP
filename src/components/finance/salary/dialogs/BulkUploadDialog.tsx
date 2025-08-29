'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export const BulkUploadDialog = ({
  isOpen,
  onClose,
  onUpload,
  isProcessing
}: BulkUploadDialogProps) => {
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadingFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadingFile) return;
    
    try {
      await onUpload(uploadingFile);
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setUploadingFile(null);
    setDragActive(false);
  };

  const downloadTemplate = () => {
    const csvContent = [
      'Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Basic Salary,HRA,Allowances,Bank Account,Bank Name,IFSC Code',
      'EMP001,John,Doe,john.doe@company.com,+1-555-0101,Engineering,Senior Software Engineer,80000,24000,12000,1234567890,Chase Bank,CHAS0001234',
      'EMP002,Sarah,Johnson,sarah.johnson@company.com,+1-555-0102,Sales,Sales Manager,75000,22500,15000,2345678901,Wells Fargo,WELL0001234'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={24} className="text-blue-600" />
            Bulk Upload Salary Data
          </DialogTitle>
          <DialogDescription>
            Upload employee salary information using CSV or Excel files
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Upload Instructions</h4>
                  <ul className="text-xs text-blue-800 space-y-0.5">
                    <li>• Download template file for required format</li>
                    <li>• Supports CSV, Excel (.xlsx, .xls) up to 10MB</li>
                    <li>• Ensure all required fields are filled</li>
                    <li>• Employee IDs must be unique</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Download */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Download Template</h4>
                  <p className="text-xs text-gray-600">CSV template with sample data</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download size={14} className="mr-1" />
                  Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card>
            <CardContent className="p-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileSpreadsheet size={24} className="text-gray-600" />
                  </div>
                  
                  {uploadingFile ? (
                    <div className="text-center">
                      <p className="font-medium text-green-700 text-sm">File Selected</p>
                      <p className="text-sm text-gray-600">{uploadingFile.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium mb-1 text-sm">Drop file here or click to browse</p>
                      <p className="text-xs text-gray-600 mb-3">
                        CSV, Excel (.xlsx, .xls) up to 10MB
                      </p>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload size={14} className="mr-1" />
                            Choose File
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Rules */}
          <Card>
            <CardContent className="p-3">
              <h4 className="font-medium mb-2 text-sm">Validation Rules</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                  <span>Employee ID must be unique</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                  <span>Email addresses must be valid</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                  <span>Salary amounts must be numeric</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                  <span>Bank details must follow standard format</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-900 text-sm">Important Notice</h4>
                  <p className="text-xs text-yellow-800 mt-1">
                    Uploading will update existing records if Employee IDs match. 
                    New employees will be created for unique IDs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!uploadingFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <Upload size={16} className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};