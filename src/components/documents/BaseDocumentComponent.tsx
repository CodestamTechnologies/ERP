'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Mail, Printer, Save, CheckCircle } from 'lucide-react';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { DocumentHistoryDialog } from './DocumentHistoryDialog';
import { DocumentDraftsDialog } from './DocumentDraftsDialog';

const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

export interface FormFieldProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export const FormField = ({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [], required = false }: FormFieldProps) => (
  <div>
    <Label htmlFor={id}>{label} {required && <span className="text-red-500">*</span>}</Label>
    {type === 'textarea' ? (
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    ) : type === 'select' ? (
      <Select value={String(value)} onValueChange={onChange}>
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
        required={required}
      />
    )}
  </div>
);

interface BaseDocumentComponentProps<T extends Record<string, unknown>> {
  title: string;
  description: string;
  documentType: 'quotation' | 'purchase-order' | 'sales-order' | 'invoice' | 'service-agreement' | 'employment-contract' | 'vendor-agreement' | 'loi' | 'mou' | 'partnership';
  iconColor: string;
  data: T;
  setData: (data: T) => void;
  renderForm: () => ReactNode;
  renderPreview: () => ReactNode;
}

export function BaseDocumentComponent<T extends Record<string, unknown>>({
  title,
  description,
  documentType,
  iconColor,
  data,
  setData,
  renderForm,
  renderPreview,
}: BaseDocumentComponentProps<T>) {
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
  } = useDocumentManager(documentType);

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
      setData(draft.data as unknown as T);
      toast.success('Draft loaded successfully!');
    } else {
      toast.error('Failed to load draft');
    }
  };

  const handleLoadFromHistory = (historyId: string) => {
    const historyItem = loadFromHistory(historyId);
    if (historyItem) {
      setData(historyItem.data as unknown as T);
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

  const handleAction = (action: string) => {
    const actions = {
      generate: () => setActiveView('preview'),
      download: () => alert('PDF download functionality would be implemented here'),
      email: () => alert('Email functionality would be implemented here'),
      save: handleSaveDraft,
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
            <FileText className={`w-8 h-8 mr-3 ${iconColor}`} />
            {title}
          </h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className="flex space-x-2">
          <DocumentDraftsDialog
            drafts={drafts}
            isLoading={isLoading}
            onLoad={handleLoadDraft}
            onDelete={handleDeleteDraft}
            onClearAll={clearAllDrafts}
            documentType={documentType}
          />
          <DocumentHistoryDialog
            history={history}
            isLoading={isLoading}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
            onClearAll={clearAllHistory}
            documentType={documentType}
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
        <div className="space-y-6">
          {renderForm()}
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderPreview()}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});