'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Types for Expense Claims System
export interface ExpenseClaim {
  id: string;
  claimNumber: string;
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'travel' | 'meals' | 'accommodation' | 'office' | 'transport' | 'other';
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  receipts: ExpenseReceipt[];
  expenses: ExpenseItem[];
  approvalHistory: ApprovalHistory[];
  reimbursementDetails?: ReimbursementDetails;
}

export interface ExpenseItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  receiptId?: string;
  isReimbursable: boolean;
  taxAmount?: number;
  notes?: string;
}

export interface ExpenseReceipt {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  expenseItemId?: string;
}

export interface ApprovalHistory {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'returned';
  approverName: string;
  approverId: string;
  comments?: string;
  timestamp: string;
}

export interface ReimbursementDetails {
  method: 'bank_transfer' | 'check' | 'cash';
  bankAccount?: string;
  checkNumber?: string;
  processedAt?: string;
  transactionId?: string;
}

export interface Approval {
  id: string;
  claimId: string;
  claimTitle: string;
  claimNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  currency: string;
  category: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  daysWaiting: number;
  requiresAttention: boolean;
}

export interface ExpenseReport {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: string;
  totalAmount: number;
  claimsCount: number;
  categories: { [key: string]: number };
  departments: { [key: string]: number };
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
}

export interface ExpensePolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  requiresReceipt: boolean;
  requiresApproval: boolean;
  approvalLevels: ApprovalLevel[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalLevel {
  level: number;
  approverRole: string;
  amountThreshold: number;
  isRequired: boolean;
}

export interface ExpenseFilters {
  search: string;
  status?: string;
  category?: string;
  department?: string;
  dateRange?: string;
  employeeId?: string;
}

export interface ExpenseSummary {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  pendingApprovals: number;
  avgApprovalTime: number;
  monthlyExpenses: number;
  monthlyClaimsCount: number;
  monthlyBudget: number;
  topCategories: { [key: string]: number };
  topDepartments: { [key: string]: number };
}

// Mock Data
const MOCK_CLAIMS: ExpenseClaim[] = [
  {
    id: 'claim-001',
    claimNumber: 'EXP-2024-001',
    title: 'Business Trip to New York',
    description: 'Client meeting and conference attendance',
    employeeId: 'emp-001',
    employeeName: 'John Doe',
    department: 'Sales',
    category: 'travel',
    amount: 2450.00,
    currency: 'USD',
    status: 'approved',
    submittedAt: '2024-01-15T10:00:00Z',
    approvedAt: '2024-01-16T14:30:00Z',
    approvedBy: 'Jane Smith',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
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
    expenses: [
      {
        id: 'exp-001',
        date: '2024-01-10',
        description: 'Flight to New York',
        category: 'travel',
        amount: 850.00,
        currency: 'USD',
        receiptId: 'receipt-001',
        isReimbursable: true
      },
      {
        id: 'exp-002',
        date: '2024-01-10',
        description: 'Hotel accommodation (3 nights)',
        category: 'accommodation',
        amount: 1200.00,
        currency: 'USD',
        receiptId: 'receipt-002',
        isReimbursable: true
      },
      {
        id: 'exp-003',
        date: '2024-01-11',
        description: 'Client dinner',
        category: 'meals',
        amount: 400.00,
        currency: 'USD',
        isReimbursable: true
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
      }
    ]
  },
  {
    id: 'claim-002',
    claimNumber: 'EXP-2024-002',
    title: 'Office Supplies Purchase',
    description: 'Stationery and equipment for team',
    employeeId: 'emp-002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    category: 'office',
    amount: 350.00,
    currency: 'USD',
    status: 'pending',
    submittedAt: '2024-01-20T11:30:00Z',
    createdAt: '2024-01-19T15:00:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    receipts: [
      {
        id: 'receipt-003',
        fileName: 'office_supplies.pdf',
        fileUrl: '/receipts/office_supplies.pdf',
        fileSize: 156780,
        uploadedAt: '2024-01-19T15:15:00Z'
      }
    ],
    expenses: [
      {
        id: 'exp-004',
        date: '2024-01-18',
        description: 'Printer paper and ink cartridges',
        category: 'office',
        amount: 180.00,
        currency: 'USD',
        receiptId: 'receipt-003',
        isReimbursable: true
      },
      {
        id: 'exp-005',
        date: '2024-01-18',
        description: 'Notebooks and pens',
        category: 'office',
        amount: 170.00,
        currency: 'USD',
        receiptId: 'receipt-003',
        isReimbursable: true
      }
    ],
    approvalHistory: [
      {
        id: 'hist-003',
        action: 'submitted',
        approverName: 'Sarah Johnson',
        approverId: 'emp-002',
        timestamp: '2024-01-20T11:30:00Z'
      }
    ]
  },
  {
    id: 'claim-003',
    claimNumber: 'EXP-2024-003',
    title: 'Conference Registration',
    description: 'Tech conference registration and travel',
    employeeId: 'emp-003',
    employeeName: 'Michael Brown',
    department: 'Engineering',
    category: 'travel',
    amount: 1800.00,
    currency: 'USD',
    status: 'rejected',
    submittedAt: '2024-01-18T09:00:00Z',
    rejectedAt: '2024-01-19T16:00:00Z',
    rejectedBy: 'David Wilson',
    rejectionReason: 'Conference not pre-approved. Please get approval before registration.',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    receipts: [
      {
        id: 'receipt-004',
        fileName: 'conference_receipt.pdf',
        fileUrl: '/receipts/conference_receipt.pdf',
        fileSize: 234560,
        uploadedAt: '2024-01-17T14:15:00Z'
      }
    ],
    expenses: [
      {
        id: 'exp-006',
        date: '2024-01-15',
        description: 'Conference registration fee',
        category: 'travel',
        amount: 1200.00,
        currency: 'USD',
        receiptId: 'receipt-004',
        isReimbursable: true
      },
      {
        id: 'exp-007',
        date: '2024-01-16',
        description: 'Flight and accommodation',
        category: 'travel',
        amount: 600.00,
        currency: 'USD',
        isReimbursable: true
      }
    ],
    approvalHistory: [
      {
        id: 'hist-004',
        action: 'submitted',
        approverName: 'Michael Brown',
        approverId: 'emp-003',
        timestamp: '2024-01-18T09:00:00Z'
      },
      {
        id: 'hist-005',
        action: 'rejected',
        approverName: 'David Wilson',
        approverId: 'mgr-002',
        comments: 'Conference not pre-approved. Please get approval before registration.',
        timestamp: '2024-01-19T16:00:00Z'
      }
    ]
  }
];

const MOCK_APPROVALS: Approval[] = [
  {
    id: 'approval-001',
    claimId: 'claim-002',
    claimTitle: 'Office Supplies Purchase',
    claimNumber: 'EXP-2024-002',
    employeeId: 'emp-002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    amount: 350.00,
    currency: 'USD',
    category: 'office',
    submittedAt: '2024-01-20T11:30:00Z',
    priority: 'medium',
    daysWaiting: 3,
    requiresAttention: false
  },
  {
    id: 'approval-002',
    claimId: 'claim-004',
    claimTitle: 'Client Entertainment',
    claimNumber: 'EXP-2024-004',
    employeeId: 'emp-004',
    employeeName: 'Emily Davis',
    department: 'Sales',
    amount: 850.00,
    currency: 'USD',
    category: 'meals',
    submittedAt: '2024-01-22T14:00:00Z',
    priority: 'high',
    daysWaiting: 1,
    requiresAttention: true
  }
];

const MOCK_REPORTS: ExpenseReport[] = [
  {
    id: 'report-001',
    title: 'January 2024 Expense Report',
    type: 'monthly',
    period: '2024-01',
    totalAmount: 15750.00,
    claimsCount: 45,
    categories: {
      'travel': 8500.00,
      'meals': 3200.00,
      'office': 2800.00,
      'accommodation': 1250.00
    },
    departments: {
      'Sales': 6500.00,
      'Marketing': 4200.00,
      'Engineering': 3800.00,
      'HR': 1250.00
    },
    generatedAt: '2024-02-01T10:00:00Z',
    generatedBy: 'Finance Team',
    fileUrl: '/reports/january_2024_expenses.pdf'
  }
];

const MOCK_POLICIES: ExpensePolicy[] = [
  {
    id: 'policy-001',
    name: 'Travel Expense Policy',
    description: 'Guidelines for travel-related expenses including flights, accommodation, and meals',
    category: 'travel',
    dailyLimit: 200.00,
    monthlyLimit: 5000.00,
    requiresReceipt: true,
    requiresApproval: true,
    approvalLevels: [
      {
        level: 1,
        approverRole: 'Manager',
        amountThreshold: 1000.00,
        isRequired: true
      },
      {
        level: 2,
        approverRole: 'Director',
        amountThreshold: 5000.00,
        isRequired: true
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'policy-002',
    name: 'Office Supplies Policy',
    description: 'Policy for office supplies and equipment purchases',
    category: 'office',
    monthlyLimit: 500.00,
    requiresReceipt: true,
    requiresApproval: false,
    approvalLevels: [
      {
        level: 1,
        approverRole: 'Manager',
        amountThreshold: 200.00,
        isRequired: false
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useExpenseClaims = () => {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [policies, setPolicies] = useState<ExpensePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<ExpenseFilters>({
    search: '',
    status: undefined,
    category: undefined,
    department: undefined,
    dateRange: '30days'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClaims(MOCK_CLAIMS);
      setApprovals(MOCK_APPROVALS);
      setReports(MOCK_REPORTS);
      setPolicies(MOCK_POLICIES);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const summary = useMemo((): ExpenseSummary => {
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const approvedClaims = claims.filter(c => c.status === 'approved').length;
    const rejectedClaims = claims.filter(c => c.status === 'rejected').length;
    const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
    const approvedAmount = claims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);
    const pendingAmount = claims.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const pendingApprovals = approvals.length;
    const avgApprovalTime = 24; // Mock average approval time in hours
    const monthlyExpenses = 15750.00; // Mock monthly expenses
    const monthlyClaimsCount = 45; // Mock monthly claims count
    const monthlyBudget = 20000.00; // Mock monthly budget

    const topCategories = claims.reduce((acc, claim) => {
      acc[claim.category] = (acc[claim.category] || 0) + claim.amount;
      return acc;
    }, {} as { [key: string]: number });

    const topDepartments = claims.reduce((acc, claim) => {
      acc[claim.department] = (acc[claim.department] || 0) + claim.amount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalAmount,
      approvedAmount,
      pendingAmount,
      pendingApprovals,
      avgApprovalTime,
      monthlyExpenses,
      monthlyClaimsCount,
      monthlyBudget,
      topCategories,
      topDepartments
    };
  }, [claims, approvals]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<ExpenseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createClaim = useCallback(async (claimData: Partial<ExpenseClaim>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newClaim: ExpenseClaim = {
        id: `claim-${Date.now()}`,
        claimNumber: `EXP-${new Date().getFullYear()}-${String(claims.length + 1).padStart(3, '0')}`,
        title: claimData.title || 'New Expense Claim',
        description: claimData.description || '',
        employeeId: 'current-user',
        employeeName: 'Current User',
        department: claimData.department || 'General',
        category: claimData.category || 'other',
        amount: claimData.amount || 0,
        currency: 'USD',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receipts: [],
        expenses: claimData.expenses || [],
        approvalHistory: []
      };
      
      setClaims(prev => [newClaim, ...prev]);
    } catch (error) {
      console.error('Error creating claim:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [claims.length]);

  const updateClaim = useCallback(async (claimId: string, updates: Partial<ExpenseClaim>) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId ? { ...claim, ...updates, updatedAt: new Date().toISOString() } : claim
    ));
  }, []);

  const submitClaim = useCallback(async (claimId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? {
          ...claim,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          approvalHistory: [
            ...claim.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'submitted',
              approverName: claim.employeeName,
              approverId: claim.employeeId,
              timestamp: new Date().toISOString()
            }
          ]
        } : claim
      ));
      
      // Add to approvals list
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        const newApproval: Approval = {
          id: `approval-${Date.now()}`,
          claimId: claim.id,
          claimTitle: claim.title,
          claimNumber: claim.claimNumber,
          employeeId: claim.employeeId,
          employeeName: claim.employeeName,
          department: claim.department,
          amount: claim.amount,
          currency: claim.currency,
          category: claim.category,
          submittedAt: new Date().toISOString(),
          priority: claim.amount > 1000 ? 'high' : 'medium',
          daysWaiting: 0,
          requiresAttention: claim.amount > 2000
        };
        
        setApprovals(prev => [newApproval, ...prev]);
      }
      
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [claims]);

  const approveClaim = useCallback(async (claimId: string, comments?: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? {
          ...claim,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: 'Current Manager',
          updatedAt: new Date().toISOString(),
          approvalHistory: [
            ...claim.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'approved',
              approverName: 'Current Manager',
              approverId: 'current-manager',
              comments,
              timestamp: new Date().toISOString()
            }
          ]
        } : claim
      ));
      
      // Remove from approvals list
      setApprovals(prev => prev.filter(approval => approval.claimId !== claimId));
      
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const rejectClaim = useCallback(async (claimId: string, reason: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? {
          ...claim,
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectedBy: 'Current Manager',
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
          approvalHistory: [
            ...claim.approvalHistory,
            {
              id: `hist-${Date.now()}`,
              action: 'rejected',
              approverName: 'Current Manager',
              approverId: 'current-manager',
              comments: reason,
              timestamp: new Date().toISOString()
            }
          ]
        } : claim
      ));
      
      // Remove from approvals list
      setApprovals(prev => prev.filter(approval => approval.claimId !== claimId));
      
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const bulkApprove = useCallback(async (claimIds: string[], comments?: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      for (const claimId of claimIds) {
        await approveClaim(claimId, comments);
      }
      
    } catch (error) {
      console.error('Error bulk approving claims:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [approveClaim]);

  const generateReport = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ExpenseReport = {
        id: `report-${Date.now()}`,
        title: `${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Expense Report`,
        type: 'monthly',
        period: new Date().toISOString().slice(0, 7),
        totalAmount: summary.totalAmount,
        claimsCount: summary.totalClaims,
        categories: summary.topCategories,
        departments: summary.topDepartments,
        generatedAt: new Date().toISOString(),
        generatedBy: 'Current User'
      };
      
      setReports(prev => [newReport, ...prev]);
      
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [summary]);

  const exportData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csvContent = [
      'Claim Number,Employee,Department,Category,Amount,Status,Submitted Date,Approved Date',
      ...claims.map(claim => [
        claim.claimNumber,
        `"${claim.employeeName}"`,
        claim.department,
        claim.category,
        claim.amount,
        claim.status,
        claim.submittedAt ? new Date(claim.submittedAt).toLocaleDateString() : '',
        claim.approvedAt ? new Date(claim.approvedAt).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_claims_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [claims]);

  const uploadReceipts = useCallback(async (files: File[], claimId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReceipts: ExpenseReceipt[] = files.map(file => ({
        id: `receipt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileUrl: `/receipts/${file.name}`,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      }));
      
      setClaims(prev => prev.map(claim => 
        claim.id === claimId ? {
          ...claim,
          receipts: [...claim.receipts, ...newReceipts],
          updatedAt: new Date().toISOString()
        } : claim
      ));
      
    } catch (error) {
      console.error('Error uploading receipts:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    claims,
    approvals,
    reports,
    policies,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createClaim,
    updateClaim,
    submitClaim,
    approveClaim,
    rejectClaim,
    bulkApprove,
    generateReport,
    exportData,
    uploadReceipts
  };
};