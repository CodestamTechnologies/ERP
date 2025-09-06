// Role-based access control logic
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/hooks/usePermissions';

// Define permission type from PERMISSIONS constant
type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

// Check if user has specific permission
export const hasPermission = (
  userPermissions: string[],
  requiredPermission: string
): boolean => {
  return userPermissions.includes(requiredPermission);
};

// Check if user has any of the required permissions
export const hasAnyPermission = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

// Check if user has all required permissions
export const hasAllPermissions = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

// Get permissions for a role
export const getRolePermissions = (roleName: string): string[] => {
  return ROLE_PERMISSIONS[roleName as keyof typeof ROLE_PERMISSIONS] || [];
};

// Check if role has permission
export const roleHasPermission = (
  roleName: string,
  permission: string
): boolean => {
  const rolePermissions = getRolePermissions(roleName);
  return rolePermissions.includes(permission);
};

// Get all available permissions grouped by module
export const getPermissionsByModule = (): Record<string, Permission[]> => {
  const permissionsByModule: Record<string, Permission[]> = {};
  
  Object.entries(PERMISSIONS).forEach(([key, value]) => {
    const [module, action] = value.split(':');
    
    if (!permissionsByModule[module]) {
      permissionsByModule[module] = [];
    }
    
    permissionsByModule[module].push({
      id: value,
      name: key,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${module}`,
      module,
      action,
    });
  });
  
  return permissionsByModule;
};

// Validate role permissions
export const validateRolePermissions = (permissions: string[]): {
  isValid: boolean;
  invalidPermissions: string[];
} => {
  const validPermissions = Object.values(PERMISSIONS) as string[];
  const invalidPermissions = permissions.filter(
    permission => !validPermissions.includes(permission)
  );
  
  return {
    isValid: invalidPermissions.length === 0,
    invalidPermissions,
  };
};

// Create custom role with permissions
export const createCustomRole = (
  name: string,
  permissions: string[]
): Omit<Role, 'id' | 'createdAt' | 'updatedAt'> => {
  const validation = validateRolePermissions(permissions);
  
  if (!validation.isValid) {
    throw new Error(`Invalid permissions: ${validation.invalidPermissions.join(', ')}`);
  }
  
  return {
    name,
    description: `Custom role: ${name}`,
    permissions,
    isActive: true,
  };
};

// Get minimum required permissions for a module
export const getModuleMinimumPermissions = (module: string): string[] => {
  const modulePermissions = Object.values(PERMISSIONS).filter(
    permission => permission.startsWith(`${module}:`)
  );
  
  // Return view permission as minimum
  return modulePermissions.filter(permission => permission.endsWith(':view'));
};

// Check if user can access route based on permissions
export const canAccessRoute = (
  userPermissions: string[],
  route: string
): boolean => {
  const routePermissionMap: Record<string, string> = {
    '/dashboard': PERMISSIONS.DASHBOARD_VIEW,
    '/hr': PERMISSIONS.HR_VIEW,
    '/hr/employees': PERMISSIONS.HR_EMPLOYEES_MANAGE,
    '/hr/payroll': PERMISSIONS.HR_PAYROLL_MANAGE,
    '/hr/attendance': PERMISSIONS.HR_ATTENDANCE_MANAGE,
    '/finance': PERMISSIONS.FINANCE_VIEW,
    '/finance/invoices': PERMISSIONS.FINANCE_INVOICES_MANAGE,
    '/finance/expenses': PERMISSIONS.FINANCE_EXPENSES_MANAGE,
    '/reports': PERMISSIONS.FINANCE_REPORTS_VIEW,
    '/sales': PERMISSIONS.SALES_VIEW,
    '/sales/leads': PERMISSIONS.SALES_LEADS_MANAGE,
    '/customers': PERMISSIONS.SALES_CUSTOMERS_MANAGE,
    '/sales/orders': PERMISSIONS.SALES_ORDERS_MANAGE,
    '/inventory': PERMISSIONS.INVENTORY_VIEW,
    '/inventory/products': PERMISSIONS.INVENTORY_PRODUCTS_MANAGE,
    '/inventory/stock': PERMISSIONS.INVENTORY_STOCK_MANAGE,
    '/suppliers': PERMISSIONS.INVENTORY_SUPPLIERS_MANAGE,
    '/settings': PERMISSIONS.SETTINGS_VIEW,
  };
  
  const requiredPermission = routePermissionMap[route];
  
  if (!requiredPermission) {
    // If no specific permission required, allow access
    return true;
  }
  
  return hasPermission(userPermissions, requiredPermission);
};

// Get user's accessible routes
export const getAccessibleRoutes = (userPermissions: string[]): string[] => {
  const routePermissionMap: Record<string, string> = {
    '/dashboard': PERMISSIONS.DASHBOARD_VIEW,
    '/hr': PERMISSIONS.HR_VIEW,
    '/hr/employees': PERMISSIONS.HR_EMPLOYEES_MANAGE,
    '/hr/payroll': PERMISSIONS.HR_PAYROLL_MANAGE,
    '/hr/attendance': PERMISSIONS.HR_ATTENDANCE_MANAGE,
    '/finance': PERMISSIONS.FINANCE_VIEW,
    '/finance/invoices': PERMISSIONS.FINANCE_INVOICES_MANAGE,
    '/finance/expenses': PERMISSIONS.FINANCE_EXPENSES_MANAGE,
    '/reports': PERMISSIONS.FINANCE_REPORTS_VIEW,
    '/sales': PERMISSIONS.SALES_VIEW,
    '/sales/leads': PERMISSIONS.SALES_LEADS_MANAGE,
    '/customers': PERMISSIONS.SALES_CUSTOMERS_MANAGE,
    '/sales/orders': PERMISSIONS.SALES_ORDERS_MANAGE,
    '/inventory': PERMISSIONS.INVENTORY_VIEW,
    '/inventory/products': PERMISSIONS.INVENTORY_PRODUCTS_MANAGE,
    '/inventory/stock': PERMISSIONS.INVENTORY_STOCK_MANAGE,
    '/suppliers': PERMISSIONS.INVENTORY_SUPPLIERS_MANAGE,
    '/settings': PERMISSIONS.SETTINGS_VIEW,
  };
  
  return Object.keys(routePermissionMap).filter(route =>
    canAccessRoute(userPermissions, route)
  );
};