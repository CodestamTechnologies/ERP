'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmailServiceLayout, { BaseEmail, ServiceStat, ServiceTab, FolderOption, SortOption } from '@/components/email/EmailServiceLayout';
import ComposeDialog, { ComposeData } from '@/components/email/ComposeDialog';
import { 
  Mail, 
  HardDrive, 
  Calendar, 
  Video,
  Upload,
  TrendingUp,
  Plus
} from 'lucide-react';

const GoogleWorkspaceService = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);

  // Enhanced mock data with more realistic business emails
  const businessEmails: BaseEmail[] = [
    {
      id: '1',
      sender: 'John Smith',
      senderEmail: 'john.smith@techcorp.com',
      subject: 'Q4 Budget Approval Required - Urgent',
      preview: 'Please review and approve the Q4 budget allocation for the marketing department. The deadline is approaching...',
      content: `Dear Team,

I hope this email finds you well. I'm writing to request your urgent review and approval of the Q4 budget allocation for the marketing department.

Key Points:
• Total budget request: $250,000
• Primary focus: Digital marketing campaigns
• Expected ROI: 300% within 6 months
• Deadline for approval: End of this week

Please find the detailed budget breakdown in the attached spreadsheet. I'm available for any questions or clarifications you might need.

Best regards,
John Smith
Marketing Director
TechCorp Solutions`,
      time: '2 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Finance',
      labels: ['Budget', 'Urgent', 'Marketing'],
      attachments: [
        { id: '1', name: 'Q4_Budget_Breakdown.xlsx', size: '2.4 MB', type: 'spreadsheet' },
        { id: '2', name: 'Marketing_Strategy.pdf', size: '1.8 MB', type: 'document' }
      ]
    },
    {
      id: '2',
      sender: 'Sarah Johnson',
      senderEmail: 'sarah.johnson@clientcorp.com',
      subject: 'Project Alpha - Milestone Update',
      preview: 'Great news! We have successfully completed Phase 1 of Project Alpha ahead of schedule...',
      content: `Hi Team,

Great news! We have successfully completed Phase 1 of Project Alpha ahead of schedule.

Achievements:
✓ All deliverables completed
✓ Quality assurance passed
✓ Client approval received
✓ 15% under budget

Next Steps:
1. Begin Phase 2 planning
2. Resource allocation review
3. Timeline adjustment for early completion

The client is extremely satisfied with our progress. Let's maintain this momentum!

Best,
Sarah Johnson
Project Manager`,
      time: '4 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      priority: 'medium',
      category: 'Projects',
      labels: ['Project Alpha', 'Milestone', 'Success']
    },
    {
      id: '3',
      sender: 'IT Support',
      senderEmail: 'support@company.com',
      subject: 'Security Update - Action Required',
      preview: 'Important security update required for all company devices. Please install the latest patches...',
      content: `Dear All,

This is an important security notice requiring immediate action.

Security Update Details:
• Critical security patches available
• Affects all Windows and Mac devices
• Installation deadline: Tomorrow 5 PM
• Estimated downtime: 15-20 minutes

Installation Instructions:
1. Save all your work
2. Close all applications
3. Run the update installer
4. Restart your device when prompted

If you encounter any issues, please contact IT support immediately.

IT Support Team
Extension: 1234`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: false,
      hasAttachments: true,
      priority: 'high',
      category: 'IT',
      labels: ['Security', 'Mandatory', 'IT'],
      attachments: [
        { id: '3', name: 'Security_Update_Installer.exe', size: '45.2 MB', type: 'executable' }
      ]
    },
    {
      id: '4',
      sender: 'Emily Chen',
      senderEmail: 'emily.chen@hr.company.com',
      subject: 'Team Building Event - Save the Date',
      preview: 'We are excited to announce our annual team building event scheduled for next month...',
      content: `Dear Team,

We are excited to announce our annual team building event scheduled for February 15th, 2024.

Event Details:
• Date: February 15th, 2024
• Time: 9:00 AM - 5:00 PM
• Location: Mountain View Resort
• Activities: Team challenges, workshops, networking
• Lunch and refreshments provided

Please mark your calendars and let us know if you have any dietary restrictions or accessibility needs.

Looking forward to a fun and productive day together!

Best regards,
Emily Chen
HR Manager`,
      time: '6 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: true,
      hasAttachments: false,
      priority: 'medium',
      category: 'HR',
      labels: ['Team Building', 'Event', 'HR']
    },
    {
      id: '5',
      sender: 'Michael Rodriguez',
      senderEmail: 'michael.rodriguez@sales.company.com',
      subject: 'Q1 Sales Report - Outstanding Results',
      preview: 'I am pleased to share our Q1 sales results which exceeded all expectations...',
      content: `Dear Leadership Team,

I am pleased to share our Q1 sales results which exceeded all expectations.

Key Achievements:
• Total Revenue: $2.8M (125% of target)
• New Clients: 47 (target was 35)
• Client Retention: 94%
• Average Deal Size: $45,000 (up 18%)
• Pipeline Value: $5.2M for Q2

Top Performers:
1. Jennifer Walsh - $420K
2. David Park - $380K
3. Lisa Thompson - $350K

The team has done exceptional work, and we're well-positioned for continued growth in Q2.

Best regards,
Michael Rodriguez
Sales Director`,
      time: '8 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Sales',
      labels: ['Sales Report', 'Q1', 'Results'],
      attachments: [
        { id: '4', name: 'Q1_Sales_Report.pdf', size: '3.1 MB', type: 'document' }
      ]
    },
    {
      id: '6',
      sender: 'Alex Thompson',
      senderEmail: 'alex.thompson@vendor.com',
      subject: 'Invoice #2024-0089 - Payment Due',
      preview: 'This is a friendly reminder that Invoice #2024-0089 for $12,500 is due for payment...',
      content: `Dear Accounts Payable,

This is a friendly reminder that Invoice #2024-0089 for $12,500 is due for payment.

Invoice Details:
• Invoice Number: #2024-0089
• Amount: $12,500.00
• Due Date: January 20, 2024
• Services: Web Development & Design
• Payment Terms: Net 15

Please process payment at your earliest convenience. If you have any questions or need additional documentation, please don't hesitate to contact me.

Thank you for your business!

Best regards,
Alex Thompson
Accounts Manager
Digital Solutions Inc.`,
      time: '12 hours ago',
      date: '2024-01-14',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Finance',
      labels: ['Invoice', 'Payment', 'Vendor'],
      attachments: [
        { id: '5', name: 'Invoice_2024-0089.pdf', size: '245 KB', type: 'document' }
      ]
    },
    {
      id: '7',
      sender: 'Rachel Green',
      senderEmail: 'rachel.green@marketing.company.com',
      subject: 'New Product Launch Campaign Strategy',
      preview: 'I have prepared the comprehensive marketing strategy for our upcoming product launch...',
      content: `Hi Team,

I have prepared the comprehensive marketing strategy for our upcoming product launch scheduled for March 2024.

Campaign Overview:
• Product: SmartHome Pro 2.0
• Launch Date: March 15, 2024
• Target Audience: Tech-savvy homeowners, 25-45 years
• Budget: $180,000
• Duration: 8 weeks

Marketing Channels:
1. Digital Advertising (40% of budget)
2. Social Media Marketing (25% of budget)
3. Content Marketing (20% of budget)
4. PR & Influencer Partnerships (15% of budget)

Expected Outcomes:
• 50,000 product page visits
• 2,500 pre-orders
• 15% market share increase

Let's schedule a meeting to discuss the details and timeline.

Best,
Rachel Green
Marketing Manager`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Marketing',
      labels: ['Product Launch', 'Strategy', 'Campaign'],
      attachments: [
        { id: '6', name: 'Product_Launch_Strategy.pptx', size: '8.7 MB', type: 'presentation' },
        { id: '7', name: 'Market_Research_Data.xlsx', size: '2.3 MB', type: 'spreadsheet' }
      ]
    },
    {
      id: '8',
      sender: 'David Kim',
      senderEmail: 'david.kim@legal.company.com',
      subject: 'Contract Review - Client Agreement Updates',
      preview: 'Please review the updated client agreement template with the new terms and conditions...',
      content: `Dear Team,

Please review the updated client agreement template with the new terms and conditions that take effect February 1st, 2024.

Key Changes:
• Updated liability clauses
• Revised payment terms (Net 30 to Net 15)
• Enhanced data protection provisions
• New intellectual property sections
• Updated termination procedures

Action Required:
1. Review all changes by January 25th
2. Provide feedback on any concerns
3. Update existing client contracts
4. Train sales team on new terms

The legal team is available for any questions or clarifications needed.

Best regards,
David Kim
Legal Counsel`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'high',
      category: 'Legal',
      labels: ['Contract', 'Legal', 'Review'],
      attachments: [
        { id: '8', name: 'Updated_Client_Agreement.docx', size: '1.9 MB', type: 'document' },
        { id: '9', name: 'Changes_Summary.pdf', size: '567 KB', type: 'document' }
      ]
    },
    {
      id: '9',
      sender: 'Jennifer Walsh',
      senderEmail: 'jennifer.walsh@operations.company.com',
      subject: 'Office Relocation Update - Timeline',
      preview: 'I wanted to provide you with an update on our office relocation project timeline...',
      content: `Dear All,

I wanted to provide you with an update on our office relocation project timeline and next steps.

Current Status:
• New office lease signed ✓
• Construction permits approved ✓
• Interior design finalized ✓
• IT infrastructure planning in progress
• Moving company selected ✓

Timeline:
• January 30: IT setup begins
• February 15: Furniture installation
• February 28: Final inspections
• March 7: Moving day
• March 10: First day in new office

Each department will receive detailed moving instructions next week. Please start organizing your personal items and files.

Questions? Contact the relocation team at relocation@company.com

Best,
Jennifer Walsh
Operations Manager`,
      time: '2 days ago',
      date: '2024-01-13',
      isRead: false,
      isStarred: false,
      hasAttachments: false,
      priority: 'medium',
      category: 'Operations',
      labels: ['Relocation', 'Office', 'Timeline']
    },
    {
      id: '10',
      sender: 'Tom Wilson',
      senderEmail: 'tom.wilson@client.enterprise.com',
      subject: 'Partnership Proposal - Strategic Alliance',
      preview: 'We would like to propose a strategic partnership between our companies that could benefit both organizations...',
      content: `Dear Business Development Team,

We would like to propose a strategic partnership between our companies that could benefit both organizations significantly.

Partnership Proposal:
• Joint product development initiatives
• Shared marketing and sales efforts
• Technology integration opportunities
• Combined customer support services
• Revenue sharing model: 60/40 split

Potential Benefits:
• Access to new markets (500,000+ customers)
• Reduced development costs (estimated 30% savings)
• Enhanced product offerings
• Stronger competitive position
• Increased revenue potential ($2M+ annually)

We would appreciate the opportunity to discuss this proposal in detail. Are you available for a meeting next week?

Looking forward to your response.

Best regards,
Tom Wilson
VP Business Development
Enterprise Solutions Corp`,
      time: '2 days ago',
      date: '2024-01-13',
      isRead: true,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Business Development',
      labels: ['Partnership', 'Proposal', 'Strategic'],
      attachments: [
        { id: '10', name: 'Partnership_Proposal.pdf', size: '4.2 MB', type: 'document' },
        { id: '11', name: 'Financial_Projections.xlsx', size: '1.5 MB', type: 'spreadsheet' }
      ]
    },
    {
      id: '11',
      sender: 'Lisa Park',
      senderEmail: 'lisa.park@training.company.com',
      subject: 'Mandatory Compliance Training - Deadline Reminder',
      preview: 'This is a reminder that the mandatory compliance training must be completed by all employees...',
      content: `Dear Team Members,

This is a reminder that the mandatory compliance training must be completed by all employees before January 31st, 2024.

Training Modules:
1. Data Privacy and GDPR Compliance (45 minutes)
2. Workplace Safety and Security (30 minutes)
3. Anti-Harassment and Discrimination (60 minutes)
4. Financial Compliance and Ethics (40 minutes)

Completion Status:
• Completed: 67% of employees
• In Progress: 18% of employees
• Not Started: 15% of employees

Access the training portal at: training.company.com
Use your employee ID and password to log in.

Failure to complete training by the deadline may result in system access restrictions.

Questions? Contact training@company.com

Best regards,
Lisa Park
Training Coordinator`,
      time: '3 days ago',
      date: '2024-01-12',
      isRead: false,
      isStarred: false,
      hasAttachments: false,
      priority: 'high',
      category: 'Training',
      labels: ['Compliance', 'Training', 'Mandatory']
    },
    {
      id: '12',
      sender: 'Mark Davis',
      senderEmail: 'mark.davis@finance.company.com',
      subject: 'Monthly Financial Summary - December 2023',
      preview: 'Please find attached the comprehensive financial summary for December 2023...',
      content: `Dear Executive Team,

Please find attached the comprehensive financial summary for December 2023 and year-end analysis.

December Highlights:
• Revenue: $890,000 (8% above target)
• Expenses: $650,000 (5% under budget)
• Net Profit: $240,000
• Cash Flow: Positive $180,000
• Outstanding Receivables: $320,000

Year-End 2023 Summary:
• Total Revenue: $9.8M (12% growth YoY)
• Total Expenses: $7.2M
• Net Profit: $2.6M (36% margin)
• ROI: 28%
• Customer Acquisition Cost: Down 15%

Key Achievements:
• Exceeded annual revenue target by 8%
• Improved profit margins by 4%
• Reduced operational costs by 12%
• Increased customer retention to 92%

The detailed financial statements and analysis are attached for your review.

Best regards,
Mark Davis
Chief Financial Officer`,
      time: '3 days ago',
      date: '2024-01-12',
      isRead: true,
      isStarred: true,
      hasAttachments: true,
      priority: 'medium',
      category: 'Finance',
      labels: ['Financial Report', 'Monthly', 'Year-End'],
      attachments: [
        { id: '12', name: 'December_Financial_Summary.pdf', size: '2.8 MB', type: 'document' },
        { id: '13', name: 'Year_End_Analysis.xlsx', size: '3.4 MB', type: 'spreadsheet' }
      ]
    }
  ];

  // Enhanced stats with more business metrics
  const workspaceStats: ServiceStat[] = [
    { 
      name: 'Unread Emails', 
      value: '23', 
      total: '156',
      percentage: 15,
      icon: Mail,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      trend: '+5 from yesterday'
    },
    { 
      name: 'Storage Used', 
      value: '8.2 GB', 
      total: '15 GB',
      percentage: 55,
      icon: HardDrive,
      color: 'bg-green-500',
      iconColor: 'text-white',
      trend: '+0.3 GB this week'
    },
    { 
      name: 'Response Rate', 
      value: '87%', 
      total: '100%',
      percentage: 87,
      icon: TrendingUp,
      color: 'bg-purple-500',
      iconColor: 'text-white',
      trend: '+3% this month'
    },
    { 
      name: 'Today\'s Meetings', 
      value: '8', 
      total: '12',
      percentage: 67,
      icon: Calendar,
      color: 'bg-orange-500',
      iconColor: 'text-white',
      trend: '3 upcoming'
    },
  ];

  // Service tabs
  const serviceTabs: ServiceTab[] = [
    {
      id: 'mail',
      label: 'Gmail',
      icon: Mail,
      content: null // Will be handled by the layout component
    },
    {
      id: 'drive',
      label: 'Drive',
      icon: HardDrive,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-blue-600" />
              Google Drive Files
            </h3>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </div>
          <div className="text-center py-12">
            <HardDrive className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Google Drive Integration</h3>
            <p className="text-gray-600 mb-4">Access and manage your Google Drive files</p>
            <Button>
              <HardDrive className="w-4 h-4 mr-2" />
              Open Google Drive
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Google Calendar
            </h3>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Google Calendar Integration</h3>
            <p className="text-gray-600 mb-4">Manage your schedule and appointments</p>
            <div className="flex justify-center space-x-3">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'meet',
      label: 'Meet',
      icon: Video,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <Video className="w-5 h-5 mr-2 text-red-600" />
              Google Meet
            </h3>
            <Button variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Video className="w-5 h-5 mr-2 text-green-600" />
                  Quick Meeting
                </CardTitle>
                <CardDescription>Start an instant meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Start Instant Meeting
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Schedule Meeting
                </CardTitle>
                <CardDescription>Plan a meeting for later</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Meeting title" />
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule for Later
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  // Folder options
  const folderOptions: FolderOption[] = [
    { value: 'inbox', label: 'Inbox', icon: '📥' },
    { value: 'unread', label: 'Unread', icon: '📬' },
    { value: 'starred', label: 'Starred', icon: '⭐' },
    { value: 'sent', label: 'Sent', icon: '📤' },
    { value: 'drafts', label: 'Drafts', icon: '📝' },
    { value: 'all', label: 'All Mail', icon: '📁' }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'sender', label: 'Sender', icon: '👤' },
    { value: 'subject', label: 'Subject', icon: '📋' }
  ];

  // Email actions
  const handleEmailSelect = useCallback((emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  }, []);

  const handleEmailAction = useCallback((action: string, emailIds: string[]) => {
    console.log(`Performing ${action} on emails:`, emailIds);
    // Implement actual email actions here
    if (action === 'reply' || action === 'replyAll' || action === 'forward') {
      setIsComposeDialogOpen(true);
    }
    setSelectedEmails([]);
  }, []);

  const handleEmailClick = useCallback((email: BaseEmail) => {
    // Mark as read
    const emailIndex = businessEmails.findIndex(e => e.id === email.id);
    if (emailIndex !== -1) {
      businessEmails[emailIndex].isRead = true;
    }
  }, []);

  const handleCompose = useCallback(() => {
    setIsComposeDialogOpen(true);
  }, []);

  const handleSendEmail = useCallback((data: ComposeData) => {
    console.log('Sending email:', data);
    // Implement actual email sending logic here
  }, []);

  const handleSaveDraft = useCallback((data: ComposeData) => {
    console.log('Saving draft:', data);
    // Implement draft saving logic here
  }, []);

  return (
    <>
      <EmailServiceLayout
        serviceName="Google Workspace Suite"
        serviceIcon={Mail}
        serviceColor="text-blue-600"
        serviceType="google"
        isConnected={isConnected}
        onConnectionToggle={() => setIsConnected(!isConnected)}
        connectionMessage={
          isConnected 
            ? 'Real-time sync active • Last sync: 2 minutes ago' 
            : 'Connect to manage business communications'
        }
        emails={businessEmails}
        stats={workspaceStats}
        tabs={serviceTabs}
        selectedEmails={selectedEmails}
        onEmailSelect={handleEmailSelect}
        onEmailAction={handleEmailAction}
        onEmailClick={handleEmailClick}
        onCompose={handleCompose}
        folderOptions={folderOptions}
        sortOptions={sortOptions}
        searchPlaceholder="Search emails, contacts, or content..."
      />

      <ComposeDialog
        isOpen={isComposeDialogOpen}
        onClose={() => setIsComposeDialogOpen(false)}
        onSend={handleSendEmail}
        onSaveDraft={handleSaveDraft}
        serviceName="Google Workspace"
        serviceIcon={Mail}
        serviceColor="text-blue-600"
        serviceType="google"
      />
    </>
  );
};

export default GoogleWorkspaceService;