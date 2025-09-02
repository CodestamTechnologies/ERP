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

interface PartnerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  representative: string;
  title: string;
  contribution: string;
  ownershipPercentage: string;
  signerName: string;
  signerTitle: string;
  signerDate: string;
}

interface PartnershipData {
  date: string;
  partnershipName: string;
  businessPurpose: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  partnershipType: string;
  effectiveDate: string;
  duration: string;
  initialCapital: string;
  profitSharingRatio: string;
  lossSharingRatio: string;
  capitalContributions: string;
  drawingLimits: string;
  managementStructure: string;
  decisionMaking: string;
  rolesResponsibilities: string;
  meetingRequirements: string;
  terminationClause: string;
  disputeResolution: string;
  nonCompeteClause: string;
  confidentialityClause: string;
  governingLaw: string;
  amendments: string;
}

interface AgreementData {
  partnership: PartnershipData;
  partner1: PartnerInfo;
  partner2: PartnerInfo;
}

const initialPartnerData = (): PartnerInfo => ({
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  representative: '',
  title: '',
  contribution: '',
  ownershipPercentage: '50',
  signerName: '',
  signerTitle: '',
  signerDate: new Date().toISOString().split('T')[0],
});

const initialPartnershipData = (): PartnershipData => ({
  date: new Date().toISOString().split('T')[0],
  partnershipName: '',
  businessPurpose: '',
  businessAddress: '',
  businessCity: '',
  businessState: '',
  businessZip: '',
  partnershipType: 'General Partnership',
  effectiveDate: new Date().toISOString().split('T')[0],
  duration: 'Indefinite',
  initialCapital: '',
  profitSharingRatio: '50:50',
  lossSharingRatio: '50:50',
  capitalContributions: '',
  drawingLimits: '',
  managementStructure: '',
  decisionMaking: '',
  rolesResponsibilities: '',
  meetingRequirements: '',
  terminationClause: '',
  disputeResolution: '',
  nonCompeteClause: '',
  confidentialityClause: '',
  governingLaw: 'Laws of India',
  amendments: '',
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

const PartnerForm = ({ partner, onChange, title }: {
  partner: PartnerInfo;
  onChange: (field: keyof PartnerInfo, value: string) => void;
  title: string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormField label="Organization/Individual Name" id={`${title}-name`} value={partner.name} onChange={(v) => onChange('name', v)} placeholder="Partner name" />
      <FormField label="Address" id={`${title}-address`} value={partner.address} onChange={(v) => onChange('address', v)} placeholder="Street address" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" id={`${title}-city`} value={partner.city} onChange={(v) => onChange('city', v)} placeholder="City" />
        <FormField label="State" id={`${title}-state`} value={partner.state} onChange={(v) => onChange('state', v)} placeholder="State" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ZIP Code" id={`${title}-zip`} value={partner.zip} onChange={(v) => onChange('zip', v)} placeholder="ZIP code" />
        <FormField label="Phone" id={`${title}-phone`} value={partner.phone} onChange={(v) => onChange('phone', v)} placeholder="Phone number" />
      </div>
      
      <FormField label="Email" id={`${title}-email`} type="email" value={partner.email} onChange={(v) => onChange('email', v)} placeholder="Email address" />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Representative Name" id={`${title}-rep`} value={partner.representative} onChange={(v) => onChange('representative', v)} placeholder="Representative name" />
        <FormField label="Title" id={`${title}-title`} value={partner.title} onChange={(v) => onChange('title', v)} placeholder="Job title" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Capital Contribution" id={`${title}-contribution`} value={partner.contribution} onChange={(v) => onChange('contribution', v)} placeholder="₹ 10,00,000" />
        <FormField label="Ownership %" id={`${title}-ownership`} value={partner.ownershipPercentage} onChange={(v) => onChange('ownershipPercentage', v)} placeholder="50" />
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Signature Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Signer Name" id={`${title}-signer-name`} value={partner.signerName} onChange={(v) => onChange('signerName', v)} placeholder="Full name" />
          <FormField label="Signer Title" id={`${title}-signer-title`} value={partner.signerTitle} onChange={(v) => onChange('signerTitle', v)} placeholder="Job title" />
        </div>
        <FormField label="Signature Date" id={`${title}-signer-date`} type="date" value={partner.signerDate} onChange={(v) => onChange('signerDate', v)} />
      </div>
    </CardContent>
  </Card>
);

const PartnerPreview = ({ partner, title }: { partner: PartnerInfo; title: string }) => (
  <div className="border border-gray-300 p-4 rounded">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <div className="text-gray-700">
      <div className="font-semibold">{partner.name}</div>
      <div>{partner.address}</div>
      <div>{partner.city}, {partner.state} {partner.zip}</div>
      <div>Phone: {partner.phone}</div>
      <div>Email: {partner.email}</div>
      {partner.representative && (
        <div className="mt-2">
          <div className="font-medium">Represented by:</div>
          <div>{partner.representative}, {partner.title}</div>
        </div>
      )}
      <div className="mt-2">
        <div className="font-medium">Ownership: {partner.ownershipPercentage}%</div>
      </div>
    </div>
  </div>
);

const SignatureBlock = ({ partner, title }: { partner: PartnerInfo; title: string }) => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
    <div className="border-b border-gray-400 w-64 mb-2"></div>
    <div className="font-semibold">{partner.signerName}</div>
    <div className="text-gray-700">{partner.signerTitle}</div>
    <div className="text-gray-700">{partner.name}</div>
    <div className="text-gray-600 text-sm mt-2">
      Date: {new Date(partner.signerDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </div>
  </div>
);

const PreviewSection = ({ title, children, show = true }: { title: string; children: React.ReactNode; show?: boolean }) => 
  show ? (
    <div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  ) : null;

const PartnershipAgreementComponent = () => {
  const [data, setData] = useState<AgreementData>({
    partnership: initialPartnershipData(),
    partner1: { ...initialPartnerData(), name: 'Codestam Technologies Pvt Ltd', address: '123 Business Park', city: 'Mumbai', state: 'Maharashtra', zip: '400001', phone: '+91 98765 43210', email: 'info@codestam.com' },
    partner2: initialPartnerData(),
  });

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');

  const updatePartnership = (field: keyof PartnershipData, value: string) => {
    setData(prev => ({ ...prev, partnership: { ...prev.partnership, [field]: value } }));
  };

  const updatePartner = (partner: 'partner1' | 'partner2', field: keyof PartnerInfo, value: string) => {
    setData(prev => ({ ...prev, [partner]: { ...prev[partner], [field]: value } }));
  };

  const partnershipTypeOptions = [
    { value: 'General Partnership', label: 'General Partnership' },
    { value: 'Limited Partnership', label: 'Limited Partnership' },
    { value: 'Limited Liability Partnership', label: 'Limited Liability Partnership' },
  ];

  const durationOptions = [
    { value: 'Indefinite', label: 'Indefinite' },
    { value: '5 years', label: '5 years' },
    { value: '10 years', label: '10 years' },
    { value: '15 years', label: '15 years' },
    { value: '20 years', label: '20 years' },
  ];

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const AgreementPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">PARTNERSHIP AGREEMENT</h1>
        <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
        {data.partnership.partnershipName && (
          <h2 className="text-lg font-semibold mt-4 text-gray-700">{data.partnership.partnershipName}</h2>
        )}
      </div>

      <div className="text-right mb-6">
        <p className="text-gray-600">Date: {formatDate(data.partnership.date)}</p>
      </div>

      <div className="mb-6 space-y-6 text-gray-800 leading-relaxed">
        <p>
          This Partnership Agreement Agreement is entered into on {formatDate(data.partnership.effectiveDate)} between the following parties:
        </p>

        {/* Partners Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PartnerPreview partner={data.partner1} title="PARTNER 1" />
          <PartnerPreview partner={data.partner2} title="PARTNER 2" />
        </div>

        <PreviewSection title="1. PARTNERSHIP FORMATION">
          <p>
            The parties hereby agree to form a {data.partnership.partnershipType} under the name {data.partnership.partnershipName} 
            for the purpose of {data.partnership.businessPurpose}.
          </p>
          {data.partnership.businessAddress && (
            <p className="mt-2">
              The principal place of business shall be located at {data.partnership.businessAddress}, 
              {data.partnership.businessCity}, {data.partnership.businessState} {data.partnership.businessZip}.
            </p>
          )}
        </PreviewSection>

        <PreviewSection title="2. TERM OF PARTNERSHIP">
          <p>
            This partnership shall commence on {formatDate(data.partnership.effectiveDate)} and shall continue for {data.partnership.duration.toLowerCase()}, 
            unless terminated earlier in accordance with the terms herein.
          </p>
        </PreviewSection>

        <PreviewSection title="3. CAPITAL CONTRIBUTIONS" show={!!(data.partnership.initialCapital || data.partnership.capitalContributions)}>
          {data.partnership.initialCapital && <p>The initial capital of the partnership shall be {data.partnership.initialCapital}.</p>}
          {data.partnership.capitalContributions && <p className="whitespace-pre-wrap mt-2">{data.partnership.capitalContributions}</p>}
        </PreviewSection>

        <PreviewSection title="4. PROFIT AND LOSS SHARING">
          <p>
            Profits shall be shared in the ratio of {data.partnership.profitSharingRatio} and losses shall be shared 
            in the ratio of {data.partnership.lossSharingRatio} between the partners.
          </p>
          {data.partnership.drawingLimits && <p className="mt-2">Drawing limits: {data.partnership.drawingLimits}</p>}
        </PreviewSection>

        {[
          { title: '5. MANAGEMENT STRUCTURE', content: data.partnership.managementStructure },
          { title: '6. DECISION MAKING', content: data.partnership.decisionMaking },
          { title: '7. ROLES AND RESPONSIBILITIES', content: data.partnership.rolesResponsibilities },
          { title: '8. MEETINGS', content: data.partnership.meetingRequirements },
          { title: '9. TERMINATION', content: data.partnership.terminationClause },
          { title: '10. NON-COMPETE CLAUSE', content: data.partnership.nonCompeteClause },
          { title: '11. CONFIDENTIALITY', content: data.partnership.confidentialityClause },
          { title: '12. DISPUTE RESOLUTION', content: data.partnership.disputeResolution },
        ].map(section => (
          <PreviewSection key={section.title} title={section.title} show={!!section.content}>
            <p className="whitespace-pre-wrap">{section.content}</p>
          </PreviewSection>
        ))}

        <PreviewSection title="13. GOVERNING LAW">
          <p>This Agreement shall be governed by and construed in accordance with the {data.partnership.governingLaw}.</p>
        </PreviewSection>

        <PreviewSection title="14. AMENDMENTS" show={!!data.partnership.amendments}>
          <p className="whitespace-pre-wrap">{data.partnership.amendments}</p>
        </PreviewSection>

        <PreviewSection title="15. GENERAL PROVISIONS">
          <p>
            This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, 
            representations, or agreements relating to the subject matter herein.
          </p>
        </PreviewSection>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <SignatureBlock partner={data.partner1} title="PARTNER 1" />
        <SignatureBlock partner={data.partner2} title="PARTNER 2" />
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This Partnership Agreement is confidential and proprietary</p>
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
            Partnership Agreement Generator
          </h1>
          <p className="text-gray-600 mt-1">Create comprehensive partnership agreements for business collaborations</p>
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
          {/* Partners */}
          <div className="space-y-6">
            <PartnerForm partner={data.partner1} onChange={(field, value) => updatePartner('partner1', field, value)} title="Partner 1 Information" />
            <PartnerForm partner={data.partner2} onChange={(field, value) => updatePartner('partner2', field, value)} title="Partner 2 Information" />
          </div>

          {/* Partnership Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Partnership Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Agreement Date" id="date" type="date" value={data.partnership.date} onChange={(v) => updatePartnership('date', v)} />
                <FormField label="Partnership Name" id="name" value={data.partnership.partnershipName} onChange={(v) => updatePartnership('partnershipName', v)} placeholder="ABC Partnership" />
                <FormField label="Business Purpose" id="purpose" type="textarea" value={data.partnership.businessPurpose} onChange={(v) => updatePartnership('businessPurpose', v)} placeholder="Describe the main business purpose..." />
                <FormField label="Business Address" id="address" value={data.partnership.businessAddress} onChange={(v) => updatePartnership('businessAddress', v)} placeholder="Principal place of business" />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="City" id="city" value={data.partnership.businessCity} onChange={(v) => updatePartnership('businessCity', v)} />
                  <FormField label="State" id="state" value={data.partnership.businessState} onChange={(v) => updatePartnership('businessState', v)} />
                  <FormField label="ZIP" id="zip" value={data.partnership.businessZip} onChange={(v) => updatePartnership('businessZip', v)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Partnership Type" id="type" type="select" value={data.partnership.partnershipType} onChange={(v) => updatePartnership('partnershipType', v)} options={partnershipTypeOptions} />
                  <FormField label="Duration" id="duration" type="select" value={data.partnership.duration} onChange={(v) => updatePartnership('duration', v)} options={durationOptions} />
                </div>
                
                <FormField label="Effective Date" id="effective" type="date" value={data.partnership.effectiveDate} onChange={(v) => updatePartnership('effectiveDate', v)} />
              </CardContent>
            </Card>

            {/* Financial & Legal Terms */}
            {[
              { title: 'Financial Terms', fields: [
                { label: 'Initial Capital', id: 'capital', field: 'initialCapital' as keyof PartnershipData, placeholder: '₹ 20,00,000' },
                { label: 'Profit Sharing Ratio', id: 'profit', field: 'profitSharingRatio' as keyof PartnershipData, placeholder: '50:50' },
                { label: 'Loss Sharing Ratio', id: 'loss', field: 'lossSharingRatio' as keyof PartnershipData, placeholder: '50:50' },
                { label: 'Capital Contributions Details', id: 'contributions', field: 'capitalContributions' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Drawing Limits', id: 'limits', field: 'drawingLimits' as keyof PartnershipData },
              ]},
              { title: 'Management & Operations', fields: [
                { label: 'Management Structure', id: 'mgmt', field: 'managementStructure' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Decision Making Process', id: 'decisions', field: 'decisionMaking' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Roles & Responsibilities', id: 'roles', field: 'rolesResponsibilities' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Meeting Requirements', id: 'meetings', field: 'meetingRequirements' as keyof PartnershipData, type: 'textarea' as const },
              ]},
              { title: 'Legal Terms', fields: [
                { label: 'Termination Clause', id: 'termination', field: 'terminationClause' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Non-Compete Clause', id: 'noncompete', field: 'nonCompeteClause' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Confidentiality Clause', id: 'confidentiality', field: 'confidentialityClause' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Dispute Resolution', id: 'disputes', field: 'disputeResolution' as keyof PartnershipData, type: 'textarea' as const },
                { label: 'Governing Law', id: 'law', field: 'governingLaw' as keyof PartnershipData, placeholder: 'Laws of India' },
                { label: 'Amendments', id: 'amendments', field: 'amendments' as keyof PartnershipData, type: 'textarea' as const },
              ]},
            ].map(section => (
              <Card key={section.title}>
                <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map(field => (
                    <FormField
                      key={field.id}
                      label={field.label}
                      id={field.id}
                      type={field.type || 'text'}
                      value={data.partnership[field.field]}
                      onChange={(v) => updatePartnership(field.field, v)}
                      placeholder={field.placeholder}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}

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
            <AgreementPreview />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PartnershipAgreementComponent;