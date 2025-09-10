'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/hooks/useSalaryDisbursement';
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Eye,
  DollarSign
} from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
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

export const EmployeeCard = ({ employee, onViewDetails }: EmployeeCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
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
              <h3 className="font-semibold text-lg">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-gray-500">{employee.employeeId}</p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(employee.status)}>
            {employee.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building size={16} />
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{employee.designation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={16} />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} />
            <span>{employee.phone}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Net Salary</p>
              <p className="font-semibold text-lg flex items-center gap-1">
                <DollarSign size={16} />
                {employee.salaryStructure.netSalary.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Gross Salary</p>
              <p className="font-medium">
                ${employee.salaryStructure.grossSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>Joined: {new Date(employee.joiningDate).toLocaleDateString()}</p>
            {employee.manager && <p>Manager: {employee.manager}</p>}
          </div>
          <Button size="sm" onClick={() => onViewDetails(employee)}>
            <Eye size={14} className="mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};