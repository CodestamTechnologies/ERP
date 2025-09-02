'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useExpenseClaims } from '@/hooks/useExpenseClaims';
import { 
  Receipt,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { ExpenseStatsCard } from '@/components/finance/expense-claims/ExpenseStatsCard';
import { ExpenseClaimCard } from '@/components/finance/expense-claims/ExpenseClaimCard';
import { ApprovalCard } from '@/components/finance/expense-claims/ApprovalCard';
import { ExpenseReportCard } from '@/components/finance/expense-claims/ExpenseReportCard';
import { PolicyCard } from '@/components/finance/expense-claims/PolicyCard';
import { CreateClaimDialog } from '@/components/finance/expense-claims/dialogs/CreateClaimDialog';
import { ClaimDetailsDialog } from '@/components/finance/expense-claims/dialogs/ClaimDetailsDialog';
import { BulkApprovalDialog } from '@/components/finance/expense-claims/dialogs/BulkApprovalDialog';
import { PolicyManagementDialog } from '@/components/finance/expense-claims/dialogs/PolicyManagementDialog';

const ExpenseClaimsPage = () => {
  const {
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
    approveClaim,
    rejectClaim,
    submitClaim,
    bulkApprove,
    generateReport,
    exportData,
  } = useExpenseClaims();

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateClaimOpen, setIsCreateClaimOpen] = useState(false);
  const [isClaimDetailsOpen, setIsClaimDetailsOpen] = useState(false);
  const [isBulkApprovalOpen, setIsBulkApprovalOpen] = useState(false);
  const [isPolicyManagementOpen, setIsPolicyManagementOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<typeof claims[0] | null>(null);

  const STATS_CARDS = [
    {
      title: 'Total Claims',
      value: summary.totalClaims.toString(),
      change: `${summary.pendingClaims} pending`,
      icon: <Receipt size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: summary.totalClaims > 0 ? ((summary.totalClaims - summary.pendingClaims) / summary.totalClaims) * 100 : 0
    },
    {
      title: 'Total Amount',
      value: `$${(summary.totalAmount / 1000).toFixed(0)}K`,
      change: `${summary.approvedAmount > 0 ? '+' : ''}$${(summary.approvedAmount / 1000).toFixed(0)}K approved`,
      icon: <DollarSign size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: summary.totalAmount > 0 ? (summary.approvedAmount / summary.totalAmount) * 100 : 0
    },
    {
      title: 'Pending Approvals',
      value: summary.pendingApprovals.toString(),
      change: `${summary.avgApprovalTime}h avg time`,
      icon: <Clock size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: summary.totalClaims > 0 ? (summary.pendingApprovals / summary.totalClaims) * 100 : 0
    },
    {
      title: 'This Month',
      value: `$${(summary.monthlyExpenses / 1000).toFixed(0)}K`,
      change: `${summary.monthlyClaimsCount} claims`,
      icon: <TrendingUp size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: summary.monthlyBudget > 0 ? (summary.monthlyExpenses / summary.monthlyBudget) * 100 : 0
    }
  ];

  const handleViewClaimDetails = (claim: typeof claims[0]) => {
    setSelectedClaim(claim);
    setIsClaimDetailsOpen(true);
  };

  const handleApproveClaim = async (claimId: string, comments?: string) => {
    await approveClaim(claimId, comments);
  };

  const handleRejectClaim = async (claimId: string, reason: string) => {
    await rejectClaim(claimId, reason);
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
            <Receipt size={28} className="mr-3 text-teal-600" />
            Expense Claims & Approvals
          </h1>
          <p className="text-gray-600 mt-1">Manage employee expense claims, approvals, and reimbursements</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsPolicyManagementOpen(true)}>
            <Settings size={16} className="mr-2" />
            Policies
          </Button>
          <Button variant="outline" onClick={exportData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateClaimOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <ExpenseStatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-claims">My Claims</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsCreateClaimOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Plus size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">New Claim</h3>
                    <p className="text-sm text-gray-600">Submit expense claim</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('approvals')}>
                  <CardContent className="p-6 text-center">
                    <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Approve Claims</h3>
                    <p className="text-sm text-gray-600">Review pending claims</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('reports')}>
                  <CardContent className="p-6 text-center">
                    <FileText size={32} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Generate Report</h3>
                    <p className="text-sm text-gray-600">Expense analytics</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsBulkApprovalOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Users size={32} className="mx-auto text-orange-600 mb-3" />
                    <h3 className="font-semibold mb-2">Bulk Approve</h3>
                    <p className="text-sm text-gray-600">Multiple approvals</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Claims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {claims.slice(0, 3).map((claim) => (
                        <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Receipt size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium">{claim.title}</p>
                              <p className="text-sm text-gray-500">
                                {claim.employeeName} • ${claim.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            claim.status === 'approved' ? 'text-green-600 bg-green-50 border-green-200' :
                            claim.status === 'pending' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                            claim.status === 'rejected' ? 'text-red-600 bg-red-50 border-red-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }>
                            {claim.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {approvals.slice(0, 3).map((approval) => (
                        <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock size={20} className="text-orange-600" />
                            <div>
                              <p className="font-medium">{approval.claimTitle}</p>
                              <p className="text-sm text-gray-500">
                                {approval.employeeName} • ${approval.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveClaim(approval.claimId)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectClaim(approval.claimId, 'Needs review')}>
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="my-claims" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search claims..."
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
                  value={filters.category || 'all'} 
                  onValueChange={(value) => updateFilters({ category: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Claims List */}
              <div className="space-y-4">
                {claims.map((claim) => (
                  <ExpenseClaimCard
                    key={claim.id}
                    claim={claim}
                    onViewDetails={handleViewClaimDetails}
                    onSubmit={submitClaim}
                    onEdit={updateClaim}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-6">
              {/* Approval Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Pending Approvals</h3>
                  <p className="text-gray-600">Review and approve expense claims</p>
                </div>
                <Button onClick={() => setIsBulkApprovalOpen(true)} disabled={isProcessing}>
                  <Users size={16} className="mr-2" />
                  Bulk Approve
                </Button>
              </div>

              {/* Approvals List */}
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <ApprovalCard
                    key={approval.id}
                    approval={approval}
                    onApprove={handleApproveClaim}
                    onReject={handleRejectClaim}
                    onViewDetails={handleViewClaimDetails}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              {/* Reports Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Expense Reports</h3>
                  <p className="text-gray-600">Generate and view expense analytics</p>
                </div>
                <Button onClick={generateReport} disabled={isProcessing}>
                  <FileText size={16} className="mr-2" />
                  Generate Report
                </Button>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {reports.map((report) => (
                  <ExpenseReportCard
                    key={report.id}
                    report={report}
                    onDownload={exportData}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              {/* Policies Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Expense Policies</h3>
                  <p className="text-gray-600">Manage expense policies and limits</p>
                </div>
                <Button onClick={() => setIsPolicyManagementOpen(true)}>
                  <Settings size={16} className="mr-2" />
                  Manage Policies
                </Button>
              </div>

              {/* Policies List */}
              <div className="space-y-4">
                {policies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                  />
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogs */}
      <CreateClaimDialog
        isOpen={isCreateClaimOpen}
        onClose={() => setIsCreateClaimOpen(false)}
        onCreateClaim={createClaim}
        policies={policies}
        isProcessing={isProcessing}
      />

      <ClaimDetailsDialog
        isOpen={isClaimDetailsOpen}
        onClose={() => setIsClaimDetailsOpen(false)}
        claim={selectedClaim}
        onApprove={handleApproveClaim}
        onReject={handleRejectClaim}
        isProcessing={isProcessing}
      />

      <BulkApprovalDialog
        isOpen={isBulkApprovalOpen}
        onClose={() => setIsBulkApprovalOpen(false)}
        approvals={approvals}
        onBulkApprove={bulkApprove}
        isProcessing={isProcessing}
      />

      <PolicyManagementDialog
        isOpen={isPolicyManagementOpen}
        onClose={() => setIsPolicyManagementOpen(false)}
        policies={policies}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ExpenseClaimsPage;