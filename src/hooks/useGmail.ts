import { useState, useEffect, useCallback } from 'react';
import { Email, EmailThread, Contact, EmailTemplate, EmailStats } from '@/types/gmail';

// Mock data for demonstration
const MOCK_EMAILS: Email[] = [
  {
    id: 'email-1',
    sender: 'John Smith',
    recipient: 'you@company.com',
    subject: 'Q4 Sales Report Review',
    content: 'Hi team,\n\nI\'ve completed the Q4 sales report and would like to schedule a review meeting. The report shows significant growth in our enterprise segment.\n\nPlease let me know your availability for next week.\n\nBest regards,\nJohn',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    isStarred: true,
    priority: 'high',
    folder: 'inbox',
    hasAttachments: true,
    threadId: 'thread-1'
  },
  {
    id: 'email-2',
    sender: 'Sarah Johnson',
    recipient: 'you@company.com',
    subject: 'Project Timeline Update',
    content: 'Hello,\n\nI wanted to update you on the current project timeline. We\'re making good progress and should be able to deliver ahead of schedule.\n\nKey milestones:\n- Phase 1: Completed\n- Phase 2: 80% complete\n- Phase 3: Starting next week\n\nLet me know if you have any questions.\n\nThanks,\nSarah',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    isRead: true,
    isStarred: false,
    priority: 'medium',
    folder: 'inbox',
    hasAttachments: false,
    threadId: 'thread-2'
  },
  {
    id: 'email-3',
    sender: 'Mike Wilson',
    recipient: 'client@example.com',
    subject: 'Meeting Confirmation',
    content: 'Dear Client,\n\nThis is to confirm our meeting scheduled for tomorrow at 2:00 PM. We\'ll be discussing the new product features and implementation timeline.\n\nMeeting details:\n- Date: Tomorrow\n- Time: 2:00 PM\n- Location: Conference Room A\n- Duration: 1 hour\n\nLooking forward to our discussion.\n\nBest regards,\nMike Wilson',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    isRead: true,
    isStarred: false,
    priority: 'medium',
    folder: 'sent',
    hasAttachments: false,
    threadId: 'thread-3'
  },
  {
    id: 'email-4',
    sender: 'Lisa Chen',
    recipient: 'you@company.com',
    subject: 'Urgent: Server Maintenance',
    content: 'URGENT NOTICE\n\nWe need to perform emergency server maintenance tonight from 11 PM to 3 AM. This will affect all services.\n\nPlease ensure:\n1. All critical processes are completed before 11 PM\n2. Inform your teams about the downtime\n3. Have backup plans ready\n\nWe apologize for the short notice.\n\nIT Team',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    isRead: false,
    isStarred: true,
    priority: 'high',
    folder: 'inbox',
    hasAttachments: false,
    threadId: 'thread-4'
  },
  {
    id: 'email-5',
    sender: 'David Brown',
    recipient: 'you@company.com',
    subject: 'Weekly Team Sync',
    content: 'Hi everyone,\n\nHere\'s the agenda for our weekly team sync:\n\n1. Project updates\n2. Blockers and challenges\n3. Next week\'s priorities\n4. Q&A\n\nThe meeting is scheduled for Friday at 10 AM in the main conference room.\n\nSee you there!\nDavid',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isRead: true,
    isStarred: false,
    priority: 'low',
    folder: 'inbox',
    hasAttachments: false,
    threadId: 'thread-5'
  }
];

const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Meeting Request',
    subject: 'Meeting Request - [Topic]',
    content: 'Dear [Name],\n\nI would like to schedule a meeting to discuss [Topic]. Please let me know your availability for the following times:\n\n- [Option 1]\n- [Option 2]\n- [Option 3]\n\nThe meeting should take approximately [Duration].\n\nBest regards,\n[Your Name]',
    category: 'general',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-2',
    name: 'Follow-up Email',
    subject: 'Following up on [Topic]',
    content: 'Hi [Name],\n\nI wanted to follow up on our previous conversation about [Topic]. \n\n[Specific details or questions]\n\nPlease let me know if you need any additional information.\n\nThanks,\n[Your Name]',
    category: 'sales',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-3',
    name: 'Support Response',
    subject: 'Re: Support Request #[Ticket Number]',
    content: 'Dear [Customer Name],\n\nThank you for contacting our support team. We have received your request regarding [Issue].\n\nWe are currently investigating this matter and will provide you with an update within [Timeframe].\n\nIf you have any urgent concerns, please don\'t hesitate to contact us.\n\nBest regards,\n[Support Team]',
    category: 'support',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    company: 'ABC Corporation',
    lastContact: new Date().toISOString(),
    emailCount: 15
  },
  {
    id: 'contact-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Inc.',
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    emailCount: 8
  },
  {
    id: 'contact-3',
    name: 'Mike Wilson',
    email: 'mike.wilson@startup.io',
    company: 'Startup.io',
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    emailCount: 12
  }
];

export const useGmail = () => {
  // State management
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isExporting, setIsExporting] = useState(false);
  
  // Data state
  const [emails, setEmails] = useState<Email[]>([]);
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    emails: false,
    threads: false,
    contacts: false,
    templates: false
  });
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected');

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(prev => ({ ...prev, emails: true, contacts: true, templates: true }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmails(MOCK_EMAILS);
      setContacts(MOCK_CONTACTS);
      setTemplates(MOCK_TEMPLATES);
      
      setLoading(prev => ({ ...prev, emails: false, contacts: false, templates: false }));
    };

    initializeData();
  }, []);

  // Calculate email statistics
  const emailStats: EmailStats = {
    totalEmails: emails.length,
    unreadEmails: emails.filter(email => !email.isRead).length,
    responseRate: 78,
    avgResponseTime: 3.2,
    totalEmailsChange: '+12%',
    unreadEmailsChange: '-8%',
    responseRateChange: '+5%',
    avgResponseTimeChange: '-0.5h'
  };

  // Define interfaces for email operations
  interface EmailData {
    to: string;
    subject: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
  }

  interface ReplyData {
    content: string;
    priority: 'low' | 'medium' | 'high';
  }

  interface ForwardData {
    to: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
  }

  // Email operations
  const handleSendEmail = useCallback(async (emailData: EmailData) => {
    const newEmail: Email = {
      id: `email-${Date.now()}`,
      sender: 'you@company.com',
      recipient: emailData.to,
      subject: emailData.subject,
      content: emailData.content,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      isRead: true,
      isStarred: false,
      priority: emailData.priority,
      folder: 'sent',
      hasAttachments: false,
      threadId: `thread-${Date.now()}`
    };
    
    setEmails(prev => [newEmail, ...prev]);
  }, []);

  const handleReplyEmail = useCallback(async (emailId: string, replyData: ReplyData) => {
    const originalEmail = emails.find(email => email.id === emailId);
    if (!originalEmail) return;

    const replyEmail: Email = {
      id: `email-${Date.now()}`,
      sender: 'you@company.com',
      recipient: originalEmail.sender,
      subject: `Re: ${originalEmail.subject}`,
      content: replyData.content,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      isRead: true,
      isStarred: false,
      priority: replyData.priority,
      folder: 'sent',
      hasAttachments: false,
      threadId: originalEmail.threadId
    };
    
    setEmails(prev => [replyEmail, ...prev]);
  }, [emails]);

  const handleForwardEmail = useCallback(async (emailId: string, forwardData: ForwardData) => {
    const originalEmail = emails.find(email => email.id === emailId);
    if (!originalEmail) return;

    const forwardEmail: Email = {
      id: `email-${Date.now()}`,
      sender: 'you@company.com',
      recipient: forwardData.to,
      subject: `Fwd: ${originalEmail.subject}`,
      content: forwardData.content,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      isRead: true,
      isStarred: false,
      priority: forwardData.priority,
      folder: 'sent',
      hasAttachments: originalEmail.hasAttachments,
      threadId: `thread-${Date.now()}`
    };
    
    setEmails(prev => [forwardEmail, ...prev]);
  }, [emails]);

  const handleDeleteEmail = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, folder: 'trash' }
        : email
    ));
  }, []);

  const handleArchiveEmail = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, folder: 'archive' }
        : email
    ));
  }, []);

  const handleMarkAsRead = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, isRead: true }
        : email
    ));
  }, []);

  const handleMarkAsUnread = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, isRead: false }
        : email
    ));
  }, []);

  const handleStarEmail = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: true }
        : email
    ));
  }, []);

  const handleUnstarEmail = useCallback(async (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, isStarred: false }
        : email
    ));
  }, []);

  const handleMoveToFolder = useCallback(async (emailId: string, folder: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId 
        ? { ...email, folder }
        : email
    ));
  }, []);

  // Define interfaces for template operations
  interface TemplateData {
    name: string;
    subject: string;
    content: string;
    category: string;
    isActive: boolean;
  }

  // Template operations
  const handleCreateTemplate = useCallback(async (templateData: TemplateData) => {
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now()}`,
      name: templateData.name,
      subject: templateData.subject,
      content: templateData.content,
      category: templateData.category,
      isActive: templateData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
  }, []);

  const handleUpdateTemplate = useCallback(async (templateId: string, templateData: Partial<TemplateData>) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { 
            ...template, 
            ...templateData,
            updatedAt: new Date().toISOString()
          }
        : template
    ));
  }, []);

  const handleDeleteTemplate = useCallback(async (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
  }, []);

  // Export functionality
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create CSV content
    const csvContent = [
      ['Subject', 'Sender', 'Date', 'Priority', 'Folder', 'Read Status'].join(','),
      ...emails.map(email => [
        `"${email.subject}"`,
        `"${email.sender}"`,
        email.date,
        email.priority,
        email.folder,
        email.isRead ? 'Read' : 'Unread'
      ].join(','))
    ].join('\n');
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setIsExporting(false);
  }, [emails]);

  // Connection status helpers
  const getConnectionStatusColor = useCallback(() => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      case 'syncing': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  }, [connectionStatus]);

  const getConnectionStatusText = useCallback(() => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'syncing': return 'Syncing...';
      default: return 'Unknown';
    }
  }, [connectionStatus]);

  return {
    // State
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedFolder,
    setSelectedFolder,
    selectedPriority,
    setSelectedPriority,
    sortBy,
    setSortBy,
    isExporting,
    
    // Data
    emails,
    threads,
    contacts,
    templates,
    loading,
    emailStats,
    
    // Email operations
    handleSendEmail,
    handleReplyEmail,
    handleForwardEmail,
    handleDeleteEmail,
    handleArchiveEmail,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleStarEmail,
    handleUnstarEmail,
    handleMoveToFolder,
    
    // Template operations
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    
    // Utility functions
    handleExport,
    connectionStatus,
    getConnectionStatusColor,
    getConnectionStatusText
  };
};