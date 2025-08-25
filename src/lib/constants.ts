// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Auth Routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // HR Routes
  HR: '/hr',
  HR_EMPLOYEES: '/hr/employees',
  HR_PAYROLL: '/hr/payroll',
  HR_ATTENDANCE: '/hr/attendance',
  
  // Finance Routes
  FINANCE: '/finance',
  FINANCE_INVOICES: '/finance/invoices',
  FINANCE_EXPENSES: '/finance/expenses',
  FINANCE_REPORTS: '/reports',
  
  // Sales Routes
  SALES: '/sales',
  SALES_LEADS: '/sales/leads',
  SALES_CUSTOMERS: '/customers',
  SALES_ORDERS: '/sales/orders',
  
  // Inventory Routes
  INVENTORY: '/inventory',
  INVENTORY_PRODUCTS: '/inventory/products',
  INVENTORY_STOCK: '/inventory/stock',
  INVENTORY_SUPPLIERS: '/suppliers',
  
  // Settings Routes
  SETTINGS: '/settings',
  SETTINGS_USERS: '/settings/users',
  SETTINGS_ROLES: '/settings/roles',
  SETTINGS_COMPANY: '/settings/company',
  SETTINGS_DOMAIN: '/settings/domain',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  SALES_REP: 'sales_rep',
  ACCOUNTANT: 'accountant',
  HR_MANAGER: 'hr_manager',
  INVENTORY_MANAGER: 'inventory_manager',
} as const;

// Status Options
export const STATUS_OPTIONS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
  ONLINE: 'online',
} as const;

// Order Status
export const ORDER_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

// Lead Status
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  WON: 'won',
  LOST: 'lost',
} as const;

// Lead Sources
export const LEAD_SOURCES = {
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL_MEDIA: 'social_media',
  ADVERTISEMENT: 'advertisement',
  COLD_CALL: 'cold_call',
  OTHER: 'other',
} as const;

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated',
} as const;

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
  HOLIDAY: 'holiday',
} as const;

// Leave Types
export const LEAVE_TYPES = {
  SICK: 'sick',
  VACATION: 'vacation',
  PERSONAL: 'personal',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
} as const;

// Expense Categories
export const EXPENSE_CATEGORIES = {
  OFFICE_SUPPLIES: 'office_supplies',
  TRAVEL: 'travel',
  MEALS: 'meals',
  UTILITIES: 'utilities',
  RENT: 'rent',
  MARKETING: 'marketing',
  EQUIPMENT: 'equipment',
  SOFTWARE: 'software',
  TRAINING: 'training',
  OTHER: 'other',
} as const;

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

// Stock Movement Types
export const STOCK_MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
} as const;

// Stock Movement Reasons
export const STOCK_MOVEMENT_REASONS = {
  PURCHASE: 'purchase',
  SALE: 'sale',
  RETURN: 'return',
  DAMAGE: 'damage',
  THEFT: 'theft',
  ADJUSTMENT: 'adjustment',
  TRANSFER: 'transfer',
} as const;

// Location Types
export const LOCATION_TYPES = {
  WAREHOUSE: 'warehouse',
  STORE: 'store',
  VIRTUAL: 'virtual',
} as const;

// Customer Types
export const CUSTOMER_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
} as const;

// Report Types
export const REPORT_TYPES = {
  PROFIT_LOSS: 'profit_loss',
  BALANCE_SHEET: 'balance_sheet',
  CASH_FLOW: 'cash_flow',
  BUDGET_VS_ACTUAL: 'budget_vs_actual',
  STOCK_LEVELS: 'stock_levels',
  LOW_STOCK: 'low_stock',
  STOCK_MOVEMENTS: 'stock_movements',
  VALUATION: 'valuation',
  ABC_ANALYSIS: 'abc_analysis',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
} as const;

// Currency Formats
export const CURRENCY_FORMATS = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  JPY: { symbol: '¥', code: 'JPY', locale: 'ja-JP' },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Theme Options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
} as const;