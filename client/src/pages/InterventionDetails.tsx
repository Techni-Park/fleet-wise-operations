import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, FileText, Camera, CheckCircle, Loader, Car, MapPin, Phone, Mail } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import InterventionAnomalies from '@/components/Interventions/InterventionAnomalies';

const InterventionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [intervention, setIntervention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Charger les données de l'intervention
  useEffect(() => {
    const loadIntervention = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/interventions/${id}`, { credentials: 'include' });
        
        if (response.ok) {
          const data = await response.json();
          setIntervention(data);
        } else {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'intervention:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'intervention",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadIntervention();
    }
  }, [id, toast]);

  // Fonction pour formater le statut
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

  // Fonction pour obtenir le type d'intervention
  const getInterventionType = (typeInter: number) => {
    switch (typeInter) {
      case 1: return 'Maintenance';
      case 2: return 'Réparation';
      case 3: return 'Contrôle';
      case 4: return 'Nettoyage';
      default: return 'Non défini';
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour formater les dates avec heure
  const formatDateTime = (dateString: string, timeString: string) => {
    if (!dateString) return '-';
    
    const dateTime = timeString 
      ? `${dateString}T${timeString}`
      : dateString;
    
    return new Date(dateTime).toLocaleString('fr-FR');
  };

  // Fonction pour calculer la durée
  const calculateDuration = (hrDebut: string, hrFin: string) => {
    if (!hrDebut || !hrFin) return '-';
    
    try {
      const [debutH, debutM] = hrDebut.split(':').map(Number);
      const [finH, finM] = hrFin.split(':').map(Number);
      
      const debutMinutes = debutH * 60 + debutM;
      const finMinutes = finH * 60 + finM;
      
      let dureeMinutes = finMinutes - debutMinutes;
      if (dureeMinutes < 0) dureeMinutes += 24 * 60;
      
      const heures = Math.floor(dureeMinutes / 60);
      const minutes = dureeMinutes % 60;
      
      return `${heures}h${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return '-';
    }
  };

  // Supprimer l'intervention
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/interventions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Intervention supprimée avec succès"
        });
        navigate('/interventions');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'intervention",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement de l'intervention...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!intervention) {
    return (
      <AppLayout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Intervention non trouvée</h1>
          <Link to="/interventions">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux interventions
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/interventions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {intervention.LIB50 || 'Intervention sans libellé'}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                {intervention.VEHICULE_IMMAT && (
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    {intervention.VEHICULE_IMMAT} - {intervention.VEHICULE_MARQUE} {intervention.VEHICULE_MODELE}
                  </span>
                )}
                <span>#{intervention.IDINTERVENTION}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                  {getStatusBadge(intervention.ST_INTER)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-medium">{getInterventionType(intervention.ID2GENRE_INTER)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Technicien</p>
                  <p className="font-medium">{intervention.CDUSER || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Demandeur</p>
                  <p className="font-medium">{intervention.DEMANDEUR || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
                  <p className="font-medium">
                    {calculateDuration(intervention.HR_DEBUT, intervention.HR_FIN)}
                  </p>
                </div>
                {intervention.SUR_SITE === 1 && (
                  <div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      Sur site
                    </Badge>
                  </div>
                )}
                {intervention.USDEF_NUM > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valeur associée</p>
                    <p className="font-medium">{intervention.USDEF_NUM}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations contact */}
            {(intervention.CONTACT_NOM || intervention.CONTACT_RAISON_SOCIALE) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {intervention.CONTACT_RAISON_SOCIALE && (
                    <div>
                      <p className="font-medium">{intervention.CONTACT_RAISON_SOCIALE}</p>
                    </div>
                  )}
                  {intervention.CONTACT_NOM && intervention.CONTACT_PRENOM && (
                    <div>
                      <p>{intervention.CONTACT_NOM} {intervention.CONTACT_PRENOM}</p>
                    </div>
                  )}
                  {intervention.CONTACT_EMAIL && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {intervention.CONTACT_EMAIL}
                    </div>
                  )}
                  {intervention.CONTACT_TEL && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-1" />
                      {intervention.CONTACT_TEL}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Détails de l'intervention */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails de l'intervention</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {intervention.LIB_INTERVENTION && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {intervention.LIB_INTERVENTION}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Planning</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Date de début</p>
                            <p className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(intervention.DT_INTER_DBT)}
                              {intervention.HR_DEBUT && (
                                <span className="ml-2 text-gray-500">à {intervention.HR_DEBUT}</span>
                              )}
                            </p>
                          </div>
                          {intervention.DT_INTER_FIN && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Date de fin</p>
                              <p className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(intervention.DT_INTER_FIN)}
                                {intervention.HR_FIN && (
                                  <span className="ml-2 text-gray-500">à {intervention.HR_FIN}</span>
                                )}
                              </p>
                            </div>
                          )}
                          {intervention.DT_PROCH_INTER && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Prochaine intervention</p>
                              <p className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {formatDate(intervention.DT_PROCH_INTER)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Informations techniques</h4>
                        <div className="space-y-3">
                          {intervention.VEHICULE_CODE && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Code véhicule</p>
                              <p>{intervention.VEHICULE_CODE}</p>
                            </div>
                          )}
                          {intervention.CD_PRODUIT && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Code produit</p>
                              <p>{intervention.CD_PRODUIT}</p>
                            </div>
                          )}
                          {intervention.US_TEAM && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Équipe</p>
                              <p>{intervention.US_TEAM}</p>
                            </div>
                          )}
                          {intervention.USDEF_LIB && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Information personnalisée</p>
                              <p>{intervention.USDEF_LIB}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {intervention.LIB_PROCHINTER && (
                      <div>
                        <h4 className="font-medium mb-2">Prochaine intervention prévue</h4>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {intervention.LIB_PROCHINTER}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="anomalies">
                <InterventionAnomalies 
                  interventionId={intervention.IDINTERVENTION.toString()} 
                  vehicleId={intervention.VEHICULE_IDMACHINE?.toString() || ''}
                />
              </TabsContent>
              
              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Photos de l'intervention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-gray-500 p-8">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune photo disponible</p>
                      <p className="text-sm">Les photos d'intervention seront affichées ici</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default InterventionDetails;
