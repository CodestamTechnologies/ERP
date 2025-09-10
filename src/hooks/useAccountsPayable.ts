import { useState } from 'react';
import { 
  PayableInvoice, Vendor, PaymentSchedule, AgingReport, AccountsPayableSummary, 
  PayableFilters, BulkPaymentRequest, VendorAgingBreakdown, AgingBucket
} from '@/types/accountsPayable';

// Mock data - condensed
const MOCK_DATA = {
  invoices: [
    {
      id: '1', invoiceNumber: 'BILL-2024-001', vendorId: 'vendor-1', vendorName: 'TechSupply Corp',
      vendorEmail: 'billing@techsupply.com', invoiceDate: '2024-01-15', dueDate: '2024-02-14',
      description: 'Office equipment and supplies', subtotal: 125000, taxAmount: 22500, totalAmount: 147500,
      paidAmount: 0, balanceAmount: 147500, status: 'approved', priority: 'medium', paymentTerms: 'Net 30',
      currency: 'INR', attachments: ['invoice.pdf'], lineItems: [{
        id: '1', description: 'Laptops - Dell Inspiron', quantity: 5, unitPrice: 45000,
        totalPrice: 225000, taxRate: 18, taxAmount: 40500, accountCode: '1200'
      }], approvalStatus: 'approved', approvedBy: 'John Doe', approvedAt: '2024-01-16T10:00:00Z',
      tags: ['equipment', 'urgent'], createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-16T10:00:00Z',
      createdBy: 'user-1', lastModifiedBy: 'user-1'
    },
    {
      id: '2', invoiceNumber: 'BILL-2024-002', vendorId: 'vendor-2', vendorName: 'Office Solutions Ltd',
      vendorEmail: 'accounts@officesolutions.com', invoiceDate: '2024-01-20', dueDate: '2024-01-25',
      description: 'Monthly office rent', subtotal: 85000, taxAmount: 0, totalAmount: 85000,
      paidAmount: 0, balanceAmount: 85000, status: 'overdue', priority: 'high', paymentTerms: 'Due on receipt',
      currency: 'INR', attachments: ['rent_invoice.pdf'], lineItems: [{
        id: '2', description: 'Office Rent - January 2024', quantity: 1, unitPrice: 85000,
        totalPrice: 85000, taxRate: 0, taxAmount: 0, accountCode: '5100'
      }], approvalStatus: 'approved', approvedBy: 'Jane Smith', approvedAt: '2024-01-21T14:00:00Z',
      tags: ['rent', 'recurring'], createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-21T14:00:00Z',
      createdBy: 'user-2', lastModifiedBy: 'user-2'
    },
    {
      id: '3', invoiceNumber: 'BILL-2024-003', vendorId: 'vendor-3', vendorName: 'CloudTech Services',
      vendorEmail: 'billing@cloudtech.com', invoiceDate: '2024-01-25', dueDate: '2024-02-24',
      description: 'Cloud hosting services', subtotal: 45000, taxAmount: 8100, totalAmount: 53100,
      paidAmount: 53100, balanceAmount: 0, status: 'paid', priority: 'low', paymentTerms: 'Net 30',
      currency: 'INR', attachments: ['hosting_invoice.pdf'], lineItems: [{
        id: '3', description: 'Cloud Hosting - Premium Plan', quantity: 1, unitPrice: 45000,
        totalPrice: 45000, taxRate: 18, taxAmount: 8100, accountCode: '6200'
      }], approvalStatus: 'approved', approvedBy: 'Mike Johnson', approvedAt: '2024-01-26T09:00:00Z',
      paymentMethod: 'bank_transfer', referenceNumber: 'TXN-2024-001', tags: ['hosting', 'monthly'],
      createdAt: '2024-01-25T08:00:00Z', updatedAt: '2024-01-28T16:00:00Z', createdBy: 'user-3', lastModifiedBy: 'user-3'
    }
  ] as PayableInvoice[],
  vendors: [
    {
      id: 'vendor-1', name: 'TechSupply Corp', displayName: 'TechSupply Corp', email: 'billing@techsupply.com',
      phone: '+91-9876543210', website: 'https://techsupply.com', taxId: 'GST123456789', registrationNumber: 'REG001',
      address: { street: '123 Tech Street', city: 'Bangalore', state: 'Karnataka', postalCode: '560001', country: 'India' },
      contactPerson: { name: 'Rajesh Kumar', email: 'rajesh@techsupply.com', phone: '+91-9876543211', designation: 'Sales Manager' },
      paymentTerms: 'Net 30', creditLimit: 500000, currentBalance: 147500, totalPurchases: 1250000, averagePaymentDays: 28,
      status: 'active', category: 'Technology', bankDetails: { bankName: 'HDFC Bank', accountNumber: '1234567890', routingNumber: 'HDFC0001234', swiftCode: 'HDFCINBB' },
      documents: ['gst_certificate.pdf', 'pan_card.pdf'], tags: ['preferred', 'technology'],
      createdAt: '2023-06-15T10:00:00Z', updatedAt: '2024-01-15T09:00:00Z', lastTransactionDate: '2024-01-15'
    },
    {
      id: 'vendor-2', name: 'Office Solutions Ltd', displayName: 'Office Solutions Ltd', email: 'accounts@officesolutions.com',
      phone: '+91-9876543220', taxId: 'GST987654321', address: { street: '456 Business Park', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001', country: 'India' },
      contactPerson: { name: 'Priya Sharma', email: 'priya@officesolutions.com', phone: '+91-9876543221' },
      paymentTerms: 'Due on receipt', creditLimit: 200000, currentBalance: 85000, totalPurchases: 850000, averagePaymentDays: 5,
      status: 'active', category: 'Office Supplies', documents: ['agreement.pdf'], tags: ['rent', 'monthly'],
      createdAt: '2023-08-20T12:00:00Z', updatedAt: '2024-01-20T11:00:00Z', lastTransactionDate: '2024-01-20'
    },
    {
      id: 'vendor-3', name: 'CloudTech Services', displayName: 'CloudTech Services', email: 'billing@cloudtech.com',
      phone: '+91-9876543230', website: 'https://cloudtech.com', taxId: 'GST456789123',
      address: { street: '789 Cloud Avenue', city: 'Hyderabad', state: 'Telangana', postalCode: '500001', country: 'India' },
      contactPerson: { name: 'Amit Patel', email: 'amit@cloudtech.com', phone: '+91-9876543231' },
      paymentTerms: 'Net 30', creditLimit: 300000, currentBalance: 0, totalPurchases: 636000, averagePaymentDays: 25,
      status: 'active', category: 'IT Services', tags: ['cloud', 'services'],
      createdAt: '2023-09-10T14:00:00Z', updatedAt: '2024-01-25T08:00:00Z', lastTransactionDate: '2024-01-25'
    }
  ] as Vendor[],
  schedules: [
    { id: '1', invoiceId: '1', invoiceNumber: 'BILL-2024-001', vendorId: 'vendor-1', vendorName: 'TechSupply Corp',
      amount: 147500, scheduledDate: '2024-02-14', status: 'scheduled', paymentMethod: 'bank_transfer',
      approvalRequired: true, createdAt: '2024-01-16T10:00:00Z', createdBy: 'user-1' },
    { id: '2', invoiceId: '2', invoiceNumber: 'BILL-2024-002', vendorId: 'vendor-2', vendorName: 'Office Solutions Ltd',
      amount: 85000, scheduledDate: '2024-01-25', status: 'scheduled', paymentMethod: 'bank_transfer',
      approvalRequired: false, createdAt: '2024-01-21T14:00:00Z', createdBy: 'user-2' }
  ] as PaymentSchedule[],
  aging: {
    generatedAt: '2024-01-30T10:00:00Z', totalAmount: 232500, totalInvoices: 2,
    buckets: [
      { range: 'Current', amount: 147500, count: 1, percentage: 63.4, color: 'text-green-600' },
      { range: '1-30 Days', amount: 0, count: 0, percentage: 0, color: 'text-yellow-600' },
      { range: '31-60 Days', amount: 0, count: 0, percentage: 0, color: 'text-orange-600' },
      { range: '60+ Days', amount: 85000, count: 1, percentage: 36.6, color: 'text-red-600' }
    ],
    vendorBreakdown: [
      { vendorId: 'vendor-1', vendorName: 'TechSupply Corp', current: 147500, days1to30: 0, days31to60: 0, days61to90: 0, days90plus: 0, total: 147500 },
      { vendorId: 'vendor-2', vendorName: 'Office Solutions Ltd', current: 0, days1to30: 0, days31to60: 0, days61to90: 85000, days90plus: 0, total: 85000 }
    ]
  } as AgingReport,
  summary: {
    totalPayables: 232500, overduePayables: 85000, dueThisMonth: 232500, paidThisMonth: 53100,
    invoicesDueThisMonth: 2, paymentsMadeThisMonth: 1, activeVendors: 3, newVendorsThisMonth: 0,
    averagePaymentDays: 19, cashFlowImpact: -232500,
    topVendorsByAmount: [
      { vendorId: 'vendor-1', vendorName: 'TechSupply Corp', amount: 147500 },
      { vendorId: 'vendor-2', vendorName: 'Office Solutions Ltd', amount: 85000 }
    ],
    paymentMethodBreakdown: [
      { method: 'Bank Transfer', amount: 53100, count: 1 },
      { method: 'Check', amount: 0, count: 0 }
    ]
  } as AccountsPayableSummary
};

export const useAccountsPayable = () => {
  const [payableInvoices, setPayableInvoices] = useState<PayableInvoice[]>(MOCK_DATA.invoices);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_DATA.vendors);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>(MOCK_DATA.schedules);
  const [agingReport, setAgingReport] = useState<AgingReport>(MOCK_DATA.aging);
  const [summary, setSummary] = useState<AccountsPayableSummary>(MOCK_DATA.summary);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<PayableFilters>({ search: '', sortBy: 'dueDate', sortOrder: 'asc' });

  const filteredPayableInvoices = payableInvoices.filter(invoice => {
    if (filters.search && !invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !invoice.vendorName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status && invoice.status !== filters.status) return false;
    if (filters.vendor && invoice.vendorId !== filters.vendor) return false;
    return true;
  });

  const updateFilters = (newFilters: Partial<PayableFilters>) => setFilters(prev => ({ ...prev, ...newFilters }));

  const createPayableInvoice = async (payableData: Partial<PayableInvoice>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newInvoice: PayableInvoice = {
        id: Date.now().toString(), invoiceNumber: `BILL-2024-${String(payableInvoices.length + 1).padStart(3, '0')}`,
        vendorId: payableData.vendorId || '', vendorName: payableData.vendorName || '', vendorEmail: payableData.vendorEmail || '',
        invoiceDate: payableData.invoiceDate || new Date().toISOString().split('T')[0], dueDate: payableData.dueDate || '',
        description: payableData.description || '', subtotal: payableData.subtotal || 0, taxAmount: payableData.taxAmount || 0,
        totalAmount: payableData.totalAmount || 0, paidAmount: 0, balanceAmount: payableData.totalAmount || 0,
        status: 'draft', priority: payableData.priority || 'medium', paymentTerms: payableData.paymentTerms || 'Net 30',
        currency: payableData.currency || 'INR', attachments: payableData.attachments || [], lineItems: payableData.lineItems || [],
        approvalStatus: 'pending', tags: payableData.tags || [], createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), createdBy: 'current-user', lastModifiedBy: 'current-user'
      };
      setPayableInvoices(prev => [newInvoice, ...prev]);
      setSummary(prev => ({ ...prev, totalPayables: prev.totalPayables + newInvoice.totalAmount, dueThisMonth: prev.dueThisMonth + newInvoice.totalAmount }));
    } finally { setIsProcessing(false); }
  };

  // Define interfaces for payment operations
  interface PaymentData {
    amount: number;
    paymentMethod: string;
    referenceNumber?: string;
    notes?: string;
  }

  interface ScheduleData {
    amount: number;
    scheduledDate: string;
    paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'credit_card' | 'online';
    notes?: string;
    approvalRequired?: boolean;
  }

  const processPayment = async (invoiceId: string, paymentData: PaymentData) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPayableInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { 
          ...invoice, paidAmount: invoice.paidAmount + paymentData.amount, balanceAmount: invoice.balanceAmount - paymentData.amount,
          status: invoice.balanceAmount - paymentData.amount <= 0 ? 'paid' : 'partial_paid', paymentMethod: paymentData.paymentMethod,
          referenceNumber: paymentData.referenceNumber, updatedAt: new Date().toISOString()
        } : invoice
      ));
      setSummary(prev => ({ ...prev, paidThisMonth: prev.paidThisMonth + paymentData.amount, paymentsMadeThisMonth: prev.paymentsMadeThisMonth + 1 }));
    } finally { setIsProcessing(false); }
  };

  const bulkPayment = async (invoiceIds: string[], paymentData: BulkPaymentRequest) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      let totalPaid = 0;
      setPayableInvoices(prev => prev.map(invoice => {
        if (invoiceIds.includes(invoice.id)) {
          totalPaid += invoice.balanceAmount;
          return { ...invoice, paidAmount: invoice.totalAmount, balanceAmount: 0, status: 'paid' as const,
            paymentMethod: paymentData.paymentMethod, referenceNumber: paymentData.referenceNumber, updatedAt: new Date().toISOString() };
        }
        return invoice;
      }));
      setSummary(prev => ({ ...prev, paidThisMonth: prev.paidThisMonth + totalPaid, paymentsMadeThisMonth: prev.paymentsMadeThisMonth + invoiceIds.length }));
    } finally { setIsProcessing(false); }
  };

  const schedulePayment = async (invoiceId: string, scheduleData: ScheduleData) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const invoice = payableInvoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        const newSchedule: PaymentSchedule = {
          id: Date.now().toString(), invoiceId, invoiceNumber: invoice.invoiceNumber, vendorId: invoice.vendorId,
          vendorName: invoice.vendorName, amount: scheduleData.amount, scheduledDate: scheduleData.scheduledDate,
          status: 'scheduled', paymentMethod: scheduleData.paymentMethod, notes: scheduleData.notes,
          approvalRequired: scheduleData.approvalRequired || false, createdAt: new Date().toISOString(), createdBy: 'current-user'
        };
        setPaymentSchedules(prev => [newSchedule, ...prev]);
      }
    } finally { setIsProcessing(false); }
  };

  const generateAgingReport = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentDate = new Date();
      const buckets: AgingBucket[] = [
        { range: 'Current', amount: 0, count: 0, percentage: 0, color: 'text-green-600' },
        { range: '1-30 Days', amount: 0, count: 0, percentage: 0, color: 'text-yellow-600' },
        { range: '31-60 Days', amount: 0, count: 0, percentage: 0, color: 'text-orange-600' },
        { range: '60+ Days', amount: 0, count: 0, percentage: 0, color: 'text-red-600' }
      ];
      const vendorBreakdown: VendorAgingBreakdown[] = [];
      let totalAmount = 0;

      payableInvoices.forEach(invoice => {
        if (invoice.status !== 'paid') {
          const daysDiff = Math.floor((currentDate.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
          totalAmount += invoice.balanceAmount;
          const bucketIndex = daysDiff <= 0 ? 0 : daysDiff <= 30 ? 1 : daysDiff <= 60 ? 2 : 3;
          buckets[bucketIndex].amount += invoice.balanceAmount;
          buckets[bucketIndex].count += 1;

          let vendorItem = vendorBreakdown.find(v => v.vendorId === invoice.vendorId);
          if (!vendorItem) {
            vendorItem = { vendorId: invoice.vendorId, vendorName: invoice.vendorName, current: 0, days1to30: 0, days31to60: 0, days61to90: 0, days90plus: 0, total: 0 };
            vendorBreakdown.push(vendorItem);
          }
          vendorItem.total += invoice.balanceAmount;
          if (bucketIndex === 0) vendorItem.current += invoice.balanceAmount;
          else if (bucketIndex === 1) vendorItem.days1to30 += invoice.balanceAmount;
          else if (bucketIndex === 2) vendorItem.days31to60 += invoice.balanceAmount;
          else vendorItem.days90plus += invoice.balanceAmount;
        }
      });

      buckets.forEach(bucket => { bucket.percentage = totalAmount > 0 ? (bucket.amount / totalAmount) * 100 : 0; });
      setAgingReport({ generatedAt: new Date().toISOString(), totalAmount, totalInvoices: payableInvoices.filter(inv => inv.status !== 'paid').length, buckets, vendorBreakdown });
    } finally { setLoading(false); }
  };

  const exportData = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = { payableInvoices: filteredPayableInvoices, vendors, paymentSchedules, agingReport, summary };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `accounts-payable-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } finally { setIsProcessing(false); }
  };

  const sendReminder = async (invoiceId: string) => {
    setIsProcessing(true);
    try { await new Promise(resolve => setTimeout(resolve, 500)); } 
    finally { setIsProcessing(false); }
  };

  const approvePayment = async (invoiceId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPayableInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, approvalStatus: 'approved', status: 'approved', approvedBy: 'current-user',
          approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : invoice
      ));
    } finally { setIsProcessing(false); }
  };

  const rejectPayment = async (invoiceId: string, reason: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPayableInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, approvalStatus: 'rejected', status: 'cancelled', rejectionReason: reason, updatedAt: new Date().toISOString() } : invoice
      ));
    } finally { setIsProcessing(false); }
  };

  return {
    payableInvoices: filteredPayableInvoices, vendors, paymentSchedules, agingReport, summary, loading, filters, isProcessing,
    updateFilters, createPayableInvoice, processPayment, bulkPayment, schedulePayment, generateAgingReport, exportData, sendReminder, approvePayment, rejectPayment
  };
};