// Permissions Hook
import { useAuth } from './useAuth';

// Define permission constants
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // HR Permissions
  HR_VIEW: 'hr:view',
  HR_CREATE: 'hr:create',
  HR_UPDATE: 'hr:update',
  HR_DELETE: 'hr:delete',
  HR_EMPLOYEES_MANAGE: 'hr:employees:manage',
  HR_PAYROLL_MANAGE: 'hr:payroll:manage',
  HR_ATTENDANCE_MANAGE: 'hr:attendance:manage',
  
  // Finance Permissions
  FINANCE_VIEW: 'finance:view',
  FINANCE_CREATE: 'finance:create',
  FINANCE_UPDATE: 'finance:update',
  FINANCE_DELETE: 'finance:delete',
  FINANCE_INVOICES_MANAGE: 'finance:invoices:manage',
  FINANCE_EXPENSES_MANAGE: 'finance:expenses:manage',
  FINANCE_REPORTS_VIEW: 'finance:reports:view',
  
  // Sales Permissions
  SALES_VIEW: 'sales:view',
  SALES_CREATE: 'sales:create',
  SALES_UPDATE: 'sales:update',
  SALES_DELETE: 'sales:delete',
  SALES_LEADS_MANAGE: 'sales:leads:manage',
  SALES_CUSTOMERS_MANAGE: 'sales:customers:manage',
  SALES_ORDERS_MANAGE: 'sales:orders:manage',
  
  // Inventory Permissions
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_DELETE: 'inventory:delete',
  INVENTORY_PRODUCTS_MANAGE: 'inventory:products:manage',
  INVENTORY_STOCK_MANAGE: 'inventory:stock:manage',
  INVENTORY_SUPPLIERS_MANAGE: 'inventory:suppliers:manage',
  
  // Settings Permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_USERS_MANAGE: 'settings:users:manage',
  SETTINGS_ROLES_MANAGE: 'settings:roles:manage',
  SETTINGS_COMPANY_MANAGE: 'settings:company:manage',
} as const;

// Define role-based permissions
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_CREATE,
    PERMISSIONS.HR_UPDATE,
    PERMISSIONS.HR_EMPLOYEES_MANAGE,
    PERMISSIONS.HR_ATTENDANCE_MANAGE,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_CREATE,
    PERMISSIONS.FINANCE_UPDATE,
    PERMISSIONS.FINANCE_INVOICES_MANAGE,
    PERMISSIONS.FINANCE_EXPENSES_MANAGE,
    PERMISSIONS.FINANCE_REPORTS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_UPDATE,
    PERMISSIONS.SALES_LEADS_MANAGE,
    PERMISSIONS.SALES_CUSTOMERS_MANAGE,
    PERMISSIONS.SALES_ORDERS_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_PRODUCTS_MANAGE,
    PERMISSIONS.INVENTORY_STOCK_MANAGE,
    PERMISSIONS.INVENTORY_SUPPLIERS_MANAGE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  employee: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  sales_rep: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_UPDATE,
    PERMISSIONS.SALES_LEADS_MANAGE,
    PERMISSIONS.SALES_CUSTOMERS_MANAGE,
    PERMISSIONS.SALES_ORDERS_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  accountant: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_CREATE,
    PERMISSIONS.FINANCE_UPDATE,
    PERMISSIONS.FINANCE_INVOICES_MANAGE,
    PERMISSIONS.FINANCE_EXPENSES_MANAGE,
    PERMISSIONS.FINANCE_REPORTS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  hr_manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_CREATE,
    PERMISSIONS.HR_UPDATE,
    PERMISSIONS.HR_DELETE,
    PERMISSIONS.HR_EMPLOYEES_MANAGE,
    PERMISSIONS.HR_PAYROLL_MANAGE,
    PERMISSIONS.HR_ATTENDANCE_MANAGE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  inventory_manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.INVENTORY_PRODUCTS_MANAGE,
    PERMISSIONS.INVENTORY_STOCK_MANAGE,
    PERMISSIONS.INVENTORY_SUPPLIERS_MANAGE,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
};

export const usePermissions = () => {
  const { user, hasPermission, hasRole } = useAuth();

  // Check if user can access a specific module
  const canAccessModule = (module: string): boolean => {
    const modulePermissions = {
      dashboard: PERMISSIONS.DASHBOARD_VIEW,
      hr: PERMISSIONS.HR_VIEW,
      finance: PERMISSIONS.FINANCE_VIEW,
      sales: PERMISSIONS.SALES_VIEW,
      inventory: PERMISSIONS.INVENTORY_VIEW,
      settings: PERMISSIONS.SETTINGS_VIEW,
    };

    return hasPermission(modulePermissions[module as keyof typeof modulePermissions]);
  };

  // Check if user can perform CRUD operations
  const canCreate = (module: string): boolean => {
    const createPermissions = {
      hr: PERMISSIONS.HR_CREATE,
      finance: PERMISSIONS.FINANCE_CREATE,
      sales: PERMISSIONS.SALES_CREATE,
      inventory: PERMISSIONS.INVENTORY_CREATE,
    };

    return hasPermission(createPermissions[module as keyof typeof createPermissions]);
  };

  const canUpdate = (module: string): boolean => {
    const updatePermissions = {
      hr: PERMISSIONS.HR_UPDATE,
      finance: PERMISSIONS.FINANCE_UPDATE,
      sales: PERMISSIONS.SALES_UPDATE,
      inventory: PERMISSIONS.INVENTORY_UPDATE,
      settings: PERMISSIONS.SETTINGS_UPDATE,
    };

    return hasPermission(updatePermissions[module as keyof typeof updatePermissions]);
  };

  const canDelete = (module: string): boolean => {
    const deletePermissions = {
      hr: PERMISSIONS.HR_DELETE,
      finance: PERMISSIONS.FINANCE_DELETE,
      sales: PERMISSIONS.SALES_DELETE,
      inventory: PERMISSIONS.INVENTORY_DELETE,
    };

    return hasPermission(deletePermissions[module as keyof typeof deletePermissions]);
  };

  // Check specific feature permissions
  const canManageUsers = (): boolean => {
    return hasPermission(PERMISSIONS.SETTINGS_USERS_MANAGE);
  };

  const canManageRoles = (): boolean => {
    return hasPermission(PERMISSIONS.SETTINGS_ROLES_MANAGE);
  };

  const canViewReports = (): boolean => {
    return hasPermission(PERMISSIONS.FINANCE_REPORTS_VIEW);
  };

  const canManagePayroll = (): boolean => {
    return hasPermission(PERMISSIONS.HR_PAYROLL_MANAGE);
  };

  // Get user's permissions
  const getUserPermissions = (): string[] => {
    if (!user) return [];
    return user.permissions;
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  // Check if user is manager
  const isManager = (): boolean => {
    return hasRole(['admin', 'manager']);
  };

  return {
    hasPermission,
    hasRole,
    canAccessModule,
    canCreate,
    canUpdate,
    canDelete,
    canManageUsers,
    canManageRoles,
    canViewReports,
    canManagePayroll,
    getUserPermissions,
    isAdmin,
    isManager,
    PERMISSIONS,
    ROLE_PERMISSIONS,
  };
};