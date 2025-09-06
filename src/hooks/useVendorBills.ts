import { useState, useEffect, useCallback } from 'react';

interface VendorBill {
  id: string; billNumber: string; vendorId: string; vendorName: string;
  billDate: string; dueDate: string; amount: number; paidAmount: number;
  remainingAmount: number; status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  priority: 'high' | 'medium' | 'low'; description?: string; category: string;
  taxAmount: number; discountAmount: number; attachments: string[];
  createdAt: string; updatedAt: string; approvedBy?: string; approvedAt?: string;
  paymentTerms: string; reference?: string;
}

interface DuePayment {
  id: string; billId: string; billNumber: string; vendorId: string;
  vendorName: string; amount: number; dueDate: string; priority: 'high' | 'medium' | 'low';
  daysOverdue: number; status: 'upcoming' | 'due_today' | 'overdue';
}

interface Vendor {
  id: string; name: string; email: string; phone: string; address: string;
  paymentTerms: string; totalOutstanding: number; totalPaid: number;
  billsCount: number; status: 'active' | 'inactive'; createdAt: string;
}

interface Summary {
  totalOutstanding: number; dueThisWeek: number; overdueAmount: number;
  activeVendors: number; totalBills: number; paidThisMonth: number; avgPaymentDays: number;
}

interface Filters {
  search: string; status?: string; vendor?: string; priority?: string;
  dateRange?: { start: string; end: string; };
}

// Mock data
const mockBills: VendorBill[] = [
  {
    id: '1',
    billNumber: 'BILL-2024-001',
    vendorId: 'vendor-1',
    vendorName: 'TechCorp Solutions',
    billDate: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 125000,
    paidAmount: 0,
    remainingAmount: 125000,
    status: 'approved',
    priority: 'high',
    description: 'Software licensing and support services',
    category: 'Technology',
    taxAmount: 22500,
    discountAmount: 0,
    attachments: ['invoice.pdf'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    approvedBy: 'John Doe',
    approvedAt: '2024-01-16T14:30:00Z',
    paymentTerms: 'Net 30',
    reference: 'PO-2024-001'
  },
  {
    id: '2',
    billNumber: 'BILL-2024-002',
    vendorId: 'vendor-2',
    vendorName: 'Office Supplies Inc',
    billDate: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 45000,
    paidAmount: 45000,
    remainingAmount: 0,
    status: 'paid',
    priority: 'medium',
    description: 'Monthly office supplies and stationery',
    category: 'Office Supplies',
    taxAmount: 8100,
    discountAmount: 2250,
    attachments: ['receipt.pdf'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    paymentTerms: 'Net 15',
    reference: 'PO-2024-002'
  },
  {
    id: '3',
    billNumber: 'BILL-2024-003',
    vendorId: 'vendor-3',
    vendorName: 'Marketing Agency Pro',
    billDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 85000,
    paidAmount: 0,
    remainingAmount: 85000,
    status: 'overdue',
    priority: 'high',
    description: 'Digital marketing campaign Q1',
    category: 'Marketing',
    taxAmount: 15300,
    discountAmount: 0,
    attachments: ['campaign_details.pdf'],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-05T11:00:00Z',
    paymentTerms: 'Net 15',
    reference: 'PO-2024-003'
  },
  {
    id: '4',
    billNumber: 'BILL-2024-004',
    vendorId: 'vendor-4',
    vendorName: 'Facility Management Co',
    billDate: '2024-01-20',
    dueDate: '2024-02-20',
    amount: 65000,
    paidAmount: 0,
    remainingAmount: 65000,
    status: 'pending',
    priority: 'medium',
    description: 'Monthly facility maintenance and cleaning',
    category: 'Facilities',
    taxAmount: 11700,
    discountAmount: 0,
    attachments: ['service_report.pdf'],
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
    paymentTerms: 'Net 30',
    reference: 'PO-2024-004'
  },
  {
    id: '5',
    billNumber: 'BILL-2024-005',
    vendorId: 'vendor-5',
    vendorName: 'Legal Services LLC',
    billDate: '2024-01-12',
    dueDate: '2024-02-12',
    amount: 95000,
    paidAmount: 0,
    remainingAmount: 95000,
    status: 'approved',
    priority: 'low',
    description: 'Legal consultation and contract review',
    category: 'Legal',
    taxAmount: 17100,
    discountAmount: 0,
    attachments: ['legal_invoice.pdf'],
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
    approvedBy: 'Jane Smith',
    approvedAt: '2024-01-13T10:00:00Z',
    paymentTerms: 'Net 30',
    reference: 'PO-2024-005'
  }
];

const mockVendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'TechCorp Solutions',
    email: 'billing@techcorp.com',
    phone: '+91-9876543210',
    address: '123 Tech Park, Bangalore, Karnataka 560001',
    paymentTerms: 'Net 30',
    totalOutstanding: 125000,
    totalPaid: 250000,
    billsCount: 3,
    status: 'active',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: 'vendor-2',
    name: 'Office Supplies Inc',
    email: 'accounts@officesupplies.com',
    phone: '+91-9876543211',
    address: '456 Supply Street, Mumbai, Maharashtra 400001',
    paymentTerms: 'Net 15',
    totalOutstanding: 0,
    totalPaid: 180000,
    billsCount: 4,
    status: 'active',
    createdAt: '2023-07-15T00:00:00Z'
  },
  {
    id: 'vendor-3',
    name: 'Marketing Agency Pro',
    email: 'finance@marketingpro.com',
    phone: '+91-9876543212',
    address: '789 Creative Hub, Delhi, Delhi 110001',
    paymentTerms: 'Net 15',
    totalOutstanding: 85000,
    totalPaid: 320000,
    billsCount: 5,
    status: 'active',
    createdAt: '2023-05-20T00:00:00Z'
  },
  {
    id: 'vendor-4',
    name: 'Facility Management Co',
    email: 'billing@facilityco.com',
    phone: '+91-9876543213',
    address: '321 Service Lane, Chennai, Tamil Nadu 600001',
    paymentTerms: 'Net 30',
    totalOutstanding: 65000,
    totalPaid: 195000,
    billsCount: 3,
    status: 'active',
    createdAt: '2023-08-10T00:00:00Z'
  },
  {
    id: 'vendor-5',
    name: 'Legal Services LLC',
    email: 'accounts@legalservices.com',
    phone: '+91-9876543214',
    address: '654 Law Street, Pune, Maharashtra 411001',
    paymentTerms: 'Net 30',
    totalOutstanding: 95000,
    totalPaid: 285000,
    billsCount: 4,
    status: 'active',
    createdAt: '2023-04-05T00:00:00Z'
  }
];

const mockDuePayments: DuePayment[] = [
  {
    id: '1',
    billId: '1',
    billNumber: 'BILL-2024-001',
    vendorId: 'vendor-1',
    vendorName: 'TechCorp Solutions',
    amount: 125000,
    dueDate: '2024-02-15',
    priority: 'high',
    daysOverdue: 0,
    status: 'upcoming'
  },
  {
    id: '2',
    billId: '3',
    billNumber: 'BILL-2024-003',
    vendorId: 'vendor-3',
    vendorName: 'Marketing Agency Pro',
    amount: 85000,
    dueDate: '2024-01-20',
    priority: 'high',
    daysOverdue: 15,
    status: 'overdue'
  },
  {
    id: '3',
    billId: '4',
    billNumber: 'BILL-2024-004',
    vendorId: 'vendor-4',
    vendorName: 'Facility Management Co',
    amount: 65000,
    dueDate: '2024-02-20',
    priority: 'medium',
    daysOverdue: 0,
    status: 'upcoming'
  },
  {
    id: '4',
    billId: '5',
    billNumber: 'BILL-2024-005',
    vendorId: 'vendor-5',
    vendorName: 'Legal Services LLC',
    amount: 95000,
    dueDate: '2024-02-12',
    priority: 'low',
    daysOverdue: 0,
    status: 'upcoming'
  }
];

export const useVendorBills = () => {
  const [bills, setBills] = useState<VendorBill[]>([]);
  const [duePayments, setDuePayments] = useState<DuePayment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: undefined,
    vendor: undefined,
    priority: undefined
  });

  // Calculate summary
  const summary: Summary = {
    totalOutstanding: bills.reduce((sum, bill) => sum + bill.remainingAmount, 0),
    dueThisWeek: bills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return dueDate <= weekFromNow && bill.remainingAmount > 0;
      })
      .reduce((sum, bill) => sum + bill.remainingAmount, 0),
    overdueAmount: bills
      .filter(bill => bill.status === 'overdue')
      .reduce((sum, bill) => sum + bill.remainingAmount, 0),
    activeVendors: vendors.filter(vendor => vendor.status === 'active').length,
    totalBills: bills.length,
    paidThisMonth: bills
      .filter(bill => {
        const billDate = new Date(bill.billDate);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return billDate.getMonth() === currentMonth && 
               billDate.getFullYear() === currentYear &&
               bill.status === 'paid';
      })
      .reduce((sum, bill) => sum + bill.paidAmount, 0),
    avgPaymentDays: 25 // Mock average
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBills(mockBills);
        setVendors(mockVendors);
        setDuePayments(mockDuePayments);
      } catch (error) {
        console.error('Error loading vendor bills data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Create bill
  const createBill = useCallback(async (billData: Partial<VendorBill>) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBill: VendorBill = {
        id: `bill-${Date.now()}`,
        billNumber: `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`,
        vendorId: billData.vendorId || '',
        vendorName: billData.vendorName || '',
        billDate: billData.billDate || new Date().toISOString().split('T')[0],
        dueDate: billData.dueDate || '',
        amount: billData.amount || 0,
        paidAmount: 0,
        remainingAmount: billData.amount || 0,
        status: 'draft',
        priority: billData.priority || 'medium',
        description: billData.description || '',
        category: billData.category || '',
        taxAmount: billData.taxAmount || 0,
        discountAmount: billData.discountAmount || 0,
        attachments: billData.attachments || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentTerms: billData.paymentTerms || 'Net 30',
        reference: billData.reference || ''
      };

      setBills(prev => [newBill, ...prev]);
      return newBill;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [bills.length]);

  // Update bill
  const updateBill = useCallback(async (billId: string, updates: Partial<VendorBill>) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { ...bill, ...updates, updatedAt: new Date().toISOString() }
          : bill
      ));
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Delete bill
  const deleteBill = useCallback(async (billId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBills(prev => prev.filter(bill => bill.id !== billId));
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Define interfaces for payment operations
  interface PaymentData {
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    reference?: string;
    notes?: string;
  }

  interface BulkPaymentData {
    paymentMethod: string;
    paymentDate: string;
    reference?: string;
    notes?: string;
  }

  interface ScheduleData {
    scheduledDate: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }

  // Process payment
  const processPayment = useCallback(async (billId: string, paymentData: PaymentData) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBills(prev => prev.map(bill => {
        if (bill.id === billId) {
          const paidAmount = bill.paidAmount + paymentData.amount;
          const remainingAmount = bill.amount - paidAmount;
          return {
            ...bill,
            paidAmount,
            remainingAmount,
            status: remainingAmount <= 0 ? 'paid' : bill.status,
            updatedAt: new Date().toISOString()
          };
        }
        return bill;
      }));

      // Update due payments
      setDuePayments(prev => prev.filter(payment => payment.billId !== billId));
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Bulk payment
  const bulkPayment = useCallback(async (billIds: string[], paymentData: BulkPaymentData) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBills(prev => prev.map(bill => {
        if (billIds.includes(bill.id)) {
          const paidAmount = bill.amount; // Pay full amount in bulk
          return {
            ...bill,
            paidAmount,
            remainingAmount: 0,
            status: 'paid' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return bill;
      }));

      // Update due payments
      setDuePayments(prev => prev.filter(payment => !billIds.includes(payment.billId)));
    } catch (error) {
      console.error('Error processing bulk payment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Schedule payment
  const schedulePayment = useCallback(async (billId: string, scheduleData: ScheduleData) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a scheduled payment record
      console.log('Payment scheduled for bill:', billId, scheduleData);
    } catch (error) {
      console.error('Error scheduling payment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Send reminder
  const sendReminder = useCallback(async (billId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Reminder sent for bill:', billId);
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Approve bill
  const approveBill = useCallback(async (billId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              status: 'approved',
              approvedBy: 'Current User',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : bill
      ));
    } catch (error) {
      console.error('Error approving bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Reject bill
  const rejectBill = useCallback(async (billId: string, reason: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBills(prev => prev.map(bill => 
        bill.id === billId 
          ? { 
              ...bill, 
              status: 'cancelled',
              updatedAt: new Date().toISOString()
            }
          : bill
      ));
    } catch (error) {
      console.error('Error rejecting bill:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Export data
  const exportData = useCallback(async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would generate and download a file
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh all data
      setBills([...mockBills]);
      setVendors([...mockVendors]);
      setDuePayments([...mockDuePayments]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bills,
    duePayments,
    vendors,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createBill,
    updateBill,
    deleteBill,
    processPayment,
    bulkPayment,
    schedulePayment,
    sendReminder,
    approveBill,
    rejectBill,
    exportData,
    refreshData
  };
};