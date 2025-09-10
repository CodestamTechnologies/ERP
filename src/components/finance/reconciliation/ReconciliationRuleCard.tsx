'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ReconciliationRule } from '@/types/bankAccount';
import { 
  Edit,
  Trash2,
  Target,
  Zap
} from 'lucide-react';

interface ReconciliationRuleCardProps {
  rule: ReconciliationRule;
  onUpdate: (ruleId: string, updates: Partial<ReconciliationRule>) => void;
  onDelete: (ruleId: string) => void;
}

export const ReconciliationRuleCard = ({
  rule,
  onUpdate,
  onDelete
}: ReconciliationRuleCardProps) => {
  const handleToggleActive = (isActive: boolean) => {
    onUpdate(rule.id, { isActive });
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">{rule.name}</h4>
                <p className="text-sm text-gray-500">{rule.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Target size={14} className="text-gray-400" />
                <span className="text-gray-600">Priority: {rule.priority}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Matches: {rule.matchCount}</span>
              </div>
              <Badge variant="outline" className={
                rule.isActive ? 'text-green-600 bg-green-50 border-green-200' : 
                'text-gray-600 bg-gray-50 border-gray-200'
              }>
                {rule.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="bg-gray-50 rounded p-3 text-sm">
              <div className="mb-2">
                <span className="font-medium">Conditions:</span>
                <div className="mt-1 space-y-1">
                  {rule.conditions.map((condition, index) => (
                    <div key={index} className="text-gray-600">
                      {condition.field} {condition.operator} {condition.value}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Actions:</span>
                <div className="mt-1 space-y-1">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="text-gray-600">
                      {action.type} {action.value && `→ ${action.value}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={rule.isActive}
              onCheckedChange={handleToggleActive}
            />
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {/* Handle edit */}}
            >
              <Edit size={14} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onDelete(rule.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};