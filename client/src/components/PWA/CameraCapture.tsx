import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { offlineStorage } from '../../services/offlineStorage';
import { toast } from 'sonner';

interface CameraCaptureProps {
  interventionId: number;
  onCapture?: (file: File, mediaId: string) => void;
  onUploadSuccess?: (mediaId: string) => void;
  disabled?: boolean;
}

interface CapturedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  gps?: GeolocationCoordinates;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  timestamp: number;
}

export default function CameraCapture({ 
  interventionId, 
  onCapture, 
  onUploadSuccess,
  disabled = false 
}: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [gpsStatus, setGpsStatus] = useState<'unknown' | 'denied' | 'granted' | 'unavailable'>('unknown');

  // Vérifier les permissions GPS au chargement
  React.useEffect(() => {
    checkGpsPermissions();
  }, []);

  const checkGpsPermissions = async () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setGpsStatus(result.state as any);
    } catch (error) {
      console.warn('[CameraCapture] Impossible de vérifier les permissions GPS:', error);
      setGpsStatus('unknown');
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const handleCapture = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCapturing(true);

    try {
      // Créer un aperçu de l'image
      const previewUrl = URL.createObjectURL(file);
      
      // Tenter d'obtenir la position GPS
      let gpsCoords: GeolocationCoordinates | undefined;
      try {
        const position = await getCurrentPosition();
        gpsCoords = position.coords;
        toast.success('📍 Position GPS capturée');
      } catch (error) {
        console.warn('[CameraCapture] GPS non disponible:', error);
        toast.warning('📍 Position GPS non disponible');
      }

      // Sauvegarder offline
      const mediaId = await offlineStorage.saveOfflineMedia({
        interventionId,
        file,
        type: 'photo',
        gps: gpsCoords ? {
          latitude: gpsCoords.latitude,
          longitude: gpsCoords.longitude
        } : undefined
      });

      // Créer l'objet photo local
      const newPhoto: CapturedPhoto = {
        id: mediaId,
        file,
        previewUrl,
        gps: gpsCoords,
        status: 'pending',
        timestamp: Date.now()
      };

      setPhotos(prev => [...prev, newPhoto]);
      
      // Notifier le parent
      onCapture?.(file, mediaId);
      
      // Tenter l'upload si en ligne
      if (navigator.onLine) {
        await uploadPhoto(newPhoto);
      } else {
        toast.info('📱 Photo sauvegardée offline - Sera synchronisée quand connexion disponible');
      }

    } catch (error) {
      console.error('[CameraCapture] Erreur capture:', error);
      toast.error('Erreur lors de la capture');
    } finally {
      setCapturing(false);
      // Reset de l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [interventionId, onCapture]);

  const uploadPhoto = async (photo: CapturedPhoto) => {
    try {
      // Mettre à jour le statut
      setPhotos(prev => 
        prev.map(p => p.id === photo.id ? { ...p, status: 'uploading' } : p)
      );
      
      await offlineStorage.updateMediaStatus(photo.id, 'uploading');

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('files', photo.file);
      formData.append('type', 'photo');
      formData.append('description', 'Photo prise depuis PWA');
      
      if (photo.gps) {
        formData.append('latitude', photo.gps.latitude.toString());
        formData.append('longitude', photo.gps.longitude.toString());
      }

      // Upload vers le serveur
      const response = await fetch(`/api/pwa/interventions/${interventionId}/media`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur upload: ${response.status}`);
      }

      const result = await response.json();
      
      // Mettre à jour le statut
      setPhotos(prev => 
        prev.map(p => p.id === photo.id ? { ...p, status: 'uploaded' } : p)
      );
      
      await offlineStorage.updateMediaStatus(photo.id, 'uploaded');
      
      toast.success('📸 Photo uploadée avec succès');
      onUploadSuccess?.(photo.id);

    } catch (error) {
      console.error('[CameraCapture] Erreur upload:', error);
      
      // Mettre à jour le statut d'erreur
      setPhotos(prev => 
        prev.map(p => p.id === photo.id ? { ...p, status: 'error' } : p)
      );
      
      await offlineStorage.updateMediaStatus(photo.id, 'error');
      
      toast.error('Erreur upload - Sera réessayé lors de la synchronisation');
    }
  };

  const retryUpload = async (photo: CapturedPhoto) => {
    if (navigator.onLine) {
      await uploadPhoto(photo);
    } else {
      toast.warning('Connexion requise pour réessayer l\'upload');
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      await offlineStorage.deleteOfflineMedia(photoId);
      setPhotos(prev => {
        const photo = prev.find(p => p.id === photoId);
        if (photo) {
          URL.revokeObjectURL(photo.previewUrl);
        }
        return prev.filter(p => p.id !== photoId);
      });
      toast.success('Photo supprimée');
    } catch (error) {
      console.error('[CameraCapture] Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const triggerCapture = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const getStatusColor = (status: CapturedPhoto['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'uploading': return 'bg-blue-500';
      case 'uploaded': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: CapturedPhoto['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'uploading': return 'Upload...';
      case 'uploaded': return 'Uploadé';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Capture Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Capture Photo
          </CardTitle>
          <CardDescription>
            Prenez des photos avec géolocalisation automatique
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* GPS Status */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>GPS: </span>
            <Badge variant={gpsStatus === 'granted' ? 'default' : 'secondary'}>
              {gpsStatus === 'granted' && 'Autorisé'}
              {gpsStatus === 'denied' && 'Refusé'}
              {gpsStatus === 'unavailable' && 'Non disponible'}
              {gpsStatus === 'unknown' && 'Vérification...'}
            </Badge>
          </div>

          {/* Capture Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            className="hidden"
          />
          
          <Button
            onClick={triggerCapture}
            disabled={capturing || disabled}
            className="w-full"
            size="lg"
          >
            {capturing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Capture en cours...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Prendre une photo
              </>
            )}
          </Button>

          {/* Network Status */}
          {!navigator.onLine && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Mode hors ligne - Les photos seront synchronisées automatiquement
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photos capturées ({photos.length})</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.previewUrl}
                      alt="Photo capturée"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Status Badge */}
                  <Badge
                    className={`absolute top-2 left-2 text-white ${getStatusColor(photo.status)}`}
                  >
                    {getStatusText(photo.status)}
                  </Badge>
                  
                  {/* GPS Indicator */}
                  {photo.gps && (
                    <MapPin className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow-md" />
                  )}
                  
                  {/* Actions */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {photo.status === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryUpload(photo)}
                          className="h-8 w-8 p-0"
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removePhoto(photo.id)}
                        className="h-8 w-8 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="mt-2 text-xs text-gray-600">
                    {new Date(photo.timestamp).toLocaleTimeString()}
                    {photo.gps && (
                      <div className="truncate">
                        {photo.gps.latitude.toFixed(4)}, {photo.gps.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 