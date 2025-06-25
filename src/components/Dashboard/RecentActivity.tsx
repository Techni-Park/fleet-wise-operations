
import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'intervention' | 'alert' | 'maintenance' | 'complete';
  title: string;
  description: string;
  time: string;
  vehicle?: string;
  priority?: 'high' | 'medium' | 'low';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'intervention',
    title: 'Nouvelle intervention programmée',
    description: 'Nettoyage complet - Véhicule ABC-123',
    time: 'Il y a 10 min',
    vehicle: 'ABC-123',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Alerte maintenance',
    description: 'Contrôle technique expiré dans 5 jours',
    time: 'Il y a 25 min',
    vehicle: 'XYZ-789',
    priority: 'high'
  },
  {
    id: '3',
    type: 'complete',
    title: 'Intervention terminée',
    description: 'Maintenance préventive - Changement huile',
    time: 'Il y a 1h',
    vehicle: 'DEF-456',
    priority: 'low'
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Check-list validée',
    description: 'Contrôle sécurité véhicule de livraison',
    time: 'Il y a 2h',
    vehicle: 'GHI-012',
    priority: 'medium'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'intervention':
      return Wrench;
    case 'alert':
      return AlertTriangle;
    case 'maintenance':
      return Clock;
    case 'complete':
      return CheckCircle;
    default:
      return Clock;
  }
};

const getActivityColor = (type: Activity['type'], priority?: Activity['priority']) => {
  if (type === 'alert' && priority === 'high') {
    return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
  }
  
  switch (type) {
    case 'intervention':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    case 'alert':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
    case 'maintenance':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    case 'complete':
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activité récente
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div className={cn("p-2 rounded-lg", getActivityColor(activity.type, activity.priority))}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h4>
                  {activity.priority && (
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        activity.priority === 'high' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                        activity.priority === 'medium' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                        activity.priority === 'low' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      )}
                    >
                      {activity.priority === 'high' ? 'Urgent' : activity.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                  {activity.vehicle && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {activity.vehicle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
        Voir toute l'activité
      </button>
    </div>
  );
};

export default RecentActivity;
