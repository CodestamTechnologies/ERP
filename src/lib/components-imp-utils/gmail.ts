// Gmail utility functions

import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/components-Data/gmail/constent';

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseEmailAddresses = (emailString: string): string[] => {
  if (!emailString) return [];
  
  return emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email && isValidEmail(email));
};

export const extractEmailFromString = (text: string): string | null => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailRegex);
  return match ? match[1] : null;
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const getEmailDomain = (email: string): string => {
  const parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
};

// Define interfaces for type safety
interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'high' | 'medium' | 'low';
  folder: string;
  hasAttachments: boolean;
  threadId: string;
}

interface EmailFilters {
  folder?: string;
  priority?: string;
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  dateRange?: { start: string; end: string };
  sender?: string;
  recipient?: string;
  searchTerm?: string;
}

interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  emails: Email[];
  lastActivity: string;
  isRead: boolean;
  isStarred: boolean;
  emailCount: number;
}

interface EmailTemplate {
  name: string;
  subject: string;
  content: string;
  category: string;
}

export const sortEmails = (emails: Email[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') => {
  return [...emails].sort((a, b) => {
    let aValue: string | number, bValue: string | number;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.timestamp).getTime();
        bValue = new Date(b.timestamp).getTime();
        break;
      case 'sender':
        aValue = a.sender.toLowerCase();
        bValue = b.sender.toLowerCase();
        break;
      case 'subject':
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
      case 'size':
        aValue = a.content.length;
        bValue = b.content.length;
        break;
      default:
        aValue = new Date(a.timestamp).getTime();
        bValue = new Date(b.timestamp).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterEmails = (emails: Email[], filters: EmailFilters) => {
  return emails.filter(email => {
    // Folder filter
    if (filters.folder && filters.folder !== 'all' && email.folder !== filters.folder) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority !== 'all' && email.priority !== filters.priority) {
      return false;
    }
    
    // Read status filter
    if (filters.isRead !== undefined && email.isRead !== filters.isRead) {
      return false;
    }
    
    // Starred filter
    if (filters.isStarred !== undefined && email.isStarred !== filters.isStarred) {
      return false;
    }
    
    // Attachments filter
    if (filters.hasAttachments !== undefined && email.hasAttachments !== filters.hasAttachments) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange) {
      const emailDate = new Date(email.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (emailDate < startDate || emailDate > endDate) {
        return false;
      }
    }
    
    // Sender filter
    if (filters.sender && !email.sender.toLowerCase().includes(filters.sender.toLowerCase())) {
      return false;
    }
    
    // Recipient filter
    if (filters.recipient && !email.recipient.toLowerCase().includes(filters.recipient.toLowerCase())) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchableText = `${email.subject} ${email.content} ${email.sender} ${email.recipient}`.toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

export const groupEmailsByThread = (emails: Email[]): EmailThread[] => {
  const threads: { [key: string]: EmailThread } = {};
  
  emails.forEach(email => {
    if (!threads[email.threadId]) {
      threads[email.threadId] = {
        id: email.threadId,
        subject: email.subject,
        participants: [],
        emails: [],
        lastActivity: email.timestamp,
        isRead: true,
        isStarred: false,
        emailCount: 0
      };
    }
    
    const thread = threads[email.threadId];
    thread.emails.push(email);
    
    // Add participants (avoiding duplicates)
    if (!thread.participants.includes(email.sender)) {
      thread.participants.push(email.sender);
    }
    if (!thread.participants.includes(email.recipient)) {
      thread.participants.push(email.recipient);
    }
    
    // Update thread properties
    if (new Date(email.timestamp) > new Date(thread.lastActivity)) {
      thread.lastActivity = email.timestamp;
    }
    
    if (!email.isRead) {
      thread.isRead = false;
    }
    
    if (email.isStarred) {
      thread.isStarred = true;
    }
  });
  
  // Set email count for each thread
  Object.values(threads).forEach((thread) => {
    thread.emailCount = thread.emails.length;
  });
  
  return Object.values(threads);
};

export const calculateEmailMetrics = (emails: Email[]) => {
  const metrics = {
    total: emails.length,
    unread: 0,
    starred: 0,
    withAttachments: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byFolder: {} as { [key: string]: number },
    bySender: {} as { [key: string]: number },
    byDay: {} as { [key: string]: number },
    byHour: {} as { [key: string]: number }
  };
  
  emails.forEach(email => {
    // Basic counts
    if (!email.isRead) metrics.unread++;
    if (email.isStarred) metrics.starred++;
    if (email.hasAttachments) metrics.withAttachments++;
    
    // Priority distribution
    metrics.byPriority[email.priority]++;
    
    // Folder distribution
    if (!metrics.byFolder[email.folder]) {
      metrics.byFolder[email.folder] = 0;
    }
    metrics.byFolder[email.folder]++;
    
    // Sender distribution
    if (!metrics.bySender[email.sender]) {
      metrics.bySender[email.sender] = 0;
    }
    metrics.bySender[email.sender]++;
    
    // Day distribution
    const day = new Date(email.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    if (!metrics.byDay[day]) {
      metrics.byDay[day] = 0;
    }
    metrics.byDay[day]++;
    
    // Hour distribution
    const hour = new Date(email.timestamp).getHours();
    const hourKey = `${hour}:00`;
    if (!metrics.byHour[hourKey]) {
      metrics.byHour[hourKey] = 0;
    }
    metrics.byHour[hourKey]++;
  });
  
  return metrics;
};

export const generateEmailReport = (emails: Email[], dateRange: { start: string; end: string }) => {
  const filteredEmails = emails.filter(email => {
    const emailDate = new Date(email.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return emailDate >= startDate && emailDate <= endDate;
  });
  
  const metrics = calculateEmailMetrics(filteredEmails);
  
  return {
    period: dateRange,
    totalEmails: metrics.total,
    metrics,
    topSenders: Object.entries(metrics.bySender)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10),
    dailyActivity: Object.entries(metrics.byDay)
      .sort(([, a], [, b]) => (b as number) - (a as number)),
    hourlyActivity: Object.entries(metrics.byHour)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
  };
};

export const exportEmailsToCSV = (emails: Email[]) => {
  const headers = [
    'Subject',
    'Sender',
    'Recipient',
    'Date',
    'Time',
    'Priority',
    'Folder',
    'Read Status',
    'Starred',
    'Has Attachments'
  ];
  
  const rows = emails.map(email => [
    `"${email.subject.replace(/"/g, '""')}"`,
    `"${email.sender}"`,
    `"${email.recipient}"`,
    email.date,
    formatTime(email.timestamp),
    email.priority,
    email.folder,
    email.isRead ? 'Read' : 'Unread',
    email.isStarred ? 'Yes' : 'No',
    email.hasAttachments ? 'Yes' : 'No'
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const validateEmailTemplate = (template: EmailTemplate) => {
  const errors: string[] = [];
  
  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required');
  }
  
  if (!template.subject || template.subject.trim().length === 0) {
    errors.push('Subject is required');
  }
  
  if (!template.content || template.content.trim().length === 0) {
    errors.push('Content is required');
  }
  
  if (!template.category) {
    errors.push('Category is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const replaceTemplateVariables = (template: string, variables: { [key: string]: string }) => {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};