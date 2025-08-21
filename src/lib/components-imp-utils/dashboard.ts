import { cn } from '@/lib/utils';

export const getChangeColor = (changeType: string): string => {
  return cn(
    'text-sm font-medium',
    changeType === 'positive' ? 'text-green-600' : 'text-red-600'
  );
};

export const getInsightColor = (type: string): string => {
  return cn(
    'h-2 rounded-full',
    type === 'positive' ? 'bg-green-500' :
    type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
  );
};

export const getStatusColor = (color: string): string => {
  return cn(
    'text-sm font-medium',
    color === 'green' ? 'text-green-600' :
    color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
  );
};

export const getActivityIconColor = (type: string): string => {
  return cn(
    'p-2 rounded-lg',
    type === 'order' ? 'bg-blue-100 text-blue-600' :
    type === 'payment' ? 'bg-green-100 text-green-600' :
    type === 'inventory' ? 'bg-yellow-100 text-yellow-600' :
    type === 'customer' ? 'bg-purple-100 text-purple-600' :
    'bg-indigo-100 text-indigo-600'
  );
};