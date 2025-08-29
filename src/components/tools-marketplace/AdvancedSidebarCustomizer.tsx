import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { 
  Settings, Eye, Plus, Minus, ChevronRight, ChevronDown, 
  BarChart3, BookOpen, ArrowUpDown, Landmark, FileText, Target,
  Shield, Users, Package, DollarSign, Building2, Wrench
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';

// Mock data for Finance module sections
const financeModuleSections = [
  {
    id: 'dashboard-overview',
    title: 'Dashboard & Overview',
    icon: <BarChart3 size={16} />,
    options: [
      { id: 'finance-dashboard', name: 'Finance Dashboard', badge: 'Live' },
      { id: 'cash-flow-overview', name: 'Cash Flow Overview' },
      { id: 'income-expenses', name: 'Income vs Expenses' },
      { id: 'outstanding-payments', name: 'Outstanding Invoices & Payments', badge: '23' },
      { id: 'profit-loss-snapshot', name: 'Profit/Loss Snapshot' }
    ]
  },
  {
    id: 'accounts-management',
    title: 'Accounts Management',
    icon: <BookOpen size={16} />,
    options: [
      { id: 'chart-of-accounts', name: 'Chart of Accounts' },
      { id: 'general-ledger', name: 'General Ledger' },
      { id: 'journal-entries', name: 'Journal Entries' },
      { id: 'trial-balance', name: 'Trial Balance' }
    ]
  },
  {
    id: 'payables-receivables',
    title: 'Payables & Receivables',
    icon: <ArrowUpDown size={16} />,
    options: [
      { id: 'accounts-payable', name: 'Accounts Payable', badge: '₹45.2L' },
      { id: 'vendor-bills', name: 'Vendor Bills & Due Payments', badge: '12' },
      { id: 'accounts-receivable', name: 'Accounts Receivable', badge: '₹67.8L' },
      { id: 'customer-invoices', name: 'Customer Invoices & Collections', badge: '28' },
      { id: 'credit-debit-notes', name: 'Credit/Debit Notes' },
      { id: 'aging-reports', name: 'Aging Reports' }
    ]
  },
  {
    id: 'bank-cash-management',
    title: 'Bank & Cash Management',
    icon: <Landmark size={16} />,
    options: [
      { id: 'bank-accounts', name: 'Bank Accounts Integration', badge: 'Connected' },
      { id: 'bank-reconciliation', name: 'Bank Reconciliation' },
      { id: 'cashbook', name: 'Cashbook / Petty Cash' },
      { id: 'fund-transfers', name: 'Fund Transfers' }
    ]
  },
  {
    id: 'invoicing-billing',
    title: 'Invoicing & Billing',
    icon: <FileText size={16} />,
    options: [
      { id: 'create-invoices', name: 'Create/Send Invoices & Bills', badge: 'Popular' },
      { id: 'recurring-invoices', name: 'Recurring Invoices' },
      { id: 'payment-tracking', name: 'Payment Tracking' },
      { id: 'multi-currency', name: 'Multi-Currency & Tax Support' }
    ]
  },
  {
    id: 'budgeting-forecasting',
    title: 'Budgeting & Forecasting',
    icon: <Target size={16} />,
    options: [
      { id: 'budget-creation', name: 'Budget Creation' },
      { id: 'department-budgets', name: 'Department-wise Budgets' },
      { id: 'project-budgets', name: 'Project-wise Budgets' },
      { id: 'budget-analysis', name: 'Budget vs. Actual Analysis' },
      { id: 'financial-forecasting', name: 'Financial Forecasting', badge: 'AI' }
    ]
  },
  {
    id: 'taxation-compliance',
    title: 'Taxation & Compliance',
    icon: <Shield size={16} />,
    options: [
      { id: 'gst-vat-setup', name: 'GST/VAT Setup' },
      { id: 'tds-withholding', name: 'TDS/Withholding Tax' },
      { id: 'tax-reports', name: 'Tax Reports & Filing Support' }
    ]
  },
  {
    id: 'payroll-expenses',
    title: 'Payroll & Expenses',
    icon: <Users size={16} />,
    options: [
      { id: 'salary-disbursement', name: 'Salary Disbursement' },
      { id: 'expense-claims', name: 'Expense Claims & Approvals', badge: '7' },
      { id: 'reimbursements', name: 'Reimbursements' }
    ]
  },
  {
    id: 'fixed-assets',
    title: 'Fixed Assets Management',
    icon: <Package size={16} />,
    options: [
      { id: 'asset-register', name: 'Asset Register' },
      { id: 'depreciation-tracking', name: 'Depreciation Tracking' },
      { id: 'asset-disposal', name: 'Asset Disposal/Transfer' }
    ]
  },
  {
    id: 'reports-analytics',
    title: 'Reports & Analytics',
    icon: <BarChart3 size={16} />,
    options: [
      { id: 'balance-sheet', name: 'Balance Sheet' },
      { id: 'profit-loss-statement', name: 'Profit & Loss Statement' },
      { id: 'cash-flow-statement', name: 'Cash Flow Statement' },
      { id: 'trial-balance-report', name: 'Trial Balance Report' },
      { id: 'custom-reports', name: 'Custom Financial Reports', badge: 'New' },
      { id: 'export-reports', name: 'Export to Excel/PDF' }
    ]
  },
  {
    id: 'settings-configurations',
    title: 'Settings & Configurations',
    icon: <Wrench size={16} />,
    options: [
      { id: 'financial-year', name: 'Financial Year & Period Closing' },
      { id: 'currency-rates', name: 'Currency & Exchange Rates' },
      { id: 'tax-rules', name: 'Tax Rules Configuration' },
      { id: 'approval-workflows', name: 'Approval Workflows' },
      { id: 'role-access', name: 'Role-based Access Control' }
    ]
  }
];

interface AdvancedSidebarCustomizerProps {
  availableTools: any[];
  installedTools: string[];
  sidebarConfig: any;
  onInstall: (toolId: string) => void;
  onUninstall: (toolId: string) => void;
  onConfigUpdate: (config: any) => void;
  isProcessing: boolean;
}

export const AdvancedSidebarCustomizer = ({
  availableTools, installedTools, sidebarConfig, onInstall, onUninstall, onConfigUpdate, isProcessing
}: AdvancedSidebarCustomizerProps) => {
  const [selectedTool, setSelectedTool] = useState('finance');
  const [sectionConfigs, setSectionConfigs] = useState<Record<string, any>>({
    finance: {
      enabledSections: ['dashboard-overview', 'accounts-management', 'reports-analytics'],
      sectionOrder: ['dashboard-overview', 'accounts-management', 'payables-receivables', 'bank-cash-management', 'invoicing-billing', 'budgeting-forecasting', 'taxation-compliance', 'payroll-expenses', 'fixed-assets', 'reports-analytics', 'settings-configurations'],
      subOptionConfigs: {
        'dashboard-overview': ['finance-dashboard', 'cash-flow-overview', 'profit-loss-snapshot'],
        'accounts-management': ['chart-of-accounts', 'general-ledger'],
        'reports-analytics': ['balance-sheet', 'profit-loss-statement', 'cash-flow-statement']
      }
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sidebarConfig.toolOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onConfigUpdate({ toolOrder: items });
  };

  const toggleTool = (toolId: string, enabled: boolean) => {
    const newEnabledTools = enabled 
      ? [...sidebarConfig.enabledTools, toolId]
      : sidebarConfig.enabledTools.filter((id: string) => id !== toolId);
    
    onConfigUpdate({ enabledTools: newEnabledTools });
  };

  const toggleSection = (toolId: string, sectionId: string, enabled: boolean) => {
    setSectionConfigs(prev => {
      const toolConfig = prev[toolId] || { enabledSections: [], sectionOrder: [], subOptionConfigs: {} };
      const newEnabledSections = enabled
        ? [...toolConfig.enabledSections, sectionId]
        : toolConfig.enabledSections.filter((id: string) => id !== sectionId);
      
      return {
        ...prev,
        [toolId]: {
          ...toolConfig,
          enabledSections: newEnabledSections
        }
      };
    });
  };

  const toggleSubOption = (toolId: string, sectionId: string, optionId: string, enabled: boolean) => {
    setSectionConfigs(prev => {
      const toolConfig = prev[toolId] || { enabledSections: [], sectionOrder: [], subOptionConfigs: {} };
      const sectionOptions = toolConfig.subOptionConfigs[sectionId] || [];
      const newOptions = enabled
        ? [...sectionOptions, optionId]
        : sectionOptions.filter((id: string) => id !== optionId);
      
      return {
        ...prev,
        [toolId]: {
          ...toolConfig,
          subOptionConfigs: {
            ...toolConfig.subOptionConfigs,
            [sectionId]: newOptions
          }
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Tool Selection Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center space-x-2">
            <Settings size={20} className="text-indigo-600" />
            <span>Advanced Sidebar Customization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs value={selectedTool} onValueChange={setSelectedTool}>
            <TabsList className="grid w-full grid-cols-6 bg-white/50">
              {availableTools.filter(tool => installedTools.includes(tool.id)).map(tool => (
                <TabsTrigger key={tool.id} value={tool.id} className="flex items-center space-x-2">
                  <div className="text-blue-600">{tool.icon}</div>
                  <span className="hidden sm:inline">{tool.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {availableTools.filter(tool => installedTools.includes(tool.id)).map(tool => (
              <TabsContent key={tool.id} value={tool.id} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Section Configuration */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="flex items-center space-x-2">
                        <div className="text-blue-600">{tool.icon}</div>
                        <span>{tool.name} Sections</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 max-h-96 overflow-y-auto">
                      <Accordion type="multiple" className="space-y-2">
                        {(tool.id === 'finance' ? financeModuleSections : []).map((section, index) => (
                          <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
                            <div className="flex items-center justify-between p-3 border-b">
                              <div className="flex items-center space-x-2">
                                <div className="text-gray-600">{section.icon}</div>
                                <span className="text-sm font-medium">{section.title}</span>
                              </div>
                              <Switch
                                checked={sectionConfigs[tool.id]?.enabledSections?.includes(section.id) || false}
                                onCheckedChange={(checked) => toggleSection(tool.id, section.id, checked)}
                              />
                            </div>
                            <AccordionTrigger className="px-3 py-1 text-xs text-gray-500 hover:no-underline">
                              <span>Configure sub-options</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-1">
                                {section.options.map(option => (
                                  <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                                    <div className="flex items-center space-x-2">
                                      <span>•</span>
                                      <span>{option.name}</span>
                                      {option.badge && (
                                        <Badge variant="outline" className="text-xs">{option.badge}</Badge>
                                      )}
                                    </div>
                                    <Switch
                                      size="sm"
                                      checked={sectionConfigs[tool.id]?.subOptionConfigs?.[section.id]?.includes(option.id) || false}
                                      onCheckedChange={(checked) => toggleSubOption(tool.id, section.id, option.id, checked)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* Live Preview */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center space-x-2">
                        <Eye size={20} className="text-green-600" />
                        <span>Live Preview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div className="text-white text-sm font-medium mb-4 flex items-center space-x-2">
                          <div className="text-blue-400">{tool.icon}</div>
                          <span>{tool.name}</span>
                        </div>
                        
                        <div className="space-y-3">
                          {(tool.id === 'finance' ? financeModuleSections : [])
                            .filter(section => sectionConfigs[tool.id]?.enabledSections?.includes(section.id))
                            .map(section => (
                              <div key={section.id} className="space-y-2">
                                <div className="flex items-center space-x-2 text-gray-300 text-xs font-medium">
                                  <div className="text-blue-400">{section.icon}</div>
                                  <span>{section.title}</span>
                                </div>
                                <div className="ml-4 space-y-1">
                                  {section.options
                                    .filter(option => sectionConfigs[tool.id]?.subOptionConfigs?.[section.id]?.includes(option.id))
                                    .map(option => (
                                      <div key={option.id} className="flex items-center justify-between p-1 bg-gray-800 rounded text-xs text-gray-300">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-gray-500">•</span>
                                          <span>{option.name}</span>
                                        </div>
                                        {option.badge && (
                                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                            {option.badge}
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>

                        {!sectionConfigs[tool.id]?.enabledSections?.length && (
                          <div className="text-center py-8 text-gray-400">
                            <Settings size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No sections enabled</p>
                            <p className="text-xs">Enable sections to see them here</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500 text-center">
                        Customize sections and sub-options • Real-time preview
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex justify-center">
        <Button 
          onClick={() => onConfigUpdate({ sectionConfigs })} 
          disabled={isProcessing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Settings size={16} className="mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
};