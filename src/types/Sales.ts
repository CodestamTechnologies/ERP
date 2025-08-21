export interface SalesStat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  target: string;
  progress: number;
}

export interface SalesChannel {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  growth: string;
  color: string;
}

export interface SalesOrder {
  id: string;
  customer: string;
  customerEmail: string;
  amount: number;
  items: number;
  status: string;
  priority: string;
  channel: string;
  date: string;
  dueDate: string;
  paymentStatus: string;
  salesRep: string;
  region: string;
  category: string;
  profit: number;
  discount: number;
  tax: number;
  shippingCost: number;
}

export interface SalesTeamMember {
  id: string;
  name: string;
  email: string;
  region: string;
  target: number;
  achieved: number;
  orders: number;
  conversion: number;
  rating: number;
  status: string;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  priority: string;
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
  color: string;
}