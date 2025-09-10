'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReconciliationStatement, BankAccount } from '@/types/bankAccount';
import { 
  FileSpreadsheet,
  Play,
  Shuffle,
  Download
} from 'lucide-react';

interface StatementCardProps {
  statement: ReconciliationStatement;
  account?: BankAccount;
  isProcessing: boolean;
  onStartReconciliation: (statementId: string) => void;
  onRunAutoReconciliation: (statementId: string) => void;
  onExportReport: (statementId: string) => void;
}

const getStatementStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'in_progress': 'text-blue-600 bg-blue-50 border-blue-200',
    'completed': 'text-green-600 bg-green-50 border-green-200',
    'failed': 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const StatementCard = ({
  statement,
  account,
  isProcessing,
  onStartReconciliation,
  onRunAutoReconciliation,
  onExportReport
}: StatementCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileSpreadsheet size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{statement.fileName}</h4>
                <p className="text-sm text-gray-500">
                  {account?.accountName} • 
                  Statement Date: {new Date(statement.statementDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Transactions</p>
                <p className="font-medium">{statement.transactionCount}</p>
              </div>
              <div>
                <p className="text-gray-500">Matched</p>
                <p className="font-medium text-green-600">{statement.matchedTransactions}</p>
              </div>
              <div>
                <p className="text-gray-500">Unmatched</p>
                <p className="font-medium text-orange-600">{statement.unmatchedTransactions}</p>
              </div>
              <div>
                <p className="text-gray-500">Discrepancies</p>
                <p className="font-medium text-red-600">{statement.discrepancies}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatementStatusColor(statement.status)}>
              {statement.status.replace('_', ' ')}
            </Badge>
            <div className="flex gap-1">
              {statement.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStartReconciliation(statement.id)}
                  disabled={isProcessing}
                >
                  <Play size={14} />
                </Button>
              )}
              {statement.status === 'in_progress' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onRunAutoReconciliation(statement.id)}
                  disabled={isProcessing}
                >
                  <Shuffle size={14} />
                </Button>
              )}
              {statement.status === 'completed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onExportReport(statement.id)}
                >
                  <Download size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};