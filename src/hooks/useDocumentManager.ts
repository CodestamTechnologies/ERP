import { useState, useEffect, useMemo } from 'react';
import { DocumentDraft, DocumentHistory } from '@/types/documents';

export const useDocumentManager = <T = Record<string, unknown>>(documentType: 'loi' | 'mou' | 'partnership' | 'quotation' | 'purchase-order' | 'sales-order' | 'invoice' | 'service-agreement' | 'employment-contract' | 'vendor-agreement') => {
  const [drafts, setDrafts] = useState<DocumentDraft[]>([]);
  const [history, setHistory] = useState<DocumentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const storageKeys = useMemo(() => ({
    drafts: `document_drafts_${documentType}`,
    history: `document_history_${documentType}`,
  }), [documentType]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedDrafts = localStorage.getItem(storageKeys.drafts);
      const savedHistory = localStorage.getItem(storageKeys.history);
      
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      }
      
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading document data:', error);
    }
  }, [storageKeys.drafts, storageKeys.history]);

  // Save drafts to localStorage
  const saveDraftsToStorage = (newDrafts: DocumentDraft[]) => {
    try {
      localStorage.setItem(storageKeys.drafts, JSON.stringify(newDrafts));
    } catch (error) {
      console.error('Error saving drafts:', error);
    }
  };

  // Save history to localStorage
  const saveHistoryToStorage = (newHistory: DocumentHistory[]) => {
    try {
      localStorage.setItem(storageKeys.history, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Generate unique ID
  const generateId = () => {
    return `${documentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate title from data
  const generateTitle = (data: Record<string, unknown>) => {
    switch (documentType) {
      case 'loi':
        return (data.loi as { subject?: string })?.subject || `LOI - ${new Date().toLocaleDateString()}`;
      case 'mou':
        return (data.mou as { title?: string })?.title || `MOU - ${new Date().toLocaleDateString()}`;
      case 'partnership':
        return (data.partnership as { partnershipName?: string })?.partnershipName || `Partnership Agreement - ${new Date().toLocaleDateString()}`;
      default:
        return `Document - ${new Date().toLocaleDateString()}`;
    }
  };

  // Save draft
  const saveDraft = async (data: Record<string, unknown>, title?: string) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const generatedTitle = title || generateTitle(data);
      
      const draft: DocumentDraft = {
        id: generateId(),
        title: generatedTitle,
        type: documentType,
        data,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
      };

      const newDrafts = [draft, ...drafts];
      setDrafts(newDrafts);
      saveDraftsToStorage(newDrafts);
      
      return { success: true, draft };
    } catch (error) {
      console.error('Error saving draft:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing draft
  const updateDraft = async (draftId: string, data: Record<string, unknown>, title?: string) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const generatedTitle = title || generateTitle(data);
      
      const newDrafts = drafts.map(draft => 
        draft.id === draftId 
          ? { ...draft, data, title: generatedTitle, updatedAt: now }
          : draft
      );
      
      setDrafts(newDrafts);
      saveDraftsToStorage(newDrafts);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating draft:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Save to history (completed document)
  const saveToHistory = async (data: Record<string, unknown>, title?: string) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const generatedTitle = title || generateTitle(data);
      
      // Get next version number
      const existingVersions = history.filter(h => h.title === generatedTitle);
      const version = existingVersions.length + 1;
      
      const historyItem: DocumentHistory = {
        id: generateId(),
        title: generatedTitle,
        type: documentType,
        data,
        createdAt: now,
        status: 'completed',
        version,
      };

      const newHistory = [historyItem, ...history];
      setHistory(newHistory);
      saveHistoryToStorage(newHistory);
      
      return { success: true, historyItem };
    } catch (error) {
      console.error('Error saving to history:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Load draft
  const loadDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    return draft || null;
  };

  // Load from history
  const loadFromHistory = (historyId: string) => {
    const historyItem = history.find(h => h.id === historyId);
    return historyItem || null;
  };

  // Delete draft
  const deleteDraft = async (draftId: string) => {
    setIsLoading(true);
    try {
      const newDrafts = drafts.filter(d => d.id !== draftId);
      setDrafts(newDrafts);
      saveDraftsToStorage(newDrafts);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting draft:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete from history
  const deleteFromHistory = async (historyId: string) => {
    setIsLoading(true);
    try {
      const newHistory = history.filter(h => h.id !== historyId);
      setHistory(newHistory);
      saveHistoryToStorage(newHistory);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting from history:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all drafts
  const clearAllDrafts = async () => {
    setIsLoading(true);
    try {
      setDrafts([]);
      localStorage.removeItem(storageKeys.drafts);
      return { success: true };
    } catch (error) {
      console.error('Error clearing drafts:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    setIsLoading(true);
    try {
      setHistory([]);
      localStorage.removeItem(storageKeys.history);
      return { success: true };
    } catch (error) {
      console.error('Error clearing history:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    drafts,
    history,
    isLoading,
    saveDraft,
    updateDraft,
    saveToHistory,
    loadDraft,
    loadFromHistory,
    deleteDraft,
    deleteFromHistory,
    clearAllDrafts,
    clearAllHistory,
  };
};