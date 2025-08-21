export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600 bg-green-100';
  if (confidence >= 80) return 'text-blue-600 bg-blue-100';
  if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'monitoring':
      return 'bg-yellow-100 text-yellow-800';
    case 'opportunity':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};