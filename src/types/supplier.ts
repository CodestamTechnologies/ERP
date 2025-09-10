export interface SupplierStat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

export interface SupplierCategory {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  totalOrders: number;
  totalPaid: number;
  pendingAmount: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number;
  joinDate: string;
  paymentTerms: string;
  tags: string[];
  // New fields as requested
  company: string;
  number: string;
  capacity: string;
  activeHours: string;
  market: string;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  supplier: string;
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
  color: string;
}