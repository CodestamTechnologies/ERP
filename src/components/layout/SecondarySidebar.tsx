'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import Link from 'next/link';

// Types
export interface SidebarOption {
  id: string;
  name: string;
  icon: ReactNode;
  badge?: string | null;
  color?: string;
  bgColor?: string;
  href?: string;
  onClick?: () => void;
}

export interface SidebarSection {
  title: string;
  icon?: ReactNode;
  options: SidebarOption[];
  layout?: 'list' | 'grid';
}

export interface SidebarStats {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export interface SecondarySidebarConfig {
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  stats?: SidebarStats[];
  sections: SidebarSection[];
  accountInfo?: {
    name: string;
    status: string;
    avatar?: string;
    statusColor: string;
  };
}

interface SecondarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  config: SecondarySidebarConfig;
}

// Custom hook for click outside
const useClickOutside = (ref: React.RefObject<HTMLElement | null>, callback: () => void, active = true) => {
  useEffect(() => {
    if (!active) return;
    
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, active]);
};

// Components
const SidebarHeader = ({ config, onClose }: { config: SecondarySidebarConfig; onClose: () => void }) => (
  <div className="flex items-center justify-between h-16 px-4 border-b border-white/20" style={{ backgroundColor: '#1e2155' }}>
    <div className="flex items-center space-x-2">
      <div className="p-2 bg-white/10 rounded-lg">
        <span className="text-white">
          {config.icon}
        </span>
      </div>
      <span className="text-lg font-semibold text-white">{config.title}</span>
    </div>
    <button
      onClick={onClose}
      className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
    >
      <X size={20} />
    </button>
  </div>
);

const SidebarStats = ({ stats }: { stats: SidebarStats[] }) => (
  <div className="p-4 border-b border-white/20">
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className={stat.color}>{stat.icon}</span>
            <span className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</span>
          </div>
          <div className="text-lg font-semibold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const OptionItem = ({ option, onClose }: { option: SidebarOption; onClose: () => void }) => {
  const content = (
    <>
      <div className="flex items-center space-x-3">
        <span className="text-white/80">{option.icon}</span>
        <span className="text-white/90">{option.name}</span>
      </div>
      {option.badge && (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          {option.badge}
        </span>
      )}
    </>
  );

  const baseClasses = "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5";

  if (option.href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={option.href}
          className={baseClasses}
          onClick={onClose}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={option.onClick}
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
};

const GridOption = ({ option }: { option: SidebarOption }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={option.onClick}
    className="flex flex-col items-center p-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors group"
  >
    <div className="p-2 rounded-lg mb-2 text-white/80 bg-white/5 group-hover:bg-white/10 transition-colors">
      {option.icon}
    </div>
    <span className="text-xs text-white/90 text-center font-medium">
      {option.name}
    </span>
  </motion.button>
);

const SidebarSectionComponent = ({ section, onClose }: { section: SidebarSection; onClose: () => void }) => (
  <div className="p-4 border-b border-white/20 last:border-b-0">
    <div className="flex items-center space-x-2 mb-3">
      {section.icon && (
        <span className="text-white/60">
          {section.icon}
        </span>
      )}
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
        {section.title}
      </h3>
    </div>
    
    {section.layout === 'grid' ? (
      <div className="grid grid-cols-2 gap-2">
        {section.options.map((option) => (
          <GridOption key={option.id} option={option} />
        ))}
      </div>
    ) : (
      <div className="space-y-1">
        {section.options.map((option) => (
          <OptionItem key={option.id} option={option} onClose={onClose} />
        ))}
      </div>
    )}
  </div>
);

const AccountInfo = ({ config }: { config: SecondarySidebarConfig }) => {
  if (!config.accountInfo) return null;

  return (
    <div className="p-4 border-t border-white/20 bg-white/5">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          {config.accountInfo.avatar ? (
            <img 
              src={config.accountInfo.avatar} 
              alt="Account" 
              className="w-8 h-8 rounded-full" 
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {config.title.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {config.accountInfo.name}
          </p>
          <p className="text-xs text-white/60 truncate">
            {config.accountInfo.status}
          </p>
        </div>
        <div className={`w-2 h-2 ${config.accountInfo.statusColor} rounded-full`}></div>
      </div>
    </div>
  );
};

const SecondarySidebar = ({ isOpen, onClose, config }: SecondarySidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useClickOutside(sidebarRef, onClose, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Secondary Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-64 top-0 h-full w-80 border-r border-gray-200 shadow-lg z-30 overflow-y-auto"
            style={{ backgroundColor: '#1e2155' }}
          >
            {/* Header */}
            <SidebarHeader config={config} onClose={onClose} />

            {/* Stats */}
            {config.stats && <SidebarStats stats={config.stats} />}
            
            {/* Dynamic Sections */}
            <div className="flex-1">
              {config.sections.map((section) => (
                <SidebarSectionComponent 
                  key={section.title} 
                  section={section} 
                  onClose={onClose} 
                />
              ))}
            </div>

            {/* Account Info */}
            <AccountInfo config={config} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SecondarySidebar;