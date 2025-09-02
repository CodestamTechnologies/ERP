'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Types for Invoices System
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  notes?: string;
  terms?: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  paidAt?: string;
  lineItems: InvoiceLineItem[];
  payments: InvoicePayment[];
  attachments: InvoiceAttachment[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  totalAmount: number;
  productId?: string;
  productName?: string;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'online';
  reference?: string;
  notes?: string;
}

export interface InvoiceAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  billDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue';
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lineItems: BillLineItem[];
  payments: BillPayment[];
  attachments: BillAttachment[];
}

export interface BillLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalAmount: number;
  category?: string;
}

export interface BillPayment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface BillAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string;
  paymentTerms: number; // days
  creditLimit?: number;
  totalInvoiced: number;
  totalPaid: number;
  outstandingAmount: number;
  lastInvoiceDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'modern' | 'classic' | 'minimal' | 'professional';
  showLogo: boolean;
  showCompanyDetails: boolean;
  showPaymentTerms: boolean;
  showNotes: boolean;
  customFields: TemplateCustomField[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  isRequired: boolean;
  defaultValue?: string;
}

export interface InvoiceFilters {
  search: string;
  status?: string;
  customer?: string;
  dateRange?: string;
  amountRange?: string;
}

export interface InvoiceSummary {
  totalInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  paidAmount: number;
  outstandingAmount: number;
  monthlyRevenue: number;
  monthlyInvoices: number;
  monthlyTarget: number;
  averageInvoiceValue: number;
  averagePaymentTime: number;
  topCustomers: { [key: string]: number };
}

// Mock Data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1-555-0101',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    taxId: 'TAX123456789',
    paymentTerms: 30,
    creditLimit: 50000,
    totalInvoiced: 125000,
    totalPaid: 98000,
    outstandingAmount: 27000,
    lastInvoiceDate: '2024-01-20T00:00:00Z',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'cust-002',
    name: 'TechStart Inc.',
    email: 'finance@techstart.com',
    phone: '+1-555-0102',
    address: '456 Innovation Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    paymentTerms: 15,
    creditLimit: 25000,
    totalInvoiced: 45000,
    totalPaid: 45000,
    outstandingAmount: 0,
    lastInvoiceDate: '2024-01-18T00:00:00Z',
    isActive: true,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
];

const MOCK_TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'template-001',
    name: 'Modern Professional',
    description: 'Clean, modern design with company branding',
    isDefault: true,
    logoUrl: '/templates/modern-logo.png',
    primaryColor: '#3B82F6',
    secondaryColor: '#F3F4F6',
    fontFamily: 'Inter',
    layout: 'modern',
    showLogo: true,
    showCompanyDetails: true,
    showPaymentTerms: true,
    showNotes: true,
    customFields: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-002',
    name: 'Classic Business',
    description: 'Traditional business invoice layout',
    isDefault: false,
    primaryColor: '#1F2937',
    secondaryColor: '#E5E7EB',
    fontFamily: 'Times New Roman',
    layout: 'classic',
    showLogo: true,
    showCompanyDetails: true,
    showPaymentTerms: true,
    showNotes: false,
    customFields: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-003',
    name: 'Minimal Clean',
    description: 'Simple, clean design with minimal elements',
    isDefault: false,
    primaryColor: '#10B981',
    secondaryColor: '#F0FDF4',
    fontFamily: 'Arial',
    layout: 'minimal',
    showLogo: false,
    showCompanyDetails: true,
    showPaymentTerms: true,
    showNotes: false,
    customFields: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2024-001',
    customerId: 'cust-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    customerAddress: '123 Business Ave, New York, NY 10001',
    issueDate: '2024-01-15T00:00:00Z',
    dueDate: '2024-02-14T00:00:00Z',
    status: 'sent',
    currency: 'USD',
    subtotal: 10000.00,
    taxAmount: 800.00,
    discountAmount: 0,
    totalAmount: 10800.00,
    paidAmount: 0,
    balanceAmount: 10800.00,
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days',
    templateId: 'template-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    sentAt: '2024-01-15T14:00:00Z',
    lineItems: [
      {
        id: 'line-001',
        description: 'Web Development Services',
        quantity: 40,
        unitPrice: 150.00,
        taxRate: 8.0,
        discountRate: 0,
        totalAmount: 6000.00,
        productName: 'Development Hours'
      },
      {
        id: 'line-002',
        description: 'UI/UX Design Services',
        quantity: 20,
        unitPrice: 120.00,
        taxRate: 8.0,
        discountRate: 0,
        totalAmount: 2400.00,
        productName: 'Design Hours'
      },
      {
        id: 'line-003',
        description: 'Project Management',
        quantity: 16,
        unitPrice: 100.00,
        taxRate: 8.0,
        discountRate: 0,
        totalAmount: 1600.00,
        productName: 'PM Hours'
      }
    ],
    payments: [],
    attachments: []
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2024-002',
    customerId: 'cust-002',
    customerName: 'TechStart Inc.',
    customerEmail: 'finance@techstart.com',
    customerAddress: '456 Innovation Blvd, San Francisco, CA 94105',
    issueDate: '2024-01-18T00:00:00Z',
    dueDate: '2024-02-02T00:00:00Z',
    status: 'paid',
    currency: 'USD',
    subtotal: 5000.00,
    taxAmount: 450.00,
    discountAmount: 250.00,
    totalAmount: 5200.00,
    paidAmount: 5200.00,
    balanceAmount: 0,
    notes: 'Early payment discount applied',
    terms: 'Payment due within 15 days',
    templateId: 'template-001',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    sentAt: '2024-01-18T11:00:00Z',
    paidAt: '2024-01-20T16:00:00Z',
    lineItems: [
      {
        id: 'line-004',
        description: 'Mobile App Development',
        quantity: 30,
        unitPrice: 160.00,
        taxRate: 9.0,
        discountRate: 5.0,
        totalAmount: 4800.00,
        productName: 'App Development'
      },
      {
        id: 'line-005',
        description: 'Testing & QA',
        quantity: 10,
        unitPrice: 80.00,
        taxRate: 9.0,
        discountRate: 0,
        totalAmount: 800.00,
        productName: 'QA Services'
      }
    ],
    payments: [
      {
        id: 'pay-001',
        amount: 5200.00,
        paymentDate: '2024-01-20T16:00:00Z',
        paymentMethod: 'bank_transfer',
        reference: 'TXN123456789',
        notes: 'Full payment received'
      }
    ],
    attachments: []
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2024-003',
    customerId: 'cust-001',
    customerName: 'Acme Corporation',
    customerEmail: 'billing@acme.com',
    customerAddress: '123 Business Ave, New York, NY 10001',
    issueDate: '2024-01-10T00:00:00Z',
    dueDate: '2024-01-25T00:00:00Z',
    status: 'overdue',
    currency: 'USD',
    subtotal: 7500.00,
    taxAmount: 600.00,
    discountAmount: 0,
    totalAmount: 8100.00,
    paidAmount: 0,
    balanceAmount: 8100.00,
    notes: 'Overdue payment - please remit immediately',
    terms: 'Payment due within 15 days',
    templateId: 'template-001',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    sentAt: '2024-01-10T14:00:00Z',
    lineItems: [
      {
        id: 'line-006',
        description: 'Consulting Services',
        quantity: 50,
        unitPrice: 150.00,
        taxRate: 8.0,
        discountRate: 0,
        totalAmount: 7500.00,
        productName: 'Consulting Hours'
      }
    ],
    payments: [],
    attachments: []
  }
];

const MOCK_BILLS: Bill[] = [
  {
    id: 'bill-001',
    billNumber: 'BILL-2024-001',
    vendorId: 'vendor-001',
    vendorName: 'Office Supplies Co.',
    vendorEmail: 'billing@officesupplies.com',
    billDate: '2024-01-20T00:00:00Z',
    dueDate: '2024-02-19T00:00:00Z',
    status: 'pending',
    currency: 'USD',
    subtotal: 850.00,
    taxAmount: 68.00,
    totalAmount: 918.00,
    paidAmount: 0,
    balanceAmount: 918.00,
    notes: 'Monthly office supplies order',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    lineItems: [
      {
        id: 'bill-line-001',
        description: 'Printer Paper (A4)',
        quantity: 20,
        unitPrice: 15.00,
        taxRate: 8.0,
        totalAmount: 300.00,
        category: 'Office Supplies'
      },
      {
        id: 'bill-line-002',
        description: 'Ink Cartridges',
        quantity: 10,
        unitPrice: 35.00,
        taxRate: 8.0,
        totalAmount: 350.00,
        category: 'Office Supplies'
      },
      {
        id: 'bill-line-003',
        description: 'Stationery Items',
        quantity: 1,
        unitPrice: 200.00,
        taxRate: 8.0,
        totalAmount: 200.00,
        category: 'Office Supplies'
      }
    ],
    payments: [],
    attachments: []
  }
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    status: undefined,
    customer: undefined,
    dateRange: '30days'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(MOCK_INVOICES);
      setBills(MOCK_BILLS);
      setCustomers(MOCK_CUSTOMERS);
      setTemplates(MOCK_TEMPLATES);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const summary = useMemo((): InvoiceSummary => {
    const totalInvoices = invoices.length;
    const draftInvoices = invoices.filter(i => i.status === 'draft').length;
    const sentInvoices = invoices.filter(i => i.status === 'sent').length;
    const paidInvoices = invoices.filter(i => i.status === 'paid').length;
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
    const totalRevenue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const paidAmount = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const outstandingAmount = totalRevenue - paidAmount;
    const monthlyRevenue = 25000.00; // Mock monthly revenue
    const monthlyInvoices = 15; // Mock monthly invoices
    const monthlyTarget = 30000.00; // Mock monthly target
    const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    const averagePaymentTime = 18; // Mock average payment time in days

    const topCustomers = invoices.reduce((acc, invoice) => {
      acc[invoice.customerName] = (acc[invoice.customerName] || 0) + invoice.totalAmount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue,
      paidAmount,
      outstandingAmount,
      monthlyRevenue,
      monthlyInvoices,
      monthlyTarget,
      averageInvoiceValue,
      averagePaymentTime,
      topCustomers
    };
  }, [invoices]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<InvoiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createInvoice = useCallback(async (invoiceData: Partial<Invoice>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        customerId: invoiceData.customerId || '',
        customerName: invoiceData.customerName || '',
        customerEmail: invoiceData.customerEmail || '',
        customerAddress: invoiceData.customerAddress || '',
        issueDate: invoiceData.issueDate || new Date().toISOString(),
        dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        currency: 'USD',
        subtotal: invoiceData.subtotal || 0,
        taxAmount: invoiceData.taxAmount || 0,
        discountAmount: invoiceData.discountAmount || 0,
        totalAmount: invoiceData.totalAmount || 0,
        paidAmount: 0,
        balanceAmount: invoiceData.totalAmount || 0,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        templateId: invoiceData.templateId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lineItems: invoiceData.lineItems || [],
        payments: [],
        attachments: []
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [invoices.length]);

  const createBill = useCallback(async (billData: Partial<Bill>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBill: Bill = {
        id: `bill-${Date.now()}`,
        billNumber: `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`,
        vendorId: billData.vendorId || '',
        vendorName: billData.vendorName || '',
        vendorEmail: billData.vendorEmail || '',
        billDate: billData.billDate || new Date().toISOString(),
        dueDate: billData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        currency: 'USD',
        subtotal: billData.subtotal || 0,
        taxAmount: billData.taxAmount || 0,
        totalAmount: billData.totalAmount || 0,
        paidAmount: 0,
        balanceAmount: billData.totalAmount || 0,
        notes: billData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lineItems: billData.lineItems || [],
        payments: [],
        attachments: []
      };
      
      setBills(prev => [newBill, ...prev]);
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [bills.length]);

  const updateInvoice = useCallback(async (invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, ...updates, updatedAt: new Date().toISOString() } : invoice
    ));
  }, []);

  const updateBill = useCallback(async (billId: string, updates: Partial<Bill>) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, ...updates, updatedAt: new Date().toISOString() } : bill
    ));
  }, []);

  // Define interface for email data
  interface EmailData {
    to: string;
    subject?: string;
    message?: string;
    attachPDF?: boolean;
  }

  const sendInvoice = useCallback(async (invoiceId: string, emailData?: EmailData) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? {
          ...invoice,
          status: 'sent',
          sentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : invoice
      ));
      
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const duplicateInvoice = useCallback(async (invoiceId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const originalInvoice = invoices.find(inv => inv.id === invoiceId);
      if (originalInvoice) {
        const duplicatedInvoice: Invoice = {
          ...originalInvoice,
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
          status: 'draft',
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sentAt: undefined,
          paidAt: undefined,
          paidAmount: 0,
          balanceAmount: originalInvoice.totalAmount,
          payments: [],
          lineItems: originalInvoice.lineItems.map(item => ({
            ...item,
            id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }))
        };
        
        setInvoices(prev => [duplicatedInvoice, ...prev]);
      }
      
    } catch (error) {
      console.error('Error duplicating invoice:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [invoices]);

  const deleteInvoice = useCallback(async (invoiceId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId));
      
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const recordPayment = useCallback(async (invoiceId: string, paymentData: Partial<InvoicePayment>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const payment: InvoicePayment = {
        id: `pay-${Date.now()}`,
        amount: paymentData.amount || 0,
        paymentDate: paymentData.paymentDate || new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod || 'bank_transfer',
        reference: paymentData.reference,
        notes: paymentData.notes
      };
      
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const newPaidAmount = invoice.paidAmount + payment.amount;
          const newBalanceAmount = invoice.totalAmount - newPaidAmount;
          const newStatus = newBalanceAmount <= 0 ? 'paid' : invoice.status;
          
          return {
            ...invoice,
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
            status: newStatus,
            paidAt: newStatus === 'paid' ? new Date().toISOString() : invoice.paidAt,
            payments: [...invoice.payments, payment],
            updatedAt: new Date().toISOString()
          };
        }
        return invoice;
      }));
      
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csvContent = [
      'Invoice Number,Customer,Issue Date,Due Date,Status,Total Amount,Paid Amount,Balance',
      ...invoices.map(invoice => [
        invoice.invoiceNumber,
        `"${invoice.customerName}"`,
        new Date(invoice.issueDate).toLocaleDateString(),
        new Date(invoice.dueDate).toLocaleDateString(),
        invoice.status,
        invoice.totalAmount,
        invoice.paidAmount,
        invoice.balanceAmount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [invoices]);

  const generateReport = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report generation
      console.log('Generating invoice report...');
      
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // New functions for additional functionality
  const addCustomer = useCallback(async (customerData: Partial<Customer>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone,
        address: customerData.address || '',
        city: customerData.city || '',
        state: customerData.state || '',
        zipCode: customerData.zipCode || '',
        country: customerData.country || 'USA',
        taxId: customerData.taxId,
        paymentTerms: customerData.paymentTerms || 30,
        creditLimit: customerData.creditLimit,
        totalInvoiced: 0,
        totalPaid: 0,
        outstandingAmount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCustomers(prev => [newCustomer, ...prev]);
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateCustomer = useCallback(async (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updates, updatedAt: new Date().toISOString() } : customer
    ));
  }, []);

  const addTemplate = useCallback(async (templateData: Partial<InvoiceTemplate>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTemplate: InvoiceTemplate = {
        id: `template-${Date.now()}`,
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        isDefault: templateData.isDefault || false,
        logoUrl: templateData.logoUrl,
        primaryColor: templateData.primaryColor || '#3B82F6',
        secondaryColor: templateData.secondaryColor || '#F3F4F6',
        fontFamily: templateData.fontFamily || 'Inter',
        layout: templateData.layout || 'modern',
        showLogo: templateData.showLogo ?? true,
        showCompanyDetails: templateData.showCompanyDetails ?? true,
        showPaymentTerms: templateData.showPaymentTerms ?? true,
        showNotes: templateData.showNotes ?? true,
        customFields: templateData.customFields || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTemplates(prev => [newTemplate, ...prev]);
    } catch (error) {
      console.error('Error adding template:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateTemplate = useCallback(async (templateId: string, updates: Partial<InvoiceTemplate>) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template
    ));
  }, []);

  const deleteBill = useCallback(async (billId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBills(prev => prev.filter(bill => bill.id !== billId));
      
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Filter invoices based on current filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
          invoice.customerName.toLowerCase().includes(searchTerm) ||
          invoice.customerEmail.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && invoice.status !== filters.status) {
        return false;
      }

      // Customer filter
      if (filters.customer && invoice.customerId !== filters.customer) {
        return false;
      }

      return true;
    });
  }, [invoices, filters]);

  return {
    invoices: filteredInvoices,
    bills,
    customers,
    templates,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createInvoice,
    createBill,
    updateInvoice,
    updateBill,
    sendInvoice,
    duplicateInvoice,
    deleteInvoice,
    recordPayment,
    exportData,
    generateReport,
    addCustomer,
    updateCustomer,
    addTemplate,
    updateTemplate,
    deleteBill
  };
};