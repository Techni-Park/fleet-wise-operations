import React from 'react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { usePWASync } from '../../hooks/usePWASync';
import { useAuth } from '../../context/AuthContext';
import { Wifi, WifiOff, Download, Database, AlertCircle, CheckCircle } from 'lucide-react';

export function PWAStatusIndicator() {
  const { status, totalPending, storagePercentage } = usePWASync();
  const { isPreloading } = useAuth();

  const getStatusColor = () => {
    if (!status.isOnline) return 'destructive';
    if (isPreloading) return 'default';
    if (totalPending > 0) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Hors ligne';
    if (isPreloading) return 'Synchronisation...';
    if (totalPending > 0) return `${totalPending} en attente`;
    return 'Synchronisé';
  };

  const getStatusIcon = () => {
    if (!status.isOnline) return <WifiOff className="h-3 w-3" />;
    if (isPreloading) return <Download className="h-3 w-3 animate-pulse" />;
    if (totalPending > 0) return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const formatLastSync = () => {
    if (!status.lastSync) return 'Jamais';
    const now = new Date();
    const diff = now.getTime() - status.lastSync.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return 'Il y a plus de 24h';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getStatusColor()} className="flex items-center gap-1 cursor-help">
            {getStatusIcon()}
            <span className="text-xs">{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Connexion:</span>
              <div className="flex items-center gap-1">
                {status.isOnline ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span>{status.isOnline ? 'En ligne' : 'Hors ligne'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Stockage:</span>
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                <span>{storagePercentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Dernière sync:</span>
              <span>{formatLastSync()}</span>
            </div>
            
            {totalPending > 0 && (
              <div className="flex items-center justify-between text-orange-600">
                <span>En attente:</span>
                <span>{totalPending} élément(s)</span>
              </div>
            )}
            
            {isPreloading && (
              <div className="text-blue-600">
                Pré-chargement en cours...
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 