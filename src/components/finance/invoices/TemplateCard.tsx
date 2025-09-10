'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvoiceTemplate } from '@/hooks/useInvoices';
import { 
  FileText,
  Palette,
  Type,
  Layout,
  Eye,
  Edit,
  Star
} from 'lucide-react';

interface TemplateCardProps {
  template: InvoiceTemplate;
  onUse: () => void;
  onPreview?: () => void;
}

const getLayoutIcon = (layout: string) => {
  switch (layout) {
    case 'modern':
      return <Layout size={16} className="text-blue-600" />;
    case 'classic':
      return <FileText size={16} className="text-green-600" />;
    case 'minimal':
      return <Type size={16} className="text-purple-600" />;
    case 'professional':
      return <Star size={16} className="text-orange-600" />;
    default:
      return <Layout size={16} className="text-gray-600" />;
  }
};

const getLayoutColor = (layout: string) => {
  const colors: Record<string, string> = {
    'modern': 'text-blue-600 bg-blue-50 border-blue-200',
    'classic': 'text-green-600 bg-green-50 border-green-200',
    'minimal': 'text-purple-600 bg-purple-50 border-purple-200',
    'professional': 'text-orange-600 bg-orange-50 border-orange-200'
  };
  return colors[layout] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const TemplateCard = ({
  template,
  onUse,
  onPreview
}: TemplateCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              {getLayoutIcon(template.layout)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
          </div>
          {template.isDefault && (
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
              Default
            </Badge>
          )}
        </div>

        {/* Template Preview */}
        <div 
          className="border-2 border-dashed rounded-lg p-4 mb-4 min-h-[120px] flex items-center justify-center"
          style={{ 
            borderColor: template.primaryColor + '40',
            backgroundColor: template.secondaryColor + '20'
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: template.primaryColor + '20' }}
            >
              <FileText size={32} style={{ color: template.primaryColor }} />
            </div>
            <p className="text-sm font-medium" style={{ color: template.primaryColor }}>
              {template.layout.charAt(0).toUpperCase() + template.layout.slice(1)} Layout
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getLayoutColor(template.layout)}>
              {template.layout}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Palette size={12} />
              <span>{template.primaryColor}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              {template.showLogo ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              )}
              <span className={template.showLogo ? 'text-green-600' : 'text-gray-500'}>
                Logo
              </span>
            </div>
            <div className="flex items-center gap-1">
              {template.showCompanyDetails ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              )}
              <span className={template.showCompanyDetails ? 'text-green-600' : 'text-gray-500'}>
                Company Details
              </span>
            </div>
            <div className="flex items-center gap-1">
              {template.showPaymentTerms ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              )}
              <span className={template.showPaymentTerms ? 'text-green-600' : 'text-gray-500'}>
                Payment Terms
              </span>
            </div>
            <div className="flex items-center gap-1">
              {template.showNotes ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              )}
              <span className={template.showNotes ? 'text-green-600' : 'text-gray-500'}>
                Notes
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p><strong>Font:</strong> {template.fontFamily}</p>
            {template.customFields.length > 0 && (
              <p><strong>Custom Fields:</strong> {template.customFields.length}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>Updated {new Date(template.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            {onPreview && (
              <Button size="sm" variant="outline" onClick={onPreview}>
                <Eye size={14} className="mr-1" />
                Preview
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Edit size={14} className="mr-1" />
              Edit
            </Button>
            <Button size="sm" onClick={onUse}>
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};