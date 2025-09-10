import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { QuickAction } from '@/components/common/QuickActions';

export const useQuickActions = () => {
  const pathname = usePathname();

  const quickActions = useMemo((): QuickAction[] => {
    switch (true) {
      case pathname === '/dashboard':
        return [
          { 
            name: 'New Order', 
            icon: '📋', 
            color: 'blue',
            description: 'Create new customer order',
            onClick: () => console.log('New Order clicked')
          },
          { 
            name: 'Add Customer', 
            icon: '👤', 
            color: 'green',
            description: 'Add new customer',
            onClick: () => console.log('Add Customer clicked')
          },
          { 
            name: 'Stock Alert', 
            icon: '📦', 
            color: 'orange',
            description: 'Check inventory alerts',
            onClick: () => console.log('Stock Alert clicked')
          },
          { 
            name: 'Generate Report', 
            icon: '📊', 
            color: 'purple',
            description: 'Generate business report',
            onClick: () => console.log('Generate Report clicked')
          },
          { 
            name: 'View Analytics', 
            icon: '📈', 
            color: 'indigo',
            description: 'View business analytics',
            onClick: () => console.log('View Analytics clicked')
          },
          { 
            name: 'Payment Status', 
            icon: '💳', 
            color: 'green',
            description: 'Check payment status',
            onClick: () => console.log('Payment Status clicked')
          },
          { 
            name: 'AI Insights', 
            icon: '🤖', 
            color: 'purple',
            description: 'View AI recommendations',
            onClick: () => console.log('AI Insights clicked')
          },
          { 
            name: 'Quick Settings', 
            icon: '⚙️', 
            color: 'gray',
            description: 'Access quick settings',
            onClick: () => console.log('Quick Settings clicked')
          }
        ];

      case pathname === '/sales' || pathname.startsWith('/sales'):
        return [
          { 
            name: 'New Quote', 
            icon: '📋', 
            color: 'blue',
            description: 'Create sales quote',
            onClick: () => console.log('New Quote clicked')
          },
          { 
            name: 'Add Lead', 
            icon: '👤', 
            color: 'green',
            description: 'Add new sales lead',
            onClick: () => console.log('Add Lead clicked')
          },
          { 
            name: 'Follow Up', 
            icon: '📞', 
            color: 'orange',
            description: 'Schedule follow-up',
            onClick: () => console.log('Follow Up clicked')
          },
          { 
            name: 'Sales Report', 
            icon: '📊', 
            color: 'purple',
            description: 'Generate sales report',
            onClick: () => console.log('Sales Report clicked')
          },
          { 
            name: 'Pipeline View', 
            icon: '🔄', 
            color: 'indigo',
            description: 'View sales pipeline',
            onClick: () => console.log('Pipeline View clicked')
          },
          { 
            name: 'Commission', 
            icon: '💰', 
            color: 'green',
            description: 'Calculate commission',
            onClick: () => console.log('Commission clicked')
          }
        ];

      case pathname === '/inventory' || pathname.startsWith('/inventory'):
        return [
          { 
            name: 'Bulk Import', 
            icon: '📥', 
            color: 'blue',
            description: 'Import inventory items',
            onClick: () => console.log('Bulk Import clicked')
          },
          { 
            name: 'Stock Count', 
            icon: '📊', 
            color: 'green',
            description: 'Perform stock count',
            onClick: () => console.log('Stock Count clicked')
          },
          { 
            name: 'Low Stock Alert', 
            icon: '⚠️', 
            color: 'orange',
            description: 'Check low stock items',
            onClick: () => console.log('Low Stock Alert clicked')
          },
          { 
            name: 'Reorder Items', 
            icon: '🔄', 
            color: 'purple',
            description: 'Reorder inventory',
            onClick: () => console.log('Reorder Items clicked')
          },
          { 
            name: 'Barcode Scan', 
            icon: '📱', 
            color: 'indigo',
            description: 'Scan item barcode',
            onClick: () => console.log('Barcode Scan clicked')
          },
          { 
            name: 'Export Data', 
            icon: '📤', 
            color: 'gray',
            description: 'Export inventory data',
            onClick: () => console.log('Export Data clicked')
          },
          { 
            name: 'Categories', 
            icon: '📂', 
            color: 'blue',
            description: 'Manage categories',
            onClick: () => console.log('Categories clicked')
          },
          { 
            name: 'Suppliers', 
            icon: '🏢', 
            color: 'green',
            description: 'Manage suppliers',
            onClick: () => console.log('Suppliers clicked')
          }
        ];

      case pathname === '/customers' || pathname.startsWith('/customers'):
        return [
          { 
            name: 'Import Customers', 
            icon: '👥', 
            color: 'blue',
            description: 'Import customer data',
            onClick: () => console.log('Import Customers clicked')
          },
          { 
            name: 'Send Email', 
            icon: '📧', 
            color: 'green',
            description: 'Send customer email',
            onClick: () => console.log('Send Email clicked')
          },
          { 
            name: 'Create Invoice', 
            icon: '📄', 
            color: 'orange',
            description: 'Create customer invoice',
            onClick: () => console.log('Create Invoice clicked')
          },
          { 
            name: 'Payment History', 
            icon: '💳', 
            color: 'purple',
            description: 'View payment history',
            onClick: () => console.log('Payment History clicked')
          },
          { 
            name: 'Customer Report', 
            icon: '📊', 
            color: 'indigo',
            description: 'Generate customer report',
            onClick: () => console.log('Customer Report clicked')
          },
          { 
            name: 'Loyalty Program', 
            icon: '🎁', 
            color: 'pink',
            description: 'Manage loyalty points',
            onClick: () => console.log('Loyalty Program clicked')
          },
          { 
            name: 'Feedback', 
            icon: '💬', 
            color: 'yellow',
            description: 'Collect feedback',
            onClick: () => console.log('Feedback clicked')
          },
          { 
            name: 'Export List', 
            icon: '📤', 
            color: 'gray',
            description: 'Export customer list',
            onClick: () => console.log('Export List clicked')
          }
        ];

      case pathname === '/suppliers' || pathname.startsWith('/suppliers'):
        return [
          { 
            name: 'Import Suppliers', 
            icon: '🏢', 
            color: 'blue',
            description: 'Import supplier data',
            onClick: () => console.log('Import Suppliers clicked')
          },
          { 
            name: 'Purchase Order', 
            icon: '📋', 
            color: 'green',
            description: 'Create purchase order',
            onClick: () => console.log('Purchase Order clicked')
          },
          { 
            name: 'Payment Terms', 
            icon: '💳', 
            color: 'orange',
            description: 'Manage payment terms',
            onClick: () => console.log('Payment Terms clicked')
          },
          { 
            name: 'Performance', 
            icon: '📊', 
            color: 'purple',
            description: 'Supplier performance',
            onClick: () => console.log('Performance clicked')
          },
          { 
            name: 'Contracts', 
            icon: '📋', 
            color: 'indigo',
            description: 'Manage contracts',
            onClick: () => console.log('Contracts clicked')
          },
          { 
            name: 'Quality Check', 
            icon: '✅', 
            color: 'green',
            description: 'Quality assessment',
            onClick: () => console.log('Quality Check clicked')
          },
          { 
            name: 'Communication', 
            icon: '📞', 
            color: 'blue',
            description: 'Contact supplier',
            onClick: () => console.log('Communication clicked')
          },
          { 
            name: 'Export Data', 
            icon: '📤', 
            color: 'gray',
            description: 'Export supplier data',
            onClick: () => console.log('Export Data clicked')
          }
        ];

      case pathname === '/finance' || pathname.startsWith('/finance'):
        return [
          { 
            name: 'Create Invoice', 
            icon: '📄', 
            color: 'blue',
            description: 'Create new invoice',
            onClick: () => console.log('Create Invoice clicked')
          },
          { 
            name: 'Record Payment', 
            icon: '💳', 
            color: 'green',
            description: 'Record payment received',
            onClick: () => console.log('Record Payment clicked')
          },
          { 
            name: 'Expense Entry', 
            icon: '💰', 
            color: 'orange',
            description: 'Add expense entry',
            onClick: () => console.log('Expense Entry clicked')
          },
          { 
            name: 'Financial Report', 
            icon: '📊', 
            color: 'purple',
            description: 'Generate financial report',
            onClick: () => console.log('Financial Report clicked')
          },
          { 
            name: 'Tax Calculation', 
            icon: '🧮', 
            color: 'indigo',
            description: 'Calculate taxes',
            onClick: () => console.log('Tax Calculation clicked')
          },
          { 
            name: 'Bank Reconciliation', 
            icon: '🏦', 
            color: 'blue',
            description: 'Reconcile bank account',
            onClick: () => console.log('Bank Reconciliation clicked')
          }
        ];

      case pathname === '/gmail' || pathname.startsWith('/gmail'):
        return [
          { 
            name: 'Compose', 
            icon: '✍️', 
            color: 'blue',
            description: 'Compose new email',
            onClick: () => console.log('Compose clicked')
          },
          { 
            name: 'Reply All', 
            icon: '↩️', 
            color: 'green',
            description: 'Reply to all recipients',
            onClick: () => console.log('Reply All clicked')
          },
          { 
            name: 'Forward', 
            icon: '➡️', 
            color: 'purple',
            description: 'Forward email',
            onClick: () => console.log('Forward clicked')
          },
          { 
            name: 'Archive', 
            icon: '📦', 
            color: 'gray',
            description: 'Archive emails',
            onClick: () => console.log('Archive clicked')
          },
          { 
            name: 'Delete', 
            icon: '🗑️', 
            color: 'red',
            description: 'Delete emails',
            onClick: () => console.log('Delete clicked')
          },
          { 
            name: 'Star', 
            icon: '⭐', 
            color: 'yellow',
            description: 'Star important emails',
            onClick: () => console.log('Star clicked')
          },
          { 
            name: 'Mark Read', 
            icon: '✅', 
            color: 'blue',
            description: 'Mark as read',
            onClick: () => console.log('Mark Read clicked')
          },
          { 
            name: 'Sync Gmail', 
            icon: '🔄', 
            color: 'indigo',
            description: 'Sync with Gmail',
            onClick: () => console.log('Sync Gmail clicked')
          },
          { 
            name: 'Export', 
            icon: '📤', 
            color: 'orange',
            description: 'Export emails',
            onClick: () => console.log('Export clicked')
          },
          { 
            name: 'Search', 
            icon: '🔍', 
            color: 'gray',
            description: 'Search emails',
            onClick: () => console.log('Search clicked')
          },
          { 
            name: 'Filters', 
            icon: '🔽', 
            color: 'purple',
            description: 'Manage filters',
            onClick: () => console.log('Filters clicked')
          },
          { 
            name: 'Settings', 
            icon: '⚙️', 
            color: 'gray',
            description: 'Email settings',
            onClick: () => console.log('Settings clicked')
          }
        ];

      case pathname === '/calendar' || pathname.startsWith('/calendar'):
        return [
          { 
            name: 'New Event', 
            icon: '📅', 
            color: 'blue',
            description: 'Create new event',
            onClick: () => console.log('New Event clicked')
          },
          { 
            name: 'Meeting', 
            icon: '🤝', 
            color: 'green',
            description: 'Schedule meeting',
            onClick: () => console.log('Meeting clicked')
          },
          { 
            name: 'Reminder', 
            icon: '🔔', 
            color: 'orange',
            description: 'Set reminder',
            onClick: () => console.log('Reminder clicked')
          },
          { 
            name: 'Sync Calendar', 
            icon: '🔄', 
            color: 'purple',
            description: 'Sync with external calendar',
            onClick: () => console.log('Sync Calendar clicked')
          },
          { 
            name: 'Export Events', 
            icon: '📤', 
            color: 'indigo',
            description: 'Export calendar events',
            onClick: () => console.log('Export Events clicked')
          },
          { 
            name: 'View Analytics', 
            icon: '📊', 
            color: 'blue',
            description: 'View calendar analytics',
            onClick: () => console.log('View Analytics clicked')
          }
        ];

      case pathname === '/reports' || pathname.startsWith('/reports'):
        return [
          { 
            name: 'Sales Report', 
            icon: '📊', 
            color: 'blue',
            description: 'Generate sales report',
            onClick: () => console.log('Sales Report clicked')
          },
          { 
            name: 'Inventory Report', 
            icon: '📦', 
            color: 'green',
            description: 'Generate inventory report',
            onClick: () => console.log('Inventory Report clicked')
          },
          { 
            name: 'Financial Report', 
            icon: '💰', 
            color: 'orange',
            description: 'Generate financial report',
            onClick: () => console.log('Financial Report clicked')
          },
          { 
            name: 'Custom Report', 
            icon: '📋', 
            color: 'purple',
            description: 'Create custom report',
            onClick: () => console.log('Custom Report clicked')
          },
          { 
            name: 'Schedule Report', 
            icon: '⏰', 
            color: 'indigo',
            description: 'Schedule automated report',
            onClick: () => console.log('Schedule Report clicked')
          },
          { 
            name: 'Export All', 
            icon: '📤', 
            color: 'gray',
            description: 'Export all reports',
            onClick: () => console.log('Export All clicked')
          }
        ];

      case pathname === '/ai-insights' || pathname.startsWith('/ai-insights'):
        return [
          { 
            name: 'Generate Insights', 
            icon: '🤖', 
            color: 'blue',
            description: 'Generate AI insights',
            onClick: () => console.log('Generate Insights clicked')
          },
          { 
            name: 'Forecast Sales', 
            icon: '📈', 
            color: 'green',
            description: 'AI sales forecast',
            onClick: () => console.log('Forecast Sales clicked')
          },
          { 
            name: 'Optimize Inventory', 
            icon: '🎯', 
            color: 'orange',
            description: 'AI inventory optimization',
            onClick: () => console.log('Optimize Inventory clicked')
          },
          { 
            name: 'Customer Insights', 
            icon: '👥', 
            color: 'purple',
            description: 'AI customer analysis',
            onClick: () => console.log('Customer Insights clicked')
          },
          { 
            name: 'Trend Analysis', 
            icon: '📊', 
            color: 'indigo',
            description: 'AI trend analysis',
            onClick: () => console.log('Trend Analysis clicked')
          },
          { 
            name: 'Risk Assessment', 
            icon: '⚠️', 
            color: 'red',
            description: 'AI risk assessment',
            onClick: () => console.log('Risk Assessment clicked')
          }
        ];

      default:
        return [
          { 
            name: 'Dashboard', 
            icon: '🏠', 
            color: 'blue',
            description: 'Go to dashboard',
            href: '/dashboard'
          },
          { 
            name: 'Sales', 
            icon: '💼', 
            color: 'green',
            description: 'View sales',
            href: '/sales'
          },
          { 
            name: 'Inventory', 
            icon: '📦', 
            color: 'orange',
            description: 'Manage inventory',
            href: '/inventory'
          },
          { 
            name: 'Customers', 
            icon: '👥', 
            color: 'purple',
            description: 'Manage customers',
            href: '/customers'
          }
        ];
    }
  }, [pathname]);

  const getQuickActionsConfig = () => {
    switch (true) {
      case pathname === '/dashboard':
        return {
          title: 'Quick Actions',
          description: 'Frequently used actions for quick access',
          columns: { sm: 2, md: 4, lg: 8, xl: 8 },
          variant: 'default' as const
        };

      case pathname === '/sales' || pathname.startsWith('/sales'):
        return {
          title: 'Quick Actions',
          description: 'Frequently used actions for sales management',
          columns: { sm: 2, md: 3, lg: 6, xl: 6 },
          variant: 'default' as const
        };

      case pathname === '/inventory' || pathname.startsWith('/inventory'):
        return {
          title: 'Quick Actions',
          description: 'Common inventory management tasks',
          columns: { sm: 2, md: 4, lg: 8, xl: 8 },
          variant: 'default' as const
        };

      case pathname === '/gmail' || pathname.startsWith('/gmail'):
        return {
          title: 'Quick Actions',
          description: 'Frequently used email actions',
          columns: { sm: 2, md: 3, lg: 6, xl: 6 },
          variant: 'default' as const
        };

      case pathname === '/ai-insights' || pathname.startsWith('/ai-insights'):
        return {
          title: 'AI-Powered Quick Actions',
          description: 'Intelligent actions powered by machine learning',
          columns: { sm: 2, md: 3, lg: 6, xl: 6 },
          variant: 'gradient' as const
        };

      default:
        return {
          title: 'Quick Actions',
          description: 'Frequently used actions for quick access',
          columns: { sm: 2, md: 4, lg: 6, xl: 8 },
          variant: 'default' as const
        };
    }
  };

  return {
    quickActions,
    config: getQuickActionsConfig()
  };
};