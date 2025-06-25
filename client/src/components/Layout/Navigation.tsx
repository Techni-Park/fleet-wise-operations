
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Home, Calendar, FileText, Settings, Users, AlertTriangle, BarChart3, Wrench } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Tableau de bord', path: '/' },
    { icon: Car, label: 'Véhicules', path: '/vehicles' },
    { icon: Wrench, label: 'Interventions', path: '/interventions' },
    { icon: Calendar, label: 'Planning', path: '/planning' },
    { icon: AlertTriangle, label: 'Alertes', path: '/alerts' },
    { icon: BarChart3, label: 'Rapports', path: '/reports' },
    { icon: Users, label: 'Utilisateurs', path: '/users' },
    { icon: Settings, label: 'Paramètres', path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
          FleetTracker Pro
        </h2>
        
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
