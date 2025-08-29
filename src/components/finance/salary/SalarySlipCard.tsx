'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalarySlip } from '@/hooks/useSalaryDisbursement';
import { 
  User,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SalarySlipCardProps {
  salarySlip: SalarySlip;
  onApprove: (slipId: string) => void;
  onReject: (slipId: string, reason: string) => void;
  isProcessing: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'draft': 'text-gray-600 bg-gray-50 border-gray-200',
    'pending_approval': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'approved': 'text-green-600 bg-green-50 border-green-200',
    'rejected': 'text-red-600 bg-red-50 border-red-200',
    'paid': 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const SalarySlipCard = ({
  salarySlip,
  onApprove,
  onReject,
  isProcessing
}: SalarySlipCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{salarySlip.employeeName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building size={14} />
                    {salarySlip.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {salarySlip.payPeriod}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-blue-600" />
                  <p className="text-xs font-medium text-blue-600">GROSS SALARY</p>
                </div>
                <p className="font-bold text-lg">${salarySlip.grossSalary.toLocaleString()}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown size={16} className="text-red-600" />
                  <p className="text-xs font-medium text-red-600">DEDUCTIONS</p>
                </div>
                <p className="font-bold text-lg">${salarySlip.totalDeductions.toLocaleString()}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={16} className="text-green-600" />
                  <p className="text-xs font-medium text-green-600">NET SALARY</p>
                </div>
                <p className="font-bold text-lg">${salarySlip.netSalary.toLocaleString()}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-purple-600" />
                  <p className="text-xs font-medium text-purple-600">BONUS</p>
                </div>
                <p className="font-bold text-lg">${salarySlip.bonus.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-3">Salary Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Basic Salary</p>
                  <p className="font-semibold">${salarySlip.basicSalary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">HRA</p>
                  <p className="font-semibold">${salarySlip.hra.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Allowances</p>
                  <p className="font-semibold">${salarySlip.allowances.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Overtime</p>
                  <p className="font-semibold">${salarySlip.overtime.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Tax Deduction</p>
                    <p className="font-semibold text-red-600">-${salarySlip.taxDeduction.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Provident Fund</p>
                    <p className="font-semibold text-red-600">-${salarySlip.providentFund.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ESI</p>
                    <p className="font-semibold text-red-600">-${salarySlip.esi.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Other Deductions</p>
                    <p className="font-semibold text-red-600">-${salarySlip.otherDeductions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Generated: {new Date(salarySlip.generatedAt).toLocaleDateString()}</p>
              {salarySlip.approvedBy && (
                <p>Approved by {salarySlip.approvedBy} on {new Date(salarySlip.approvedAt!).toLocaleDateString()}</p>
              )}
              {salarySlip.rejectedReason && (
                <p className="text-red-600">Rejected: {salarySlip.rejectedReason}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <Badge variant="outline" className={getStatusColor(salarySlip.status)}>
              {salarySlip.status.replace('_', ' ')}
            </Badge>

            {salarySlip.status === 'pending_approval' && (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => onApprove(salarySlip.id)}
                  disabled={isProcessing}
                >
                  <CheckCircle size={14} className="mr-2" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onReject(salarySlip.id, 'Needs review')}
                  disabled={isProcessing}
                >
                  <XCircle size={14} className="mr-2" />
                  Reject
                </Button>
              </div>
            )}

            {salarySlip.status === 'approved' && (
              <Button size="sm" variant="outline">
                <FileText size={14} className="mr-2" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};