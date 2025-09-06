'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from '@/components/documents/BaseDocumentComponent';

interface EmploymentContractData extends Record<string, unknown> {
  // Company Details
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyGST: string;
  
  // Employee Details
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  employeePhone: string;
  employeePAN: string;
  employeeAadhar: string;
  
  // Employment Details
  contractDate: string;
  startDate: string;
  endDate: string;
  jobTitle: string;
  department: string;
  reportingManager: string;
  employmentType: string;
  probationPeriod: string;
  
  // Compensation
  basicSalary: number;
  hra: number;
  allowances: number;
  totalSalary: number;
  paymentFrequency: string;
  currency: string;
  
  // Benefits
  medicalInsurance: string;
  pf: string;
  gratuity: string;
  leaveEntitlement: string;
  otherBenefits: string;
  
  // Terms & Conditions
  workingHours: string;
  workLocation: string;
  confidentialityClause: string;
  terminationClause: string;
  noticePeriod: string;
  nonCompeteClause: string;
  
  // Additional Terms
  additionalTerms: string;
  specialConditions: string;
}

const initialData: EmploymentContractData = {
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyGST: '',
  employeeName: '',
  employeeAddress: '',
  employeeEmail: '',
  employeePhone: '',
  employeePAN: '',
  employeeAadhar: '',
  contractDate: new Date().toISOString().split('T')[0],
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  jobTitle: '',
  department: '',
  reportingManager: '',
  employmentType: 'Full-time',
  probationPeriod: '6 months',
  basicSalary: 0,
  hra: 0,
  allowances: 0,
  totalSalary: 0,
  paymentFrequency: 'Monthly',
  currency: 'INR',
  medicalInsurance: 'Provided by company',
  pf: 'As per company policy',
  gratuity: 'As per Gratuity Act',
  leaveEntitlement: '21 days annual leave',
  otherBenefits: '',
  workingHours: '9 hours per day, 5 days a week',
  workLocation: '',
  confidentialityClause: 'Employee agrees to maintain confidentiality of all company information.',
  terminationClause: 'Employment may be terminated by either party with appropriate notice.',
  noticePeriod: '30 days',
  nonCompeteClause: 'Employee agrees not to work with competitors for 6 months after termination.',
  additionalTerms: '',
  specialConditions: ''
};

export default function EmploymentContractPage() {
  const [data, setData] = useState<EmploymentContractData>(initialData);

  const updateField = (field: keyof EmploymentContractData, value: string | number) => {
    setData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate total salary
      if (['basicSalary', 'hra', 'allowances'].includes(field as string)) {
        updated.totalSalary = updated.basicSalary + updated.hra + updated.allowances;
      }
      return updated;
    });
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
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

      {/* Employee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Employee Name"
            id="employeeName"
            value={data.employeeName}
            onChange={(value) => updateField('employeeName', value)}
            required
          />
          <FormField
            label="PAN Number"
            id="employeePAN"
            value={data.employeePAN}
            onChange={(value) => updateField('employeePAN', value)}
          />
          <FormField
            label="Address"
            id="employeeAddress"
            value={data.employeeAddress}
            onChange={(value) => updateField('employeeAddress', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Email"
              id="employeeEmail"
              value={data.employeeEmail}
              onChange={(value) => updateField('employeeEmail', value)}
              type="email"
            />
            <FormField
              label="Phone"
              id="employeePhone"
              value={data.employeePhone}
              onChange={(value) => updateField('employeePhone', value)}
            />
            <FormField
              label="Aadhar Number"
              id="employeeAadhar"
              value={data.employeeAadhar}
              onChange={(value) => updateField('employeeAadhar', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Contract Date"
            id="contractDate"
            value={data.contractDate}
            onChange={(value) => updateField('contractDate', value)}
            type="date"
            required
          />
          <FormField
            label="Start Date"
            id="startDate"
            value={data.startDate}
            onChange={(value) => updateField('startDate', value)}
            type="date"
            required
          />
          <FormField
            label="End Date (if fixed term)"
            id="endDate"
            value={data.endDate}
            onChange={(value) => updateField('endDate', value)}
            type="date"
          />
          <FormField
            label="Job Title"
            id="jobTitle"
            value={data.jobTitle}
            onChange={(value) => updateField('jobTitle', value)}
            required
          />
          <FormField
            label="Department"
            id="department"
            value={data.department}
            onChange={(value) => updateField('department', value)}
          />
          <FormField
            label="Reporting Manager"
            id="reportingManager"
            value={data.reportingManager}
            onChange={(value) => updateField('reportingManager', value)}
          />
          <FormField
            label="Employment Type"
            id="employmentType"
            value={data.employmentType}
            onChange={(value) => updateField('employmentType', value)}
            type="select"
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Temporary', label: 'Temporary' }
            ]}
          />
          <FormField
            label="Probation Period"
            id="probationPeriod"
            value={data.probationPeriod}
            onChange={(value) => updateField('probationPeriod', value)}
            type="select"
            options={[
              { value: '3 months', label: '3 months' },
              { value: '6 months', label: '6 months' },
              { value: '12 months', label: '12 months' }
            ]}
          />
        </CardContent>
      </Card>

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle>Compensation Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Basic Salary"
            id="basicSalary"
            value={data.basicSalary}
            onChange={(value) => updateField('basicSalary', Number(value))}
            type="number"
            required
          />
          <FormField
            label="HRA"
            id="hra"
            value={data.hra}
            onChange={(value) => updateField('hra', Number(value))}
            type="number"
          />
          <FormField
            label="Other Allowances"
            id="allowances"
            value={data.allowances}
            onChange={(value) => updateField('allowances', Number(value))}
            type="number"
          />
          <FormField
            label="Total Salary"
            id="totalSalary"
            value={data.totalSalary}
            onChange={() => {}} // Read-only, calculated automatically
            type="number"
          />
          <FormField
            label="Payment Frequency"
            id="paymentFrequency"
            value={data.paymentFrequency}
            onChange={(value) => updateField('paymentFrequency', value)}
            type="select"
            options={[
              { value: 'Monthly', label: 'Monthly' },
              { value: 'Bi-weekly', label: 'Bi-weekly' },
              { value: 'Weekly', label: 'Weekly' }
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
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits & Perks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Medical Insurance"
            id="medicalInsurance"
            value={data.medicalInsurance}
            onChange={(value) => updateField('medicalInsurance', value)}
          />
          <FormField
            label="Provident Fund"
            id="pf"
            value={data.pf}
            onChange={(value) => updateField('pf', value)}
          />
          <FormField
            label="Gratuity"
            id="gratuity"
            value={data.gratuity}
            onChange={(value) => updateField('gratuity', value)}
          />
          <FormField
            label="Leave Entitlement"
            id="leaveEntitlement"
            value={data.leaveEntitlement}
            onChange={(value) => updateField('leaveEntitlement', value)}
          />
          <FormField
            label="Other Benefits"
            id="otherBenefits"
            value={data.otherBenefits}
            onChange={(value) => updateField('otherBenefits', value)}
            type="textarea"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Working Hours"
            id="workingHours"
            value={data.workingHours}
            onChange={(value) => updateField('workingHours', value)}
          />
          <FormField
            label="Work Location"
            id="workLocation"
            value={data.workLocation}
            onChange={(value) => updateField('workLocation', value)}
          />
          <FormField
            label="Notice Period"
            id="noticePeriod"
            value={data.noticePeriod}
            onChange={(value) => updateField('noticePeriod', value)}
            type="select"
            options={[
              { value: '15 days', label: '15 days' },
              { value: '30 days', label: '30 days' },
              { value: '60 days', label: '60 days' },
              { value: '90 days', label: '90 days' }
            ]}
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
            label="Termination Clause"
            id="terminationClause"
            value={data.terminationClause}
            onChange={(value) => updateField('terminationClause', value)}
            type="textarea"
            rows={2}
          />
          <FormField
            label="Non-Compete Clause"
            id="nonCompeteClause"
            value={data.nonCompeteClause}
            onChange={(value) => updateField('nonCompeteClause', value)}
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
          <h1 className="text-2xl font-bold mb-2">EMPLOYMENT CONTRACT</h1>
          <p className="text-gray-600">Contract Date: {formatDate(data.contractDate)}</p>
        </div>

        <div className="space-y-6">
          {/* Parties */}
          <div>
            <h2 className="text-lg font-semibold mb-3">PARTIES TO THE CONTRACT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">EMPLOYER:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.companyName}</strong></p>
                  <p>{data.companyAddress}</p>
                  <p>Email: {data.companyEmail}</p>
                  <p>Phone: {data.companyPhone}</p>
                  {data.companyGST && <p>GST: {data.companyGST}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">EMPLOYEE:</h3>
                <div className="text-sm space-y-1">
                  <p><strong>{data.employeeName}</strong></p>
                  <p>{data.employeeAddress}</p>
                  <p>Email: {data.employeeEmail}</p>
                  <p>Phone: {data.employeePhone}</p>
                  {data.employeePAN && <p>PAN: {data.employeePAN}</p>}
                  {data.employeeAadhar && <p>Aadhar: {data.employeeAadhar}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h2 className="text-lg font-semibold mb-3">EMPLOYMENT DETAILS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Job Title:</strong>
                <p>{data.jobTitle}</p>
              </div>
              <div>
                <strong>Department:</strong>
                <p>{data.department}</p>
              </div>
              <div>
                <strong>Employment Type:</strong>
                <p>{data.employmentType}</p>
              </div>
              <div>
                <strong>Start Date:</strong>
                <p>{formatDate(data.startDate)}</p>
              </div>
              {data.endDate && (
                <div>
                  <strong>End Date:</strong>
                  <p>{formatDate(data.endDate)}</p>
                </div>
              )}
              <div>
                <strong>Probation Period:</strong>
                <p>{data.probationPeriod}</p>
              </div>
              {data.reportingManager && (
                <div>
                  <strong>Reporting Manager:</strong>
                  <p>{data.reportingManager}</p>
                </div>
              )}
              {data.workLocation && (
                <div>
                  <strong>Work Location:</strong>
                  <p>{data.workLocation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h2 className="text-lg font-semibold mb-3">COMPENSATION & BENEFITS</h2>
            <div className="text-sm space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Basic Salary:</strong> {formatCurrency(data.basicSalary)}</p>
                  <p><strong>HRA:</strong> {formatCurrency(data.hra)}</p>
                  <p><strong>Other Allowances:</strong> {formatCurrency(data.allowances)}</p>
                  <p><strong>Total Salary:</strong> {formatCurrency(data.totalSalary)} ({data.paymentFrequency})</p>
                </div>
                <div>
                  <p><strong>Medical Insurance:</strong> {data.medicalInsurance}</p>
                  <p><strong>Provident Fund:</strong> {data.pf}</p>
                  <p><strong>Gratuity:</strong> {data.gratuity}</p>
                  <p><strong>Leave Entitlement:</strong> {data.leaveEntitlement}</p>
                </div>
              </div>
              {data.otherBenefits && (
                <div>
                  <strong>Other Benefits:</strong>
                  <p className="whitespace-pre-wrap">{data.otherBenefits}</p>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h2 className="text-lg font-semibold mb-3">TERMS AND CONDITIONS</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium">Working Hours:</h3>
                <p>{data.workingHours}</p>
              </div>
              <div>
                <h3 className="font-medium">Notice Period:</h3>
                <p>{data.noticePeriod}</p>
              </div>
              <div>
                <h3 className="font-medium">Confidentiality:</h3>
                <p>{data.confidentialityClause}</p>
              </div>
              <div>
                <h3 className="font-medium">Termination:</h3>
                <p>{data.terminationClause}</p>
              </div>
              <div>
                <h3 className="font-medium">Non-Compete:</h3>
                <p>{data.nonCompeteClause}</p>
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
                <h3 className="font-medium mb-4">EMPLOYER</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.companyName}</p>
                <p className="text-sm">Date: _______________</p>
              </div>
              <div>
                <h3 className="font-medium mb-4">EMPLOYEE</h3>
                <div className="border-b border-gray-300 mb-2 h-12"></div>
                <p className="text-sm">Signature</p>
                <p className="text-sm mt-2">Name: {data.employeeName}</p>
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
      title="Employment Contract"
      description="Create comprehensive employment contracts with detailed terms and conditions"
      documentType="quotation"
      iconColor="text-green-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}