// Gmail types for ERP system

export interface Email {
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
  folder: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'archive';
  hasAttachments: boolean;
  threadId: string;
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
  labels?: string[];
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  emailCount: number;
  lastActivity: string;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  emails: Email[];
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  lastContact: string;
  emailCount: number;
  avatar?: string;
  notes?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'general' | 'sales' | 'support' | 'marketing' | 'hr' | 'finance';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
}

export interface EmailStats {
  totalEmails: number;
  unreadEmails: number;
  responseRate: number;
  avgResponseTime: number;
  totalEmailsChange: string;
  unreadEmailsChange: string;
  responseRateChange: string;
  avgResponseTimeChange: string;
}

export interface EmailFilter {
  folder?: string;
  priority?: string;
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  sender?: string;
  recipient?: string;
}

export interface EmailDraft {
  id: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  attachments: EmailAttachment[];
  isScheduled: boolean;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface EmailRule {
  id: string;
  name: string;
  conditions: EmailRuleCondition[];
  actions: EmailRuleAction[];
  isActive: boolean;
  priority: number;
}

export interface EmailRuleCondition {
  field: 'sender' | 'recipient' | 'subject' | 'content';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
}

export interface EmailRuleAction {
  type: 'move' | 'label' | 'star' | 'markRead' | 'delete' | 'forward';
  value: string;
}

export interface EmailActivity {
  id: string;
  type: 'sent' | 'received' | 'replied' | 'forwarded' | 'deleted' | 'archived';
  emailId: string;
  timestamp: string;
  description: string;
}

export interface GmailSettings {
  autoReply: {
    enabled: boolean;
    message: string;
    startDate?: string;
    endDate?: string;
  };
  signature: {
    enabled: boolean;
    content: string;
  };
  notifications: {
    desktop: boolean;
    email: boolean;
    mobile: boolean;
  };
  filters: EmailRule[];
  labels: string[];
}

export interface EmailSearchResult {
  emails: Email[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
}

export interface EmailComposition {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  attachments: File[];
  isScheduled: boolean;
  scheduledTime?: string;
  templateId?: string;
  signatureId?: string;
}

export interface EmailMetrics {
  sent: number;
  received: number;
  replied: number;
  forwarded: number;
  deleted: number;
  archived: number;
  starred: number;
  unread: number;
  responseTime: {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  };
  topSenders: Array<{
    email: string;
    count: number;
  }>;
  topRecipients: Array<{
    email: string;
    count: number;
  }>;
  busyHours: Array<{
    hour: number;
    count: number;
  }>;
  busyDays: Array<{
    day: string;
    count: number;
  }>;
}