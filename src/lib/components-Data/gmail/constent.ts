// Gmail constants and data

export const TABS = [
  { id: 'inbox', name: 'Inbox', icon: '📥' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'templates', name: 'Templates', icon: '📝' },
  { id: 'contacts', name: 'Contacts', icon: '👥' },
  { id: 'settings', name: 'Settings', icon: '⚙️' }
];

export const QUICK_ACTIONS = [
  { name: 'Compose', icon: '✍️', color: 'blue' },
  { name: 'Reply All', icon: '↩️', color: 'green' },
  { name: 'Forward', icon: '➡️', color: 'purple' },
  { name: 'Archive', icon: '📦', color: 'gray' },
  { name: 'Delete', icon: '🗑️', color: 'red' },
  { name: 'Star', icon: '⭐', color: 'yellow' },
  { name: 'Mark Read', icon: '✅', color: 'blue' },
  { name: 'Sync Gmail', icon: '🔄', color: 'indigo' },
  { name: 'Export', icon: '📤', color: 'orange' },
  { name: 'Search', icon: '🔍', color: 'gray' },
  { name: 'Filters', icon: '🔽', color: 'purple' },
  { name: 'Settings', icon: '⚙️', color: 'gray' }
];

export const EMAIL_TEMPLATES = [
  {
    id: 'meeting-request',
    name: 'Meeting Request',
    category: 'general',
    subject: 'Meeting Request - [Topic]',
    content: 'Dear [Name],\n\nI would like to schedule a meeting to discuss [Topic]. Please let me know your availability.\n\nBest regards,\n[Your Name]'
  },
  {
    id: 'follow-up',
    name: 'Follow-up Email',
    category: 'sales',
    subject: 'Following up on [Topic]',
    content: 'Hi [Name],\n\nI wanted to follow up on our previous conversation about [Topic].\n\nPlease let me know if you need any additional information.\n\nThanks,\n[Your Name]'
  },
  {
    id: 'support-response',
    name: 'Support Response',
    category: 'support',
    subject: 'Re: Support Request #[Ticket Number]',
    content: 'Dear [Customer Name],\n\nThank you for contacting our support team. We are investigating your request and will provide an update soon.\n\nBest regards,\n[Support Team]'
  }
];

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

export const STATUS_COLORS = {
  inbox: 'bg-blue-100 text-blue-800 border-blue-200',
  sent: 'bg-green-100 text-green-800 border-green-200',
  drafts: 'bg-gray-100 text-gray-800 border-gray-200',
  spam: 'bg-red-100 text-red-800 border-red-200',
  trash: 'bg-red-100 text-red-800 border-red-200',
  archive: 'bg-purple-100 text-purple-800 border-purple-200'
};

export const FOLDER_ICONS = {
  inbox: '📥',
  sent: '📤',
  drafts: '📝',
  spam: '🚫',
  trash: '🗑️',
  archive: '📦'
};

export const PRIORITY_ICONS = {
  high: '🔴',
  medium: '🟡',
  low: '🟢'
};

export const EMAIL_CATEGORIES = [
  { id: 'general', name: 'General', icon: '📧' },
  { id: 'sales', name: 'Sales', icon: '💼' },
  { id: 'support', name: 'Support', icon: '🛠️' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'hr', name: 'Human Resources', icon: '👥' },
  { id: 'finance', name: 'Finance', icon: '💰' }
];

export const EMAIL_FILTERS = [
  { id: 'all', name: 'All Emails', count: 0 },
  { id: 'unread', name: 'Unread', count: 0 },
  { id: 'starred', name: 'Starred', count: 0 },
  { id: 'important', name: 'Important', count: 0 },
  { id: 'attachments', name: 'Has Attachments', count: 0 }
];

export const SORT_OPTIONS = [
  { id: 'date', name: 'Date' },
  { id: 'sender', name: 'Sender' },
  { id: 'subject', name: 'Subject' },
  { id: 'priority', name: 'Priority' },
  { id: 'size', name: 'Size' }
];

export const BULK_ACTIONS = [
  { id: 'markRead', name: 'Mark as Read', icon: '✅' },
  { id: 'markUnread', name: 'Mark as Unread', icon: '📬' },
  { id: 'star', name: 'Add Star', icon: '⭐' },
  { id: 'unstar', name: 'Remove Star', icon: '☆' },
  { id: 'archive', name: 'Archive', icon: '📦' },
  { id: 'delete', name: 'Delete', icon: '🗑️' },
  { id: 'spam', name: 'Mark as Spam', icon: '🚫' },
  { id: 'move', name: 'Move to Folder', icon: '📁' }
];

export const EMAIL_SIGNATURES = [
  {
    id: 'default',
    name: 'Default Signature',
    content: 'Best regards,\n[Your Name]\n[Your Title]\n[Company Name]\n[Phone] | [Email]'
  },
  {
    id: 'professional',
    name: 'Professional',
    content: 'Sincerely,\n[Your Name]\n[Your Title]\n[Company Name]\n[Address]\n[Phone] | [Email] | [Website]'
  },
  {
    id: 'simple',
    name: 'Simple',
    content: 'Thanks,\n[Your Name]'
  }
];

export const AUTO_REPLY_TEMPLATES = [
  {
    id: 'out-of-office',
    name: 'Out of Office',
    subject: 'Out of Office - [Your Name]',
    content: 'Thank you for your email. I am currently out of the office and will return on [Date]. I will respond to your message upon my return.\n\nFor urgent matters, please contact [Alternative Contact].\n\nBest regards,\n[Your Name]'
  },
  {
    id: 'vacation',
    name: 'Vacation',
    subject: 'Vacation Auto-Reply',
    content: 'I am currently on vacation and will have limited access to email. I will respond to your message when I return on [Date].\n\nFor immediate assistance, please contact [Alternative Contact].\n\nThank you for your understanding.'
  }
];

export const EMAIL_RULES_TEMPLATES = [
  {
    name: 'Important Clients',
    conditions: [
      { field: 'sender', operator: 'contains', value: '@importantclient.com' }
    ],
    actions: [
      { type: 'star', value: '' },
      { type: 'label', value: 'Important' }
    ]
  },
  {
    name: 'Newsletter Filter',
    conditions: [
      { field: 'subject', operator: 'contains', value: 'newsletter' }
    ],
    actions: [
      { type: 'label', value: 'Newsletter' },
      { type: 'markRead', value: '' }
    ]
  },
  {
    name: 'Spam Filter',
    conditions: [
      { field: 'subject', operator: 'contains', value: 'URGENT' },
      { field: 'subject', operator: 'contains', value: 'WINNER' }
    ],
    actions: [
      { type: 'move', value: 'spam' }
    ]
  }
];

export const NOTIFICATION_SETTINGS = {
  desktop: {
    enabled: true,
    sound: true,
    preview: true
  },
  email: {
    enabled: false,
    digest: true,
    frequency: 'daily'
  },
  mobile: {
    enabled: true,
    vibration: true,
    led: true
  }
};

export const GMAIL_INTEGRATION_SETTINGS = {
  syncFrequency: 'realtime', // realtime, 5min, 15min, 30min, 1hour
  maxEmails: 1000,
  syncAttachments: true,
  syncLabels: true,
  twoWaySync: true,
  archiveAfterDays: 30,
  deleteAfterDays: 90
};