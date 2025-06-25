
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  Settings, 
  Users, 
  BarChart3, 
  AlertTriangle,
  FileText,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Tableau de bord' },
    { path: '/vehicles', icon: Car, label: 'Véhicules' },
    { path: '/interventions', icon: Wrench, label: 'Interventions' },
    { path: '/planning', icon: Calendar, label: 'Planning' },
    { path: '/checklists', icon: FileText, label: 'Check-lists' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alertes' },
    { path: '/users', icon: Users, label: 'Utilisateurs' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          FleetTracker Pro
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gestion de flotte avancée
        </p>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-105"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Système opérationnel
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Dernière synchronisation : Il y a 2 min
        </p>
      </div>
    </nav>
  );
};

export default Navigation;
