'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import EmailServiceLayout, { BaseEmail, ServiceStat, ServiceTab, FolderOption, SortOption } from '@/components/email/EmailServiceLayout';
import ComposeDialog, { ComposeData } from '@/components/email/ComposeDialog';
import { 
  Mail, 
  Shield, 
  Calendar, 
  ShieldCheck,
  Database,
  AlertTriangle,
  Lock,
  Key,
  Clock,
  Smartphone,
  Wifi,
  Eye,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProtonMailService = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [securityFilter, setSecurityFilter] = useState<string>('all');

  // Enhanced secure emails with encryption details
  const protonEmails: BaseEmail[] = [
    {
      id: '1',
      sender: 'Legal Department',
      senderEmail: 'legal@confidential.com',
      subject: 'Confidential Contract Terms - Attorney-Client Privilege',
      preview: 'This message contains attorney-client privileged information. Please review the confidential contract terms...',
      content: `CONFIDENTIAL - ATTORNEY-CLIENT PRIVILEGED

Dear Executive Team,

This communication contains confidential and legally privileged information protected under attorney-client privilege.

Contract Terms Summary:
• Non-Disclosure Agreement: 5-year term
• Intellectual Property Rights: Exclusive licensing
• Financial Terms: $2.5M over 3 years
• Termination Clauses: 90-day notice period
• Dispute Resolution: Binding arbitration

Security Notice: This email is protected with end-to-end encryption and will auto-expire in 7 days. Do not forward or share without explicit authorization.

Legal Review Required:
1. Executive approval needed by Friday
2. Board ratification scheduled for next week
3. Regulatory compliance verification pending
4. Final contract execution planned for month-end

For questions regarding this privileged communication, contact the legal department directly.

Confidentially yours,
Legal Department
Secure Communications Division`,
      time: '1 hour ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 98,
      expirationTime: '7 days',
      passwordProtected: true,
      attachments: [
        { id: '1', name: 'Confidential_Contract_Terms.pdf', size: '3.2 MB', type: 'document', isEncrypted: true },
        { id: '2', name: 'Legal_Analysis_Report.docx', size: '1.8 MB', type: 'document', isEncrypted: true }
      ]
    },
    {
      id: '2',
      sender: 'Security Team',
      senderEmail: 'security@protonmail.com',
      subject: 'Security Audit Results - Encrypted Report',
      preview: 'Your security audit has been completed. All systems show excellent security posture with 98% compliance...',
      content: `SECURITY AUDIT REPORT - CONFIDENTIAL

Security Assessment Summary:
Overall Security Score: 98/100 (Excellent)

Audit Results:
✓ Email Encryption: 100% compliance
✓ Two-Factor Authentication: Active on all accounts
✓ VPN Protection: Enabled and monitored
✓ Password Security: Strong policies enforced
✓ Data Encryption: Zero-access architecture verified
✓ Threat Detection: Advanced monitoring active

Security Metrics:
• Phishing Attempts Blocked: 47 this month
• Malware Detection: 12 threats neutralized
• Unauthorized Access Attempts: 0 successful
• Data Breach Incidents: 0 reported
• Compliance Score: 98% (Industry leading)

Recommendations:
1. Enable ProtonVPN on all mobile devices
2. Update password policies quarterly
3. Conduct security training for new employees
4. Implement hardware security keys for executives

Next Audit: Scheduled for Q2 2024

This report is encrypted and will auto-expire in 30 days.

ProtonMail Security Team
Encrypted Communications Division`,
      time: '4 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'zero-access',
      securityScore: 100,
      expirationTime: '30 days',
      passwordProtected: false,
      attachments: [
        { id: '3', name: 'Security_Audit_Report_2024.pdf', size: '4.5 MB', type: 'document', isEncrypted: true }
      ]
    },
    {
      id: '3',
      sender: 'Finance Director',
      senderEmail: 'finance@secure.company.com',
      subject: 'Quarterly Financial Report - Encrypted',
      preview: 'Please find the encrypted quarterly financial report. This contains sensitive financial data requiring secure handling...',
      content: `CONFIDENTIAL FINANCIAL REPORT

Q4 2023 Financial Summary:
This report contains sensitive financial information and is encrypted for security.

Key Financial Metrics:
• Revenue: $4.2M (↑15% YoY)
• Net Profit: $1.1M (↑22% YoY)
• Operating Expenses: $3.1M (↑8% YoY)
• Cash Flow: $890K positive
• EBITDA: $1.3M (31% margin)

Department Performance:
• Sales: Exceeded targets by 12%
• Marketing: ROI of 340%
• Operations: Cost reduction of 8%
• R&D: 3 new products launched

Security Compliance:
• All financial data encrypted at rest
• Access logs monitored and audited
• Regulatory compliance: 100%
• Data retention policies enforced

Board Presentation:
Scheduled for January 20th, 2024
Confidential materials will be distributed via secure channels only.

This encrypted report will auto-expire in 14 days for security purposes.

Best regards,
Finance Director
Secure Financial Communications`,
      time: '1 day ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: false,
      isFlagged: true,
      hasAttachments: true,
      priority: 'medium',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 95,
      expirationTime: '14 days',
      passwordProtected: true,
      attachments: [
        { id: '4', name: 'Q4_Financial_Report_Encrypted.pdf', size: '2.8 MB', type: 'document', isEncrypted: true },
        { id: '5', name: 'Budget_Analysis_2024.xlsx', size: '1.2 MB', type: 'spreadsheet', isEncrypted: true }
      ]
    },
    {
      id: '4',
      sender: 'Whistleblower Protection',
      senderEmail: 'anonymous@secure.tips',
      subject: 'Anonymous Report - Compliance Violation Alert',
      preview: 'This is an anonymous report regarding potential compliance violations that require immediate investigation...',
      content: `ANONYMOUS WHISTLEBLOWER REPORT - CONFIDENTIAL

This message is sent through secure, anonymous channels to protect the identity of the reporter.

Reported Violation Type: Financial Compliance
Severity Level: High
Department: Accounting
Date of Incident: January 10, 2024

Violation Details:
• Potential misreporting of quarterly earnings
• Unauthorized expense approvals
• Possible conflict of interest in vendor selection
• Inadequate documentation of financial transactions

Evidence Provided:
• Email communications (encrypted)
• Financial documents (redacted)
• Meeting recordings (audio files)
• Witness statements (anonymous)

Recommended Actions:
1. Immediate internal audit
2. External compliance review
3. Preservation of all related documents
4. Interview of relevant personnel
5. Review of financial controls

Legal Protection Notice:
This report is protected under whistleblower protection laws. Any retaliation against the reporter or investigation interference is strictly prohibited.

Investigation Timeline:
• Initial review: Within 48 hours
• Full investigation: 2-3 weeks
• Final report: Within 30 days

This encrypted message will auto-expire in 72 hours to protect the reporter's anonymity.

Anonymous Reporting System
Secure Communications Network`,
      time: '3 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 100,
      expirationTime: '72 hours',
      passwordProtected: true,
      attachments: [
        { id: '6', name: 'Anonymous_Evidence_Package.zip', size: '15.7 MB', type: 'archive', isEncrypted: true },
        { id: '7', name: 'Compliance_Violation_Report.pdf', size: '2.3 MB', type: 'document', isEncrypted: true }
      ]
    },
    {
      id: '5',
      sender: 'Government Relations',
      senderEmail: 'classified@gov.secure',
      subject: 'CLASSIFIED: Regulatory Compliance Update - Eyes Only',
      preview: 'This classified communication contains sensitive regulatory information requiring the highest level of security...',
      content: `CLASSIFIED COMMUNICATION - EYES ONLY

Classification Level: CONFIDENTIAL
Clearance Required: Level 3 or Higher
Distribution: Authorized Personnel Only

Subject: New Regulatory Framework Implementation

Dear Authorized Recipients,

This communication contains classified information regarding upcoming regulatory changes that will significantly impact our industry.

Regulatory Changes (Effective March 1, 2024):
• Enhanced data protection requirements
• Stricter financial reporting standards
• New cybersecurity compliance mandates
• International trade regulation updates
• Environmental impact assessment requirements

Compliance Requirements:
1. Immediate security audit (within 30 days)
2. Staff security clearance verification
3. System encryption upgrades
4. Process documentation updates
5. Third-party vendor security assessments

Financial Impact:
• Estimated compliance cost: $500K-$750K
• Implementation timeline: 90 days
• Potential penalties for non-compliance: $1M+
• Required staff training: 120 hours

Security Protocols:
• All related communications must be encrypted
• Physical documents require secure storage
• Digital files need classified-level protection
• Access logs must be maintained and audited
• Regular security briefings mandatory

Action Items:
1. Form compliance task force (by January 20)
2. Conduct gap analysis (by January 25)
3. Develop implementation plan (by February 1)
4. Begin staff training program (by February 5)
5. Complete system upgrades (by February 20)

This message is protected with military-grade encryption and will auto-expire in 48 hours. Unauthorized disclosure is a federal offense.

Government Relations Office
Classified Communications Division`,
      time: '6 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 100,
      expirationTime: '48 hours',
      passwordProtected: true,
      attachments: [
        { id: '8', name: 'CLASSIFIED_Regulatory_Framework.pdf', size: '8.9 MB', type: 'document', isEncrypted: true },
        { id: '9', name: 'Compliance_Requirements_Matrix.xlsx', size: '3.1 MB', type: 'spreadsheet', isEncrypted: true }
      ]
    },
    {
      id: '6',
      sender: 'Investigative Journalist',
      senderEmail: 'source@encrypted.news',
      subject: 'Confidential Source Material - Data Breach Investigation',
      preview: 'I have obtained confidential documents related to the recent data breach that require secure transmission...',
      content: `CONFIDENTIAL SOURCE COMMUNICATION

Dear Editor,

I have obtained confidential documents related to the recent data breach at MegaCorp that require secure transmission and handling.

Investigation Summary:
• Data breach affected 2.3 million customers
• Personal information compromised includes SSNs, addresses, financial data
• Company knew about vulnerability for 6 months before breach
• Internal emails show deliberate delay in security patches
• Cover-up attempts documented in executive communications

Source Protection:
This information comes from a high-level insider who requires complete anonymity. Any disclosure of source identity could result in severe retaliation and legal consequences.

Evidence Package Includes:
• Internal email communications (45 documents)
• Security audit reports (suppressed findings)
• Executive meeting transcripts
• Financial impact assessments
• Customer notification delays documentation

Legal Considerations:
• Public interest justification for disclosure
• Whistleblower protection laws apply
• Corporate liability exposure significant
• Regulatory violations documented
�� Class action lawsuit implications

Publication Timeline:
• Fact verification: 48-72 hours
• Legal review: 24 hours
• Source protection measures: Ongoing
• Publication date: January 18, 2024

Security Measures:
All communications regarding this story must use encrypted channels. Physical meetings should be conducted in secure locations with counter-surveillance measures.

This encrypted message will auto-expire in 24 hours to protect source confidentiality.

Investigative Team
Secure News Network`,
      time: '8 hours ago',
      date: '2024-01-15',
      isRead: true,
      isStarred: false,
      isFlagged: false,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 98,
      expirationTime: '24 hours',
      passwordProtected: true,
      attachments: [
        { id: '10', name: 'Breach_Investigation_Evidence.zip', size: '47.3 MB', type: 'archive', isEncrypted: true },
        { id: '11', name: 'Source_Protection_Protocol.pdf', size: '1.1 MB', type: 'document', isEncrypted: true }
      ]
    },
    {
      id: '7',
      sender: 'Medical Research Team',
      senderEmail: 'research@medical.secure',
      subject: 'HIPAA Protected - Clinical Trial Results Confidential',
      preview: 'This communication contains HIPAA-protected clinical trial data that requires the highest level of confidentiality...',
      content: `HIPAA PROTECTED HEALTH INFORMATION - CONFIDENTIAL

Clinical Trial: Phase III Drug Efficacy Study
Protocol Number: CT-2024-001
Classification: Highly Confidential
HIPAA Compliance: Fully Protected

Dear Research Committee,

This communication contains protected health information (PHI) from our Phase III clinical trial that must be handled according to strict HIPAA guidelines.

Trial Results Summary:
• Participants: 2,847 patients (anonymized)
• Primary endpoint: 73% efficacy rate
• Secondary endpoints: All met or exceeded
• Adverse events: 12% (within acceptable range)
• Statistical significance: p<0.001

Key Findings:
• Drug shows superior efficacy vs. placebo
• Safety profile acceptable for target population
• No unexpected adverse reactions
• Quality of life improvements documented
• Long-term benefits sustained over 12 months

Regulatory Submission:
• FDA submission package: 95% complete
• European EMA filing: Scheduled for February
• Additional markets: Under consideration
• Patent protection: Secured through 2035
• Commercial launch: Projected Q4 2024

Data Protection Measures:
• All patient data fully de-identified
• Encryption: AES-256 military grade
• Access controls: Role-based permissions
• Audit trails: Complete and monitored
• Backup systems: Geographically distributed

Confidentiality Requirements:
1. Information is proprietary and confidential
2. HIPAA compliance mandatory for all personnel
3. No disclosure without written authorization
4. Secure handling and storage required
5. Breach notification procedures in place

Commercial Implications:
• Market potential: $2.8 billion annually
• Competitive advantage: 3-5 year lead
• Stock price impact: Potentially significant
• Partnership opportunities: Multiple inquiries
• Manufacturing scale-up: Already initiated

This encrypted communication will auto-expire in 7 days to ensure data protection compliance.

Medical Research Team
Confidential Clinical Data Division`,
      time: '12 hours ago',
      date: '2024-01-14',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'zero-access',
      securityScore: 100,
      expirationTime: '7 days',
      passwordProtected: true,
      attachments: [
        { id: '12', name: 'Clinical_Trial_Results_HIPAA.pdf', size: '12.4 MB', type: 'document', isEncrypted: true },
        { id: '13', name: 'Statistical_Analysis_Report.xlsx', size: '5.7 MB', type: 'spreadsheet', isEncrypted: true }
      ]
    },
    {
      id: '8',
      sender: 'Intelligence Agency',
      senderEmail: 'classified@intelligence.gov',
      subject: 'TOP SECRET: Cybersecurity Threat Assessment - Immediate Action Required',
      preview: 'This top secret communication contains critical cybersecurity intelligence requiring immediate executive attention...',
      content: `TOP SECRET - EYES ONLY

Classification: TOP SECRET//SCI
Handling: ORCON/NOFORN
Clearance: TS/SCI Required

CYBERSECURITY THREAT ASSESSMENT - CRITICAL

Dear Cleared Personnel,

This communication contains top secret intelligence regarding imminent cybersecurity threats to critical infrastructure.

Threat Assessment:
• Threat Level: CRITICAL (Level 5)
• Actor: Advanced Persistent Threat (APT-47)
• Target: Financial and energy sectors
• Timeline: Attack imminent (24-48 hours)
• Capability: Nation-state level resources

Attack Vectors:
1. Spear-phishing campaigns targeting executives
2. Supply chain compromise of software vendors
3. Zero-day exploits in common enterprise software
4. Social engineering of privileged users
5. Physical infiltration of data centers

Indicators of Compromise:
• Unusual network traffic patterns
• Unauthorized privilege escalations
• Suspicious email attachments
• Anomalous system behaviors
• Unexpected data exfiltration attempts

Immediate Actions Required:
1. Activate incident response teams (within 2 hours)
2. Implement enhanced monitoring (immediately)
3. Restrict administrative access (within 1 hour)
4. Notify law enforcement liaisons (within 4 hours)
5. Prepare business continuity plans (within 6 hours)

Defensive Measures:
• Enable maximum security protocols
• Isolate critical systems if necessary
• Monitor all external communications
• Verify all software updates before installation
• Conduct emergency security briefings

Intelligence Sources:
This information comes from multiple classified sources and methods. Disclosure could compromise ongoing operations and endanger assets.

Coordination:
• FBI Cyber Division: Notified
• DHS CISA: Coordinating response
• NSA: Providing technical support
• Private sector: Selected partners briefed

This message is protected with quantum-resistant encryption and will auto-expire in 12 hours for operational security.

Intelligence Operations Center
Classified Cyber Threat Division`,
      time: '2 hours ago',
      date: '2024-01-15',
      isRead: false,
      isStarred: true,
      isFlagged: true,
      hasAttachments: true,
      priority: 'high',
      folder: 'inbox',
      isEncrypted: true,
      encryptionLevel: 'end-to-end',
      securityScore: 100,
      expirationTime: '12 hours',
      passwordProtected: true,
      attachments: [
        { id: '14', name: 'TOP_SECRET_Threat_Assessment.pdf', size: '18.9 MB', type: 'document', isEncrypted: true },
        { id: '15', name: 'IOC_Technical_Indicators.json', size: '2.8 MB', type: 'data', isEncrypted: true }
      ]
    }
  ];

  // Enhanced Proton Mail stats with security focus
  const protonStats: ServiceStat[] = [
    { 
      name: 'Encrypted Emails', 
      value: '1,247', 
      total: '1,250',
      percentage: 99.8,
      icon: Shield,
      color: 'bg-purple-600',
      iconColor: 'text-white',
      trend: '100% encryption rate'
    },
    { 
      name: 'Security Score', 
      value: '98%', 
      total: '100%',
      percentage: 98,
      icon: ShieldCheck,
      color: 'bg-green-600',
      iconColor: 'text-white',
      trend: 'Excellent security'
    },
    { 
      name: 'Storage Used', 
      value: '2.1 GB', 
      total: '500 GB',
      percentage: 0.4,
      icon: Database,
      color: 'bg-blue-600',
      iconColor: 'text-white',
      trend: 'Encrypted storage'
    },
    { 
      name: 'Threat Blocks', 
      value: '156', 
      total: '200',
      percentage: 78,
      icon: AlertTriangle,
      color: 'bg-red-600',
      iconColor: 'text-white',
      trend: '23 blocked today'
    },
  ];

  // Enhanced security features
  const securityFeatures = [
    {
      id: '1',
      name: 'End-to-End Encryption',
      description: 'All emails encrypted with zero-access encryption',
      status: 'active',
      icon: Lock,
      color: 'bg-green-500',
      lastCheck: '2 minutes ago',
      details: 'AES-256 encryption with RSA-4096 key exchange'
    },
    {
      id: '2',
      name: 'Two-Factor Authentication',
      description: 'Additional security layer for account access',
      status: 'active',
      icon: Smartphone,
      color: 'bg-blue-500',
      lastCheck: '1 hour ago',
      details: 'TOTP and hardware key support enabled'
    },
    {
      id: '3',
      name: 'ProtonVPN Integration',
      description: 'Secure internet connection with ProtonVPN',
      status: 'active',
      icon: Wifi,
      color: 'bg-purple-500',
      lastCheck: '5 minutes ago',
      details: 'Connected to secure server in Switzerland'
    },
    {
      id: '4',
      name: 'Password Manager',
      description: 'Secure password storage with Proton Pass',
      status: 'inactive',
      icon: Key,
      color: 'bg-orange-500',
      lastCheck: 'Never',
      details: 'Available for activation'
    },
    {
      id: '5',
      name: 'Threat Detection',
      description: 'Advanced threat detection and blocking',
      status: 'active',
      icon: AlertTriangle,
      color: 'bg-red-500',
      lastCheck: '30 seconds ago',
      details: '23 threats blocked today'
    },
    {
      id: '6',
      name: 'Secure File Storage',
      description: 'Encrypted file storage with ProtonDrive',
      status: 'warning',
      icon: Database,
      color: 'bg-yellow-500',
      lastCheck: '1 day ago',
      details: 'Storage 85% full - upgrade recommended'
    }
  ];

  // Service tabs
  const serviceTabs: ServiceTab[] = [
    {
      id: 'mail',
      label: 'Mail',
      icon: Mail,
      content: null // Will be handled by the layout component
    },
    {
      id: 'drive',
      label: 'Drive',
      icon: Shield,
      content: (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ProtonDrive - Encrypted Storage</h3>
          <p className="text-gray-600 mb-4">Access your encrypted file storage</p>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Open ProtonDrive
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">ProtonCalendar</h3>
          <p className="text-gray-600 mb-4">End-to-end encrypted calendar for secure scheduling</p>
          <div className="flex justify-center space-x-3">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline">
              <Lock className="w-4 h-4 mr-2" />
              New Encrypted Event
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
              Security & Privacy Dashboard
            </h3>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
          </div>

          {/* Security Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Overall Security Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl font-bold text-green-600">98%</div>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>End-to-end encryption active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Two-factor authentication enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>VPN protection active</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span>Password manager available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map((feature) => {
              const FeatureIcon = feature.icon;
              const statusColors = {
                active: 'border-green-200 bg-green-50',
                inactive: 'border-gray-200 bg-gray-50',
                warning: 'border-yellow-200 bg-yellow-50'
              };
              
              return (
                <div
                  key={feature.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${statusColors[feature.status as keyof typeof statusColors]}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center text-white`}>
                        <FeatureIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.name}</h4>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                    <Badge variant={feature.status === 'active' ? 'default' : feature.status === 'warning' ? 'secondary' : 'outline'}>
                      {feature.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Last Check:</span>
                      <span className="font-medium">{feature.lastCheck}</span>
                    </div>
                    <p className="text-xs">{feature.details}</p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="ghost">
                      {feature.status === 'active' ? 'Configure' : 'Enable'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Threat Protection Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Threat Protection Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">23</div>
                  <div className="text-sm text-red-700">Threats Blocked Today</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">156</div>
                  <div className="text-sm text-yellow-700">Phishing Attempts Blocked</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                  <div className="text-sm text-green-700">Successful Breaches</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    { value: 'encrypted', label: 'Encrypted', icon: '🔒' },
    { value: 'expiring', label: 'Expiring', icon: '⏰' },
    { value: 'sent', label: 'Sent', icon: '📤' },
    { value: 'drafts', label: 'Drafts', icon: '📝' },
    { value: 'all', label: 'All Mail', icon: '📁' }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'sender', label: 'Sender', icon: '👤' },
    { value: 'subject', label: 'Subject', icon: '📋' },
    { value: 'security', label: 'Security', icon: '🛡️' }
  ];

  // Additional filters for Proton (Security)
  const additionalFilters = (
    <Select value={securityFilter} onValueChange={setSecurityFilter}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Security" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Security</SelectItem>
        <SelectItem value="high-security">🛡️ High Security</SelectItem>
        <SelectItem value="password-protected">🔐 Password Protected</SelectItem>
        <SelectItem value="expiring">⏰ Expiring</SelectItem>
        <SelectItem value="end-to-end">🔒 End-to-End</SelectItem>
      </SelectContent>
    </Select>
  );

  // Custom bulk actions for Proton
  const bulkActions = [
    {
      id: 'archive',
      label: 'Archive',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Archive emails:', emailIds)
    },
    {
      id: 'delete',
      label: 'Secure Delete',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Secure delete emails:', emailIds)
    },
    {
      id: 'star',
      label: 'Star',
      icon: Mail,
      action: (emailIds: string[]) => console.log('Star emails:', emailIds)
    },
    {
      id: 'encrypt',
      label: 'Re-encrypt',
      icon: Lock,
      action: (emailIds: string[]) => console.log('Re-encrypt emails:', emailIds)
    }
  ];

  // Status banner for security
  const statusBanner = (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">Maximum Security Active</span>
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
            98% Security Score
          </Badge>
        </div>
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Security Dashboard
        </Button>
      </div>
    </div>
  );

  // Custom security options for compose
  const securityOptions = (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Security Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Switch id="encryption" defaultChecked />
          <Label htmlFor="encryption" className="text-sm flex items-center">
            <Lock className="w-4 h-4 mr-2 text-green-600" />
            End-to-end encryption (Recommended)
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
          <Switch id="password" />
          <Label htmlFor="password" className="text-sm flex items-center">
            <Key className="w-4 h-4 mr-2 text-yellow-600" />
            Password protection for non-ProtonMail recipients
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
          <Switch id="expiration" />
          <Label htmlFor="expiration" className="text-sm flex items-center">
            <Clock className="w-4 h-4 mr-2 text-orange-600" />
            Set expiration time
          </Label>
        </div>
      </CardContent>
    </Card>
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
    const emailIndex = protonEmails.findIndex(e => e.id === email.id);
    if (emailIndex !== -1) {
      protonEmails[emailIndex].isRead = true;
    }
  }, []);

  const handleCompose = useCallback(() => {
    setIsComposeDialogOpen(true);
  }, []);

  const handleSendEmail = useCallback((data: ComposeData) => {
    console.log('Sending encrypted email:', data);
    // Implement actual email sending logic here
  }, []);

  const handleSaveDraft = useCallback((data: ComposeData) => {
    console.log('Saving encrypted draft:', data);
    // Implement draft saving logic here
  }, []);

  return (
    <>
      <EmailServiceLayout
        serviceName="ProtonMail Security Suite"
        serviceIcon={Shield}
        serviceColor="text-purple-600"
        serviceType="proton"
        isConnected={isConnected}
        onConnectionToggle={() => setIsConnected(!isConnected)}
        connectionMessage={
          isConnected 
            ? 'Maximum security active • Zero-access encryption enabled' 
            : 'Connect your ProtonMail account for maximum privacy and security'
        }
        emails={protonEmails}
        stats={protonStats}
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
        searchPlaceholder="Search encrypted emails..."
        headerActions={
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Privacy Settings
          </Button>
        }
      />

      <ComposeDialog
        isOpen={isComposeDialogOpen}
        onClose={() => setIsComposeDialogOpen(false)}
        onSend={handleSendEmail}
        onSaveDraft={handleSaveDraft}
        serviceName="ProtonMail"
        serviceIcon={Shield}
        serviceColor="text-purple-600"
        serviceType="proton"
        title="Compose Secure Email - ProtonMail"
        description="Send end-to-end encrypted emails with advanced security features"
        securityOptions={securityOptions}
        placeholder="Your message will be encrypted end-to-end..."
      />
    </>
  );
};

export default ProtonMailService;