'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSalaryDisbursement } from '@/hooks/useSalaryDisbursement';
import { 
  Users,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Calculator,
  CreditCard,
  TrendingUp,
  UserCheck,
  Building
} from 'lucide-react';
import { useState } from 'react';

// Import components
import { SalaryStatsCard } from '@/components/finance/salary/SalaryStatsCard';
import { EmployeeCard } from '@/components/finance/salary/EmployeeCard';
import { PayrollBatchCard } from '@/components/finance/salary/PayrollBatchCard';
import { SalarySlipCard } from '@/components/finance/salary/SalarySlipCard';
import { DisbursementCard } from '@/components/finance/salary/DisbursementCard';
import { CreatePayrollDialog } from '@/components/finance/salary/dialogs/CreatePayrollDialog';
import { ProcessDisbursementDialog } from '@/components/finance/salary/dialogs/ProcessDisbursementDialog';
import { EmployeeDetailsDialog } from '@/components/finance/salary/dialogs/EmployeeDetailsDialog';
import { BulkUploadDialog } from '@/components/finance/salary/dialogs/BulkUploadDialog';

const SalaryDisbursementPage = () => {
  const {
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
    processDisbursement,
    generateSalarySlips,
    approveSalarySlip,
    rejectSalarySlip,
    bulkProcessDisbursement,
    exportPayrollData,
    uploadBulkSalaryData
  } = useSalaryDisbursement();

  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatePayrollOpen, setIsCreatePayrollOpen] = useState(false);
  const [isProcessDisbursementOpen, setIsProcessDisbursementOpen] = useState(false);
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const STATS_CARDS = [
    {
      title: 'Total Employees',
      value: summary.totalEmployees.toString(),
      change: `${summary.activeEmployees} active`,
      icon: <Users size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: summary.totalEmployees > 0 ? (summary.activeEmployees / summary.totalEmployees) * 100 : 0
    },
    {
      title: 'Monthly Payroll',
      value: `$${(summary.totalMonthlyPayroll / 1000).toFixed(0)}K`,
      change: `${summary.pendingDisbursements} pending`,
      icon: <DollarSign size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: summary.totalDisbursements > 0 ? ((summary.totalDisbursements - summary.pendingDisbursements) / summary.totalDisbursements) * 100 : 0
    },
    {
      title: 'Processed This Month',
      value: `$${(summary.processedThisMonth / 1000).toFixed(0)}K`,
      change: `${summary.processedCount} employees`,
      icon: <CheckCircle size={24} />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      progress: summary.totalEmployees > 0 ? (summary.processedCount / summary.totalEmployees) * 100 : 0
    },
    {
      title: 'Pending Approvals',
      value: summary.pendingApprovals.toString(),
      change: `${summary.rejectedSlips} rejected`,
      icon: <Clock size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: summary.totalSlips > 0 ? (summary.pendingApprovals / summary.totalSlips) * 100 : 0
    }
  ];

  const handleViewEmployeeDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEmployeeDetailsOpen(true);
  };

  const handleProcessBatch = (batch: any) => {
    setSelectedBatch(batch);
    setIsProcessDisbursementOpen(true);
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
            Salary Disbursement
          </h1>
          <p className="text-gray-600 mt-1">Manage employee salaries, payroll processing, and disbursements</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
            <Upload size={16} className="mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={exportPayrollData} disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreatePayrollOpen(true)}>
            <Calculator size={16} className="mr-2" />
            Create Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <SalaryStatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="payroll">Payroll Batches</TabsTrigger>
              <TabsTrigger value="salary-slips">Salary Slips</TabsTrigger>
              <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsCreatePayrollOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Calculator size={32} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold mb-2">Create Payroll</h3>
                    <p className="text-sm text-gray-600">Generate new payroll batch</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText size={32} className="mx-auto text-green-600 mb-3" />
                    <h3 className="font-semibold mb-2">Generate Slips</h3>
                    <p className="text-sm text-gray-600">Create salary slips</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Send size={32} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="font-semibold mb-2">Process Disbursement</h3>
                    <p className="text-sm text-gray-600">Transfer salaries to accounts</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsBulkUploadOpen(true)}>
                  <CardContent className="p-6 text-center">
                    <Upload size={32} className="mx-auto text-orange-600 mb-3" />
                    <h3 className="font-semibold mb-2">Bulk Upload</h3>
                    <p className="text-sm text-gray-600">Upload salary data</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Payroll Batches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payrollBatches.slice(0, 3).map((batch) => (
                        <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium">{batch.batchName}</p>
                              <p className="text-sm text-gray-500">
                                {batch.employeeCount} employees • ${(batch.totalAmount / 1000).toFixed(0)}K
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            batch.status === 'completed' ? 'text-green-600 bg-green-50 border-green-200' :
                            batch.status === 'processing' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            batch.status === 'approved' ? 'text-purple-600 bg-purple-50 border-purple-200' :
                            'text-yellow-600 bg-yellow-50 border-yellow-200'
                          }>
                            {batch.status}
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
                      {salarySlips.filter(slip => slip.status === 'pending_approval').slice(0, 3).map((slip) => (
                        <div key={slip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <UserCheck size={20} className="text-orange-600" />
                            <div>
                              <p className="font-medium">{slip.employeeName}</p>
                              <p className="text-sm text-gray-500">
                                {slip.department} • ${slip.netSalary.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => approveSalarySlip(slip.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => rejectSalarySlip(slip.id, 'Needs review')}>
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

            <TabsContent value="employees" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={filters.department || 'all'} 
                  onValueChange={(value) => updateFilters({ department: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value) => updateFilters({ status: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employees Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onViewDetails={handleViewEmployeeDetails}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="space-y-6">
              {/* Payroll Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Payroll Batches</h3>
                  <p className="text-gray-600">Manage and process payroll batches</p>
                </div>
                <Button onClick={() => setIsCreatePayrollOpen(true)}>
                  <Calculator size={16} className="mr-2" />
                  Create New Batch
                </Button>
              </div>

              {/* Payroll Batches */}
              <div className="space-y-4">
                {payrollBatches.map((batch) => (
                  <PayrollBatchCard
                    key={batch.id}
                    batch={batch}
                    onProcess={handleProcessBatch}
                    onGenerateSlips={generateSalarySlips}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="salary-slips" className="space-y-6">
              {/* Salary Slips Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search salary slips..."
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Slips List */}
              <div className="space-y-4">
                {salarySlips.map((slip) => (
                  <SalarySlipCard
                    key={slip.id}
                    salarySlip={slip}
                    onApprove={approveSalarySlip}
                    onReject={rejectSalarySlip}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="disbursements" className="space-y-6">
              {/* Disbursements Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Salary Disbursements</h3>
                  <p className="text-gray-600">Track and manage salary transfers</p>
                </div>
                <Button onClick={() => bulkProcessDisbursement()} disabled={isProcessing}>
                  <Send size={16} className="mr-2" />
                  Bulk Process
                </Button>
              </div>

              {/* Disbursements List */}
              <div className="space-y-4">
                {disbursements.map((disbursement) => (
                  <DisbursementCard
                    key={disbursement.id}
                    disbursement={disbursement}
                    onProcess={processDisbursement}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogs */}
      <CreatePayrollDialog
        isOpen={isCreatePayrollOpen}
        onClose={() => setIsCreatePayrollOpen(false)}
        onCreatePayroll={createPayrollBatch}
        employees={employees}
        isProcessing={isProcessing}
      />

      <ProcessDisbursementDialog
        isOpen={isProcessDisbursementOpen}
        onClose={() => setIsProcessDisbursementOpen(false)}
        batch={selectedBatch}
        onProcess={processDisbursement}
        isProcessing={isProcessing}
      />

      <EmployeeDetailsDialog
        isOpen={isEmployeeDetailsOpen}
        onClose={() => setIsEmployeeDetailsOpen(false)}
        employee={selectedEmployee}
      />

      <BulkUploadDialog
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUpload={uploadBulkSalaryData}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default SalaryDisbursementPage;