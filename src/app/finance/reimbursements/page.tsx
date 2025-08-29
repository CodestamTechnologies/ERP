'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useReimbursements } from '@/hooks/useReimbursements';
import { 
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  DollarSign,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Settings,
  Send,
  Banknote
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { ReimbursementStatsCard } from '@/components/finance/reimbursements/ReimbursementStatsCard';
import { ReimbursementCard } from '@/components/finance/reimbursements/ReimbursementCard';
import { PaymentBatchCard } from '@/components/finance/reimbursements/PaymentBatchCard';
import { PaymentMethodCard } from '@/components/finance/reimbursements/PaymentMethodCard';
import { VendorCard } from '@/components/finance/reimbursements/VendorCard';
import { CreateReimbursementDialog } from '@/components/finance/reimbursements/dialogs/CreateReimbursementDialog';
import { ReimbursementDetailsDialog } from '@/components/finance/reimbursements/dialogs/ReimbursementDetailsDialog';
import { ProcessPaymentDialog } from '@/components/finance/reimbursements/dialogs/ProcessPaymentDialog';
import { BulkPaymentDialog } from '@/components/finance/reimbursements/dialogs/BulkPaymentDialog';
import { PaymentMethodDialog } from '@/components/finance/reimbursements/dialogs/PaymentMethodDialog';

const ReimbursementsPage = () => {
  const {
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
  } = useReimbursements();

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateReimbursementOpen, setIsCreateReimbursementOpen] = useState(false);
  const [isReimbursementDetailsOpen, setIsReimbursementDetailsOpen] = useState(false);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<any>(null);

  const STATS_CARDS = [
    {
      title: 'Total Reimbursements',
      value: summary.totalReimbursements.toString(),
      change: `${summary.pendingReimbursements} pending`,
      icon: <CreditCard size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: summary.totalReimbursements > 0 ? ((summary.totalReimbursements - summary.pendingReimbursements) / summary.totalReimbursements) * 100 : 0
    },
    {
      title: 'Total Amount',
      value: `$${(summary.totalAmount / 1000).toFixed(0)}K`,
      change: `${summary.paidAmount > 0 ? '+' : ''}$${(summary.paidAmount / 1000).toFixed(0)}K paid`,
      icon: <DollarSign size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: summary.totalAmount > 0 ? (summary.paidAmount / summary.totalAmount) * 100 : 0
    },
    {
      title: 'Pending Payments',
      value: summary.pendingPayments.toString(),
      change: `${summary.avgProcessingTime}h avg time`,
      icon: <Clock size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: summary.totalReimbursements > 0 ? (summary.pendingPayments / summary.totalReimbursements) * 100 : 0
    },
    {
      title: 'This Month',
      value: `$${(summary.monthlyReimbursements / 1000).toFixed(0)}K`,
      change: `${summary.monthlyCount} reimbursements`,
      icon: <TrendingUp size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: summary.monthlyBudget > 0 ? (summary.monthlyReimbursements / summary.monthlyBudget) * 100 : 0
    }
  ];

  const handleViewReimbursementDetails = (reimbursement: any) => {
    setSelectedReimbursement(reimbursement);
    setIsReimbursementDetailsOpen(true);
  };

  const handleProcessPayment = (reimbursement: any) => {
    setSelectedReimbursement(reimbursement);
    setIsProcessPaymentOpen(true);
  };

  const handleApproveReimbursement = async (reimbursementId: string, comments?: string) => {
    await approveReimbursement(reimbursementId, comments);
  };

  const handleRejectReimbursement = async (reimbursementId: string, reason: string) => {
    await rejectReimbursement(reimbursementId, reason);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            <CreditCard size={28} className="mr-3 text-teal-600" />
            Reimbursements
          </h1>
          <p className="text-gray-600 mt-1">Manage employee reimbursements, payments, and processing</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsPaymentMethodOpen(true)}>
            <Settings size={16} className="mr-2" />
            Payment Methods
          </Button>
          <Button variant="outline" onClick={exportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateReimbursementOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Reimbursement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <ReimbursementStatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
              <TabsTrigger value="payments">Payment Batches</TabsTrigger>
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsCreateReimbursementOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Plus size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">New Reimbursement</h3>
                    <p className="text-sm text-gray-600">Create reimbursement request</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsBulkPaymentOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Send size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Process Payments</h3>
                    <p className="text-sm text-gray-600">Bulk payment processing</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={generatePaymentReport}>
                  <CardContent className="p-6 text-center">
                    <FileText size={32} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Generate Report</h3>
                    <p className="text-sm text-gray-600">Payment analytics</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsPaymentMethodOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Banknote size={32} className="mx-auto text-orange-600 mb-3" />
                    <h3 className="font-semibold mb-2">Payment Methods</h3>
                    <p className="text-sm text-gray-600">Manage payment options</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reimbursements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reimbursements.slice(0, 3).map((reimbursement) => (
                        <div key={reimbursement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium">{reimbursement.title}</p>
                              <p className="text-sm text-gray-500">
                                {reimbursement.employeeName} • ${reimbursement.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            reimbursement.status === 'paid' ? 'text-green-600 bg-green-50 border-green-200' :
                            reimbursement.status === 'approved' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            reimbursement.status === 'pending' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }>
                            {reimbursement.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reimbursements.filter(r => r.status === 'approved').slice(0, 3).map((reimbursement) => (
                        <div key={reimbursement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock size={20} className="text-orange-600" />
                            <div>
                              <p className="font-medium">{reimbursement.title}</p>
                              <p className="text-sm text-gray-500">
                                {reimbursement.employeeName} • ${reimbursement.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleProcessPayment(reimbursement)}>
                              Process
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleViewReimbursementDetails(reimbursement)}>
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reimbursements" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search reimbursements..."
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
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.type || 'all'} 
                  onValueChange={(value) => updateFilters({ type: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.department || 'all'} 
                  onValueChange={(value) => updateFilters({ department: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reimbursements List */}
              <div className="space-y-4">
                {reimbursements.map((reimbursement) => (
                  <ReimbursementCard
                    key={reimbursement.id}
                    reimbursement={reimbursement}
                    onViewDetails={handleViewReimbursementDetails}
                    onApprove={handleApproveReimbursement}
                    onReject={handleRejectReimbursement}
                    onProcessPayment={handleProcessPayment}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              {/* Payment Batches Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Payment Batches</h3>
                  <p className="text-gray-600">Manage and process payment batches</p>
                </div>
                <Button onClick={() => createPaymentBatch()} disabled={isProcessing}>
                  <Plus size={16} className="mr-2" />
                  Create Batch
                </Button>
              </div>

              {/* Payment Batches List */}
              <div className="space-y-4">
                {paymentBatches.map((batch) => (
                  <PaymentBatchCard
                    key={batch.id}
                    batch={batch}
                    onProcess={processPayment}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="methods" className="space-y-6">
              {/* Payment Methods Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Payment Methods</h3>
                  <p className="text-gray-600">Configure payment methods and settings</p>
                </div>
                <Button onClick={() => setIsPaymentMethodOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Method
                </Button>
              </div>

              {/* Payment Methods List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={() => setIsPaymentMethodOpen(true)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-6">
              {/* Vendors Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Vendors & Payees</h3>
                  <p className="text-gray-600">Manage vendor information and payment details</p>
                </div>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Vendor
                </Button>
              </div>

              {/* Vendors List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                  />
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogs */}
      <CreateReimbursementDialog
        isOpen={isCreateReimbursementOpen}
        onClose={() => setIsCreateReimbursementOpen(false)}
        onCreateReimbursement={createReimbursement}
        paymentMethods={paymentMethods}
        isProcessing={isProcessing}
      />

      <ReimbursementDetailsDialog
        isOpen={isReimbursementDetailsOpen}
        onClose={() => setIsReimbursementDetailsOpen(false)}
        reimbursement={selectedReimbursement}
        onApprove={handleApproveReimbursement}
        onReject={handleRejectReimbursement}
        onProcessPayment={handleProcessPayment}
        isProcessing={isProcessing}
      />

      <ProcessPaymentDialog
        isOpen={isProcessPaymentOpen}
        onClose={() => setIsProcessPaymentOpen(false)}
        reimbursement={selectedReimbursement}
        paymentMethods={paymentMethods}
        onProcess={processPayment}
        isProcessing={isProcessing}
      />

      <BulkPaymentDialog
        isOpen={isBulkPaymentOpen}
        onClose={() => setIsBulkPaymentOpen(false)}
        reimbursements={reimbursements.filter(r => r.status === 'approved')}
        paymentMethods={paymentMethods}
        onBulkProcess={bulkProcessPayments}
        isProcessing={isProcessing}
      />

      <PaymentMethodDialog
        isOpen={isPaymentMethodOpen}
        onClose={() => setIsPaymentMethodOpen(false)}
        onAddMethod={addPaymentMethod}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ReimbursementsPage;