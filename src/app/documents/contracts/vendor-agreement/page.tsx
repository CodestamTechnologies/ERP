'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from '@/components/documents/BaseDocumentComponent';

interface VendorAgreementData extends Record<string, unknown> {
  // Company Details
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyGST: string;
  
  // Vendor Details
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorGST: string;
  vendorPAN: string;
  
  // Agreement Details
  agreementDate: string;
  effectiveDate: string;
  expiryDate: string;
  agreementType: string;
  renewalTerms: string;
  
  // Supply Details
  productsServices: string;
  specifications: string;
  qualityStandards: string;
  deliveryTerms: string;
  deliveryLocation: string;
  
  // Financial Terms
  pricingStructure: string;
  paymentTerms: string;
  currency: string;
  minimumOrderValue: number;
  maximumOrderValue: number;
  discountTerms: string;
  
  // Performance Terms
  deliveryTimeline: string;
  performanceMetrics: string;
  penaltyClause: string;
  warrantyTerms: string;
  
  // Legal Terms
  terminationClause: string;
  confidentialityClause: string;
  liabilityClause: string;
  disputeResolution: string;
  governingLaw: string;
  forcemajeure: string;
  
  // Additional Terms
  additionalTerms: string;
  specialConditions: string;
}

const initialData: VendorAgreementData = {
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyGST: '',
  vendorName: '',
  vendorAddress: '',
  vendorEmail: '',
  vendorPhone: '',
  vendorGST: '',
  vendorPAN: '',
  agreementDate: new Date().toISOString().split('T')[0],
  effectiveDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  agreementType: 'Supply Agreement',
  renewalTerms: 'Auto-renewal for 1 year unless terminated',
  productsServices: '',
  specifications: '',
  qualityStandards: 'As per industry standards',
  deliveryTerms: 'FOB Destination',
  deliveryLocation: '',
  pricingStructure: 'Fixed pricing as per attached schedule',
  paymentTerms: '30 days from invoice date',
  currency: 'INR',
  minimumOrderValue: 0,
  maximumOrderValue: 0,
  discountTerms: '',
  deliveryTimeline: '7-10 business days',
  performanceMetrics: 'On-time delivery: 95%, Quality compliance: 100%',
  penaltyClause: 'Late delivery penalty: 1% per day of order value',
  warrantyTerms: 'Standard manufacturer warranty applies',
  terminationClause: 'Either party may terminate with 30 days written notice',
  confidentialityClause: 'Both parties agree to maintain confidentiality of proprietary information',
  liabilityClause: 'Vendor liability limited to order value',
  disputeResolution: 'Disputes resolved through arbitration',
  governingLaw: 'Governed by laws of India',
  forcemajeure: 'Neither party liable for delays due to force majeure events',
  additionalTerms: '',
  specialConditions: ''
};

export default function VendorAgreementPage() {
  const [data, setData] = useState<VendorAgreementData>(initialData);

  const updateField = (field: keyof VendorAgreementData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details (Buyer)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company Name"
            id="companyName"
            value={data.companyName}
            onChange={(value) => updateField('companyName', value)}
            required
          />
          <FormField
            label="GST Number"
            id="companyGST"
            value={data.companyGST}
            onChange={(value) => updateField('companyGST', value)}
          />
          <FormField
            label="Address"
            id="companyAddress"
            value={data.companyAddress}
            onChange={(value) => updateField('companyAddress', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Email"
              id="companyEmail"
              value={data.companyEmail}
              onChange={(value) => updateField('companyEmail', value)}
              type="email"
            />
            <FormField
              label="Phone"
              id="companyPhone"
              value={data.companyPhone}
              onChange={(value) => updateField('companyPhone', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendor Details */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor/Supplier Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Vendor Name"
            id="vendorName"
            value={data.vendorName}
            onChange={(value) => updateField('vendorName', value)}
            required
          />
          <FormField
            label="GST Number"
            id="vendorGST"
            value={data.vendorGST}
            onChange={(value) => updateField('vendorGST', value)}
          />
          <FormField
            label="Address"
            id="vendorAddress"
            value={data.vendorAddress}
            onChange={(value) => updateField('vendorAddress', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Email"
              id="vendorEmail"
              value={data.vendorEmail}
              onChange={(value) => updateField('vendorEmail', value)}
              type="email"
            />
            <FormField
              label="Phone"
              id="vendorPhone"
              value={data.vendorPhone}
              onChange={(value) => updateField('vendorPhone', value)}
            />
            <FormField
              label="PAN Number"
              id="vendorPAN"
              value={data.vendorPAN}
              onChange={(value) => updateField('vendorPAN', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Agreement Date"
            id="agreementDate"
            value={data.agreementDate}
            onChange={(value) => updateField('agreementDate', value)}
            type="date"
            required
          />
          <FormField
            label="Effective Date"
            id="effectiveDate"
            value={data.effectiveDate}
            onChange={(value) => updateField('effectiveDate', value)}
            type="date"
            required
          />
          <FormField
            label="Expiry Date"
            id="expiryDate"
            value={data.expiryDate}
            onChange={(value) => updateField('expiryDate', value)}
            type="date"
          />
          <FormField
            label="Agreement Type"
            id="agreementType"
            value={data.agreementType}
            onChange={(value) => updateField('agreementType', value)}
            type="select"
            options={[
              { value: 'Supply Agreement', label: 'Supply Agreement' },
              { value: 'Service Agreement', label: 'Service Agreement' },
              { value: 'Master Service Agreement', label: 'Master Service Agreement' },
              { value: 'Purchase Agreement', label: 'Purchase Agreement' }
            ]}
          />
          <div className="md:col-span-2">
            <FormField
              label="Renewal Terms"
              id="renewalTerms"
              value={data.renewalTerms}
              onChange={(value) => updateField('renewalTerms', value)}
              type="textarea"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supply Details */}
      <Card>
        <CardHeader>
          <CardTitle>Supply/Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Products/Services Description"
            id="productsServices"
            value={data.productsServices}
            onChange={(value) => updateField('productsServices', value)}
            type="textarea"
            rows={3}
            required
          />
          <FormField
            label="Technical Specifications"
            id="specifications"
            value={data.specifications}
            onChange={(value) => updateField('specifications', value)}
            type="textarea"
            rows={3}
          />
          <FormField
            label="Quality Standards"
            id="qualityStandards"
            value={data.qualityStandards}
            onChange={(value) => updateField('qualityStandards', value)}
            type="textarea"
            rows={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Delivery Terms"
              id="deliveryTerms"
              value={data.deliveryTerms}
              onChange={(value) => updateField('deliveryTerms', value)}
              type="select"
              options={[
                { value: 'FOB Destination', label: 'FOB Destination' },
                { value: 'FOB Origin', label: 'FOB Origin' },
                { value: 'CIF', label: 'CIF' },
                { value: 'Ex-Works', label: 'Ex-Works' }
              ]}
            />
            <FormField
              label="Delivery Location"
              id="deliveryLocation"
              value={data.deliveryLocation}
              onChange={(value) => updateField('deliveryLocation', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Pricing Structure"
            id="pricingStructure"
            value={data.pricingStructure}
            onChange={(value) => updateField('pricingStructure', value)}
            type="textarea"
            rows={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Payment Terms"
              id="paymentTerms"
              value={data.paymentTerms}
              onChange={(value) => updateField('paymentTerms', value)}
              type="select"
              options={[
                { value: '15 days from invoice date', label: '15 days' },
                { value: '30 days from invoice date', label: '30 days' },
                { value: '45 days from invoice date', label: '45 days' },
                { value: '60 days from invoice date', label: '60 days' },
                { value: 'Advance payment', label: 'Advance payment' }
              ]}
            />
            <FormField
              label="Currency"
              id="currency"
              value={data.currency}
              onChange={(value) => updateField('currency', value)}
              type="select"
              options={[
                { value: 'INR', label: 'Indian Rupee (INR)' },
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' }
              ]}
            />
            <FormField
              label="Minimum Order Value"
              id="minimumOrderValue"
              value={data.minimumOrderValue}
              onChange={(value) => updateField('minimumOrderValue', Number(value))}
              type="number"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Maximum Order Value"
              id="maximumOrderValue"
              value={data.maximumOrderValue}
              onChange={(value) => updateField('maximumOrderValue', Number(value))}
              type="number"
            />
            <FormField
              label="Discount Terms"
              id="discountTerms"
              value={data.discountTerms}
              onChange={(value) => updateField('discountTerms', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Quality Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Delivery Timeline"
            id="deliveryTimeline"
            value={data.deliveryTimeline}
            onChange={(value) => updateField('deliveryTimeline', value)}
          />
          <FormField
            label="Performance Metrics"
            id="performanceMetrics"
            value={data.performanceMetrics}
            onChange={(value) => updateField('performanceMetrics', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Penalty Clause"
            id="penaltyClause"
            value={data.penaltyClause}
            onChange={(value) => updateField('penaltyClause', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Warranty Terms"
            id="warrantyTerms"
            value={data.warrantyTerms}
            onChange={(value) => updateField('warrantyTerms', value)}
            type="textarea"
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Legal Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Termination Clause"
            id="terminationClause"
            value={data.terminationClause}
            onChange={(value) => updateField('terminationClause', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Confidentiality Clause"
            id="confidentialityClause"
            value={data.confidentialityClause}
            onChange={(value) => updateField('confidentialityClause', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Liability Clause"
            id="liabilityClause"
            value={data.liabilityClause}
            onChange={(value) => updateField('liabilityClause', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Dispute Resolution"
            id="disputeResolution"
            value={data.disputeResolution}
            onChange={(value) => updateField('disputeResolution', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Governing Law"
            id="governingLaw"
            value={data.governingLaw}
            onChange={(value) => updateField('governingLaw', value)}
          />
          <FormField
            label="Force Majeure"
            id="forcemajeure"
            value={data.forcemajeure}
            onChange={(value) => updateField('forcemajeure', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Additional Terms"
            id="additionalTerms"
            value={data.additionalTerms}
            onChange={(value) => updateField('additionalTerms', value)}
            type="textarea"
            rows={3}
          />
          <FormField
            label="Special Conditions"
            id="specialConditions"
            value={data.specialConditions}
            onChange={(value) => updateField('specialConditions', value)}
            type="textarea"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPreview = () => (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">VENDOR/SUPPLIER AGREEMENT</h1>
          <p className="text-gray-600">Agreement Date: {formatDate(data.agreementDate)}</p>
        </div>

        <div className="space-y-6">
          {/* Parties */}
          <div>
            <h2 className="text-lg font-semibold mb-3">PARTIES TO THE AGREEMENT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">BUYER/COMPANY:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.companyName}</strong></p>
                  <p>{data.companyAddress}</p>
                  <p>Email: {data.companyEmail}</p>
                  <p>Phone: {data.companyPhone}</p>
                  {data.companyGST && <p>GST: {data.companyGST}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">VENDOR/SUPPLIER:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.vendorName}</strong></p>
                  <p>{data.vendorAddress}</p>
                  <p>Email: {data.vendorEmail}</p>
                  <p>Phone: {data.vendorPhone}</p>
                  {data.vendorGST && <p>GST: {data.vendorGST}</p>}
                  {data.vendorPAN && <p>PAN: {data.vendorPAN}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">AGREEMENT TERMS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Agreement Type:</strong>
                <p>{data.agreementType}</p>
              </div>
              <div>
                <strong>Effective Date:</strong>
                <p>{formatDate(data.effectiveDate)}</p>
              </div>
              {data.expiryDate && (
                <div>
                  <strong>Expiry Date:</strong>
                  <p>{formatDate(data.expiryDate)}</p>
                </div>
              )}
            </div>
            {data.renewalTerms && (
              <div className="mt-3 text-sm">
                <strong>Renewal Terms:</strong>
                <p>{data.renewalTerms}</p>
              </div>
            )}
          </div>

          {/* Products/Services */}
          {data.productsServices && (
            <div>
              <h2 className="text-lg font-semibold mb-3">PRODUCTS/SERVICES</h2>
              <p className="text-sm whitespace-pre-wrap">{data.productsServices}</p>
              {data.specifications && (
                <div className="mt-3">
                  <strong className="text-sm">Technical Specifications:</strong>
                  <p className="text-sm whitespace-pre-wrap">{data.specifications}</p>
                </div>
              )}
            </div>
          )}

          {/* Quality & Delivery */}
          <div>
            <h2 className="text-lg font-semibold mb-3">QUALITY & DELIVERY TERMS</h2>
            <div className="text-sm space-y-2">
              <div>
                <strong>Quality Standards:</strong>
                <p>{data.qualityStandards}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Delivery Terms:</strong>
                  <p>{data.deliveryTerms}</p>
                </div>
                <div>
                  <strong>Delivery Timeline:</strong>
                  <p>{data.deliveryTimeline}</p>
                </div>
              </div>
              {data.deliveryLocation && (
                <div>
                  <strong>Delivery Location:</strong>
                  <p>{data.deliveryLocation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">FINANCIAL TERMS</h2>
            <div className="text-sm space-y-2">
              <div>
                <strong>Pricing Structure:</strong>
                <p>{data.pricingStructure}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Payment Terms:</strong>
                  <p>{data.paymentTerms}</p>
                </div>
                <div>
                  <strong>Currency:</strong>
                  <p>{data.currency}</p>
                </div>
              </div>
              {(data.minimumOrderValue > 0 || data.maximumOrderValue > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.minimumOrderValue > 0 && (
                    <div>
                      <strong>Minimum Order Value:</strong>
                      <p>{formatCurrency(data.minimumOrderValue)}</p>
                    </div>
                  )}
                  {data.maximumOrderValue > 0 && (
                    <div>
                      <strong>Maximum Order Value:</strong>
                      <p>{formatCurrency(data.maximumOrderValue)}</p>
                    </div>
                  )}
                </div>
              )}
              {data.discountTerms && (
                <div>
                  <strong>Discount Terms:</strong>
                  <p>{data.discountTerms}</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">PERFORMANCE TERMS</h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Performance Metrics:</strong>
                <p className="whitespace-pre-wrap">{data.performanceMetrics}</p>
              </div>
              <div>
                <strong>Penalty Clause:</strong>
                <p className="whitespace-pre-wrap">{data.penaltyClause}</p>
              </div>
              <div>
                <strong>Warranty Terms:</strong>
                <p className="whitespace-pre-wrap">{data.warrantyTerms}</p>
              </div>
            </div>
          </div>

          {/* Legal Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">LEGAL TERMS & CONDITIONS</h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Termination:</strong>
                <p>{data.terminationClause}</p>
              </div>
              <div>
                <strong>Confidentiality:</strong>
                <p>{data.confidentialityClause}</p>
              </div>
              <div>
                <strong>Liability:</strong>
                <p>{data.liabilityClause}</p>
              </div>
              <div>
                <strong>Dispute Resolution:</strong>
                <p>{data.disputeResolution}</p>
              </div>
              <div>
                <strong>Governing Law:</strong>
                <p>{data.governingLaw}</p>
              </div>
              <div>
                <strong>Force Majeure:</strong>
                <p>{data.forcemajeure}</p>
              </div>
              {data.additionalTerms && (
                <div>
                  <strong>Additional Terms:</strong>
                  <p className="whitespace-pre-wrap">{data.additionalTerms}</p>
                </div>
              )}
              {data.specialConditions && (
                <div>
                  <strong>Special Conditions:</strong>
                  <p className="whitespace-pre-wrap">{data.specialConditions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4">BUYER/COMPANY</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.companyName}</p>
                <p className="text-sm">Date: _______________</p>
              </div>
              <div>
                <h3 className="font-medium mb-4">VENDOR/SUPPLIER</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.vendorName}</p>
                <p className="text-sm">Date: _______________</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <BaseDocumentComponent
      title="Vendor/Supplier Agreement"
      description="Create comprehensive vendor and supplier agreements with detailed terms and conditions"
      documentType="quotation"
      iconColor="text-purple-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}