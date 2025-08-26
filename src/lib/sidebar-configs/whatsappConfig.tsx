import { 
  MessageCircle, 
  Smartphone, 
  Globe, 
  Zap
} from 'lucide-react';
import { SecondarySidebarConfig } from '@/components/layout/SecondarySidebar';

export const messagingServicesConfig: SecondarySidebarConfig = {
  title: 'Messaging Services',
  icon: <MessageCircle size={20} />,
  iconBgColor: 'bg-green-100',
  iconColor: 'text-green-600',
  sections: [
    {
      title: 'Available Messaging Services',
      layout: 'list',
      options: [
        {
          id: 'whatsapp-business',
          name: 'WhatsApp Business',
          icon: <Smartphone size={20} />,
          badge: 'Connected',
          color: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          onClick: () => console.log('WhatsApp Business clicked')
        },
        {
          id: 'telegram-business',
          name: 'Telegram Business',
          icon: <Zap size={20} />,
          badge: null,
          color: 'text-blue-600',
          bgColor: 'hover:bg-blue-50',
          onClick: () => console.log('Telegram Business clicked')
        },
        {
          id: 'slack',
          name: 'Slack',
          icon: <Globe size={20} />,
          badge: null,
          color: 'text-purple-600',
          bgColor: 'hover:bg-purple-50',
          onClick: () => console.log('Slack clicked')
        }
      ]
    }
  ]
};