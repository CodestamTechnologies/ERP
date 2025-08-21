export interface CustomerStat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

export interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar: string | null;
  tags: string[];
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  customer: string;
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
  color: string;
}