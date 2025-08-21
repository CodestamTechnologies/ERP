import { cn } from '@/lib/utils';

export const confidenceColorClass = (confidence: number) => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    confidence >= 90 && 'text-green-600 bg-green-100',
    confidence >= 80 && confidence < 90 && 'text-blue-600 bg-blue-100',
    confidence >= 70 && confidence < 80 && 'text-yellow-600 bg-yellow-100',
    confidence < 70 && 'text-red-600 bg-red-100'
  );
};

export const impactColorClass = (impact: string) => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    impact === 'high' && 'bg-red-100 text-red-800',
    impact === 'medium' && 'bg-yellow-100 text-yellow-800',
    impact === 'low' && 'bg-green-100 text-green-800'
  );
};

export const statusColorClass = (status: string) => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'urgent' && 'bg-red-100 text-red-800',
    status === 'active' && 'bg-blue-100 text-blue-800',
    status === 'monitoring' && 'bg-yellow-100 text-yellow-800',
    status === 'opportunity' && 'bg-green-100 text-green-800'
  );
};