'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ReactNode } from 'react';

interface SalaryStatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  progress: number;
  index: number;
}

export const SalaryStatsCard = ({
  title,
  value,
  change,
  icon,
  color,
  bgColor,
  progress,
  index
}: SalaryStatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${bgColor} mr-4`}>
                <div className={color}>
                  {icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{change}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};