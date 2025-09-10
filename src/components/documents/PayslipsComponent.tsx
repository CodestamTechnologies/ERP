'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, FileText } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatCurrency, formatDate } from './BaseDocumentComponent';
import { CompanyInfo, EmployeeInfo, BaseHRDocument, DEFAULT_COMPANY, DEFAULT_EMPLOYEE } from '@/types/hrDocuments';
import { 
  ModernPayslipTemplate, 
  ClassicPayslipTemplate, 
  MinimalPayslipTemplate, 
  CorporatePayslipTemplate,
  payslipTemplateOptions 
} from './templates/PayslipTemplates';

interface EarningsItem {
  id: string;
  description: string;
  amount: number;
  taxable: boolean;
}

interface DeductionItem {
  id: string;
  description: string;
  amount: number;
  statutory: boolean;
}

interface PayslipData extends BaseHRDocument {
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
  otherEarnings: EarningsItem[];
  providentFund: number;
  esi: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: DeductionItem[];
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  remarks: string;
}

const initialData = (): PayslipData => ({
  company: { ...DEFAULT_COMPANY, panNumber: 'ABCDE1234F', pfNumber: 'MH/12345/67890', esiNumber: '12345678901234567' },
  employee: { ...DEFAULT_EMPLOYEE, panNumber: '', pfNumber: '', esiNumber: '', bankAccount: '', bankName: '', ifscCode: '' },
  payPeriod: new Date().toISOString().slice(0, 7),
  payDate: new Date().toISOString().split('T')[0],
  workingDays: 22,
  presentDays: 22,
  leaveDays: 0,
  basicSalary: 0,
  hra: 0,
  conveyanceAllowance: 0,
  medicalAllowance: 0,
  specialAllowance: 0,
  otherEarnings: [],
  providentFund: 0,
  esi: 0,
  professionalTax: 0,
  incomeTax: 0,
  otherDeductions: [],
  grossEarnings: 0,
  totalDeductions: 0,
  netSalary: 0,
  remarks: ''
});

const createNewEarning = (): EarningsItem => ({
  id: `earning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  amount: 0,
  taxable: true
});

const createNewDeduction = (): DeductionItem => ({
  id: `deduction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  amount: 0,
  statutory: false
});

// Reusable Item Components
const EarningCard = ({ earning, index, onUpdate, onRemove }: {
  earning: EarningsItem;
  index: number;
  onUpdate: (field: keyof EarningsItem, value: string | number | boolean) => void;
  onRemove: () => void;
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h5 className="font-medium">Additional Earning {index + 1}</h5>
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FormField label="Description" id={`earning-desc-${earning.id}`} value={earning.description} onChange={(value) => onUpdate('description', value)} required />
      <FormField label="Amount" id={`earning-amount-${earning.id}`} value={earning.amount} onChange={(value) => onUpdate('amount', Number(value))} type="number" required />
      <div className="flex items-center space-x-2 mt-6">
        <input type="checkbox" id={`earning-taxable-${earning.id}`} checked={earning.taxable} onChange={(e) => onUpdate('taxable', e.target.checked)} />
        <Label htmlFor={`earning-taxable-${earning.id}`}>Taxable</Label>
      </div>
    </div>
  </div>
);

const DeductionCard = ({ deduction, index, onUpdate, onRemove }: {
  deduction: DeductionItem;
  index: number;
  onUpdate: (field: keyof DeductionItem, value: string | number | boolean) => void;
  onRemove: () => void;
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h5 className="font-medium">Additional Deduction {index + 1}</h5>
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FormField label="Description" id={`deduction-desc-${deduction.id}`} value={deduction.description} onChange={(value) => onUpdate('description', value)} required />
      <FormField label="Amount" id={`deduction-amount-${deduction.id}`} value={deduction.amount} onChange={(value) => onUpdate('amount', Number(value))} type="number" required />
      <div className="flex items-center space-x-2 mt-6">
        <input type="checkbox" id={`deduction-statutory-${deduction.id}`} checked={deduction.statutory} onChange={(e) => onUpdate('statutory', e.target.checked)} />
        <Label htmlFor={`deduction-statutory-${deduction.id}`}>Statutory</Label>
      </div>
    </div>
  </div>
);

export default function PayslipsComponent() {
  const [data, setData] = useState<PayslipData>(initialData());
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateEmployee = (field: keyof EmployeeInfo, value: string) => {
    setData(prev => ({ ...prev, employee: { ...prev.employee, [field]: value } }));
  };

  const updateField = (field: keyof PayslipData, value: string | number) => {
    setData(prev => {
      const updated = { ...prev, [field]: value };
      return calculateTotals(updated);
    });
  };

  const calculateTotals = (updatedData: PayslipData): PayslipData => {
    const grossEarnings = 
      updatedData.basicSalary + 
      updatedData.hra + 
      updatedData.conveyanceAllowance + 
      updatedData.medicalAllowance + 
      updatedData.specialAllowance + 
      updatedData.otherEarnings.reduce((sum, item) => sum + item.amount, 0);

    const totalDeductions = 
      updatedData.providentFund + 
      updatedData.esi + 
      updatedData.professionalTax + 
      updatedData.incomeTax + 
      updatedData.otherDeductions.reduce((sum, item) => sum + item.amount, 0);

    const netSalary = grossEarnings - totalDeductions;

    return { ...updatedData, grossEarnings, totalDeductions, netSalary };
  };

  const updateEarning = (earningId: string, field: keyof EarningsItem, value: string | number | boolean) => {
    setData(prev => {
      const updatedEarnings = prev.otherEarnings.map(item => 
        item.id === earningId ? { ...item, [field]: value } : item
      );
      const updated = { ...prev, otherEarnings: updatedEarnings };
      return calculateTotals(updated);
    });
  };

  const updateDeduction = (deductionId: string, field: keyof DeductionItem, value: string | number | boolean) => {
    setData(prev => {
      const updatedDeductions = prev.otherDeductions.map(item => 
        item.id === deductionId ? { ...item, [field]: value } : item
      );
      const updated = { ...prev, otherDeductions: updatedDeductions };
      return calculateTotals(updated);
    });
  };

  const addEarning = () => setData(prev => ({ ...prev, otherEarnings: [...prev.otherEarnings, createNewEarning()] }));
  const removeEarning = (earningId: string) => setData(prev => {
    const updatedEarnings = prev.otherEarnings.filter(item => item.id !== earningId);
    const updated = { ...prev, otherEarnings: updatedEarnings };
    return calculateTotals(updated);
  });

  const addDeduction = () => setData(prev => ({ ...prev, otherDeductions: [...prev.otherDeductions, createNewDeduction()] }));
  const removeDeduction = (deductionId: string) => setData(prev => {
    const updatedDeductions = prev.otherDeductions.filter(item => item.id !== deductionId);
    const updated = { ...prev, otherDeductions: updatedDeductions };
    return calculateTotals(updated);
  });

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setCompanyLogo('');
  }, []);

  const renderForm = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo Upload */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              Company Logo
            </Label>
            <div className="flex items-center space-x-4">
              {companyLogo ? (
                <div className="relative">
                  <img 
                    src={companyLogo} 
                    alt="Company Logo" 
                    className="h-20 w-auto object-contain border border-gray-200 rounded-lg"
                    style={{ maxWidth: '150px' }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeLogo}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="h-20 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs rounded-lg">
                  No Logo
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      {companyLogo ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-gray-500">Max 5MB, PNG/JPG/JPEG</p>
              </div>
            </div>
          </div>
          
          {/* Company Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company Name"
            id="company-name"
            value={data.company.name}
            onChange={(value) => updateCompany('name', value)}
            required
          />
          <FormField
          label="PAN Number"
          id="company-pan"
          value={data.company.panNumber || ''}
          onChange={(value) => updateCompany('panNumber', value)}
          />
          <FormField
            label="Address"
            id="company-address"
            value={data.company.address}
            onChange={(value) => updateCompany('address', value)}
            type="textarea"
            rows={2}
          />
          <div className="space-y-4">
            <FormField
              label="Phone"
              id="company-phone"
              value={data.company.phone}
              onChange={(value) => updateCompany('phone', value)}
            />
            <FormField
              label="Email"
              id="company-email"
              value={data.company.email}
              onChange={(value) => updateCompany('email', value)}
              type="email"
            />
          </div>
          <FormField
            label="PF Number"
            id="company-pf"
            value={data.company.pfNumber || ''}
            onChange={(value) => updateCompany('pfNumber', value)}
          />
          <FormField
            label="ESI Number"
            id="company-esi"
            value={data.company.esiNumber || ''}
            onChange={(value) => updateCompany('esiNumber', value)}
          />
          </div>
        </CardContent>
      </Card>

      {/* Employee Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Employee ID"
            id="employee-id"
            value={data.employee.employeeId}
            onChange={(value) => updateEmployee('employeeId', value)}
            required
          />
          <FormField
            label="Employee Name"
            id="employee-name"
            value={data.employee.name}
            onChange={(value) => updateEmployee('name', value)}
            required
          />
          <FormField
            label="Designation"
            id="employee-designation"
            value={data.employee.designation}
            onChange={(value) => updateEmployee('designation', value)}
            required
          />
          <FormField
            label="Department"
            id="employee-department"
            value={data.employee.department}
            onChange={(value) => updateEmployee('department', value)}
            required
          />
          <FormField
            label="Date of Joining"
            id="employee-joining"
            value={data.employee.dateOfJoining}
            onChange={(value) => updateEmployee('dateOfJoining', value)}
            type="date"
            required
          />
          <FormField
            label="PAN Number"
            id="employee-pan"
            value={data.employee.panNumber || ''}
            onChange={(value) => updateEmployee('panNumber', value)}
          />
          <FormField
            label="PF Number"
            id="employee-pf"
            value={data.employee.pfNumber || ''}
            onChange={(value) => updateEmployee('pfNumber', value)}
          />
          <FormField
            label="ESI Number"
            id="employee-esi"
            value={data.employee.esiNumber || ''}
            onChange={(value) => updateEmployee('esiNumber', value)}
          />
          <FormField
            label="Bank Account"
            id="employee-account"
            value={data.employee.bankAccount || ''}
            onChange={(value) => updateEmployee('bankAccount', value)}
          />
          <FormField
            label="Bank Name"
            id="employee-bank"
            value={data.employee.bankName || ''}
            onChange={(value) => updateEmployee('bankName', value)}
          />
          <FormField
            label="IFSC Code"
            id="employee-ifsc"
            value={data.employee.ifscCode || ''}
            onChange={(value) => updateEmployee('ifscCode', value)}
          />
        </CardContent>
      </Card>

      {/* Pay Period Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pay Period Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Pay Period (Month/Year)"
            id="pay-period"
            value={data.payPeriod}
            onChange={(value) => updateField('payPeriod', value)}
            type="date"
            required
          />
          <FormField
            label="Pay Date"
            id="pay-date"
            value={data.payDate}
            onChange={(value) => updateField('payDate', value)}
            type="date"
            required
          />
          <FormField
            label="Working Days"
            id="working-days"
            value={data.workingDays}
            onChange={(value) => updateField('workingDays', Number(value))}
            type="number"
            required
          />
          <FormField
            label="Present Days"
            id="present-days"
            value={data.presentDays}
            onChange={(value) => updateField('presentDays', Number(value))}
            type="number"
            required
          />
          <FormField
            label="Leave Days"
            id="leave-days"
            value={data.leaveDays}
            onChange={(value) => updateField('leaveDays', Number(value))}
            type="number"
          />
        </CardContent>
      </Card>

      {/* Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Basic Salary"
              id="basic-salary"
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
              label="Conveyance Allowance"
              id="conveyance"
              value={data.conveyanceAllowance}
              onChange={(value) => updateField('conveyanceAllowance', Number(value))}
              type="number"
            />
            <FormField
              label="Medical Allowance"
              id="medical"
              value={data.medicalAllowance}
              onChange={(value) => updateField('medicalAllowance', Number(value))}
              type="number"
            />
            <FormField
              label="Special Allowance"
              id="special"
              value={data.specialAllowance}
              onChange={(value) => updateField('specialAllowance', Number(value))}
              type="number"
            />
          </div>

          {/* Other Earnings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Other Earnings</h4>
              <Button onClick={addEarning} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Earning
              </Button>
            </div>
            {data.otherEarnings.map((earning, index) => (
              <div key={earning.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-medium">Additional Earning {index + 1}</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEarning(earning.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    label="Description"
                    id={`earning-desc-${earning.id}`}
                    value={earning.description}
                    onChange={(value) => updateEarning(earning.id, 'description', value)}
                    required
                  />
                  <FormField
                    label="Amount"
                    id={`earning-amount-${earning.id}`}
                    value={earning.amount}
                    onChange={(value) => updateEarning(earning.id, 'amount', Number(value))}
                    type="number"
                    required
                  />
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id={`earning-taxable-${earning.id}`}
                      checked={earning.taxable}
                      onChange={(e) => updateEarning(earning.id, 'taxable', e.target.checked)}
                    />
                    <Label htmlFor={`earning-taxable-${earning.id}`}>Taxable</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader>
          <CardTitle>Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Provident Fund"
              id="pf"
              value={data.providentFund}
              onChange={(value) => updateField('providentFund', Number(value))}
              type="number"
            />
            <FormField
              label="ESI"
              id="esi"
              value={data.esi}
              onChange={(value) => updateField('esi', Number(value))}
              type="number"
            />
            <FormField
              label="Professional Tax"
              id="professional-tax"
              value={data.professionalTax}
              onChange={(value) => updateField('professionalTax', Number(value))}
              type="number"
            />
            <FormField
              label="Income Tax"
              id="income-tax"
              value={data.incomeTax}
              onChange={(value) => updateField('incomeTax', Number(value))}
              type="number"
            />
          </div>

          {/* Other Deductions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Other Deductions</h4>
              <Button onClick={addDeduction} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Deduction
              </Button>
            </div>
            {data.otherDeductions.map((deduction, index) => (
              <div key={deduction.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-medium">Additional Deduction {index + 1}</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDeduction(deduction.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    label="Description"
                    id={`deduction-desc-${deduction.id}`}
                    value={deduction.description}
                    onChange={(value) => updateDeduction(deduction.id, 'description', value)}
                    required
                  />
                  <FormField
                    label="Amount"
                    id={`deduction-amount-${deduction.id}`}
                    value={deduction.amount}
                    onChange={(value) => updateDeduction(deduction.id, 'amount', Number(value))}
                    type="number"
                    required
                  />
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id={`deduction-statutory-${deduction.id}`}
                      checked={deduction.statutory}
                      onChange={(e) => updateDeduction(deduction.id, 'statutory', e.target.checked)}
                    />
                    <Label htmlFor={`deduction-statutory-${deduction.id}`}>Statutory</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-green-800">Gross Earnings</Label>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(data.grossEarnings)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-red-800">Total Deductions</Label>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(data.totalDeductions)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-blue-800">Net Salary</Label>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(data.netSalary)}</p>
            </div>
          </div>
          <FormField
            label="Remarks"
            id="remarks"
            value={data.remarks}
            onChange={(value) => updateField('remarks', value)}
            type="textarea"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplate = () => {
    const templateProps = {
      data,
      companyLogo,
      formatCurrency: (amount: string | number, currency: string) => formatCurrency(Number(amount)),
      formatDate
    };

    switch (selectedTemplate) {
      case 'classic':
        return <ClassicPayslipTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalPayslipTemplate {...templateProps} />;
      case 'corporate':
        return <CorporatePayslipTemplate {...templateProps} />;
      default:
        return <ModernPayslipTemplate {...templateProps} />;
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Template:</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {payslipTemplateOptions.map(template => (
                  <SelectItem key={template.value} value={template.value}>
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {renderTemplate()}
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Payslip Generator"
      description="Generate detailed payslips and salary registers for employees"
      documentType="quotation"
      iconColor="text-green-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}