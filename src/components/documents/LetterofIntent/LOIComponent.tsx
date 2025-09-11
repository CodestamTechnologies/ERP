'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Mail, Printer, Save, CheckCircle } from 'lucide-react';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { DocumentHistoryDialog } from '../DocumentHistoryDialog';
import { DocumentDraftsDialog } from '../DocumentDraftsDialog';
import { AgreementData, initialLOIData, initialRecipientData, initialSenderData, LOIData, PartyInfo, RecipientInfo } from '@/types/letterofIntent';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { EmailDialog } from './SendMailDialog';
import { LOIPreviewPage } from './PreviewDoc';
import { generatePdf } from '@/lib/utils/DocumentsAction';

// Simple toast replacement
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};


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



const LOIComponent = () => {
  const [data, setData] = useState<AgreementData>({
    loi: initialLOIData(),
    sender: initialSenderData(),
    recipient: initialRecipientData(),
  });
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');

  const {
    drafts,
    history,
    isLoading,
    saveDraft,
    saveToHistory,
    loadDraft,
    loadFromHistory,
    deleteDraft,
    deleteFromHistory,
    clearAllDrafts,
    clearAllHistory,
  } = useDocumentManager('loi');

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



  // Document management handlers
  const handleSaveDraft = async () => {
    const result = await saveDraft(data as unknown as Record<string, unknown>);
    if (result.success) {
      toast.success('Draft saved successfully!');
    } else {
      toast.error('Failed to save draft');
    }
  };

  const handleSaveToHistory = async () => {
    const result = await saveToHistory(data as unknown as Record<string, unknown>);
    if (result.success) {
      toast.success('Document saved to history!');
    } else {
      toast.error('Failed to save to history');
    }
  };

  const handleLoadDraft = (draftId: string) => {
    const draft = loadDraft(draftId);
    if (draft) {
      setData(draft.data as unknown as AgreementData);
      toast.success('Draft loaded successfully!');
    } else {
      toast.error('Failed to load draft');
    }
  };

  const handleLoadFromHistory = (historyId: string) => {
    const historyItem = loadFromHistory(historyId);
    if (historyItem) {
      setData(historyItem.data as unknown as AgreementData);
      toast.success('Document loaded from history!');
    } else {
      toast.error('Failed to load from history');
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    const result = await deleteDraft(draftId);
    if (result.success) {
      toast.success('Draft deleted successfully!');
    } else {
      toast.error('Failed to delete draft');
    }
  };

  const handleDeleteFromHistory = async (historyId: string) => {
    const result = await deleteFromHistory(historyId);
    if (result.success) {
      toast.success('Document removed from history!');
    } else {
      toast.error('Failed to remove from history');
    }
  };
  const handleEmailSend = async (email: string) => {
    // Generate PDF as Base64 from the current previewRef
    const base64Pdf = await generatePdf(previewRef, "base64", "Memorandom_of_understanding.pdf");
    if (!base64Pdf) return;

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: `Letter of Intent from ${data.sender.company}`,
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

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const handleAction = async (action: string) => {
    const filename = "Memorandom_of_understanding.pdf"; // Keep consistent content

    const actions = {
      generate: () => setActiveView("preview"),

      download: () => generatePdf(previewRef, "save", filename),

      email: () => setEmailDialogOpen(true),

      save: handleSaveDraft,

      print: async () => {
        const pdfBlob = (await generatePdf(previewRef, "blob", filename)) as Blob | null;
        if (!pdfBlob) return;

        const pdfUrl = URL.createObjectURL(pdfBlob);
        const newWindow = window.open(pdfUrl);
        if (newWindow) {
          newWindow.onload = () => newWindow.print();
        }
      },

      saveToHistory: handleSaveToHistory,
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
          <DocumentDraftsDialog
            drafts={drafts}
            isLoading={isLoading}
            onLoad={handleLoadDraft}
            onDelete={handleDeleteDraft}
            onClearAll={clearAllDrafts}
            documentType="loi"
          />
          <DocumentHistoryDialog
            history={history}
            isLoading={isLoading}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
            onClearAll={clearAllHistory}
            documentType="loi"
          />
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
              <Button onClick={() => setActiveView('preview')} className="flex items-center">
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
            <EmailDialog
              open={emailDialogOpen}
              onClose={() => setEmailDialogOpen(false)}
              onSend={handleEmailSend}
            />

            <div className="flex space-x-2">
              <Button onClick={() => handleAction('saveToHistory')} className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save to History
              </Button>
              <Button onClick={() => handleAction('save')} variant="outline" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          <motion.div ref={previewRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <LOIPreviewPage
              data={data}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LOIComponent;