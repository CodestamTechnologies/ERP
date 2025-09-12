'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, FileText, Mail, Printer, Save } from 'lucide-react';
import { AgreementData, MOUData, PartyInfo } from '@/types/memorandomOFUnderstanding';
import { FormField } from './FormFiels';
import { PartyForm } from './PartyForm';

import html2pdf from 'html2pdf.js';
import { EmailDialog } from '../LetterofIntent/SendMailDialog';
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

const initialPartyData = (): PartyInfo => ({
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  representative: '',
  title: '',
  signerName: '',
  signerTitle: '',
  signerDate: new Date().toISOString().split('T')[0],
});

const initialMOUData = (): MOUData => ({
  date: new Date().toISOString().split('T')[0],
  title: '',
  purpose: '',
  background: '',
  objectives: '',
  scopeOfWork: '',
  responsibilities: '',
  duration: '12 months',
  effectiveDate: new Date().toISOString().split('T')[0],
  terminationClause: '',
  confidentiality: '',
  intellectualProperty: '',
  disputeResolution: '',
  governingLaw: 'Laws of India',
  amendments: '',
});


const PartyPreview = ({ party, title }: { party: PartyInfo; title: string }) => (
  <div className="border border-gray-300 p-4 rounded">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <div className="text-gray-700">
      <div className="font-semibold">{party.name}</div>
      <div>{party.address}</div>
      <div>{party.city}, {party.state} {party.zip}</div>
      <div>Phone: {party.phone}</div>
      <div>Email: {party.email}</div>
      {party.representative && (
        <div className="mt-2">
          <div className="font-medium">Represented by:</div>
          <div>{party.representative}, {party.title}</div>
        </div>
      )}
    </div>
  </div>
);

const SignatureBlock = ({ party, title }: { party: PartyInfo; title: string }) => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
    <div className="border-b border-gray-400 w-64 mb-2"></div>
    <div className="font-semibold">{party.signerName}</div>
    <div className="text-gray-700">{party.signerTitle}</div>
    <div className="text-gray-700">{party.name}</div>
    <div className="text-gray-600 text-sm mt-2">
      Date: {new Date(party.signerDate).toLocaleDateString('en-US', {
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

const MOUComponent = () => {
  const [data, setData] = useState<AgreementData>({
    mou: initialMOUData(),
    partyA: { ...initialPartyData(), name: 'Codestam Technologies Pvt Ltd', address: '123 Business Park', city: 'Mumbai', state: 'Maharashtra', zip: '400001', phone: '+91 98765 43210', email: 'info@codestam.com' },
    partyB: initialPartyData(),
  });

  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const previewRef = useRef<HTMLDivElement>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const updateMOU = (field: keyof MOUData, value: string) => {
    setData(prev => ({ ...prev, mou: { ...prev.mou, [field]: value } }));
  };

  const updateParty = (party: 'partyA' | 'partyB', field: keyof PartyInfo, value: string) => {
    setData(prev => ({ ...prev, [party]: { ...prev[party], [field]: value } }));
  };

  const durationOptions = [
    { value: '6 months', label: '6 months' },
    { value: '12 months', label: '12 months' },
    { value: '18 months', label: '18 months' },
    { value: '24 months', label: '24 months' },
    { value: '36 months', label: '36 months' },
    { value: 'indefinite', label: 'Indefinite' },
  ];

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const MOUPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">MEMORANDUM OF UNDERSTANDING</h1>
        <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
        {data.mou.title && (
          <h2 className="text-lg font-semibold mt-4 text-gray-700">{data.mou.title}</h2>
        )}
      </div>

      <div className="text-right mb-6">
        <p className="text-gray-600">Date: {formatDate(data.mou.date)}</p>
      </div>

      {/* Parties */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">PARTIES TO THE AGREEMENT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PartyPreview party={data.partyA} title="PARTY A" />
          <PartyPreview party={data.partyB} title="PARTY B" />
        </div>
      </div>

      {/* MOU Content */}
      <div className="mb-6 space-y-6 text-gray-800 leading-relaxed">
        <p>
          This Memorandum of Understanding MOU is entered into on {formatDate(data.mou.effectiveDate)} between {data.partyA.name} (Party A) and {data.partyB.name} (Party B), collectively referred to as the Parties.
        </p>

        {[
          { title: '1. PURPOSE', content: data.mou.purpose },
          { title: '2. BACKGROUND', content: data.mou.background },
          { title: '3. OBJECTIVES', content: data.mou.objectives },
          { title: '4. SCOPE OF WORK', content: data.mou.scopeOfWork },
          { title: '5. RESPONSIBILITIES', content: data.mou.responsibilities },
        ].map(section => (
          <PreviewSection key={section.title} title={section.title} show={!!section.content}>
            <p className="whitespace-pre-wrap">{section.content}</p>
          </PreviewSection>
        ))}

        <PreviewSection title="6. DURATION">
          <p>
            This MOU shall be effective from {formatDate(data.mou.effectiveDate)} and shall remain in force for a period of {data.mou.duration}, unless terminated earlier in accordance with the terms herein.
          </p>
        </PreviewSection>

        {[
          { title: '7. TERMINATION', content: data.mou.terminationClause },
          { title: '8. CONFIDENTIALITY', content: data.mou.confidentiality },
          { title: '9. INTELLECTUAL PROPERTY', content: data.mou.intellectualProperty },
          { title: '10. DISPUTE RESOLUTION', content: data.mou.disputeResolution },
        ].map(section => (
          <PreviewSection key={section.title} title={section.title} show={!!section.content}>
            <p className="whitespace-pre-wrap">{section.content}</p>
          </PreviewSection>
        ))}

        <PreviewSection title="11. GOVERNING LAW">
          <p>This MOU shall be governed by and construed in accordance with the {data.mou.governingLaw}.</p>
        </PreviewSection>

        <PreviewSection title="12. AMENDMENTS" show={!!data.mou.amendments}>
          <p className="whitespace-pre-wrap">{data.mou.amendments}</p>
        </PreviewSection>

        <PreviewSection title="13. GENERAL PROVISIONS">
          <p>
            This MOU represents the entire understanding between the Parties and supersedes all prior negotiations,
            representations, or agreements relating to the subject matter herein. This MOU may be executed in
            counterparts, each of which shall be deemed an original and all of which together shall constitute
            one and the same instrument.
          </p>
        </PreviewSection>
      </div>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <SignatureBlock party={data.partyA} title="PARTY A" />
        <SignatureBlock party={data.partyB} title="PARTY B" />
      </div>

      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>This Memorandum of Understanding is confidential and proprietary</p>
        <p>Page 1 of 1</p>
      </div>
    </div>
  );
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
          subject: `Letter of Intent from ${data.mou}`,
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
            filename: `MOU_${data.mou.title || "Draft"}.pdf`,  // ✅ Correct
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
            filename: `MOU_${data.mou.title || "Draft"}.pdf`,
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
            Memorandum of Understanding (MOU) Generator
          </h1>
          <p className="text-gray-600 mt-1">Create professional memorandums of understanding for business partnerships and collaborations</p>
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
          {/* Parties */}
          <div className="space-y-6">
            <PartyForm party={data.partyA} onChange={(field, value) => updateParty('partyA', field, value)} title="Party A Information" />
            <PartyForm party={data.partyB} onChange={(field, value) => updateParty('partyB', field, value)} title="Party B Information" />
          </div>

          {/* MOU Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>MOU Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Date" id="date" type="date" value={data.mou.date} onChange={(v) => updateMOU('date', v)} />
                <FormField label="MOU Title" id="title" value={data.mou.title} onChange={(v) => updateMOU('title', v)} placeholder="Memorandum of Understanding for..." />
                <FormField label="Purpose" id="purpose" type="textarea" value={data.mou.purpose} onChange={(v) => updateMOU('purpose', v)} placeholder="State the main purpose of this MOU..." />
                <FormField label="Background" id="background" type="textarea" value={data.mou.background} onChange={(v) => updateMOU('background', v)} placeholder="Provide background information and context..." />
                <FormField label="Objectives" id="objectives" type="textarea" value={data.mou.objectives} onChange={(v) => updateMOU('objectives', v)} placeholder="List the key objectives and goals..." />
                <FormField label="Scope of Work" id="scope" type="textarea" value={data.mou.scopeOfWork} onChange={(v) => updateMOU('scopeOfWork', v)} placeholder="Define the scope of work and deliverables..." rows={4} />
                <FormField label="Responsibilities" id="responsibilities" type="textarea" value={data.mou.responsibilities} onChange={(v) => updateMOU('responsibilities', v)} placeholder="Outline responsibilities of each party..." rows={4} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Duration" id="duration" type="select" value={data.mou.duration} onChange={(v) => updateMOU('duration', v)} options={durationOptions} />
                  <FormField label="Effective Date" id="effective" type="date" value={data.mou.effectiveDate} onChange={(v) => updateMOU('effectiveDate', v)} />
                </div>
              </CardContent>
            </Card>

            {/* Additional Terms */}
            <Card>
              <CardHeader><CardTitle>Additional Terms</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Termination Clause', id: 'termination', field: 'terminationClause' as keyof MOUData, placeholder: 'Define termination conditions and procedures...' },
                  { label: 'Confidentiality', id: 'confidentiality', field: 'confidentiality' as keyof MOUData, placeholder: 'Specify confidentiality requirements...' },
                  { label: 'Intellectual Property', id: 'ip', field: 'intellectualProperty' as keyof MOUData, placeholder: 'Define intellectual property rights and ownership...' },
                  { label: 'Dispute Resolution', id: 'disputes', field: 'disputeResolution' as keyof MOUData, placeholder: 'Specify dispute resolution mechanisms...' },
                  { label: 'Amendments', id: 'amendments', field: 'amendments' as keyof MOUData, placeholder: 'Specify how amendments can be made...', rows: 2 },
                ].map(field => (
                  <FormField
                    key={field.id}
                    label={field.label}
                    id={field.id}
                    type="textarea"
                    value={data.mou[field.field]}
                    onChange={(v) => updateMOU(field.field, v)}
                    placeholder={field.placeholder}
                    rows={field.rows || 3}
                  />
                ))}

                <FormField label="Governing Law" id="law" value={data.mou.governingLaw} onChange={(v) => updateMOU('governingLaw', v)} placeholder="Laws of India" />
              </CardContent>
            </Card>

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
          <EmailDialog
            open={emailDialogOpen}
            onClose={() => setEmailDialogOpen(false)}
            onSend={handleEmailSend}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div ref={previewRef}>
              <MOUPreview />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MOUComponent;