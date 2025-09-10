'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatDate } from './BaseDocumentComponent';
import { CompanyInfo, DEFAULT_COMPANY } from '@/types/hrDocuments';
import { 
  ModernHandbookTemplate, 
  CorporateHandbookTemplate, 
  StartupHandbookTemplate, 
  ComprehensiveHandbookTemplate,
  handbookTemplateOptions 
} from './templates/HandbookTemplates';

interface PolicySection {
  title: string;
  content: string;
  effectiveDate: string;
  lastUpdated: string;
}

interface EmployeeHandbookData extends Record<string, unknown> {
  company: CompanyInfo & { website: string; establishedYear: string; mission: string; vision: string; values: string };
  handbookVersion: string;
  effectiveDate: string;
  lastUpdated: string;
  codeOfConduct: PolicySection;
  workingHours: PolicySection;
  leavePolicy: PolicySection;
  compensationBenefits: PolicySection;
  performanceManagement: PolicySection;
  disciplinaryProcedures: PolicySection;
  healthSafety: PolicySection;
  itPolicy: PolicySection;
  confidentiality: PolicySection;
  equalOpportunity: PolicySection;
  grievanceProcedure: PolicySection;
  terminationPolicy: PolicySection;
  emergencyContacts: string;
  hrContactInfo: string;
  acknowledgment: string;
}

const POLICY_SECTIONS = [
  { key: 'codeOfConduct', title: 'Code of Conduct' },
  { key: 'workingHours', title: 'Working Hours and Attendance' },
  { key: 'leavePolicy', title: 'Leave Policy' },
  { key: 'compensationBenefits', title: 'Compensation and Benefits' },
  { key: 'performanceManagement', title: 'Performance Management' },
  { key: 'disciplinaryProcedures', title: 'Disciplinary Procedures' },
  { key: 'healthSafety', title: 'Health and Safety' },
  { key: 'itPolicy', title: 'IT and Technology Policy' },
  { key: 'confidentiality', title: 'Confidentiality and Non-Disclosure' },
  { key: 'equalOpportunity', title: 'Equal Opportunity and Anti-Discrimination' },
  { key: 'grievanceProcedure', title: 'Grievance Procedure' },
  { key: 'terminationPolicy', title: 'Termination Policy' }
];

const createDefaultPolicySection = (title: string): PolicySection => ({
  title,
  content: `Please add content for ${title} policy...`,
  effectiveDate: new Date().toISOString().split('T')[0],
  lastUpdated: new Date().toISOString().split('T')[0]
});

const initialData = (): EmployeeHandbookData => {
  const baseData = {
    company: { 
      ...DEFAULT_COMPANY, 
      website: 'www.codestam.com', 
      establishedYear: '2020', 
      mission: 'To deliver innovative technology solutions that empower businesses to achieve their goals.',
      vision: 'To be a leading technology partner recognized for excellence, innovation, and customer satisfaction.',
      values: 'Integrity, Innovation, Excellence, Collaboration, Customer Focus' 
    },
    handbookVersion: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    emergencyContacts: `Emergency Contacts:

Security: +91 98765 43211
Medical Emergency: 108
Fire Department: 101
Police: 100

Company Emergency Contacts:
HR Department: +91 98765 43212
Facility Management: +91 98765 43213
IT Support: +91 98765 43214`,
    hrContactInfo: `HR Department Contact Information:

HR Manager: Ms. Priya Sharma
Email: hr@codestam.com
Phone: +91 98765 43212
Office: Room 201, 2nd Floor

Office Hours: Monday to Friday, 9:00 AM to 6:00 PM
Emergency Contact: +91 98765 43216 (24/7)`,
    acknowledgment: `Employee Acknowledgment:

I acknowledge that I have received, read, and understood the Employee Handbook. I understand that this handbook contains important information about company policies, procedures, and expectations.

I agree to comply with all policies and procedures outlined in this handbook and understand that violations may result in disciplinary action, up to and including termination.

Employee Signature: _________________________    Date: ___________
Employee Name: _____________________________
Employee ID: _______________________________`
  };

  // Add policy sections
  const policies: Partial<EmployeeHandbookData> = {};
  POLICY_SECTIONS.forEach(section => {
    policies[section.key as keyof EmployeeHandbookData] = createDefaultPolicySection(section.title);
  });

  return { ...baseData, ...policies } as EmployeeHandbookData;
};

export default function EmployeeHandbookComponent() {
  const [data, setData] = useState<EmployeeHandbookData>(initialData());
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const updateCompany = (field: keyof (CompanyInfo & { website: string; establishedYear: string; mission: string; vision: string; values: string }), value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateRootField = (field: keyof EmployeeHandbookData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updatePolicySection = (section: keyof EmployeeHandbookData, field: keyof PolicySection, value: string) => {
    const currentSection = data[section] as PolicySection;
    setData(prev => ({
      ...prev,
      [section]: { ...currentSection, [field]: value }
    }));
  };

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
        <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
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
            <FormField label="Company Name" id="company-name" value={data.company.name} onChange={(value) => updateCompany('name', value)} required />
            <FormField label="Website" id="company-website" value={data.company.website} onChange={(value) => updateCompany('website', value)} />
            <FormField label="Address" id="company-address" value={data.company.address} onChange={(value) => updateCompany('address', value)} type="textarea" rows={2} />
            <div className="space-y-4">
              <FormField label="Phone" id="company-phone" value={data.company.phone} onChange={(value) => updateCompany('phone', value)} />
              <FormField label="Email" id="company-email" value={data.company.email} onChange={(value) => updateCompany('email', value)} type="email" />
            </div>
            <FormField label="Established Year" id="company-established" value={data.company.establishedYear} onChange={(value) => updateCompany('establishedYear', value)} />
            <div className="md:col-span-2">
              <FormField label="Mission Statement" id="company-mission" value={data.company.mission} onChange={(value) => updateCompany('mission', value)} type="textarea" rows={3} />
            </div>
            <div className="md:col-span-2">
              <FormField label="Vision Statement" id="company-vision" value={data.company.vision} onChange={(value) => updateCompany('vision', value)} type="textarea" rows={3} />
            </div>
            <div className="md:col-span-2">
              <FormField label="Company Values" id="company-values" value={data.company.values} onChange={(value) => updateCompany('values', value)} type="textarea" rows={2} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Handbook Information */}
      <Card>
        <CardHeader><CardTitle>Handbook Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Handbook Version" id="handbook-version" value={data.handbookVersion} onChange={(value) => updateRootField('handbookVersion', value)} required />
          <FormField label="Effective Date" id="effective-date" value={data.effectiveDate} onChange={(value) => updateRootField('effectiveDate', value)} type="date" required />
          <FormField label="Last Updated" id="last-updated" value={data.lastUpdated} onChange={(value) => updateRootField('lastUpdated', value)} type="date" required />
        </CardContent>
      </Card>

      {/* Policy Sections */}
      {POLICY_SECTIONS.map(section => {
        const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
        return (
          <Card key={section.key}>
            <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Effective Date" id={`${section.key}-effective`} value={sectionData.effectiveDate} onChange={(value) => updatePolicySection(section.key as keyof EmployeeHandbookData, 'effectiveDate', value)} type="date" />
                <FormField label="Last Updated" id={`${section.key}-updated`} value={sectionData.lastUpdated} onChange={(value) => updatePolicySection(section.key as keyof EmployeeHandbookData, 'lastUpdated', value)} type="date" />
              </div>
              <FormField label="Policy Content" id={`${section.key}-content`} value={sectionData.content} onChange={(value) => updatePolicySection(section.key as keyof EmployeeHandbookData, 'content', value)} type="textarea" rows={8} />
            </CardContent>
          </Card>
        );
      })}

      {/* Additional Information */}
      <Card>
        <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Emergency Contacts" id="emergency-contacts" value={data.emergencyContacts} onChange={(value) => updateRootField('emergencyContacts', value)} type="textarea" rows={6} />
          <FormField label="HR Contact Information" id="hr-contact" value={data.hrContactInfo} onChange={(value) => updateRootField('hrContactInfo', value)} type="textarea" rows={6} />
          <FormField label="Employee Acknowledgment" id="acknowledgment" value={data.acknowledgment} onChange={(value) => updateRootField('acknowledgment', value)} type="textarea" rows={8} />
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplate = () => {
    const templateProps = {
      data,
      companyLogo,
      formatDate
    };

    switch (selectedTemplate) {
      case 'corporate':
        return <CorporateHandbookTemplate {...templateProps} />;
      case 'startup':
        return <StartupHandbookTemplate {...templateProps} />;
      case 'comprehensive':
        return <ComprehensiveHandbookTemplate {...templateProps} />;
      default:
        return <ModernHandbookTemplate {...templateProps} />;
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
                {handbookTemplateOptions.map(template => (
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
      title="Employee Handbook Generator"
      description="Create comprehensive employee handbooks with company policies and procedures"
      documentType="quotation"
      iconColor="text-blue-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}