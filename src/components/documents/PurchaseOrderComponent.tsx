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
  gst?: string;
}

interface VendorInfo extends CompanyInfo {
  contactPerson: string;
}

interface PurchaseOrderItem {
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

interface PurchaseOrderData {
  poNumber: string;
  date: string;
  deliveryDate: string;
  subject: string;
  paymentTerms: string;
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderFormData extends Record<string, unknown> {
  purchaseOrder: PurchaseOrderData;
  company: CompanyInfo;
  vendor: VendorInfo;
}

const initialData = (): PurchaseOrderFormData => ({
  purchaseOrder: {
    poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subject: '',
    paymentTerms: '30 days from delivery',
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
    gst: '27ABCDE1234F1Z5',
  },
  vendor: {
    name: '',
    contactPerson: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  },
});

const createNewItem = (): PurchaseOrderItem => ({
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

const PurchaseOrderComponent = () => {
  const [data, setData] = useState<PurchaseOrderFormData>(initialData());

  const updatePurchaseOrder = (field: keyof PurchaseOrderData, value: string | number) => {
    setData(prev => ({ ...prev, purchaseOrder: { ...prev.purchaseOrder, [field]: value } }));
  };

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateVendor = (field: keyof VendorInfo, value: string) => {
    setData(prev => ({ ...prev, vendor: { ...prev.vendor, [field]: value } }));
  };

  const calculateItemTotals = (item: PurchaseOrderItem): PurchaseOrderItem => {
    const amount = item.quantity * item.rate;
    const taxAmount = (amount * item.taxRate) / 100;
    const total = amount + taxAmount;
    return { ...item, amount, taxAmount, total };
  };

  const updateItem = (itemId: string, field: keyof PurchaseOrderItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.purchaseOrder.items.map(item => {
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
        purchaseOrder: { ...prev.purchaseOrder, items: updatedItems, subtotal, totalTax, grandTotal },
      };
    });
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      purchaseOrder: { ...prev.purchaseOrder, items: [...prev.purchaseOrder.items, createNewItem()] },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.purchaseOrder.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
      const totalTax = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const grandTotal = subtotal + totalTax;

      return {
        ...prev,
        purchaseOrder: { ...prev.purchaseOrder, items: updatedItems, subtotal, totalTax, grandTotal },
      };
    });
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Company Name" id="company-name" value={data.company.name} onChange={(v) => updateCompany('name', v)} required />
            <FormField label="Address" id="company-address" value={data.company.address} onChange={(v) => updateCompany('address', v)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="company-phone" value={data.company.phone} onChange={(v) => updateCompany('phone', v)} />
              <FormField label="Email" id="company-email" type="email" value={data.company.email} onChange={(v) => updateCompany('email', v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vendor Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Vendor Name" id="vendor-name" value={data.vendor.name} onChange={(v) => updateVendor('name', v)} required />
            <FormField label="Contact Person" id="vendor-contact" value={data.vendor.contactPerson} onChange={(v) => updateVendor('contactPerson', v)} />
            <FormField label="Address" id="vendor-address" value={data.vendor.address} onChange={(v) => updateVendor('address', v)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="vendor-phone" value={data.vendor.phone} onChange={(v) => updateVendor('phone', v)} />
              <FormField label="Email" id="vendor-email" type="email" value={data.vendor.email} onChange={(v) => updateVendor('email', v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Purchase Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="PO Number" id="po-number" value={data.purchaseOrder.poNumber} onChange={(v) => updatePurchaseOrder('poNumber', v)} required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Date" id="po-date" type="date" value={data.purchaseOrder.date} onChange={(v) => updatePurchaseOrder('date', v)} required />
              <FormField label="Delivery Date" id="po-delivery" type="date" value={data.purchaseOrder.deliveryDate} onChange={(v) => updatePurchaseOrder('deliveryDate', v)} required />
            </div>
            <FormField label="Subject" id="po-subject" value={data.purchaseOrder.subject} onChange={(v) => updatePurchaseOrder('subject', v)} />
            <FormField label="Payment Terms" id="payment-terms" value={data.purchaseOrder.paymentTerms} onChange={(v) => updatePurchaseOrder('paymentTerms', v)} />
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
              {data.purchaseOrder.items.map((item, index) => (
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
              {data.purchaseOrder.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click Add Item to get started.</p>
                </div>
              )}
            </div>
            {data.purchaseOrder.items.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(data.purchaseOrder.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Total Tax:</span><span>{formatCurrency(data.purchaseOrder.totalTax)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>{formatCurrency(data.purchaseOrder.grandTotal)}</span></div>
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
          <h1 className="text-3xl font-bold text-green-600 mb-2">PURCHASE ORDER</h1>
          <div className="text-gray-600">
            <p><strong>PO Number:</strong> {data.purchaseOrder.poNumber}</p>
            <p><strong>Date:</strong> {formatDate(data.purchaseOrder.date)}</p>
            <p><strong>Delivery Date:</strong> {formatDate(data.purchaseOrder.deliveryDate)}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">{data.company.name}</h2>
          <div className="text-gray-600 text-sm">
            <p>{data.company.address}</p>
            <p>Phone: {data.company.phone} | Email: {data.company.email}</p>
            {data.company.gst && <p>GST: {data.company.gst}</p>}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendor:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{data.vendor.name}</p>
          {data.vendor.contactPerson && <p>Attn: {data.vendor.contactPerson}</p>}
          <p>{data.vendor.address}</p>
          <p>Phone: {data.vendor.phone} | Email: {data.vendor.email}</p>
        </div>
      </div>

      {data.purchaseOrder.subject && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Subject:</h3>
          <p className="text-gray-700">{data.purchaseOrder.subject}</p>
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
            {data.purchaseOrder.items.map((item) => (
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
            <div className="flex justify-between py-2 border-b"><span>Subtotal:</span><span>{formatCurrency(data.purchaseOrder.subtotal)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Total Tax:</span><span>{formatCurrency(data.purchaseOrder.totalTax)}</span></div>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Grand Total:</span><span>{formatCurrency(data.purchaseOrder.grandTotal)}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300">
        <div className="flex justify-between">
          <div>
            <div className="border-b border-gray-400 w-64 mb-2"></div>
            <p className="font-semibold">Authorized Signature</p>
            <p className="text-sm text-gray-600">{data.company.name}</p>
          </div>
          <div>
            <div className="border-b border-gray-400 w-64 mb-2"></div>
            <p className="font-semibold">Vendor Acknowledgment</p>
            <p className="text-sm text-gray-600">{data.vendor.name}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Purchase Order Generator"
      description="Create professional purchase orders for your vendors and suppliers"
      documentType="purchase-order"
      iconColor="text-green-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
};

export default PurchaseOrderComponent;