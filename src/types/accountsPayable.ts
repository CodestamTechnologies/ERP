export interface PayableInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  invoiceDate: string;
  dueDate: string;
  description: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'overdue' | 'cancelled' | 'partial_paid';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  paymentTerms: string;
  currency: string;
  exchangeRate?: number;
  attachments: string[];
  lineItems: PayableLineItem[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface PayableLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  accountCode?: string;
  projectId?: string;
  departmentId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    designation?: string;
  };
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  totalPurchases: number;
  averagePaymentDays: number;
  status: 'active' | 'inactive' | 'blocked';
  category: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode?: string;
  };
  documents: string[];
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastTransactionDate?: string;
}

export interface PaymentSchedule {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  scheduledDate: string;
  actualPaymentDate?: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'credit_card' | 'online';
  referenceNumber?: string;
  notes?: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'check' | 'cash' | 'credit_card' | 'online';
  referenceNumber: string;
  bankAccount?: string;
  checkNumber?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  currency: string;
  exchangeRate?: number;
  fees?: number;
  notes?: string;
  attachments: string[];
  reconciled: boolean;
  reconciledAt?: string;
  createdAt: string;
  createdBy: string;
  processedBy?: string;
  processedAt?: string;
}

export interface AgingBucket {
  range: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface VendorAgingBreakdown {
  vendorId: string;
  vendorName: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  days90plus: number;
  total: number;
}

export interface AgingReport {
  generatedAt: string;
  totalAmount: number;
  totalInvoices: number;
  buckets: AgingBucket[];
  vendorBreakdown: VendorAgingBreakdown[];
}

export interface AccountsPayableSummary {
  totalPayables: number;
  overduePayables: number;
  dueThisMonth: number;
  paidThisMonth: number;
  invoicesDueThisMonth: number;
  paymentsMadeThisMonth: number;
  activeVendors: number;
  newVendorsThisMonth: number;
  averagePaymentDays: number;
  cashFlowImpact: number;
  topVendorsByAmount: Array<{
    vendorId: string;
    vendorName: string;
    amount: number;
  }>;
  paymentMethodBreakdown: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
}

export interface PayableFilters {
  search?: string;
  status?: string;
  vendor?: string;
  dateRange?: string;
  amountRange?: {
    min: number;
    max: number;
  };
  priority?: string;
  approvalStatus?: string;
  paymentMethod?: string;
  tags?: string[];
  sortBy?: 'date' | 'amount' | 'vendor' | 'dueDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkPaymentRequest {
  invoiceIds: string[];
  paymentDate: string;
  paymentMethod: string;
  bankAccount?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentApproval {
  id: string;
  invoiceId: string;
  requestedBy: string;
  requestedAt: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  totalInvoices: number;
  totalAmount: number;
  averagePaymentDays: number;
  onTimePaymentRate: number;
  discountsTaken: number;
  disputesCount: number;
  qualityRating: number;
  lastPaymentDate: string;
  riskScore: number;
  paymentTrend: 'improving' | 'stable' | 'declining';
}

export interface PaymentReminder {
  id: string;
  invoiceId: string;
  vendorId: string;
  reminderType: 'email' | 'sms' | 'phone' | 'letter';
  scheduledDate: string;
  sentDate?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  template: string;
  customMessage?: string;
  createdBy: string;
  createdAt: string;
}