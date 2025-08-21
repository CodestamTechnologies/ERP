import { cn } from '@/lib/utils';

export const getStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'completed' && 'bg-green-100 text-green-800',
    status === 'processing' && 'bg-blue-100 text-blue-800',
    status === 'shipped' && 'bg-purple-100 text-purple-800',
    status === 'confirmed' && 'bg-yellow-100 text-yellow-800',
    status === 'cancelled' && 'bg-red-100 text-red-800',
    status === 'pending' && 'bg-orange-100 text-orange-800'
  );
};

export const getPaymentStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'paid' && 'bg-green-100 text-green-800',
    status === 'pending' && 'bg-yellow-100 text-yellow-800',
    status === 'partial' && 'bg-orange-100 text-orange-800',
    status === 'overdue' && 'bg-red-100 text-red-800',
    status === 'refunded' && 'bg-gray-100 text-gray-800'
  );
};

export const getPriorityColor = (priority: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    priority === 'high' && 'bg-red-100 text-red-800',
    priority === 'medium' && 'bg-yellow-100 text-yellow-800',
    priority === 'low' && 'bg-green-100 text-green-800'
  );
};

export const getActivityPriorityColor = (priority: string): string => {
  return cn(
    'font-medium',
    priority === 'high' && 'text-red-600',
    priority === 'medium' && 'text-yellow-600',
    priority === 'low' && 'text-green-600'
  );
};

export const getActivityBgColor = (priority: string): string => {
  return cn(
    'p-1 rounded',
    priority === 'high' && 'bg-red-100',
    priority === 'medium' && 'bg-yellow-100',
    priority === 'low' && 'bg-green-100'
  );
};

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};