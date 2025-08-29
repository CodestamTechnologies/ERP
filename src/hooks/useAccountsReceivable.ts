import { useState, useEffect, useCallback } from 'react';

interface Invoice {
  id: string; invoiceNumber: string; customerId: string; customerName: string;
  invoiceDate: string; dueDate: string; amount: number; paidAmount: number;
  remainingAmount: number; status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  description?: string; items: Array<{ name: string; quantity: number; rate: number; amount: number; }>;
  taxAmount: number; discountAmount: number; createdAt: string; updatedAt: string;
}

interface Customer {
  id: string; name: string; email: string; phone: string; address: string;
  totalOutstanding: number; totalPaid: number; invoicesCount: number;
  status: 'active' | 'inactive'; createdAt: string;
}

interface Summary {
  totalOutstanding: number; dueThisWeek: number; overdueAmount: number;
  activeCustomers: number; totalInvoices: number; collectedThisMonth: number;
}

interface Filters {
  search: string; status?: string; customer?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1', invoiceNumber: 'INV-2024-001', customerId: 'customer-1', customerName: 'TechStart Inc',
    invoiceDate: '2024-01-15', dueDate: '2024-02-15', amount: 150000, paidAmount: 0, remainingAmount: 150000,
    status: 'sent', description: 'Web development services', taxAmount: 27000, discountAmount: 0,
    items: [{ name: 'Web Development', quantity: 1, rate: 150000, amount: 150000 }],
    createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', invoiceNumber: 'INV-2024-002', customerId: 'customer-2', customerName: 'Global Corp',
    invoiceDate: '2024-01-10', dueDate: '2024-01-25', amount: 75000, paidAmount: 75000, remainingAmount: 0,
    status: 'paid', description: 'Consulting services', taxAmount: 13500, discountAmount: 3750,
    items: [{ name: 'Business Consulting', quantity: 1, rate: 75000, amount: 75000 }],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: '3', invoiceNumber: 'INV-2024-003', customerId: 'customer-3', customerName: 'Retail Solutions',
    invoiceDate: '2024-01-05', dueDate: '2024-01-20', amount: 95000, paidAmount: 0, remainingAmount: 95000,
    status: 'overdue', description: 'E-commerce platform setup', taxAmount: 17100, discountAmount: 0,
    items: [{ name: 'E-commerce Setup', quantity: 1, rate: 95000, amount: 95000 }],
    createdAt: '2024-01-05T11:00:00Z', updatedAt: '2024-01-05T11:00:00Z'
  },
  {
    id: '4', invoiceNumber: 'INV-2024-004', customerId: 'customer-4', customerName: 'Manufacturing Co',
    invoiceDate: '2024-01-20', dueDate: '2024-02-20', amount: 120000, paidAmount: 0, remainingAmount: 120000,
    status: 'pending', description: 'ERP system implementation', taxAmount: 21600, discountAmount: 0,
    items: [{ name: 'ERP Implementation', quantity: 1, rate: 120000, amount: 120000 }],
    createdAt: '2024-01-20T08:00:00Z', updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: '5', invoiceNumber: 'INV-2024-005', customerId: 'customer-5', customerName: 'Healthcare Systems',
    invoiceDate: '2024-01-12', dueDate: '2024-02-12', amount: 85000, paidAmount: 0, remainingAmount: 85000,
    status: 'sent', description: 'Healthcare management system', taxAmount: 15300, discountAmount: 0,
    items: [{ name: 'Healthcare System', quantity: 1, rate: 85000, amount: 85000 }],
    createdAt: '2024-01-12T13:00:00Z', updatedAt: '2024-01-12T13:00:00Z'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'customer-1', name: 'TechStart Inc', email: 'billing@techstart.com', phone: '+91-9876543210',
    address: '123 Tech Hub, Bangalore, Karnataka 560001', totalOutstanding: 150000, totalPaid: 300000,
    invoicesCount: 4, status: 'active', createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: 'customer-2', name: 'Global Corp', email: 'accounts@globalcorp.com', phone: '+91-9876543211',
    address: '456 Business District, Mumbai, Maharashtra 400001', totalOutstanding: 0, totalPaid: 225000,
    invoicesCount: 3, status: 'active', createdAt: '2023-07-15T00:00:00Z'
  },
  {
    id: 'customer-3', name: 'Retail Solutions', email: 'finance@retailsolutions.com', phone: '+91-9876543212',
    address: '789 Commerce Street, Delhi, Delhi 110001', totalOutstanding: 95000, totalPaid: 180000,
    invoicesCount: 3, status: 'active', createdAt: '2023-05-20T00:00:00Z'
  },
  {
    id: 'customer-4', name: 'Manufacturing Co', email: 'billing@manufacturingco.com', phone: '+91-9876543213',
    address: '321 Industrial Area, Chennai, Tamil Nadu 600001', totalOutstanding: 120000, totalPaid: 240000,
    invoicesCount: 4, status: 'active', createdAt: '2023-08-10T00:00:00Z'
  },
  {
    id: 'customer-5', name: 'Healthcare Systems', email: 'accounts@healthcaresys.com', phone: '+91-9876543214',
    address: '654 Medical Complex, Pune, Maharashtra 411001', totalOutstanding: 85000, totalPaid: 170000,
    invoicesCount: 3, status: 'active', createdAt: '2023-04-05T00:00:00Z'
  }
];

export const useAccountsReceivable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<Filters>({ search: '', status: undefined, customer: undefined });

  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');

  const summary: Summary = {
    totalOutstanding: invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0),
    dueThisWeek: invoices.filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow && invoice.remainingAmount > 0;
    }).reduce((sum, invoice) => sum + invoice.remainingAmount, 0),
    overdueAmount: overdueInvoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0),
    activeCustomers: customers.filter(customer => customer.status === 'active').length,
    totalInvoices: invoices.length,
    collectedThisMonth: invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear &&
             invoice.status === 'paid';
    }).reduce((sum, invoice) => sum + invoice.paidAmount, 0)
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvoices(mockInvoices);
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Error loading accounts receivable data:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createInvoice = useCallback(async (invoiceData: Partial<Invoice>) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const customer = customers.find(c => c.id === invoiceData.customerId);
      const newInvoice: Invoice = {
        id: `invoice-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        customerId: invoiceData.customerId || '',
        customerName: customer?.name || '',
        invoiceDate: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || '',
        amount: invoiceData.amount || 0,
        paidAmount: 0,
        remainingAmount: invoiceData.amount || 0,
        status: 'draft',
        description: invoiceData.description || '',
        items: invoiceData.items || [],
        taxAmount: invoiceData.taxAmount || 0,
        discountAmount: invoiceData.discountAmount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [invoices.length, customers]);

  const recordPayment = useCallback(async (invoiceId: string, paymentData: any) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const paidAmount = invoice.paidAmount + paymentData.amount;
          const remainingAmount = invoice.amount - paidAmount;
          return {
            ...invoice,
            paidAmount,
            remainingAmount,
            status: remainingAmount <= 0 ? 'paid' : invoice.status,
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

  const sendReminder = useCallback(async (invoiceId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Reminder sent for invoice:', invoiceId);
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const bulkReminder = useCallback(async (invoiceIds: string[], reminderData: any) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Bulk reminders sent for invoices:', invoiceIds, reminderData);
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const followUp = useCallback(async (invoiceId: string, followUpData: any) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Follow-up created for invoice:', invoiceId, followUpData);
    } catch (error) {
      console.error('Error creating follow-up:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportData = useCallback(async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices([...mockInvoices]);
      setCustomers([...mockCustomers]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices, overdueInvoices, customers, summary, loading, filters, isProcessing,
    updateFilters, createInvoice, recordPayment, sendReminder, bulkReminder,
    followUp, exportData, refreshData
  };
};