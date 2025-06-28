import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, User, AlertTriangle, Loader, RefreshCw, Car, Info, Grid3X3, List, MapPin, ChevronLeft, ChevronRight, Map, X, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { InterventionsMap } from '@/components/Maps/InterventionsMap';


const Interventions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });
  const [vehicleMap, setVehicleMap] = useState(() => new Map<number, any>());
  const [contactMap, setContactMap] = useState(() => new Map<number, any>());
  
  // États pour les filtres et la vue carte
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);

  // Charger toutes les données nécessaires (interventions, véhicules, contacts)
  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [interventionsRes, vehiclesRes, contactsRes] = await Promise.all([
        fetch(`/api/interventions?page=${pagination.page}&limit=${pagination.limit}`, { credentials: 'include' }),
        fetch('/api/vehicules?limit=9999', { credentials: 'include' }),
        fetch('/api/contacts?limit=9999', { credentials: 'include' })
      ]);

      if (!interventionsRes.ok || !vehiclesRes.ok || !contactsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const interventionsData = await interventionsRes.json();
      const vehiclesData = await vehiclesRes.json();
      const contactsData = await contactsRes.json();

      setInterventions(Array.isArray(interventionsData.interventions) ? interventionsData.interventions : []);
      setPagination(prev => ({ ...prev, total: interventionsData.total || 0 }));

      const allVehicles = vehiclesData.vehicles && Array.isArray(vehiclesData.vehicles) ? vehiclesData.vehicles : (Array.isArray(vehiclesData) ? vehiclesData : []);
      const allContacts = contactsData.contacts && Array.isArray(contactsData.contacts) ? contactsData.contacts : (Array.isArray(contactsData) ? contactsData : []);

      const newVehicleMap = new Map();
      allVehicles.forEach((v: any) => newVehicleMap.set(v.IDMACHINE, v));
      setVehicleMap(newVehicleMap);

      const newContactMap = new Map();
      allContacts.forEach((c: any) => newContactMap.set(c.IDCONTACT, c));
      setContactMap(newContactMap);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Fonction pour formater l'affichage des techniciens (CDUSER + US_TEAM)
  const formatTechnicienDisplay = (intervention: any) => {
    const techniciens = [];
    
    // Ajouter le technicien principal (CDUSER)
    if (intervention.TECHNICIEN_NOM || intervention.TECHNICIEN_PRENOM) {
      const mainTech = formatFullName(intervention.TECHNICIEN_NOM, intervention.TECHNICIEN_PRENOM);
      if (mainTech !== '-') {
        techniciens.push(mainTech);
      }
    }
    
    // Ajouter les techniciens de l'équipe (US_TEAM)
    if (intervention.TECHNICIEN_TEAM) {
      const teamTechs = intervention.TECHNICIEN_TEAM.split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0);
      techniciens.push(...teamTechs);
    }
    
    // Supprimer les doublons et retourner la liste
    const uniqueTechniciens = Array.from(new Set(techniciens));
    return uniqueTechniciens.length > 0 ? uniqueTechniciens.join(', ') : null;
  };

  // Options de statuts pour les filtres
  const statusOptions = [
    { value: 0, label: 'Planifiée', color: 'bg-orange-100 text-orange-800' },
    { value: 1, label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    { value: 9, label: 'Terminée', color: 'bg-green-100 text-green-800' },
    { value: 10, label: 'Annulée', color: 'bg-red-100 text-red-800' },
  ];

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setDateDebut('');
    setDateFin('');
    setSelectedStatuses([]);
  };

  // Fonction pour basculer un statut dans les filtres
  const toggleStatus = (status: number) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Filtrer les interventions localement
  const filteredInterventions = interventions.filter(intervention => {
    // Filtre par terme de recherche
    const matchesSearch = !searchTerm || (
      intervention.LIB50?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.CONTACT_RAISON_SOCIALE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.VEHICULE_LIB_MACHINE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.TECHNICIEN_NOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.TECHNICIEN_PRENOM?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtre par dates
    const interventionDate = new Date(intervention.DT_INTER_DBT);
    const matchesDateDebut = !dateDebut || interventionDate >= new Date(dateDebut);
    const matchesDateFin = !dateFin || interventionDate <= new Date(dateFin + 'T23:59:59');

    // Filtre par statuts
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(intervention.ST_INTER);

    return matchesSearch && matchesDateDebut && matchesDateFin && matchesStatus;
  });

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
          loadData();
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

    // Find vehicle - utiliser directement VEHICULE_LIB_MACHINE de la jointure
    let vehicleDisplay = 'Véhicule non défini';
    if (intervention.VEHICULE_LIB_MACHINE) {
        vehicleDisplay = intervention.VEHICULE_LIB_MACHINE;
    } else if (intervention.VEHICULE_MARQUE || intervention.VEHICULE_MODELE) {
        vehicleDisplay = `${intervention.VEHICULE_MARQUE || ''} ${intervention.VEHICULE_MODELE || ''}`.trim();
    } else if (intervention.CLE_MACHINE_CIBLE) {
        vehicleDisplay = `Machine: ${intervention.CLE_MACHINE_CIBLE}`;
    }

    // Find contact
    let contactDisplay = 'Client non défini';
    if (intervention.IDCONTACT) {
        const contact = contactMap.get(intervention.IDCONTACT);
        if (contact) {
            contactDisplay = contact.RAISON_SOCIALE || formatFullName(contact.NOM, contact.PRENOM);
        } else {
            contactDisplay = `Contact ID: ${intervention.IDCONTACT}`;
        }
    }

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
            {/* Informations principales - priorité administrative */}
            <div className="space-y-3">
              {/* Client et Date - info prioritaire */}
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <User className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="truncate font-medium">
                    {contactDisplay}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 ml-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatDate(intervention.DT_INTER_DBT)}</span>
                </div>
              </div>

              {/* Véhicule et Technicien */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  <span className="truncate">
                    {vehicleDisplay}
                  </span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0" />
                  <span className="truncate">
                    {formatTechnicienDisplay(intervention) || 'Non assigné'}
                  </span>
                </div>
              </div>

              {/* Détails secondaires */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  <span>{getInterventionType(intervention.ID2GENRE_INTER)}</span>
                </div>
                {intervention.HR_DEBUT && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{intervention.HR_DEBUT}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description si disponible */}
            {intervention.LIB_INTERVENTION && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{intervention.LIB_INTERVENTION}</p>
              </div>
            )}
          </CardContent>
        </div>

        {/* Actions */}
        <div className={`flex p-3 border-t sm:border-t-0 sm:border-l ${isListView ? 'sm:w-1/4 sm:flex-col sm:justify-center' : 'justify-end'}`}>
          <div className={`flex ${isListView ? 'flex-col space-y-1' : 'space-x-1'}`}>
            <Link to={`/interventions/${intervention.IDINTERVENTION}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full px-2" title="Voir les détails">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`} className="w-full">
              <Button variant="outline" size="sm" className="w-full px-2" title="Modifier l'intervention">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleDelete(intervention.IDINTERVENTION)}
              className="w-full px-2"
              title="Supprimer l'intervention"
            >
              <Trash2 className="w-4 h-4" />
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
              onClick={() => loadData(true)}
              disabled={refreshing} 
              variant="outline"
              size="sm"
              className="px-2"
              title="Actualiser la liste"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Link to="/interventions/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" size="sm" title="Créer une nouvelle intervention">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle
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
                  size="sm"
                  className="px-2"
                  title="Affichage en grille"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'outline'} 
                  onClick={() => setViewMode('list')}
                  size="sm"
                  className="px-2"
                  title="Affichage en liste"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'map' ? 'secondary' : 'outline'} 
                  onClick={() => setViewMode('map')}
                  size="sm"
                  className="px-2"
                  title="Affichage carte"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres avancés */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* En-tête des filtres */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-semibold">Filtres avancés</h3>
                  {(dateDebut || dateFin || selectedStatuses.length > 0) && (
                    <Badge variant="secondary" className="text-xs">
                      {filteredInterventions.length} / {interventions.length}
                    </Badge>
                  )}
                </div>
                {(dateDebut || dateFin || selectedStatuses.length > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Filtres par date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-debut" className="text-sm font-medium">
                    Date de début
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="date-debut"
                      type="date"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      className="pl-10"
                    />
                    {dateDebut && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateDebut('')}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-fin" className="text-sm font-medium">
                    Date de fin
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="date-fin"
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      className="pl-10"
                    />
                    {dateFin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateFin('')}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Filtres par statut */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Statuts</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Badge
                      key={status.value}
                      variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedStatuses.includes(status.value) 
                          ? status.color 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleStatus(status.value)}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Raccourcis de dates */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Raccourcis</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setDateDebut(today);
                      setDateFin(today);
                    }}
                    className="text-xs"
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 7));
                      setDateDebut(weekStart.toISOString().split('T')[0]);
                      setDateFin(weekEnd.toISOString().split('T')[0]);
                    }}
                    className="text-xs"
                  >
                    Cette semaine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                      setDateDebut(monthStart.toISOString().split('T')[0]);
                      setDateFin(monthEnd.toISOString().split('T')[0]);
                    }}
                    className="text-xs"
                  >
                    Ce mois
                  </Button>
                </div>
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

        {/* Affichage des interventions */}
        {filteredInterventions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || dateDebut || dateFin || selectedStatuses.length > 0 
                ? 'Aucune intervention trouvée pour ces critères' 
                : 'Aucune intervention à afficher'}
            </p>
          </div>
        ) : viewMode === 'map' ? (
          /* Vue carte */
          <InterventionsMap 
            interventions={filteredInterventions} 
            height="600px"
            className="w-full"
          />
        ) : (
          /* Vue grille ou liste */
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