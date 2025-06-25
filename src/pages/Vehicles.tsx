
import React, { useState } from 'react';
import { Car, Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* En-tête de page */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestion des véhicules
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez votre flotte de véhicules et suivez leur état
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total véhicules</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{vehicles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vehicles.filter(v => v.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">En maintenance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vehicles.filter(v => v.status === 'maintenance').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vehicles.filter(v => v.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
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
              
              <div className="flex gap-2">
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
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
          </div>

          {/* Tableau des véhicules */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plaque</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Kilométrage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prochaine maintenance</TableHead>
                  <TableHead>Assurance</TableHead>
                  <TableHead>Contrôle technique</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                    <TableCell>{new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{new Date(vehicle.insurance).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{new Date(vehicle.technicalControl).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Vehicles;
