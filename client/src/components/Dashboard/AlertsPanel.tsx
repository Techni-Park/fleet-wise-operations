
import React from 'react';
import { AlertTriangle, Clock, FileX, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'maintenance' | 'document' | 'inspection' | 'urgent';
  title: string;
  description: string;
  vehicle: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'document',
    title: 'Assurance expirée',
    description: 'Contrat d\'assurance expiré',
    vehicle: 'ABC-123',
    dueDate: 'Expiré depuis 2 jours',
    priority: 'critical'
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Maintenance préventive',
    description: 'Révision des 20 000 km dépassée',
    vehicle: 'XYZ-789',
    dueDate: 'Retard de 500 km',
    priority: 'high'
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Contrôle technique',
    description: 'À effectuer dans les 5 prochains jours',
    vehicle: 'DEF-456',
    dueDate: 'Dans 5 jours',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'urgent',
    title: 'Panne signalée',
    description: 'Problème moteur rapporté par le conducteur',
    vehicle: 'GHI-012',
    dueDate: 'Signalé aujourd\'hui',
    priority: 'critical'
  }
];

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'maintenance':
      return Wrench;
    case 'document':
      return FileX;
    case 'inspection':
      return Clock;
    case 'urgent':
      return AlertTriangle;
    default:
      return AlertTriangle;
  }
};

const getPriorityColor = (priority: Alert['priority']) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-500 text-white';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getPriorityBorder = (priority: Alert['priority']) => {
  switch (priority) {
    case 'critical':
      return 'border-l-red-500';
    case 'high':
      return 'border-l-orange-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-blue-500';
    default:
      return 'border-l-gray-500';
  }
};

const AlertsPanel = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alertes prioritaires
        </h3>
        <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-1 rounded-full">
          {alerts.filter(a => a.priority === 'critical').length} critiques
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          
          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",
                getPriorityBorder(alert.priority)
              )}
            >
              <div className="flex items-start space-x-3">
                <div className={cn("p-2 rounded-lg", getPriorityColor(alert.priority))}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </h4>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {alert.vehicle}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alert.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {alert.dueDate}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-3 space-x-2">
                <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200">
                  Traiter
                </button>
                <button className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors duration-200">
                  Reporter
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
        Voir toutes les alertes
      </button>
    </div>
  );
};

export default AlertsPanel;
