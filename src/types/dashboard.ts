export interface StatItem {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon?: React.ReactNode;
  date:string
}

export interface ActivityItem {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
   date:string
}

export interface AIInsight {
  title: string;
  description: string;
  confidence: number;
  type: 'positive' | 'warning' | 'negative';
   date:string
}

export interface InventoryStatus {
  label: string;
  count: number;
  color: string;
   date:string
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
  description?: string;
   date:string
}