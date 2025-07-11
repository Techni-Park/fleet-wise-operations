import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserMenu from '../ui/UserMenu';
import { PWAStatusIndicator } from '../PWA/PWAStatusIndicator';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isDark, setIsDark] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Mobile Logo */}
          {isMobile && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              FleetTracker
            </h1>
          )}

          {/* Search Bar */}
          <div className={`relative transition-all duration-300 ${
            isMobile ? (isSearchOpen ? 'flex-1' : 'w-0 overflow-hidden') : 'max-w-md w-full'
          }`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher véhicules, interventions..."
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onFocus={() => isMobile && setIsSearchOpen(true)}
              onBlur={() => isMobile && setIsSearchOpen(false)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Toggle */}
          {isMobile && !isSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* PWA Status Indicator */}
          {user && <PWAStatusIndicator />}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          {/* User Profile / Login */}
          {loading ? (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          ) : user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate('/login')} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <LogIn className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
