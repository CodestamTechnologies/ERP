'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, Plus, Search, Download, Calendar, Send, RefreshCw, 
  Building2, Clock, AlertTriangle, Eye, CreditCard,
  ArrowUpDown, ArrowUp, ArrowDown, CalendarDays, Receipt
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useVendorBills } from '@/hooks/useVendorBills';

// Import the VendorBill type and define additional interfaces
interface VendorBill {
  id: string; billNumber: string; vendorId: string; vendorName: string;
  billDate: string; dueDate: string; amount: number; paidAmount: number;
  remainingAmount: number; status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  priority: 'high' | 'medium' | 'low'; description?: string; category: string;
  taxAmount: number; discountAmount: number; attachments: string[];
  createdAt: string; updatedAt: string; approvedBy?: string; approvedAt?: string;
  paymentTerms: string; reference?: string;
}

interface CreateBillData {
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  amount: number;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  category: string;
  taxAmount: number;
  discountAmount: number;
  attachments?: string[];
  paymentTerms: string;
  reference?: string;
}

interface PaymentData {
  amount: number;
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
  reminderDays?: number;
}
import { CreateVendorBillDialog } from '@/components/finance/vendor-bills/dialogs/CreateVendorBillDialog';
import { PaymentDialog } from '@/components/finance/vendor-bills/dialogs/PaymentDialog';
import { BulkPaymentDialog } from '@/components/finance/vendor-bills/dialogs/BulkPaymentDialog';
import { VendorBillDetailsDialog } from '@/components/finance/vendor-bills/dialogs/VendorBillDetailsDialog';
import { SchedulePaymentDialog } from '@/components/finance/vendor-bills/dialogs/SchedulePaymentDialog';
import { VendorBillCard } from '@/components/finance/vendor-bills/VendorBillCard';
import { DuePaymentCard } from '@/components/finance/vendor-bills/DuePaymentCard';
import { VendorSummaryCard } from '@/components/finance/vendor-bills/VendorSummaryCard';

const VendorBillsPage = () => {
  const {
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
  } = useVendorBills();

  // State management
  const [activeTab, setActiveTab] = useState('bills');
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  
  // Dialog states
  const [dialogs, setDialogs] = useState({
    createBill: false,
    payment: false,
    bulkPayment: false,
    billDetails: false,
    schedulePayment: false
  });
  
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);

  // Computed values
  const statsData = useMemo(() => [
    {
      name: 'Total Outstanding',
      value: `₹${(summary.totalOutstanding / 100000).toFixed(1)}L`,
      description: 'Total unpaid vendor bills',
      change: '+8.5%',
      changeType: 'negative' as const,
      icon: <FileText size={20} />,
      target: `₹${((summary.totalOutstanding * 0.8) / 100000).toFixed(1)}L`,
      progress: 80
    },
    {
      name: 'Due This Week',
      value: `₹${(summary.dueThisWeek / 100000).toFixed(1)}L`,
      description: 'Bills due in next 7 days',
      change: '+12.3%',
      changeType: 'negative' as const,
      icon: <Clock size={20} />,
      target: `₹${((summary.dueThisWeek * 0.7) / 100000).toFixed(1)}L`,
      progress: 70
    },
    {
      name: 'Overdue Amount',
      value: `₹${(summary.overdueAmount / 100000).toFixed(1)}L`,
      description: 'Past due payments',
      change: '-5.2%',
      changeType: 'positive' as const,
      icon: <AlertTriangle size={20} />,
      target: `₹${((summary.overdueAmount * 0.5) / 100000).toFixed(1)}L`,
      progress: 50
    },
    {
      name: 'Active Vendors',
      value: summary.activeVendors.toString(),
      description: 'Vendors with pending bills',
      change: '+3 vendors',
      changeType: 'neutral' as const,
      icon: <Building2 size={20} />,
      target: `${Math.round(summary.activeVendors * 1.1)}`,
      progress: 91
    }
  ], [summary]);

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    const filtered = bills.filter(bill => {
      const matchesSearch = !filters.search || 
        bill.billNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        bill.vendorName.toLowerCase().includes(filters.search.toLowerCase()) ||
        bill.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || filters.status === 'all' || bill.status === filters.status;
      const matchesVendor = !filters.vendor || filters.vendor === 'all' || bill.vendorId === filters.vendor;
      const matchesPriority = !filters.priority || filters.priority === 'all' || bill.priority === filters.priority;
      
      return matchesSearch && matchesStatus && matchesVendor && matchesPriority;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof VendorBill];
      const bValue = b[sortConfig.key as keyof VendorBill];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bills, filters, sortConfig]);

  // Filter due payments
  const filteredDuePayments = useMemo(() => {
    return duePayments.filter(payment => {
      const matchesSearch = !filters.search || 
        payment.billNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.vendorName.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesSearch;
    });
  }, [duePayments, filters.search]);

  // Event handlers
  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSelectBill = useCallback((billId: string, selected: boolean) => {
    setSelectedBills(prev => 
      selected 
        ? [...prev, billId]
        : prev.filter(id => id !== billId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedBills(selected ? filteredBills.map(bill => bill.id) : []);
  }, [filteredBills]);

  const handleCreateBill = async (billData: CreateBillData) => {
    try {
      await createBill(billData);
      setDialogs(prev => ({ ...prev, createBill: false }));
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const handleCreateBillFromDialog = async (billData: {
    vendorId: string;
    vendorName: string;
    billDate: string;
    dueDate: string;
    amount: number;
    taxAmount: number;
    discountAmount: number;
    description: string;
    category: string;
    priority: string;
    paymentTerms: string;
    reference: string;
    attachments: string[];
  }) => {
    // Convert VendorBillData to CreateBillData with proper type casting
    const createBillData: CreateBillData = {
      vendorId: billData.vendorId,
      vendorName: billData.vendorName,
      billDate: billData.billDate,
      dueDate: billData.dueDate,
      amount: billData.amount,
      priority: billData.priority as 'high' | 'medium' | 'low',
      description: billData.description,
      category: billData.category,
      taxAmount: billData.taxAmount,
      discountAmount: billData.discountAmount,
      attachments: billData.attachments,
      paymentTerms: billData.paymentTerms,
      reference: billData.reference
    };
    
    await handleCreateBill(createBillData);
  };

  const handleProcessPayment = async (billId: string, paymentData: PaymentData) => {
    try {
      await processPayment(billId, paymentData);
      setDialogs(prev => ({ ...prev, payment: false }));
      setSelectedBill(null);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleBulkPayment = async (billIds: string[], paymentData: {
    paymentMethod: string;
    paymentDate: string;
    reference: string;
    notes: string;
    totalAmount: number;
  }) => {
    try {
      // Convert to PaymentData format expected by the hook
      const convertedPaymentData: PaymentData = {
        amount: paymentData.totalAmount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        reference: paymentData.reference,
        notes: paymentData.notes
      };
      await bulkPayment(billIds, convertedPaymentData);
      setDialogs(prev => ({ ...prev, bulkPayment: false }));
      setSelectedBills([]);
    } catch (error) {
      console.error('Error processing bulk payment:', error);
    }
  };

  const handleSchedulePayment = async (billId: string, scheduleData: ScheduleData) => {
    try {
      await schedulePayment(billId, scheduleData);
      setDialogs(prev => ({ ...prev, schedulePayment: false }));
      setSelectedBill(null);
    } catch (error) {
      console.error('Error scheduling payment:', error);
    }
  };

  const handleExportData = async () => {
    try {
      await exportData();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1" />
      : <ArrowDown size={14} className="ml-1" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Receipt size={28} className="mr-3 text-blue-600" />
            Vendor Bills & Due Payments
          </h1>
          <p className="text-gray-600 mt-1">Manage vendor bills, track due payments, and process payments efficiently</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          {selectedBills.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}
              disabled={isProcessing}
            >
              <Send size={16} className="mr-2" />
              Bulk Payment ({selectedBills.length})
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleExportData} 
            disabled={isProcessing}
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={refreshData} 
            disabled={isProcessing}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setDialogs(prev => ({ ...prev, createBill: true }))}>
            <Plus size={16} className="mr-2" />
            New Bill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <div className="text-blue-600">
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {stat.target}</span>
                    <span>{stat.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={stat.progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full overflow-x-auto flex justify-start">
              <TabsTrigger value="bills" className="flex items-center space-x-2">
                <FileText size={16} className="text-blue-600" />
                <span>All Bills ({bills.length})</span>
              </TabsTrigger>
              <TabsTrigger value="due" className="flex items-center space-x-2">
                <Clock size={16} className="text-orange-600" />
                <span>Due Payments ({duePayments.length})</span>
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span>Overdue ({bills.filter(b => b.status === 'overdue').length})</span>
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center space-x-2">
                <Building2 size={16} className="text-green-600" />
                <span>Vendors ({vendors.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search bills, vendors, or descriptions..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.vendor || 'all'} 
                  onValueChange={(value) => updateFilters({ vendor: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.priority || 'all'} 
                  onValueChange={(value) => updateFilters({ priority: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                  >
                    Cards
                  </Button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'bills' && (
                <div className="space-y-4">
                  {/* Bulk Actions */}
                  {selectedBills.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-800">
                            {selectedBills.length} bill(s) selected
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setDialogs(prev => ({ ...prev, bulkPayment: true }))}
                              disabled={isProcessing}
                            >
                              <Send size={16} className="mr-2" />
                              Bulk Payment
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedBills([])}
                            >
                              Clear Selection
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bills Table/Cards */}
                  {viewMode === 'table' ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={selectedBills.length === filteredBills.length && filteredBills.length > 0}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('billNumber')}
                            >
                              <div className="flex items-center">
                                Bill Number
                                {renderSortIcon('billNumber')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('vendorName')}
                            >
                              <div className="flex items-center">
                                Vendor
                                {renderSortIcon('vendorName')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('amount')}
                            >
                              <div className="flex items-center">
                                Amount
                                {renderSortIcon('amount')}
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort('dueDate')}
                            >
                              <div className="flex items-center">
                                Due Date
                                {renderSortIcon('dueDate')}
                              </div>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBills.map((bill) => {
                            const daysUntilDue = getDaysUntilDue(bill.dueDate);
                            return (
                              <TableRow key={bill.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedBills.includes(bill.id)}
                                    onCheckedChange={(checked) => handleSelectBill(bill.id, checked as boolean)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{bill.billNumber}</div>
                                    <div className="text-sm text-gray-500">{formatDate(bill.billDate)}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{bill.vendorName}</div>
                                    {bill.description && (
                                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                        {bill.description}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{formatCurrency(bill.amount)}</div>
                                  {bill.paidAmount > 0 && (
                                    <div className="text-sm text-green-600">
                                      Paid: {formatCurrency(bill.paidAmount)}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{formatDate(bill.dueDate)}</div>
                                    <div className={`text-sm ${
                                      daysUntilDue < 0 ? 'text-red-600' :
                                      daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-500'
                                    }`}>
                                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                                       daysUntilDue === 0 ? 'Due today' :
                                       `${daysUntilDue} days left`}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(bill.status)}>
                                    {bill.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getPriorityColor(bill.priority)}>
                                    {bill.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedBill(bill);
                                        setDialogs(prev => ({ ...prev, billDetails: true }));
                                      }}
                                    >
                                      <Eye size={16} />
                                    </Button>
                                    {bill.status !== 'paid' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedBill(bill);
                                          setDialogs(prev => ({ ...prev, payment: true }));
                                        }}
                                      >
                                        <CreditCard size={16} />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedBill(bill);
                                        setDialogs(prev => ({ ...prev, schedulePayment: true }));
                                      }}
                                    >
                                      <CalendarDays size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredBills.map((bill) => (
                        <VendorBillCard
                          key={bill.id}
                          bill={bill}
                          isSelected={selectedBills.includes(bill.id)}
                          onSelect={(selected) => handleSelectBill(bill.id, selected)}
                          onViewDetails={() => {
                            setSelectedBill(bill);
                            setDialogs(prev => ({ ...prev, billDetails: true }));
                          }}
                          onProcessPayment={() => {
                            setSelectedBill(bill);
                            setDialogs(prev => ({ ...prev, payment: true }));
                          }}
                          onSchedulePayment={() => {
                            setSelectedBill(bill);
                            setDialogs(prev => ({ ...prev, schedulePayment: true }));
                          }}
                          formatCurrency={formatCurrency}
                          formatDate={formatDate}
                          getDaysUntilDue={getDaysUntilDue}
                          getStatusColor={getStatusColor}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'due' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDuePayments.map((payment) => (
                    <DuePaymentCard
                      key={payment.id}
                      payment={payment}
                      onProcessPayment={() => {
                        const bill = bills.find(b => b.id === payment.billId);
                        if (bill) {
                          setSelectedBill(bill);
                          setDialogs(prev => ({ ...prev, payment: true }));
                        }
                      }}
                      onSchedulePayment={() => {
                        const bill = bills.find(b => b.id === payment.billId);
                        if (bill) {
                          setSelectedBill(bill);
                          setDialogs(prev => ({ ...prev, schedulePayment: true }));
                        }
                      }}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      getDaysUntilDue={getDaysUntilDue}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'overdue' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bills.filter(bill => bill.status === 'overdue').map((bill) => (
                    <VendorBillCard
                      key={bill.id}
                      bill={bill}
                      isSelected={selectedBills.includes(bill.id)}
                      onSelect={(selected) => handleSelectBill(bill.id, selected)}
                      onViewDetails={() => {
                        setSelectedBill(bill);
                        setDialogs(prev => ({ ...prev, billDetails: true }));
                      }}
                      onProcessPayment={() => {
                        setSelectedBill(bill);
                        setDialogs(prev => ({ ...prev, payment: true }));
                      }}
                      onSchedulePayment={() => {
                        setSelectedBill(bill);
                        setDialogs(prev => ({ ...prev, schedulePayment: true }));
                      }}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      getDaysUntilDue={getDaysUntilDue}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'vendors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendors.map((vendor) => (
                    <VendorSummaryCard
                      key={vendor.id}
                      vendor={vendor}
                      bills={bills.filter(bill => bill.vendorId === vendor.id)}
                      onViewBills={() => updateFilters({ vendor: vendor.id })}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateVendorBillDialog
        isOpen={dialogs.createBill}
        onClose={() => setDialogs(prev => ({ ...prev, createBill: false }))}
        onCreateBill={handleCreateBillFromDialog}
        vendors={vendors}
        isProcessing={isProcessing}
      />

      <PaymentDialog
        isOpen={dialogs.payment}
        onClose={() => setDialogs(prev => ({ ...prev, payment: false }))}
        bill={selectedBill}
        onProcessPayment={handleProcessPayment}
        isProcessing={isProcessing}
      />

      <BulkPaymentDialog
        isOpen={dialogs.bulkPayment}
        onClose={() => setDialogs(prev => ({ ...prev, bulkPayment: false }))}
        selectedBills={bills.filter(bill => selectedBills.includes(bill.id))}
        onProcessBulkPayment={handleBulkPayment}
        isProcessing={isProcessing}
      />

      <VendorBillDetailsDialog
        isOpen={dialogs.billDetails}
        onClose={() => setDialogs(prev => ({ ...prev, billDetails: false }))}
        bill={selectedBill}
        onEdit={() => {
          setDialogs(prev => ({ ...prev, billDetails: false, createBill: true }));
        }}
        onProcessPayment={() => {
          setDialogs(prev => ({ ...prev, billDetails: false, payment: true }));
        }}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      <SchedulePaymentDialog
        isOpen={dialogs.schedulePayment}
        onClose={() => setDialogs(prev => ({ ...prev, schedulePayment: false }))}
        bill={selectedBill}
        onSchedulePayment={handleSchedulePayment}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default VendorBillsPage;