import React, { useState, useEffect } from 'react';
import { Car, Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, CheckCircle, Clock, Loader, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicules, setVehicules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVehicules = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/vehicules');
      const data = await response.json();
      setVehicules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
      setVehicules([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVehicules();
  }, []);

  // Fonction pour formater le statut de la machine
  const formatMachineStatus = (status: number) => {
    const statusMap: { [key: number]: { label: string; variant: string } } = {
      1: { label: 'Active', variant: 'default' },
      2: { label: 'Maintenance', variant: 'destructive' },
      3: { label: 'Hors service', variant: 'secondary' },
      4: { label: 'Archivée', variant: 'outline' }
    };
    return statusMap[status] || { label: 'Inconnu', variant: 'secondary' };
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour calculer si le contrôle technique est expiré
  const isControlExpired = (dateString: string) => {
    if (!dateString) return false;
    const controlDate = new Date(dateString);
    const today = new Date();
    return controlDate < today;
  };

  // Filtrage des véhicules
  const filteredVehicules = vehicules.filter(vehicule =>
    (vehicule.IMMAT?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicule.MARQUE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicule.MODELE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicule.LIB_MACHINE?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des véhicules...</p>
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
              Véhicules
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {vehicules.length} véhicules dans la base MySQL (VEHICULE + MACHINE_MNT)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => loadVehicules(true)} 
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link to="/vehicles/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau véhicule
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{vehicules.length}</p>
                </div>
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vehicules.filter(v => v.ID2_ETATMACHINE === 1).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {vehicules.filter(v => v.ID2_ETATMACHINE === 2).length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contrôles expirés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {vehicules.filter(v => isControlExpired(v.DT_CTRLTECH)).length}
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
                    placeholder="Rechercher par immatriculation, marque, modèle..."
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

        {/* Tableau des véhicules */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicules.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucun véhicule trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Les tables VEHICULE et MACHINE_MNT sont actuellement vides dans votre base MySQL.
                </p>
                <p className="text-sm text-gray-400">
                  Cette interface est configurée pour afficher les données combinées dès qu'elles seront disponibles.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Immatriculation</TableHead>
                      <TableHead>Véhicule (VEHICULE)</TableHead>
                      <TableHead>Machine (MACHINE_MNT)</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Kilométrage</TableHead>
                      <TableHead>Contrôle technique</TableHead>
                      <TableHead>Assurance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicules.map((vehicule) => {
                      const status = formatMachineStatus(vehicule.ID2_ETATMACHINE);
                      const controlExpired = isControlExpired(vehicule.DT_CTRLTECH);
                      
                      return (
                        <TableRow key={vehicule.IDVEHICULE}>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              V#{vehicule.IDVEHICULE} / M#{vehicule.IDMACHINE}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {vehicule.IMMAT || '-'}
                            </div>
                            {vehicule.NUM_IDENTIF && (
                              <div className="text-xs text-gray-500">
                                VIN: {vehicule.NUM_IDENTIF}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {vehicule.MARQUE} {vehicule.MODELE}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vehicule.CARBURANT && `${vehicule.CARBURANT} • `}
                                {vehicule.PUISSANCE_ADMIN ? `${vehicule.PUISSANCE_ADMIN} CV` : 'Puissance non renseignée'}
                              </div>
                              {vehicule.GENRE_NATIONAL && (
                                <div className="text-xs text-gray-400">
                                  Genre: {vehicule.GENRE_NATIONAL}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vehicule.CD_MACHINE || '-'}</div>
                              <div className="text-sm text-gray-500">
                                {vehicule.LIB_MACHINE || 'Libellé non renseigné'}
                              </div>
                              {vehicule.TYPE_MACHINE && (
                                <div className="text-xs text-gray-400">
                                  Type: {vehicule.TYPE_MACHINE}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant as any}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              {/* Kilométrage du véhicule (table VEHICULE) */}
                              <div className="font-medium">
                                {vehicule.KMACTUEL ? `${vehicule.KMACTUEL.toLocaleString()} km` : '-'}
                              </div>
                              <div className="text-xs text-gray-500">Véhicule</div>
                              {/* Kilométrage de la machine (table MACHINE_MNT) */}
                              {vehicule.KILOMETRAGE && vehicule.KILOMETRAGE !== vehicule.KMACTUEL && (
                                <>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {vehicule.KILOMETRAGE.toLocaleString()} km
                                  </div>
                                  <div className="text-xs text-gray-400">Machine</div>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={controlExpired ? 'text-red-600' : ''}>
                              <div>{formatDate(vehicule.DT_CTRLTECH)}</div>
                              {controlExpired && (
                                <div className="text-xs text-red-500">Expiré</div>
                              )}
                              {vehicule.DT_CTRLPOLLUTION && (
                                <div className="text-xs text-gray-500">
                                  Pollution: {formatDate(vehicule.DT_CTRLPOLLUTION)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{formatDate(vehicule.DT_ECHASS)}</div>
                              {vehicule.NUMCONTRASS && (
                                <div className="text-sm text-gray-500">{vehicule.NUMCONTRASS}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link to={`/vehicles/${vehicule.IDVEHICULE}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/vehicles/${vehicule.IDVEHICULE}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Vehicles;