'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// Types for Salary Disbursement System
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  salaryStructure: {
    basicSalary: number;
    hra: number;
    allowances: number;
    deductions: number;
    grossSalary: number;
    netSalary: number;
  };
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountHolderName: string;
  };
  taxInfo: {
    panNumber: string;
    taxDeduction: number;
    providentFund: number;
    esi: number;
  };
  avatar?: string;
  manager?: string;
  location: string;
}

export interface PayrollBatch {
  id: string;
  batchName: string;
  payPeriod: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'approved' | 'completed' | 'cancelled';
  employeeCount: number;
  totalAmount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  processedAt?: string;
  employees: string[];
  notes?: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  payrollBatchId: string;
  payPeriod: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  overtime: number;
  bonus: number;
  grossSalary: number;
  taxDeduction: number;
  providentFund: number;
  esi: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'paid';
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  paidAt?: string;
}

export interface Disbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  salarySlipId: string;
  amount: number;
  bankAccount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  processedAt?: string;
  failureReason?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryFilters {
  search: string;
  department?: string;
  status?: string;
  payPeriod?: string;
  dateRange?: string;
}

export interface SalarySummary {
  totalEmployees: number;
  activeEmployees: number;
  totalMonthlyPayroll: number;
  processedThisMonth: number;
  processedCount: number;
  pendingDisbursements: number;
  totalDisbursements: number;
  pendingApprovals: number;
  rejectedSlips: number;
  totalSlips: number;
  averageSalary: number;
  highestSalary: number;
  lowestSalary: number;
}

// Mock Data
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    joiningDate: '2022-01-15',
    status: 'active',
    salaryStructure: {
      basicSalary: 80000,
      hra: 24000,
      allowances: 12000,
      deductions: 8000,
      grossSalary: 116000,
      netSalary: 108000
    },
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'Chase Bank',
      ifscCode: 'CHAS0001234',
      accountHolderName: 'John Doe'
    },
    taxInfo: {
      panNumber: 'ABCDE1234F',
      taxDeduction: 15000,
      providentFund: 9600,
      esi: 1740
    },
    manager: 'Jane Smith',
    location: 'New York'
  },
  {
    id: 'emp-002',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0102',
    department: 'Sales',
    designation: 'Sales Manager',
    joiningDate: '2021-03-20',
    status: 'active',
    salaryStructure: {
      basicSalary: 75000,
      hra: 22500,
      allowances: 15000,
      deductions: 7500,
      grossSalary: 112500,
      netSalary: 105000
    },
    bankDetails: {
      accountNumber: '2345678901',
      bankName: 'Wells Fargo',
      ifscCode: 'WELL0001234',
      accountHolderName: 'Sarah Johnson'
    },
    taxInfo: {
      panNumber: 'BCDEF2345G',
      taxDeduction: 14000,
      providentFund: 9000,
      esi: 1687
    },
    manager: 'Mike Wilson',
    location: 'California'
  },
  {
    id: 'emp-003',
    employeeId: 'EMP003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1-555-0103',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    joiningDate: '2023-06-10',
    status: 'active',
    salaryStructure: {
      basicSalary: 60000,
      hra: 18000,
      allowances: 8000,
      deductions: 6000,
      grossSalary: 86000,
      netSalary: 80000
    },
    bankDetails: {
      accountNumber: '3456789012',
      bankName: 'Bank of America',
      ifscCode: 'BOFA0001234',
      accountHolderName: 'Michael Brown'
    },
    taxInfo: {
      panNumber: 'CDEFG3456H',
      taxDeduction: 10000,
      providentFund: 7200,
      esi: 1290
    },
    manager: 'Lisa Davis',
    location: 'Texas'
  },
  {
    id: 'emp-004',
    employeeId: 'EMP004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1-555-0104',
    department: 'HR',
    designation: 'HR Manager',
    joiningDate: '2020-09-05',
    status: 'active',
    salaryStructure: {
      basicSalary: 70000,
      hra: 21000,
      allowances: 10000,
      deductions: 7000,
      grossSalary: 101000,
      netSalary: 94000
    },
    bankDetails: {
      accountNumber: '4567890123',
      bankName: 'Citibank',
      ifscCode: 'CITI0001234',
      accountHolderName: 'Emily Davis'
    },
    taxInfo: {
      panNumber: 'DEFGH4567I',
      taxDeduction: 12000,
      providentFund: 8400,
      esi: 1515
    },
    manager: 'Robert Taylor',
    location: 'Florida'
  },
  {
    id: 'emp-005',
    employeeId: 'EMP005',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1-555-0105',
    department: 'Finance',
    designation: 'Financial Analyst',
    joiningDate: '2022-11-12',
    status: 'on_leave',
    salaryStructure: {
      basicSalary: 65000,
      hra: 19500,
      allowances: 9000,
      deductions: 6500,
      grossSalary: 93500,
      netSalary: 87000
    },
    bankDetails: {
      accountNumber: '5678901234',
      bankName: 'JPMorgan Chase',
      ifscCode: 'JPMC0001234',
      accountHolderName: 'David Wilson'
    },
    taxInfo: {
      panNumber: 'EFGHI5678J',
      taxDeduction: 11000,
      providentFund: 7800,
      esi: 1402
    },
    manager: 'Jennifer Lee',
    location: 'Illinois'
  }
];

const MOCK_PAYROLL_BATCHES: PayrollBatch[] = [
  {
    id: 'batch-001',
    batchName: 'December 2024 Payroll',
    payPeriod: '2024-12',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'completed',
    employeeCount: 150,
    totalAmount: 1250000,
    createdBy: 'HR Admin',
    createdAt: '2024-12-25T10:00:00Z',
    updatedAt: '2024-12-28T15:30:00Z',
    approvedBy: 'Finance Manager',
    approvedAt: '2024-12-26T14:00:00Z',
    processedAt: '2024-12-28T15:30:00Z',
    employees: ['emp-001', 'emp-002', 'emp-003', 'emp-004', 'emp-005'],
    notes: 'Regular monthly payroll with year-end bonuses'
  },
  {
    id: 'batch-002',
    batchName: 'January 2025 Payroll',
    payPeriod: '2025-01',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'approved',
    employeeCount: 152,
    totalAmount: 1280000,
    createdBy: 'HR Admin',
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-01-26T11:00:00Z',
    approvedBy: 'Finance Manager',
    approvedAt: '2025-01-26T11:00:00Z',
    employees: ['emp-001', 'emp-002', 'emp-003', 'emp-004'],
    notes: 'January payroll with new salary revisions'
  },
  {
    id: 'batch-003',
    batchName: 'February 2025 Payroll',
    payPeriod: '2025-02',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    status: 'draft',
    employeeCount: 155,
    totalAmount: 1320000,
    createdBy: 'HR Admin',
    createdAt: '2025-02-20T10:30:00Z',
    updatedAt: '2025-02-20T10:30:00Z',
    employees: ['emp-001', 'emp-002', 'emp-003', 'emp-004', 'emp-005'],
    notes: 'February payroll - draft stage'
  }
];

const MOCK_SALARY_SLIPS: SalarySlip[] = [
  {
    id: 'slip-001',
    employeeId: 'emp-001',
    employeeName: 'John Doe',
    department: 'Engineering',
    payrollBatchId: 'batch-001',
    payPeriod: '2024-12',
    basicSalary: 80000,
    hra: 24000,
    allowances: 12000,
    overtime: 5000,
    bonus: 10000,
    grossSalary: 131000,
    taxDeduction: 15000,
    providentFund: 9600,
    esi: 1740,
    otherDeductions: 2000,
    totalDeductions: 28340,
    netSalary: 102660,
    status: 'approved',
    generatedAt: '2024-12-25T12:00:00Z',
    approvedBy: 'Finance Manager',
    approvedAt: '2024-12-26T14:30:00Z',
    paidAt: '2024-12-28T16:00:00Z'
  },
  {
    id: 'slip-002',
    employeeId: 'emp-002',
    employeeName: 'Sarah Johnson',
    department: 'Sales',
    payrollBatchId: 'batch-002',
    payPeriod: '2025-01',
    basicSalary: 75000,
    hra: 22500,
    allowances: 15000,
    overtime: 0,
    bonus: 8000,
    grossSalary: 120500,
    taxDeduction: 14000,
    providentFund: 9000,
    esi: 1687,
    otherDeductions: 1500,
    totalDeductions: 26187,
    netSalary: 94313,
    status: 'pending_approval',
    generatedAt: '2025-01-25T11:00:00Z'
  },
  {
    id: 'slip-003',
    employeeId: 'emp-003',
    employeeName: 'Michael Brown',
    department: 'Marketing',
    payrollBatchId: 'batch-002',
    payPeriod: '2025-01',
    basicSalary: 60000,
    hra: 18000,
    allowances: 8000,
    overtime: 2000,
    bonus: 5000,
    grossSalary: 93000,
    taxDeduction: 10000,
    providentFund: 7200,
    esi: 1290,
    otherDeductions: 1000,
    totalDeductions: 19490,
    netSalary: 73510,
    status: 'pending_approval',
    generatedAt: '2025-01-25T11:15:00Z'
  }
];

const MOCK_DISBURSEMENTS: Disbursement[] = [
  {
    id: 'disb-001',
    employeeId: 'emp-001',
    employeeName: 'John Doe',
    salarySlipId: 'slip-001',
    amount: 102660,
    bankAccount: '****7890',
    status: 'completed',
    transactionId: 'TXN001234567',
    processedAt: '2024-12-28T16:00:00Z',
    retryCount: 0,
    createdAt: '2024-12-28T15:45:00Z',
    updatedAt: '2024-12-28T16:00:00Z'
  },
  {
    id: 'disb-002',
    employeeId: 'emp-002',
    employeeName: 'Sarah Johnson',
    salarySlipId: 'slip-002',
    amount: 94313,
    bankAccount: '****8901',
    status: 'pending',
    retryCount: 0,
    createdAt: '2025-01-26T12:00:00Z',
    updatedAt: '2025-01-26T12:00:00Z'
  },
  {
    id: 'disb-003',
    employeeId: 'emp-003',
    employeeName: 'Michael Brown',
    salarySlipId: 'slip-003',
    amount: 73510,
    bankAccount: '****9012',
    status: 'pending',
    retryCount: 0,
    createdAt: '2025-01-26T12:15:00Z',
    updatedAt: '2025-01-26T12:15:00Z'
  }
];

export const useSalaryDisbursement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollBatches, setPayrollBatches] = useState<PayrollBatch[]>([]);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<SalaryFilters>({
    search: '',
    department: undefined,
    status: undefined,
    payPeriod: undefined,
    dateRange: '30days'
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(MOCK_EMPLOYEES);
      setPayrollBatches(MOCK_PAYROLL_BATCHES);
      setSalarySlips(MOCK_SALARY_SLIPS);
      setDisbursements(MOCK_DISBURSEMENTS);
      setLoading(false);
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const summary = useMemo((): SalarySummary => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.salaryStructure.netSalary, 0);
    const processedThisMonth = disbursements
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0);
    const processedCount = disbursements.filter(d => d.status === 'completed').length;
    const pendingDisbursements = disbursements.filter(d => d.status === 'pending').length;
    const totalDisbursements = disbursements.length;
    const pendingApprovals = salarySlips.filter(s => s.status === 'pending_approval').length;
    const rejectedSlips = salarySlips.filter(s => s.status === 'rejected').length;
    const totalSlips = salarySlips.length;
    
    const salaries = employees.map(emp => emp.salaryStructure.netSalary);
    const averageSalary = salaries.length > 0 ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
    const highestSalary = salaries.length > 0 ? Math.max(...salaries) : 0;
    const lowestSalary = salaries.length > 0 ? Math.min(...salaries) : 0;

    return {
      totalEmployees,
      activeEmployees,
      totalMonthlyPayroll,
      processedThisMonth,
      processedCount,
      pendingDisbursements,
      totalDisbursements,
      pendingApprovals,
      rejectedSlips,
      totalSlips,
      averageSalary,
      highestSalary,
      lowestSalary
    };
  }, [employees, salarySlips, disbursements]);

  // Event handlers
  const updateFilters = useCallback((newFilters: Partial<SalaryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const createPayrollBatch = useCallback(async (batchData: Partial<PayrollBatch>) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBatch: PayrollBatch = {
        id: `batch-${Date.now()}`,
        batchName: batchData.batchName || 'New Payroll Batch',
        payPeriod: batchData.payPeriod || new Date().toISOString().slice(0, 7),
        startDate: batchData.startDate || new Date().toISOString().split('T')[0],
        endDate: batchData.endDate || new Date().toISOString().split('T')[0],
        status: 'draft',
        employeeCount: batchData.employees?.length || 0,
        totalAmount: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employees: batchData.employees || []
      };
      
      setPayrollBatches(prev => [newBatch, ...prev]);
    } catch (error) {
      console.error('Error creating payroll batch:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateSalarySlips = useCallback(async (batchId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const batch = payrollBatches.find(b => b.id === batchId);
      if (!batch) return;
      
      const newSlips = batch.employees.map(empId => {
        const employee = employees.find(e => e.id === empId);
        if (!employee) return null;
        
        return {
          id: `slip-${Date.now()}-${empId}`,
          employeeId: empId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          department: employee.department,
          payrollBatchId: batchId,
          payPeriod: batch.payPeriod,
          basicSalary: employee.salaryStructure.basicSalary,
          hra: employee.salaryStructure.hra,
          allowances: employee.salaryStructure.allowances,
          overtime: Math.floor(Math.random() * 5000),
          bonus: Math.floor(Math.random() * 10000),
          grossSalary: employee.salaryStructure.grossSalary,
          taxDeduction: employee.taxInfo.taxDeduction,
          providentFund: employee.taxInfo.providentFund,
          esi: employee.taxInfo.esi,
          otherDeductions: Math.floor(Math.random() * 2000),
          totalDeductions: employee.salaryStructure.deductions,
          netSalary: employee.salaryStructure.netSalary,
          status: 'pending_approval' as const,
          generatedAt: new Date().toISOString()
        };
      }).filter(Boolean) as SalarySlip[];
      
      setSalarySlips(prev => [...newSlips, ...prev]);
      
      // Update batch status
      setPayrollBatches(prev => prev.map(b => 
        b.id === batchId ? { ...b, status: 'processing', updatedAt: new Date().toISOString() } : b
      ));
      
    } catch (error) {
      console.error('Error generating salary slips:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [payrollBatches, employees]);

  const approveSalarySlip = useCallback(async (slipId: string) => {
    setSalarySlips(prev => prev.map(slip => 
      slip.id === slipId ? {
        ...slip,
        status: 'approved',
        approvedBy: 'Current User',
        approvedAt: new Date().toISOString()
      } : slip
    ));
  }, []);

  const rejectSalarySlip = useCallback(async (slipId: string, reason: string) => {
    setSalarySlips(prev => prev.map(slip => 
      slip.id === slipId ? {
        ...slip,
        status: 'rejected',
        rejectedReason: reason
      } : slip
    ));
  }, []);

  const processDisbursement = useCallback(async (disbursementId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDisbursements(prev => prev.map(disb => 
        disb.id === disbursementId ? {
          ...disb,
          status: 'completed',
          transactionId: `TXN${Date.now()}`,
          processedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : disb
      ));
      
    } catch (error) {
      console.error('Error processing disbursement:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const bulkProcessDisbursement = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDisbursements(prev => prev.map(disb => 
        disb.status === 'pending' ? {
          ...disb,
          status: 'completed',
          transactionId: `TXN${Date.now()}-${disb.id}`,
          processedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : disb
      ));
      
    } catch (error) {
      console.error('Error bulk processing disbursements:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportPayrollData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csvContent = [
      'Employee ID,Name,Department,Basic Salary,HRA,Allowances,Gross Salary,Deductions,Net Salary,Status',
      ...employees.map(emp => [
        emp.employeeId,
        `"${emp.firstName} ${emp.lastName}"`,
        emp.department,
        emp.salaryStructure.basicSalary,
        emp.salaryStructure.hra,
        emp.salaryStructure.allowances,
        emp.salaryStructure.grossSalary,
        emp.salaryStructure.deductions,
        emp.salaryStructure.netSalary,
        emp.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [employees]);

  const uploadBulkSalaryData = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock processing of uploaded file
      console.log('Processing uploaded file:', file.name);
    } catch (error) {
      console.error('Error uploading bulk salary data:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    employees,
    payrollBatches,
    salarySlips,
    disbursements,
    summary,
    loading,
    filters,
    isProcessing,
    updateFilters,
    createPayrollBatch,
    generateSalarySlips,
    approveSalarySlip,
    rejectSalarySlip,
    processDisbursement,
    bulkProcessDisbursement,
    exportPayrollData,
    uploadBulkSalaryData
  };
};