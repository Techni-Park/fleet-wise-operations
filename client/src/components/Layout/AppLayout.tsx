import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Close mobile nav when screen becomes desktop
  React.useEffect(() => {
    if (!isMobile) {
      setIsNavOpen(true);
    } else {
      setIsNavOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Navigation isOpen={isNavOpen} onToggle={toggleNav} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? 'w-full' : (isNavOpen ? 'ml-0' : 'ml-0')
      }`}>
        <Header onMenuToggle={toggleNav} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;