
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Car, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Loader, Wrench, Info, Tag, Fuel, Gauge, CalendarDays, ShieldCheck, MapPin } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleInterventions from '@/components/Vehicles/VehicleInterventions';
import VehicleAlerts from '@/components/Vehicles/VehicleAlerts';
import VehicleDocuments from '@/components/Vehicles/VehicleDocuments';
import VehiclePhotos from '@/components/Vehicles/VehiclePhotos';
import VehicleAnomalies from '@/components/Vehicles/VehicleAnomalies';
import VehicleStats from '@/components/Vehicles/VehicleStats';

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicules/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        console.error('Failed to fetch vehicle');
        setVehicle(null);
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Actif</Badge>;
      case 2:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" />Maintenance</Badge>;
      case 3:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Hors service</Badge>;
      case 4:
        return <Badge variant="outline">Archivée</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const isControlExpired = (dateString: string) => {
    if (!dateString) return false;
    const controlDate = new Date(dateString);
    const today = new Date();
    return controlDate < today;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement du véhicule...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!vehicle) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Véhicule introuvable
          </h1>
          <Link to="/vehicles">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux véhicules
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const controlExpired = isControlExpired(vehicle.DT_CTRLTECH);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/vehicles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {vehicle.IMMAT || 'Véhicule sans immatriculation'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {vehicle.MARQUE} {vehicle.MODELE} - {vehicle.TYPE_MACHINE}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to={`/vehicles/${vehicle.IDVEHICULE}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                  {getStatusBadge(vehicle.ID2_ETATMACHINE)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modèle</p>
                  <p className="font-medium">{vehicle.MODELE || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Marque</p>
                  <p className="font-medium">{vehicle.MARQUE || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium">{vehicle.TYPE_MACHINE || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Année de mise en fonction</p>
                  <p className="font-medium">{formatDate(vehicle.DT_MISEENFONCTION)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kilométrage</p>
                  <p className="font-medium">{vehicle.KMACTUEL ? `${vehicle.KMACTUEL.toLocaleString()} km` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carburant</p>
                  <p className="font-medium">{vehicle.CARBURANT || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puissance</p>
                  <p className="font-medium">{vehicle.PUISSANCEW ? `${vehicle.PUISSANCEW} W` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">VIN</p>
                  <p className="font-medium">{vehicle.NUM_IDENTIF || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Numéro de série</p>
                  <p className="font-medium">{vehicle.NUM_SERIE || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                  <p className="font-medium">
                    {vehicle.ADRESSE1 || ''} {vehicle.ADRESSE2 || ''}<br/>
                    {vehicle.CPOSTAL || ''} {vehicle.VILLE || ''}
                  </p>
                  { (vehicle.ADRESSE1 || vehicle.CPOSTAL || vehicle.VILLE) && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${vehicle.ADRESSE1 || ''} ${vehicle.CPOSTAL || ''} ${vehicle.VILLE || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      <MapPin className="w-3 h-3 inline mr-1" /> Voir sur Google Maps
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onglets principaux */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="interventions">Interventions</TabsTrigger>
                <TabsTrigger value="alerts">Alertes</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu du véhicule</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Maintenance & Contrôles</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Prochaine maintenance</p>
                            <p className="font-medium">{formatDate(vehicle.DT_PROCH_MNT)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Fin de garantie</p>
                            <p className="font-medium">{formatDate(vehicle.DT_EXP_GARANTIE)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Contrôle technique</p>
                            <p className={`font-medium ${controlExpired ? 'text-red-600' : ''}`}>
                              {formatDate(vehicle.DT_CTRLTECH)}
                              {controlExpired && <span className="text-xs ml-2">(Expiré)</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <ShieldCheck className="w-5 h-5 mr-2 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-600">Assurance</p>
                            <p className="font-medium">{formatDate(vehicle.DT_ECHASS)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Détails supplémentaires</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Tag className="w-5 h-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Code machine</p>
                            <p className="font-medium">{vehicle.CD_MACHINE || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Info className="w-5 h-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Libellé machine</p>
                            <p className="font-medium">{vehicle.LIB_MACHINE || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Gauge className="w-5 h-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Kilométrage machine</p>
                            <p className="font-medium">{vehicle.KILOMETRAGE ? `${vehicle.KILOMETRAGE.toLocaleString()} km` : '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Fuel className="w-5 h-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Type de carburant</p>
                            <p className="font-medium">{vehicle.CARBURANT || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Wrench className="w-5 h-5 mr-2 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Observations</p>
                            <p className="font-medium">{vehicle.OBSERVATIONS || 'Aucune'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interventions">
                <VehicleInterventions vehicleId={vehicle.IDVEHICULE} />
              </TabsContent>
              
              <TabsContent value="alerts">
                <VehicleAlerts vehicleId={vehicle.IDVEHICULE} />
              </TabsContent>
              
              <TabsContent value="documents">
                <VehicleDocuments vehicle={vehicle} />
              </TabsContent>
              
              <TabsContent value="photos">
                <VehiclePhotos vehicleId={vehicle.IDVEHICULE} />
              </TabsContent>
              
              <TabsContent value="anomalies">
                <VehicleAnomalies vehicleId={vehicle.IDVEHICULE} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default VehicleDetails;
