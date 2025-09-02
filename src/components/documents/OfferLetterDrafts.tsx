'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { OfferLetterHistory as OfferLetterHistoryType, OfferLetterData } from '@/types/offerLetter';
import { 
  FileText, 
  Calendar, 
  User, 
  Building, 
  Search, 
  Edit, 
  Trash2,
  Clock,
  Plus,
  FolderOpen
} from 'lucide-react';

interface OfferLetterDraftsProps {
  drafts: OfferLetterHistoryType[];
  onLoadDraft: (data: OfferLetterData) => void;
  onDeleteDraft: (id: string) => void;
  onCreateNew: () => void;
}

const OfferLetterDrafts: React.FC<OfferLetterDraftsProps> = ({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const filteredDrafts = drafts.filter(draft => 
    draft.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDeleteDraft(itemToDelete);
      setItemToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-blue-600" />
            Draft Offer Letters
          </h2>
          <p className="text-gray-600">Continue working on your saved drafts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {drafts.length} Drafts
          </Badge>
          <Button onClick={onCreateNew} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Offer Letter
          </Button>
        </div>
      </div>

      {/* Search */}
      {drafts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search drafts by candidate name, job title, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drafts List */}
      {filteredDrafts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching drafts found' : 'No drafts saved yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Start creating offer letters and save them as drafts to continue later'
                }
              </p>
              {!searchTerm && (
                <Button onClick={onCreateNew} className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Offer Letter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrafts.map((draft, index) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {draft.candidateName || 'Unnamed Candidate'}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building className="w-3 h-3 mr-1" />
                        {draft.department || 'No Department'}
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Draft
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {draft.jobTitle || 'No Job Title'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Position Details
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getTimeAgo(draft.createdAt)}
                      </div>
                      <div>
                        {formatDate(draft.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => onLoadDraft(draft.data)}
                        className="flex-1 flex items-center justify-center"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Continue Editing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(draft.id);
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Draft</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferLetterDrafts;