'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesIcon } from '@/components/Icons';
import { Activity } from '@/types/Sales';

interface RecentActivitiesProps {
  activities: Activity[];
  loading?: boolean;
  onActivityClick?: (activity: Activity) => void;
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  maxHeight?: string;
  showPriority?: boolean;
}

const RecentActivities = ({
  activities,
  loading = false,
  onActivityClick,
  title = "Recent Activities",
  description = "Latest activities in the system",
  emptyStateTitle = "No activities yet",
  emptyStateDescription = "Activities will appear here as they occur",
  maxHeight = "max-h-96",
  showPriority = true
}: RecentActivitiesProps) => {
  
  const getActivityBgColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getActivityPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <SalesIcon size={24} className="text-gray-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">{emptyStateTitle}</h3>
            <p className="text-xs text-gray-500">{emptyStateDescription}</p>
          </div>
        ) : (
          <div className={`space-y-3 ${maxHeight} overflow-y-auto`}>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  onActivityClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onActivityClick?.(activity)}
              >
                <div className={`${getActivityBgColor(activity.priority)} p-2 rounded-full`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{activity.time}</span>
                    {showPriority && (
                      <>
                        <span className="mx-1">•</span>
                        <span className={getActivityPriorityColor(activity.priority)}>
                          {activity.priority}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;