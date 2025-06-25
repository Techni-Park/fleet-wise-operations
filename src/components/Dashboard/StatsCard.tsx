
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  gradient: string;
}

const StatsCard = ({ title, value, change, icon: Icon, gradient }: StatsCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </h3>
          {change && (
            <div className="flex items-center">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.type === 'increase' && "text-green-600 dark:text-green-400",
                  change.type === 'decrease' && "text-red-600 dark:text-red-400",
                  change.type === 'neutral' && "text-gray-600 dark:text-gray-400"
                )}
              >
                {change.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                vs mois dernier
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
