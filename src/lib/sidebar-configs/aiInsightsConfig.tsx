import { 
  Brain, 
  Bot,
  MessageSquare,
  Zap,
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Shield,
  Megaphone,
  Settings,
  TrendingUp,
  AlertTriangle,
  Eye,
  Mic,
  FileSearch,
  CreditCard,
  Target,
  UserCheck,
  Briefcase,
  Activity,
  Search,
  Workflow,
  Database,
  Code,
  GraduationCap,
  Lightbulb,
  Cpu,
  ScanLine,
  PieChart,
  Mail,
  Star,
  ThumbsUp,
  ShieldCheck,
  Lock,
  UserX,
  Truck,
  Calculator,
  FileBarChart,
  Sparkles
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const aiInsightsConfig: SecondarySidebarConfig = {
  title: 'AI Insights',
  icon: <Brain size={20} />,
  iconBgColor: 'bg-purple-100',
  iconColor: 'text-purple-600',
  stats: [
    {
      label: 'AI Predictions',
      value: '94.2%',
      icon: <TrendingUp size={16} />,
      color: 'text-green-400'
    },
    {
      label: 'Anomalies Detected',
      value: '12',
      icon: <AlertTriangle size={16} />,
      color: 'text-yellow-400'
    },
    {
      label: 'Tasks Automated',
      value: '847',
      icon: <Zap size={16} />,
      color: 'text-blue-400'
    },
    {
      label: 'AI Accuracy',
      value: '98.7%',
      icon: <Target size={16} />,
      color: 'text-purple-400'
    }
  ],
  sections: [
    {
      title: 'AI Dashboard',
      icon: <BarChart3 size={18} />,
      layout: 'list',
      options: [
        {
          id: 'ai-overview',
          name: 'AI Insights Overview',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Live',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/overview'
        },
        {
          id: 'finance-predictions',
          name: 'Finance Predictions',
          icon: <span className="text-green-600">•</span>,
          badge: '₹2.4Cr',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/finance-predictions'
        },
        {
          id: 'sales-predictions',
          name: 'Sales Predictions',
          icon: <span className="text-blue-600">•</span>,
          badge: '+23%',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/sales-predictions'
        },
        {
          id: 'hr-predictions',
          name: 'HR Predictions',
          icon: <span className="text-orange-600">•</span>,
          badge: '8 Alerts',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/hr-predictions'
        },
        {
          id: 'supply-chain-predictions',
          name: 'Supply Chain Predictions',
          icon: <span className="text-indigo-600">•</span>,
          badge: 'Critical',
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/ai-insights/supply-chain'
        },
        {
          id: 'anomalies-alerts',
          name: 'Anomalies & Alerts',
          icon: <span className="text-red-600">•</span>,
          badge: '12',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/anomalies'
        }
      ]
    },
    {
      title: 'AI Assistant',
      icon: <Bot size={18} />,
      layout: 'list',
      options: [
        {
          id: 'chat-with-erp',
          name: 'Chat with ERP',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Active',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/chat'
        },
        {
          id: 'voice-commands',
          name: 'Voice Commands',
          icon: <span className="text-green-600">•</span>,
          badge: 'New',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/voice'
        },
        {
          id: 'task-automation-suggestions',
          name: 'Task Automation Suggestions',
          icon: <span className="text-purple-600">•</span>,
          badge: '15',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/automation-suggestions'
        },
        {
          id: 'ai-reports-summaries',
          name: 'AI Reports & Summaries',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/ai-insights/reports'
        }
      ]
    },
    {
      title: 'Finance AI',
      icon: <DollarSign size={18} />,
      layout: 'list',
      options: [
        {
          id: 'smart-invoice-processing',
          name: 'Smart Invoice Processing',
          icon: <span className="text-green-600">•</span>,
          badge: 'OCR',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/finance/invoice-processing'
        },
        {
          id: 'cash-flow-prediction',
          name: 'Cash Flow Prediction',
          icon: <span className="text-blue-600">•</span>,
          badge: '94% Accuracy',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/finance/cash-flow'
        },
        {
          id: 'fraud-anomaly-detection',
          name: 'Fraud & Anomaly Detection',
          icon: <span className="text-red-600">•</span>,
          badge: '3 Alerts',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/finance/fraud-detection'
        },
        {
          id: 'automated-tax-insights',
          name: 'Automated Tax Insights',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Smart',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/finance/tax-insights'
        },
        {
          id: 'expense-categorization',
          name: 'Auto Expense Categorization',
          icon: <span className="text-purple-600">•</span>,
          badge: 'AI',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/finance/expense-categorization'
        }
      ]
    },
    {
      title: 'Sales & CRM AI',
      icon: <ShoppingCart size={18} />,
      layout: 'list',
      options: [
        {
          id: 'lead-scoring-recommendations',
          name: 'Lead Scoring & Recommendations',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Hot',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/sales/lead-scoring'
        },
        {
          id: 'churn-prediction',
          name: 'Churn Prediction',
          icon: <span className="text-red-600">•</span>,
          badge: '23 At-Risk',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/sales/churn-prediction'
        },
        {
          id: 'smart-proposal-drafts',
          name: 'Smart Proposal/Email Drafts',
          icon: <span className="text-green-600">•</span>,
          badge: 'AI Writer',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/sales/proposal-drafts'
        },
        {
          id: 'demand-forecasting',
          name: 'Demand Forecasting',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Trending',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/sales/demand-forecasting'
        },
        {
          id: 'customer-lifetime-value',
          name: 'Customer Lifetime Value AI',
          icon: <span className="text-indigo-600">•</span>,
          badge: null,
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/ai-insights/sales/customer-ltv'
        }
      ]
    },
    {
      title: 'HR & People AI',
      icon: <Users size={18} />,
      layout: 'list',
      options: [
        {
          id: 'resume-parsing-screening',
          name: 'Resume Parsing & Screening',
          icon: <span className="text-blue-600">•</span>,
          badge: '47 CVs',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/hr/resume-parsing'
        },
        {
          id: 'employee-attrition-prediction',
          name: 'Employee Attrition Prediction',
          icon: <span className="text-red-600">•</span>,
          badge: '5 Risk',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/hr/attrition-prediction'
        },
        {
          id: 'performance-insights',
          name: 'Performance Insights',
          icon: <span className="text-green-600">•</span>,
          badge: 'Analytics',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/hr/performance-insights'
        },
        {
          id: 'hr-chatbot',
          name: 'HR Chatbot',
          icon: <span className="text-purple-600">•</span>,
          badge: '24/7',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/hr/chatbot'
        },
        {
          id: 'skill-gap-analysis',
          name: 'Skill Gap Analysis',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Smart',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/hr/skill-gap'
        }
      ]
    },
    {
      title: 'Inventory & Supply Chain AI',
      icon: <Package size={18} />,
      layout: 'list',
      options: [
        {
          id: 'stock-demand-forecasting',
          name: 'Stock Demand Forecasting',
          icon: <span className="text-blue-600">•</span>,
          badge: '96% Accuracy',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/inventory/demand-forecasting'
        },
        {
          id: 'auto-reorder-suggestions',
          name: 'Auto-Reorder Suggestions',
          icon: <span className="text-green-600">•</span>,
          badge: '12 Items',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/inventory/auto-reorder'
        },
        {
          id: 'price-optimization',
          name: 'Price Optimization',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Dynamic',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/inventory/price-optimization'
        },
        {
          id: 'logistics-route-optimization',
          name: 'Logistics & Route Optimization',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Smart Routes',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/inventory/route-optimization'
        },
        {
          id: 'supplier-risk-assessment',
          name: 'Supplier Risk Assessment',
          icon: <span className="text-red-600">•</span>,
          badge: '2 Risks',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/inventory/supplier-risk'
        }
      ]
    },
    {
      title: 'Productivity & Documents AI',
      icon: <FileText size={18} />,
      layout: 'list',
      options: [
        {
          id: 'document-summarization',
          name: 'Document Summarization',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Smart',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/productivity/document-summarization'
        },
        {
          id: 'report-generator',
          name: 'AI Report Generator',
          icon: <span className="text-green-600">•</span>,
          badge: 'Auto',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/productivity/report-generator'
        },
        {
          id: 'ai-search',
          name: 'AI Search (Semantic)',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Semantic',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/productivity/ai-search'
        },
        {
          id: 'workflow-optimization',
          name: 'Workflow Optimization Suggestions',
          icon: <span className="text-orange-600">•</span>,
          badge: '8 Tips',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/productivity/workflow-optimization'
        },
        {
          id: 'content-generation',
          name: 'AI Content Generation',
          icon: <span className="text-indigo-600">•</span>,
          badge: 'Writer',
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/ai-insights/productivity/content-generation'
        }
      ]
    },
    {
      title: 'Security & Compliance AI',
      icon: <Shield size={18} />,
      layout: 'list',
      options: [
        {
          id: 'user-activity-anomaly',
          name: 'User Activity Anomaly Detection',
          icon: <span className="text-red-600">•</span>,
          badge: '3 Alerts',
          color: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          href: '/ai-insights/security/activity-anomaly'
        },
        {
          id: 'data-privacy-compliance',
          name: 'Data Privacy & Compliance Check',
          icon: <span className="text-blue-600">•</span>,
          badge: 'GDPR',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/security/privacy-compliance'
        },
        {
          id: 'fraud-prevention-logs',
          name: 'Fraud Prevention AI Logs',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Monitor',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/security/fraud-prevention'
        },
        {
          id: 'access-pattern-analysis',
          name: 'Access Pattern Analysis',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Smart',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/security/access-patterns'
        }
      ]
    },
    {
      title: 'Marketing & Customer AI',
      icon: <Megaphone size={18} />,
      layout: 'list',
      options: [
        {
          id: 'sentiment-analysis',
          name: 'Sentiment Analysis',
          icon: <span className="text-green-600">•</span>,
          badge: '87% Positive',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/marketing/sentiment-analysis'
        },
        {
          id: 'campaign-content-generator',
          name: 'Campaign Content Generator',
          icon: <span className="text-blue-600">•</span>,
          badge: 'AI Writer',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/marketing/content-generator'
        },
        {
          id: 'customer-support-chatbot',
          name: 'Customer Support Chatbot',
          icon: <span className="text-purple-600">•</span>,
          badge: '24/7',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/marketing/support-chatbot'
        },
        {
          id: 'product-recommendations',
          name: 'Product Recommendations',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Smart',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/marketing/product-recommendations'
        },
        {
          id: 'social-media-insights',
          name: 'Social Media Insights',
          icon: <span className="text-pink-600">•</span>,
          badge: 'Trending',
          color: 'text-pink-600',
          bgColor: 'hover:bg-pink-50',
          href: '/ai-insights/marketing/social-insights'
        }
      ]
    },
    {
      title: 'Admin / Developer AI Tools',
      icon: <Settings size={18} />,
      layout: 'list',
      options: [
        {
          id: 'data-cleaning-validation',
          name: 'Data Cleaning & Validation',
          icon: <span className="text-blue-600">•</span>,
          badge: 'Clean',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/ai-insights/admin/data-cleaning'
        },
        {
          id: 'custom-workflow-generator',
          name: 'Custom Workflow Generator',
          icon: <span className="text-green-600">•</span>,
          badge: 'Builder',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          href: '/ai-insights/admin/workflow-generator'
        },
        {
          id: 'ai-script-code-assistant',
          name: 'AI Script/Code Assistant',
          icon: <span className="text-purple-600">•</span>,
          badge: 'Copilot',
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/ai-insights/admin/code-assistant'
        },
        {
          id: 'ai-training',
          name: 'AI Training (Company Data)',
          icon: <span className="text-orange-600">•</span>,
          badge: 'Custom',
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/ai-insights/admin/ai-training'
        },
        {
          id: 'system-optimization',
          name: 'System Optimization AI',
          icon: <span className="text-indigo-600">•</span>,
          badge: 'Performance',
          color: 'text-indigo-600',
          bgColor: 'hover:bg-indigo-50',
          href: '/ai-insights/admin/system-optimization'
        }
      ]
    }
  ],
  accountInfo: {
    name: 'AI Insights Module',
    status: 'AI models active and learning',
    statusColor: 'bg-purple-500'
  }
};