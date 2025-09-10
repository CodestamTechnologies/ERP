'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/hooks/useSalaryDisbursement';
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  Shield
} from 'lucide-react';

interface EmployeeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'text-green-600 bg-green-50 border-green-200',
    'inactive': 'text-gray-600 bg-gray-50 border-gray-200',
    'on_leave': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'terminated': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const EmployeeDetailsDialog = ({
  isOpen,
  onClose,
  employee
}: EmployeeDetailsDialogProps) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {employee.avatar ? (
                <img 
                  src={employee.avatar} 
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User size={24} className="text-blue-600" />
              )}
            </div>
            <div>
              <span>{employee.firstName} {employee.lastName}</span>
              <p className="text-sm text-gray-500 font-normal">Employee ID: {employee.employeeId}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Complete employee information and salary details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User size={18} />
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name:</span>
                    <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Employee ID:</span>
                    <span className="font-medium">{employee.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{employee.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant="outline" className={getStatusColor(employee.status)}>
                      {employee.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building size={18} />
                  Work Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Designation:</span>
                    <span className="font-medium">{employee.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{employee.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joining Date:</span>
                    <span className="font-medium">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </span>
                  </div>
                  {employee.manager && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manager:</span>
                      <span className="font-medium">{employee.manager}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Bank Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Holder:</span>
                    <span className="font-medium">{employee.bankDetails.accountHolderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono">****{employee.bankDetails.accountNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="font-medium">{employee.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IFSC Code:</span>
                    <span className="font-mono">{employee.bankDetails.ifscCode}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salary Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign size={18} />
                  Salary Structure
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 font-medium flex items-center gap-1">
                        <TrendingUp size={16} />
                        Earnings
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-semibold">${employee.salaryStructure.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA:</span>
                        <span className="font-semibold">${employee.salaryStructure.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances:</span>
                        <span className="font-semibold">${employee.salaryStructure.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Gross Salary:</span>
                        <span className="font-bold">${employee.salaryStructure.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-700 font-medium flex items-center gap-1">
                        <TrendingDown size={16} />
                        Deductions
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tax Deduction:</span>
                        <span className="font-semibold">${employee.taxInfo.taxDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Provident Fund:</span>
                        <span className="font-semibold">${employee.taxInfo.providentFund.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESI:</span>
                        <span className="font-semibold">${employee.taxInfo.esi.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Deductions:</span>
                        <span className="font-bold">${employee.salaryStructure.deductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Net Salary:</span>
                      <span className="font-bold text-xl text-blue-900">
                        ${employee.salaryStructure.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Tax Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">PAN Number:</span>
                    <span className="font-mono">{employee.taxInfo.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Tax:</span>
                    <span className="font-medium">${employee.taxInfo.taxDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">PF Contribution:</span>
                    <span className="font-medium">${employee.taxInfo.providentFund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ESI Contribution:</span>
                    <span className="font-medium">${employee.taxInfo.esi.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm">
                    <FileText size={14} className="mr-2" />
                    Generate Slip
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar size={14} className="mr-2" />
                    View History
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail size={14} className="mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <DollarSign size={14} className="mr-2" />
                    Process Salary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <FileText size={16} className="mr-2" />
            Generate Salary Slip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};