'use client';

import { useState, useCallback, useEffect } from 'react';
import { OfferLetterData, OfferLetterTemplate, OfferLetterHistory } from '@/types/offerLetter';

interface UseOfferLetterReturn {
  // State
  data: OfferLetterData;
  templates: OfferLetterTemplate[];
  history: OfferLetterHistory[];
  loading: boolean;
  saving: boolean;
  
  // Actions
  updateData: (newData: Partial<OfferLetterData>) => void;
  saveAsDraft: () => Promise<void>;
  saveAsTemplate: (name: string, description: string) => Promise<void>;
  loadTemplate: (templateId: string) => void;
  generatePDF: () => Promise<void>;
  sendEmail: (recipientEmail: string, subject: string, message: string) => Promise<void>;
  
  // Validation
  validateData: () => { isValid: boolean; errors: string[] };
  
  // Utilities
  resetData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const initialData = (): OfferLetterData => ({
  company: {
    name: 'Codestam Technologies Pvt Ltd',
    address: '123 Tech Park, Sector 5',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    phone: '+91 98765 43210',
    email: 'hr@codestam.com',
    website: 'www.codestam.com',
  },
  candidate: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  },
  job: {
    title: '',
    department: '',
    reportingManager: '',
    employmentType: 'Full-time',
    startDate: '',
    workLocation: 'Office',
    workSchedule: 'Monday to Friday, 9:00 AM to 6:00 PM',
  },
  compensation: {
    baseSalary: '',
    currency: 'INR',
    payFrequency: 'Monthly',
    bonus: '',
    stockOptions: '',
    otherCompensation: '',
  },
  benefits: {
    healthInsurance: true,
    dentalInsurance: false,
    visionInsurance: false,
    lifeInsurance: true,
    retirementPlan: true,
    paidTimeOff: '21 days annually',
    sickLeave: '12 days annually',
    maternityPaternityLeave: 'As per company policy',
    professionalDevelopment: true,
    gymMembership: false,
    flexibleWorkArrangements: true,
    otherBenefits: '',
  },
  terms: {
    probationPeriod: '6 months',
    noticePeriod: '30 days',
    confidentialityAgreement: true,
    nonCompeteClause: false,
    nonSolicitationClause: false,
    backgroundCheck: true,
    drugTest: false,
    offerValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    additionalTerms: '',
  },
  letterDate: new Date().toISOString().split('T')[0],
  signerName: '',
  signerTitle: 'HR Director',
  hrContactName: '',
  hrContactEmail: '',
  hrContactPhone: '',
});

export const useOfferLetter = (): UseOfferLetterReturn => {
  const [data, setData] = useState<OfferLetterData>(initialData());
  const [templates, setTemplates] = useState<OfferLetterTemplate[]>([]);
  const [history, setHistory] = useState<OfferLetterHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('offerLetterData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    const savedTemplates = localStorage.getItem('offerLetterTemplates');
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        setTemplates(parsedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    }

    const savedHistory = localStorage.getItem('offerLetterHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Auto-save data to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('offerLetterData', JSON.stringify(data));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data]);

  const updateData = useCallback((newData: Partial<OfferLetterData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const saveAsDraft = useCallback(async (): Promise<void> => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const draftEntry: OfferLetterHistory = {
        id: Date.now().toString(),
        candidateName: `${data.candidate.firstName} ${data.candidate.lastName}`.trim() || 'Unnamed Candidate',
        jobTitle: data.job.title || 'Untitled Position',
        department: data.job.department || 'Unknown Department',
        status: 'Draft',
        createdAt: new Date().toISOString(),
        data: { ...data },
      };

      const updatedHistory = [draftEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('offerLetterHistory', JSON.stringify(updatedHistory));
      
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [data, history]);

  const saveAsTemplate = useCallback(async (name: string, description: string): Promise<void> => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const template: OfferLetterTemplate = {
        id: Date.now().toString(),
        name,
        description,
        data: { ...data },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
      };

      const updatedTemplates = [...templates, template];
      setTemplates(updatedTemplates);
      localStorage.setItem('offerLetterTemplates', JSON.stringify(updatedTemplates));
      
      console.log('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [data, templates]);

  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setData(prev => ({ ...prev, ...template.data }));
    }
  }, [templates]);

  const generatePDF = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate and download a PDF
      console.log('PDF generated successfully');
      
      // Create a blob URL for download simulation
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
      element.setAttribute('download', `offer-letter-${data.candidate.firstName}-${data.candidate.lastName}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data]);

  const sendEmail = useCallback(async (recipientEmail: string, subject: string, message: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would send an email via API
      console.log('Email sent successfully to:', recipientEmail);
      
      // Update history with sent status
      const sentEntry: OfferLetterHistory = {
        id: Date.now().toString(),
        candidateName: `${data.candidate.firstName} ${data.candidate.lastName}`.trim(),
        jobTitle: data.job.title,
        department: data.job.department,
        status: 'Sent',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        data: { ...data },
      };

      const updatedHistory = [sentEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('offerLetterHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data, history]);

  const validateData = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Company validation
    if (!data.company.name.trim()) errors.push('Company name is required');
    if (!data.company.email.trim()) errors.push('Company email is required');
    if (!data.company.phone.trim()) errors.push('Company phone is required');

    // Candidate validation
    if (!data.candidate.firstName.trim()) errors.push('Candidate first name is required');
    if (!data.candidate.lastName.trim()) errors.push('Candidate last name is required');
    if (!data.candidate.email.trim()) errors.push('Candidate email is required');

    // Job validation
    if (!data.job.title.trim()) errors.push('Job title is required');
    if (!data.job.department.trim()) errors.push('Department is required');
    if (!data.job.startDate.trim()) errors.push('Start date is required');

    // Compensation validation
    if (!data.compensation.baseSalary.trim()) errors.push('Base salary is required');

    // Signature validation
    if (!data.signerName.trim()) errors.push('Signer name is required');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [data]);

  const resetData = useCallback(() => {
    setData(initialData());
    localStorage.removeItem('offerLetterData');
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Basic validation
      if (typeof parsedData === 'object' && parsedData !== null) {
        setData(prev => ({ ...prev, ...parsedData }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  return {
    // State
    data,
    templates,
    history,
    loading,
    saving,
    
    // Actions
    updateData,
    saveAsDraft,
    saveAsTemplate,
    loadTemplate,
    generatePDF,
    sendEmail,
    
    // Validation
    validateData,
    
    // Utilities
    resetData,
    exportData,
    importData,
  };
};