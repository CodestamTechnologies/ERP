'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface QuickAction {
  name: string;
  icon: React.ReactNode | string;
  color?: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  title?: string;
  description?: string;
  actions: QuickAction[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  loading?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  title = 'Quick Actions',
  description = 'Frequently used actions for quick access',
  actions,
  columns = { sm: 2, md: 4, lg: 6, xl: 8 },
  className = '',
  variant = 'default',
  loading = false
}) => {
  const getGridClasses = () => {
    const { sm = 2, md = 4, lg = 6, xl = 8 } = columns;
    return `grid grid-cols-${sm} sm:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-3`;
  };

  const getCardClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-50 to-purple-50';
      case 'minimal':
        return 'border-0 shadow-none bg-transparent';
      default:
        return '';
    }
  };

  const getActionButtonClasses = (action: QuickAction) => {
    const baseClasses = 'flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group';
    
    if (action.disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed`;
    }
    
    return baseClasses;
  };

  const getIconContainerClasses = (action: QuickAction) => {
    const color = action.color || 'blue';
    return `p-2 rounded-lg mb-2 bg-${color}-50 group-hover:bg-${color}-100 transition-colors`;
  };

  const renderIcon = (icon: React.ReactNode | string) => {
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    return icon;
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;
    
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  if (loading) {
    return (
      <Card className={`${getCardClasses()} ${className}`}>
        <CardHeader className={variant !== 'minimal' ? 'border-b' : ''}>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">
          <div className={getGridClasses()}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getCardClasses()} ${className}`}>
      <CardHeader className={variant !== 'minimal' ? 'border-b' : ''}>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">
        <div className={getGridClasses()}>
          {actions.map((action, index) => (
            <motion.button
              key={`${action.name}-${index}`}
              whileHover={action.disabled ? {} : { scale: 1.05 }}
              whileTap={action.disabled ? {} : { scale: 0.95 }}
              className={getActionButtonClasses(action)}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              title={action.description || action.name}
            >
              <div className={getIconContainerClasses(action)}>
                {renderIcon(action.icon)}
              </div>
              <span className="text-xs text-gray-700 text-center font-medium">
                {action.name}
              </span>
              {action.description && (
                <span className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                  {action.description}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;