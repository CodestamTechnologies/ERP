'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceTemplate } from '@/hooks/useInvoices';
import { Eye, FileText, Download, Printer } from 'lucide-react';

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: InvoiceTemplate | null;
}

export const TemplatePreviewDialog = ({
  isOpen,
  onClose,
  template
}: TemplatePreviewDialogProps) => {
  if (!template) return null;

  const mockInvoiceData = {
    invoiceNumber: 'INV-2024-001',
    issueDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    customerName: 'Sample Customer Inc.',
    customerAddress: '123 Customer Street\nCity, State 12345\nUnited States',
    lineItems: [
      { description: 'Web Development Services', quantity: 40, unitPrice: 150, total: 6000 },
      { description: 'UI/UX Design Services', quantity: 20, unitPrice: 120, total: 2400 },
      { description: 'Project Management', quantity: 16, unitPrice: 100, total: 1600 }
    ],
    subtotal: 10000,
    tax: 800,
    total: 10800
  };

  const getLayoutStyles = () => {
    switch (template.layout) {
      case 'modern':
        return 'rounded-lg shadow-lg';
      case 'classic':
        return 'border-2 border-gray-800';
      case 'minimal':
        return 'border border-gray-300';
      case 'professional':
        return 'shadow-md border';
      default:
        return 'border';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye size={24} className="text-blue-600" />
            Template Preview - {template.name}
          </DialogTitle>
          <DialogDescription>
            Preview how your invoice template will look
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Layout</p>
                  <p className="capitalize">{template.layout}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Font</p>
                  <p>{template.fontFamily}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Primary Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: template.primaryColor }}
                    ></div>
                    <span>{template.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Elements</p>
                  <p>{[
                    template.showLogo && 'Logo',
                    template.showCompanyDetails && 'Company',
                    template.showPaymentTerms && 'Terms',
                    template.showNotes && 'Notes'
                  ].filter(Boolean).join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          <Card>
            <CardContent className="p-6">
              <div 
                className={`bg-white p-8 ${getLayoutStyles()}`}
                style={{ 
                  fontFamily: template.fontFamily,
                  backgroundColor: template.secondaryColor
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {template.showLogo && (
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                        style={{ backgroundColor: template.primaryColor + '20' }}
                      >
                        <FileText size={32} style={{ color: template.primaryColor }} />
                      </div>
                    )}
                    {template.showCompanyDetails && (
                      <div>
                        <h1 className="text-2xl font-bold" style={{ color: template.primaryColor }}>
                          Your Company Name
                        </h1>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>123 Business Street</p>
                          <p>City, State 12345</p>
                          <p>Phone: (555) 123-4567</p>
                          <p>Email: info@company.com</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-bold" style={{ color: template.primaryColor }}>
                      INVOICE
                    </h2>
                    <div className="mt-4 text-sm">
                      <p><strong>Invoice #:</strong> {mockInvoiceData.invoiceNumber}</p>
                      <p><strong>Date:</strong> {mockInvoiceData.issueDate}</p>
                      <p><strong>Due Date:</strong> {mockInvoiceData.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: template.primaryColor }}>
                    Bill To:
                  </h3>
                  <div className="text-sm">
                    <p className="font-semibold">{mockInvoiceData.customerName}</p>
                    <div className="whitespace-pre-line text-gray-600">
                      {mockInvoiceData.customerAddress}
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2" style={{ borderColor: template.primaryColor }}>
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoiceData.lineItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3">{item.description}</td>
                          <td className="text-right py-3">{item.quantity}</td>
                          <td className="text-right py-3">${item.unitPrice.toFixed(2)}</td>
                          <td className="text-right py-3">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>${mockInvoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Tax:</span>
                      <span>${mockInvoiceData.tax.toFixed(2)}</span>
                    </div>
                    <div 
                      className="flex justify-between py-2 border-t-2 font-bold text-lg"
                      style={{ borderColor: template.primaryColor, color: template.primaryColor }}
                    >
                      <span>Total:</span>
                      <span>${mockInvoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                {template.showPaymentTerms && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: template.primaryColor }}>
                      Payment Terms:
                    </h3>
                    <p className="text-sm text-gray-600">
                      Payment is due within 30 days of invoice date. Late payments may be subject to fees.
                    </p>
                  </div>
                )}

                {/* Notes */}
                {template.showNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: template.primaryColor }}>
                      Notes:
                    </h3>
                    <p className="text-sm text-gray-600">
                      Thank you for your business! We appreciate your prompt payment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Printer size={16} className="mr-2" />
            Print Preview
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};