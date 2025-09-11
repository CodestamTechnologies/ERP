'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash, CheckCircle } from 'lucide-react';

interface DraftsDialogProps {
  open: boolean;
  onClose: () => void;
  onLoad: (draftId: string) => void;
  onDelete: (draftId: string) => void;
}

export const DraftsDialog = ({ open, onClose, onLoad, onDelete }: DraftsDialogProps) => {
  const [drafts, setDrafts] = useState<{ id: string; name: string }[]>(() => {
    // Load drafts from localStorage
    const saved = localStorage.getItem('loiDrafts');
    return saved ? JSON.parse(saved) : [];
  });

  const handleDelete = (id: string) => {
    onDelete(id);
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem('loiDrafts', JSON.stringify(updated));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Drafts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {drafts.length === 0 && <p className="text-gray-500">No drafts found</p>}
          {drafts.map(draft => (
            <div key={draft.id} className="flex justify-between items-center border p-2 rounded">
              <span>{draft.name || 'Untitled Draft'}</span>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => onLoad(draft.id)}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Load
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(draft.id)}>
                  <Trash className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
