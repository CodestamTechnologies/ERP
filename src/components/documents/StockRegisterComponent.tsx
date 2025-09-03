'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from './BaseDocumentComponent';

interface StockItem {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  category: string;
  unit: string;
  openingStock: number;
  receipts: number;
  issues: number;
  closingStock: number;
  reorderLevel: number;
  unitPrice: number;
  totalValue: number;
  location: string;
  supplier: string;
}

interface StockRegisterData {
  registerNumber: string;
  registerDate: string;
  periodFrom: string;
  periodTo: string;
  warehouseName: string;
  warehouseAddress: string;
  warehouseManager: string;
  managerPhone: string;
  managerEmail: string;
  registerType: string;
  remarks: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  items: StockItem[];
  totalItems: number;
  totalValue: number;
}

interface StockRegisterFormData extends Record<string, unknown> {
  stock: StockRegisterData;
}

const initialData = (): StockRegisterFormData => ({
  stock: {
    registerNumber: `SR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    registerDate: new Date().toISOString().split('T')[0],
    periodFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    periodTo: new Date().toISOString().split('T')[0],
    warehouseName: '',
    warehouseAddress: '',
    warehouseManager: '',
    managerPhone: '',
    managerEmail: '',
    registerType: 'perpetual',
    remarks: '',
    preparedBy: 'Current User',
    checkedBy: '',
    approvedBy: '',
    items: [],
    totalItems: 0,
    totalValue: 0,
  },
});

const createNewItem = (): StockItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  itemCode: '',
  itemName: '',
  description: '',
  category: 'raw-materials',
  unit: 'pcs',
  openingStock: 0,
  receipts: 0,
  issues: 0,
  closingStock: 0,
  reorderLevel: 0,
  unitPrice: 0,
  totalValue: 0,
  location: '',
  supplier: '',
});

const StockRegisterComponent = () => {
  const [data, setData] = useState<StockRegisterFormData>(initialData());

  const updateStock = (field: keyof StockRegisterData, value: string | number) => {
    setData(prev => ({ ...prev, stock: { ...prev.stock, [field]: value } }));
  };

  const calculateItemTotals = (item: StockItem): StockItem => {
    const closingStock = item.openingStock + item.receipts - item.issues;
    const totalValue = closingStock * item.unitPrice;
    return { ...item, closingStock, totalValue };
  };

  const updateItem = (itemId: string, field: keyof StockItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.stock.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          return calculateItemTotals(updatedItem);
        }
        return item;
      });

      const totalItems = updatedItems.length;
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.totalValue || 0), 0);

      return {
        ...prev,
        stock: { ...prev.stock, items: updatedItems, totalItems, totalValue },
      };
    });
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      stock: { ...prev.stock, items: [...prev.stock.items, createNewItem()] },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.stock.items.filter(item => item.id !== itemId);
      const totalItems = updatedItems.length;
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.totalValue || 0), 0);

      return {
        ...prev,
        stock: { ...prev.stock, items: updatedItems, totalItems, totalValue },
      };
    });
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Register Information */}
        <Card>
          <CardHeader><CardTitle>Register Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Register Number" id="register-number" value={data.stock.registerNumber} onChange={(v) => updateStock('registerNumber', v)} required />
            <FormField label="Register Date" id="register-date" type="date" value={data.stock.registerDate} onChange={(v) => updateStock('registerDate', v)} required />
            <FormField 
              label="Register Type" 
              id="register-type" 
              type="select" 
              value={data.stock.registerType} 
              onChange={(v) => updateStock('registerType', v)}
              options={[
                { value: 'physical', label: 'Physical Inventory' },
                { value: 'perpetual', label: 'Perpetual Inventory' },
                { value: 'periodic', label: 'Periodic Inventory' }
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Period From" id="period-from" type="date" value={data.stock.periodFrom} onChange={(v) => updateStock('periodFrom', v)} />
              <FormField label="Period To" id="period-to" type="date" value={data.stock.periodTo} onChange={(v) => updateStock('periodTo', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Information */}
        <Card>
          <CardHeader><CardTitle>Warehouse Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Warehouse Name" id="warehouse-name" value={data.stock.warehouseName} onChange={(v) => updateStock('warehouseName', v)} required />
            <FormField label="Manager Name" id="warehouse-manager" value={data.stock.warehouseManager} onChange={(v) => updateStock('warehouseManager', v)} />
            <FormField label="Address" id="warehouse-address" type="textarea" value={data.stock.warehouseAddress} onChange={(v) => updateStock('warehouseAddress', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Manager Phone" id="manager-phone" value={data.stock.managerPhone} onChange={(v) => updateStock('managerPhone', v)} />
              <FormField label="Manager Email" id="manager-email" type="email" value={data.stock.managerEmail} onChange={(v) => updateStock('managerEmail', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Approval & Remarks */}
        <Card>
          <CardHeader><CardTitle>Approval & Remarks</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Prepared By" id="prepared-by" value={data.stock.preparedBy} onChange={(v) => updateStock('preparedBy', v)} />
              <FormField label="Checked By" id="checked-by" value={data.stock.checkedBy} onChange={(v) => updateStock('checkedBy', v)} />
              <FormField label="Approved By" id="approved-by" value={data.stock.approvedBy} onChange={(v) => updateStock('approvedBy', v)} />
            </div>
            <FormField label="Remarks" id="remarks" type="textarea" value={data.stock.remarks} onChange={(v) => updateStock('remarks', v)} rows={3} />
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Stock Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Stock Items</CardTitle>
              <Button onClick={addItem} size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.stock.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Item Code" id={`item-code-${item.id}`} value={item.itemCode} onChange={(v) => updateItem(item.id, 'itemCode', v)} required />
                      <FormField label="Item Name" id={`item-name-${item.id}`} value={item.itemName} onChange={(v) => updateItem(item.id, 'itemName', v)} required />
                    </div>
                    <FormField label="Description" id={`item-desc-${item.id}`} value={item.description} onChange={(v) => updateItem(item.id, 'description', v)} />
                    <div className="grid grid-cols-3 gap-3">
                      <FormField 
                        label="Category" 
                        id={`item-category-${item.id}`} 
                        type="select" 
                        value={item.category} 
                        onChange={(v) => updateItem(item.id, 'category', v)}
                        options={[
                          { value: 'raw-materials', label: 'Raw Materials' },
                          { value: 'finished-goods', label: 'Finished Goods' },
                          { value: 'work-in-progress', label: 'Work in Progress' },
                          { value: 'consumables', label: 'Consumables' },
                          { value: 'spare-parts', label: 'Spare Parts' }
                        ]}
                      />
                      <FormField 
                        label="Unit" 
                        id={`item-unit-${item.id}`} 
                        type="select" 
                        value={item.unit} 
                        onChange={(v) => updateItem(item.id, 'unit', v)}
                        options={[
                          { value: 'pcs', label: 'Pieces' },
                          { value: 'kg', label: 'Kilograms' },
                          { value: 'lbs', label: 'Pounds' },
                          { value: 'liters', label: 'Liters' },
                          { value: 'meters', label: 'Meters' },
                          { value: 'boxes', label: 'Boxes' }
                        ]}
                      />
                      <FormField label="Location" id={`item-location-${item.id}`} value={item.location} onChange={(v) => updateItem(item.id, 'location', v)} />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <FormField label="Opening Stock" id={`item-opening-${item.id}`} type="number" value={item.openingStock} onChange={(v) => updateItem(item.id, 'openingStock', parseFloat(v) || 0)} />
                      <FormField label="Receipts" id={`item-receipts-${item.id}`} type="number" value={item.receipts} onChange={(v) => updateItem(item.id, 'receipts', parseFloat(v) || 0)} />
                      <FormField label="Issues" id={`item-issues-${item.id}`} type="number" value={item.issues} onChange={(v) => updateItem(item.id, 'issues', parseFloat(v) || 0)} />
                      <div>
                        <Label>Closing Stock</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{item.closingStock}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="Reorder Level" id={`item-reorder-${item.id}`} type="number" value={item.reorderLevel} onChange={(v) => updateItem(item.id, 'reorderLevel', parseFloat(v) || 0)} />
                      <FormField label="Unit Price ($)" id={`item-price-${item.id}`} type="number" value={item.unitPrice} onChange={(v) => updateItem(item.id, 'unitPrice', parseFloat(v) || 0)} />
                      <div>
                        <Label>Total Value</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{formatCurrency(item.totalValue)}</div>
                      </div>
                    </div>
                    <FormField label="Supplier" id={`item-supplier-${item.id}`} value={item.supplier} onChange={(v) => updateItem(item.id, 'supplier', v)} />
                  </div>
                </div>
              ))}
              {data.stock.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click Add Item to get started.</p>
                </div>
              )}
            </div>
            {data.stock.items.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between"><span>Total Items:</span><span>{data.stock.totalItems}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total Value:</span><span>{formatCurrency(data.stock.totalValue)}</span></div>
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
          <h1 className="text-3xl font-bold text-purple-600 mb-2">STOCK REGISTER / INVENTORY SHEET</h1>
          <div className="text-gray-600">
            <p><strong>Register Number:</strong> {data.stock.registerNumber}</p>
            <p><strong>Period:</strong> {formatDate(data.stock.periodFrom)} to {formatDate(data.stock.periodTo)}</p>
            <p><strong>Register Type:</strong> {data.stock.registerType}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Warehouse Information:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Warehouse:</strong> {data.stock.warehouseName}</p>
            <p><strong>Manager:</strong> {data.stock.warehouseManager}</p>
            <p><strong>Address:</strong> {data.stock.warehouseAddress}</p>
            <p><strong>Phone:</strong> {data.stock.managerPhone}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Code</th>
              <th className="border border-gray-300 p-2 text-left">Item Name</th>
              <th className="border border-gray-300 p-2 text-center">Opening</th>
              <th className="border border-gray-300 p-2 text-center">Receipts</th>
              <th className="border border-gray-300 p-2 text-center">Issues</th>
              <th className="border border-gray-300 p-2 text-center">Closing</th>
              <th className="border border-gray-300 p-2 text-right">Unit Price</th>
              <th className="border border-gray-300 p-2 text-right">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {data.stock.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.itemCode}</td>
                <td className="border border-gray-300 p-2">{item.itemName}</td>
                <td className="border border-gray-300 p-2 text-center">{item.openingStock}</td>
                <td className="border border-gray-300 p-2 text-center">{item.receipts}</td>
                <td className="border border-gray-300 p-2 text-center">{item.issues}</td>
                <td className="border border-gray-300 p-2 text-center">{item.closingStock}</td>
                <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b"><span>Total Items:</span><span>{data.stock.totalItems}</span></div>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Total Value:</span><span>{formatCurrency(data.stock.totalValue)}</span></div>
          </div>
        </div>
      </div>

      {data.stock.remarks && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Remarks:</h3>
          <p className="text-gray-700 text-sm">{data.stock.remarks}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-3 gap-8">
        <div className="text-center">
          <div className="border-t border-gray-400 mt-8 pt-2">
            <p className="text-sm">Prepared By</p>
            <p className="text-sm font-medium">{data.stock.preparedBy}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 mt-8 pt-2">
            <p className="text-sm">Checked By</p>
            <p className="text-sm font-medium">{data.stock.checkedBy}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 mt-8 pt-2">
            <p className="text-sm">Approved By</p>
            <p className="text-sm font-medium">{data.stock.approvedBy}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This is a computer-generated stock register.</p>
      </div>
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Stock Register / Inventory Sheets"
      description="Manage and track inventory levels"
      documentType="quotation"
      iconColor="text-purple-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
};

export default StockRegisterComponent;