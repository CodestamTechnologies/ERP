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
  pan?: string;
}

interface CustomerInfo extends CompanyInfo {
  contactPerson: string;
  designation: string;
}

interface InvoiceItem {
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

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  poNumber: string;
  subject: string;
  terms: string;
  notes: string;
  paymentTerms: string;
  bankDetails: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  amountInWords: string;
  items: InvoiceItem[];
}

interface InvoiceFormData {
  invoice: InvoiceData;
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
  pan: 'ABCDE1234F',
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

const initialInvoiceData = (): InvoiceData => ({
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  poNumber: '',
  subject: '',
  terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
  notes: 'Thank you for your business!',
  paymentTerms: 'Net 30 days',
  bankDetails: 'Bank: HDFC Bank\nAccount: 1234567890\nIFSC: HDFC0001234',
  subtotal: 0,
  totalDiscount: 0,
  totalTax: 0,
  grandTotal: 0,
  amountInWords: '',
  items: [],
});

const createNewItem = (): InvoiceItem => ({
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

// Function to convert number to words (simplified version)
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  };
  
  let integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = '';
  
  if (integerPart >= 10000000) {
    result += convertHundreds(Math.floor(integerPart / 10000000)) + 'Crore ';
    integerPart %= 10000000;
  }
  if (integerPart >= 100000) {
    result += convertHundreds(Math.floor(integerPart / 100000)) + 'Lakh ';
    integerPart %= 100000;
  }
  if (integerPart >= 1000) {
    result += convertHundreds(Math.floor(integerPart / 1000)) + 'Thousand ';
    integerPart %= 1000;
  }
  if (integerPart > 0) {
    result += convertHundreds(integerPart);
  }
  
  result += 'Rupees';
  
  if (decimalPart > 0) {
    result += ' and ' + convertHundreds(decimalPart) + 'Paise';
  }
  
  return result + ' Only';
};

const InvoiceComponent = () => {
  const [data, setData] = useState<InvoiceFormData>({
    invoice: initialInvoiceData(),
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
  } = useDocumentManager('invoice');

  const updateInvoice = (field: keyof InvoiceData, value: string | number) => {
    setData(prev => ({ ...prev, invoice: { ...prev.invoice, [field]: value } }));
  };

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateCustomer = (field: keyof CustomerInfo, value: string) => {
    setData(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));
  };

  const calculateItemTotals = (item: InvoiceItem): InvoiceItem => {
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

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.invoice.items.map(item => {
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
      const amountInWords = numberToWords(grandTotal);

      return {
        ...prev,
        invoice: {
          ...prev.invoice,
          items: updatedItems,
          subtotal,
          totalDiscount,
          totalTax,
          grandTotal,
          amountInWords,
        },
      };
    });
  };

  const addItem = () => {
    const newItem = createNewItem();
    setData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        items: [...prev.invoice.items, newItem],
      },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.invoice.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + ((item.quantity * item.rate * item.discount) / 100), 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal - totalDiscount + totalTax;
      const amountInWords = numberToWords(grandTotal);

      return {
        ...prev,
        invoice: {
          ...prev.invoice,
          items: updatedItems,
          subtotal,
          totalDiscount,
          totalTax,
          grandTotal,
          amountInWords,
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

  const InvoicePreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">INVOICE</h1>
          <div className="text-gray-600">
            <p><strong>Invoice #:</strong> {data.invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> {formatDate(data.invoice.date)}</p>
            <p><strong>Due Date:</strong> {formatDate(data.invoice.dueDate)}</p>
            {data.invoice.poNumber && <p><strong>PO Number:</strong> {data.invoice.poNumber}</p>}
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
            {data.company.pan && <p>PAN: {data.company.pan}</p>}
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
      {data.invoice.subject && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject:</h3>
          <p className="text-gray-700">{data.invoice.subject}</p>
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
            {data.invoice.items.map((item, index) => (
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
              <span>{formatCurrency(data.invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Discount:</span>
              <span>-{formatCurrency(data.invoice.totalDiscount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Total Tax:</span>
              <span>{formatCurrency(data.invoice.totalTax)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold bg-gray-100 px-2">
              <span>Grand Total:</span>
              <span>{formatCurrency(data.invoice.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        {data.invoice.amountInWords && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="font-semibold">Amount in Words:</p>
            <p className="text-gray-700">{data.invoice.amountInWords}</p>
          </div>
        )}
      </div>

      {/* Payment Terms and Bank Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms:</h3>
          <p className="text-gray-700 text-sm">{data.invoice.paymentTerms}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bank Details:</h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">{data.invoice.bankDetails}</p>
        </div>
      </div>

      {/* Terms */}
      {data.invoice.terms && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Terms & Conditions:</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{data.invoice.terms}</p>
        </div>
      )}

      {/* Notes */}
      {data.invoice.notes && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes:</h3>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{data.invoice.notes}</p>
        </div>
      )}

      {/* Signature */}
      <div className="mt-12 pt-6 border-t border-gray-300">
        <div className="flex justify-end">
          <div>
            <div className="border-b border-gray-400 w-64 mb-2"></div>
            <p className="font-semibold">Authorized Signature</p>
            <p className="text-sm text-gray-600">{data.company.name}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This is a computer-generated invoice.</p>
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
      setData(draft.data as unknown as InvoiceFormData);
      toast.success('Draft loaded successfully!');
    } else {
      toast.error('Failed to load draft');
    }
  };

  const handleLoadFromHistory = (historyId: string) => {
    const historyItem = loadFromHistory(historyId);
    if (historyItem) {
      setData(historyItem.data as unknown as InvoiceFormData);
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
            <FileText className="w-8 h-8 mr-3 text-red-600" />
            Invoice Generator
          </h1>
          <p className="text-gray-600 mt-1">Create professional invoices for your customers</p>
        </div>
        
        <div className="flex space-x-2">
          <DocumentDraftsDialog
            drafts={drafts}
            isLoading={isLoading}
            onLoad={handleLoadDraft}
            onDelete={handleDeleteDraft}
            onClearAll={clearAllDrafts}
            documentType="invoice"
          />
          <DocumentHistoryDialog
            history={history}
            isLoading={isLoading}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
            onClearAll={clearAllHistory}
            documentType="invoice"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="GST Number" id="company-gst" value={data.company.gst || ''} onChange={(v) => updateCompany('gst', v)} />
                  <FormField label="PAN Number" id="company-pan" value={data.company.pan || ''} onChange={(v) => updateCompany('pan', v)} />
                </div>
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
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Invoice Number" id="invoice-number" value={data.invoice.invoiceNumber} onChange={(v) => updateInvoice('invoiceNumber', v)} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Date" id="invoice-date" type="date" value={data.invoice.date} onChange={(v) => updateInvoice('date', v)} required />
                  <FormField label="Due Date" id="invoice-due" type="date" value={data.invoice.dueDate} onChange={(v) => updateInvoice('dueDate', v)} required />
                </div>
                
                <FormField label="PO Number" id="po-number" value={data.invoice.poNumber} onChange={(v) => updateInvoice('poNumber', v)} placeholder="Customer's purchase order number" />
                <FormField label="Subject" id="invoice-subject" value={data.invoice.subject} onChange={(v) => updateInvoice('subject', v)} placeholder="Brief description of the invoice" />
                
                <FormField label="Payment Terms" id="payment-terms" value={data.invoice.paymentTerms} onChange={(v) => updateInvoice('paymentTerms', v)} />
                <FormField label="Bank Details" id="bank-details" type="textarea" value={data.invoice.bankDetails} onChange={(v) => updateInvoice('bankDetails', v)} rows={3} />
                <FormField label="Terms & Conditions" id="invoice-terms" type="textarea" value={data.invoice.terms} onChange={(v) => updateInvoice('terms', v)} rows={3} />
                <FormField label="Notes" id="invoice-notes" type="textarea" value={data.invoice.notes} onChange={(v) => updateInvoice('notes', v)} rows={2} />
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
                  {data.invoice.items.map((item, index) => (
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
                  
                  {data.invoice.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No items added yet. Click Add Item to get started.</p>
                    </div>
                  )}
                </div>
                
                {data.invoice.items.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(data.invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Discount:</span>
                          <span>-{formatCurrency(data.invoice.totalDiscount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tax:</span>
                          <span>{formatCurrency(data.invoice.totalTax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Grand Total:</span>
                          <span>{formatCurrency(data.invoice.grandTotal)}</span>
                        </div>
                        {data.invoice.amountInWords && (
                          <div className="pt-2 border-t text-sm">
                            <p className="font-medium">Amount in Words:</p>
                            <p className="text-gray-600">{data.invoice.amountInWords}</p>
                          </div>
                        )}
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
            <InvoicePreview />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InvoiceComponent;