'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/hooks/useSalaryDisbursement';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface CreatePayrollDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePayroll: (payrollData: any) => Promise<void>;
  employees: Employee[];
  isProcessing: boolean;
}

export const CreatePayrollDialog = ({
  isOpen,
  onClose,
  onCreatePayroll,
  employees,
  isProcessing
}: CreatePayrollDialogProps) => {
  const [batchName, setBatchName] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const departments = [...new Set(employees.map(emp => emp.department))];
  const filteredEmployees = filterDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === filterDepartment);

  const handleEmployeeToggle = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchName || !payPeriod || !startDate || !endDate || selectedEmployees.length === 0) {
      return;
    }

    const payrollData = {
      batchName,
      payPeriod,
      startDate,
      endDate,
      notes,
      employees: selectedEmployees
    };

    try {
      await onCreatePayroll(payrollData);
      handleClose();
    } catch (error) {
      console.error('Error creating payroll:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setBatchName('');
    setPayPeriod('');
    setStartDate('');
    setEndDate('');
    setNotes('');
    setSelectedEmployees([]);
    setFilterDepartment('all');
  };

  const totalAmount = selectedEmployees.reduce((sum, empId) => {
    const employee = employees.find(emp => emp.id === empId);
    return sum + (employee?.salaryStructure.netSalary || 0);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Payroll Batch</DialogTitle>
          <DialogDescription>
            Set up a new payroll batch and select employees to include
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchName">Batch Name</Label>
              <Input
                id="batchName"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., January 2025 Payroll"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payPeriod">Pay Period</Label>
              <Input
                id="payPeriod"
                type="month"
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this payroll batch..."
              rows={3}
            />
          </div>

          {/* Employee Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Employees</h3>
              <div className="flex items-center gap-4">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll">Select All</Label>
                </div>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <div className="space-y-2 p-4">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="hover:bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={employee.id}
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={(checked) => handleEmployeeToggle(employee.id, !!checked)}
                          />
                          <div>
                            <p className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employee.employeeId} • {employee.department} • {employee.designation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${employee.salaryStructure.netSalary.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Net Salary</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedEmployees.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Payroll Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Users size={20} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-lg">{selectedEmployees.length}</p>
                      <p className="text-sm text-gray-600">Employees</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign size={20} className="text-green-600" />
                    <div>
                      <p className="font-bold text-lg">${totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar size={20} className="text-purple-600" />
                    <div>
                      <p className="font-bold text-lg">{payPeriod || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Pay Period</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || selectedEmployees.length === 0}
            >
              {isProcessing ? 'Creating...' : 'Create Payroll Batch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};