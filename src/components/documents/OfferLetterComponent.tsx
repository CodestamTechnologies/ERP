'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
import { OfferLetterData, OfferLetterHistory as OfferLetterHistoryType } from '@/types/offerLetter';
import { 
  ModernTemplate, 
  ClassicTemplate, 
  ExecutiveTemplate, 
  MinimalTemplate, 
  CorporateTemplate,
  templateOptions 
} from './OfferLetterTemplates';
import OfferLetterHistory from './OfferLetterHistory';
import OfferLetterDrafts from './OfferLetterDrafts';
import { 
  Calendar, Download, FileText, Mail, Printer, Save, User, Building, DollarSign, 
  Clock, Shield, Award, Heart, Briefcase, MapPin, Phone, AtSign, 
  History, CheckCircle, FolderOpen, Plus, ArrowLeft, Eye
} from 'lucide-react';

// Form Field Component
const FormField = React.memo(({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [], required = false, icon }: {
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
      <Textarea 
        id={id} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        rows={rows} 
        className="resize-none" 
      />
    ) : type === 'select' ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input 
        id={id} 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
      />
    )}
  </div>
));

FormField.displayName = 'FormField';

// Checkbox Field Component
const CheckboxField = React.memo(({ label, checked, onChange, description }: {
  label: string; checked: boolean; onChange: (checked: boolean) => void; description?: string;
}) => (
  <div className="flex items-start space-x-3">
    <Checkbox checked={checked} onCheckedChange={onChange} className="mt-1" />
    <div className="space-y-1">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  </div>
));

CheckboxField.displayName = 'CheckboxField';

// Main Component
const OfferLetterComponent: React.FC = () => {
  const { 
    data, 
    templates, 
    history, 
    loading, 
    saving, 
    updateData, 
    saveAsDraft, 
    saveAsTemplate, 
    loadTemplate, 
    generatePDF, 
    sendEmail, 
    validateData, 
    resetData 
  } = useOfferLetter();

  // State management
  const [activeView, setActiveView] = useState<'form' | 'preview' | 'history' | 'drafts'>('form');
  const [activeTab, setActiveTab] = useState('company');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<OfferLetterHistoryType | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  // Utility functions
  const updateField = useCallback(<T extends keyof OfferLetterData>(section: T, field: keyof OfferLetterData[T], value: string | boolean | number) => {
    const currentSection = data[section];
    if (typeof currentSection === 'object' && currentSection !== null) {
      updateData({ [section]: { ...currentSection, [field]: value } });
    }
  }, [data, updateData]);

  const updateRootField = useCallback((field: keyof OfferLetterData, value: string | boolean | number) => {
    updateData({ [field]: value });
  }, [updateData]);

  const formatCurrency = useCallback((amount: string, currency: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return currency === 'INR' ? `₹${num.toLocaleString('en-IN')}` : `$${num.toLocaleString()}`;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
  }, []);

  // Options configuration
  const options = useMemo(() => ({
    employmentType: [
      { value: 'Full-time', label: 'Full-time' }, 
      { value: 'Part-time', label: 'Part-time' },
      { value: 'Contract', label: 'Contract' }, 
      { value: 'Temporary', label: 'Temporary' }, 
      { value: 'Internship', label: 'Internship' }
    ],
    currency: [
      { value: 'INR', label: 'INR (₹)' }, 
      { value: 'USD', label: 'USD ($)' }, 
      { value: 'EUR', label: 'EUR (€)' }, 
      { value: 'GBP', label: 'GBP (£)' }
    ],
    payFrequency: [
      { value: 'Monthly', label: 'Monthly' }, 
      { value: 'Bi-weekly', label: 'Bi-weekly' }, 
      { value: 'Weekly', label: 'Weekly' }, 
      { value: 'Annually', label: 'Annually' }
    ],
    workLocation: [
      { value: 'Office', label: 'Office' }, 
      { value: 'Remote', label: 'Remote' }, 
      { value: 'Hybrid', label: 'Hybrid' }
    ],
    probation: [
      { value: '3 months', label: '3 months' }, 
      { value: '6 months', label: '6 months' }, 
      { value: '12 months', label: '12 months' }, 
      { value: 'No probation', label: 'No probation' }
    ],
    notice: [
      { value: '15 days', label: '15 days' }, 
      { value: '30 days', label: '30 days' }, 
      { value: '60 days', label: '60 days' }, 
      { value: '90 days', label: '90 days' }
    ]
  }), []);

  // Action handlers
  const handleAction = useCallback(async (action: string) => {
    try {
      switch (action) {
        case 'generate': 
          setActiveView('preview'); 
          break;
        case 'download': 
          await generatePDF(); 
          break;
        case 'email':
          setEmailRecipient(data.candidate.email);
          setEmailSubject(`Job Offer - ${data.job.title} Position at ${data.company.name}`);
          setEmailMessage(`Dear ${data.candidate.firstName},\n\nPlease find attached your offer letter for the ${data.job.title} position at ${data.company.name}.\n\nWe look forward to hearing from you.\n\nBest regards,\n${data.signerName}\n${data.signerTitle}`);
          setShowEmailDialog(true);
          break;
        case 'save': 
          await saveAsDraft(); 
          alert('Draft saved successfully!'); 
          break;
        case 'print': 
          window.print(); 
          break;
        case 'template': 
          setShowTemplateDialog(true); 
          break;
        case 'history': 
          setActiveView('history');
          break;
        case 'drafts':
          setActiveView('drafts');
          break;
        case 'validate':
          const validation = validateData();
          alert(validation.isValid ? 'All required fields are filled correctly!' : `Please fix the following errors:\n${validation.errors.join('\n')}`);
          break;
        case 'reset': 
          if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            resetData();
          }
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    }
  }, [data, generatePDF, saveAsDraft, validateData, resetData]);

  const handleSaveTemplate = useCallback(async () => {
    if (!templateName.trim()) { 
      alert('Please enter a template name'); 
      return; 
    }
    try {
      await saveAsTemplate(templateName, templateDescription);
      setShowTemplateDialog(false);
      setTemplateName(''); 
      setTemplateDescription('');
      alert('Template saved successfully!');
    } catch (error) { 
      alert('Failed to save template'); 
    }
  }, [templateName, templateDescription, saveAsTemplate]);

  const handleSendEmail = useCallback(async () => {
    if (!emailRecipient.trim() || !emailSubject.trim()) { 
      alert('Please fill in recipient and subject'); 
      return; 
    }
    try {
      await sendEmail(emailRecipient, emailSubject, emailMessage);
      setShowEmailDialog(false);
      setEmailRecipient(''); 
      setEmailSubject(''); 
      setEmailMessage('');
      alert('Email sent successfully!');
    } catch (error) { 
      alert('Failed to send email'); 
    }
  }, [emailRecipient, emailSubject, emailMessage, sendEmail]);

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

  // History handlers
  const handleLoadDraft = useCallback((draftData: OfferLetterData) => {
    updateData(draftData);
    setActiveView('form');
  }, [updateData]);

  const handleDeleteDraft = useCallback((id: string) => {
    // This would be handled by the useOfferLetter hook
    console.log('Delete draft:', id);
  }, []);

  const handleViewDetails = useCallback((item: OfferLetterHistoryType) => {
    setSelectedHistoryItem(item);
    setShowDetailsDialog(true);
  }, []);

  const handleSendEmailFromHistory = useCallback((item: OfferLetterHistoryType) => {
    setEmailRecipient(item.data.candidate.email);
    setEmailSubject(`Job Offer - ${item.jobTitle} Position at ${item.data.company.name}`);
    setEmailMessage(`Dear ${item.data.candidate.firstName},\n\nPlease find attached your offer letter for the ${item.jobTitle} position at ${item.data.company.name}.\n\nWe look forward to hearing from you.\n\nBest regards,\n${item.data.signerName}\n${item.data.signerTitle}`);
    setShowEmailDialog(true);
  }, []);

  const handleDownloadPDFFromHistory = useCallback(async (item: OfferLetterHistoryType) => {
    // Temporarily set the data to generate PDF
    const currentData = { ...data };
    updateData(item.data);
    await generatePDF();
    updateData(currentData);
  }, [data, updateData, generatePDF]);

  const handleCreateNew = useCallback(() => {
    resetData();
    setActiveView('form');
  }, [resetData]);

  // Template renderer
  const renderTemplate = useCallback(() => {
    const templateProps = {
      data,
      companyLogo,
      formatCurrency,
      formatDate
    };

    switch (selectedTemplate) {
      case 'classic':
        return <ClassicTemplate {...templateProps} />;
      case 'executive':
        return <ExecutiveTemplate {...templateProps} />;
      case 'minimal':
        return <MinimalTemplate {...templateProps} />;
      case 'corporate':
        return <CorporateTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  }, [selectedTemplate, data, companyLogo, formatCurrency, formatDate]);

  // Define field interface
  interface FormFieldConfig {
    label: string;
    id: string;
    type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'number';
    required?: boolean;
    icon?: React.ReactNode;
    span?: number;
    options?: { value: string; label: string }[];
  }

  // Tab configuration
  const tabsConfig = useMemo(() => [
    { 
      id: 'company', 
      label: 'Company', 
      icon: Building, 
      fields: [
        { label: 'Company Name', id: 'name', required: true, icon: <Building className="w-4 h-4" /> },
        { label: 'Website', id: 'website' },
        { label: 'Address', id: 'address', required: true, icon: <MapPin className="w-4 h-4" />, span: 2 },
        { label: 'City', id: 'city', required: true },
        { label: 'State', id: 'state', required: true },
        { label: 'ZIP Code', id: 'zip', required: true },
        { label: 'Phone', id: 'phone', required: true, icon: <Phone className="w-4 h-4" /> },
        { label: 'Email', id: 'email', type: 'email' as const, required: true, icon: <AtSign className="w-4 h-4" />, span: 2 }
      ] as FormFieldConfig[]
    },
    { 
      id: 'candidate', 
      label: 'Candidate', 
      icon: User, 
      fields: [
        { label: 'First Name', id: 'firstName', required: true, icon: <User className="w-4 h-4" /> },
        { label: 'Last Name', id: 'lastName', required: true },
        { label: 'Email', id: 'email', type: 'email' as const, required: true, icon: <AtSign className="w-4 h-4" /> },
        { label: 'Phone', id: 'phone', required: true, icon: <Phone className="w-4 h-4" /> },
        { label: 'Address', id: 'address', required: true, icon: <MapPin className="w-4 h-4" />, span: 2 },
        { label: 'City', id: 'city', required: true },
        { label: 'State', id: 'state', required: true },
        { label: 'ZIP Code', id: 'zip', required: true }
      ] as FormFieldConfig[]
    },
    { 
      id: 'job', 
      label: 'Job Details', 
      icon: Briefcase, 
      fields: [
        { label: 'Job Title', id: 'title', required: true, icon: <Briefcase className="w-4 h-4" /> },
        { label: 'Department', id: 'department', required: true },
        { label: 'Reporting Manager', id: 'reportingManager', required: true },
        { label: 'Employment Type', id: 'employmentType', type: 'select' as const, options: options.employmentType, required: true },
        { label: 'Start Date', id: 'startDate', type: 'date' as const, required: true, icon: <Calendar className="w-4 h-4" /> },
        { label: 'Work Location', id: 'workLocation', type: 'select' as const, options: options.workLocation, required: true },
        { label: 'Work Schedule', id: 'workSchedule', required: true, icon: <Clock className="w-4 h-4" />, span: 2 }
      ] as FormFieldConfig[]
    },
    { 
      id: 'compensation', 
      label: 'Compensation', 
      icon: DollarSign, 
      fields: [
        { label: 'Base Salary', id: 'baseSalary', type: 'number' as const, required: true, icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Currency', id: 'currency', type: 'select' as const, options: options.currency, required: true },
        { label: 'Pay Frequency', id: 'payFrequency', type: 'select' as const, options: options.payFrequency, required: true },
        { label: 'Performance Bonus', id: 'bonus' },
        { label: 'Stock Options', id: 'stockOptions' },
        { label: 'Other Compensation', id: 'otherCompensation' }
      ] as FormFieldConfig[]
    }
  ], [options]);

  // Get drafts from history
  const drafts = useMemo(() => history.filter(item => item.status === 'Draft'), [history]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {activeView !== 'form' && activeView !== 'preview' && (
            <Button
              variant="outline"
              onClick={() => setActiveView('form')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Award className="w-8 h-8 mr-3 text-blue-600" />
              {activeView === 'history' ? 'Offer Letter History' : 
               activeView === 'drafts' ? 'Draft Offer Letters' : 
               'Offer Letter Generator'}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeView === 'history' ? 'View and manage all offer letters' :
               activeView === 'drafts' ? 'Continue working on your saved drafts' :
               'Create professional employment offer letters with comprehensive terms and benefits'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {(activeView === 'form' || activeView === 'preview') && (
            <>
              {['form', 'preview'].map(view => (
                <Button 
                  key={view} 
                  variant={activeView === view ? 'default' : 'outline'} 
                  onClick={() => setActiveView(view as 'form' | 'preview')} 
                  className="flex items-center capitalize"
                >
                  {view === 'form' ? <FileText className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {view}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handleAction('history')}
                className="flex items-center"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('drafts')}
                className="flex items-center"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Drafts ({drafts.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'history' ? (
        <OfferLetterHistory
          history={history}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={handleDeleteDraft}
          onViewDetails={handleViewDetails}
          onSendEmail={handleSendEmailFromHistory}
          onDownloadPDF={handleDownloadPDFFromHistory}
        />
      ) : activeView === 'drafts' ? (
        <OfferLetterDrafts
          drafts={drafts}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={handleDeleteDraft}
          onCreateNew={handleCreateNew}
        />
      ) : activeView === 'form' ? (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {[...tabsConfig, { id: 'benefits', label: 'Benefits', icon: Heart }, { id: 'terms', label: 'Terms', icon: Shield }].map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Form Tabs */}
            {tabsConfig.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tab.icon className="w-5 h-5" />{tab.label} Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Company Logo Upload - Only for Company tab */}
                    {tab.id === 'company' && (
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
                    )}
                    
                    {/* Regular Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tab.fields.map(field => {
                        const sectionData = data[tab.id as keyof OfferLetterData];
                        const fieldValue = typeof sectionData === 'object' && sectionData !== null 
  ? (sectionData as unknown as Record<string, unknown>)[field.id] || ''
  : '';
                        
                        return (
                          <div key={field.id} className={field.span === 2 ? 'md:col-span-2' : ''}>
                            <FormField
                              label={field.label}
                              id={`${tab.id}-${field.id}`}
                              value={String(fieldValue)}
                              onChange={(v) => updateField(tab.id as keyof OfferLetterData, field.id as keyof OfferLetterData[keyof OfferLetterData], v)}
                              type={field.type}
                              options={field.options}
                              required={field.required}
                              icon={field.icon}
                              placeholder={field.label}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />Benefits Package
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { 
                      title: 'Insurance Benefits', 
                      fields: [
                        { key: 'healthInsurance', label: 'Health Insurance', desc: 'Medical coverage for employee and family' },
                        { key: 'dentalInsurance', label: 'Dental Insurance', desc: 'Dental coverage' },
                        { key: 'visionInsurance', label: 'Vision Insurance', desc: 'Eye care coverage' },
                        { key: 'lifeInsurance', label: 'Life Insurance', desc: 'Life insurance coverage' }
                      ]
                    },
                    { 
                      title: 'Additional Benefits', 
                      fields: [
                        { key: 'retirementPlan', label: 'Retirement Plan', desc: '401(k) or pension plan' },
                        { key: 'professionalDevelopment', label: 'Professional Development', desc: 'Training and conference allowance' },
                        { key: 'gymMembership', label: 'Gym Membership', desc: 'Fitness center membership' },
                        { key: 'flexibleWorkArrangements', label: 'Flexible Work Arrangements', desc: 'Remote work options' }
                      ]
                    }
                  ].map(section => (
                    <div key={section.title}>
                      <h4 className="font-semibold mb-4">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map(field => (
                          <CheckboxField 
                            key={field.key} 
                            label={field.label} 
                            checked={data.benefits[field.key as keyof typeof data.benefits] as boolean} 
                            onChange={(v) => updateField('benefits', field.key as keyof OfferLetterData['benefits'], v)} 
                            description={field.desc} 
                          />
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
                          <FormField 
                            label={field.label} 
                            id={field.id} 
                            value={data.benefits[field.id as keyof typeof data.benefits] as string} 
                            onChange={(v) => updateField('benefits', field.id as keyof OfferLetterData['benefits'], v)} 
                            placeholder={field.placeholder} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <FormField 
                    label="Other Benefits" 
                    id="otherBenefits" 
                    type="textarea" 
                    value={data.benefits.otherBenefits} 
                    onChange={(v) => updateField('benefits', 'otherBenefits', v)} 
                    placeholder="List any additional benefits..." 
                    rows={3} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terms Tab */}
            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />Terms and Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField 
                      label="Probation Period" 
                      id="probationPeriod" 
                      type="select" 
                      value={data.terms.probationPeriod} 
                      onChange={(v) => updateField('terms', 'probationPeriod', v)} 
                      options={options.probation} 
                      required 
                    />
                    <FormField 
                      label="Notice Period" 
                      id="noticePeriod" 
                      type="select" 
                      value={data.terms.noticePeriod} 
                      onChange={(v) => updateField('terms', 'noticePeriod', v)} 
                      options={options.notice} 
                      required 
                    />
                    <FormField 
                      label="Offer Valid Until" 
                      id="offerValidUntil" 
                      type="date" 
                      value={data.terms.offerValidUntil} 
                      onChange={(v) => updateField('terms', 'offerValidUntil', v)} 
                      required 
                      icon={<Calendar className="w-4 h-4" />} 
                    />
                  </div>
                  
                  {[
                    { 
                      title: 'Legal Agreements', 
                      fields: [
                        { key: 'confidentialityAgreement', label: 'Confidentiality Agreement', desc: 'Non-disclosure of company information' },
                        { key: 'nonCompeteClause', label: 'Non-Compete Clause', desc: 'Restriction on working for competitors' },
                        { key: 'nonSolicitationClause', label: 'Non-Solicitation Clause', desc: 'Restriction on soliciting employees/clients' }
                      ]
                    },
                    { 
                      title: 'Pre-Employment Requirements', 
                      fields: [
                        { key: 'backgroundCheck', label: 'Background Check', desc: 'Criminal and employment history verification' },
                        { key: 'drugTest', label: 'Drug Test', desc: 'Pre-employment drug screening' }
                      ]
                    }
                  ].map(section => (
                    <div key={section.title}>
                      <h4 className="font-semibold mb-4">{section.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.map(field => (
                          <CheckboxField 
                            key={field.key} 
                            label={field.label} 
                            checked={data.terms[field.key as keyof typeof data.terms] as boolean} 
                            onChange={(v) => updateField('terms', field.key as keyof OfferLetterData['terms'], v)} 
                            description={field.desc} 
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <FormField 
                    label="Additional Terms" 
                    id="additionalTerms" 
                    type="textarea" 
                    value={data.terms.additionalTerms} 
                    onChange={(v) => updateField('terms', 'additionalTerms', v)} 
                    placeholder="Any additional terms and conditions..." 
                    rows={4} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Signature Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Letter Date', id: 'letterDate', type: 'date', required: true, icon: <Calendar className="w-4 h-4" /> },
                    { label: 'Signer Name', id: 'signerName', required: true, icon: <User className="w-4 h-4" /> },
                    { label: 'Signer Title', id: 'signerTitle', required: true },
                    { label: 'HR Contact Name', id: 'hrContactName' },
                    { label: 'HR Contact Email', id: 'hrContactEmail', type: 'email', icon: <AtSign className="w-4 h-4" /> },
                    { label: 'HR Contact Phone', id: 'hrContactPhone', icon: <Phone className="w-4 h-4" /> }
                  ].map(field => (
                    <FormField 
                      key={field.id} 
                      label={field.label} 
                      id={field.id} 
                      type={field.type as 'text' | 'email' | 'date' | 'textarea' | 'select' | 'number' | undefined} 
                      value={data[field.id as keyof OfferLetterData] as string} 
                      onChange={(v) => updateRootField(field.id as keyof OfferLetterData, v)} 
                      required={field.required} 
                      icon={field.icon} 
                      placeholder={field.label} 
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button onClick={() => handleAction('generate')} className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />Generate Preview
            </Button>
            <Button variant="outline" onClick={() => handleAction('save')} className="flex items-center" disabled={saving}>
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            {/* Template Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />Save as Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save as Template</DialogTitle>
                  <DialogDescription>Save this offer letter configuration as a reusable template</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <FormField 
                    label="Template Name" 
                    id="template-name" 
                    value={templateName} 
                    onChange={setTemplateName} 
                    placeholder="e.g., Software Engineer Template" 
                    required 
                  />
                  <FormField 
                    label="Description" 
                    id="template-description" 
                    type="textarea" 
                    value={templateDescription} 
                    onChange={setTemplateDescription} 
                    placeholder="Brief description of this template..." 
                    rows={3} 
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                  <Button onClick={handleSaveTemplate} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Template'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => handleAction('validate')} className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />Validate
            </Button>
          </div>
        </div>
      ) : (
        /* Preview Section */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {[
                { label: 'Edit', action: 'form', icon: FileText },
                { label: 'Download PDF', action: 'download', icon: Download },
                { label: 'Send Email', action: 'email', icon: Mail, variant: 'outline' as const },
                { label: 'Print', action: 'print', icon: Printer, variant: 'outline' as const }
              ].map(btn => (
                <Button 
                  key={btn.action} 
                  onClick={() => btn.action === 'form' ? setActiveView('form') : handleAction(btn.action)} 
                  variant={btn.variant || 'default'} 
                  className="flex items-center" 
                  disabled={loading}
                >
                  <btn.icon className="w-4 h-4 mr-2" />{btn.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Template:</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map(template => (
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
              <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />Save Draft
              </Button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderTemplate()}
          </motion.div>
        </div>
      )}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Offer Letter</DialogTitle>
            <DialogDescription>Send the offer letter via email</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField 
              label="Recipient Email" 
              id="email-recipient" 
              type="email" 
              value={emailRecipient} 
              onChange={setEmailRecipient} 
              required 
            />
            <FormField 
              label="Subject" 
              id="email-subject" 
              value={emailSubject} 
              onChange={setEmailSubject} 
              required 
            />
            <FormField 
              label="Message" 
              id="email-message" 
              type="textarea" 
              value={emailMessage} 
              onChange={setEmailMessage} 
              rows={5} 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
            <Button onClick={handleSendEmail} disabled={loading}>
              {loading ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Offer Letter Details</DialogTitle>
            <DialogDescription>
              {selectedHistoryItem && `${selectedHistoryItem.candidateName} - ${selectedHistoryItem.jobTitle}`}
            </DialogDescription>
          </DialogHeader>
          {selectedHistoryItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Candidate:</strong> {selectedHistoryItem.candidateName}
                </div>
                <div>
                  <strong>Position:</strong> {selectedHistoryItem.jobTitle}
                </div>
                <div>
                  <strong>Department:</strong> {selectedHistoryItem.department}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <Badge className="ml-2" variant={selectedHistoryItem.status === 'Draft' ? 'secondary' : 'default'}>
                    {selectedHistoryItem.status}
                  </Badge>
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(selectedHistoryItem.createdAt)}
                </div>
                {selectedHistoryItem.sentAt && (
                  <div>
                    <strong>Sent:</strong> {formatDate(selectedHistoryItem.sentAt)}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
            {selectedHistoryItem && selectedHistoryItem.status === 'Draft' && (
              <Button onClick={() => {
                handleLoadDraft(selectedHistoryItem.data);
                setShowDetailsDialog(false);
              }}>
                Edit Draft
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferLetterComponent;