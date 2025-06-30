import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../../hooks/use-toast';
import { autoSync, TravelModeConfig, SyncResult } from '../../services/autoSync';
import { 
  MapPin, 
  Download, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Car,
  Users,
  Plane
} from 'lucide-react';

export function TravelMode() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleIds, setVehicleIds] = useState('');
  const [contactIds, setContactIds] = useState('');
  const [gpsRadius, setGpsRadius] = useState(50);
  const [expiryHours, setExpiryHours] = useState(48);
  const [lastResults, setLastResults] = useState<SyncResult[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadTravelConfig();
  }, []);

  const loadTravelConfig = async () => {
    try {
      const config = await autoSync.getTravelConfig();
      setIsEnabled(config.enabled);
      setVehicleIds(config.vehicleIds.join(', '));
      setContactIds(config.contactIds.join(', '));
      setGpsRadius(config.gpsRadius);
      setExpiryHours(config.expiryHours);
      
      if (config.centerLat && config.centerLng) {
        setCurrentPosition({ lat: config.centerLat, lng: config.centerLng });
      }
    } catch (error) {
      console.error('[TravelMode] Erreur chargement config:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS non disponible",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast({
          title: "Position détectée",
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
        });
      },
      (error) => {
        toast({
          title: "Erreur GPS",
          description: "Impossible d'obtenir votre position",
          variant: "destructive"
        });
      }
    );
  };

  const handleEnableTravelMode = async () => {
    setIsLoading(true);
    try {
      const vehicleIdArray = vehicleIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      const contactIdArray = contactIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

      const results = await autoSync.enableTravelMode(vehicleIdArray, contactIdArray);
      setLastResults(results);
      setIsEnabled(true);

      const successCount = results.filter(r => r.success).length;
      toast({
        title: "Mode voyage activé",
        description: `${successCount} éléments pré-chargés`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTravelMode = async () => {
    try {
      await autoSync.disableTravelMode();
      setIsEnabled(false);
      setLastResults([]);
      
      toast({
        title: "Mode voyage désactivé",
        description: "Les données restent disponibles jusqu'à expiration",
      });
    } catch (error) {
      toast({
        title: "Erreur désactivation",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const formatLastSync = (timestamp: number) => {
    if (!timestamp) return 'Jamais';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Mode Voyage
        </CardTitle>
        <CardDescription>
          Pré-chargez des données spécifiques pour vos déplacements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statut actuel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>Mode voyage</Label>
            {isEnabled && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Activé
              </Badge>
            )}
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={isEnabled ? handleDisableTravelMode : undefined}
            disabled={isLoading}
          />
        </div>

        <Separator />

        {/* Configuration */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                IDs Véhicules
              </Label>
              <Input
                value={vehicleIds}
                onChange={(e) => setVehicleIds(e.target.value)}
                placeholder="1, 2, 3..."
                disabled={isEnabled}
              />
            </div>
            
            <div>
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                IDs Contacts
              </Label>
              <Input
                value={contactIds}
                onChange={(e) => setContactIds(e.target.value)}
                placeholder="10, 20, 30..."
                disabled={isEnabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gpsRadius">Rayon GPS (km)</Label>
              <Input
                id="gpsRadius"
                type="number"
                value={gpsRadius}
                onChange={(e) => setGpsRadius(parseInt(e.target.value) || 50)}
                min={1}
                max={200}
                disabled={isEnabled}
              />
            </div>
            
            <div>
              <Label htmlFor="expiryHours">Expiration (heures)</Label>
              <Input
                id="expiryHours"
                type="number"
                value={expiryHours}
                onChange={(e) => setExpiryHours(parseInt(e.target.value) || 48)}
                min={1}
                max={168}
                disabled={isEnabled}
              />
            </div>
          </div>

          {/* Position GPS */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Position actuelle
            </Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={isEnabled}
              >
                Détecter GPS
              </Button>
              {currentPosition && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Lat: {currentPosition.lat.toFixed(4)}</span>
                  <span>Lng: {currentPosition.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bouton d'action principal */}
        {!isEnabled && (
          <Button 
            onClick={handleEnableTravelMode} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Chargement..." : "Activer le mode voyage"}
          </Button>
        )}

        {/* Résultats du dernier pré-chargement */}
        {lastResults.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Dernier pré-chargement
            </Label>
            <div className="grid gap-2">
              {lastResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{result.entity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? `${result.count} éléments` : 'Erreur'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatLastSync(result.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations */}
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Le mode voyage pré-charge des données spécifiques pour une utilisation hors ligne prolongée. 
            Les données restent disponibles même après désactivation jusqu'à leur expiration.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
} 