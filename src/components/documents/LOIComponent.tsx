'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Mail, Printer, Save } from 'lucide-react';

interface PartyInfo {
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

interface RecipientInfo extends PartyInfo {
  name: string;
  title: string;
}

interface LOIData {
  date: string;
  subject: string;
  projectDescription: string;
  proposedTerms: string;
  timeline: string;
  budget: string;
  nextSteps: string;
  validityPeriod: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
}

interface AgreementData {
  loi: LOIData;
  sender: PartyInfo;
  recipient: RecipientInfo;
}

const initialSenderData = (): PartyInfo => ({
  company: 'Codestam Technologies Pvt Ltd',
  address: '123 Business Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  phone: '+91 98765 43210',
  email: 'info@codestam.com',
});

const initialRecipientData = (): RecipientInfo => ({
  company: '',
  name: '',
  title: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
});

const initialLOIData = (): LOIData => ({
  date: new Date().toISOString().split('T')[0],
  subject: '',
  projectDescription: '',
  proposedTerms: '',
  timeline: '',
  budget: '',
  nextSteps: '',
  validityPeriod: '30 days',
  signerName: '',
  signerTitle: '',
  signerDate: new Date().toISOString().split('T')[0],
});

const FormField = ({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [] }: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    {type === 'textarea' ? (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    ) : type === 'select' ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
);

const SenderForm = ({ sender, onChange }: {
  sender: PartyInfo;
  onChange: (field: keyof PartyInfo, value: string) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Sender Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField label="Company Name" id="sender-company" value={sender.company} onChange={(v) => onChange('company', v)} placeholder="Your company name" />
      <FormField label="Address" id="sender-address" value={sender.address} onChange={(v) => onChange('address', v)} placeholder="Street address" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" id="sender-city" value={sender.city} onChange={(v) => onChange('city', v)} placeholder="City" />
        <FormField label="State" id="sender-state" value={sender.state} onChange={(v) => onChange('state', v)} placeholder="State" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ZIP Code" id="sender-zip" value={sender.zip} onChange={(v) => onChange('zip', v)} placeholder="ZIP code" />
        <FormField label="Phone" id="sender-phone" value={sender.phone} onChange={(v) => onChange('phone', v)} placeholder="Phone number" />
      </div>
      
      <FormField label="Email" id="sender-email" type="email" value={sender.email} onChange={(v) => onChange('email', v)} placeholder="Email address" />
    </CardContent>
  </Card>
);

const RecipientForm = ({ recipient, onChange }: {
  recipient: RecipientInfo;
  onChange: (field: keyof RecipientInfo, value: string) => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Recipient Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField label="Company Name" id="recipient-company" value={recipient.company} onChange={(v) => onChange('company', v)} placeholder="Recipient company name" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Contact Name" id="recipient-name" value={recipient.name} onChange={(v) => onChange('name', v)} placeholder="Contact person name" />
        <FormField label="Title" id="recipient-title" value={recipient.title} onChange={(v) => onChange('title', v)} placeholder="Job title" />
      </div>
      
      <FormField label="Address" id="recipient-address" value={recipient.address} onChange={(v) => onChange('address', v)} placeholder="Street address" />
      
      <div className="grid grid-cols-3 gap-4">
        <FormField label="City" id="recipient-city" value={recipient.city} onChange={(v) => onChange('city', v)} placeholder="City" />
        <FormField label="State" id="recipient-state" value={recipient.state} onChange={(v) => onChange('state', v)} placeholder="State" />
        <FormField label="ZIP Code" id="recipient-zip" value={recipient.zip} onChange={(v) => onChange('zip', v)} placeholder="ZIP code" />
      </div>
    </CardContent>
  </Card>
);

const PreviewSection = ({ title, children, show = true }: { title: string; children: React.ReactNode; show?: boolean }) => 
  show ? (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  ) : null;

const LOIComponent = () => {
  const [data, setData] = useState<AgreementData>({
    loi: initialLOIData(),
    sender: initialSenderData(),
    recipient: initialRecipientData(),
  });

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');

  const updateLOI = (field: keyof LOIData, value: string) => {
    setData(prev => ({ ...prev, loi: { ...prev.loi, [field]: value } }));
  };

  const updateSender = (field: keyof PartyInfo, value: string) => {
    setData(prev => ({ ...prev, sender: { ...prev.sender, [field]: value } }));
  };

  const updateRecipient = (field: keyof RecipientInfo, value: string) => {
    setData(prev => ({ ...prev, recipient: { ...prev.recipient, [field]: value } }));
  };

  const validityOptions = [
    { value: '15 days', label: '15 days' },
    { value: '30 days', label: '30 days' },
    { value: '45 days', label: '45 days' },
    { value: '60 days', label: '60 days' },
    { value: '90 days', label: '90 days' },
  ];

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const LOIPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">LETTER OF INTENT</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* Date */}
      <div className="text-right mb-6">
        <p className="text-gray-600">Date: {formatDate(data.loi.date)}</p>
      </div>

      {/* Sender Information */}
      <div className="mb-6">
        <div className="font-semibold text-lg">{data.sender.company}</div>
        <div className="text-gray-700">
          {data.sender.address}<br />
          {data.sender.city}, {data.sender.state} {data.sender.zip}<br />
          Phone: {data.sender.phone}<br />
          Email: {data.sender.email}
        </div>
      </div>

      {/* Recipient Information */}
      <div className="mb-6">
        <div className="font-semibold">To:</div>
        <div className="text-gray-700">
          {data.recipient.name}, {data.recipient.title}<br />
          {data.recipient.company}<br />
          {data.recipient.address}<br />
          {data.recipient.city}, {data.recipient.state} {data.recipient.zip}
        </div>
      </div>

      {/* Subject */}
      <div className="mb-6">
        <div className="font-semibold">Subject: {data.loi.subject}</div>
      </div>

      {/* Body */}
      <div className="mb-6 space-y-4 text-gray-800 leading-relaxed">
        <p>Dear {data.recipient.name},</p>
        
        <p>
          This Letter of Intent LOI&quot; serves to express {data.sender.company}&apos;s serious interest in 
          establishing a business relationship with {data.recipient.company} regarding the following opportunity:
        </p>

        {[
          { title: 'Project Description:', content: data.loi.projectDescription },
          { title: 'Proposed Terms:', content: data.loi.proposedTerms },
          { title: 'Proposed Timeline:', content: data.loi.timeline },
          { title: 'Budget Consideration:', content: data.loi.budget },
          { title: 'Next Steps:', content: data.loi.nextSteps },
        ].map(section => (
          <PreviewSection key={section.title} title={section.title} show={!!section.content}>
            <p className="whitespace-pre-wrap">{section.content}</p>
          </PreviewSection>
        ))}

        <p>
          This Letter of Intent is non-binding and serves as a preliminary expression of interest. 
          It is valid for {data.loi.validityPeriod} from the date above, after which it will expire 
          unless renewed or superseded by a formal agreement.
        </p>

        <p>
          We look forward to discussing this opportunity further and working together to develop 
          a mutually beneficial partnership.
        </p>

        <p>Sincerely,</p>
      </div>

      {/* Signature */}
      <div className="mt-12">
        <div className="border-b border-gray-400 w-64 mb-2"></div>
        <div className="font-semibold">{data.loi.signerName}</div>
        <div className="text-gray-700">{data.loi.signerTitle}</div>
        <div className="text-gray-700">{data.sender.company}</div>
        <div className="text-gray-600 text-sm mt-2">
          Date: {formatDate(data.loi.signerDate)}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This Letter of Intent is confidential and proprietary to {data.sender.company}</p>
      </div>
    </div>
  );

  const handleAction = (action: string) => {
    const actions = {
      generate: () => setActiveView('preview'),
      download: () => alert('PDF download functionality would be implemented here'),
      email: () => alert('Email functionality would be implemented here'),
      save: () => alert('Draft saved successfully!'),
    };
    actions[action as keyof typeof actions]?.();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Letter of Intent (LOI) Generator
          </h1>
          <p className="text-gray-600 mt-1">Create professional letters of intent for business partnerships and collaborations</p>
        </div>
        
        <div className="flex space-x-2">
          {['form', 'preview'].map(view => (
            <Button
              key={view}
              variant={activeView === view ? 'default' : 'outline'}
              onClick={() => setActiveView(view as 'form' | 'preview')}
              className="flex items-center capitalize"
            >
              {view === 'form' ? <FileText className="w-4 h-4 mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
              {view}
            </Button>
          ))}
        </div>
      </div>

      {activeView === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Party Information */}
          <div className="space-y-6">
            <SenderForm sender={data.sender} onChange={updateSender} />
            <RecipientForm recipient={data.recipient} onChange={updateRecipient} />
          </div>

          {/* Right Column - LOI Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>LOI Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Date" id="date" type="date" value={data.loi.date} onChange={(v) => updateLOI('date', v)} />
                <FormField label="Subject" id="subject" value={data.loi.subject} onChange={(v) => updateLOI('subject', v)} placeholder="Letter of Intent for..." />
                
                {[
                  { label: 'Project Description', id: 'project', field: 'projectDescription' as keyof LOIData, placeholder: 'Describe the project or opportunity in detail...', rows: 4 },
                  { label: 'Proposed Terms', id: 'terms', field: 'proposedTerms' as keyof LOIData, placeholder: 'Outline the key terms and conditions...', rows: 3 },
                  { label: 'Timeline', id: 'timeline', field: 'timeline' as keyof LOIData, placeholder: 'Proposed project timeline and milestones...', rows: 3 },
                  { label: 'Budget Consideration', id: 'budget', field: 'budget' as keyof LOIData, placeholder: 'Budget range or financial considerations...', rows: 2 },
                  { label: 'Next Steps', id: 'steps', field: 'nextSteps' as keyof LOIData, placeholder: 'Proposed next steps and follow-up actions...', rows: 3 },
                ].map(field => (
                  <FormField
                    key={field.id}
                    label={field.label}
                    id={field.id}
                    type="textarea"
                    value={data.loi[field.field]}
                    onChange={(v) => updateLOI(field.field, v)}
                    placeholder={field.placeholder}
                    rows={field.rows}
                  />
                ))}
                
                <FormField 
                  label="Validity Period" 
                  id="validity" 
                  type="select" 
                  value={data.loi.validityPeriod} 
                  onChange={(v) => updateLOI('validityPeriod', v)} 
                  options={validityOptions} 
                />
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader><CardTitle>Signature</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Signer Name" id="signer-name" value={data.loi.signerName} onChange={(v) => updateLOI('signerName', v)} placeholder="Full name of the person signing" />
                <FormField label="Signer Title" id="signer-title" value={data.loi.signerTitle} onChange={(v) => updateLOI('signerTitle', v)} placeholder="Job title of the signer" />
                <FormField label="Signature Date" id="signer-date" type="date" value={data.loi.signerDate} onChange={(v) => updateLOI('signerDate', v)} />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleAction('generate')} className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
              <Button variant="outline" onClick={() => handleAction('save')} className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              {[
                { label: 'Edit', action: 'form', icon: FileText },
                { label: 'Download PDF', action: 'download', icon: Download },
                { label: 'Send Email', action: 'email', icon: Mail, variant: 'outline' as const },
                { label: 'Print', action: 'print', icon: Printer, variant: 'outline' as const },
              ].map(btn => (
                <Button
                  key={btn.action}
                  onClick={() => btn.action === 'form' ? setActiveView('form') : handleAction(btn.action)}
                  variant={btn.variant || 'default'}
                  className="flex items-center"
                >
                  <btn.icon className="w-4 h-4 mr-2" />
                  {btn.label}
                </Button>
              ))}
            </div>
            <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <LOIPreview />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LOIComponent;