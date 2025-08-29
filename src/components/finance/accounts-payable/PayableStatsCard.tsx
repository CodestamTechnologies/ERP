import { Card, CardContent } from '@/components/ui/card';

interface PayableStatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  progress: number;
  index: number;
}

export const PayableStatsCard = ({ title, value, change, icon, color, bgColor, progress, index }: PayableStatsCardProps) => (
  <Card className={`hover:shadow-md transition-all duration-300 ${bgColor} border-l-4 ${color.replace('text-', 'border-')}`}
        style={{ animationDelay: `${index * 100}ms` }}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-sm text-gray-500">{change}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${color}`}>
          {icon}
        </div>
      </div>
      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);