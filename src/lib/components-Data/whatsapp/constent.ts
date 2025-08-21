// WhatsApp Stats Data
export const WHATSAPP_STATS = [
  {
    name: 'Total Reach',
    value: '15,420',
    change: '+12.5%',
    changeType: 'positive' as const,
    target: '18,000',
    progress: 85.7,
    iconType: 'eye'
  },
  {
    name: 'Messages Sent',
    value: '8,934',
    change: '+8.3%',
    changeType: 'positive' as const,
    target: '10,000',
    progress: 89.3,
    iconType: 'paperPlane'
  },
  {
    name: 'Response Rate',
    value: '87.5%',
    change: '+2.1%',
    changeType: 'positive' as const,
    target: '90%',
    progress: 97.2,
    iconType: 'reply'
  },
  {
    name: 'New Contacts',
    value: '234',
    change: '+15.7%',
    changeType: 'positive' as const,
    target: '300',
    progress: 78.0,
    iconType: 'userPlus'
  }
];

// WhatsApp Channels Data
export const WHATSAPP_CHANNELS = [
  {
    id: 1,
    name: 'Customer Support',
    messages: 3420,
    responses: 2987,
    avgResponseTime: '2.3 min',
    satisfaction: 94,
    color: 'green',
    growth: '+8.2%'
  },
  {
    id: 2,
    name: 'Sales Inquiries',
    messages: 2156,
    responses: 1834,
    avgResponseTime: '4.1 min',
    satisfaction: 89,
    color: 'blue',
    growth: '+12.5%'
  },
  {
    id: 3,
    name: 'Marketing Campaigns',
    messages: 1890,
    responses: 1456,
    avgResponseTime: '6.2 min',
    satisfaction: 82,
    color: 'purple',
    growth: '+18.3%'
  },
  {
    id: 4,
    name: 'Order Updates',
    messages: 1468,
    responses: 1298,
    avgResponseTime: '1.8 min',
    satisfaction: 96,
    color: 'orange',
    growth: '+5.7%'
  }
];

// WhatsApp Messages Data
export const WHATSAPP_MESSAGES = [
  {
    id: 'WA-2024-001',
    contact: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    contactEmail: 'rajesh@example.com',
    message: 'Hi, I need information about your products',
    date: '2024-01-15',
    time: '2 minutes ago',
    status: 'unread',
    type: 'inquiry',
    priority: 'high',
    category: 'Sales',
    responseTime: null,
    tags: ['product-inquiry', 'new-customer'],
    agent: 'Sarah Johnson'
  },
  {
    id: 'WA-2024-002',
    contact: 'Priya Sharma',
    phone: '+91 87654 32109',
    contactEmail: 'priya@example.com',
    message: 'Thank you for the quick delivery!',
    date: '2024-01-15',
    time: '15 minutes ago',
    status: 'read',
    type: 'feedback',
    priority: 'medium',
    category: 'Support',
    responseTime: '3.2 min',
    tags: ['positive-feedback', 'delivery'],
    agent: 'Rahul Verma'
  },
  {
    id: 'WA-2024-003',
    contact: 'Tech Solutions Ltd',
    phone: '+91 76543 21098',
    contactEmail: 'contact@techsolutions.com',
    message: 'Can we schedule a meeting for next week?',
    date: '2024-01-15',
    time: '1 hour ago',
    status: 'replied',
    type: 'business',
    priority: 'high',
    category: 'Sales',
    responseTime: '1.8 min',
    tags: ['meeting-request', 'b2b'],
    agent: 'Sarah Johnson'
  },
  {
    id: 'WA-2024-004',
    contact: 'Amit Patel',
    phone: '+91 65432 10987',
    contactEmail: 'amit@example.com',
    message: 'What are your payment terms?',
    date: '2024-01-15',
    time: '2 hours ago',
    status: 'unread',
    type: 'inquiry',
    priority: 'medium',
    category: 'Sales',
    responseTime: null,
    tags: ['payment-inquiry'],
    agent: 'Priya Gupta'
  },
  {
    id: 'WA-2024-005',
    contact: 'Global Enterprises',
    phone: '+91 54321 09876',
    contactEmail: 'orders@globalent.com',
    message: 'Order #12345 has been received',
    date: '2024-01-15',
    time: '3 hours ago',
    status: 'read',
    type: 'order',
    priority: 'low',
    category: 'Orders',
    responseTime: '5.1 min',
    tags: ['order-confirmation', 'b2b'],
    agent: 'Rahul Verma'
  }
];

// WhatsApp Team Data
export const WHATSAPP_TEAM = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Customer Support Lead',
    messagesHandled: 1250,
    avgResponseTime: '2.1 min',
    satisfaction: 96,
    target: 1400,
    achieved: 1250,
    rating: 4.8,
    conversion: 85
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Sales Representative',
    messagesHandled: 890,
    avgResponseTime: '3.5 min',
    satisfaction: 92,
    target: 1000,
    achieved: 890,
    rating: 4.6,
    conversion: 78
  },
  {
    id: 3,
    name: 'Priya Gupta',
    role: 'Marketing Specialist',
    messagesHandled: 670,
    avgResponseTime: '4.2 min',
    satisfaction: 88,
    target: 800,
    achieved: 670,
    rating: 4.4,
    conversion: 72
  }
];

// Quick Actions Data
export const QUICK_ACTIONS = [
  {
    name: 'Send Broadcast',
    iconType: 'bullhorn',
    color: 'blue'
  },
  {
    name: 'New Campaign',
    iconType: 'envelope',
    color: 'green'
  },
  {
    name: 'Add Contact',
    iconType: 'userPlus',
    color: 'purple'
  },
  {
    name: 'Templates',
    iconType: 'comments',
    color: 'orange'
  },
  {
    name: 'Analytics',
    iconType: 'chartLine',
    color: 'red'
  },
  {
    name: 'Settings',
    iconType: 'phone',
    color: 'indigo'
  }
];

// Recent Activities Data
export const RECENT_ACTIVITIES = [
  {
    id: 1,
    message: 'New message from Rajesh Kumar',
    time: '2 min ago',
    priority: 'high',
    iconType: 'comments'
  },
  {
    id: 2,
    message: 'Campaign "Holiday Sale" completed',
    time: '15 min ago',
    priority: 'medium',
    iconType: 'bullhorn'
  },
  {
    id: 3,
    message: '25 new contacts added',
    time: '1 hour ago',
    priority: 'low',
    iconType: 'userPlus'
  },
  {
    id: 4,
    message: 'Response time improved by 15%',
    time: '2 hours ago',
    priority: 'medium',
    iconType: 'clock'
  }
];

// Tabs Data
export const TABS = [
  {
    id: 'overview',
    name: 'Overview',
    iconType: 'eye'
  },
  {
    id: 'messages',
    name: 'Messages',
    iconType: 'comments'
  },
  {
    id: 'team',
    name: 'Team',
    iconType: 'users'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    iconType: 'chartLine'
  }
];