'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { BankAccount, ReconciliationRule } from '@/types/bankAccount';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface RuleManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  onCreateRule: (rule: Omit<ReconciliationRule, 'id' | 'matchCount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

interface RuleCondition {
  field: 'amount' | 'description' | 'reference' | 'date' | 'category';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: string | number;
}

interface RuleAction {
  type: 'auto_match' | 'categorize' | 'flag' | 'ignore';
  value?: string;
}

export const RuleManagementDialog = ({
  isOpen,
  onClose,
  accounts,
  onCreateRule
}: RuleManagementDialogProps) => {
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [priority, setPriority] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [conditions, setConditions] = useState<RuleCondition[]>([
    { field: 'amount', operator: 'equals', value: '' }
  ]);
  const [actions, setActions] = useState<RuleAction[]>([
    { type: 'auto_match' }
  ]);

  const addCondition = () => {
    setConditions([...conditions, { field: 'amount', operator: 'equals', value: '' }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
    setConditions(conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    ));
  };

  const addAction = () => {
    setActions([...actions, { type: 'auto_match' }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, updates: Partial<RuleAction>) => {
    setActions(actions.map((action, i) => 
      i === index ? { ...action, ...updates } : action
    ));
  };

  const handleSubmit = async () => {
    if (!ruleName || conditions.length === 0 || actions.length === 0) return;

    const rule = {
      name: ruleName,
      description: ruleDescription,
      accountId: selectedAccount === 'all' ? undefined : selectedAccount,
      conditions,
      actions,
      isActive,
      priority
    };

    try {
      await onCreateRule(rule);
      handleClose();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setRuleName('');
    setRuleDescription('');
    setSelectedAccount('all');
    setPriority(1);
    setIsActive(true);
    setConditions([{ field: 'amount', operator: 'equals', value: '' }]);
    setActions([{ type: 'auto_match' }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Reconciliation Rule</DialogTitle>
          <DialogDescription>
            Set up automated rules to streamline your reconciliation process
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g., Auto-match exact amounts"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruleDescription">Description</Label>
            <Textarea
              id="ruleDescription"
              value={ruleDescription}
              onChange={(e) => setRuleDescription(e.target.value)}
              placeholder="Describe what this rule does..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Apply to Account (Optional)</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All accounts</SelectItem>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Rule is active</Label>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Conditions</h3>
              <Button size="sm" variant="outline" onClick={addCondition}>
                <Plus size={16} className="mr-2" />
                Add Condition
              </Button>
            </div>
            
            {conditions.map((condition, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Field</Label>
                      <Select 
                        value={condition.field} 
                        onValueChange={(value) => updateCondition(index, { field: value as RuleCondition['field'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="reference">Reference</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Operator</Label>
                      <Select 
                        value={condition.operator} 
                        onValueChange={(value) => updateCondition(index, { operator: value as RuleCondition['operator'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="starts_with">Starts with</SelectItem>
                          <SelectItem value="ends_with">Ends with</SelectItem>
                          <SelectItem value="greater_than">Greater than</SelectItem>
                          <SelectItem value="less_than">Less than</SelectItem>
                          <SelectItem value="between">Between</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={condition.value}
                        onChange={(e) => updateCondition(index, { value: e.target.value })}
                        placeholder="Enter value"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => removeCondition(index)}
                        disabled={conditions.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Actions</h3>
              <Button size="sm" variant="outline" onClick={addAction}>
                <Plus size={16} className="mr-2" />
                Add Action
              </Button>
            </div>
            
            {actions.map((action, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Action Type</Label>
                      <Select 
                        value={action.type} 
                        onValueChange={(value) => updateAction(index, { type: value as RuleAction['type'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto_match">Auto Match</SelectItem>
                          <SelectItem value="categorize">Categorize</SelectItem>
                          <SelectItem value="flag">Flag for Review</SelectItem>
                          <SelectItem value="ignore">Ignore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {(action.type === 'categorize' || action.type === 'flag') && (
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={action.value || ''}
                          onChange={(e) => updateAction(index, { value: e.target.value })}
                          placeholder={action.type === 'categorize' ? 'Category name' : 'Flag reason'}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-end">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => removeAction(index)}
                        disabled={actions.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!ruleName || conditions.length === 0 || actions.length === 0}
          >
            Create Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};