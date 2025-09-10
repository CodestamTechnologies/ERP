'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpensePolicy } from '@/hooks/useExpenseClaims';
import { 
  Shield,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Settings,
  Users
} from 'lucide-react';

interface PolicyCardProps {
  policy: ExpensePolicy;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'travel': 'text-blue-600 bg-blue-50 border-blue-200',
    'meals': 'text-green-600 bg-green-50 border-green-200',
    'accommodation': 'text-purple-600 bg-purple-50 border-purple-200',
    'office': 'text-orange-600 bg-orange-50 border-orange-200',
    'transport': 'text-teal-600 bg-teal-50 border-teal-200',
    'other': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const PolicyCard = ({ policy }: PolicyCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{policy.name}</h3>
                <p className="text-sm text-gray-500">{policy.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {policy.dailyLimit && (
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Daily Limit</p>
                    <p className="font-bold">${policy.dailyLimit.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {policy.monthlyLimit && (
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Monthly Limit</p>
                    <p className="font-bold">${policy.monthlyLimit.toLocaleString()}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Approval Levels</p>
                  <p className="font-medium">{policy.approvalLevels.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-3">Policy Rules</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Requires Receipt</span>
                  {policy.requiresReceipt ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Requires Approval</span>
                  {policy.requiresApproval ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Policy Status</span>
                  {policy.isActive ? (
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {policy.approvalLevels.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Approval Workflow</h4>
                <div className="space-y-2">
                  {policy.approvalLevels.map((level, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Level {level.level}: {level.approverRole}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ${level.amountThreshold.toLocaleString()}+
                        </span>
                        {level.isRequired && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(policy.category)}>
                {policy.category}
              </Badge>
              <span className="text-xs text-gray-500">
                Updated {new Date(policy.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Settings size={14} className="mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <FileText size={14} className="mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};