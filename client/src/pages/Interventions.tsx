import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, User, AlertTriangle, Loader, RefreshCw, Car, Info, Grid3X3, List, MapPin } from 'lucide-react';
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

  const loadInterventions = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/interventions', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        // Utilisateur non authentifié, rediriger vers la page de connexion
        console.log('Utilisateur non authentifié, redirection vers /login');
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setInterventions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des interventions:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  // Fonction pour formater le statut
  const formatStatus = (status: number) => {
    const statusMap: { [key: number]: { label: string; variant: string } } = {
      0: { label: 'Planifiée', variant: 'secondary' },
      1: { label: 'En cours', variant: 'default' },
      9: { label: 'Terminée', variant: 'secondary' },
      10: { label: 'Annulée', variant: 'destructive' }
    };
    return statusMap[status] || { label: 'Inconnu', variant: 'secondary' };
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateString: string, timeString: string) => {
    if (!dateString) return '-';
    const date = formatDate(dateString);
    const time = timeString || '';
    return time ? `${date} ${time}` : date;
  };

  // Filtrage des interventions
  const filteredInterventions = interventions.filter(intervention =>
    (intervention.LIB50?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.DEMANDEUR?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.CDUSER?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Composant d'affichage en liste
  const ListViewCard = ({ intervention }: { intervention: any }) => {
    const status = formatStatus(intervention.ST_INTER);
    
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Informations principales */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-lg truncate max-w-md">
                  {intervention.LIB50 || 'Libellé non renseigné'}
                </h3>
                <Badge variant={status.variant as any}>
                  {status.label}
                </Badge>
                {intervention.SUR_SITE === 1 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    Sur site
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Technicien:</strong> {intervention.CDUSER || '-'}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Car className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Véhicule:</strong> {intervention.CLE_MACHINE_CIBLE || '-'}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Début:</strong> {formatDateTime(intervention.DT_INTER_DBT, intervention.HR_DEBUT)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    <strong>Client:</strong> {intervention.DEMANDEUR || '-'}
                  </span>
                </div>
              </div>
              
              {intervention.USDEF_LIB && (
                <div className="text-sm text-gray-500">
                  <Badge variant="outline" className="text-xs">
                    {intervention.USDEF_LIB}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 lg:flex-col">
              <Link to={`/interventions/${intervention.IDINTERVENTION}`}>
                <Button variant="ghost" size="sm" title="Voir le détail">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`}>
                <Button variant="ghost" size="sm" title="Modifier">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Composant d'affichage en grille (existant)
  const GridViewCard = ({ intervention }: { intervention: any }) => {
    const status = formatStatus(intervention.ST_INTER);
    
    return (
      <Card key={intervention.IDINTERVENTION} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-4">
            <span className="truncate">
              {intervention.LIB50 || 'Libellé non renseigné'}
            </span>
            <Badge variant={status.variant as any} className="flex-shrink-0">
              {status.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Demandeur: {intervention.DEMANDEUR || '-'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Début: {formatDate(intervention.DT_INTER_DBT)} {intervention.HR_DEBUT}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Fin: {formatDate(intervention.DT_INTER_FIN)} {intervention.HR_FIN}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Utilisateur: {intervention.CDUSER || '-'}</span>
          </div>
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Machine Cible: {intervention.CLE_MACHINE_CIBLE || '-'}</span>
          </div>
          {intervention.USDEF_LIB && (
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{intervention.USDEF_LIB}</span>
            </div>
          )}
        </CardContent>
        <div className="flex justify-end p-4 border-t">
          <Link to={`/interventions/${intervention.IDINTERVENTION}`}>
            <Button variant="ghost" size="sm" title="Voir le détail">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`}>
            <Button variant="ghost" size="sm" title="Modifier">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
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
        {/* En-tête avec actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Interventions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {interventions.length} interventions dans la base MySQL
            </p>
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{interventions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {interventions.filter(i => i.ST_INTER === 1).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {interventions.filter(i => i.ST_INTER === 9).length}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sur site</p>
                  <p className="text-2xl font-bold text-red-600">
                    {interventions.filter(i => i.SUR_SITE === 1).length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par libellé, demandeur ou utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {/* Boutons de mode d'affichage */}
                <div className="flex rounded-lg border">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affichage des interventions */}
        {filteredInterventions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune intervention trouvée
          </div>
        ) : viewMode === 'grid' ? (
          /* Affichage en grille */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInterventions.map((intervention) => (
              <GridViewCard key={intervention.IDINTERVENTION} intervention={intervention} />
            ))}
          </div>
        ) : (
          /* Affichage en liste */
          <div className="space-y-4">
            {filteredInterventions.map((intervention) => (
              <ListViewCard key={intervention.IDINTERVENTION} intervention={intervention} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Interventions;