import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Car, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Loader, Wrench, Info, Tag, Fuel, Gauge, CalendarDays, ShieldCheck, MapPin, Camera, Settings, Bug, Eye } from 'lucide-react';
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
import VehicleCustomFields from '@/components/Vehicles/VehicleCustomFields';

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentInterventions, setCurrentInterventions] = useState<any[]>([]);
  const [vehicleLocation, setVehicleLocation] = useState<string>('');

  const loadVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicules/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
        
        // Charger les interventions en cours pour déterminer la localisation
        if (data.IDMACHINE) {
          await loadCurrentInterventions(data.IDMACHINE);
        }
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

  const loadCurrentInterventions = async (idMachine: number) => {
    try {
      const response = await fetch(`/api/vehicles/${idMachine}/interventions`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const interventions = await response.json();
        
        // Filtrer les interventions en cours basées sur la date/heure actuelle
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes depuis minuit
        const today = now.toISOString().split('T')[0];
        
        const activeInterventions = interventions.filter((intervention: any) => {
          // Vérifier si l'intervention est en cours aujourd'hui
          const startDate = intervention.DT_INTER_DBT;
          const endDate = intervention.DT_INTER_FIN || intervention.DT_INTER_DBT;
          
          if (!startDate) return false;
          
          // Convertir les dates pour comparaison
          const startDateStr = new Date(startDate).toISOString().split('T')[0];
          const endDateStr = new Date(endDate).toISOString().split('T')[0];
          
          // Vérifier si aujourd'hui est dans la plage de dates
          if (today < startDateStr || today > endDateStr) return false;
          
          // Si c'est aujourd'hui, vérifier les heures
          if (today === startDateStr && today === endDateStr) {
            // Même jour - vérifier les heures
            const startTime = intervention.HR_DEBUT ? 
              parseInt(intervention.HR_DEBUT.split(':')[0]) * 60 + parseInt(intervention.HR_DEBUT.split(':')[1]) : 0;
            const endTime = intervention.HR_FIN ? 
              parseInt(intervention.HR_FIN.split(':')[0]) * 60 + parseInt(intervention.HR_FIN.split(':')[1]) : 1440; // Fin de journée par défaut
            
            return currentTime >= startTime && currentTime <= endTime;
          }
          
          // Si on est entre les dates (pas le même jour), c'est actif
          return true;
        });
        
        setCurrentInterventions(activeInterventions);
        
        // Déterminer la localisation basée sur l'intervention en cours
        if (activeInterventions.length > 0) {
          const activeIntervention = activeInterventions[0];
          if (activeIntervention.CONTACT_RAISON_SOCIALE) {
            setVehicleLocation(`En intervention chez ${activeIntervention.CONTACT_RAISON_SOCIALE}`);
          } else if (activeIntervention.CONTACT_NOM && activeIntervention.CONTACT_PRENOM) {
            setVehicleLocation(`En intervention chez ${activeIntervention.CONTACT_PRENOM} ${activeIntervention.CONTACT_NOM}`);
          } else {
            setVehicleLocation('En intervention');
          }
        } else {
          setVehicleLocation('');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions en cours:', error);
      setCurrentInterventions([]);
      setVehicleLocation('');
    }
  };

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
        <div className="grid grid-cols-4 gap-6 items-start mb-8">
          {/* Colonne 1 : Informations principales (3/4 de l'espace) */}
          <div className="col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {vehicle.LIB_MACHINE || 'Véhicule sans libellé'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
              {vehicle.IMMAT || 'Non immatriculé'}
            </p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {vehicle.MARQUE} {vehicle.MODELE}
            </p>
          </div>

          {/* Colonne 2 : Boutons d'action (1/4 de l'espace) */}
          <div className="flex justify-end space-x-2">
            <Link to="/vehicles">
              <Button variant="outline" size="sm" title="Retour à la liste des véhicules">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={`/vehicles/${vehicle.IDVEHICULE}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm" title="Modifier ce véhicule">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="destructive" size="sm" title="Supprimer ce véhicule">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Identification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID Véhicule</p>
                    <p className="font-medium">#{vehicle.IDVEHICULE}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Code machine</p>
                    <p className="font-medium">{vehicle.CD_MACHINE || 'Non défini'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Immatriculation</p>
                    <p className="font-medium">{vehicle.IMMAT || 'Non immatriculé'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">VIN (Numéro d'identification)</p>
                    <p className="font-medium text-xs break-all">{vehicle.NUM_IDENTIF || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Numéro de série</p>
                    <p className="font-medium">{vehicle.NUM_SERIE || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                    {getStatusBadge(vehicle.ID2_ETATMACHINE)}
                  </div>
                  {vehicleLocation && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Localisation actuelle</p>
                      <p className="font-medium text-blue-600 text-sm">{vehicleLocation}</p>
                      {currentInterventions.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {currentInterventions.length} intervention(s) en cours
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Caractéristiques techniques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Caractéristiques techniques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Marque / Modèle</p>
                    <p className="font-medium">{vehicle.MARQUE} {vehicle.MODELE}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type de véhicule</p>
                    <p className="font-medium">{vehicle.TYPE_MACHINE || vehicle.GENRE_NATIONAL || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Carburant</p>
                    <p className="font-medium">{vehicle.CARBURANT || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Puissance</p>
                    <p className="font-medium">
                      {vehicle.PUISSANCE_ADMIN ? `${vehicle.PUISSANCE_ADMIN} CV` : 
                       vehicle.PUISSANCEW ? `${vehicle.PUISSANCEW} W` : 'Non renseignée'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Places assises</p>
                    <p className="font-medium">{vehicle.PLACES_ASSISES || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Poids (PTAC / PTR)</p>
                    <p className="font-medium">
                      {vehicle.PTAC ? `${vehicle.PTAC} kg` : '-'} / {vehicle.PTR ? `${vehicle.PTR} kg` : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Kilométrage et dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2" />
                    Kilométrage et dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kilométrage actuel</p>
                    <p className="font-medium">
                      {vehicle.KMACTUEL ? `${vehicle.KMACTUEL.toLocaleString()} km` : 
                       vehicle.KILOMETRAGE ? `${vehicle.KILOMETRAGE.toLocaleString()} km` : 'Non renseigné'}
                    </p>
                    {vehicle.KMACTUEL && vehicle.KILOMETRAGE && vehicle.KMACTUEL !== vehicle.KILOMETRAGE && (
                      <p className="text-xs text-orange-600">
                        Attention: Compteurs différents (Véhicule: {vehicle.KMACTUEL.toLocaleString()} km, Machine: {vehicle.KILOMETRAGE.toLocaleString()} km)
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date de première circulation</p>
                    <p className="font-medium">{formatDate(vehicle.DT_PREMCIRC)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date de mise en fonction</p>
                    <p className="font-medium">{formatDate(vehicle.DT_MISEENFONCTION)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Localisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                    <p className="font-medium">
                      {vehicle.ADRESSE1 || vehicle.ADRESSE2 || vehicle.CPOSTAL || vehicle.VILLE ? (
                        <>
                          {vehicle.ADRESSE1} {vehicle.ADRESSE2}<br/>
                          {vehicle.CPOSTAL} {vehicle.VILLE}
                        </>
                      ) : 'Non renseignée'}
                    </p>
                    {(vehicle.ADRESSE1 || vehicle.CPOSTAL || vehicle.VILLE) && (
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
          </div>

          {/* Onglets principaux */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </TabsTrigger>
                <TabsTrigger value="custom-fields">
                  <Settings className="w-4 h-4 mr-2" />
                  Compléments
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alertes
                </TabsTrigger>
                <TabsTrigger value="anomalies">
                  <Bug className="w-4 h-4 mr-2" />
                  Anomalies
                </TabsTrigger>
                <TabsTrigger value="interventions">
                  <Wrench className="w-4 h-4 mr-2" />
                  Interventions
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="photos">
                  <Camera className="w-4 h-4 mr-2" />
                  Photos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Résumé principal */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Résumé du véhicule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {vehicle.KMACTUEL ? vehicle.KMACTUEL.toLocaleString() : 
                             vehicle.KILOMETRAGE ? vehicle.KILOMETRAGE.toLocaleString() : '0'}
                          </div>
                          <div className="text-sm text-gray-600">Kilomètres parcourus</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {vehicle.DT_PREMCIRC ? 
                              Math.floor((new Date().getTime() - new Date(vehicle.DT_PREMCIRC).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) :
                              vehicle.DT_MISEENFONCTION ?
                                Math.floor((new Date().getTime() - new Date(vehicle.DT_MISEENFONCTION).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : '?'
                            }
                          </div>
                          <div className="text-sm text-gray-600">Années de service</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {getStatusBadge(vehicle.ID2_ETATMACHINE)}
                          </div>
                          <div className="text-sm text-gray-600">Statut actuel</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informations principales */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations principales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Car className="w-5 h-5 mr-2 text-blue-600" />
                          Identification
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Tag className="w-4 h-4 mr-2 mt-1 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">Immatriculation</p>
                              <p className="font-medium">{vehicle.IMMAT || 'Non immatriculé'}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FileText className="w-4 h-4 mr-2 mt-1 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">Code machine</p>
                              <p className="font-medium">{vehicle.CD_MACHINE || 'Non défini'}</p>
                              {vehicle.LIB_MACHINE && (
                                <p className="text-xs text-gray-500">{vehicle.LIB_MACHINE}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Info className="w-4 h-4 mr-2 mt-1 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">VIN</p>
                              <p className="font-medium text-xs break-all">{vehicle.NUM_IDENTIF || 'Non renseigné'}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Tag className="w-4 h-4 mr-2 mt-1 text-gray-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">Numéro de série</p>
                              <p className="font-medium">{vehicle.NUM_SERIE || 'Non renseigné'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Wrench className="w-5 h-5 mr-2 text-green-600" />
                          Caractéristiques
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-2 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-600">Marque & Modèle</p>
                              <p className="font-medium">{vehicle.MARQUE} {vehicle.MODELE}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-600">Type</p>
                              <p className="font-medium">{vehicle.TYPE_MACHINE || vehicle.GENRE_NATIONAL || 'Non renseigné'}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Fuel className="w-4 h-4 mr-2 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-600">Carburant</p>
                              <p className="font-medium">{vehicle.CARBURANT || 'Non renseigné'}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Gauge className="w-4 h-4 mr-2 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-600">Puissance</p>
                              <p className="font-medium">
                                {vehicle.PUISSANCE_ADMIN ? `${vehicle.PUISSANCE_ADMIN} CV` : 
                                 vehicle.PUISSANCEW ? `${vehicle.PUISSANCEW} W` : 'Non renseignée'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Maintenance & Contrôles */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Maintenance & Contrôles</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Contrôles obligatoires</h3>
                        <div className="space-y-3">
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
                            <FileText className="w-5 h-5 mr-2 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">Contrôle pollution</p>
                              <p className="font-medium">{formatDate(vehicle.DT_CTRLPOLLUTION)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <ShieldCheck className="w-5 h-5 mr-2 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-600">Assurance</p>
                              <p className="font-medium">{formatDate(vehicle.DT_ECHASS)}</p>
                              {vehicle.NUMCONTRASS && (
                                <p className="text-xs text-gray-500">N° {vehicle.NUMCONTRASS}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Maintenance</h3>
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
                              <p className="text-sm text-gray-600">Garantie</p>
                              <p className="font-medium">{formatDate(vehicle.DT_EXP_GARANTIE)}</p>
                              {vehicle.DT_DBT_GARANTIE && (
                                <p className="text-xs text-gray-500">
                                  Début: {formatDate(vehicle.DT_DBT_GARANTIE)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Wrench className="w-5 h-5 mr-2 mt-1 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-600">Observations</p>
                              <p className="font-medium">{vehicle.OBSERVATIONS || 'Aucune observation'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alertes et informations importantes */}
                  {(vehicle.KMACTUEL && vehicle.KILOMETRAGE && vehicle.KMACTUEL !== vehicle.KILOMETRAGE) && (
                    <Card className="border-orange-200">
                      <CardHeader>
                        <CardTitle className="flex items-center text-orange-600">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Attention - Compteurs kilométriques différents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {vehicle.KMACTUEL.toLocaleString()} km
                            </div>
                            <div className="text-sm text-gray-600">Compteur véhicule</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {vehicle.KILOMETRAGE.toLocaleString()} km
                            </div>
                            <div className="text-sm text-gray-600">Compteur machine</div>
                          </div>
                        </div>
                        <p className="text-sm text-orange-600 mt-3">
                          Il est recommandé de synchroniser les compteurs kilométriques.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="custom-fields">
                <VehicleCustomFields vehicleId={vehicle.IDMACHINE} />
              </TabsContent>
              
              <TabsContent value="alerts">
                <VehicleAlerts vehicleId={vehicle.IDMACHINE} />
              </TabsContent>
              
              <TabsContent value="anomalies">
                <VehicleAnomalies vehicleId={vehicle.IDMACHINE} />
              </TabsContent>
              
              <TabsContent value="interventions">
                <VehicleInterventions vehicleId={vehicle.IDMACHINE} />
              </TabsContent>
              
              <TabsContent value="documents">
                <VehicleDocuments vehicle={vehicle} />
              </TabsContent>
              
              <TabsContent value="photos">
                <VehiclePhotos vehicleId={vehicle.IDMACHINE} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default VehicleDetails;
