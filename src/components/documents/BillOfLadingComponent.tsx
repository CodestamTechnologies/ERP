'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from './BaseDocumentComponent';

interface CargoItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  weight: number;
  dimensions: string;
  value: number;
  packageType: string;
  marks: string;
}

interface BillOfLadingData {
  bolNumber: string;
  issueDate: string;
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  shipperEmail: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
  voyageNumber: string;
  containerNumber: string;
  sealNumber: string;
  freightTerms: string;
  paymentTerms: string;
  freightCharges: number;
  otherCharges: number;
  specialInstructions: string;
  items: CargoItem[];
  totalWeight: number;
  totalValue: number;
  totalCharges: number;
}

interface BillOfLadingFormData extends Record<string, unknown> {
  bol: BillOfLadingData;
}

const initialData = (): BillOfLadingFormData => ({
  bol: {
    bolNumber: `BOL-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    issueDate: new Date().toISOString().split('T')[0],
    shipperName: '',
    shipperAddress: '',
    shipperPhone: '',
    shipperEmail: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneePhone: '',
    consigneeEmail: '',
    portOfLoading: '',
    portOfDischarge: '',
    vesselName: '',
    voyageNumber: '',
    containerNumber: '',
    sealNumber: '',
    freightTerms: 'prepaid',
    paymentTerms: 'cash',
    freightCharges: 0,
    otherCharges: 0,
    specialInstructions: '',
    items: [],
    totalWeight: 0,
    totalValue: 0,
    totalCharges: 0,
  },
});

const createNewItem = (): CargoItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  quantity: 0,
  unit: 'pcs',
  weight: 0,
  dimensions: '',
  value: 0,
  packageType: 'carton',
  marks: '',
});

const BillOfLadingComponent = () => {
  const [data, setData] = useState<BillOfLadingFormData>(initialData());

  const updateBOL = (field: keyof BillOfLadingData, value: string | number) => {
    setData(prev => ({ ...prev, bol: { ...prev.bol, [field]: value } }));
  };

  const calculateTotals = (items: CargoItem[]) => {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
    const totalCharges = data.bol.freightCharges + data.bol.otherCharges;
    
    setData(prev => ({
      ...prev,
      bol: { ...prev.bol, totalWeight, totalValue, totalCharges }
    }));
  };

  const updateItem = (itemId: string, field: keyof CargoItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.bol.items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });

      const totalWeight = updatedItems.reduce((sum, item) => sum + (item.weight || 0), 0);
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.value || 0), 0);
      const totalCharges = prev.bol.freightCharges + prev.bol.otherCharges;

      return {
        ...prev,
        bol: { ...prev.bol, items: updatedItems, totalWeight, totalValue, totalCharges },
      };
    });
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      bol: { ...prev.bol, items: [...prev.bol.items, createNewItem()] },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.bol.items.filter(item => item.id !== itemId);
      const totalWeight = updatedItems.reduce((sum, item) => sum + (item.weight || 0), 0);
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.value || 0), 0);
      const totalCharges = prev.bol.freightCharges + prev.bol.otherCharges;

      return {
        ...prev,
        bol: { ...prev.bol, items: updatedItems, totalWeight, totalValue, totalCharges },
      };
    });
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* BOL Information */}
        <Card>
          <CardHeader><CardTitle>BOL Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="BOL Number" id="bol-number" value={data.bol.bolNumber} onChange={(v) => updateBOL('bolNumber', v)} required />
            <FormField label="Issue Date" id="bol-date" type="date" value={data.bol.issueDate} onChange={(v) => updateBOL('issueDate', v)} required />
          </CardContent>
        </Card>

        {/* Shipper Information */}
        <Card>
          <CardHeader><CardTitle>Shipper Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Shipper Name" id="shipper-name" value={data.bol.shipperName} onChange={(v) => updateBOL('shipperName', v)} required />
            <FormField label="Address" id="shipper-address" type="textarea" value={data.bol.shipperAddress} onChange={(v) => updateBOL('shipperAddress', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="shipper-phone" value={data.bol.shipperPhone} onChange={(v) => updateBOL('shipperPhone', v)} />
              <FormField label="Email" id="shipper-email" type="email" value={data.bol.shipperEmail} onChange={(v) => updateBOL('shipperEmail', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Consignee Information */}
        <Card>
          <CardHeader><CardTitle>Consignee Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Consignee Name" id="consignee-name" value={data.bol.consigneeName} onChange={(v) => updateBOL('consigneeName', v)} required />
            <FormField label="Address" id="consignee-address" type="textarea" value={data.bol.consigneeAddress} onChange={(v) => updateBOL('consigneeAddress', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="consignee-phone" value={data.bol.consigneePhone} onChange={(v) => updateBOL('consigneePhone', v)} />
              <FormField label="Email" id="consignee-email" type="email" value={data.bol.consigneeEmail} onChange={(v) => updateBOL('consigneeEmail', v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Shipping Details */}
        <Card>
          <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Port of Loading" id="port-loading" value={data.bol.portOfLoading} onChange={(v) => updateBOL('portOfLoading', v)} />
              <FormField label="Port of Discharge" id="port-discharge" value={data.bol.portOfDischarge} onChange={(v) => updateBOL('portOfDischarge', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Vessel Name" id="vessel-name" value={data.bol.vesselName} onChange={(v) => updateBOL('vesselName', v)} />
              <FormField label="Voyage Number" id="voyage-number" value={data.bol.voyageNumber} onChange={(v) => updateBOL('voyageNumber', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Container Number" id="container-number" value={data.bol.containerNumber} onChange={(v) => updateBOL('containerNumber', v)} />
              <FormField label="Seal Number" id="seal-number" value={data.bol.sealNumber} onChange={(v) => updateBOL('sealNumber', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Terms and Charges */}
        <Card>
          <CardHeader><CardTitle>Terms and Charges</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                label="Freight Terms" 
                id="freight-terms" 
                type="select" 
                value={data.bol.freightTerms} 
                onChange={(v) => updateBOL('freightTerms', v)}
                options={[
                  { value: 'prepaid', label: 'Prepaid' },
                  { value: 'collect', label: 'Collect' },
                  { value: 'third-party', label: 'Third Party' }
                ]}
              />
              <FormField 
                label="Payment Terms" 
                id="payment-terms" 
                type="select" 
                value={data.bol.paymentTerms} 
                onChange={(v) => updateBOL('paymentTerms', v)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'credit', label: 'Credit' },
                  { value: 'cod', label: 'COD' }
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Freight Charges ($)" id="freight-charges" type="number" value={data.bol.freightCharges} onChange={(v) => updateBOL('freightCharges', parseFloat(v) || 0)} />
              <FormField label="Other Charges ($)" id="other-charges" type="number" value={data.bol.otherCharges} onChange={(v) => updateBOL('otherCharges', parseFloat(v) || 0)} />
            </div>
            <FormField label="Special Instructions" id="special-instructions" type="textarea" value={data.bol.specialInstructions} onChange={(v) => updateBOL('specialInstructions', v)} rows={3} />
          </CardContent>
        </Card>

        {/* Cargo Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cargo Items</CardTitle>
              <Button onClick={addItem} size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.bol.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <FormField label="Description" id={`item-desc-${item.id}`} value={item.description} onChange={(v) => updateItem(item.id, 'description', v)} required />
                    <div className="grid grid-cols-3 gap-3">
                      <FormField 
                        label="Package Type" 
                        id={`item-package-${item.id}`} 
                        type="select" 
                        value={item.packageType} 
                        onChange={(v) => updateItem(item.id, 'packageType', v)}
                        options={[
                          { value: 'carton', label: 'Carton' },
                          { value: 'pallet', label: 'Pallet' },
                          { value: 'crate', label: 'Crate' },
                          { value: 'bag', label: 'Bag' },
                          { value: 'drum', label: 'Drum' }
                        ]}
                      />
                      <FormField label="Quantity" id={`item-qty-${item.id}`} type="number" value={item.quantity} onChange={(v) => updateItem(item.id, 'quantity', parseFloat(v) || 0)} />
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
                          { value: 'tons', label: 'Tons' }
                        ]}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <FormField label="Weight (kg)" id={`item-weight-${item.id}`} type="number" value={item.weight} onChange={(v) => updateItem(item.id, 'weight', parseFloat(v) || 0)} />
                      <FormField label="Dimensions" id={`item-dimensions-${item.id}`} value={item.dimensions} onChange={(v) => updateItem(item.id, 'dimensions', v)} />
                      <FormField label="Value ($)" id={`item-value-${item.id}`} type="number" value={item.value} onChange={(v) => updateItem(item.id, 'value', parseFloat(v) || 0)} />
                      <FormField label="Marks" id={`item-marks-${item.id}`} value={item.marks} onChange={(v) => updateItem(item.id, 'marks', v)} />
                    </div>
                  </div>
                </div>
              ))}
              {data.bol.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click Add Item to get started.</p>
                </div>
              )}
            </div>
            {data.bol.items.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between"><span>Total Weight:</span><span>{data.bol.totalWeight} kg</span></div>
                    <div className="flex justify-between"><span>Total Value:</span><span>{formatCurrency(data.bol.totalValue)}</span></div>
                    <div className="flex justify-between"><span>Freight Charges:</span><span>{formatCurrency(data.bol.freightCharges)}</span></div>
                    <div className="flex justify-between"><span>Other Charges:</span><span>{formatCurrency(data.bol.otherCharges)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total Charges:</span><span>{formatCurrency(data.bol.totalCharges)}</span></div>
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
          <h1 className="text-3xl font-bold text-blue-600 mb-2">BILL OF LADING</h1>
          <div className="text-gray-600">
            <p><strong>BOL Number:</strong> {data.bol.bolNumber}</p>
            <p><strong>Issue Date:</strong> {formatDate(data.bol.issueDate)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipper:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{data.bol.shipperName}</p>
            <p>{data.bol.shipperAddress}</p>
            <p>Phone: {data.bol.shipperPhone}</p>
            <p>Email: {data.bol.shipperEmail}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Consignee:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{data.bol.consigneeName}</p>
            <p>{data.bol.consigneeAddress}</p>
            <p>Phone: {data.bol.consigneePhone}</p>
            <p>Email: {data.bol.consigneeEmail}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Details:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Port of Loading:</strong> {data.bol.portOfLoading}</p>
          <p><strong>Port of Discharge:</strong> {data.bol.portOfDischarge}</p>
          <p><strong>Vessel:</strong> {data.bol.vesselName}</p>
          <p><strong>Voyage:</strong> {data.bol.voyageNumber}</p>
          <p><strong>Container:</strong> {data.bol.containerNumber}</p>
          <p><strong>Seal:</strong> {data.bol.sealNumber}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Description</th>
              <th className="border border-gray-300 p-3 text-center">Qty</th>
              <th className="border border-gray-300 p-3 text-center">Weight</th>
              <th className="border border-gray-300 p-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.bol.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-3">{item.description}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-gray-300 p-3 text-center">{item.weight} kg</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b"><span>Total Weight:</span><span>{data.bol.totalWeight} kg</span></div>
            <div className="flex justify-between py-2 border-b"><span>Total Value:</span><span>{formatCurrency(data.bol.totalValue)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Freight Charges:</span><span>{formatCurrency(data.bol.freightCharges)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Other Charges:</span><span>{formatCurrency(data.bol.otherCharges)}</span></div>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Total Charges:</span><span>{formatCurrency(data.bol.totalCharges)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Terms:</h3>
          <p className="text-gray-700 text-sm">Freight Terms: {data.bol.freightTerms}</p>
          <p className="text-gray-700 text-sm">Payment Terms: {data.bol.paymentTerms}</p>
        </div>
        {data.bol.specialInstructions && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions:</h3>
            <p className="text-gray-700 text-sm">{data.bol.specialInstructions}</p>
          </div>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This is a computer-generated Bill of Lading.</p>
      </div>
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Bill of Lading (BOL)"
      description="Create and manage shipping bills of lading"
      documentType="quotation"
      iconColor="text-blue-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
};

export default BillOfLadingComponent;