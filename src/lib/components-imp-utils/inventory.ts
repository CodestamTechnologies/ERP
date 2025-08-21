import { cn } from '@/lib/utils';

export const getStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'in-stock' && 'bg-green-100 text-green-800',
    status === 'low-stock' && 'bg-yellow-100 text-yellow-800',
    status === 'out-of-stock' && 'bg-red-100 text-red-800'
  );
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};

export const getStockLevelColor = (quantity: number, minStock: number): string => {
  if (quantity === 0) return 'text-red-600';
  if (quantity <= minStock) return 'text-yellow-600';
  return 'text-green-600';
};

export const getStockProgressColor = (quantity: number, minStock: number): string => {
  if (quantity === 0) return 'bg-red-500';
  if (quantity <= minStock) return 'bg-yellow-500';
  return 'bg-green-500';
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