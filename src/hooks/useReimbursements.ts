'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Types for Reimbursements System
export interface Reimbursement {
  id: string;
  reimbursementNumber: string;
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'expense' | 'travel' | 'advance' | 'other';
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  paidDate?: string;
  paidBy?: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  bankAccount?: string;
  receipts: ReimbursementReceipt[];
  lineItems: ReimbursementLineItem[];
  approvalHistory: ReimbursementApprovalHistory[];
  paymentDetails?: PaymentDetails;
}

export interface ReimbursementLineItem {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  receiptId?: string;
  taxAmount?: number;
  notes?: string;
}

export interface ReimbursementReceipt {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  lineItemId?: string;
}

export interface ReimbursementApprovalHistory {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'paid' | 'cancelled';
  approverName: string;
  approverId: string;
  comments?: string;
  timestamp: string;
}

export interface PaymentDetails {
  method: 'bank_transfer' | 'check' | 'cash' | 'digital_wallet';
  bankAccount?: string;
  checkNumber?: string;
  transactionId?: string;
  processedAt?: string;
  batchId?: string;
}

export interface PaymentBatch {
  id: string;
  batchNumber: string;
  title: string;
  description?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  totalAmount: number;
  reimbursementCount: number;
  createdBy: string;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  reimbursementIds: string[];
  failureReason?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'check' | 'cash' | 'digital_wallet';
  description: string;
  isActive: boolean;
  isDefault: boolean;
  settings: PaymentMethodSettings;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodSettings {
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swiftCode?: string;
  processingTime?: string;
  fees?: number;
  limits?: {
    daily?: number;
    monthly?: number;
    perTransaction?: number;
  };
}

export interface Vendor {
  id: string;
  name: string;
  type: 'employee' | 'contractor' | 'supplier' | 'other';
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  paymentTerms?: string;
  preferredPaymentMethod?: string;
  totalPaid: number;
  lastPaymentDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReimbursementFilters {
  search: string;
  status?: string;
  type?: string;
  department?: string;
  employeeId?: string;
  dateRange?: string;
  amountRange?: string;
}

export interface ReimbursementSummary {
  totalReimbursements: number;
  pendingReimbursements: number;
  approvedReimbursements: number;
  rejectedReimbursements: number;
  paidReimbursements: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  pendingPayments: number;
  avgProcessingTime: number;
  monthlyReimbursements: number;
  monthlyCount: number;
  monthlyBudget: number;
  topDepartments: { [key: string]: number };
  topTypes: { [key: string]: number };
}

// Mock Data
const MOCK_REIMBURSEMENTS: Reimbursement[] = [
  {
    id: 'reimb-001',
    reimbursementNumber: 'REIMB-2024-001',
    title: 'Business Travel Expenses',
    description: 'Travel expenses for client meeting in Chicago',
    employeeId: 'emp-001',
    employeeName: 'John Doe',
    department: 'Sales',
    type: 'travel',
    amount: 1850.00,
    currency: 'USD',
    status: 'paid',
    priority: 'medium',
    requestedDate: '2024-01-15T10:00:00Z',
    approvedDate: '2024-01-16T14:30:00Z',
    approvedBy: 'Jane Smith',
    paidDate: '2024-01-18T16:00:00Z',
    paidBy: 'Finance Team',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    paymentMethod: 'bank_transfer',
    bankAccount: '****1234',
    receipts: [
      {
        id: 'receipt-001',
        fileName: 'flight_receipt.pdf',
        fileUrl: '/receipts/flight_receipt.pdf',
        fileSize: 245760,
        uploadedAt: '2024-01-14T09:15:00Z'
      },
      {
        id: 'receipt-002',
        fileName: 'hotel_receipt.pdf',
        fileUrl: '/receipts/hotel_receipt.pdf',
        fileSize: 189440,
        uploadedAt: '2024-01-14T09:20:00Z'
      }
    ],
    lineItems: [
      {
        id: 'line-001',
        description: 'Flight to Chicago',
        category: 'Transportation',
        amount: 650.00,
        date: '2024-01-10',
        receiptId: 'receipt-001'
      },
      {
        id: 'line-002',
        description: 'Hotel accommodation (2 nights)',
        category: 'Lodging',
        amount: 800.00,
        date: '2024-01-10',
        receiptId: 'receipt-002'
      },
      {
        id: 'line-003',
        description: 'Meals and incidentals',
        category: 'Meals',
        amount: 400.00,
        date: '2024-01-11'
      }
    ],
    approvalHistory: [
      {
        id: 'hist-001',
        action: 'submitted',
        approverName: 'John Doe',
        approverId: 'emp-001',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: 'hist-002',
        action: 'approved',
        approverName: 'Jane Smith',
        approverId: 'mgr-001',
        comments: 'All receipts provided and amounts are reasonable',
        timestamp: '2024-01-16T14:30:00Z'
      },
      {
        id: 'hist-003',
        action: 'paid',
        approverName: 'Finance Team',
        approverId: 'finance-001',
        comments: 'Payment processed via bank transfer',
        timestamp: '2024-01-18T16:00:00Z'
      }
    ],
    paymentDetails: {
      method: 'bank_transfer',
      bankAccount: '****1234',
      transactionId: 'TXN001234567',
      processedAt: '2024-01-18T16:00:00Z',
      batchId: 'batch-001'
    }
  },
  {
    id: 'reimb-002',
    reimbursementNumber: 'REIMB-2024-002',
    title: 'Office Equipment Purchase',
    description: 'Laptop and accessories for remote work',
    employeeId: 'emp-002',
    employeeName: 'Sarah Johnson',
    department: 'Engineering',
    type: 'expense',
    amount: 2200.00,
    currency: 'USD',
    status: 'approved',
    priority: 'high',
    requestedDate: '2024-01-20T11:30:00Z',
    approvedDate: '2024-01-21T15:00:00Z',
    approvedBy: 'Mike Wilson',
    createdAt: '2024-01-19T15:00:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
    receipts: [
      {
        id: 'receipt-003',
        fileName: 'laptop_receipt.pdf',
        fileUrl: '/receipts/laptop_receipt.pdf',
        fileSize: 156780,
        uploadedAt: '2024-01-19T15:15:00Z'
      }
    ],
    lineItems: [
      {
        id: 'line-004',
        description: 'MacBook Pro 16-inch',
        category: 'Equipment',
        amount: 1800.00,
        date: '2024-01-18',
        receiptId: 'receipt-003'
      },
      {
        id: 'line-005',
        description: 'Laptop accessories and software',
        category: 'Equipment',
        amount: 400.00,
        date: '2024-01-18',
        receiptId: 'receipt-003'
      }
    ],
    approvalHistory: [
      {
        id: 'hist-004',
        action: 'submitted',
        approverName: 'Sarah Johnson',
        approverId: 'emp-002',
        timestamp: '2024-01-20T11:30:00Z'
      },
      {
        id: 'hist-005',
        action: 'approved',
        approverName: 'Mike Wilson',
        approverId: 'mgr-002',
        comments: 'Approved for remote work setup',
        timestamp: '2024-01-21T15:00:00Z'
      }
    ]
  },
  {
    id: 'reimb-003',
    reimbursementNumber: 'REIMB-2024-003',
    title: 'Training Course Fee',
    description: 'Professional development course registration',
    employeeId: 'emp-003',
    employeeName: 'Michael Brown',
    department: 'Marketing',
    type: 'other',
    amount: 750.00,
    currency: 'USD',
    status: 'pending',
    priority: 'low',
    requestedDate: '2024-01-22T14:00:00Z',
    createdAt: '2024-01-21T16:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
    receipts: [
      {
        id: 'receipt-004',
        fileName: 'course_receipt.pdf',
        fileUrl: '/receipts/course_receipt.pdf',
        fileSize: 89340,
        uploadedAt: '2024-01-21T16:15:00Z'
      }
    ],
    lineItems: [
      {
        id: 'line-006',
        description: 'Digital Marketing Certification Course',
        category: 'Training',
        amount: 750.00,
        date: '2024-01-20',
        receiptId: 'receipt-004'
      }
    ],
    approvalHistory: [
      {
        id: 'hist-006',
        action: 'submitted',
        approverName: 'Michael Brown',
        approverId: 'emp-003',
        timestamp: '2024-01-22T14:00:00Z'
      }
    ]
  }
];

const MOCK_PAYMENT_BATCHES: PaymentBatch[] = [
  {
    id: 'batch-001',
    batchNumber: 'BATCH-2024-001',
    title: 'January 2024 Reimbursements',
    description: 'Monthly reimbursement batch processing',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    totalAmount: 15750.00,
    reimbursementCount: 12,
    createdBy: 'Finance Team',
    createdAt: '2024-01-25T10:00:00Z',
    processedAt: '2024-01-25T14:30:00Z',
    completedAt: '2024-01-25T16:00:00Z',
    reimbursementIds: ['reimb-001', 'reimb-004', 'reimb-005']
  },
  {
    id: 'batch-002',
    batchNumber: 'BATCH-2024-002',
    title: 'February 2024 Reimbursements',
    description: 'Monthly reimbursement batch processing',
    status: 'processing',
    paymentMethod: 'bank_transfer',
    totalAmount: 8900.00,
    reimbursementCount: 7,
    createdBy: 'Finance Team',
    createdAt: '2024-02-20T09:00:00Z',
    processedAt: '2024-02-20T11:00:00Z',
    reimbursementIds: ['reimb-002', 'reimb-006']
  }
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'method-001',
    name: 'Primary Bank Transfer',
    type: 'bank_transfer',
    description: 'Main corporate bank account for employee reimbursements',
    isActive: true,
    isDefault: true,
    settings: {
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      processingTime: '1-2 business days',
      fees: 0,
      limits: {
        daily: 50000,
        monthly: 500000,
        perTransaction: 10000
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'method-002',
    name: 'Check Payments',
    type: 'check',
    description: 'Physical check payments for special cases',
    isActive: true,
    isDefault: false,
    settings: {
      processingTime: '3-5 business days',
      fees: 2.50,
      limits: {
        perTransaction: 5000
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'method-003',
    name: 'Digital Wallet',
    type: 'digital_wallet',
    description: 'PayPal and other digital payment methods',
    isActive: true,
    isDefault: false,
    settings: {
      processingTime: 'Instant',
      fees: 2.9,
      limits: {
        daily: 10000,
        monthly: 100000,
        perTransaction: 2500
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const MOCK_VENDORS: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'John Doe',
    type: 'employee',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'Chase Bank',
      routingNumber: '021000021'
    },
    paymentTerms: 'Net 15',
    preferredPaymentMethod: 'bank_transfer',
    totalPaid: 15750.00,
    lastPaymentDate: '2024-01-18T16:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z'
  },
  {
    id: 'vendor-002',
    name: 'Sarah Johnson',
    type: 'employee',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    bankDetails: {
      accountNumber: '****5678',
      bankName: 'Wells Fargo',
      routingNumber: '121000248'
    },
    paymentTerms: 'Net 15',
    preferredPaymentMethod: 'bank_transfer',
    totalPaid: 8900.00,
    lastPaymentDate: '2024-01-15T14:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  }
];

export const useReimbursements = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [paymentBatches, setPaymentBatches] = useState<PaymentBatch[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<ReimbursementFilters>({
    search: '',
    status: undefined,
    type: undefined,
    department: undefined,
    dateRange: '30days'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReimbursements(MOCK_REIMBURSEMENTS);
      setPaymentBatches(MOCK_PAYMENT_BATCHES);
      setPaymentMethods(MOCK_PAYMENT_METHODS);
      setVendors(MOCK_VENDORS);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const summary = useMemo((): ReimbursementSummary => {
    const totalReimbursements = reimbursements.length;
    const pendingReimbursements = reimbursements.filter(r => r.status === 'pending').length;
    const approvedReimbursements = reimbursements.filter(r => r.status === 'approved').length;
    const rejectedReimbursements = reimbursements.filter(r => r.status === 'rejected').length;
    const paidReimbursements = reimbursements.filter(r => r.status === 'paid').length;
    const totalAmount = reimbursements.reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = reimbursements.filter(r => r.status === 'pending' || r.status === 'approved').reduce((sum, r) => sum + r.amount, 0);
    const paidAmount = reimbursements.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const pendingPayments = reimbursements.filter(r => r.status === 'approved').length;
    const avgProcessingTime = 24; // Mock average processing time in hours
    const monthlyReimbursements = 25000.00; // Mock monthly reimbursements
    const monthlyCount = 18; // Mock monthly count
    const monthlyBudget = 30000.00; // Mock monthly budget

    const topDepartments = reimbursements.reduce((acc, reimb) => {
      acc[reimb.department] = (acc[reimb.department] || 0) + reimb.amount;
      return acc;
    }, {} as { [key: string]: number });

    const topTypes = reimbursements.reduce((acc, reimb) => {
      acc[reimb.type] = (acc[reimb.type] || 0) + reimb.amount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalReimbursements,
      pendingReimbursements,
      approvedReimbursements,
      rejectedReimbursements,
      paidReimbursements,
      totalAmount,
      pendingAmount,
      paidAmount,
      pendingPayments,
      avgProcessingTime,
      monthlyReimbursements,
      monthlyCount,
      monthlyBudget,
      topDepartments,
      topTypes
    };
  }, [reimbursements]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<ReimbursementFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createReimbursement = useCallback(async (reimbursementData: Partial<Reimbursement>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReimbursement: Reimbursement = {
        id: `reimb-${Date.now()}`,
        reimbursementNumber: `REIMB-${new Date().getFullYear()}-${String(reimbursements.length + 1).padStart(3, '0')}`,
        title: reimbursementData.title || 'New Reimbursement',
        description: reimbursementData.description || '',
        employeeId: 'current-user',
        employeeName: 'Current User',
        department: reimbursementData.department || 'General',
        type: reimbursementData.type || 'expense',
        amount: reimbursementData.amount || 0,
        currency: 'USD',
        status: 'draft',
        priority: reimbursementData.priority || 'medium',
        requestedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receipts: [],
        lineItems: reimbursementData.lineItems || [],
        approvalHistory: []
      };
      
      setReimbursements(prev => [newReimbursement, ...prev]);
    } catch (error) {
      console.error('Error creating reimbursement:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [reimbursements.length]);

  const updateReimbursement = useCallback(async (reimbursementId: string, updates: Partial<Reimbursement>) => {
    setReimbursements(prev => prev.map(reimb => 
      reimb.id === reimbursementId ? { ...reimb, ...updates, updatedAt: new Date().toISOString() } : reimb
    ));
  }, []);

  const approveReimbursement = useCallback(async (reimbursementId: string, comments?: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReimbursements(prev => prev.map(reimb => 
        reimb.id === reimbursementId ? {
          ...reimb,
          status: 'approved',
          approvedDate: new Date().toISOString(),
          approvedBy: 'Current Manager',
          updatedAt: new Date().toISOString(),
          approvalHistory: [
            ...reimb.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'approved',
              approverName: 'Current Manager',
              approverId: 'current-manager',
              comments,
              timestamp: new Date().toISOString()
            }
          ]
        } : reimb
      ));
      
    } catch (error) {
      console.error('Error approving reimbursement:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const rejectReimbursement = useCallback(async (reimbursementId: string, reason: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReimbursements(prev => prev.map(reimb => 
        reimb.id === reimbursementId ? {
          ...reimb,
          status: 'rejected',
          rejectedDate: new Date().toISOString(),
          rejectedBy: 'Current Manager',
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
          approvalHistory: [
            ...reimb.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'rejected',
              approverName: 'Current Manager',
              approverId: 'current-manager',
              comments: reason,
              timestamp: new Date().toISOString()
            }
          ]
        } : reimb
      ));
      
    } catch (error) {
      console.error('Error rejecting reimbursement:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processPayment = useCallback(async (reimbursementId: string, paymentMethodId?: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentMethod = paymentMethods.find(m => m.id === paymentMethodId) || paymentMethods[0];
      
      setReimbursements(prev => prev.map(reimb => 
        reimb.id === reimbursementId ? {
          ...reimb,
          status: 'paid',
          paidDate: new Date().toISOString(),
          paidBy: 'Finance Team',
          paymentMethod: paymentMethod.type,
          updatedAt: new Date().toISOString(),
          paymentDetails: {
            method: paymentMethod.type,
            transactionId: `TXN${Date.now()}`,
            processedAt: new Date().toISOString()
          },
          approvalHistory: [
            ...reimb.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'paid',
              approverName: 'Finance Team',
              approverId: 'finance-team',
              comments: `Payment processed via ${paymentMethod.name}`,
              timestamp: new Date().toISOString()
            }
          ]
        } : reimb
      ));
      
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethods]);

  const createPaymentBatch = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const approvedReimbursements = reimbursements.filter(r => r.status === 'approved');
      const totalAmount = approvedReimbursements.reduce((sum, r) => sum + r.amount, 0);
      
      const newBatch: PaymentBatch = {
        id: `batch-${Date.now()}`,
        batchNumber: `BATCH-${new Date().getFullYear()}-${String(paymentBatches.length + 1).padStart(3, '0')}`,
        title: `${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Reimbursements`,
        description: 'Monthly reimbursement batch processing',
        status: 'draft',
        paymentMethod: 'bank_transfer',
        totalAmount,
        reimbursementCount: approvedReimbursements.length,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        reimbursementIds: approvedReimbursements.map(r => r.id)
      };
      
      setPaymentBatches(prev => [newBatch, ...prev]);
      
    } catch (error) {
      console.error('Error creating payment batch:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [reimbursements, paymentBatches.length]);

  const bulkProcessPayments = useCallback(async (reimbursementIds: string[], paymentMethodId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      for (const reimbursementId of reimbursementIds) {
        await processPayment(reimbursementId, paymentMethodId);
      }
      
    } catch (error) {
      console.error('Error bulk processing payments:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [processPayment]);

  const addPaymentMethod = useCallback(async (methodData: Partial<PaymentMethod>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newMethod: PaymentMethod = {
        id: `method-${Date.now()}`,
        name: methodData.name || 'New Payment Method',
        type: methodData.type || 'bank_transfer',
        description: methodData.description || '',
        isActive: methodData.isActive ?? true,
        isDefault: methodData.isDefault ?? false,
        settings: methodData.settings || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPaymentMethods(prev => [newMethod, ...prev]);
      
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csvContent = [
      'Reimbursement Number,Employee,Department,Type,Amount,Status,Requested Date,Paid Date',
      ...reimbursements.map(reimb => [
        reimb.reimbursementNumber,
        `"${reimb.employeeName}"`,
        reimb.department,
        reimb.type,
        reimb.amount,
        reimb.status,
        new Date(reimb.requestedDate).toLocaleDateString(),
        reimb.paidDate ? new Date(reimb.paidDate).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reimbursements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reimbursements]);

  const generatePaymentReport = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report generation
      console.log('Generating payment report...');
      
    } catch (error) {
      console.error('Error generating payment report:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    reimbursements,
    paymentBatches,
    paymentMethods,
    vendors,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createReimbursement,
    updateReimbursement,
    approveReimbursement,
    rejectReimbursement,
    processPayment,
    createPaymentBatch,
    bulkProcessPayments,
    addPaymentMethod,
    exportData,
    generatePaymentReport
  };
};