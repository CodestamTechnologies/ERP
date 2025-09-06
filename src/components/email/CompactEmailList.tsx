'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Star,
  Paperclip,
  Reply,
  Archive,
  Trash2,
  Clock,
  AlertCircle,
  Shield,
  Key,
  Flag,
  Users
} from 'lucide-react';

// Generic email interface that all services can use
interface BaseEmail {
  id: string;
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  content: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isFlagged?: boolean;
  hasAttachments: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  labels?: string[];
  tags?: string[];
  // Security-specific fields (for Proton)
  isEncrypted?: boolean;
  encryptionLevel?: string;
  securityScore?: number;
  passwordProtected?: boolean;
  expirationTime?: string;
  // CRM-specific fields (for Zoho)
  crmContact?: {
    id: string;
    name: string;
    company: string;
    dealValue?: string;
  };
  // Microsoft-specific fields
  importance?: 'high' | 'normal' | 'low';
  sensitivity?: 'normal' | 'confidential' | 'private';
  // Service-specific fields
  [key: string]: unknown;
}

interface CompactEmailListProps {
  emails: BaseEmail[];
  selectedEmails: string[];
  onEmailSelect: (emailId: string) => void;
  onEmailClick: (email: BaseEmail) => void;
  onEmailAction: (action: string, emailIds: string[]) => void;
  serviceType?: 'google' | 'microsoft' | 'zoho' | 'proton';
  className?: string;
}

const CompactEmailList = ({
  emails,
  selectedEmails,
  onEmailSelect,
  onEmailClick,
  onEmailAction,
  serviceType = 'google',
  className = ''
}: CompactEmailListProps) => {

  const getServiceColors = () => {
    switch (serviceType) {
      case 'google': return { unread: 'bg-blue-50/50', selected: 'bg-blue-100', hover: 'hover:bg-blue-25' };
      case 'microsoft': return { unread: 'bg-blue-50/50', selected: 'bg-blue-100', hover: 'hover:bg-blue-25' };
      case 'zoho': return { unread: 'bg-orange-50/50', selected: 'bg-orange-100', hover: 'hover:bg-orange-25' };
      case 'proton': return { unread: 'bg-purple-50/50', selected: 'bg-purple-100', hover: 'hover:bg-purple-25' };
      default: return { unread: 'bg-gray-50/50', selected: 'bg-gray-100', hover: 'hover:bg-gray-25' };
    }
  };

  const colors = getServiceColors();

  const renderServiceSpecificBadges = (email: BaseEmail) => {
    const badges = [];

    // Priority indicator (dot for high priority)
    if (email.priority === 'high') {
      badges.push(
        <div key="priority" className="w-2 h-2 bg-red-500 rounded-full" title="High Priority" />
      );
    }

    // Attachments
    if (email.hasAttachments) {
      badges.push(
        <div key="attachment" title="Has Attachments">
          <Paperclip className="h-3 w-3 text-gray-400" />
        </div>
      );
    }

    // Service-specific badges
    switch (serviceType) {
      case 'proton':
        if (email.isEncrypted) {
          badges.push(
            <div key="encrypted" title="Encrypted">
              <Shield className="h-3 w-3 text-green-600" />
            </div>
          );
        }
        if (email.passwordProtected) {
          badges.push(
            <div key="password" title="Password Protected">
              <Key className="h-3 w-3 text-yellow-600" />
            </div>
          );
        }
        if (email.expirationTime) {
          badges.push(
            <div key="expiring" title={`Expires in ${email.expirationTime}`}>
              <Clock className="h-3 w-3 text-orange-600" />
            </div>
          );
        }
        break;

      case 'microsoft':
        if (email.importance === 'high') {
          badges.push(
            <div key="important" title="High Importance">
              <AlertCircle className="h-3 w-3 text-red-500" />
            </div>
          );
        }
        if (email.isFlagged) {
          badges.push(
            <div key="flagged" title="Flagged">
              <Flag className="h-3 w-3 text-red-400" />
            </div>
          );
        }
        break;

      case 'zoho':
        if (email.crmContact) {
          badges.push(
            <div key="crm" title={`CRM: ${email.crmContact.company}`}>
              <Users className="h-3 w-3 text-blue-600" />
            </div>
          );
        }
        break;
    }

    // Labels/Tags (show only first one to save space)
    const labelList = email.labels || email.tags || [];
    if (labelList.length > 0) {
      badges.push(
        <Badge key="label" variant="outline" className="text-xs px-1 py-0 max-w-16 truncate">
          {labelList[0]}
        </Badge>
      );
    }

    return badges;
  };

  const renderServiceSpecificInfo = (email: BaseEmail) => {
    switch (serviceType) {
      case 'proton':
        if (email.securityScore) {
          return (
            <div className="flex items-center gap-1 text-xs">
              <Shield className={`h-3 w-3 ${email.securityScore >= 95 ? 'text-green-600' : email.securityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}`} />
              <span className={email.securityScore >= 95 ? 'text-green-600' : email.securityScore >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                {email.securityScore}%
              </span>
            </div>
          );
        }
        break;

      case 'zoho':
        if (email.crmContact?.dealValue) {
          return (
            <div className="text-xs text-green-600 font-medium">
              {email.crmContact.dealValue}
            </div>
          );
        }
        break;
    }
    return null;
  };

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-gray-400 mx-auto mb-4">📧</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {emails.map((email, index) => (
        <motion.div
          key={email.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.01 }}
          className={`group flex items-center gap-3 py-2 px-3 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0 ${
            !email.isRead ? colors.unread : 'bg-white'
          } ${selectedEmails.includes(email.id) ? colors.selected : ''}`}
          onClick={() => onEmailClick(email)}
        >
          {/* Checkbox */}
          <Checkbox
            checked={selectedEmails.includes(email.id)}
            onCheckedChange={() => onEmailSelect(email.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
          />
          
          {/* Star */}
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onEmailAction('star', [email.id]);
            }}
            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Star className={`h-4 w-4 ${email.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          </button>
          
          {/* Sender */}
          <div className="w-44 flex-shrink-0">
            <span className={`text-sm truncate block ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {email.sender}
            </span>
          </div>
          
          {/* Subject and Preview */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {email.subject}
              </span>
              <span className="text-sm text-gray-500 truncate">
                - {email.preview}
              </span>
            </div>
          </div>
          
          {/* Service-specific info */}
          <div className="flex-shrink-0">
            {renderServiceSpecificInfo(email)}
          </div>
          
          {/* Badges and Indicators */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {renderServiceSpecificBadges(email)}
          </div>
          
          {/* Time */}
          <div className="w-20 flex-shrink-0 text-right">
            <span className="text-xs text-gray-500">{email.time}</span>
          </div>
          
          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 flex-shrink-0">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onEmailAction('reply', [email.id]); 
              }}
              title="Reply"
            >
              <Reply className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onEmailAction('archive', [email.id]); 
              }}
              title="Archive"
            >
              <Archive className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onEmailAction('delete', [email.id]); 
              }}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CompactEmailList;