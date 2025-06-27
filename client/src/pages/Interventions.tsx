import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, User, AlertTriangle, Loader, RefreshCw, Car, Info, Grid3X3, List, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const Interventions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  // Charger les interventions avec pagination
  const loadInterventions = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    console.log('🔍 Client: Chargement des interventions, page:', pagination.page, 'limit:', pagination.limit);

    try {
      const url = `/api/interventions?page=${pagination.page}&limit=${pagination.limit}`;
      console.log('🌐 Client: URL de requête:', url);
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      console.log('📡 Client: Statut de la réponse:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Client: Données reçues:', {
          interventionsCount: data.interventions?.length || 0,
          total: data.total,
          isArray: Array.isArray(data.interventions),
          firstIntervention: data.interventions?.[0]
        });
        
        setInterventions(Array.isArray(data.interventions) ? data.interventions : []);
        setPagination(prev => ({ ...prev, total: data.total || 0 }));
      } else {
        const errorText = await response.text();
        console.error('❌ Client: Erreur de réponse:', response.status, errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Client: Erreur lors du chargement des interventions:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

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

  // Fonction pour formater les noms complets
  const formatFullName = (nom: string, prenom: string) => {
    if (!nom && !prenom) return '-';
    return `${prenom || ''} ${nom || ''}`.trim();
  };

  // Filtrer les interventions localement
  const filteredInterventions = interventions.filter(intervention =>
    (intervention.LIB50?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.CONTACT_RAISON_SOCIALE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.VEHICULE_LIB_MACHINE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.TECHNICIEN_NOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.TECHNICIEN_PRENOM?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Gestion de la pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // Supprimer une intervention
  const handleDelete = async (interventionId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      try {
        const response = await fetch(`/api/interventions/${interventionId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          loadInterventions();
        } else {
          alert('Erreur lors de la suppression de l\'intervention');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'intervention');
      }
    }
  };

  // Composant pour le rendu des cartes
  const renderInterventionCard = (intervention: any, isListView: boolean) => {
    const cardClass = isListView
      ? "flex flex-col sm:flex-row w-full"
      : "flex flex-col";

    return (
      <Card key={intervention.IDINTERVENTION} className={cardClass}>
        <div className={`flex-grow ${isListView ? 'sm:w-2/3' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="truncate">
                {intervention.LIB50 || 'Intervention sans libellé'}
                <div className="text-sm font-normal text-gray-500 mt-1">
                  #{intervention.IDINTERVENTION}
                </div>
              </CardTitle>
              <div className="flex flex-col items-end gap-1">
                {getStatusBadge(intervention.ST_INTER)}
                {intervention.SUR_SITE === 1 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    Sur site
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-3 text-sm ${isListView ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {/* Client */}
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {intervention.CONTACT_RAISON_SOCIALE || 
                   formatFullName(intervention.CONTACT_NOM, intervention.CONTACT_PRENOM) || 
                   'Client non défini'}
                </span>
              </div>

              {/* Véhicule */}
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {intervention.VEHICULE_LIB_MACHINE || 
                   `${intervention.VEHICULE_MARQUE || ''} ${intervention.VEHICULE_MODELE || ''}`.trim() ||
                   'Véhicule non défini'}
                </span>
              </div>

              {/* Technicien */}
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {formatFullName(intervention.TECHNICIEN_NOM, intervention.TECHNICIEN_PRENOM) || 
                   intervention.CDUSER || 
                   'Non assigné'}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{formatDate(intervention.DT_INTER_DBT)}</span>
              </div>

              {/* Type d'intervention */}
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{getInterventionType(intervention.ID2GENRE_INTER)}</span>
              </div>

              {/* Heure */}
              {intervention.HR_DEBUT && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{intervention.HR_DEBUT}</span>
                </div>
              )}
            </div>

            {/* Description si disponible */}
            {intervention.LIB_INTERVENTION && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <p className="truncate">{intervention.LIB_INTERVENTION}</p>
              </div>
            )}
          </CardContent>
        </div>

        {/* Actions */}
        <div className={`flex p-4 border-t sm:border-t-0 sm:border-l ${isListView ? 'sm:w-1/3 sm:flex-col sm:justify-center' : 'justify-end'}`}>
          <div className={`flex ${isListView ? 'flex-col space-y-2' : 'space-x-2'}`}>
            <Link to={`/interventions/${intervention.IDINTERVENTION}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full flex justify-center items-center">
                <Eye className="w-4 h-4 mr-2" /> Voir
              </Button>
            </Link>
            <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`} className="w-full">
              <Button variant="outline" size="sm" className="w-full flex justify-center items-center">
                <Edit className="w-4 h-4 mr-2" /> Modifier
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(intervention.IDINTERVENTION)}
              className="w-full flex justify-center items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des interventions...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Interventions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{pagination.total} interventions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => loadInterventions(true)} 
              disabled={refreshing} 
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link to="/interventions/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle intervention
              </Button>
            </Link>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par libellé, client, véhicule, technicien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'outline'} 
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'outline'} 
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{pagination.total}</p>
                  <p className="text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {interventions.filter(i => i.ST_INTER === 9).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Terminées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {interventions.filter(i => i.ST_INTER === 1).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {interventions.filter(i => i.SUR_SITE === 1).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Sur site</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des interventions */}
        {filteredInterventions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'Aucune intervention trouvée pour cette recherche' : 'Aucune intervention à afficher'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredInterventions.map((intervention) => 
              renderInterventionCard(intervention, viewMode === 'list')
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} sur {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={pagination.page >= totalPages}
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Interventions; 