'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceTemplate } from '@/hooks/useInvoices';
import { Palette, Plus, FileText, Eye } from 'lucide-react';
import { useState } from 'react';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTemplate: (templateData: Partial<InvoiceTemplate>) => Promise<void>;
  isProcessing: boolean;
}

export const CreateTemplateDialog = ({
  isOpen,
  onClose,
  onCreateTemplate,
  isProcessing
}: CreateTemplateDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState<'modern' | 'classic' | 'minimal' | 'professional'>('modern');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#F3F4F6');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [showLogo, setShowLogo] = useState(true);
  const [showCompanyDetails, setShowCompanyDetails] = useState(true);
  const [showPaymentTerms, setShowPaymentTerms] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      return;
    }

    const templateData: Partial<InvoiceTemplate> = {
      name,
      description,
      layout,
      primaryColor,
      secondaryColor,
      fontFamily,
      showLogo,
      showCompanyDetails,
      showPaymentTerms,
      showNotes,
      isDefault,
      customFields: []
    };

    try {
      await onCreateTemplate(templateData);
      handleClose();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setName('');
    setDescription('');
    setLayout('modern');
    setPrimaryColor('#3B82F6');
    setSecondaryColor('#F3F4F6');
    setFontFamily('Inter');
    setShowLogo(true);
    setShowCompanyDetails(true);
    setShowPaymentTerms(true);
    setShowNotes(true);
    setIsDefault(false);
  };

  const colorPresets = [
    { name: 'Blue', primary: '#3B82F6', secondary: '#F3F4F6' },
    { name: 'Green', primary: '#10B981', secondary: '#F0FDF4' },
    { name: 'Purple', primary: '#8B5CF6', secondary: '#FAF5FF' },
    { name: 'Red', primary: '#EF4444', secondary: '#FEF2F2' },
    { name: 'Orange', primary: '#F97316', secondary: '#FFF7ED' },
    { name: 'Gray', primary: '#6B7280', secondary: '#F9FAFB' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={24} className="text-purple-600" />
            Create Invoice Template
          </DialogTitle>
          <DialogDescription>
            Design a custom invoice template for your business
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText size={18} />
                Template Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Modern Professional"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout Style</Label>
                  <Select value={layout} onValueChange={(value: any) => setLayout(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this template..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Design Settings */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Palette size={18} />
                Design & Colors
              </h4>
              
              {/* Color Presets */}
              <div className="mb-4">
                <Label className="text-sm font-medium">Color Presets</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className="p-2 rounded-lg border hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#F3F4F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Elements */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Template Elements</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showLogo"
                    checked={showLogo}
                    onCheckedChange={setShowLogo}
                  />
                  <Label htmlFor="showLogo">Show Logo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showCompanyDetails"
                    checked={showCompanyDetails}
                    onCheckedChange={setShowCompanyDetails}
                  />
                  <Label htmlFor="showCompanyDetails">Company Details</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPaymentTerms"
                    checked={showPaymentTerms}
                    onCheckedChange={setShowPaymentTerms}
                  />
                  <Label htmlFor="showPaymentTerms">Payment Terms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showNotes"
                    checked={showNotes}
                    onCheckedChange={setShowNotes}
                  />
                  <Label htmlFor="showNotes">Notes Section</Label>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="isDefault">Set as Default Template</Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Eye size={18} />
                Template Preview
              </h4>
              <div 
                className="border-2 border-dashed rounded-lg p-6 min-h-[200px] flex flex-col justify-center"
                style={{ 
                  borderColor: primaryColor + '40',
                  backgroundColor: secondaryColor + '20',
                  fontFamily: fontFamily
                }}
              >
                <div className="text-center">
                  {showLogo && (
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: primaryColor + '20' }}
                    >
                      <FileText size={32} style={{ color: primaryColor }} />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                    {name || 'Template Name'}
                  </h3>
                  
                  {showCompanyDetails && (
                    <div className="mb-4 text-sm text-gray-600">
                      <p>Your Company Name</p>
                      <p>123 Business Street, City, State 12345</p>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Invoice #INV-001</span>
                      <span className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Sample Service</span>
                        <span>$100.00</span>
                      </div>
                    </div>
                  </div>
                  
                  {showPaymentTerms && (
                    <p className="text-xs text-gray-500 mb-2">Payment due within 30 days</p>
                  )}
                  
                  {showNotes && (
                    <p className="text-xs text-gray-500">Thank you for your business!</p>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-400">
                    Layout: {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing || !name}>
              {isProcessing ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};