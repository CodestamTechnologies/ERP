export interface AIMetric {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  description: string;
}

export interface AIInsight {
  id: number;
  type: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  icon: React.ReactNode;
  recommendation: string;
  timeframe: string;
  status: 'urgent' | 'active' | 'monitoring' | 'opportunity';
  createdAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  status: 'active' | 'training';
  lastTrained: string;
  predictions: number;
}

export interface AIReport {
  id: string;
  title: string;
  description: string;
  type: 'automated' | 'on-demand';
  frequency: string;
  lastGenerated: string;
  size: string;
  insights: number;
  status: 'ready' | 'generating';
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface AIAction {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}