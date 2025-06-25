
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Interventions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Données d'exemple
  const interventions = [
    {
      id: '1',
      title: 'Révision 20 000 km',
      type: 'Maintenance',
      vehicle: { plate: 'AB-123-CD', model: 'Renault Clio' },
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2024-05-15',
      completedDate: '2024-05-15',
      technician: 'Pierre Martin',
      duration: '2h30',
      cost: 250.00
    },
    {
      id: '2',
      title: 'Nettoyage complet intérieur/extérieur',
      type: 'Nettoyage',
      vehicle: { plate: 'CD-456-EF', model: 'Peugeot 308' },
      status: 'in_progress',
      priority: 'low',
      scheduledDate: '2024-06-10',
      completedDate: null,
      technician: 'Marie Dubois',
      duration: '1h00',
      cost: 45.00
    },
    {
      id: '3',
      title: 'Changement pneu avant droit',
      type: 'Réparation',
      vehicle: { plate: 'GH-789-IJ', model: 'Ford Focus' },
      status: 'scheduled',
      priority: 'high',
      scheduledDate: '2024-06-20',
      completedDate: null,
      technician: 'Jean Leroy',
      duration: '45min',
      cost: 120.00
    },
    {
      id: '4',
      title: 'Convoyage vers garage partenaire',
      type: 'Convoyage',
      vehicle: { plate: 'KL-012-MN', model: 'Volkswagen Golf' },
      status: 'scheduled',
      priority: 'medium',
      scheduledDate: '2024-06-18',
      completedDate: null,
      technician: 'Paul Durand',
      duration: '1h30',
      cost: 80.00
    },
    {
      id: '5',
      title: 'Service conciergerie - livraison client',
      type: 'Conciergerie',
      vehicle: { plate: 'OP-345-QR', model: 'Citroën C3' },
      status: 'completed',
      priority: 'low',
      scheduledDate: '2024-06-05',
      completedDate: '2024-06-05',
      technician: 'Sophie Martin',
      duration: '2h00',
      cost: 60.00
    }
  ];

  const stats = [
    { label: 'Total interventions', value: interventions.length, icon: Calendar, color: 'text-blue-600' },
    { label: 'En cours', value: interventions.filter(i => i.status === 'in_progress').length, icon: Clock, color: 'text-orange-600' },
    { label: 'Planifiées', value: interventions.filter(i => i.status === 'scheduled').length, icon: User, color: 'text-purple-600' },
    { label: 'Terminées', value: interventions.filter(i => i.status === 'completed').length, icon: AlertTriangle, color: 'text-green-600' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'scheduled':
        return <Badge className="bg-orange-100 text-orange-800">Planifiée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Haute</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Basse</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const filteredInterventions = interventions.filter(intervention =>
    intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Interventions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestion et suivi des interventions sur la flotte
              </p>
            </div>
            <Link to="/interventions/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle intervention
              </Button>
            </Link>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <IconComponent className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filtres et recherche */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une intervention..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Tableau des interventions */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des interventions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Intervention</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Date prévue</TableHead>
                    <TableHead>Technicien</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{intervention.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{intervention.vehicle.plate}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {intervention.vehicle.model}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{intervention.type}</TableCell>
                      <TableCell>{getStatusBadge(intervention.status)}</TableCell>
                      <TableCell>{getPriorityBadge(intervention.priority)}</TableCell>
                      <TableCell>
                        {new Date(intervention.scheduledDate).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{intervention.technician}</TableCell>
                      <TableCell>{intervention.duration}</TableCell>
                      <TableCell>{intervention.cost.toFixed(2)}€</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/interventions/${intervention.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Link to={`/interventions/${intervention.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </Link>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Interventions;
