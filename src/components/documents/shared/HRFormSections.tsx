import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '../BaseDocumentComponent';
import { CompanyInfo, EmployeeInfo } from '@/types/hrDocuments';

interface CompanyFormSectionProps {
  data: CompanyInfo;
  onUpdate: (field: keyof CompanyInfo, value: string) => void;
  showAdditionalFields?: boolean;
}

export const CompanyFormSection = ({ data, onUpdate, showAdditionalFields = false }: CompanyFormSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Company Information</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Company Name"
        id="company-name"
        value={data.name}
        onChange={(value) => onUpdate('name', value)}
        required
      />
      <FormField
        label="Phone"
        id="company-phone"
        value={data.phone}
        onChange={(value) => onUpdate('phone', value)}
      />
      <FormField
        label="Address"
        id="company-address"
        value={data.address}
        onChange={(value) => onUpdate('address', value)}
        type="textarea"
        rows={2}
      />
      <FormField
        label="Email"
        id="company-email"
        value={data.email}
        onChange={(value) => onUpdate('email', value)}
        type="email"
      />
      {showAdditionalFields && (
        <>
          <FormField
            label="PAN Number"
            id="company-pan"
            value={data.panNumber || ''}
            onChange={(value) => onUpdate('panNumber', value)}
          />
          <FormField
            label="Website"
            id="company-website"
            value={data.website || ''}
            onChange={(value) => onUpdate('website', value)}
          />
          {data.pfNumber !== undefined && (
            <FormField
              label="PF Number"
              id="company-pf"
              value={data.pfNumber}
              onChange={(value) => onUpdate('pfNumber', value)}
            />
          )}
          {data.esiNumber !== undefined && (
            <FormField
              label="ESI Number"
              id="company-esi"
              value={data.esiNumber}
              onChange={(value) => onUpdate('esiNumber', value)}
            />
          )}
        </>
      )}
    </CardContent>
  </Card>
);

interface EmployeeFormSectionProps {
  data: EmployeeInfo;
  onUpdate: (field: keyof EmployeeInfo, value: string) => void;
  showBankDetails?: boolean;
  showStatutoryDetails?: boolean;
}

export const EmployeeFormSection = ({ 
  data, 
  onUpdate, 
  showBankDetails = false, 
  showStatutoryDetails = false 
}: EmployeeFormSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Employee Information</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Employee ID"
        id="employee-id"
        value={data.employeeId}
        onChange={(value) => onUpdate('employeeId', value)}
        required
      />
      <FormField
        label="Employee Name"
        id="employee-name"
        value={data.name}
        onChange={(value) => onUpdate('name', value)}
        required
      />
      <FormField
        label="Designation"
        id="employee-designation"
        value={data.designation}
        onChange={(value) => onUpdate('designation', value)}
        required
      />
      <FormField
        label="Department"
        id="employee-department"
        value={data.department}
        onChange={(value) => onUpdate('department', value)}
        required
      />
      <FormField
        label="Date of Joining"
        id="employee-joining"
        value={data.dateOfJoining}
        onChange={(value) => onUpdate('dateOfJoining', value)}
        type="date"
        required
      />
      {data.reportingManager !== undefined && (
        <FormField
          label="Reporting Manager"
          id="employee-manager"
          value={data.reportingManager}
          onChange={(value) => onUpdate('reportingManager', value)}
          required
        />
      )}
      
      {showStatutoryDetails && (
        <>
          <FormField
            label="PAN Number"
            id="employee-pan"
            value={data.panNumber || ''}
            onChange={(value) => onUpdate('panNumber', value)}
          />
          <FormField
            label="PF Number"
            id="employee-pf"
            value={data.pfNumber || ''}
            onChange={(value) => onUpdate('pfNumber', value)}
          />
          <FormField
            label="ESI Number"
            id="employee-esi"
            value={data.esiNumber || ''}
            onChange={(value) => onUpdate('esiNumber', value)}
          />
        </>
      )}
      
      {showBankDetails && (
        <>
          <FormField
            label="Bank Account"
            id="employee-account"
            value={data.bankAccount || ''}
            onChange={(value) => onUpdate('bankAccount', value)}
          />
          <FormField
            label="Bank Name"
            id="employee-bank"
            value={data.bankName || ''}
            onChange={(value) => onUpdate('bankName', value)}
          />
          <FormField
            label="IFSC Code"
            id="employee-ifsc"
            value={data.ifscCode || ''}
            onChange={(value) => onUpdate('ifscCode', value)}
          />
        </>
      )}
    </CardContent>
  </Card>
);

interface DocumentHeaderProps {
  title: string;
  company: CompanyInfo;
  subtitle?: string;
  additionalInfo?: React.ReactNode;
}

export const DocumentHeader = ({ title, company, subtitle, additionalInfo }: DocumentHeaderProps) => (
  <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
    <h1 className="text-3xl font-bold text-blue-600 mb-2">{title}</h1>
    <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
    <p className="text-gray-600">{company.address}</p>
    <p className="text-gray-600">Phone: {company.phone} | Email: {company.email}</p>
    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    {additionalInfo && <div className="mt-4">{additionalInfo}</div>}
  </div>
);

interface InfoDisplayProps {
  title: string;
  data: Record<string, unknown>;
  fields: Array<{
    key: string;
    label: string;
    format?: (value: unknown) => string;
  }>;
}

export const InfoDisplay = ({ title, data, fields }: InfoDisplayProps) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="space-y-2 text-sm">
      {fields.map(field => {
        const value = data[field.key];
        const displayValue = field.format ? field.format(value) : (value as string) || 'N/A';
        return (
          <div key={field.key} className="flex justify-between">
            <span className="font-medium">{field.label}:</span>
            <span>{displayValue}</span>
          </div>
        );
      })}
    </div>
  </div>
);