import { 
  Mail, 
  Cloud, 
  Building2, 
  Shield, 
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const emailServicesConfig: SecondarySidebarConfig = {
  title: 'Email Services',
  icon: <Mail size={20} />,
  iconBgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
  sections: [
    {
      title: 'Available Email Services',
      layout: 'list',
      options: [
        {
          id: 'google-workspace',
          name: 'Google Workspace',
          icon: <Cloud size={20} />,
          badge: 'Connected',
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          href: '/gmail'
        },
        {
          id: 'microsoft-365',
          name: 'Microsoft 365',
          icon: <Building2 size={20} />,
          badge: null,
          color: 'text-blue-700',
          bgColor: 'hover:bg-blue-50',
          href: '/gmail?service=microsoft-365'
        },
        {
          id: 'zoho-mail',
          name: 'Zoho Mail',
          icon: <Zap size={20} />,
          badge: null,
          color: 'text-orange-600',
          bgColor: 'hover:bg-orange-50',
          href: '/gmail?service=zoho-mail'
        },
        {
          id: 'proton-mail',
          name: 'Proton Mail',
          icon: <Shield size={20} />,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          href: '/gmail?service=proton-mail'
        }
      ]
    }
  ]
};