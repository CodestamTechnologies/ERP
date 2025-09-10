import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Eye, Trash2, Edit, Calendar, AlertTriangle } from 'lucide-react';
import { DocumentDraft } from '@/types/documents';
import { motion } from 'framer-motion';

interface DocumentDraftsDialogProps {
  drafts: DocumentDraft[];
  isLoading: boolean;
  onLoad: (draftId: string) => void;
  onDelete: (draftId: string) => void;
  onClearAll: () => void;
  documentType: 'loi' | 'mou' | 'partnership' | 'quotation' | 'purchase-order' | 'sales-order' | 'invoice' | 'service-agreement' | 'employment-contract' | 'vendor-agreement';
}

export const DocumentDraftsDialog = ({
  drafts,
  isLoading,
  onLoad,
  onDelete,
  onClearAll,
  documentType
}: DocumentDraftsDialogProps) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentTypeLabel = () => {
    switch (documentType) {
      case 'loi': return 'Letter of Intent';
      case 'mou': return 'Memorandum of Understanding';
      case 'partnership': return 'Partnership Agreement';
      case 'quotation': return 'Quotation';
      case 'purchase-order': return 'Purchase Order';
      case 'sales-order': return 'Sales Order';
      case 'invoice': return 'Invoice';
      case 'service-agreement': return 'Service Agreement';
      case 'employment-contract': return 'Employment Contract';
      case 'vendor-agreement': return 'Vendor Agreement';
      default: return 'Document';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handleLoad = (draft: DocumentDraft) => {
    onLoad(draft.id);
    setOpen(false);
  };

  const handleDelete = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this draft?')) {
      onDelete(draftId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all drafts? This action cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Drafts ({drafts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-600" />
            {getDocumentTypeLabel()} Drafts
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {drafts.length} saved draft{drafts.length !== 1 ? 's' : ''}
          </p>
          {drafts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Edit className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Drafts Saved</h3>
              <p className="text-gray-500 max-w-sm">
                Save your work as drafts to continue editing later. Your drafts will be stored locally in your browser.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft, index) => (
                <motion.div
                  key={draft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {draft.title}
                            </h3>
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Draft
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Created: {formatDate(draft.createdAt)}
                            </div>
                            {draft.updatedAt !== draft.createdAt && (
                              <div className="flex items-center">
                                <Edit className="w-4 h-4 mr-1" />
                                Updated: {getTimeAgo(draft.updatedAt)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FileText className="w-4 h-4 mr-1" />
                            {getDocumentTypeLabel()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoad(draft)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(draft.id, e)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {drafts.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Loading a draft will replace your current work
            </div>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};