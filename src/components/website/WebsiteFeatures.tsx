'use client';

import { motion } from 'framer-motion';
import { Globe, Monitor, Zap, Shield } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface WebsiteFeaturesProps {
  hoveredFeature: number | null;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

const WebsiteFeatures = ({ hoveredFeature, onHoverStart, onHoverEnd }: WebsiteFeaturesProps) => {
  const features: Feature[] = [
    { 
      icon: <Globe className="w-6 h-6" />, 
      title: 'Domain Integration', 
      desc: 'Connect any domain instantly with SSL security',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      icon: <Monitor className="w-6 h-6" />, 
      title: 'Responsive Preview', 
      desc: 'Real-time preview across all device sizes',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: 'Lightning Fast', 
      desc: 'Optimized performance with CDN delivery',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Enterprise Security', 
      desc: 'Bank-level security with 99.9% uptime',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onHoverStart={() => onHoverStart(index)}
          onHoverEnd={onHoverEnd}
          className={`relative p-6 bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer
            ${hoveredFeature === index ? `${feature.borderColor} shadow-lg scale-105` : 'border-gray-200 hover:border-gray-300'}
          `}
        >
          <div className={`p-3 ${feature.bgColor} rounded-xl w-fit mb-4`}>
            <div className={feature.color}>{feature.icon}</div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.desc}</p>
          
          {hoveredFeature === index && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default WebsiteFeatures;