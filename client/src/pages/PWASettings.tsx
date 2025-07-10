import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { TravelMode } from '../components/PWA/TravelMode';
import { usePWASync } from '../hooks/usePWASync';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../hooks/use-toast';
import { autoSync } from '../services/autoSync';
import { offlineStorage } from '../services/offlineStorage';
import { 
  Settings, 
  Smartphone, 
  Download, 
  RefreshCw, 
  Clock, 
  Database, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Shield
} from 'lucide-react';

export default function PWASettings() {
  const { toast } = useToast();
  const { user, isPreloading, preloadResults } = useAuth();
  const { settings, loading: settingsLoading, error: settingsError } = useSettings();
  const { status, syncResults, error, storagePercentage, totalPending, refreshStatus, startPreload } = usePWASync();
  
  const [preloadConfig, setPreloadConfig] = useState({
    enabled: true,
    vehicles: true,
    contacts: true,
    anomalies: true,
    machines: true,
    recentInterventions: true,
    maxVehicles: 100,
    maxContacts: 50,
    syncInterval: 120
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreloadConfig();
  }, []);

  const loadPreloadConfig = async () => {
    try {
      const config = await autoSync.getPreloadConfig();
      setPreloadConfig(config);
    } catch (error) {
      console.error('Erreur chargement config:', error);
    }
  };

  const savePreloadConfig = async () => {
    setIsSaving(true);
    try {
      await autoSync.setPreloadConfig(preloadConfig);
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres de pré-chargement ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualPreload = async () => {
    try {
      const results = await startPreload();
      const successCount = results.filter(r => r.success).length;
      toast({
        title: "Pré-chargement terminé",
        description: `${successCount}/${results.length} entités synchronisées`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const clearAllData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les données offline ?')) {
      return;
    }

    try {
      await offlineStorage.clearAllData();
      await refreshStatus();
      toast({
        title: "Données supprimées",
        description: "Toutes les données offline ont été effacées",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Jamais';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Paramètres PWA
          </h1>
          <p className="text-muted-foreground">
            Configuration de l'application hors ligne et synchronisation
          </p>
        </div>
        
        <Button onClick={refreshStatus} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Statut général */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Statut PWA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {status.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {status.isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm">
                Stockage: {storagePercentage}%
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Dernière sync: {formatLastSync(status.lastSync)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {totalPending > 0 ? (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">
                {totalPending} en attente
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Stockage utilisé</span>
              <span>{formatBytes(status.storageUsed)} / {formatBytes(status.storageQuota)}</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration du pré-chargement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Pré-chargement automatique
          </CardTitle>
          <CardDescription>
            Configurez quelles données charger automatiquement au login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Activer le pré-chargement</Label>
            <Switch 
              checked={preloadConfig.enabled}
              onCheckedChange={(checked) => 
                setPreloadConfig(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {preloadConfig.enabled && (
            <>
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Véhicules</Label>
                    <Switch 
                      checked={preloadConfig.vehicles}
                      onCheckedChange={(checked) => 
                        setPreloadConfig(prev => ({ ...prev, vehicles: checked }))
                      }
                    />
                  </div>
                  
                  {preloadConfig.vehicles && (
                    <div>
                      <Label>Maximum véhicules</Label>
                      <Input
                        type="number"
                        value={preloadConfig.maxVehicles}
                        onChange={(e) => 
                          setPreloadConfig(prev => ({ 
                            ...prev, 
                            maxVehicles: parseInt(e.target.value) || 100 
                          }))
                        }
                        min={1}
                        max={500}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Contacts</Label>
                    <Switch 
                      checked={preloadConfig.contacts}
                      onCheckedChange={(checked) => 
                        setPreloadConfig(prev => ({ ...prev, contacts: checked }))
                      }
                    />
                  </div>
                  
                  {preloadConfig.contacts && (
                    <div>
                      <Label>Maximum contacts</Label>
                      <Input
                        type="number"
                        value={preloadConfig.maxContacts}
                        onChange={(e) => 
                          setPreloadConfig(prev => ({ 
                            ...prev, 
                            maxContacts: parseInt(e.target.value) || 50 
                          }))
                        }
                        min={1}
                        max={200}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Anomalies</Label>
                  <Switch 
                    checked={preloadConfig.anomalies}
                    onCheckedChange={(checked) => 
                      setPreloadConfig(prev => ({ ...prev, anomalies: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Machines</Label>
                  <Switch 
                    checked={preloadConfig.machines}
                    onCheckedChange={(checked) => 
                      setPreloadConfig(prev => ({ ...prev, machines: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Interventions récentes</Label>
                  <Switch 
                    checked={preloadConfig.recentInterventions}
                    onCheckedChange={(checked) => 
                      setPreloadConfig(prev => ({ ...prev, recentInterventions: checked }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Intervalle de synchronisation (minutes)</Label>
                <Input
                  type="number"
                  value={preloadConfig.syncInterval}
                  onChange={(e) => 
                    setPreloadConfig(prev => ({ 
                      ...prev, 
                      syncInterval: parseInt(e.target.value) || 120 
                    }))
                  }
                  min={5}
                  max={1440}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Fréquence de synchronisation automatique en arrière-plan
                </p>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={savePreloadConfig} disabled={isSaving}>
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleManualPreload}
              disabled={isPreloading}
            >
              {isPreloading ? "Chargement..." : "Pré-charger maintenant"}
            </Button>
          </div>

          {/* Résultats du dernier pré-chargement */}
          {preloadResults.length > 0 && (
            <div className="space-y-2">
              <Label>Dernier pré-chargement</Label>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {preloadResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{result.entity}</span>
                    </div>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? `${result.count} éléments` : 'Erreur'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode voyage */}
      <TravelMode />

      {/* Paramètres de l'application */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres de l'application
          </CardTitle>
          <CardDescription>
            Configuration générale de l'application depuis PARAMAPPLI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settingsLoading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Chargement des paramètres...</p>
            </div>
          ) : settingsError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors du chargement des paramètres: {settingsError}
              </AlertDescription>
            </Alert>
          ) : settings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom de l'entreprise</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.RAISON_SOCIALE || 'Non défini'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.EMAIL || 'Non défini'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Adresse</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.ADRESSE || 'Non définie'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ville</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.VILLE || 'Non définie'} {settings.CPOSTAL && `(${settings.CPOSTAL})`}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>SIRET</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.SIRET || 'Non défini'}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Devise</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {settings.CD_DEVISE || 'EUR'}
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Aucun paramètre d'application trouvé.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="pt-4">
            <Button variant="outline" onClick={() => window.location.href = '/settings'}>
              Modifier les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Actions avancées
          </CardTitle>
          <CardDescription>
            Gestion des données et maintenance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ces actions peuvent affecter les données hors ligne. Utilisez avec précaution.
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="destructive" 
            onClick={clearAllData}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Effacer toutes les données offline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 