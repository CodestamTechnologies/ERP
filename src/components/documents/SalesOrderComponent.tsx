'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Mail, Printer, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { DocumentHistoryDialog } from './DocumentHistoryDialog';
import { DocumentDraftsDialog } from './DocumentDraftsDialog';

// Simple toast replacement
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

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

interface CustomerInfo extends CompanyInfo {
  contactPerson: string;
  designation: string;
}

interface SalesOrderItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface SalesOrderData {
  soNumber: string;
  date: string;
  deliveryDate: string;
  customerPO: string;
  subject: string;
  terms: string;
  notes: string;
  paymentTerms: string;
  deliveryTerms: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  items: SalesOrderItem[];
}

interface SalesOrderFormData {
  salesOrder: SalesOrderData;
  company: CompanyInfo;
  customer: CustomerInfo;
}

const initialCompanyData = (): CompanyInfo => ({
  name: 'Codestam Technologies Pvt Ltd',
  address: '123 Business Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  phone: '+91 98765 43210',
  email: 'info@codestam.com',
  website: 'www.codestam.com',
  gst: '27ABCDE1234F1Z5',
});

const initialCustomerData = (): CustomerInfo => ({
  name: '',
  contactPerson: '',
  designation: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
});

const initialSalesOrderData = (): SalesOrderData => ({
  soNumber: `SO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  date: new Date().toISOString().split('T')[0],
  deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  customerPO: '',
  subject: '',
  terms: 'All items will be delivered as per agreed specifications and timeline.',
  notes: 'Thank you for your order!',
  paymentTerms: '50% advance, 50% on delivery',
  deliveryTerms: 'FOB Destination',
  subtotal: 0,
  totalDiscount: 0,
  totalTax: 0,
  grandTotal: 0,
  items: [],
});

const createNewItem = (): SalesOrderItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  quantity: 1,
  unit: 'Nos',
  rate: 0,
  discount: 0,
  amount: 0,
  taxRate: 18,
  taxAmount: 0,
  total: 0,
});

const FormField = ({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [], required = false }: {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div>
    <Label htmlFor={id}>{label} {required && <span className="text-red-500">*</span>}</Label>
    {type === 'textarea' ? (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    ) : type === 'select' ? (
      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const SalesOrderComponent = () => {
  const [data, setData] = useState<SalesOrderFormData>({
    salesOrder: initialSalesOrderData(),
    company: initialCompanyData(),
    customer: initialCustomerData(),
  });

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  
  const {
    drafts,
    history,
    isLoading,
    saveDraft,
    saveToHistory,
    loadDraft,
    loadFromHistory,
    deleteDraft,
    deleteFromHistory,
    clearAllDrafts,
    clearAllHistory,
  } = useDocumentManager('sales-order');

  const updateSalesOrder = (field: keyof SalesOrderData, value: string | number) => {
    setData(prev => ({ ...prev, salesOrder: { ...prev.salesOrder, [field]: value } }));
  };

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateCustomer = (field: keyof CustomerInfo, value: string) => {
    setData(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));
  };

  const calculateItemTotals = (item: SalesOrderItem): SalesOrderItem => {
    const amount = item.quantity * item.rate;
    const discountAmount = (amount * item.discount) / 100;
    const discountedAmount = amount - discountAmount;
    const taxAmount = (discountedAmount * item.taxRate) / 100;
    const total = discountedAmount + taxAmount;
    
    return {
      ...item,
      amount: discountedAmount,
      taxAmount,
      total,
    };
  };

  const updateItem = (itemId: string, field: keyof SalesOrderItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.salesOrder.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          return calculateItemTotals(updatedItem);
        }
        return item;
      });

      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + ((item.quantity * item.rate * item.discount) / 100), 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal - totalDiscount + totalTax;

      return {
        ...prev,
        salesOrder: {
          ...prev.salesOrder,
          items: updatedItems,
          subtotal,
          totalDiscount,
          totalTax,
          grandTotal,
        },
      };
    });
  };

  const addItem = () => {
    const newItem = createNewItem();
    setData(prev => ({
      ...prev,
      salesOrder: {
        ...prev.salesOrder,
        items: [...prev.salesOrder.items, newItem],
      },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.salesOrder.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + ((item.quantity * item.rate * item.discount) / 100), 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal - totalDiscount + totalTax;

      return {
        ...prev,
        salesOrder: {
          ...prev.salesOrder,
          items: updatedItems,
          subtotal,
          totalDiscount,
          totalTax,
          grandTotal,
        },
      };
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const SalesOrderPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">SALES ORDER</h1>
          <div className="text-gray-600">
            <p><strong>SO Number:</strong> {data.salesOrder.soNumber}</p>
            <p><strong>Date:</strong> {formatDate(data.salesOrder.date)}</p>
            <p><strong>Delivery Date:</strong> {formatDate(data.salesOrder.deliveryDate)}</p>
            {data.salesOrder.customerPO && <p><strong>Customer PO:</strong> {data.salesOrder.customerPO}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">{data.company.name}</h2>
          <div className="text-gray-600 text-sm">
            <p>{data.company.address}</p>
            <p>{data.company.city}, {data.company.state} {data.company.zip}</p>
            <p>Phone: {data.company.phone}</p>
            <p>Email: {data.company.email}</p>
            {data.company.website && <p>Website: {data.company.website}</p>}
            {data.company.gst && <p>GST: {data.company.gst}</p>}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{data.customer.name}</p>
          {data.customer.contactPerson && (
            <p>Attn: {data.customer.contactPerson} {data.customer.designation && `(${data.customer.designation})`}</p>
          )}
          <p>{data.customer.address}</p>
          <p>{data.customer.city}, {data.customer.state} {data.customer.zip}</p>
          <p>Phone: {data.customer.phone}</p>
          <p>Email: {data.customer.email}</p>
        </div>
      </div>

      {/* Subject */}
      {data.salesOrder.subject && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject:</h3>
          <p className="text-gray-700">{data.salesOrder.subject}</p>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-center">Unit</th>
              <th className="border border-gray-300 p-3 text-right">Rate</th>
              <th className="border border-gray-300 p-3 text-center">Disc %</th>
              <th className="border border-gray-300 p-3 text-right">Amount</th>
              <th className="border border-gray-300 p-3 text-center">Tax %</th>
              <th className="border border-gray-300 p-3 text-right">Tax Amount</th>
              <th className="border border-gray-300 p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.salesOrder.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-3">{item.description}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-300 p-3 text-center">{item.discount}%</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.amount)}</td>
                <td className="border border-gray-300 p-3 text-center">{item.taxRate}%</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.taxAmount)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-4">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal:</span>
              <span>{formatCurrency(data.salesOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Discount:</span>
              <span>-{formatCurrency(data.salesOrder.totalDiscount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Tax:</span>
              <span>{formatCurrency(data.salesOrder.totalTax)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Grand Total:</span>
              <span>{formatCurrency(data.salesOrder.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms:</h3>
          <p className="text-gray-700 text-sm">{data.salesOrder.paymentTerms}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Terms:</h3>
          <p className="text-gray-700 text-sm">{data.salesOrder.deliveryTerms}</p>
        </div>
      </div>

      {/* Terms */}
      {data.salesOrder.terms && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Terms & Conditions:</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{data.salesOrder.terms}</p>
        </div>
      )}

      {/* Notes */}
      {data.salesOrder.notes && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes:</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{data.salesOrder.notes}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-12 pt-6 border-t border-gray-300">
        <div className="flex justify-between">
          <div>
            <div className="border-b border-gray-400 w-64 mb-2"></div>
            <p className="font-semibold">Authorized Signature</p>
            <p className="text-sm text-gray-600">{data.company.name}</p>
          </div>
          <div>
            <div className="border-b border-gray-400 w-64 mb-2"></div>
            <p className="font-semibold">Customer Acceptance</p>
            <p className="text-sm text-gray-600">{data.customer.name}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This is a computer-generated sales order.</p>
      </div>
    </div>
  );

  // Document management handlers
  const handleSaveDraft = async () => {
    const result = await saveDraft(data as unknown as Record<string, unknown>);
    if (result.success) {
      toast.success('Draft saved successfully!');
    } else {
      toast.error('Failed to save draft');
    }
  };

  const handleSaveToHistory = async () => {
    const result = await saveToHistory(data as unknown as Record<string, unknown>);
    if (result.success) {
      toast.success('Document saved to history!');
    } else {
      toast.error('Failed to save to history');
    }
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = loadDraft(draftId);
    if (draft) {
      setData(draft.data as unknown as SalesOrderFormData);
      toast.success('Draft loaded successfully!');
    } else {
      toast.error('Failed to load draft');
    }
  };

  const handleLoadFromHistory = (historyId: string) => {
    const historyItem = loadFromHistory(historyId);
    if (historyItem) {
      setData(historyItem.data as unknown as SalesOrderFormData);
      toast.success('Document loaded from history!');
    } else {
      toast.error('Failed to load from history');
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    const result = await deleteDraft(draftId);
    if (result.success) {
      toast.success('Draft deleted successfully!');
    } else {
      toast.error('Failed to delete draft');
    }
  };

  const handleDeleteFromHistory = async (historyId: string) => {
    const result = await deleteFromHistory(historyId);
    if (result.success) {
      toast.success('Document removed from history!');
    } else {
      toast.error('Failed to remove from history');
    }
  };

  const handleAction = (action: string) => {
    const actions = {
      generate: () => setActiveView('preview'),
      download: () => alert('PDF download functionality would be implemented here'),
      email: () => alert('Email functionality would be implemented here'),
      save: handleSaveDraft,
      saveToHistory: handleSaveToHistory,
    };
    actions[action as keyof typeof actions]?.();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-purple-600" />
            Sales Order Generator
          </h1>
          <p className="text-gray-600 mt-1">Create professional sales orders for your customers</p>
        </div>
        
        <div className="flex space-x-2">
          <DocumentDraftsDialog
            drafts={drafts}
            isLoading={isLoading}
            onLoad={handleLoadDraft}
            onDelete={handleDeleteDraft}
            onClearAll={clearAllDrafts}
            documentType="sales-order"
          />
          <DocumentHistoryDialog
            history={history}
            isLoading={isLoading}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
            onClearAll={clearAllHistory}
            documentType="sales-order"
          />
          {['form', 'preview'].map(view => (
            <Button
              key={view}
              variant={activeView === view ? 'default' : 'outline'}
              onClick={() => setActiveView(view as 'form' | 'preview')}
              className="flex items-center capitalize"
            >
              {view === 'form' ? <FileText className="w-4 h-4 mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
              {view}
            </Button>
          ))}
        </div>
      </div>

      {activeView === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Company Name" id="company-name" value={data.company.name} onChange={(v) => updateCompany('name', v)} required />
                <FormField label="Address" id="company-address" value={data.company.address} onChange={(v) => updateCompany('address', v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="City" id="company-city" value={data.company.city} onChange={(v) => updateCompany('city', v)} />
                  <FormField label="State" id="company-state" value={data.company.state} onChange={(v) => updateCompany('state', v)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="ZIP Code" id="company-zip" value={data.company.zip} onChange={(v) => updateCompany('zip', v)} />
                  <FormField label="Phone" id="company-phone" value={data.company.phone} onChange={(v) => updateCompany('phone', v)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email" id="company-email" type="email" value={data.company.email} onChange={(v) => updateCompany('email', v)} />
                  <FormField label="Website" id="company-website" value={data.company.website || ''} onChange={(v) => updateCompany('website', v)} />
                </div>
                
                <FormField label="GST Number" id="company-gst" value={data.company.gst || ''} onChange={(v) => updateCompany('gst', v)} />
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Customer Name" id="customer-name" value={data.customer.name} onChange={(v) => updateCustomer('name', v)} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Person" id="customer-contact" value={data.customer.contactPerson} onChange={(v) => updateCustomer('contactPerson', v)} />
                  <FormField label="Designation" id="customer-designation" value={data.customer.designation} onChange={(v) => updateCustomer('designation', v)} />
                </div>
                
                <FormField label="Address" id="customer-address" value={data.customer.address} onChange={(v) => updateCustomer('address', v)} />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="City" id="customer-city" value={data.customer.city} onChange={(v) => updateCustomer('city', v)} />
                  <FormField label="State" id="customer-state" value={data.customer.state} onChange={(v) => updateCustomer('state', v)} />
                  <FormField label="ZIP Code" id="customer-zip" value={data.customer.zip} onChange={(v) => updateCustomer('zip', v)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Phone" id="customer-phone" value={data.customer.phone} onChange={(v) => updateCustomer('phone', v)} />
                  <FormField label="Email" id="customer-email" type="email" value={data.customer.email} onChange={(v) => updateCustomer('email', v)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sales Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="SO Number" id="so-number" value={data.salesOrder.soNumber} onChange={(v) => updateSalesOrder('soNumber', v)} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Date" id="so-date" type="date" value={data.salesOrder.date} onChange={(v) => updateSalesOrder('date', v)} required />
                  <FormField label="Delivery Date" id="so-delivery" type="date" value={data.salesOrder.deliveryDate} onChange={(v) => updateSalesOrder('deliveryDate', v)} required />
                </div>
                
                <FormField label="Customer PO" id="customer-po" value={data.salesOrder.customerPO} onChange={(v) => updateSalesOrder('customerPO', v)} placeholder="Customer's purchase order number" />
                <FormField label="Subject" id="so-subject" value={data.salesOrder.subject} onChange={(v) => updateSalesOrder('subject', v)} placeholder="Brief description of the sales order" />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Payment Terms" id="payment-terms" value={data.salesOrder.paymentTerms} onChange={(v) => updateSalesOrder('paymentTerms', v)} />
                  <FormField label="Delivery Terms" id="delivery-terms" value={data.salesOrder.deliveryTerms} onChange={(v) => updateSalesOrder('deliveryTerms', v)} />
                </div>
                
                <FormField label="Terms & Conditions" id="so-terms" type="textarea" value={data.salesOrder.terms} onChange={(v) => updateSalesOrder('terms', v)} rows={3} />
                <FormField label="Notes" id="so-notes" type="textarea" value={data.salesOrder.notes} onChange={(v) => updateSalesOrder('notes', v)} rows={2} />
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Items</CardTitle>
                  <Button onClick={addItem} size="sm" className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.salesOrder.items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <FormField
                          label="Description"
                          id={`item-desc-${item.id}`}
                          value={item.description}
                          onChange={(v) => updateItem(item.id, 'description', v)}
                          placeholder="Item description"
                          required
                        />
                        
                        <div className="grid grid-cols-4 gap-3">
                          <FormField
                            label="Quantity"
                            id={`item-qty-${item.id}`}
                            type="number"
                            value={item.quantity}
                            onChange={(v) => updateItem(item.id, 'quantity', parseFloat(v) || 0)}
                            required
                          />
                          <FormField
                            label="Unit"
                            id={`item-unit-${item.id}`}
                            value={item.unit}
                            onChange={(v) => updateItem(item.id, 'unit', v)}
                            placeholder="Nos, Kg, etc."
                          />
                          <FormField
                            label="Rate (₹)"
                            id={`item-rate-${item.id}`}
                            type="number"
                            value={item.rate}
                            onChange={(v) => updateItem(item.id, 'rate', parseFloat(v) || 0)}
                            required
                          />
                          <FormField
                            label="Discount (%)"
                            id={`item-discount-${item.id}`}
                            type="number"
                            value={item.discount}
                            onChange={(v) => updateItem(item.id, 'discount', parseFloat(v) || 0)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            label="Tax Rate (%)"
                            id={`item-tax-${item.id}`}
                            type="number"
                            value={item.taxRate}
                            onChange={(v) => updateItem(item.id, 'taxRate', parseFloat(v) || 0)}
                          />
                          <div>
                            <Label>Total: {formatCurrency(item.total)}</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {data.salesOrder.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No items added yet. Click Add Item to get started.</p>
                    </div>
                  )}
                </div>
                
                {data.salesOrder.items.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(data.salesOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Discount:</span>
                          <span>-{formatCurrency(data.salesOrder.totalDiscount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tax:</span>
                          <span>{formatCurrency(data.salesOrder.totalTax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Grand Total:</span>
                          <span>{formatCurrency(data.salesOrder.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleAction('generate')} className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
              <Button variant="outline" onClick={() => handleAction('save')} className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {[
                { label: 'Edit', action: 'form', icon: FileText },
                { label: 'Download PDF', action: 'download', icon: Download },
                { label: 'Send Email', action: 'email', icon: Mail, variant: 'outline' as const },
                { label: 'Print', action: 'print', icon: Printer, variant: 'outline' as const },
              ].map(btn => (
                <Button
                  key={btn.action}
                  onClick={() => btn.action === 'form' ? setActiveView('form') : handleAction(btn.action)}
                  variant={btn.variant || 'default'}
                  className="flex items-center"
                >
                  <btn.icon className="w-4 h-4 mr-2" />
                  {btn.label}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleAction('saveToHistory')} className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save to History
              </Button>
              <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <SalesOrderPreview />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesOrderComponent;