import { cn } from '@/lib/utils';

export const getStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'active' && 'bg-green-100 text-green-800',
    status === 'inactive' && 'bg-red-100 text-red-800',
    status === 'pending' && 'bg-yellow-100 text-yellow-800'
  );
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

export const getSegmentColor = (segment: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    segment.toLowerCase() === 'enterprise' && 'bg-purple-100 text-purple-800',
    segment.toLowerCase() === 'business' && 'bg-green-100 text-green-800',
    segment.toLowerCase() === 'individual' && 'bg-blue-100 text-blue-800',
    segment.toLowerCase() === 'vip' && 'bg-amber-100 text-amber-800',
    segment.toLowerCase() === 'new' && 'bg-cyan-100 text-cyan-800',
    segment.toLowerCase() === 'at-risk' && 'bg-orange-100 text-orange-800'
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

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getActivityIconColor = (type: string): string => {
  return cn(
    'p-1 rounded',
    type === 'new-customer' && 'bg-green-100 text-green-600',
    type === 'order' && 'bg-blue-100 text-blue-600',
    type === 'payment' && 'bg-purple-100 text-purple-600',
    type === 'inactive' && 'bg-red-100 text-red-600',
    type === 'milestone' && 'bg-yellow-100 text-yellow-600',
    type === 'support-ticket' && 'bg-orange-100 text-orange-600',
    type === 'contract-renewal' && 'bg-cyan-100 text-cyan-600',
    type === 'feedback' && 'bg-indigo-100 text-indigo-600'
  );
};