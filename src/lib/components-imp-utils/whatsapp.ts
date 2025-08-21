// Utility Functions for WhatsApp Component

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'read':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'replied':
      return 'border-green-200 bg-green-50 text-green-700';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700';
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'inquiry':
      return 'border-purple-200 bg-purple-50 text-purple-700';
    case 'feedback':
      return 'border-green-200 bg-green-50 text-green-700';
    case 'business':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'order':
      return 'border-orange-200 bg-orange-50 text-orange-700';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50 text-yellow-700';
    case 'low':
      return 'border-green-200 bg-green-50 text-green-700';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700';
  }
};

export const getActivityPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const getActivityBgColor = (priority: string) => {
  const baseClasses = 'p-2 rounded-lg';
  switch (priority) {
    case 'high':
      return `${baseClasses} bg-red-50 text-red-600`;
    case 'medium':
      return `${baseClasses} bg-yellow-50 text-yellow-600`;
    case 'low':
      return `${baseClasses} bg-green-50 text-green-600`;
    default:
      return `${baseClasses} bg-gray-50 text-gray-600`;
  }
};

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const formatResponseTime = (time: string | null) => {
  if (!time) return 'Pending';
  return time;
};