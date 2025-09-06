import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Eye, Trash2, Download, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { DocumentHistory } from '@/types/documents';
import { motion } from 'framer-motion';

interface DocumentHistoryDialogProps {
  history: DocumentHistory[];
  isLoading: boolean;
  onLoad: (historyId: string) => void;
  onDelete: (historyId: string) => void;
  onClearAll: () => void;
  documentType: 'loi' | 'mou' | 'partnership' | 'quotation' | 'purchase-order' | 'sales-order' | 'invoice' | 'service-agreement' | 'employment-contract' | 'vendor-agreement';
}

export const DocumentHistoryDialog = ({
  history,
  isLoading,
  onLoad,
  onDelete,
  onClearAll,
  documentType
}: DocumentHistoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<DocumentHistory | null>(null);

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

  const handleLoad = (historyItem: DocumentHistory) => {
    onLoad(historyItem.id);
    setOpen(false);
  };

  const handleDelete = (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document from history?')) {
      onDelete(historyId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all document history? This action cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <History className="w-4 h-4 mr-2" />
          History ({history.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            {getDocumentTypeLabel()} History
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {history.length} completed document{history.length !== 1 ? 's' : ''} in history
          </p>
          {history.length > 0 && (
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
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
              <p className="text-gray-500 max-w-sm">
                Completed documents will appear here. Generate and save your first document to build your history.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
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
                              {item.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              v{item.version}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-green-600">
                              Completed
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(item.createdAt)}
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {getDocumentTypeLabel()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLoad(item)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(item.id, e)}
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

        {history.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Loading a document will replace your current work
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