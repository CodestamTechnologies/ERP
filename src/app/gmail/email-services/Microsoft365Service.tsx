'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmailServiceLayout, { BaseEmail, ServiceStat, ServiceTab, FolderOption, SortOption } from '@/components/email/EmailServiceLayout';
import ComposeDialog, { ComposeData } from '@/components/email/ComposeDialog';
import { 
  Mail, 
  Cloud, 
  Users, 
  Globe, 
  MessageSquare,
  Upload,
  TrendingUp,
  Plus,
  Hash,
  Shield,
  Building
} from 'lucide-react';

const Microsoft365Service = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);

  // Enhanced Outlook emails with Microsoft-specific features
  const outlookEmails: BaseEmail[] = [
    {
      id: '1',
      sender: 'Michael Chen',
      senderEmail: 'michael.chen@enterprise.com',
      subject: 'Board Meeting Agenda - Confidential',
      preview: 'Please review the attached board meeting agenda for next week. This contains sensitive financial information...',
      content: `Dear Executive Team,

I hope this message finds you well. Please find attached the comprehensive agenda for our upcoming board meeting scheduled for next Thursday.

Key Discussion Points:
• Q4 Financial Performance Review
• Strategic Planning for 2024
• Budget Allocation Proposals
• Market Expansion Opportunities
• Risk Assessment and Mitigation

The meeting will be held in the executive boardroom at 9:00 AM sharp. Please review all materials beforehand and come prepared with your departmental reports.

Confidentiality Notice: This email contains privileged and confidential information intended only for the addressee.

Best regards,
Michael Chen
Chief Executive Officer
Enterprise Solutions Inc.`,
      time: '1 hour ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Executive',
      folder: 'inbox',
      importance: 'high',
      sensitivity: 'confidential',
      attachments: [
        { id: '1', name: 'Board_Meeting_Agenda.docx', size: '2.1 MB', type: 'document' },
        { id: '2', name: 'Financial_Summary_Q4.xlsx', size: '3.8 MB', type: 'spreadsheet' }
      ]
    },
    {
      id: '2',
      sender: 'Lisa Rodriguez',
      senderEmail: 'lisa.rodriguez@hr.company.com',
      subject: 'Employee Benefits Enrollment - Action Required',
      preview: 'The annual benefits enrollment period is now open. Please complete your selections by the deadline...',
      content: `Dear Team Members,

The annual employee benefits enrollment period is now open and will remain available until January 31st.

Available Benefits:
✓ Health Insurance Plans (3 options available)
✓ Dental and Vision Coverage
✓ 401(k) Retirement Savings Plan
✓ Life Insurance Options
✓ Flexible Spending Accounts
✓ Employee Assistance Program

Important Deadlines:
• Enrollment Period: January 15-31, 2024
• Coverage Effective Date: February 1, 2024
• Required Documentation Due: January 28, 2024

Please log into the HR portal to make your selections. If you have any questions, don't hesitate to reach out to our benefits team.

Best regards,
Lisa Rodriguez
Human Resources Director`,
      time: '3 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'HR',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'normal',
      attachments: [
        { id: '3', name: 'Benefits_Guide_2024.pdf', size: '4.2 MB', type: 'document' }
      ]
    },
    {
      id: '3',
      sender: 'IT Security Team',
      senderEmail: 'security@company.com',
      subject: 'Critical Security Update - Immediate Action Required',
      preview: 'A critical security vulnerability has been identified. Please install the security patch immediately...',
      content: `URGENT SECURITY NOTICE

A critical security vulnerability has been identified in our systems that requires immediate attention from all users.

Threat Level: HIGH
Impact: All Windows and Office applications
Required Action: Install security patch within 24 hours

What you need to do:
1. Save all your current work
2. Close all Microsoft Office applications
3. Run the attached security update installer
4. Restart your computer when prompted
5. Verify the update was successful

The security patch addresses:
• Remote code execution vulnerabilities
• Data encryption improvements
• Authentication security enhancements
• Network communication protection

Failure to install this update may result in:
⚠️ Potential data breaches
⚠️ System compromises
⚠��� Network security risks

If you encounter any issues during installation, contact IT support immediately at extension 911.

IT Security Team
security@company.com`,
      time: '5 hours ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: false,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Security',
      folder: 'inbox',
      importance: 'high',
      sensitivity: 'normal',
      attachments: [
        { id: '4', name: 'Security_Update_v2024.1.exe', size: '127.5 MB', type: 'executable' },
        { id: '5', name: 'Installation_Instructions.pdf', size: '892 KB', type: 'document' }
      ]
    },
    {
      id: '4',
      sender: 'Amanda Foster',
      senderEmail: 'amanda.foster@client.corp.com',
      subject: 'Project Milestone Review - Phase 2 Complete',
      preview: 'I am pleased to inform you that we have successfully completed Phase 2 of the project ahead of schedule...',
      content: `Dear Project Team,

I am pleased to inform you that we have successfully completed Phase 2 of the project ahead of schedule and under budget.

Phase 2 Achievements:
• All deliverables completed on time
• Quality metrics exceeded expectations
• Budget utilization: 92% (8% under budget)
• Client satisfaction score: 9.2/10
• Zero critical issues reported

Key Milestones Reached:
✓ Database migration completed
✓ API integration successful
✓ User interface testing passed
✓ Security audit completed
✓ Performance benchmarks met

Next Steps for Phase 3:
1. Stakeholder review meeting - January 20th
2. Phase 3 planning session - January 22nd
3. Resource allocation review
4. Timeline finalization

Congratulations to the entire team for this outstanding achievement!

Best regards,
Amanda Foster
Senior Project Manager`,
      time: '6 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      hasAttachments: false,
      priority: 'medium',
      category: 'Projects',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'normal'
    },
    {
      id: '5',
      sender: 'Robert Martinez',
      senderEmail: 'robert.martinez@finance.company.com',
      subject: 'Budget Variance Report - Q4 Analysis',
      preview: 'Please find attached the detailed budget variance analysis for Q4 2023...',
      content: `Dear Finance Committee,

Please find attached the detailed budget variance analysis for Q4 2023 and preliminary budget recommendations for Q1 2024.

Q4 Budget Performance:
• Total Budget: $2.8M
• Actual Spending: $2.65M
• Variance: -$150K (5.4% under budget)
• Cost Savings: $150K

Department Performance:
• Marketing: 3% over budget (+$45K)
• Operations: 8% under budget (-$120K)
• IT: 2% under budget (-$25K)
• HR: 12% under budget (-$50K)

Key Findings:
1. Marketing overspend due to additional campaign
2. Operations savings from vendor negotiations
3. IT savings from cloud migration
4. HR savings from reduced recruitment costs

Q1 2024 Recommendations:
• Increase marketing budget by 5%
• Maintain operations budget
• Reduce IT budget by 3%
• Reallocate HR savings to training

The detailed analysis and recommendations are attached for your review.

Best regards,
Robert Martinez
Financial Analyst`,
      time: '8 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Finance',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'confidential',
      attachments: [
        { id: '6', name: 'Q4_Budget_Variance_Report.xlsx', size: '2.7 MB', type: 'spreadsheet' },
        { id: '7', name: 'Q1_Budget_Recommendations.pdf', size: '1.3 MB', type: 'document' }
      ]
    },
    {
      id: '6',
      sender: 'Jessica Wong',
      senderEmail: 'jessica.wong@marketing.company.com',
      subject: 'Social Media Campaign Results - Outstanding Performance',
      preview: 'I am excited to share the results of our recent social media campaign which exceeded all expectations...',
      content: `Hi Marketing Team,

I am excited to share the results of our recent social media campaign which exceeded all expectations!

Campaign Performance Metrics:
• Reach: 2.3M users (target: 1.5M)
• Engagement Rate: 8.7% (industry average: 3.2%)
• Click-through Rate: 4.2% (target: 2.5%)
• Conversions: 1,847 (target: 1,200)
• Cost per Conversion: $12.50 (budget: $18.00)
• ROI: 340% (target: 250%)

Platform Breakdown:
• LinkedIn: 45% of conversions
• Instagram: 28% of conversions
• Facebook: 18% of conversions
• Twitter: 9% of conversions

Top Performing Content:
1. Product demo video (250K views)
2. Customer testimonial post (180K views)
3. Behind-the-scenes content (120K views)

Key Success Factors:
• Authentic storytelling approach
• User-generated content integration
• Influencer partnerships
• Targeted audience segmentation
• A/B tested creative variations

This campaign has set a new benchmark for our social media efforts. Let's discuss scaling these strategies for Q2.

Excellent work, everyone!

Best,
Jessica Wong
Social Media Manager`,
      time: '12 hours ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Marketing',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'normal',
      attachments: [
        { id: '8', name: 'Social_Media_Campaign_Results.pptx', size: '5.4 MB', type: 'presentation' }
      ]
    },
    {
      id: '7',
      sender: 'Kevin Thompson',
      senderEmail: 'kevin.thompson@vendor.solutions.com',
      subject: 'Service Agreement Renewal - Special Pricing',
      preview: 'As your current service agreement expires next month, we would like to offer you special renewal pricing...',
      content: `Dear Procurement Team,

As your current service agreement expires next month, we would like to offer you special renewal pricing for continued partnership.

Current Agreement Details:
• Service: Cloud Infrastructure Management
• Expiration Date: February 28, 2024
• Current Annual Cost: $180,000
• Service Level: Premium Support

Renewal Offer:
• New Annual Cost: $162,000 (10% discount)
• Extended Service Level: Premium Plus
• Additional Benefits:
  - 24/7 priority support
  - Quarterly business reviews
  - Free migration assistance
  - Advanced monitoring tools

Special Offer Valid Until: January 31, 2024

Why Renew with Us:
• 99.9% uptime guarantee
• Award-winning customer support
• Proven track record with your organization
• Seamless integration with existing systems
• Dedicated account management

We value our partnership and would appreciate the opportunity to continue supporting your infrastructure needs. Please let me know if you would like to schedule a call to discuss the renewal terms.

Best regards,
Kevin Thompson
Account Executive
Solutions Inc.`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: true,
      isStarred: true,
      hasAttachments: true,
      priority: 'medium',
      category: 'Procurement',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'normal',
      attachments: [
        { id: '9', name: 'Service_Agreement_Renewal.pdf', size: '1.8 MB', type: 'document' }
      ]
    },
    {
      id: '8',
      sender: 'Dr. Sarah Mitchell',
      senderEmail: 'sarah.mitchell@consulting.firm.com',
      subject: 'Strategic Consulting Proposal - Digital Transformation',
      preview: 'Following our initial discussion, I am pleased to present our comprehensive digital transformation proposal...',
      content: `Dear Executive Leadership,

Following our initial discussion, I am pleased to present our comprehensive digital transformation proposal tailored to your organization's specific needs.

Proposed Engagement Overview:
• Duration: 6 months
• Investment: $450,000
• Expected ROI: 280% within 18 months
��� Team: 8 senior consultants
• Methodology: Agile transformation approach

Key Transformation Areas:
1. Process Automation (40% efficiency gain)
2. Data Analytics Implementation
3. Cloud Migration Strategy
4. Employee Digital Skills Training
5. Customer Experience Enhancement

Deliverables:
• Current state assessment
• Future state roadmap
• Implementation plan
• Change management strategy
• Training programs
• Success metrics framework

Expected Outcomes:
• 35% reduction in operational costs
• 50% improvement in process efficiency
• 25% increase in customer satisfaction
• Enhanced data-driven decision making
• Improved competitive positioning

Our team has successfully completed similar transformations for Fortune 500 companies with an average ROI of 300%.

I would welcome the opportunity to present this proposal in detail. Are you available for a presentation next week?

Best regards,
Dr. Sarah Mitchell
Managing Partner
Strategic Consulting Firm`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Strategy',
      folder: 'inbox',
      importance: 'high',
      sensitivity: 'confidential',
      attachments: [
        { id: '10', name: 'Digital_Transformation_Proposal.pdf', size: '6.2 MB', type: 'document' },
        { id: '11', name: 'Case_Studies_Portfolio.pdf', size: '3.9 MB', type: 'document' }
      ]
    },
    {
      id: '9',
      sender: 'James Wilson',
      senderEmail: 'james.wilson@legal.advisors.com',
      subject: 'Regulatory Compliance Update - New Requirements',
      preview: 'I wanted to inform you about new regulatory requirements that will affect your industry starting March 2024...',
      content: `Dear Compliance Team,

I wanted to inform you about new regulatory requirements that will affect your industry starting March 2024.

New Regulatory Changes:
• Data Protection Enhancement Act
• Financial Reporting Standards Update
• Workplace Safety Regulations
• Environmental Compliance Requirements
• Cybersecurity Framework Mandates

Key Compliance Deadlines:
• March 1, 2024: Data protection policies update
• March 15, 2024: Financial reporting system upgrade
• April 1, 2024: Safety protocol implementation
• April 15, 2024: Environmental impact assessment
• May 1, 2024: Cybersecurity audit completion

Required Actions:
1. Review current policies and procedures
2. Identify compliance gaps
3. Develop implementation timeline
4. Allocate necessary resources
5. Train relevant personnel
6. Establish monitoring systems

Potential Impact:
• Estimated compliance cost: $75,000-$125,000
• Implementation time: 8-12 weeks
• Staff training requirements: 40 hours
• System upgrades needed
• Process documentation updates

Non-compliance penalties can range from $50,000 to $500,000 depending on the violation severity.

I recommend scheduling a compliance assessment meeting within the next two weeks to develop a comprehensive action plan.

Best regards,
James Wilson
Senior Legal Advisor
Legal Advisors LLC`,
      time: '2 days ago',
      date: '2024-01-13',
      isRead: false,
      isStarred: false,
      hasAttachments: true,
      priority: 'high',
      category: 'Legal',
      folder: 'inbox',
      importance: 'high',
      sensitivity: 'normal',
      attachments: [
        { id: '12', name: 'Regulatory_Changes_Summary.pdf', size: '2.1 MB', type: 'document' },
        { id: '13', name: 'Compliance_Checklist.xlsx', size: '890 KB', type: 'spreadsheet' }
      ]
    },
    {
      id: '10',
      sender: 'Maria Gonzalez',
      senderEmail: 'maria.gonzalez@training.institute.com',
      subject: 'Leadership Development Program - Enrollment Open',
      preview: 'We are excited to announce the opening of enrollment for our Executive Leadership Development Program...',
      content: `Dear HR and Learning Development Teams,

We are excited to announce the opening of enrollment for our Executive Leadership Development Program starting in March 2024.

Program Overview:
• Duration: 6 months (part-time)
• Format: Hybrid (online + in-person workshops)
• Cohort Size: Limited to 25 participants
• Investment: $8,500 per participant
• Certification: Executive Leadership Certificate

Curriculum Highlights:
1. Strategic Leadership and Vision Setting
2. Change Management and Innovation
3. Team Building and Talent Development
4. Financial Acumen for Leaders
5. Digital Leadership in Modern Organizations
6. Ethical Leadership and Corporate Responsibility

Program Benefits:
• 360-degree leadership assessment
• Personal leadership coach assignment
• Peer networking opportunities
• Action learning projects
• Executive mentorship program
• Alumni network access

Faculty:
• Harvard Business School professors
• Fortune 500 executives
• Leadership consultants
• Industry experts

Early Bird Discount:
• Register by February 1st: 15% discount
• Group enrollment (5+ participants): Additional 10% discount

This program has a 98% completion rate and 95% participant satisfaction score. Our alumni report an average of 40% career advancement within 18 months.

Would you like to schedule a call to discuss enrollment for your leadership team?

Best regards,
Maria Gonzalez
Program Director
Executive Training Institute`,
      time: '2 days ago',
      date: '2024-01-13',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Training',
      folder: 'inbox',
      importance: 'normal',
      sensitivity: 'normal',
      attachments: [
        { id: '14', name: 'Leadership_Program_Brochure.pdf', size: '4.7 MB', type: 'document' }
      ]
    }
  ];

  // Enhanced Microsoft 365 stats
  const office365Stats: ServiceStat[] = [
    { 
      name: 'Outlook Emails', 
      value: '1,247', 
      total: '2,000',
      percentage: 62,
      icon: Mail,
      color: 'bg-blue-600',
      iconColor: 'text-white',
      trend: '+23 today'
    },
    { 
      name: 'OneDrive Storage', 
      value: '850 GB', 
      total: '1 TB',
      percentage: 85,
      icon: Cloud,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      trend: '+2.3 GB this week'
    },
    { 
      name: 'Teams Activity', 
      value: '156', 
      total: '200',
      percentage: 78,
      icon: MessageSquare,
      color: 'bg-purple-600',
      iconColor: 'text-white',
      trend: '42 messages today'
    },
    { 
      name: 'SharePoint Sites', 
      value: '8', 
      total: '10',
      percentage: 80,
      icon: Globe,
      color: 'bg-green-600',
      iconColor: 'text-white',
      trend: '2 active projects'
    },
  ];

  // Teams channels data
  const teamsChannels = [
    {
      id: '1',
      name: 'General',
      team: 'Company Wide',
      lastMessage: 'Welcome to our new team members! Please introduce yourselves.',
      time: '2 hours ago',
      unread: 3,
      members: 45,
      isPrivate: false,
      description: 'General company announcements and discussions'
    },
    {
      id: '2',
      name: 'Development',
      team: 'Engineering',
      lastMessage: 'Code review for the new authentication feature is ready for testing.',
      time: '4 hours ago',
      unread: 0,
      members: 12,
      isPrivate: true,
      description: 'Development team coordination and technical discussions'
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      team: 'Marketing',
      lastMessage: 'Q1 campaign metrics are looking great! ROI increased by 23%.',
      time: '1 day ago',
      unread: 1,
      members: 8,
      isPrivate: false,
      description: 'Marketing campaigns and strategy discussions'
    }
  ];

  // Service tabs
  const serviceTabs: ServiceTab[] = [
    {
      id: 'mail',
      label: 'Outlook',
      icon: Mail,
      content: null // Will be handled by the layout component
    },
    {
      id: 'onedrive',
      label: 'OneDrive',
      icon: Cloud,
      content: (
        <div className="text-center py-12">
          <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">OneDrive Integration</h3>
          <p className="text-gray-600 mb-4">Access and manage your OneDrive files</p>
          <Button>
            <Cloud className="w-4 h-4 mr-2" />
            Open OneDrive
          </Button>
        </div>
      )
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Teams & Channels
            </h3>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Join Team
            </Button>
          </div>
          <div className="space-y-2">
            {teamsChannels.map((channel) => (
              <div
                key={channel.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {channel.team.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <h4 className="font-medium text-gray-900">{channel.name}</h4>
                        {channel.isPrivate && <Shield className="w-4 h-4 text-gray-400" />}
                        {channel.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {channel.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{channel.team}</p>
                      <p className="text-sm text-gray-500 truncate">{channel.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>{channel.time}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{channel.members} members</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'sharepoint',
      label: 'SharePoint',
      icon: Globe,
      content: (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">SharePoint Integration</h3>
          <p className="text-gray-600 mb-4">Access your SharePoint sites and document libraries</p>
          <div className="flex justify-center space-x-3">
            <Button>
              <Globe className="w-4 h-4 mr-2" />
              Browse Sites
            </Button>
            <Button variant="outline">
              <Building className="w-4 h-4 mr-2" />
              Create Site
            </Button>
          </div>
        </div>
      )
    }
  ];

  // Folder options
  const folderOptions: FolderOption[] = [
    { value: 'inbox', label: 'Inbox', icon: '📥' },
    { value: 'unread', label: 'Unread', icon: '📬' },
    { value: 'flagged', label: 'Flagged', icon: '🚩' },
    { value: 'important', label: 'Important', icon: '⚠️' },
    { value: 'sent', label: 'Sent Items', icon: '📤' },
    { value: 'drafts', label: 'Drafts', icon: '📝' },
    { value: 'junk', label: 'Junk Email', icon: '🗑️' },
    { value: 'all', label: 'All Mail', icon: '📁' }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'sender', label: 'From', icon: '👤' },
    { value: 'subject', label: 'Subject', icon: '📋' },
    { value: 'importance', label: 'Importance', icon: '⚠️' }
  ];

  // Additional filters for Microsoft 365
  const additionalFilters = (
    <Select defaultValue="all">
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="View" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="unread">Unread</SelectItem>
        <SelectItem value="flagged">Flagged</SelectItem>
        <SelectItem value="important">Important</SelectItem>
      </SelectContent>
    </Select>
  );

  // Custom bulk actions for Microsoft 365
  const bulkActions = [
    {
      id: 'archive',
      label: 'Archive',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Archive emails:', emailIds)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Delete emails:', emailIds)
    },
    {
      id: 'flag',
      label: 'Flag',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Flag emails:', emailIds)
    },
    {
      id: 'markImportant',
      label: 'Important',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Mark important:', emailIds)
    }
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
    if (action === 'reply' || action === 'replyAll' || action === 'forward') {
      setIsComposeDialogOpen(true);
    }
    setSelectedEmails([]);
  }, []);

  const handleEmailClick = useCallback((email: BaseEmail) => {
    // Mark as read
    const emailIndex = outlookEmails.findIndex(e => e.id === email.id);
    if (emailIndex !== -1) {
      outlookEmails[emailIndex].isRead = true;
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
        serviceName="Microsoft 365 Suite"
        serviceIcon={Building}
        serviceColor="text-blue-600"
        serviceType="microsoft"
        isConnected={isConnected}
        onConnectionToggle={() => setIsConnected(!isConnected)}
        connectionMessage={
          isConnected 
            ? 'Enterprise integration active • Last sync: 1 minute ago' 
            : 'Connect your Microsoft 365 account to access all features'
        }
        emails={outlookEmails}
        stats={office365Stats}
        tabs={serviceTabs}
        selectedEmails={selectedEmails}
        onEmailSelect={handleEmailSelect}
        onEmailAction={handleEmailAction}
        onEmailClick={handleEmailClick}
        onCompose={handleCompose}
        folderOptions={folderOptions}
        sortOptions={sortOptions}
        additionalFilters={additionalFilters}
        bulkActions={bulkActions}
        searchPlaceholder="Search emails, people, or keywords..."
      />

      <ComposeDialog
        isOpen={isComposeDialogOpen}
        onClose={() => setIsComposeDialogOpen(false)}
        onSend={handleSendEmail}
        onSaveDraft={handleSaveDraft}
        serviceName="Microsoft 365"
        serviceIcon={Building}
        serviceColor="text-blue-600"
        serviceType="microsoft"
        title="New Email - Outlook"
        description="Create and send professional business emails through Microsoft 365"
      />
    </>
  );
};

export default Microsoft365Service;