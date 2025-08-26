'use client';

import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Send, 
  Save, 
  X, 
  Upload,
  Shield,
  Lock,
  Key,
  Clock
} from 'lucide-react';

export interface ComposeData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  [key: string]: any; // For service-specific fields
}

export interface ComposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: ComposeData) => void;
  onSaveDraft?: (data: ComposeData) => void;
  
  // Service configuration
  serviceName: string;
  serviceIcon: any;
  serviceColor: string;
  serviceType: 'google' | 'microsoft' | 'zoho' | 'proton';
  
  // Initial data (for replies/forwards)
  initialData?: Partial<ComposeData>;
  
  // Service-specific options
  securityOptions?: ReactNode;
  additionalFields?: ReactNode;
  customActions?: Array<{
    id: string;
    label: string;
    icon: any;
    action: (data: ComposeData) => void;
  }>;
  
  // Customization
  title?: string;
  description?: string;
  placeholder?: string;
}

const ComposeDialog = ({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
  serviceName,
  serviceIcon: ServiceIcon,
  serviceColor,
  serviceType,
  initialData = {},
  securityOptions,
  additionalFields,
  customActions,
  title,
  description,
  placeholder = "Write your professional email message here..."
}: ComposeDialogProps) => {
  const [composeData, setComposeData] = useState<ComposeData>({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
    priority: 'medium',
    ...initialData
  });

  const updateField = (field: string, value: any) => {
    setComposeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(composeData);
    onClose();
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(composeData);
    }
  };

  const getServiceSpecificTitle = () => {
    if (title) return title;
    
    switch (serviceType) {
      case 'google': return 'Compose Email - Gmail';
      case 'microsoft': return 'New Email - Outlook';
      case 'zoho': return 'Compose Email - Zoho Mail';
      case 'proton': return 'Compose Secure Email - ProtonMail';
      default: return 'Compose Email';
    }
  };

  const getServiceSpecificDescription = () => {
    if (description) return description;
    
    switch (serviceType) {
      case 'google': return 'Create and send professional business emails';
      case 'microsoft': return 'Create and send professional business emails through Microsoft 365';
      case 'zoho': return 'Create professional emails with CRM integration';
      case 'proton': return 'Send end-to-end encrypted emails with advanced security features';
      default: return 'Create and send professional emails';
    }
  };

  const renderProtonSecurityOptions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Security Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Switch
            id="encryption"
            checked={composeData.encryptionEnabled !== false}
            onCheckedChange={(checked) => updateField('encryptionEnabled', checked)}
          />
          <Label htmlFor="encryption" className="text-sm flex items-center">
            <Lock className="w-4 h-4 mr-2 text-green-600" />
            End-to-end encryption (Recommended)
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
          <Switch
            id="password"
            checked={composeData.passwordProtection || false}
            onCheckedChange={(checked) => updateField('passwordProtection', checked)}
          />
          <Label htmlFor="password" className="text-sm flex items-center">
            <Key className="w-4 h-4 mr-2 text-yellow-600" />
            Password protection for non-ProtonMail recipients
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
          <Switch
            id="expiration"
            checked={composeData.expirationEnabled || false}
            onCheckedChange={(checked) => updateField('expirationEnabled', checked)}
          />
          <Label htmlFor="expiration" className="text-sm flex items-center">
            <Clock className="w-4 h-4 mr-2 text-orange-600" />
            Set expiration time
          </Label>
        </div>

        {composeData.expirationEnabled && (
          <div className="ml-6">
            <Select 
              value={composeData.expirationTime || '7days'} 
              onValueChange={(value) => updateField('expirationTime', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hour">1 Hour</SelectItem>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderMicrosoftOptions = () => (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <Label htmlFor="importance">Importance</Label>
        <Select 
          value={composeData.importance || 'normal'} 
          onValueChange={(value) => updateField('importance', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">🔴 High</SelectItem>
            <SelectItem value="normal">⚪ Normal</SelectItem>
            <SelectItem value="low">🔵 Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sensitivity">Sensitivity</Label>
        <Select 
          value={composeData.sensitivity || 'normal'} 
          onValueChange={(value) => updateField('sensitivity', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="confidential">Confidential</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderZohoCRMIntegration = () => (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">CRM Integration</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Mail className="w-4 h-4 mr-1" />
            Find Contact
          </Button>
          <Button size="sm" variant="outline">
            <Mail className="w-4 h-4 mr-1" />
            Create Lead
          </Button>
        </div>
      </div>
    </div>
  );

  const getServiceSpecificOptions = () => {
    if (securityOptions) return securityOptions;
    
    switch (serviceType) {
      case 'proton': return renderProtonSecurityOptions();
      case 'microsoft': return renderMicrosoftOptions();
      case 'zoho': return renderZohoCRMIntegration();
      default: return null;
    }
  };

  const getAttachmentAreaStyle = () => {
    switch (serviceType) {
      case 'proton': return 'border-purple-300 bg-purple-50';
      case 'microsoft': return 'border-blue-300 bg-blue-50';
      case 'zoho': return 'border-orange-300 bg-orange-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getAttachmentText = () => {
    switch (serviceType) {
      case 'proton': return 'Files will be encrypted automatically';
      default: return 'Drag and drop files here or click to browse';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ServiceIcon className={`w-5 h-5 mr-2 ${serviceColor}`} />
            {getServiceSpecificTitle()}
          </DialogTitle>
          <DialogDescription>
            {getServiceSpecificDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSend} className="space-y-4 py-4">
          {/* Recipients */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="to">To *</Label>
              <Input 
                id="to" 
                type="email" 
                placeholder="recipient@company.com"
                value={composeData.to}
                onChange={(e) => updateField('to', e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cc">CC</Label>
              <Input 
                id="cc" 
                type="email" 
                placeholder="cc@company.com"
                value={composeData.cc}
                onChange={(e) => updateField('cc', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bcc">BCC</Label>
              <Input 
                id="bcc" 
                type="email" 
                placeholder="bcc@company.com"
                value={composeData.bcc}
                onChange={(e) => updateField('bcc', e.target.value)}
              />
            </div>
          </div>

          {/* Subject and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input 
                id="subject" 
                placeholder="Enter email subject..."
                value={composeData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={composeData.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => updateField('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Service-specific options */}
          {getServiceSpecificOptions()}

          {/* Additional fields */}
          {additionalFields}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <Textarea 
              id="content" 
              rows={12} 
              placeholder={placeholder}
              value={composeData.content}
              onChange={(e) => updateField('content', e.target.value)}
              required 
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className={`border-2 border-dashed rounded-lg p-4 text-center ${getAttachmentAreaStyle()}`}>
              {serviceType === 'proton' ? (
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm text-gray-600">{getAttachmentText()}</p>
              <Input type="file" multiple className="hidden" />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            {onSaveDraft && (
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
            {customActions?.map(action => (
              <Button 
                key={action.id}
                type="button" 
                variant="outline" 
                onClick={() => action.action(composeData)}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
            <Button type="submit" className={serviceType === 'proton' ? 'bg-purple-600 hover:bg-purple-700' : ''}>
              {serviceType === 'proton' ? <Shield className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {serviceType === 'proton' ? 'Send Encrypted' : 'Send Email'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog;