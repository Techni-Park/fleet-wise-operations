import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './button';
import { Badge } from './badge';
import { Eye, MapPin, Calendar, User, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix pour les icônes Leaflet dans React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Intervention {
  IDINTERVENTION: number;
  LIB50: string;
  ST_INTER: number;
  DT_INTER_DBT: string;
  DT_INTER_FIN?: string;
  CONTACT_NOM?: string;
  CONTACT_PRENOM?: string;
  CONTACT_RAISON_SOCIALE?: string;
  VEHICULE_LIB_MACHINE?: string;
  ADRESSE1?: string;
  VILLE?: string;
  CPOSTAL?: string;
  latitude?: number;
  longitude?: number;
}

interface InterventionsMapProps {
  interventions: Intervention[];
  className?: string;
  height?: string;
}

// Couleurs des pins selon le statut
const getStatusColor = (status: number): string => {
  switch (status) {
    case 9: return '#22c55e'; // Terminée - Vert
    case 1: return '#3b82f6'; // En cours - Bleu
    case 0: return '#f59e0b'; // Planifiée - Orange
    case 10: return '#ef4444'; // Annulée - Rouge
    default: return '#6b7280'; // Défaut - Gris
  }
};

// Créer des icônes colorées
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">●</div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Composant pour ajuster la vue de la carte
function MapUpdater({ interventions }: { interventions: Intervention[] }) {
  const map = useMap();

  useEffect(() => {
    if (interventions.length > 0) {
      const validInterventions = interventions.filter(i => i.latitude && i.longitude);
      
      if (validInterventions.length > 0) {
        const bounds = validInterventions.map(i => [i.latitude!, i.longitude!] as [number, number]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [interventions, map]);

  return null;
}

export function InterventionsMap({ interventions, className = "", height = "500px" }: InterventionsMapProps) {
  const [geocodedInterventions, setGeocodedInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const geocodingCache = useRef<Map<string, { lat: number; lng: number }>>(new Map());

  // Fonction de géocodage (simulation - à remplacer par un vrai service)
  const geocodeAddress = async (address: string, ville: string, cpostal: string): Promise<{ lat: number; lng: number } | null> => {
    const fullAddress = `${address}, ${ville} ${cpostal}, France`.trim();
    
    // Vérifier le cache
    if (geocodingCache.current.has(fullAddress)) {
      return geocodingCache.current.get(fullAddress)!;
    }

    try {
      // Utiliser Nominatim (OpenStreetMap) pour le géocodage gratuit
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          
          // Mettre en cache
          geocodingCache.current.set(fullAddress, coords);
          return coords;
        }
      }
    } catch (error) {
      console.error('Erreur géocodage:', error);
    }

    return null;
  };

  // Géocoder les interventions
  useEffect(() => {
    const geocodeInterventions = async () => {
      setLoading(true);
      const geocoded: Intervention[] = [];

      for (const intervention of interventions) {
        // Si déjà géocodé, l'ajouter directement
        if (intervention.latitude && intervention.longitude) {
          geocoded.push(intervention);
          continue;
        }

        // Essayer de géocoder si on a une adresse
        if (intervention.ADRESSE1 && intervention.VILLE) {
          const coords = await geocodeAddress(
            intervention.ADRESSE1,
            intervention.VILLE,
            intervention.CPOSTAL || ''
          );

          if (coords) {
            geocoded.push({
              ...intervention,
              latitude: coords.lat,
              longitude: coords.lng
            });
          }
          
          // Délai pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setGeocodedInterventions(geocoded);
      setLoading(false);
    };

    if (interventions.length > 0) {
      geocodeInterventions();
    } else {
      setGeocodedInterventions([]);
      setLoading(false);
    }
  }, [interventions]);

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 9:
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 1:
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 0:
        return <Badge className="bg-orange-100 text-orange-800">Planifiée</Badge>;
      case 10:
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">Statut {status}</Badge>;
    }
  };

  // Position par défaut (France)
  const defaultCenter: [number, number] = [46.603354, 1.888334];

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center">
          <Navigation className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Géocodage des adresses...</p>
        </div>
      </div>
    );
  }

  if (geocodedInterventions.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Aucune intervention avec adresse géolocalisable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater interventions={geocodedInterventions} />

        {geocodedInterventions.map((intervention) => (
          <Marker
            key={intervention.IDINTERVENTION}
            position={[intervention.latitude!, intervention.longitude!]}
            icon={createColoredIcon(getStatusColor(intervention.ST_INTER))}
          >
            <Popup className="intervention-popup" maxWidth={300}>
              <div className="p-2 space-y-3">
                {/* En-tête avec statut */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">
                    {intervention.LIB50 || 'Intervention sans libellé'}
                  </h3>
                  {getStatusBadge(intervention.ST_INTER)}
                </div>

                {/* Informations client */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="font-medium">
                      {intervention.CONTACT_RAISON_SOCIALE || 
                       `${intervention.CONTACT_PRENOM || ''} ${intervention.CONTACT_NOM || ''}`.trim() ||
                       'Client non défini'}
                    </span>
                  </div>

                  {/* Véhicule */}
                  {intervention.VEHICULE_LIB_MACHINE && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{intervention.VEHICULE_LIB_MACHINE}</span>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-orange-600 flex-shrink-0" />
                    <span>
                      {formatDate(intervention.DT_INTER_DBT)}
                      {intervention.DT_INTER_FIN && intervention.DT_INTER_FIN !== intervention.DT_INTER_DBT && 
                       ` → ${formatDate(intervention.DT_INTER_FIN)}`
                      }
                    </span>
                  </div>

                  {/* Adresse */}
                  <div className="flex items-start gap-2">
                    <Navigation className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      {intervention.ADRESSE1}
                      {intervention.VILLE && `, ${intervention.VILLE}`}
                      {intervention.CPOSTAL && ` ${intervention.CPOSTAL}`}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-2 border-t border-gray-200">
                  <Link to={`/interventions/${intervention.IDINTERVENTION}`}>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Voir l'intervention
                    </Button>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border z-[1000]">
        <h4 className="text-xs font-semibold mb-2">Statuts</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(0) }}></div>
            <span>Planifiée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(1) }}></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(9) }}></div>
            <span>Terminée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(10) }}></div>
            <span>Annulée</span>
          </div>
        </div>
      </div>
    </div>
  );
} 