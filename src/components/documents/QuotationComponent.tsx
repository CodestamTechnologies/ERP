'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from './BaseDocumentComponent';

interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website?: string;
  gst?: string;
}

interface ClientInfo extends CompanyInfo {
  contactPerson: string;
  designation: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  subject: string;
  terms: string;
  notes: string;
  paymentTerms: string;
  deliveryTerms: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  items: QuotationItem[];
}

interface QuotationFormData extends Record<string, unknown> {
  quotation: QuotationData;
  company: CompanyInfo;
  client: ClientInfo;
}

const initialData = (): QuotationFormData => ({
  quotation: {
    quotationNumber: `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subject: '',
    terms: 'This quotation is valid for 30 days from the date of issue.',
    notes: 'Thank you for your business!',
    paymentTerms: '50% advance, 50% on delivery',
    deliveryTerms: '15-20 working days',
    subtotal: 0,
    totalTax: 0,
    grandTotal: 0,
    items: [],
  },
  company: {
    name: 'Codestam Technologies Pvt Ltd',
    address: '123 Business Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    phone: '+91 98765 43210',
    email: 'info@codestam.com',
    website: 'www.codestam.com',
    gst: '27ABCDE1234F1Z5',
  },
  client: {
    name: '',
    contactPerson: '',
    designation: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  },
});

const createNewItem = (): QuotationItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  quantity: 1,
  unit: 'Nos',
  rate: 0,
  amount: 0,
  taxRate: 18,
  taxAmount: 0,
  total: 0,
});

const QuotationComponent = () => {
  const [data, setData] = useState<QuotationFormData>(initialData());

  const updateQuotation = (field: keyof QuotationData, value: string | number) => {
    setData(prev => ({ ...prev, quotation: { ...prev.quotation, [field]: value } }));
  };

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateClient = (field: keyof ClientInfo, value: string) => {
    setData(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
  };

  const calculateItemTotals = (item: QuotationItem): QuotationItem => {
    const amount = item.quantity * item.rate;
    const taxAmount = (amount * item.taxRate) / 100;
    const total = amount + taxAmount;
    
    return { ...item, amount, taxAmount, total };
  };

  const updateItem = (itemId: string, field: keyof QuotationItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.quotation.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          return calculateItemTotals(updatedItem);
        }
        return item;
      });

      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal + totalTax;

      return {
        ...prev,
        quotation: { ...prev.quotation, items: updatedItems, subtotal, totalTax, grandTotal },
      };
    });
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      quotation: { ...prev.quotation, items: [...prev.quotation.items, createNewItem()] },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.quotation.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal + totalTax;

      return {
        ...prev,
        quotation: { ...prev.quotation, items: updatedItems, subtotal, totalTax, grandTotal },
      };
    });
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company & Client Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Company Name" id="company-name" value={data.company.name} onChange={(v) => updateCompany('name', v)} required />
            <FormField label="Address" id="company-address" value={data.company.address} onChange={(v) => updateCompany('address', v)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="City" id="company-city" value={data.company.city} onChange={(v) => updateCompany('city', v)} />
              <FormField label="State" id="company-state" value={data.company.state} onChange={(v) => updateCompany('state', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="company-phone" value={data.company.phone} onChange={(v) => updateCompany('phone', v)} />
              <FormField label="Email" id="company-email" type="email" value={data.company.email} onChange={(v) => updateCompany('email', v)} />
            </div>
            <FormField label="GST Number" id="company-gst" value={data.company.gst || ''} onChange={(v) => updateCompany('gst', v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Client Name" id="client-name" value={data.client.name} onChange={(v) => updateClient('name', v)} required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Contact Person" id="client-contact" value={data.client.contactPerson} onChange={(v) => updateClient('contactPerson', v)} />
              <FormField label="Phone" id="client-phone" value={data.client.phone} onChange={(v) => updateClient('phone', v)} />
            </div>
            <FormField label="Address" id="client-address" value={data.client.address} onChange={(v) => updateClient('address', v)} />
          </CardContent>
        </Card>
      </div>

      {/* Quotation Details & Items */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Quotation Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Quotation Number" id="quotation-number" value={data.quotation.quotationNumber} onChange={(v) => updateQuotation('quotationNumber', v)} required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" id="quotation-date" type="date" value={data.quotation.date} onChange={(v) => updateQuotation('date', v)} required />
              <FormField label="Valid Until" id="quotation-valid" type="date" value={data.quotation.validUntil} onChange={(v) => updateQuotation('validUntil', v)} required />
            </div>
            <FormField label="Subject" id="quotation-subject" value={data.quotation.subject} onChange={(v) => updateQuotation('subject', v)} />
            <FormField label="Payment Terms" id="payment-terms" value={data.quotation.paymentTerms} onChange={(v) => updateQuotation('paymentTerms', v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Items</CardTitle>
              <Button onClick={addItem} size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.quotation.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <FormField label="Description" id={`item-desc-${item.id}`} value={item.description} onChange={(v) => updateItem(item.id, 'description', v)} required />
                    <div className="grid grid-cols-4 gap-3">
                      <FormField label="Qty" id={`item-qty-${item.id}`} type="number" value={item.quantity} onChange={(v) => updateItem(item.id, 'quantity', parseFloat(v) || 0)} />
                      <FormField label="Unit" id={`item-unit-${item.id}`} value={item.unit} onChange={(v) => updateItem(item.id, 'unit', v)} />
                      <FormField label="Rate" id={`item-rate-${item.id}`} type="number" value={item.rate} onChange={(v) => updateItem(item.id, 'rate', parseFloat(v) || 0)} />
                      <FormField label="Tax %" id={`item-tax-${item.id}`} type="number" value={item.taxRate} onChange={(v) => updateItem(item.id, 'taxRate', parseFloat(v) || 0)} />
                    </div>
                    <div><Label>Total: {formatCurrency(item.total)}</Label></div>
                  </div>
                </div>
              ))}
              {data.quotation.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click Add Item to get started.</p>
                </div>
              )}
            </div>
            {data.quotation.items.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(data.quotation.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Total Tax:</span><span>{formatCurrency(data.quotation.totalTax)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>{formatCurrency(data.quotation.grandTotal)}</span></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">QUOTATION</h1>
          <div className="text-gray-600">
            <p><strong>Quotation #:</strong> {data.quotation.quotationNumber}</p>
            <p><strong>Date:</strong> {formatDate(data.quotation.date)}</p>
            <p><strong>Valid Until:</strong> {formatDate(data.quotation.validUntil)}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">{data.company.name}</h2>
          <div className="text-gray-600 text-sm">
            <p>{data.company.address}</p>
            <p>{data.company.city}, {data.company.state} {data.company.zip}</p>
            <p>Phone: {data.company.phone} | Email: {data.company.email}</p>
            {data.company.gst && <p>GST: {data.company.gst}</p>}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{data.client.name}</p>
          {data.client.contactPerson && <p>Attn: {data.client.contactPerson}</p>}
          <p>{data.client.address}</p>
          <p>Phone: {data.client.phone} | Email: {data.client.email}</p>
        </div>
      </div>

      {data.quotation.subject && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject:</h3>
          <p className="text-gray-700">{data.quotation.subject}</p>
        </div>
      )}

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
              <th className="border border-gray-300 p-3 text-right">Tax</th>
              <th className="border border-gray-300 p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.quotation.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-3">{item.description}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.amount)}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.taxAmount)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b"><span>Subtotal:</span><span>{formatCurrency(data.quotation.subtotal)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Total Tax:</span><span>{formatCurrency(data.quotation.totalTax)}</span></div>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Grand Total:</span><span>{formatCurrency(data.quotation.grandTotal)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms:</h3>
          <p className="text-gray-700 text-sm">{data.quotation.paymentTerms}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Terms:</h3>
          <p className="text-gray-700 text-sm">{data.quotation.deliveryTerms}</p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This is a computer-generated quotation and does not require a signature.</p>
      </div>
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Quotation Generator"
      description="Create professional quotations and estimates for your clients"
      documentType="quotation"
      iconColor="text-blue-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
};

export default QuotationComponent;