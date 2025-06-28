import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Calendar, Clock, User, AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VehicleInterventionsProps {
  vehicleId: number; // IDMACHINE du véhicule
}

const VehicleInterventions: React.FC<VehicleInterventionsProps> = ({ vehicleId }) => {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Charger les interventions
  const loadInterventions = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const cleMachineCible = `R${vehicleId}`;
      const response = await fetch(`/api/interventions?cle_machine_cible=${encodeURIComponent(cleMachineCible)}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInterventions(Array.isArray(data) ? data : []);
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      loadInterventions();
    }
  }, [vehicleId]);

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

  // Fonction pour déterminer la priorité basée sur le type
  const getPriorityBadge = (typeInter: number, surSite: number) => {
    if (surSite === 1) {
      return <Badge variant="destructive">Haute (Sur site)</Badge>;
    }
    
    switch (typeInter) {
      case 2: // Réparation
        return <Badge className="bg-orange-100 text-orange-800">Moyenne</Badge>;
      case 1: // Maintenance
        return <Badge className="bg-gray-100 text-gray-800">Basse</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Normale</Badge>;
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

  // Fonction pour formater la durée (approximation basée sur les heures)
  const formatDuration = (hrDebut: string, hrFin: string) => {
    if (!hrDebut || !hrFin) return '-';
    
    try {
      const [debutH, debutM] = hrDebut.split(':').map(Number);
      const [finH, finM] = hrFin.split(':').map(Number);
      
      const debutMinutes = debutH * 60 + debutM;
      const finMinutes = finH * 60 + finM;
      
      let dureeMinutes = finMinutes - debutMinutes;
      if (dureeMinutes < 0) dureeMinutes += 24 * 60; // Cas où l'intervention dépasse minuit
      
      const heures = Math.floor(dureeMinutes / 60);
      const minutes = dureeMinutes % 60;
      
      return `${heures}h${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Chargement des interventions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Interventions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Historique des interventions sur ce véhicule ({interventions.length} interventions)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => loadInterventions(true)} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Link to="/interventions/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle intervention
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold">{interventions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Terminées</p>
                <p className="text-xl font-bold">
                  {interventions.filter(i => i.ST_INTER === 9).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
                <p className="text-xl font-bold">
                  {interventions.filter(i => i.ST_INTER === 1).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sur site</p>
                <p className="text-xl font-bold">
                  {interventions.filter(i => i.SUR_SITE === 1).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des interventions */}
      {interventions.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune intervention
            </h3>
            <p className="text-gray-500 mb-4">
              Aucune intervention n'a été enregistrée pour ce véhicule.
            </p>
            <Link to="/interventions/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer la première intervention
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date début</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((intervention) => (
                  <TableRow key={intervention.IDINTERVENTION}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{intervention.LIB50 || 'Libellé non renseigné'}</p>
                        {intervention.USDEF_LIB && (
                          <p className="text-xs text-gray-500">{intervention.USDEF_LIB}</p>
                        )}
                        {intervention.SUR_SITE === 1 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 mt-1">
                            Sur site
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getInterventionType(intervention.ID2GENRE_INTER)}</TableCell>
                    <TableCell>{getStatusBadge(intervention.ST_INTER)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(intervention.DT_INTER_DBT)}</p>
                        {intervention.HR_DEBUT && (
                          <p className="text-gray-500">{intervention.HR_DEBUT}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{intervention.CDUSER || '-'}</TableCell>
                    <TableCell>
                      {formatDuration(intervention.HR_DEBUT, intervention.HR_FIN)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {intervention.CONTACT_RAISON_SOCIALE && (
                          <p className="font-medium">{intervention.CONTACT_RAISON_SOCIALE}</p>
                        )}
                        {intervention.CONTACT_NOM && intervention.CONTACT_PRENOM && (
                          <p>{intervention.CONTACT_NOM} {intervention.CONTACT_PRENOM}</p>
                        )}
                        {intervention.DEMANDEUR && (
                          <p className="text-gray-500">Dem: {intervention.DEMANDEUR}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/interventions/${intervention.IDINTERVENTION}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleInterventions;
