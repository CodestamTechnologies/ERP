'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useOfferLetter } from '@/hooks/useOfferLetter';
import { OfferLetterData } from '@/types/offerLetter';
import { 
  Calendar, Download, FileText, Mail, Printer, Save, User, Building, DollarSign, 
  Clock, Shield, Award, Heart, Briefcase, MapPin, Phone, AtSign, Bookmark, 
  History, AlertCircle, CheckCircle
} from 'lucide-react';

const FormField = ({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [], required = false, icon }: {
  label: string; id: string; value: string; onChange: (value: string) => void;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'number';
  placeholder?: string; rows?: number; options?: { value: string; label: string }[];
  required?: boolean; icon?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {type === 'textarea' ? (
      <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="resize-none" />
    ) : type === 'select' ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
      </Select>
    ) : (
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const CheckboxField = ({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string;
}) => (
  <div className="flex items-start space-x-3">
    <Checkbox checked={checked} onCheckedChange={onChange} className="mt-1" />
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  </div>
);

const OfferLetterComponent = () => {
  const { data, templates, history, loading, saving, updateData, saveAsDraft, saveAsTemplate, loadTemplate, generatePDF, sendEmail, validateData, resetData } = useOfferLetter();
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [activeTab, setActiveTab] = useState('company');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const updateField = <T extends keyof OfferLetterData>(section: T, field: keyof OfferLetterData[T], value: any) => {
    updateData({ [section]: { ...data[section], [field]: value } });
  };

  const updateRootField = (field: keyof OfferLetterData, value: any) => updateData({ [field]: value });

  const formatCurrency = (amount: string, currency: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return currency === 'INR' ? `₹${num.toLocaleString('en-IN')}` : `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const options = {
    employmentType: [
      { value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract' }, { value: 'Temporary', label: 'Temporary' }, { value: 'Internship', label: 'Internship' }
    ],
    currency: [
      { value: 'INR', label: 'INR (₹)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }
    ],
    payFrequency: [
      { value: 'Monthly', label: 'Monthly' }, { value: 'Bi-weekly', label: 'Bi-weekly' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Annually', label: 'Annually' }
    ],
    workLocation: [{ value: 'Office', label: 'Office' }, { value: 'Remote', label: 'Remote' }, { value: 'Hybrid', label: 'Hybrid' }],
    probation: [
      { value: '3 months', label: '3 months' }, { value: '6 months', label: '6 months' }, 
      { value: '12 months', label: '12 months' }, { value: 'No probation', label: 'No probation' }
    ],
    notice: [{ value: '15 days', label: '15 days' }, { value: '30 days', label: '30 days' }, { value: '60 days', label: '60 days' }, { value: '90 days', label: '90 days' }]
  };

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'generate': setActiveView('preview'); break;
        case 'download': await generatePDF(); break;
        case 'email':
          setEmailRecipient(data.candidate.email);
          setEmailSubject(`Job Offer - ${data.job.title} Position at ${data.company.name}`);
          setEmailMessage(`Dear ${data.candidate.firstName},\n\nPlease find attached your offer letter for the ${data.job.title} position at ${data.company.name}.\n\nWe look forward to hearing from you.\n\nBest regards,\n${data.signerName}\n${data.signerTitle}`);
          setShowEmailDialog(true);
          break;
        case 'save': await saveAsDraft(); alert('Draft saved successfully!'); break;
        case 'print': window.print(); break;
        case 'template': setShowTemplateDialog(true); break;
        case 'history': setShowHistoryDialog(true); break;
        case 'validate':
          const validation = validateData();
          alert(validation.isValid ? 'All required fields are filled correctly!' : `Please fix the following errors:\n${validation.errors.join('\n')}`);
          break;
        case 'reset': if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) resetData(); break;
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) { alert('Please enter a template name'); return; }
    try {
      await saveAsTemplate(templateName, templateDescription);
      setShowTemplateDialog(false);
      setTemplateName(''); setTemplateDescription('');
      alert('Template saved successfully!');
    } catch (error) { alert('Failed to save template'); }
  };

  const handleSendEmail = async () => {
    if (!emailRecipient.trim() || !emailSubject.trim()) { alert('Please fill in recipient and subject'); return; }
    try {
      await sendEmail(emailRecipient, emailSubject, emailMessage);
      setShowEmailDialog(false);
      setEmailRecipient(''); setEmailSubject(''); setEmailMessage('');
      alert('Email sent successfully!');
    } catch (error) { alert('Failed to send email'); }
  };

  const OfferLetterPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{data.company.name}</h1>
        <div className="text-gray-600 text-sm">
          {data.company.address}, {data.company.city}, {data.company.state} {data.company.zip}<br />
          Phone: {data.company.phone} | Email: {data.company.email} | Website: {data.company.website}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OFFER OF EMPLOYMENT</h2>
            <div className="text-gray-600">Date: {formatDate(data.letterDate)}</div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{data.job.employmentType} Position</Badge>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="font-semibold text-lg text-gray-900 mb-2">{data.candidate.firstName} {data.candidate.lastName}</div>
          <div className="text-gray-700 text-sm">
            {data.candidate.address}<br />{data.candidate.city}, {data.candidate.state} {data.candidate.zip}<br />
            Email: {data.candidate.email} | Phone: {data.candidate.phone}
          </div>
        </div>
      </div>

      <div className="space-y-6 text-gray-800 leading-relaxed">
        <p className="text-lg">Dear {data.candidate.firstName},</p>
        <p>We are pleased to extend this offer of employment to you for the position of <span className="font-semibold">{data.job.title}</span> in our <span className="font-semibold">{data.job.department}</span> department at {data.company.name}.</p>
        <p>We believe that your skills, experience, and enthusiasm make you an excellent fit for our team, and we are excited about the contributions you will make to our organization.</p>

        {[
          { title: 'Position Details', icon: Briefcase, color: 'blue', items: [
            ['Job Title', data.job.title], ['Department', data.job.department], ['Employment Type', data.job.employmentType],
            ['Reporting Manager', data.job.reportingManager], ['Start Date', formatDate(data.job.startDate)], ['Work Location', data.job.workLocation],
            ['Work Schedule', data.job.workSchedule]
          ]},
          { title: 'Compensation Package', icon: DollarSign, color: 'green', items: [
            ['Base Salary', `${formatCurrency(data.compensation.baseSalary, data.compensation.currency)} ${data.compensation.payFrequency.toLowerCase()}`],
            ...(data.compensation.bonus ? [['Performance Bonus', data.compensation.bonus]] : []),
            ...(data.compensation.stockOptions ? [['Stock Options', data.compensation.stockOptions]] : []),
            ...(data.compensation.otherCompensation ? [['Other Compensation', data.compensation.otherCompensation]] : [])
          ]},
          { title: 'Benefits Package', icon: Heart, color: 'purple', items: [
            ...Object.entries({
              healthInsurance: 'Health Insurance', dentalInsurance: 'Dental Insurance', visionInsurance: 'Vision Insurance',
              lifeInsurance: 'Life Insurance', retirementPlan: 'Retirement Plan', professionalDevelopment: 'Professional Development',
              gymMembership: 'Gym Membership', flexibleWorkArrangements: 'Flexible Work Arrangements'
            }).filter(([key]) => data.benefits[key as keyof typeof data.benefits]).map(([, label]) => [label, '✓']),
            ...(data.benefits.paidTimeOff ? [['Paid Time Off', data.benefits.paidTimeOff]] : []),
            ...(data.benefits.sickLeave ? [['Sick Leave', data.benefits.sickLeave]] : []),
            ...(data.benefits.maternityPaternityLeave ? [['Maternity/Paternity Leave', data.benefits.maternityPaternityLeave]] : []),
            ...(data.benefits.otherBenefits ? [['Other Benefits', data.benefits.otherBenefits]] : [])
          ]},
          { title: 'Terms and Conditions', icon: Shield, color: 'orange', items: [
            ['Probation Period', data.terms.probationPeriod], ['Notice Period', data.terms.noticePeriod],
            ...Object.entries({
              confidentialityAgreement: 'Confidentiality Agreement', nonCompeteClause: 'Non-Compete Clause',
              nonSolicitationClause: 'Non-Solicitation Clause', backgroundCheck: 'Background Check Required',
              drugTest: 'Drug Test Required'
            }).filter(([key]) => data.terms[key as keyof typeof data.terms]).map(([, label]) => [label, '✓']),
            ...(data.terms.additionalTerms ? [['Additional Terms', data.terms.additionalTerms]] : [])
          ]}
        ].map(section => (
          <div key={section.title} className={`bg-${section.color}-50 p-6 rounded-lg border-l-4 border-${section.color}-500`}>
            <h3 className={`text-xl font-bold text-${section.color}-900 mb-4 flex items-center`}>
              <section.icon className="w-5 h-5 mr-2" />{section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {section.items.map(([label, value], idx) => (
                <div key={idx} className={section.items.length === 1 ? 'md:col-span-2' : ''}>
                  <strong>{label}:</strong> {value}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />Offer Acceptance
          </h3>
          <p className="text-sm mb-3">This offer is valid until <strong>{formatDate(data.terms.offerValidUntil)}</strong>. Please confirm your acceptance by signing and returning this letter by the specified date.</p>
          <p className="text-sm">If you accept this offer, please sign below and return this letter to us. We look forward to welcoming you to the {data.company.name} team!</p>
        </div>

        <p>Should you have any questions about this offer or need clarification on any terms, please don't hesitate to contact our HR department.</p>
        <p>We are excited about the possibility of you joining our team and look forward to your positive response.</p>
        <p className="text-lg">Sincerely,</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <div className="font-semibold">{data.signerName}</div>
          <div className="text-gray-700">{data.signerTitle}</div>
          <div className="text-gray-700">{data.company.name}</div>
          <div className="text-gray-600 text-sm mt-2">Date: {formatDate(data.letterDate)}</div>
        </div>
        <div>
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <div className="font-semibold">{data.candidate.firstName} {data.candidate.lastName}</div>
          <div className="text-gray-700">Employee Signature</div>
          <div className="text-gray-600 text-sm mt-2">Date: _______________</div>
        </div>
      </div>

      {(data.hrContactName || data.hrContactEmail || data.hrContactPhone) && (
        <div className="mt-12 pt-6 border-t border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2">HR Contact Information</h4>
          <div className="text-sm text-gray-700">
            {data.hrContactName && <div>Contact Person: {data.hrContactName}</div>}
            {data.hrContactEmail && <div>Email: {data.hrContactEmail}</div>}
            {data.hrContactPhone && <div>Phone: {data.hrContactPhone}</div>}
          </div>
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This offer letter is confidential and proprietary to {data.company.name}</p>
        <p className="mt-1">Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
      </div>
    </div>
  );

  const tabsConfig = [
    { id: 'company', label: 'Company', icon: Building, fields: [
      { label: 'Company Name', id: 'name', required: true, icon: <Building className="w-4 h-4" /> },
      { label: 'Website', id: 'website' },
      { label: 'Address', id: 'address', required: true, icon: <MapPin className="w-4 h-4" />, span: 2 },
      { label: 'City', id: 'city', required: true },
      { label: 'State', id: 'state', required: true },
      { label: 'ZIP Code', id: 'zip', required: true },
      { label: 'Phone', id: 'phone', required: true, icon: <Phone className="w-4 h-4" /> },
      { label: 'Email', id: 'email', type: 'email', required: true, icon: <AtSign className="w-4 h-4" />, span: 2 }
    ]},
    { id: 'candidate', label: 'Candidate', icon: User, fields: [
      { label: 'First Name', id: 'firstName', required: true, icon: <User className="w-4 h-4" /> },
      { label: 'Last Name', id: 'lastName', required: true },
      { label: 'Email', id: 'email', type: 'email', required: true, icon: <AtSign className="w-4 h-4" /> },
      { label: 'Phone', id: 'phone', required: true, icon: <Phone className="w-4 h-4" /> },
      { label: 'Address', id: 'address', required: true, icon: <MapPin className="w-4 h-4" />, span: 2 },
      { label: 'City', id: 'city', required: true },
      { label: 'State', id: 'state', required: true },
      { label: 'ZIP Code', id: 'zip', required: true }
    ]},
    { id: 'job', label: 'Job Details', icon: Briefcase, fields: [
      { label: 'Job Title', id: 'title', required: true, icon: <Briefcase className="w-4 h-4" /> },
      { label: 'Department', id: 'department', required: true },
      { label: 'Reporting Manager', id: 'reportingManager', required: true },
      { label: 'Employment Type', id: 'employmentType', type: 'select', options: options.employmentType, required: true },
      { label: 'Start Date', id: 'startDate', type: 'date', required: true, icon: <Calendar className="w-4 h-4" /> },
      { label: 'Work Location', id: 'workLocation', type: 'select', options: options.workLocation, required: true },
      { label: 'Work Schedule', id: 'workSchedule', required: true, icon: <Clock className="w-4 h-4" />, span: 2 }
    ]},
    { id: 'compensation', label: 'Compensation', icon: DollarSign, fields: [
      { label: 'Base Salary', id: 'baseSalary', type: 'number', required: true, icon: <DollarSign className="w-4 h-4" /> },
      { label: 'Currency', id: 'currency', type: 'select', options: options.currency, required: true },
      { label: 'Pay Frequency', id: 'payFrequency', type: 'select', options: options.payFrequency, required: true },
      { label: 'Performance Bonus', id: 'bonus' },
      { label: 'Stock Options', id: 'stockOptions' },
      { label: 'Other Compensation', id: 'otherCompensation' }
    ]}
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="w-8 h-8 mr-3 text-blue-600" />
            Offer Letter / Appointment Letter Generator
          </h1>
          <p className="text-gray-600 mt-1">Create professional employment offer letters with comprehensive terms and benefits</p>
        </div>
        <div className="flex space-x-2">
          {['form', 'preview'].map(view => (
            <Button key={view} variant={activeView === view ? 'default' : 'outline'} onClick={() => setActiveView(view as 'form' | 'preview')} className="flex items-center capitalize">
              {view === 'form' ? <FileText className="w-4 h-4 mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
              {view}
            </Button>
          ))}
        </div>
      </div>

      {activeView === 'form' ? (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {[...tabsConfig, { id: 'benefits', label: 'Benefits', icon: Heart }, { id: 'terms', label: 'Terms', icon: Shield }].map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsConfig.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tab.icon className="w-5 h-5" />{tab.label} Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tab.fields.map(field => (
                      <div key={field.id} className={field.span === 2 ? 'md:col-span-2' : ''}>
                        <FormField
                          label={field.label}
                          id={`${tab.id}-${field.id}`}
                          value={data[tab.id as keyof OfferLetterData][field.id as keyof any] || ''}
                          onChange={(v) => updateField(tab.id as keyof OfferLetterData, field.id as any, v)}
                          type={field.type as any}
                          options={field.options}
                          required={field.required}
                          icon={field.icon}
                          placeholder={field.label}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5" />Benefits Package</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: 'Insurance Benefits', fields: [
                      { key: 'healthInsurance', label: 'Health Insurance', desc: 'Medical coverage for employee and family' },
                      { key: 'dentalInsurance', label: 'Dental Insurance', desc: 'Dental coverage' },
                      { key: 'visionInsurance', label: 'Vision Insurance', desc: 'Eye care coverage' },
                      { key: 'lifeInsurance', label: 'Life Insurance', desc: 'Life insurance coverage' }
                    ]},
                    { title: 'Additional Benefits', fields: [
                      { key: 'retirementPlan', label: 'Retirement Plan', desc: '401(k) or pension plan' },
                      { key: 'professionalDevelopment', label: 'Professional Development', desc: 'Training and conference allowance' },
                      { key: 'gymMembership', label: 'Gym Membership', desc: 'Fitness center membership' },
                      { key: 'flexibleWorkArrangements', label: 'Flexible Work Arrangements', desc: 'Remote work options' }
                    ]}
                  ].map(section => (
                    <div key={section.title}>
                      <h4 className="font-semibold mb-4">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map(field => (
                          <CheckboxField key={field.key} label={field.label} checked={data.benefits[field.key as keyof typeof data.benefits] as boolean} onChange={(v) => updateField('benefits', field.key as any, v)} description={field.desc} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <h4 className="font-semibold mb-4">Time Off Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Paid Time Off', id: 'paidTimeOff', placeholder: '21 days annually' },
                        { label: 'Sick Leave', id: 'sickLeave', placeholder: '12 days annually' },
                        { label: 'Maternity/Paternity Leave', id: 'maternityPaternityLeave', placeholder: 'As per company policy', span: 2 }
                      ].map(field => (
                        <div key={field.id} className={field.span === 2 ? 'md:col-span-2' : ''}>
                          <FormField label={field.label} id={field.id} value={data.benefits[field.id as keyof typeof data.benefits] as string} onChange={(v) => updateField('benefits', field.id as any, v)} placeholder={field.placeholder} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormField label="Other Benefits" id="otherBenefits" type="textarea" value={data.benefits.otherBenefits} onChange={(v) => updateField('benefits', 'otherBenefits', v)} placeholder="List any additional benefits..." rows={3} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" />Terms and Conditions</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Probation Period" id="probationPeriod" type="select" value={data.terms.probationPeriod} onChange={(v) => updateField('terms', 'probationPeriod', v)} options={options.probation} required />
                    <FormField label="Notice Period" id="noticePeriod" type="select" value={data.terms.noticePeriod} onChange={(v) => updateField('terms', 'noticePeriod', v)} options={options.notice} required />
                    <FormField label="Offer Valid Until" id="offerValidUntil" type="date" value={data.terms.offerValidUntil} onChange={(v) => updateField('terms', 'offerValidUntil', v)} required icon={<Calendar className="w-4 h-4" />} />
                  </div>
                  {[
                    { title: 'Legal Agreements', fields: [
                      { key: 'confidentialityAgreement', label: 'Confidentiality Agreement', desc: 'Non-disclosure of company information' },
                      { key: 'nonCompeteClause', label: 'Non-Compete Clause', desc: 'Restriction on working for competitors' },
                      { key: 'nonSolicitationClause', label: 'Non-Solicitation Clause', desc: 'Restriction on soliciting employees/clients' }
                    ]},
                    { title: 'Pre-Employment Requirements', fields: [
                      { key: 'backgroundCheck', label: 'Background Check', desc: 'Criminal and employment history verification' },
                      { key: 'drugTest', label: 'Drug Test', desc: 'Pre-employment drug screening' }
                    ]}
                  ].map(section => (
                    <div key={section.title}>
                      <h4 className="font-semibold mb-4">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map(field => (
                          <CheckboxField key={field.key} label={field.label} checked={data.terms[field.key as keyof typeof data.terms] as boolean} onChange={(v) => updateField('terms', field.key as any, v)} description={field.desc} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <FormField label="Additional Terms" id="additionalTerms" type="textarea" value={data.terms.additionalTerms} onChange={(v) => updateField('terms', 'additionalTerms', v)} placeholder="Any additional terms and conditions..." rows={4} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Signature Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Letter Date', id: 'letterDate', type: 'date', required: true, icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Signer Name', id: 'signerName', required: true, icon: <User className="w-4 h-4" /> },
                    { label: 'Signer Title', id: 'signerTitle', required: true },
                    { label: 'HR Contact Name', id: 'hrContactName' },
                    { label: 'HR Contact Email', id: 'hrContactEmail', type: 'email', icon: <AtSign className="w-4 h-4" /> },
                    { label: 'HR Contact Phone', id: 'hrContactPhone', icon: <Phone className="w-4 h-4" /> }
                  ].map(field => (
                    <FormField key={field.id} label={field.label} id={field.id} type={field.type as any} value={data[field.id as keyof OfferLetterData] as string} onChange={(v) => updateRootField(field.id as keyof OfferLetterData, v)} required={field.required} icon={field.icon} placeholder={field.label} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button onClick={() => handleAction('generate')} className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />Generate Preview
            </Button>
            <Button variant="outline" onClick={() => handleAction('save')} className="flex items-center" disabled={saving}>
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center"><Save className="w-4 h-4 mr-2" />Save as Template</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save as Template</DialogTitle>
                  <DialogDescription>Save this offer letter configuration as a reusable template</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FormField label="Template Name" id="template-name" value={templateName} onChange={setTemplateName} placeholder="e.g., Software Engineer Template" required />
                  <FormField label="Description" id="template-description" type="textarea" value={templateDescription} onChange={setTemplateDescription} placeholder="Brief description of this template..." rows={3} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                  <Button onClick={handleSaveTemplate} disabled={saving}>{saving ? 'Saving...' : 'Save Template'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center"><History className="w-4 h-4 mr-2" />History</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Offer Letter History</DialogTitle>
                  <DialogDescription>Previously created offer letters and drafts</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No offer letters created yet</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{item.candidateName}</h4>
                            <p className="text-sm text-gray-600">{item.jobTitle} - {item.department}</p>
                          </div>
                          <Badge variant={item.status === 'Draft' ? 'secondary' : 'default'}>{item.status}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Created: {formatDate(item.createdAt)}</span>
                          <Button variant="ghost" size="sm" onClick={() => { updateData(item.data); setShowHistoryDialog(false); }}>Load</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Offer Letter</DialogTitle>
                  <DialogDescription>Send the offer letter via email</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FormField label="Recipient Email" id="email-recipient" type="email" value={emailRecipient} onChange={setEmailRecipient} required />
                  <FormField label="Subject" id="email-subject" value={emailSubject} onChange={setEmailSubject} required />
                  <FormField label="Message" id="email-message" type="textarea" value={emailMessage} onChange={setEmailMessage} rows={5} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
                  <Button onClick={handleSendEmail} disabled={loading}>{loading ? 'Sending...' : 'Send Email'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => handleAction('validate')} className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />Validate
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {[
                { label: 'Edit', action: 'form', icon: FileText },
                { label: 'Download PDF', action: 'download', icon: Download },
                { label: 'Send Email', action: 'email', icon: Mail, variant: 'outline' as const },
                { label: 'Print', action: 'print', icon: Printer, variant: 'outline' as const }
              ].map(btn => (
                <Button key={btn.action} onClick={() => btn.action === 'form' ? setActiveView('form') : handleAction(btn.action)} variant={btn.variant || 'default'} className="flex items-center" disabled={loading}>
                  <btn.icon className="w-4 h-4 mr-2" />{btn.label}
                </Button>
              ))}
            </div>
            <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />Save Draft
            </Button>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <OfferLetterPreview />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterComponent;