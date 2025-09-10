'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from './BaseDocumentComponent';

interface ConsignmentItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  weight: number;
  dimensions: string;
  value: number;
  packageType: string;
  condition: string;
}

interface ConsignmentNoteData {
  waybillNumber: string;
  issueDate: string;
  consignorName: string;
  consignorAddress: string;
  consignorPhone: string;
  consignorEmail: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  pickupAddress: string;
  deliveryAddress: string;
  transportMode: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  serviceType: string;
  paymentMode: string;
  freightCharges: number;
  insuranceCharges: number;
  otherCharges: number;
  specialInstructions: string;
  items: ConsignmentItem[];
  totalWeight: number;
  totalValue: number;
  totalCharges: number;
}

interface ConsignmentNoteFormData extends Record<string, unknown> {
  consignment: ConsignmentNoteData;
}

const initialData = (): ConsignmentNoteFormData => ({
  consignment: {
    waybillNumber: `WB-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    issueDate: new Date().toISOString().split('T')[0],
    consignorName: '',
    consignorAddress: '',
    consignorPhone: '',
    consignorEmail: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneePhone: '',
    consigneeEmail: '',
    pickupAddress: '',
    deliveryAddress: '',
    transportMode: 'road',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    serviceType: 'standard',
    paymentMode: 'prepaid',
    freightCharges: 0,
    insuranceCharges: 0,
    otherCharges: 0,
    specialInstructions: '',
    items: [],
    totalWeight: 0,
    totalValue: 0,
    totalCharges: 0,
  },
});

const createNewItem = (): ConsignmentItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  quantity: 0,
  unit: 'pcs',
  weight: 0,
  dimensions: '',
  value: 0,
  packageType: 'box',
  condition: 'good',
});

const ConsignmentNoteComponent = () => {
  const [data, setData] = useState<ConsignmentNoteFormData>(initialData());

  const updateConsignment = (field: keyof ConsignmentNoteData, value: string | number) => {
    setData(prev => ({ ...prev, consignment: { ...prev.consignment, [field]: value } }));
  };

  const updateItem = (itemId: string, field: keyof ConsignmentItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.consignment.items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });

      const totalWeight = updatedItems.reduce((sum, item) => sum + (item.weight || 0), 0);
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.value || 0), 0);
      const totalCharges = prev.consignment.freightCharges + prev.consignment.insuranceCharges + prev.consignment.otherCharges;

      return {
        ...prev,
        consignment: { ...prev.consignment, items: updatedItems, totalWeight, totalValue, totalCharges },
      };
    });
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      consignment: { ...prev.consignment, items: [...prev.consignment.items, createNewItem()] },
    }));
  };

  const removeItem = (itemId: string) => {
    setData(prev => {
      const updatedItems = prev.consignment.items.filter(item => item.id !== itemId);
      const totalWeight = updatedItems.reduce((sum, item) => sum + (item.weight || 0), 0);
      const totalValue = updatedItems.reduce((sum, item) => sum + (item.value || 0), 0);
      const totalCharges = prev.consignment.freightCharges + prev.consignment.insuranceCharges + prev.consignment.otherCharges;

      return {
        ...prev,
        consignment: { ...prev.consignment, items: updatedItems, totalWeight, totalValue, totalCharges },
      };
    });
  };

  const renderForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Waybill Information */}
        <Card>
          <CardHeader><CardTitle>Waybill Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Waybill Number" id="waybill-number" value={data.consignment.waybillNumber} onChange={(v) => updateConsignment('waybillNumber', v)} required />
            <FormField label="Issue Date" id="waybill-date" type="date" value={data.consignment.issueDate} onChange={(v) => updateConsignment('issueDate', v)} required />
            <FormField 
              label="Service Type" 
              id="service-type" 
              type="select" 
              value={data.consignment.serviceType} 
              onChange={(v) => updateConsignment('serviceType', v)}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'express', label: 'Express' },
                { value: 'overnight', label: 'Overnight' },
                { value: 'same-day', label: 'Same Day' }
              ]}
            />
          </CardContent>
        </Card>

        {/* Consignor Information */}
        <Card>
          <CardHeader><CardTitle>Consignor (Sender) Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Consignor Name" id="consignor-name" value={data.consignment.consignorName} onChange={(v) => updateConsignment('consignorName', v)} required />
            <FormField label="Address" id="consignor-address" type="textarea" value={data.consignment.consignorAddress} onChange={(v) => updateConsignment('consignorAddress', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="consignor-phone" value={data.consignment.consignorPhone} onChange={(v) => updateConsignment('consignorPhone', v)} />
              <FormField label="Email" id="consignor-email" type="email" value={data.consignment.consignorEmail} onChange={(v) => updateConsignment('consignorEmail', v)} />
            </div>
          </CardContent>
        </Card>

        {/* Consignee Information */}
        <Card>
          <CardHeader><CardTitle>Consignee (Receiver) Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Consignee Name" id="consignee-name" value={data.consignment.consigneeName} onChange={(v) => updateConsignment('consigneeName', v)} required />
            <FormField label="Address" id="consignee-address" type="textarea" value={data.consignment.consigneeAddress} onChange={(v) => updateConsignment('consigneeAddress', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Phone" id="consignee-phone" value={data.consignment.consigneePhone} onChange={(v) => updateConsignment('consigneePhone', v)} />
              <FormField label="Email" id="consignee-email" type="email" value={data.consignment.consigneeEmail} onChange={(v) => updateConsignment('consigneeEmail', v)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Transport Details */}
        <Card>
          <CardHeader><CardTitle>Transport Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                label="Transport Mode" 
                id="transport-mode" 
                type="select" 
                value={data.consignment.transportMode} 
                onChange={(v) => updateConsignment('transportMode', v)}
                options={[
                  { value: 'road', label: 'Road' },
                  { value: 'rail', label: 'Rail' },
                  { value: 'air', label: 'Air' },
                  { value: 'sea', label: 'Sea' }
                ]}
              />
              <FormField label="Vehicle Number" id="vehicle-number" value={data.consignment.vehicleNumber} onChange={(v) => updateConsignment('vehicleNumber', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Driver Name" id="driver-name" value={data.consignment.driverName} onChange={(v) => updateConsignment('driverName', v)} />
              <FormField label="Driver Phone" id="driver-phone" value={data.consignment.driverPhone} onChange={(v) => updateConsignment('driverPhone', v)} />
            </div>
            <FormField label="Pickup Address" id="pickup-address" type="textarea" value={data.consignment.pickupAddress} onChange={(v) => updateConsignment('pickupAddress', v)} rows={2} />
            <FormField label="Delivery Address" id="delivery-address" type="textarea" value={data.consignment.deliveryAddress} onChange={(v) => updateConsignment('deliveryAddress', v)} rows={2} />
          </CardContent>
        </Card>

        {/* Charges and Payment */}
        <Card>
          <CardHeader><CardTitle>Charges and Payment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField 
              label="Payment Mode" 
              id="payment-mode" 
              type="select" 
              value={data.consignment.paymentMode} 
              onChange={(v) => updateConsignment('paymentMode', v)}
              options={[
                { value: 'prepaid', label: 'Prepaid' },
                { value: 'cod', label: 'Cash on Delivery' },
                { value: 'credit', label: 'Credit' }
              ]}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Freight Charges ($)" id="freight-charges" type="number" value={data.consignment.freightCharges} onChange={(v) => updateConsignment('freightCharges', parseFloat(v) || 0)} />
              <FormField label="Insurance Charges ($)" id="insurance-charges" type="number" value={data.consignment.insuranceCharges} onChange={(v) => updateConsignment('insuranceCharges', parseFloat(v) || 0)} />
              <FormField label="Other Charges ($)" id="other-charges" type="number" value={data.consignment.otherCharges} onChange={(v) => updateConsignment('otherCharges', parseFloat(v) || 0)} />
            </div>
            <FormField label="Special Instructions" id="special-instructions" type="textarea" value={data.consignment.specialInstructions} onChange={(v) => updateConsignment('specialInstructions', v)} rows={3} />
          </CardContent>
        </Card>

        {/* Consignment Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Consignment Items</CardTitle>
              <Button onClick={addItem} size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.consignment.items.map((item, index) => (
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
                          { value: 'box', label: 'Box' },
                          { value: 'envelope', label: 'Envelope' },
                          { value: 'pallet', label: 'Pallet' },
                          { value: 'crate', label: 'Crate' }
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
                          { value: 'packages', label: 'Packages' }
                        ]}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <FormField label="Weight (kg)" id={`item-weight-${item.id}`} type="number" value={item.weight} onChange={(v) => updateItem(item.id, 'weight', parseFloat(v) || 0)} />
                      <FormField label="Dimensions" id={`item-dimensions-${item.id}`} value={item.dimensions} onChange={(v) => updateItem(item.id, 'dimensions', v)} />
                      <FormField label="Value ($)" id={`item-value-${item.id}`} type="number" value={item.value} onChange={(v) => updateItem(item.id, 'value', parseFloat(v) || 0)} />
                      <FormField 
                        label="Condition" 
                        id={`item-condition-${item.id}`} 
                        type="select" 
                        value={item.condition} 
                        onChange={(v) => updateItem(item.id, 'condition', v)}
                        options={[
                          { value: 'good', label: 'Good' },
                          { value: 'fair', label: 'Fair' },
                          { value: 'damaged', label: 'Damaged' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {data.consignment.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items added yet. Click Add Item to get started.</p>
                </div>
              )}
            </div>
            {data.consignment.items.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between"><span>Total Weight:</span><span>{data.consignment.totalWeight} kg</span></div>
                    <div className="flex justify-between"><span>Total Value:</span><span>{formatCurrency(data.consignment.totalValue)}</span></div>
                    <div className="flex justify-between"><span>Freight:</span><span>{formatCurrency(data.consignment.freightCharges)}</span></div>
                    <div className="flex justify-between"><span>Insurance:</span><span>{formatCurrency(data.consignment.insuranceCharges)}</span></div>
                    <div className="flex justify-between"><span>Other:</span><span>{formatCurrency(data.consignment.otherCharges)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total Charges:</span><span>{formatCurrency(data.consignment.totalCharges)}</span></div>
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
          <h1 className="text-3xl font-bold text-green-600 mb-2">CONSIGNMENT NOTE / WAYBILL</h1>
          <div className="text-gray-600">
            <p><strong>Waybill Number:</strong> {data.consignment.waybillNumber}</p>
            <p><strong>Issue Date:</strong> {formatDate(data.consignment.issueDate)}</p>
            <p><strong>Service Type:</strong> {data.consignment.serviceType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Consignor (Sender):</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{data.consignment.consignorName}</p>
            <p>{data.consignment.consignorAddress}</p>
            <p>Phone: {data.consignment.consignorPhone}</p>
            <p>Email: {data.consignment.consignorEmail}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Consignee (Receiver):</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">{data.consignment.consigneeName}</p>
            <p>{data.consignment.consigneeAddress}</p>
            <p>Phone: {data.consignment.consigneePhone}</p>
            <p>Email: {data.consignment.consigneeEmail}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Transport Details:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Transport Mode:</strong> {data.consignment.transportMode}</p>
          <p><strong>Vehicle Number:</strong> {data.consignment.vehicleNumber}</p>
          <p><strong>Driver:</strong> {data.consignment.driverName}</p>
          <p><strong>Driver Phone:</strong> {data.consignment.driverPhone}</p>
          <p><strong>Payment Mode:</strong> {data.consignment.paymentMode}</p>
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
              <th className="border border-gray-300 p-3 text-center">Condition</th>
            </tr>
          </thead>
          <tbody>
            {data.consignment.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-3">{item.description}</td>
                <td className="border border-gray-300 p-3 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-gray-300 p-3 text-center">{item.weight} kg</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(item.value)}</td>
                <td className="border border-gray-300 p-3 text-center">{item.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b"><span>Total Weight:</span><span>{data.consignment.totalWeight} kg</span></div>
            <div className="flex justify-between py-2 border-b"><span>Total Value:</span><span>{formatCurrency(data.consignment.totalValue)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Freight:</span><span>{formatCurrency(data.consignment.freightCharges)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Insurance:</span><span>{formatCurrency(data.consignment.insuranceCharges)}</span></div>
            <div className="flex justify-between py-2 border-b"><span>Other:</span><span>{formatCurrency(data.consignment.otherCharges)}</span></div>
            <div className="flex justify-between py-2 text-lg font-bold"><span>Total:</span><span>{formatCurrency(data.consignment.totalCharges)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Addresses:</h3>
          <p className="text-gray-700 text-sm"><strong>Pickup:</strong> {data.consignment.pickupAddress}</p>
          <p className="text-gray-700 text-sm"><strong>Delivery:</strong> {data.consignment.deliveryAddress}</p>
        </div>
        {data.consignment.specialInstructions && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions:</h3>
            <p className="text-gray-700 text-sm">{data.consignment.specialInstructions}</p>
          </div>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This is a computer-generated consignment note.</p>
      </div>
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Consignment Note / Waybill"
      description="Create and manage shipping waybills"
      documentType="quotation"
      iconColor="text-green-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
};

export default ConsignmentNoteComponent;