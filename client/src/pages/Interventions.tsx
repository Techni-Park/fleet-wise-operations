import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, User, AlertTriangle, Loader, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Interventions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInterventions = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/interventions');
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

  // Filtrage des interventions
  const filteredInterventions = interventions.filter(intervention =>
    (intervention.LIB50?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.DEMANDEUR?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intervention.CDUSER?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des interventions */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>Demandeur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead>Date fin</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterventions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        Aucune intervention trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInterventions.map((intervention) => {
                      const status = formatStatus(intervention.ST_INTER);
                      return (
                        <TableRow key={intervention.IDINTERVENTION}>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              #{intervention.IDINTERVENTION}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {intervention.LIB50 || '-'}
                              </div>
                              {intervention.USDEF_LIB && (
                                <div className="text-sm text-gray-500">
                                  {intervention.USDEF_LIB}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{intervention.DEMANDEUR || '-'}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant as any}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{intervention.CDUSER || '-'}</div>
                              {intervention.US_TEAM && (
                                <div className="text-sm text-gray-500">{intervention.US_TEAM}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDate(intervention.DT_INTER_DBT)}</div>
                              {intervention.HR_DEBUT && (
                                <div className="text-sm text-gray-500">{intervention.HR_DEBUT}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDate(intervention.DT_INTER_FIN)}</div>
                              {intervention.HR_FIN && (
                                <div className="text-sm text-gray-500">{intervention.HR_FIN}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {intervention.CLE_MACHINE_CIBLE || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link to={`/interventions/${intervention.IDINTERVENTION}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Interventions;