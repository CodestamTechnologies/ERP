'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Mail, Printer, Save } from 'lucide-react';
import { AgreementData, PartnerInfo, PartnershipData } from '@/types/partnership';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';
import PartnerForm from './Form';
import AgreementPreview from './AggrementPReview';
import { EmailDialog } from '../LetterofIntent/SendMailDialog';

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

const FormField = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  rows = 3,
  options = [],
}: {
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
      <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
    ) : type === 'select' ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const PartnershipAgreementComponent: React.FC = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<AgreementData>({
    partnership: initialPartnershipData(),
    partner1: {
      ...initialPartnerData(),
      name: 'Codestam Technologies Pvt Ltd',
      address: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      phone: '+91 98765 43210',
      email: 'info@codestam.com',
    },
    partner2: initialPartnerData(),
  });

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const updatePartnership = (field: keyof PartnershipData, value: string) => {
    setData((prev) => ({ ...prev, partnership: { ...prev.partnership, [field]: value } }));
  };

  const updatePartner = (partner: 'partner1' | 'partner2', field: keyof PartnerInfo, value: string) => {
    setData((prev) => ({ ...prev, [partner]: { ...prev[partner], [field]: value } }));
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

 
  const handleEmailSend = async (email: string) => {
    if (!previewRef.current) return;

    try {
      // Generate PDF blob
      const opt = {
        margin: 0.5,
        filename: "Memorandom_of_understanding.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf()
        .from(previewRef.current)
        .set(opt)
        .outputPdf("blob");

      // Convert to Base64
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

      // Send to API
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: `Letter of Intent from `,
          pdf: base64Pdf,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`PDF sent to ${email} successfully!`);
      } else {
        toast.error("Failed to send email");
      }
    } catch (err) {
      console.error("Email error:", err);
      toast.error("Something went wrong while sending email");
    }
  };

  const handleAction = (action: string) => {
    const actions = {
      generate: () => setActiveView('preview'),
      download: async () => {
        if (previewRef.current) {
          const opt = {
            margin: 0.5,
            filename: `MOU_${data.partner1.title || "Draft"}.pdf`,  // ✅ Correct
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          };
          await html2pdf().from(previewRef.current).set(opt).save();
        } else {
          toast.error("Nothing to download — preview is empty");
        }
      },

      email: () => setEmailDialogOpen(true),
      print: async () => {
        if (previewRef.current) {
          const opt = {
            margin: 0.5,
            filename: `partnership || "Draft"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
          };

          // Generate PDF as Blob
          const pdfBlob = await html2pdf()
            .from(previewRef.current)
            .set(opt)
            .outputPdf("blob");

          // Create blob URL
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Open in new window and trigger print
          const newWindow = window.open(pdfUrl);
          if (newWindow) {
            newWindow.onload = () => {
              newWindow.print();
            };
          }
        } else {
          toast.error("Nothing to print — preview is empty");
        }
      },


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
          <p className="text-gray-600 mt-1">
            Create comprehensive partnership agreements for business collaborations
          </p>
        </div>

        <div className="flex space-x-2">
          {['form', 'preview'].map((view) => (
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
            <PartnerForm
              partner={data.partner1}
              onChange={(field, value) => updatePartner('partner1', field, value)}
              title="Partner 1 Information"
            />
            <PartnerForm
              partner={data.partner2}
              onChange={(field, value) => updatePartner('partner2', field, value)}
              title="Partner 2 Information"
            />
          </div>

          {/* Partnership Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="Agreement Date"
                  id="date"
                  type="date"
                  value={data.partnership.date}
                  onChange={(v) => updatePartnership('date', v)}
                />
                <FormField
                  label="Partnership Name"
                  id="name"
                  value={data.partnership.partnershipName}
                  onChange={(v) => updatePartnership('partnershipName', v)}
                  placeholder="ABC Partnership"
                />
                <FormField
                  label="Business Purpose"
                  id="purpose"
                  type="textarea"
                  value={data.partnership.businessPurpose}
                  onChange={(v) => updatePartnership('businessPurpose', v)}
                  placeholder="Describe the main business purpose..."
                />
                <FormField
                  label="Business Address"
                  id="address"
                  value={data.partnership.businessAddress}
                  onChange={(v) => updatePartnership('businessAddress', v)}
                  placeholder="Principal place of business"
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="City"
                    id="city"
                    value={data.partnership.businessCity}
                    onChange={(v) => updatePartnership('businessCity', v)}
                  />
                  <FormField
                    label="State"
                    id="state"
                    value={data.partnership.businessState}
                    onChange={(v) => updatePartnership('businessState', v)}
                  />
                  <FormField
                    label="ZIP"
                    id="zip"
                    value={data.partnership.businessZip}
                    onChange={(v) => updatePartnership('businessZip', v)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Partnership Type"
                    id="type"
                    type="select"
                    value={data.partnership.partnershipType}
                    onChange={(v) => updatePartnership('partnershipType', v)}
                    options={partnershipTypeOptions}
                  />
                  <FormField
                    label="Duration"
                    id="duration"
                    type="select"
                    value={data.partnership.duration}
                    onChange={(v) => updatePartnership('duration', v)}
                    options={durationOptions}
                  />
                </div>

                <FormField
                  label="Effective Date"
                  id="effective"
                  type="date"
                  value={data.partnership.effectiveDate}
                  onChange={(v) => updatePartnership('effectiveDate', v)}
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleAction('generate')} className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
              <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center">
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
              ].map((btn) => (
                <Button
                  key={btn.action}
                  onClick={() => (btn.action === 'form' ? setActiveView('form') : handleAction(btn.action ))}
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
          <EmailDialog
            open={emailDialogOpen}
            onClose={() => setEmailDialogOpen(false)}
            onSend={handleEmailSend}
          />
          <motion.div
            ref={previewRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AgreementPreview data={data} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PartnershipAgreementComponent;
