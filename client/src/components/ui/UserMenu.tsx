import React from 'react';
import { User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  CDUSER: string;
  active: number;
  IDUSER?: number;
  NOMFAMILLE?: string;
  PRENOM?: string;
  IADMIN?: number;
}

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

export default function UserMenu({ user, onLogout, isMobile = false }: UserMenuProps) {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getInitials = () => {
    const firstInitial = (user.first_name || user.PRENOM)?.charAt(0)?.toUpperCase() || '';
    const lastInitial = (user.last_name || user.NOMFAMILLE)?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const getAvatarColor = () => {
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
      'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600'
    ];
    const hash = user.CDUSER?.charCodeAt(0) || 0;
    return colors[hash % colors.length];
  };

  const displayName = `${user.first_name || user.PRENOM} ${user.last_name || user.NOMFAMILLE}`;
  const displayEmail = user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`h-auto p-2 ${isMobile ? 'w-full justify-start' : ''} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200`}
        >
          <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : ''}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className={`text-white text-sm font-semibold ${getAvatarColor()}`}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {!isMobile && (
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {displayEmail}
                </p>
              </div>
            )}
            
            {isMobile && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {displayEmail}
                </p>
              </div>
            )}
            
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Mon Profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 