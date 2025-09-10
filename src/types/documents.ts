export interface DocumentDraft {
  id: string;
  title: string;
  type: 'loi' | 'mou' | 'partnership' | 'service-agreement' | 'employment-contract' | 'vendor-agreement' | 'quotation' | 'purchase-order' | 'sales-order' | 'invoice';
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed';
}

export interface DocumentHistory {
  id: string;
  title: string;
  type: 'loi' | 'mou' | 'partnership' | 'service-agreement' | 'employment-contract' | 'vendor-agreement' | 'quotation' | 'purchase-order' | 'sales-order' | 'invoice';
  data: Record<string, unknown>;
  createdAt: string;
  status: 'completed';
  version: number;
}

export interface DocumentAction {
  type: 'save_draft' | 'save_history' | 'load_draft' | 'delete_draft' | 'delete_history';
  payload: Record<string, unknown>;
}