'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import EmailServiceLayout, { BaseEmail, ServiceStat, ServiceTab, FolderOption, SortOption } from '@/components/email/EmailServiceLayout';
import ComposeDialog, { ComposeData } from '@/components/email/ComposeDialog';
import { 
  Mail, 
  HardDrive, 
  Calendar, 
  Building2,
  Upload,
  TrendingUp,
  Plus,
  Users,
  DollarSign,
  Zap,
  Search
} from 'lucide-react';

const ZohoMailService = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Enhanced business emails with CRM integration
  const zohoEmails: BaseEmail[] = [
    {
      id: '1',
      sender: 'David Wilson',
      senderEmail: 'david.wilson@techstartup.com',
      subject: 'Proposal Approval - Project Alpha ($50K Deal)',
      preview: 'Thank you for the detailed proposal. We are pleased to approve the project and move forward with the implementation...',
      content: `Dear Team,

Thank you for the comprehensive proposal for Project Alpha. After careful review by our technical and financial teams, we are pleased to approve the project.

Project Details:
• Total Value: $50,000
• Timeline: 3 months
• Team Size: 5 developers
• Technology Stack: React, Node.js, MongoDB
• Deliverables: Web application + Mobile app

Next Steps:
1. Contract signing scheduled for this Friday
2. Initial payment (30%) upon contract execution
3. Project kickoff meeting next Monday
4. Weekly progress reviews

We're excited to work with your team and look forward to a successful partnership.

Best regards,
David Wilson
CTO, TechStartup Inc.
Phone: +1 (555) 123-4567
Email: david.wilson@techstartup.com`,
      time: '30 minutes ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Sales',
      folder: 'inbox',
      tags: ['Hot Lead', 'Contract', 'High Value'],
      crmContact: {
        id: 'crm_001',
        name: 'David Wilson',
        company: 'TechStartup Inc.',
        dealValue: '$50,000'
      },
      attachments: [
        { id: '1', name: 'Signed_Contract_Alpha.pdf', size: '2.4 MB', type: 'document' },
        { id: '2', name: 'Project_Specifications.docx', size: '1.8 MB', type: 'document' }
      ]
    },
    {
      id: '2',
      sender: 'Sarah Martinez',
      senderEmail: 'sarah.martinez@retailcorp.com',
      subject: 'Weekly Team Sync - Marketing Campaign Results',
      preview: 'Great news! Our Q1 marketing campaign exceeded expectations with a 23% increase in conversion rates...',
      content: `Hi Team,

Great news from our Q1 marketing campaign! The results are in and they're fantastic.

Campaign Performance:
✓ Conversion Rate: 23% increase
✓ Lead Generation: 156 new qualified leads
✓ Cost per Acquisition: Reduced by 18%
✓ ROI: 340% return on investment
✓ Social Media Engagement: Up 45%

Top Performing Channels:
1. LinkedIn Ads - 35% of conversions
2. Google Ads - 28% of conversions
3. Email Marketing - 22% of conversions
4. Content Marketing - 15% of conversions

Next Quarter Focus:
• Expand successful LinkedIn campaigns
• A/B test new email templates
• Increase content marketing budget
• Launch influencer partnerships

Team meeting scheduled for Thursday at 2 PM to discuss Q2 strategy.

Best,
Sarah Martinez
Marketing Director
RetailCorp Solutions`,
      time: '2 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachments: false,
      priority: 'medium',
      category: 'Marketing',
      folder: 'inbox',
      tags: ['Campaign', 'Results', 'Team Update'],
      crmContact: {
        id: 'crm_002',
        name: 'Sarah Martinez',
        company: 'RetailCorp Solutions'
      }
    },
    {
      id: '3',
      sender: 'Finance Team',
      senderEmail: 'finance@company.com',
      subject: 'Invoice #INV-2024-0156 - Payment Received',
      preview: 'Payment confirmation for Invoice #INV-2024-0156 in the amount of $15,750 has been successfully processed...',
      content: `Dear Accounts Team,

This is to confirm that payment for Invoice #INV-2024-0156 has been successfully received and processed.

Payment Details:
• Invoice Number: INV-2024-0156
• Amount: $15,750.00
• Payment Method: Bank Transfer
• Transaction ID: TXN-789456123
• Payment Date: January 15, 2024
• Client: Manufacturing Solutions Ltd.

Account Summary:
• Previous Balance: $15,750.00
• Payment Received: $15,750.00
• Current Balance: $0.00
• Account Status: Paid in Full

The payment has been automatically recorded in Zoho Books and the client's account has been updated accordingly.

Thank you for your prompt payment processing.

Finance Department
Zoho Workplace Integration`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: false,
      isFlagged: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Finance',
      folder: 'inbox',
      tags: ['Payment', 'Invoice', 'Accounting'],
      attachments: [
        { id: '3', name: 'Payment_Receipt_INV-2024-0156.pdf', size: '456 KB', type: 'document' }
      ]
    },
    {
      id: '4',
      sender: 'Jennifer Walsh',
      senderEmail: 'jennifer.walsh@prospectcorp.com',
      subject: 'Partnership Opportunity - $75K Annual Deal',
      preview: 'We are interested in establishing a strategic partnership with your company for our upcoming expansion...',
      content: `Dear Business Development Team,

We are interested in establishing a strategic partnership with your company for our upcoming expansion into the European market.

Partnership Proposal:
• Annual Contract Value: $75,000
• Duration: 2 years with renewal option
• Services Required: Digital marketing and web development
• Target Markets: UK, Germany, France
• Expected Launch: Q2 2024

Our Company Profile:
• Industry: E-commerce Solutions
• Annual Revenue: $12M
• Employees: 85
• Current Markets: North America, Australia
• Growth Rate: 35% YoY

Partnership Benefits:
• Guaranteed minimum spend of $75K annually
• Long-term contract stability
• Potential for additional projects
• European market expansion opportunity
• Strong reference for future clients

We would like to schedule a meeting to discuss this opportunity in detail. Are you available next week for a presentation?

Looking forward to a mutually beneficial partnership.

Best regards,
Jennifer Walsh
VP Business Development
ProspectCorp International`,
      time: '4 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Business Development',
      folder: 'inbox',
      tags: ['Partnership', 'High Value', 'International'],
      crmContact: {
        id: 'crm_003',
        name: 'Jennifer Walsh',
        company: 'ProspectCorp International',
        dealValue: '$75,000'
      },
      attachments: [
        { id: '4', name: 'Partnership_Proposal.pdf', size: '3.2 MB', type: 'document' },
        { id: '5', name: 'Company_Profile.pdf', size: '2.1 MB', type: 'document' }
      ]
    },
    {
      id: '5',
      sender: 'Michael Rodriguez',
      senderEmail: 'michael.rodriguez@clientsolutions.com',
      subject: 'Project Update - Phase 1 Completed Successfully',
      preview: 'I am pleased to report that Phase 1 of our project has been completed successfully and ahead of schedule...',
      content: `Dear Project Team,

I am pleased to report that Phase 1 of our project has been completed successfully and ahead of schedule.

Phase 1 Achievements:
• All deliverables completed 5 days early
• Budget utilization: 92% (8% under budget)
• Quality score: 9.4/10
• Client satisfaction: Excellent
• Zero critical issues

Completed Deliverables:
✓ Requirements analysis and documentation
✓ System architecture design
✓ Database schema implementation
✓ Core API development
✓ Initial user interface mockups
✓ Security framework setup

Phase 2 Planning:
• Start Date: January 22, 2024
• Duration: 6 weeks
• Budget: $35,000
• Team: 4 developers + 1 designer
• Key Focus: Frontend development and integration

Client Feedback:
"The team has exceeded our expectations in every aspect. The quality of work and attention to detail is outstanding."

Next Steps:
1. Phase 1 final review meeting - January 18th
2. Phase 2 kickoff - January 22nd
3. Resource allocation for Phase 2
4. Updated project timeline distribution

Congratulations to everyone for this excellent achievement!

Best regards,
Michael Rodriguez
Senior Project Manager`,
      time: '6 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      priority: 'medium',
      category: 'Projects',
      folder: 'inbox',
      tags: ['Project Update', 'Success', 'Phase Complete'],
      crmContact: {
        id: 'crm_004',
        name: 'Michael Rodriguez',
        company: 'ClientSolutions Inc.'
      }
    },
    {
      id: '6',
      sender: 'Lisa Thompson',
      senderEmail: 'lisa.thompson@leadgeneration.com',
      subject: 'New Lead Qualification - Enterprise Client ($120K Potential)',
      preview: 'We have a new enterprise lead that has expressed strong interest in our premium services package...',
      content: `Dear Sales Team,

We have a new enterprise lead that has expressed strong interest in our premium services package.

Lead Information:
• Company: Global Manufacturing Corp
• Contact: Robert Chen, IT Director
• Email: robert.chen@globalmanufacturing.com
• Phone: +1 (555) 987-6543
• Company Size: 500+ employees
• Industry: Manufacturing & Logistics

Requirements:
• Complete digital transformation
• Custom ERP system development
• Cloud migration services
• Staff training and support
• 24/7 technical support

Budget Information:
• Estimated Project Value: $120,000
• Timeline: 8-10 months
• Decision Timeline: 4-6 weeks
• Budget Approval: Already secured
• Competing Vendors: 2 other companies

Lead Qualification Score: 9.2/10
• Budget: Confirmed ✓
• Authority: Decision maker ✓
• Need: Urgent requirement ✓
• Timeline: Immediate start ✓

Next Steps:
1. Initial discovery call scheduled for January 17th
2. Technical requirements gathering
3. Proposal preparation
4. Presentation to stakeholders

This is a high-priority lead with excellent conversion potential. Please prioritize this opportunity.

Best regards,
Lisa Thompson
Lead Generation Manager`,
      time: '8 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Sales',
      folder: 'inbox',
      tags: ['New Lead', 'Enterprise', 'High Value', 'Qualified'],
      crmContact: {
        id: 'crm_005',
        name: 'Robert Chen',
        company: 'Global Manufacturing Corp',
        dealValue: '$120,000'
      },
      attachments: [
        { id: '6', name: 'Lead_Qualification_Report.pdf', size: '1.9 MB', type: 'document' }
      ]
    },
    {
      id: '7',
      sender: 'Amanda Foster',
      senderEmail: 'amanda.foster@marketingagency.com',
      subject: 'Campaign Performance Report - ROI Analysis',
      preview: 'Please find attached the comprehensive performance report for our recent marketing campaigns...',
      content: `Dear Marketing Team,

Please find attached the comprehensive performance report for our recent marketing campaigns across all channels.

Overall Campaign Performance:
• Total Investment: $45,000
• Revenue Generated: $187,500
• ROI: 317% (Excellent performance)
• Lead Generation: 1,247 qualified leads
• Conversion Rate: 12.3% (above industry average)

Channel Performance Breakdown:
1. Google Ads: $15K spent → $78K revenue (420% ROI)
2. LinkedIn Ads: $12K spent → $52K revenue (333% ROI)
3. Facebook Ads: $8K spent → $31K revenue (288% ROI)
4. Email Marketing: $5K spent → $18K revenue (260% ROI)
5. Content Marketing: $5K spent → $8.5K revenue (70% ROI)

Top Performing Campaigns:
• "Digital Transformation Solutions" - 45% of total leads
• "Cloud Migration Services" - 28% of total leads
• "Custom Software Development" - 27% of total leads

Key Insights:
• B2B audiences respond better to LinkedIn and Google
• Video content generates 3x more engagement
• Retargeting campaigns have 85% higher conversion rates
• Mobile optimization increased conversions by 23%

Recommendations for Next Quarter:
• Increase Google Ads budget by 30%
• Expand LinkedIn advertising to new markets
• Develop more video content
• Implement advanced retargeting strategies
• Focus on mobile-first campaign design

The detailed analytics and recommendations are attached for your review.

Best regards,
Amanda Foster
Digital Marketing Manager`,
      time: '12 hours ago',
      date: '2024-01-14',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Marketing',
      folder: 'inbox',
      tags: ['Campaign Report', 'ROI Analysis', 'Performance'],
      attachments: [
        { id: '7', name: 'Campaign_Performance_Report.pdf', size: '4.3 MB', type: 'document' },
        { id: '8', name: 'ROI_Analysis_Detailed.xlsx', size: '2.7 MB', type: 'spreadsheet' }
      ]
    },
    {
      id: '8',
      sender: 'Kevin Park',
      senderEmail: 'kevin.park@techconsulting.com',
      subject: 'Consulting Proposal - System Integration ($85K)',
      preview: 'Following our discussion about your system integration needs, I am pleased to present our comprehensive proposal...',
      content: `Dear IT Leadership Team,

Following our discussion about your system integration needs, I am pleased to present our comprehensive proposal for your digital infrastructure upgrade.

Project Overview:
• Total Investment: $85,000
• Timeline: 4 months
• Team: 6 senior consultants
• Methodology: Agile implementation
• Support: 12 months post-implementation

Scope of Work:
1. Current System Assessment (2 weeks)
2. Integration Architecture Design (3 weeks)
3. Data Migration Planning (2 weeks)
4. System Implementation (8 weeks)
5. Testing and Quality Assurance (3 weeks)
6. Staff Training and Documentation (2 weeks)

Expected Outcomes:
• 40% improvement in operational efficiency
• 60% reduction in manual processes
• 99.9% system uptime guarantee
• Real-time data synchronization
• Enhanced security and compliance

Technology Stack:
• Cloud Platform: AWS/Azure
• Integration Tools: MuleSoft/Zapier
• Database: PostgreSQL/MongoDB
• Monitoring: DataDog/New Relic
• Security: OAuth 2.0/SSL encryption

Our Credentials:
• 15+ years of system integration experience
• 200+ successful implementations
• 98% client satisfaction rate
• Industry certifications: AWS, Microsoft, Salesforce
• 24/7 support and maintenance

Investment Breakdown:
• Consulting Services: $55,000
• Software Licenses: $20,000
• Training and Documentation: $10,000

ROI Projection:
• Year 1: 180% return on investment
• Year 2: 320% return on investment
• Break-even point: 8 months

I would welcome the opportunity to present this proposal in detail. Are you available for a meeting next week?

Best regards,
Kevin Park
Senior Solutions Architect
TechConsulting Solutions`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Consulting',
      folder: 'inbox',
      tags: ['Proposal', 'System Integration', 'High Value'],
      crmContact: {
        id: 'crm_006',
        name: 'Kevin Park',
        company: 'TechConsulting Solutions',
        dealValue: '$85,000'
      },
      attachments: [
        { id: '9', name: 'System_Integration_Proposal.pdf', size: '5.8 MB', type: 'document' },
        { id: '10', name: 'Technical_Architecture.pdf', size: '3.4 MB', type: 'document' }
      ]
    },
    {
      id: '9',
      sender: 'Rachel Green',
      senderEmail: 'rachel.green@customerservice.com',
      subject: 'Customer Satisfaction Survey Results - Q4 2023',
      preview: 'I am pleased to share the results of our Q4 customer satisfaction survey which show significant improvements...',
      content: `Dear Customer Success Team,

I am pleased to share the results of our Q4 customer satisfaction survey which show significant improvements across all metrics.

Survey Results Summary:
• Response Rate: 78% (target: 60%)
• Overall Satisfaction: 4.6/5.0 (up from 4.2)
• Net Promoter Score: 72 (industry average: 45)
• Customer Retention: 94% (up from 89%)
• Support Response Time: 2.3 hours (target: 4 hours)

Key Performance Indicators:
• Product Quality: 4.7/5.0
• Customer Support: 4.8/5.0
• Value for Money: 4.4/5.0
• Ease of Use: 4.5/5.0
• Feature Completeness: 4.3/5.0

Customer Feedback Highlights:
• "Exceptional customer support team"
• "Product reliability has improved significantly"
• "Great value for the investment"
• "User-friendly interface and features"
• "Quick response to issues and requests"

Areas for Improvement:
• Mobile app functionality (3.9/5.0)
• Documentation and tutorials (4.1/5.0)
• Integration capabilities (4.0/5.0)
• Pricing transparency (4.2/5.0)

Action Items:
1. Enhance mobile app features (Priority: High)
2. Improve documentation and help resources
3. Expand integration partnerships
4. Review pricing structure and communication
5. Continue excellence in customer support

Customer Success Stories:
• 15 customers provided detailed testimonials
• 8 customers agreed to case study participation
• 23 customers provided referrals
• 12 customers upgraded to premium plans

This survey data will be used to guide our product roadmap and customer success initiatives for 2024.

Best regards,
Rachel Green
Customer Success Manager`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: true,
      isStarred: false,
      hasAttachments: true,
      priority: 'medium',
      category: 'Customer Success',
      folder: 'inbox',
      tags: ['Survey Results', 'Customer Satisfaction', 'Q4'],
      attachments: [
        { id: '11', name: 'Customer_Satisfaction_Survey_Q4.pdf', size: '3.1 MB', type: 'document' }
      ]
    },
    {
      id: '10',
      sender: 'Thomas Wilson',
      senderEmail: 'thomas.wilson@enterprise.solutions.com',
      subject: 'Enterprise Contract Renewal - $95K Annual Value',
      preview: 'As your current enterprise contract approaches renewal, we would like to discuss continuation of our services...',
      content: `Dear Procurement Team,

As your current enterprise contract approaches renewal, we would like to discuss continuation of our services with enhanced benefits.

Current Contract Summary:
• Service Period: February 2023 - February 2024
• Annual Value: $95,000
• Services: Enterprise software licensing and support
• Performance: 99.8% uptime, 4.9/5 satisfaction rating
• Support Tickets: 156 resolved (avg. 1.2 hours response)

Renewal Proposal:
• New Annual Value: $95,000 (price maintained)
• Contract Duration: 2 years (10% discount for multi-year)
• Enhanced Service Level: Premium Plus
• Additional Benefits at no extra cost:
  - Priority support (30-minute response)
  - Quarterly business reviews
  - Free software upgrades
  - Dedicated account manager
  - 24/7 technical support

Value-Added Services:
• Staff training sessions (4 per year)
• Custom integration support
• Performance optimization consulting
• Security audit and recommendations
• Disaster recovery planning

Why Renew with Us:
• Proven track record with your organization
• Deep understanding of your business needs
• Seamless integration with existing systems
• Award-winning customer support
• Continuous innovation and updates

Contract Benefits:
• Predictable annual costs
• Budget protection against price increases
• Priority access to new features
• Dedicated support resources
• Flexible terms and conditions

Renewal Timeline:
• Current contract expires: February 28, 2024
• Renewal decision needed by: February 1, 2024
• New contract effective: March 1, 2024
• Implementation of new benefits: Immediate

I would appreciate the opportunity to discuss this renewal proposal with your team. Please let me know your availability for a meeting.

Best regards,
Thomas Wilson
Enterprise Account Manager
Enterprise Solutions Inc.`,
      time: '2 days ago',
      date: '2024-01-13',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      category: 'Contracts',
      folder: 'inbox',
      tags: ['Contract Renewal', 'Enterprise', 'High Value'],
      crmContact: {
        id: 'crm_007',
        name: 'Thomas Wilson',
        company: 'Enterprise Solutions Inc.',
        dealValue: '$95,000'
      },
      attachments: [
        { id: '12', name: 'Contract_Renewal_Proposal.pdf', size: '2.9 MB', type: 'document' },
        { id: '13', name: 'Service_Performance_Report.pdf', size: '1.7 MB', type: 'document' }
      ]
    }
  ];

  // Enhanced Zoho Mail & Workplace stats
  const zohoStats: ServiceStat[] = [
    { 
      name: 'Mail Storage', 
      value: '2.8 GB', 
      total: '5 GB',
      percentage: 56,
      icon: Mail,
      color: 'bg-orange-500',
      iconColor: 'text-white',
      trend: '+0.2 GB this week'
    },
    { 
      name: 'WorkDrive Storage', 
      value: '15.2 GB', 
      total: '100 GB',
      percentage: 15,
      icon: HardDrive,
      color: 'bg-blue-500',
      iconColor: 'text-white',
      trend: '+1.1 GB this month'
    },
    { 
      name: 'CRM Contacts', 
      value: '1,247', 
      total: '2,000',
      percentage: 62,
      icon: Users,
      color: 'bg-green-500',
      iconColor: 'text-white',
      trend: '+45 new contacts'
    },
    { 
      name: 'Revenue Pipeline', 
      value: '$125K', 
      total: '$200K',
      percentage: 63,
      icon: DollarSign,
      color: 'bg-purple-500',
      iconColor: 'text-white',
      trend: '+$15K this quarter'
    },
  ];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    zohoEmails.forEach(email => {
      email.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [zohoEmails]);

  // Service tabs
  const serviceTabs: ServiceTab[] = [
    {
      id: 'mail',
      label: 'Mail',
      icon: Mail,
      content: null // Will be handled by the layout component
    },
    {
      id: 'workdrive',
      label: 'WorkDrive',
      icon: HardDrive,
      content: (
        <div className="text-center py-12">
          <HardDrive className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">WorkDrive Integration</h3>
          <p className="text-gray-600 mb-4">Access and manage your WorkDrive files</p>
          <Button>
            <HardDrive className="w-4 h-4 mr-2" />
            Open WorkDrive
          </Button>
        </div>
      )
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      content: (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Zoho Calendar</h3>
          <p className="text-gray-600 mb-4">Manage your schedule and appointments</p>
          <div className="flex justify-center space-x-3">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'workplace',
      label: 'Workplace',
      icon: Building2,
      content: (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Zoho Workplace Apps</h3>
          <p className="text-gray-600 mb-4">Access your integrated business applications</p>
          <div className="flex justify-center space-x-3">
            <Button>
              <Zap className="w-4 h-4 mr-2" />
              Browse Apps
            </Button>
            <Button variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Marketplace
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
    { value: 'starred', label: 'Starred', icon: '⭐' },
    { value: 'flagged', label: 'Flagged', icon: '🚩' },
    { value: 'sent', label: 'Sent', icon: '📤' },
    { value: 'drafts', label: 'Drafts', icon: '📝' },
    { value: 'spam', label: 'Spam', icon: '🗑️' },
    { value: 'all', label: 'All Mail', icon: '📁' }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'sender', label: 'Sender', icon: '👤' },
    { value: 'subject', label: 'Subject', icon: '📋' },
    { value: 'priority', label: 'Priority', icon: '⚠️' }
  ];

  // Additional filters for Zoho (Tags)
  const additionalFilters = (
    <Select value={selectedTag} onValueChange={setSelectedTag}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Tags" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tags</SelectItem>
        {allTags.map(tag => (
          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Custom bulk actions for Zoho
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
      id: 'star',
      label: 'Star',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Star emails:', emailIds)
    },
    {
      id: 'addToCRM',
      label: 'Add to CRM',
      icon: Users,
      action: (emailIds: string[]) => console.log('Add to CRM:', emailIds)
    }
  ];

  // Status banner for CRM integration
  const statusBanner = (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">CRM Integration Active</span>
          <Badge variant="outline" className="text-xs">3 Hot Leads</Badge>
        </div>
        <Button size="sm" variant="outline">
          <Search className="h-4 w-4 mr-1" />
          View CRM
        </Button>
      </div>
    </div>
  );

  // Custom compose fields for Zoho CRM integration
  const crmIntegrationFields = (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <Input placeholder="Add tags separated by commas..." />
      </div>
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">CRM Integration</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Search className="w-4 h-4 mr-1" />
              Find Contact
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Create Lead
            </Button>
          </div>
        </div>
      </div>
    </>
  );

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
    const emailIndex = zohoEmails.findIndex(e => e.id === email.id);
    if (emailIndex !== -1) {
      zohoEmails[emailIndex].isRead = true;
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
        serviceName="Zoho Workplace Suite"
        serviceIcon={Zap}
        serviceColor="text-orange-600"
        serviceType="zoho"
        isConnected={isConnected}
        onConnectionToggle={() => setIsConnected(!isConnected)}
        connectionMessage={
          isConnected 
            ? 'Full workplace integration active • CRM sync enabled' 
            : 'Connect your Zoho account to access all workplace features'
        }
        emails={zohoEmails}
        stats={zohoStats}
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
        statusBanner={statusBanner}
        searchPlaceholder="Search emails, CRM contacts, or deals..."
      />

      <ComposeDialog
        isOpen={isComposeDialogOpen}
        onClose={() => setIsComposeDialogOpen(false)}
        onSend={handleSendEmail}
        onSaveDraft={handleSaveDraft}
        serviceName="Zoho Mail"
        serviceIcon={Zap}
        serviceColor="text-orange-600"
        serviceType="zoho"
        title="Compose Email - Zoho Mail"
        description="Create professional emails with CRM integration"
        additionalFields={crmIntegrationFields}
      />
    </>
  );
};

export default ZohoMailService;