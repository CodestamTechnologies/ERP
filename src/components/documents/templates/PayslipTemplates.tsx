'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PayslipData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    panNumber?: string;
    pfNumber?: string;
    esiNumber?: string;
  };
  employee: {
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    dateOfJoining: string;
    panNumber?: string;
    pfNumber?: string;
    esiNumber?: string;
    bankAccount?: string;
    bankName?: string;
    ifscCode?: string;
  };
  payPeriod: string;
  payDate: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherEarnings: Array<{
    id: string;
    description: string;
    amount: number;
    taxable: boolean;
  }>;
  providentFund: number;
  esi: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: Array<{
    id: string;
    description: string;
    amount: number;
    statutory: boolean;
  }>;
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  remarks: string;
}

interface TemplateProps {
  data: PayslipData;
  companyLogo: string;
  formatCurrency: (amount: string | number, currency: string) => string;
  formatDate: (dateString: string) => string;
}

export const ModernPayslipTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatCurrency,
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-600">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">PAYSLIP</h1>
          <h2 className="text-xl font-semibold text-gray-800">{data.company.name}</h2>
          <p className="text-gray-600">{data.company.address}</p>
          <p className="text-gray-600">Phone: {data.company.phone} | Email: {data.company.email}</p>
        </div>
        {companyLogo && (
          <div className="flex-shrink-0 ml-6">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-20 w-auto object-contain"
              style={{ maxWidth: '150px' }}
            />
          </div>
        )}
      </div>

      {/* Pay Period Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Employee Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Employee ID:</span>
              <span>{data.employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{data.employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Designation:</span>
              <span>{data.employee.designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Department:</span>
              <span>{data.employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of Joining:</span>
              <span>{formatDate(data.employee.dateOfJoining)}</span>
            </div>
            {data.employee.panNumber && (
              <div className="flex justify-between">
                <span className="font-medium">PAN:</span>
                <span>{data.employee.panNumber}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Pay Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Pay Period:</span>
              <span>{new Date(data.payPeriod).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Pay Date:</span>
              <span>{formatDate(data.payDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Working Days:</span>
              <span>{data.workingDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Present Days:</span>
              <span>{data.presentDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Leave Days:</span>
              <span>{data.leaveDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Earnings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-green-50 p-2 rounded">Earnings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.basicSalary > 0 && (
                <tr className="border-b">
                  <td className="py-2">Basic Salary</td>
                  <td className="text-right py-2">{formatCurrency(data.basicSalary, 'INR')}</td>
                </tr>
              )}
              {data.hra > 0 && (
                <tr className="border-b">
                  <td className="py-2">HRA</td>
                  <td className="text-right py-2">{formatCurrency(data.hra, 'INR')}</td>
                </tr>
              )}
              {data.conveyanceAllowance > 0 && (
                <tr className="border-b">
                  <td className="py-2">Conveyance Allowance</td>
                  <td className="text-right py-2">{formatCurrency(data.conveyanceAllowance, 'INR')}</td>
                </tr>
              )}
              {data.medicalAllowance > 0 && (
                <tr className="border-b">
                  <td className="py-2">Medical Allowance</td>
                  <td className="text-right py-2">{formatCurrency(data.medicalAllowance, 'INR')}</td>
                </tr>
              )}
              {data.specialAllowance > 0 && (
                <tr className="border-b">
                  <td className="py-2">Special Allowance</td>
                  <td className="text-right py-2">{formatCurrency(data.specialAllowance, 'INR')}</td>
                </tr>
              )}
              {data.otherEarnings.map(earning => (
                <tr key={earning.id} className="border-b">
                  <td className="py-2">{earning.description}</td>
                  <td className="text-right py-2">{formatCurrency(earning.amount, 'INR')}</td>
                </tr>
              ))}
              <tr className="border-t-2 font-bold bg-green-50">
                <td className="py-2">Total Earnings</td>
                <td className="text-right py-2">{formatCurrency(data.grossEarnings, 'INR')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-red-50 p-2 rounded">Deductions</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.providentFund > 0 && (
                <tr className="border-b">
                  <td className="py-2">Provident Fund</td>
                  <td className="text-right py-2">{formatCurrency(data.providentFund, 'INR')}</td>
                </tr>
              )}
              {data.esi > 0 && (
                <tr className="border-b">
                  <td className="py-2">ESI</td>
                  <td className="text-right py-2">{formatCurrency(data.esi, 'INR')}</td>
                </tr>
              )}
              {data.professionalTax > 0 && (
                <tr className="border-b">
                  <td className="py-2">Professional Tax</td>
                  <td className="text-right py-2">{formatCurrency(data.professionalTax, 'INR')}</td>
                </tr>
              )}
              {data.incomeTax > 0 && (
                <tr className="border-b">
                  <td className="py-2">Income Tax</td>
                  <td className="text-right py-2">{formatCurrency(data.incomeTax, 'INR')}</td>
                </tr>
              )}
              {data.otherDeductions.map(deduction => (
                <tr key={deduction.id} className="border-b">
                  <td className="py-2">{deduction.description}</td>
                  <td className="text-right py-2">{formatCurrency(deduction.amount, 'INR')}</td>
                </tr>
              ))}
              <tr className="border-t-2 font-bold bg-red-50">
                <td className="py-2">Total Deductions</td>
                <td className="text-right py-2">{formatCurrency(data.totalDeductions, 'INR')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Salary */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-800">Net Salary</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.netSalary, 'INR')}</p>
        </div>
        <p className="text-sm text-blue-700 mt-2">
          Net Salary = Gross Earnings - Total Deductions
        </p>
      </div>

      {/* Bank Details */}
      {data.employee.bankAccount && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bank Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Bank Name:</span>
                <p>{data.employee.bankName}</p>
              </div>
              <div>
                <span className="font-medium">Account Number:</span>
                <p>{data.employee.bankAccount}</p>
              </div>
              <div>
                <span className="font-medium">IFSC Code:</span>
                <p>{data.employee.ifscCode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remarks */}
      {data.remarks && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Remarks</h3>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{data.remarks}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t">
        <p>This is a computer-generated payslip and does not require a signature.</p>
        <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
      </div>
    </CardContent>
  </Card>
);

export const ClassicPayslipTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatCurrency,
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Classic Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <div className="mb-4">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-16 w-auto object-contain mx-auto"
              style={{ maxWidth: '120px' }}
            />
          ) : (
            <div className="h-16 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mx-auto">
              Company Logo
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
          {data.company.name}
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">SALARY SLIP</h2>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.company.address}<br />
          Phone: {data.company.phone} | Email: {data.company.email}
        </div>
      </div>

      {/* Employee Details Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold w-1/4">Employee Name</td>
              <td className="border border-gray-400 p-3 w-1/4">{data.employee.name}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold w-1/4">Employee ID</td>
              <td className="border border-gray-400 p-3 w-1/4">{data.employee.employeeId}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Designation</td>
              <td className="border border-gray-400 p-3">{data.employee.designation}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Department</td>
              <td className="border border-gray-400 p-3">{data.employee.department}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Pay Period</td>
              <td className="border border-gray-400 p-3">{new Date(data.payPeriod).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Pay Date</td>
              <td className="border border-gray-400 p-3">{formatDate(data.payDate)}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Working Days</td>
              <td className="border border-gray-400 p-3">{data.workingDays}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Present Days</td>
              <td className="border border-gray-400 p-3">{data.presentDays}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Earnings and Deductions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Earnings Table */}
        <div>
          <h3 className="text-lg font-bold text-center bg-green-100 p-2 border border-gray-400">EARNINGS</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">Description</th>
                <th className="border border-gray-400 p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.basicSalary > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Basic Salary</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.basicSalary, 'INR')}</td>
                </tr>
              )}
              {data.hra > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">HRA</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.hra, 'INR')}</td>
                </tr>
              )}
              {data.conveyanceAllowance > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Conveyance</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.conveyanceAllowance, 'INR')}</td>
                </tr>
              )}
              {data.medicalAllowance > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Medical</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.medicalAllowance, 'INR')}</td>
                </tr>
              )}
              {data.specialAllowance > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Special Allowance</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.specialAllowance, 'INR')}</td>
                </tr>
              )}
              {data.otherEarnings.map(earning => (
                <tr key={earning.id}>
                  <td className="border border-gray-400 p-2">{earning.description}</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(earning.amount, 'INR')}</td>
                </tr>
              ))}
              <tr className="bg-green-100 font-bold">
                <td className="border border-gray-400 p-2">TOTAL EARNINGS</td>
                <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.grossEarnings, 'INR')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Table */}
        <div>
          <h3 className="text-lg font-bold text-center bg-red-100 p-2 border border-gray-400">DEDUCTIONS</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 text-left">Description</th>
                <th className="border border-gray-400 p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.providentFund > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Provident Fund</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.providentFund, 'INR')}</td>
                </tr>
              )}
              {data.esi > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">ESI</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.esi, 'INR')}</td>
                </tr>
              )}
              {data.professionalTax > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Professional Tax</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.professionalTax, 'INR')}</td>
                </tr>
              )}
              {data.incomeTax > 0 && (
                <tr>
                  <td className="border border-gray-400 p-2">Income Tax</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.incomeTax, 'INR')}</td>
                </tr>
              )}
              {data.otherDeductions.map(deduction => (
                <tr key={deduction.id}>
                  <td className="border border-gray-400 p-2">{deduction.description}</td>
                  <td className="border border-gray-400 p-2 text-right">{formatCurrency(deduction.amount, 'INR')}</td>
                </tr>
              ))}
              <tr className="bg-red-100 font-bold">
                <td className="border border-gray-400 p-2">TOTAL DEDUCTIONS</td>
                <td className="border border-gray-400 p-2 text-right">{formatCurrency(data.totalDeductions, 'INR')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Salary */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr className="bg-blue-100">
              <td className="border border-gray-400 p-4 text-xl font-bold text-center">NET SALARY</td>
              <td className="border border-gray-400 p-4 text-xl font-bold text-center">{formatCurrency(data.netSalary, 'INR')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t-2 border-gray-800">
        <p className="italic">This is a computer-generated payslip and does not require a signature.</p>
        <p className="mt-2">© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
      </div>
    </CardContent>
  </Card>
);

export const MinimalPayslipTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatCurrency,
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-12" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Minimal Header */}
      <div className="flex justify-between items-center mb-12 pb-4 border-b border-gray-200">
        <div>
          <div className="mb-4">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-12 w-auto object-contain"
                style={{ maxWidth: '120px' }}
              />
            ) : (
              <div className="h-12 w-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                Logo
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{data.company.name}</h1>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-gray-900">Payslip</h2>
          <div className="text-sm text-gray-600">{formatDate(data.payDate)}</div>
        </div>
      </div>

      {/* Employee Info */}
      <div className="mb-8">
        <div className="font-semibold text-gray-900">{data.employee.name}</div>
        <div className="text-sm text-gray-600">{data.employee.employeeId} | {data.employee.designation}</div>
        <div className="text-sm text-gray-600">{new Date(data.payPeriod).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
      </div>

      {/* Simple Earnings and Deductions */}
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Earnings</h3>
          <div className="space-y-2 text-sm">
            {data.basicSalary > 0 && (
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span>{formatCurrency(data.basicSalary, 'INR')}</span>
              </div>
            )}
            {data.hra > 0 && (
              <div className="flex justify-between">
                <span>HRA</span>
                <span>{formatCurrency(data.hra, 'INR')}</span>
              </div>
            )}
            {data.conveyanceAllowance > 0 && (
              <div className="flex justify-between">
                <span>Conveyance</span>
                <span>{formatCurrency(data.conveyanceAllowance, 'INR')}</span>
              </div>
            )}
            {data.otherEarnings.map(earning => (
              <div key={earning.id} className="flex justify-between">
                <span>{earning.description}</span>
                <span>{formatCurrency(earning.amount, 'INR')}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total Earnings</span>
              <span>{formatCurrency(data.grossEarnings, 'INR')}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Deductions</h3>
          <div className="space-y-2 text-sm">
            {data.providentFund > 0 && (
              <div className="flex justify-between">
                <span>PF</span>
                <span>{formatCurrency(data.providentFund, 'INR')}</span>
              </div>
            )}
            {data.esi > 0 && (
              <div className="flex justify-between">
                <span>ESI</span>
                <span>{formatCurrency(data.esi, 'INR')}</span>
              </div>
            )}
            {data.professionalTax > 0 && (
              <div className="flex justify-between">
                <span>Professional Tax</span>
                <span>{formatCurrency(data.professionalTax, 'INR')}</span>
              </div>
            )}
            {data.otherDeductions.map(deduction => (
              <div key={deduction.id} className="flex justify-between">
                <span>{deduction.description}</span>
                <span>{formatCurrency(deduction.amount, 'INR')}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total Deductions</span>
              <span>{formatCurrency(data.totalDeductions, 'INR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="bg-gray-100 p-4 rounded mb-8">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Net Salary</span>
          <span className="text-2xl font-bold">{formatCurrency(data.netSalary, 'INR')}</span>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center text-xs text-gray-500 pt-6 border-t">
        <p>Computer generated payslip</p>
      </div>
    </CardContent>
  </Card>
);

export const CorporatePayslipTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatCurrency,
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* Corporate Header */}
      <div className="bg-gray-900 text-white p-6 -m-8 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-6">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="h-16 w-auto object-contain bg-white p-2 rounded"
                  style={{ maxWidth: '120px' }}
                />
              ) : (
                <div className="h-16 w-24 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs rounded">
                  Logo
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{data.company.name}</h1>
              <div className="text-gray-300 text-sm">Payroll Department</div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-300">
            <div>PAYSLIP</div>
            <div className="font-semibold text-white">{formatDate(data.payDate)}</div>
          </div>
        </div>
      </div>

      {/* Reference Number */}
      <div className="mb-6 text-right">
        <div className="text-sm text-gray-600">
          <strong>Ref:</strong> PAY/{new Date().getFullYear()}/{data.employee.employeeId}
        </div>
      </div>

      {/* Employee Details */}
      <div className="mb-8 bg-gray-50 p-6 rounded">
        <h3 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">EMPLOYEE DETAILS</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {data.employee.name}</div>
          <div><strong>Employee ID:</strong> {data.employee.employeeId}</div>
          <div><strong>Designation:</strong> {data.employee.designation}</div>
          <div><strong>Department:</strong> {data.employee.department}</div>
          <div><strong>Pay Period:</strong> {new Date(data.payPeriod).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
          <div><strong>Working Days:</strong> {data.workingDays} / Present: {data.presentDays}</div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">SALARY BREAKDOWN</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Component</th>
              <th className="border border-gray-300 p-3 text-right">Earnings</th>
              <th className="border border-gray-300 p-3 text-right">Deductions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">Basic Salary</td>
              <td className="border border-gray-300 p-3 text-right">{data.basicSalary > 0 ? formatCurrency(data.basicSalary, 'INR') : '-'}</td>
              <td className="border border-gray-300 p-3 text-right">-</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">HRA</td>
              <td className="border border-gray-300 p-3 text-right">{data.hra > 0 ? formatCurrency(data.hra, 'INR') : '-'}</td>
              <td className="border border-gray-300 p-3 text-right">-</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Conveyance</td>
              <td className="border border-gray-300 p-3 text-right">{data.conveyanceAllowance > 0 ? formatCurrency(data.conveyanceAllowance, 'INR') : '-'}</td>
              <td className="border border-gray-300 p-3 text-right">-</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Provident Fund</td>
              <td className="border border-gray-300 p-3 text-right">-</td>
              <td className="border border-gray-300 p-3 text-right">{data.providentFund > 0 ? formatCurrency(data.providentFund, 'INR') : '-'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Professional Tax</td>
              <td className="border border-gray-300 p-3 text-right">-</td>
              <td className="border border-gray-300 p-3 text-right">{data.professionalTax > 0 ? formatCurrency(data.professionalTax, 'INR') : '-'}</td>
            </tr>
            {data.otherEarnings.map(earning => (
              <tr key={earning.id}>
                <td className="border border-gray-300 p-3">{earning.description}</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(earning.amount, 'INR')}</td>
                <td className="border border-gray-300 p-3 text-right">-</td>
              </tr>
            ))}
            {data.otherDeductions.map(deduction => (
              <tr key={deduction.id}>
                <td className="border border-gray-300 p-3">{deduction.description}</td>
                <td className="border border-gray-300 p-3 text-right">-</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(deduction.amount, 'INR')}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 p-3">TOTAL</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(data.grossEarnings, 'INR')}</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(data.totalDeductions, 'INR')}</td>
            </tr>
            <tr className="bg-blue-100 font-bold text-lg">
              <td className="border border-gray-300 p-3">NET SALARY</td>
              <td className="border border-gray-300 p-3 text-right" colSpan={2}>{formatCurrency(data.netSalary, 'INR')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Corporate Footer */}
      <div className="mt-8 pt-6 border-t border-gray-300 bg-gray-50 -mx-8 px-8 py-6">
        <div className="text-center text-xs text-gray-500">
          <p><strong>{data.company.name}</strong></p>
          <p>{data.company.address}</p>
          <p className="mt-2">This is a system-generated payslip. Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const payslipTemplateOptions = [
  { value: 'modern', label: 'Modern Professional', description: 'Clean layout with logo and structured sections' },
  { value: 'classic', label: 'Classic Business', description: 'Traditional table-based format with formal styling' },
  { value: 'minimal', label: 'Minimal Clean', description: 'Simple, clean design with minimal styling' },
  { value: 'corporate', label: 'Corporate Standard', description: 'Professional corporate format with detailed breakdown' }
];