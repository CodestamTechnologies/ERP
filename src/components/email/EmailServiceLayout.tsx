'use client';

import { useState, useCallback, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


import { Checkbox } from '@/components/ui/checkbox';
import CompactEmailList from './CompactEmailList';
import { 
  Search, 
  Settings, 
  RefreshCw,
  FileText,
  Star,
  Paperclip,
  CheckCircle,
  XCircle,
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  SortAsc,
  SortDesc,
  Eye,
  Plus,
  X,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Generic interfaces that all services can use
export interface BaseEmail {
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
  attachments?: BaseAttachment[];
  // Service-specific fields
  [key: string]: unknown;
}

export interface BaseAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  [key: string]: unknown;
}

export interface ServiceStat {
  name: string;
  value: string;
  total?: string;
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
  trend: string;
}

export interface ServiceTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content: ReactNode;
}

export interface FolderOption {
  value: string;
  label: string;
  icon?: string;
}

export interface SortOption {
  value: string;
  label: string;
  icon?: string;
}

export interface EmailServiceLayoutProps {
  // Service configuration
  serviceName: string;
  serviceIcon: React.ComponentType<{ className?: string }>;
  serviceColor: string;
  serviceType: 'google' | 'microsoft' | 'zoho' | 'proton';
  
  // Connection status
  isConnected: boolean;
  onConnectionToggle: () => void;
  connectionMessage: string;
  
  // Data
  emails: BaseEmail[];
  stats: ServiceStat[];
  tabs: ServiceTab[];
  
  // Email management
  selectedEmails: string[];
  onEmailSelect: (emailId: string) => void;
  onEmailAction: (action: string, emailIds: string[]) => void;
  onEmailClick: (email: BaseEmail) => void;
  
  // Compose
  onCompose: () => void;
  
  // Filtering options
  folderOptions: FolderOption[];
  sortOptions: SortOption[];
  additionalFilters?: ReactNode;
  
  // Customization
  searchPlaceholder?: string;
  bulkActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: (emailIds: string[]) => void;
  }>;
  
  // Optional custom content
  headerActions?: ReactNode;
  statusBanner?: ReactNode;
  
  className?: string;
}

const EmailServiceLayout = ({
  serviceName,
  serviceIcon: ServiceIcon,
  serviceColor,
  serviceType,
  isConnected,
  onConnectionToggle,
  connectionMessage,
  emails,
  stats,
  tabs,
  selectedEmails,
  onEmailSelect,
  onEmailAction,
  onEmailClick,
  onCompose,
  folderOptions,
  sortOptions,
  additionalFilters,
  searchPlaceholder = "Search emails...",
  bulkActions,
  headerActions,
  statusBanner,
  className = ''
}: EmailServiceLayoutProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'mail');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEmail, setSelectedEmail] = useState<BaseEmail | null>(null);
  const [isEmailDetailOpen, setIsEmailDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(10);

  // Filter and sort emails
  const filteredEmails = useMemo(() => {
    let filtered = emails;

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(email => {
        switch (selectedFolder) {
          case 'inbox': return email.folder === 'inbox' || !email.folder;
          case 'unread': return !email.isRead;
          case 'starred': return email.isStarred;
          case 'flagged': return email.isFlagged;
          case 'sent': return email.folder === 'sent';
          case 'drafts': return email.folder === 'drafts';
          case 'spam': return email.folder === 'spam';
          case 'trash': return email.folder === 'trash';
          default: return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.category && email.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (email.labels && email.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (email.tags && email.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Sort emails
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'sender':
          comparison = a.sender.localeCompare(b.sender);
          break;
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'security':
          comparison = (Number(a.securityScore) || 0) - (Number(b.securityScore) || 0);
          break;
        case 'importance':
          const importanceOrder: Record<string, number> = { 'high': 3, 'normal': 2, 'low': 1 };
          comparison = importanceOrder[(a.importance as string) || 'normal'] - importanceOrder[(b.importance as string) || 'normal'];
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [emails, selectedFolder, searchTerm, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);
  const startIndex = (currentPage - 1) * emailsPerPage;
  const endIndex = startIndex + emailsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedFolder, searchTerm, sortBy, sortOrder]);

  // Email actions
  const handleSelectAll = useCallback(() => {
    const allSelected = selectedEmails.length === paginatedEmails.length && paginatedEmails.length > 0;
    const newSelection = allSelected ? [] : paginatedEmails.map(email => email.id);
    newSelection.forEach(emailId => onEmailSelect(emailId));
  }, [selectedEmails, paginatedEmails, onEmailSelect]);

  const handleEmailClick = useCallback((email: BaseEmail) => {
    setSelectedEmail(email);
    setIsEmailDetailOpen(true);
    onEmailClick(email);
  }, [onEmailClick]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceColors = () => {
    switch (serviceType) {
      case 'google': return { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', bulk: 'bg-blue-50 border-blue-200', text: 'text-blue-900' };
      case 'microsoft': return { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', bulk: 'bg-blue-50 border-blue-200', text: 'text-blue-900' };
      case 'zoho': return { gradient: 'from-orange-50 to-orange-100', border: 'border-orange-200', bulk: 'bg-orange-50 border-orange-200', text: 'text-orange-900' };
      case 'proton': return { gradient: 'from-purple-50 to-purple-100', border: 'border-purple-200', bulk: 'bg-purple-50 border-purple-200', text: 'text-purple-900' };
      default: return { gradient: 'from-gray-50 to-gray-100', border: 'border-gray-200', bulk: 'bg-gray-50 border-gray-200', text: 'text-gray-900' };
    }
  };

  const colors = getServiceColors();

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between px-2 py-3 border-t">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredEmails.length)} of {filteredEmails.length} emails
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderEmailContent = () => (
    <div className="space-y-4">
      {/* Email Controls */}
      <div className={`flex flex-col lg:flex-row gap-3 p-4 bg-gradient-to-r ${colors.gradient} rounded-lg`}>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {folderOptions.map(folder => (
                <SelectItem key={folder.value} value={folder.value}>
                  {folder.icon && folder.icon} {folder.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {additionalFilters}

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(sort => (
                <SelectItem key={sort.value} value={sort.value}>
                  {sort.icon && sort.icon} {sort.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      {statusBanner}

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 ${colors.bulk} rounded-lg`}
        >
          <span className={`text-sm font-medium ${colors.text}`}>
            {selectedEmails.length} email{selectedEmails.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-1 ml-auto">
            {bulkActions ? (
              bulkActions.map(action => (
                <Button 
                  key={action.id}
                  size="sm" 
                  variant="outline" 
                  onClick={() => action.action(selectedEmails)}
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                </Button>
              ))
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => onEmailAction('archive', selectedEmails)}>
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEmailAction('delete', selectedEmails)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEmailAction('star', selectedEmails)}>
                  <Star className="h-4 w-4 mr-1" />
                  Star
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => selectedEmails.forEach(id => onEmailSelect(id))}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Select All */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedEmails.length === paginatedEmails.length && paginatedEmails.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600">Select all on this page ({paginatedEmails.length})</span>
        </div>
        <div className="text-sm text-gray-500">
          {filteredEmails.filter(e => !e.isRead).length} unread • Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Compact Email List Component */}
      <CompactEmailList
        emails={paginatedEmails}
        selectedEmails={selectedEmails}
        onEmailSelect={onEmailSelect}
        onEmailClick={handleEmailClick}
        onEmailAction={onEmailAction}
        serviceType={serviceType}
      />

      {/* Pagination */}
      {renderPagination()}
    </div>
  );

  const renderTabContent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData?.id === 'mail' || !activeTabData) {
      return renderEmailContent();
    }
    return activeTabData.content;
  };

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      
      <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${colors.gradient} rounded-lg ${colors.border}`}>
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-medium text-gray-900 flex items-center">
              {isConnected ? <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> : <XCircle className="w-4 h-4 mr-2 text-red-600" />}
              {serviceName} {isConnected ? 'Connected' : 'Not Connected'}
            </h3>
            <p className="text-sm text-gray-600">{connectionMessage}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {headerActions}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            onClick={onConnectionToggle}
            variant={isConnected ? "outline" : "default"}
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isConnected ? 'Sync Now' : 'Connect'}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <span className="text-sm text-gray-500">{stat.percentage}%</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{stat.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="space-y-2">
                    <Progress value={stat.percentage} className="w-full h-2" />
                    <p className="text-xs text-gray-500">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ServiceIcon className={`w-5 h-5 ${serviceColor}`} />
                {serviceName}
              </CardTitle>
              <CardDescription>
                Professional email management and productivity suite
              </CardDescription>
            </div>
            <Button onClick={onCompose}>
              <Plus className="w-4 h-4 mr-2" />
              Compose Email
            </Button>
          </div>
          {tabs.length > 1 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className={`grid w-full ${
                tabs.length === 2 ? 'grid-cols-2' :
                tabs.length === 3 ? 'grid-cols-3' :
                tabs.length === 4 ? 'grid-cols-4' :
                tabs.length === 5 ? 'grid-cols-5' :
                'grid-cols-6'
              }`}>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Email Detail Dialog */}
      <Dialog open={isEmailDetailOpen} onOpenChange={setIsEmailDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmail && (
            <>
              <DialogHeader className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-2 flex items-center gap-2">
                      {selectedEmail.subject}
                      {/* Service-specific indicators can be added here */}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{selectedEmail.sender}</span>
                      {selectedEmail.senderEmail && <span>({selectedEmail.senderEmail})</span>}
                      <Badge className={getPriorityColor(selectedEmail.priority)}>
                        {selectedEmail.priority}
                      </Badge>
                      <span className="ml-auto">{selectedEmail.date} • {selectedEmail.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button size="sm" variant="outline" onClick={() => onEmailAction('reply', [selectedEmail.id])}>
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEmailAction('replyAll', [selectedEmail.id])}>
                      <ReplyAll className="h-4 w-4 mr-1" />
                      Reply All
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEmailAction('forward', [selectedEmail.id])}>
                      <Forward className="h-4 w-4 mr-1" />
                      Forward
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                {/* Labels/Tags */}
                {(selectedEmail.labels || selectedEmail.tags) && (
                  <div className="flex gap-1 mb-4">
                    {(selectedEmail.labels || selectedEmail.tags || []).map(label => (
                      <Badge key={label} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Email Content */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {selectedEmail.content}
                  </div>
                </div>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attachments ({selectedEmail.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center gap-2">
                            <FileText className={`h-4 w-4 ${serviceColor}`} />
                            <span className="font-medium">{attachment.name}</span>
                            <span className="text-sm text-gray-500">({attachment.size})</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailServiceLayout;