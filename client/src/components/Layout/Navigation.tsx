
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Home, Calendar, FileText, Settings, Users, AlertTriangle, BarChart3, Wrench, X, Menu, Database, Server, Sliders, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/context/SettingsContext';

interface NavigationProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Navigation = ({ isOpen = true, onToggle }: NavigationProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { settings } = useSettings();

  const navigationItems = [
    { icon: Home, label: 'Tableau de bord', path: '/' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Car, label: 'Véhicules', path: '/vehicles' },
    { icon: Wrench, label: 'Interventions', path: '/interventions' },
    { icon: Calendar, label: 'Planning', path: '/planning' },
    { icon: AlertTriangle, label: 'Alertes', path: '/alerts' },
    { icon: BarChart3, label: 'Rapports', path: '/reports' },
    { icon: Users, label: 'Utilisateurs', path: '/users' },
    { icon: Database, label: 'MySQL', path: '/mysql' },
    { icon: Sliders, label: 'Champs personnalisés', path: '/custom-fields' },
    { icon: Smartphone, label: 'PWA Settings', path: '/pwa-settings' },
    { icon: Settings, label: 'Paramètres', path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Navigation Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile Navigation Sidebar */}
        <nav className={`
          fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {settings?.RAISON_SOCIALE || 'FleetTracker Pro'}
              </h2>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-[1.02]'
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
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav className={`
      bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-300
      ${isOpen ? 'w-64' : 'w-16'}
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {isOpen && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-opacity duration-200">
              {settings?.RAISON_SOCIALE || 'FleetTracker Pro'}
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-auto"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-[1.02]'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium transition-opacity duration-200">{item.label}</span>
                  )}
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
