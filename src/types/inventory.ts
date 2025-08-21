export interface InventoryStat {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minStock: number;
  price: number;
  supplier: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image?: string;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  user: string;
}

export interface QuickAction {
  name: string;
  icon: React.ReactNode;
  color: string;
}