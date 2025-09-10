'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from '@/components/documents/BaseDocumentComponent';

interface ServiceAgreementData extends Record<string, unknown> {
  // Service Provider Details
  providerName: string;
  providerAddress: string;
  providerEmail: string;
  providerPhone: string;
  providerGST: string;
  
  // Client Details
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  clientGST: string;
  
  // Agreement Details
  agreementDate: string;
  effectiveDate: string;
  expiryDate: string;
  serviceDescription: string;
  scope: string;
  deliverables: string;
  
  // Financial Terms
  totalAmount: number;
  paymentTerms: string;
  paymentSchedule: string;
  currency: string;
  
  // Legal Terms
  terminationClause: string;
  confidentialityClause: string;
  liabilityClause: string;
  disputeResolution: string;
  governingLaw: string;
  
  // Additional Terms
  additionalTerms: string;
  specialConditions: string;
}

const initialData: ServiceAgreementData = {
  providerName: '',
  providerAddress: '',
  providerEmail: '',
  providerPhone: '',
  providerGST: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',
  clientGST: '',
  agreementDate: new Date().toISOString().split('T')[0],
  effectiveDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  serviceDescription: '',
  scope: '',
  deliverables: '',
  totalAmount: 0,
  paymentTerms: '30 days',
  paymentSchedule: 'Monthly',
  currency: 'INR',
  terminationClause: 'Either party may terminate this agreement with 30 days written notice.',
  confidentialityClause: 'Both parties agree to maintain confidentiality of all proprietary information.',
  liabilityClause: 'Service provider liability is limited to the total contract value.',
  disputeResolution: 'Any disputes shall be resolved through arbitration.',
  governingLaw: 'This agreement shall be governed by the laws of India.',
  additionalTerms: '',
  specialConditions: ''
};

export default function ServiceAgreementPage() {
  const [data, setData] = useState<ServiceAgreementData>(initialData);

  const updateField = (field: keyof ServiceAgreementData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Service Provider Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Provider Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Provider Name"
            id="providerName"
            value={data.providerName}
            onChange={(value) => updateField('providerName', value)}
            required
          />
          <FormField
            label="GST Number"
            id="providerGST"
            value={data.providerGST}
            onChange={(value) => updateField('providerGST', value)}
          />
          <FormField
            label="Address"
            id="providerAddress"
            value={data.providerAddress}
            onChange={(value) => updateField('providerAddress', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Email"
              id="providerEmail"
              value={data.providerEmail}
              onChange={(value) => updateField('providerEmail', value)}
              type="email"
            />
            <FormField
              label="Phone"
              id="providerPhone"
              value={data.providerPhone}
              onChange={(value) => updateField('providerPhone', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Details */}
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Client Name"
            id="clientName"
            value={data.clientName}
            onChange={(value) => updateField('clientName', value)}
            required
          />
          <FormField
            label="GST Number"
            id="clientGST"
            value={data.clientGST}
            onChange={(value) => updateField('clientGST', value)}
          />
          <FormField
            label="Address"
            id="clientAddress"
            value={data.clientAddress}
            onChange={(value) => updateField('clientAddress', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Email"
              id="clientEmail"
              value={data.clientEmail}
              onChange={(value) => updateField('clientEmail', value)}
              type="email"
            />
            <FormField
              label="Phone"
              id="clientPhone"
              value={data.clientPhone}
              onChange={(value) => updateField('clientPhone', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="md:col-span-3">
            <FormField
              label="Service Description"
              id="serviceDescription"
              value={data.serviceDescription}
              onChange={(value) => updateField('serviceDescription', value)}
              type="textarea"
              rows={3}
              required
            />
          </div>
          <div className="md:col-span-3">
            <FormField
              label="Scope of Work"
              id="scope"
              value={data.scope}
              onChange={(value) => updateField('scope', value)}
              type="textarea"
              rows={3}
            />
          </div>
          <div className="md:col-span-3">
            <FormField
              label="Deliverables"
              id="deliverables"
              value={data.deliverables}
              onChange={(value) => updateField('deliverables', value)}
              type="textarea"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Terms</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Total Amount"
            id="totalAmount"
            value={data.totalAmount}
            onChange={(value) => updateField('totalAmount', Number(value))}
            type="number"
            required
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
            label="Payment Terms"
            id="paymentTerms"
            value={data.paymentTerms}
            onChange={(value) => updateField('paymentTerms', value)}
            type="select"
            options={[
              { value: '15 days', label: '15 days' },
              { value: '30 days', label: '30 days' },
              { value: '45 days', label: '45 days' },
              { value: '60 days', label: '60 days' }
            ]}
          />
          <FormField
            label="Payment Schedule"
            id="paymentSchedule"
            value={data.paymentSchedule}
            onChange={(value) => updateField('paymentSchedule', value)}
            type="select"
            options={[
              { value: 'Monthly', label: 'Monthly' },
              { value: 'Quarterly', label: 'Quarterly' },
              { value: 'Milestone-based', label: 'Milestone-based' },
              { value: 'Upon completion', label: 'Upon completion' }
            ]}
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
          <h1 className="text-2xl font-bold mb-2">SERVICE AGREEMENT</h1>
          <p className="text-gray-600">Agreement Date: {formatDate(data.agreementDate)}</p>
        </div>

        <div className="space-y-6">
          {/* Parties */}
          <div>
            <h2 className="text-lg font-semibold mb-3">PARTIES TO THE AGREEMENT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">SERVICE PROVIDER:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.providerName}</strong></p>
                  <p>{data.providerAddress}</p>
                  <p>Email: {data.providerEmail}</p>
                  <p>Phone: {data.providerPhone}</p>
                  {data.providerGST && <p>GST: {data.providerGST}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">CLIENT:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.clientName}</strong></p>
                  <p>{data.clientAddress}</p>
                  <p>Email: {data.clientEmail}</p>
                  <p>Phone: {data.clientPhone}</p>
                  {data.clientGST && <p>GST: {data.clientGST}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">AGREEMENT TERMS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
              <div>
                <strong>Total Value:</strong>
                <p>{formatCurrency(data.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Service Description */}
          {data.serviceDescription && (
            <div>
              <h2 className="text-lg font-semibold mb-3">SERVICE DESCRIPTION</h2>
              <p className="text-sm whitespace-pre-wrap">{data.serviceDescription}</p>
            </div>
          )}

          {/* Scope of Work */}
          {data.scope && (
            <div>
              <h2 className="text-lg font-semibold mb-3">SCOPE OF WORK</h2>
              <p className="text-sm whitespace-pre-wrap">{data.scope}</p>
            </div>
          )}

          {/* Deliverables */}
          {data.deliverables && (
            <div>
              <h2 className="text-lg font-semibold mb-3">DELIVERABLES</h2>
              <p className="text-sm whitespace-pre-wrap">{data.deliverables}</p>
            </div>
          )}

          {/* Payment Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">PAYMENT TERMS</h2>
            <div className="text-sm space-y-2">
              <p><strong>Total Amount:</strong> {formatCurrency(data.totalAmount)}</p>
              <p><strong>Payment Terms:</strong> {data.paymentTerms}</p>
              <p><strong>Payment Schedule:</strong> {data.paymentSchedule}</p>
            </div>
          </div>

          {/* Legal Terms */}
          <div>
            <h2 className="text-lg font-semibold mb-3">TERMS AND CONDITIONS</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium">Termination:</h3>
                <p>{data.terminationClause}</p>
              </div>
              <div>
                <h3 className="font-medium">Confidentiality:</h3>
                <p>{data.confidentialityClause}</p>
              </div>
              <div>
                <h3 className="font-medium">Liability:</h3>
                <p>{data.liabilityClause}</p>
              </div>
              <div>
                <h3 className="font-medium">Dispute Resolution:</h3>
                <p>{data.disputeResolution}</p>
              </div>
              <div>
                <h3 className="font-medium">Governing Law:</h3>
                <p>{data.governingLaw}</p>
              </div>
              {data.additionalTerms && (
                <div>
                  <h3 className="font-medium">Additional Terms:</h3>
                  <p className="whitespace-pre-wrap">{data.additionalTerms}</p>
                </div>
              )}
              {data.specialConditions && (
                <div>
                  <h3 className="font-medium">Special Conditions:</h3>
                  <p className="whitespace-pre-wrap">{data.specialConditions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-12 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4">SERVICE PROVIDER</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.providerName}</p>
                <p className="text-sm">Date: _______________</p>
              </div>
              <div>
                <h3 className="font-medium mb-4">CLIENT</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.clientName}</p>
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
      title="Service Agreement"
      description="Create professional service agreements with comprehensive terms and conditions"
      documentType="quotation"
      iconColor="text-blue-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}