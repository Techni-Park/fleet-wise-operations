import React, { useState } from 'react';
import { Car, Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  mileage: number;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  insurance: string;
  technicalControl: string;
}

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Données d'exemple
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'AB-123-CD',
      model: 'Renault Clio',
      year: 2020,
      mileage: 45000,
      status: 'active',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15',
      insurance: '2024-12-31',
      technicalControl: '2024-10-20'
    },
    {
      id: '2',
      plate: 'EF-456-GH',
      model: 'Peugeot 308',
      year: 2019,
      mileage: 68000,
      status: 'maintenance',
      lastMaintenance: '2024-04-10',
      nextMaintenance: '2024-07-10',
      insurance: '2024-11-15',
      technicalControl: '2024-09-05'
    },
    {
      id: '3',
      plate: 'IJ-789-KL',
      model: 'Ford Transit',
      year: 2021,
      mileage: 32000,
      status: 'active',
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-09-01',
      insurance: '2025-01-20',
      technicalControl: '2024-11-30'
    },
    {
      id: '4',
      plate: 'MN-012-OP',
      model: 'Volkswagen Golf',
      year: 2018,
      mileage: 89000,
      status: 'inactive',
      lastMaintenance: '2024-03-20',
      nextMaintenance: '2024-06-20',
      insurance: '2024-08-10',
      technicalControl: '2024-07-15'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" />Maintenance</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Inactif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des véhicules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez votre flotte de véhicules et suivez leur état
          </p>
        </div>
        <Link to="/vehicles/create">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Ajouter un véhicule</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-2 lg:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Car className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 truncate">Total véhicules</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{vehicles.length}</p>
            </div>
          </div>
        </div>
            
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-2 lg:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 truncate">Actifs</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                {vehicles.filter(v => v.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
            
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-2 lg:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 truncate">En maintenance</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                {vehicles.filter(v => v.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
            
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-2 lg:p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 truncate">Inactifs</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                {vehicles.filter(v => v.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par plaque ou modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactif</option>
            </select>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filtrer</span>
              <span className="sm:hidden">Filtres</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tableau des véhicules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Plaque</TableHead>
                <TableHead className="min-w-[150px]">Modèle</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[80px]">Année</TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">Kilométrage</TableHead>
                <TableHead className="min-w-[100px]">Statut</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[140px]">Prochaine maintenance</TableHead>
                <TableHead className="hidden xl:table-cell min-w-[120px]">Assurance</TableHead>
                <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell className="font-medium">{vehicle.model}</TableCell>
                  <TableCell className="hidden sm:table-cell">{vehicle.year}</TableCell>
                  <TableCell className="hidden md:table-cell">{vehicle.mileage.toLocaleString()} km</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        vehicle.status === 'active' ? 'default' :
                        vehicle.status === 'maintenance' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {vehicle.status === 'active' ? 'Actif' :
                       vehicle.status === 'maintenance' ? 'Maint.' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{vehicle.nextMaintenance}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm">{vehicle.insurance}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Link to={`/vehicles/${vehicle.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/vehicles/${vehicle.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Vehicles;
