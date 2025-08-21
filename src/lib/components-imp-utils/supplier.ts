import { cn } from '@/lib/utils';

export const getStatusColor = (status: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    status === 'active' && 'bg-green-100 text-green-800',
    status === 'inactive' && 'bg-red-100 text-red-800',
    status === 'pending' && 'bg-yellow-100 text-yellow-800',
    status === 'suspended' && 'bg-gray-100 text-gray-800'
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
    case 'suspended':
      return 'Suspended';
    default:
      return 'Unknown';
  }
};

export const getCategoryColor = (category: string): string => {
  return cn(
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
    category.toLowerCase() === 'electronics' && 'bg-purple-100 text-purple-800',
    category.toLowerCase() === 'furniture' && 'bg-green-100 text-green-800',
    category.toLowerCase() === 'software' && 'bg-indigo-100 text-indigo-800',
    category.toLowerCase() === 'office supplies' && 'bg-yellow-100 text-yellow-800',
    category.toLowerCase() === 'services' && 'bg-pink-100 text-pink-800',
    category.toLowerCase() === 'raw materials' && 'bg-orange-100 text-orange-800',
    category.toLowerCase() === 'logistics' && 'bg-cyan-100 text-cyan-800'
  );
};

export const getRatingColor = (rating: number): string => {
  return cn(
    'font-medium',
    rating >= 4.5 && 'text-green-600',
    rating >= 4.0 && rating < 4.5 && 'text-blue-600',
    rating >= 3.5 && rating < 4.0 && 'text-yellow-600',
    rating < 3.5 && 'text-red-600'
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
    type === 'new-supplier' && 'bg-green-100 text-green-600',
    type === 'order' && 'bg-blue-100 text-blue-600',
    type === 'payment' && 'bg-purple-100 text-purple-600',
    type === 'delivery' && 'bg-indigo-100 text-indigo-600',
    type === 'overdue' && 'bg-red-100 text-red-600',
    type === 'rating' && 'bg-yellow-100 text-yellow-600',
    type === 'contract' && 'bg-cyan-100 text-cyan-600',
    type === 'delayed' && 'bg-orange-100 text-orange-600'
  );
};