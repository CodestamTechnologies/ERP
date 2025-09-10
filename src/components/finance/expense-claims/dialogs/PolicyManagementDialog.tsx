'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpensePolicy } from '@/hooks/useExpenseClaims';
import { 
  Shield,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

interface PolicyManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  policies: ExpensePolicy[];
  isProcessing: boolean;
}

export const PolicyManagementDialog = ({
  isOpen,
  onClose,
  policies,
  isProcessing
}: PolicyManagementDialogProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<ExpensePolicy | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dailyLimit, setDailyLimit] = useState<number | undefined>();
  const [monthlyLimit, setMonthlyLimit] = useState<number | undefined>();
  const [requiresReceipt, setRequiresReceipt] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setDailyLimit(undefined);
    setMonthlyLimit(undefined);
    setRequiresReceipt(true);
    setRequiresApproval(true);
    setIsActive(true);
    setEditingPolicy(null);
    setShowCreateForm(false);
  };

  const handleCreatePolicy = () => {
    setShowCreateForm(true);
  };

  const handleEditPolicy = (policy: ExpensePolicy) => {
    setEditingPolicy(policy);
    setName(policy.name);
    setDescription(policy.description);
    setCategory(policy.category);
    setDailyLimit(policy.dailyLimit);
    setMonthlyLimit(policy.monthlyLimit);
    setRequiresReceipt(policy.requiresReceipt);
    setRequiresApproval(policy.requiresApproval);
    setIsActive(policy.isActive);
    setShowCreateForm(true);
  };

  const handleSavePolicy = () => {
    // In a real implementation, this would save the policy
    console.log('Saving policy:', {
      name,
      description,
      category,
      dailyLimit,
      monthlyLimit,
      requiresReceipt,
      requiresApproval,
      isActive
    });
    resetForm();
  };

  const handleDeletePolicy = (policyId: string) => {
    // In a real implementation, this would delete the policy
    console.log('Deleting policy:', policyId);
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={24} className="text-blue-600" />
            Policy Management
          </DialogTitle>
          <DialogDescription>
            Manage expense policies and approval workflows
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!showCreateForm ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Expense Policies</h3>
                  <p className="text-gray-600">Configure rules and limits for expense categories</p>
                </div>
                <Button onClick={handleCreatePolicy}>
                  <Plus size={16} className="mr-2" />
                  New Policy
                </Button>
              </div>

              {/* Policies List */}
              <div className="space-y-4">
                {policies.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{policy.name}</h4>
                            <Badge variant="outline" className={getCategoryColor(policy.category)}>
                              {policy.category}
                            </Badge>
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
                          
                          <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {policy.dailyLimit && (
                              <div>
                                <p className="text-gray-500">Daily Limit</p>
                                <p className="font-semibold">${policy.dailyLimit.toLocaleString()}</p>
                              </div>
                            )}
                            {policy.monthlyLimit && (
                              <div>
                                <p className="text-gray-500">Monthly Limit</p>
                                <p className="font-semibold">${policy.monthlyLimit.toLocaleString()}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500">Receipt Required</p>
                              <div className="flex items-center gap-1">
                                {policy.requiresReceipt ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : (
                                  <XCircle size={14} className="text-red-600" />
                                )}
                                <span>{policy.requiresReceipt ? 'Yes' : 'No'}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">Approval Required</p>
                              <div className="flex items-center gap-1">
                                {policy.requiresApproval ? (
                                  <CheckCircle size={14} className="text-green-600" />
                                ) : (
                                  <XCircle size={14} className="text-red-600" />
                                )}
                                <span>{policy.requiresApproval ? 'Yes' : 'No'}</span>
                              </div>
                            </div>
                          </div>

                          {policy.approvalLevels.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Approval Levels:</p>
                              <div className="flex flex-wrap gap-2">
                                {policy.approvalLevels.map((level, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    L{level.level}: {level.approverRole} (${level.amountThreshold.toLocaleString()}+)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditPolicy(policy)}
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeletePolicy(policy.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            /* Create/Edit Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
                </h3>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyName">Policy Name</Label>
                  <Input
                    id="policyName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Travel Expense Policy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyCategory">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyDescription">Description</Label>
                <Textarea
                  id="policyDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the policy rules and guidelines..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit (Optional)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    step="0.01"
                    value={dailyLimit || ''}
                    onChange={(e) => setDailyLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit (Optional)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    step="0.01"
                    value={monthlyLimit || ''}
                    onChange={(e) => setMonthlyLimit(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requiresReceipt"
                    checked={requiresReceipt}
                    onCheckedChange={setRequiresReceipt}
                  />
                  <Label htmlFor="requiresReceipt">Requires Receipt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requiresApproval"
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                  <Label htmlFor="requiresApproval">Requires Approval</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="isActive">Policy is Active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSavePolicy} disabled={!name || !category}>
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};