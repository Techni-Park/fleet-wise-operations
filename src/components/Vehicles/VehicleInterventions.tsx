
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VehicleInterventionsProps {
  vehicleId: string;
}

const VehicleInterventions: React.FC<VehicleInterventionsProps> = ({ vehicleId }) => {
  // Données d'exemple
  const interventions = [
    {
      id: '1',
      type: 'Maintenance',
      title: 'Révision 20 000 km',
      status: 'completed',
      priority: 'medium',
      date: '2024-05-15',
      technician: 'Pierre Martin',
      duration: '2h30',
      cost: 250.00
    },
    {
      id: '2',
      type: 'Nettoyage',
      title: 'Nettoyage complet',
      status: 'in_progress',
      priority: 'low',
      date: '2024-06-10',
      technician: 'Marie Dubois',
      duration: '1h00',
      cost: 45.00
    },
    {
      id: '3',
      type: 'Réparation',
      title: 'Changement pneu avant',
      status: 'scheduled',
      priority: 'high',
      date: '2024-06-20',
      technician: 'Jean Leroy',
      duration: '45min',
      cost: 120.00
    }
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

  return (
    <div className="space-y-6">
      {/* En-tête et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Interventions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Historique des interventions sur ce véhicule
          </p>
        </div>
        <Link to="/interventions/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle intervention
          </Button>
        </Link>
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
                  {interventions.filter(i => i.status === 'completed').length}
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
                  {interventions.filter(i => i.status === 'in_progress').length}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Coût total</p>
                <p className="text-xl font-bold">
                  {interventions.reduce((sum, i) => sum + i.cost, 0).toFixed(2)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions.map((intervention) => (
                <TableRow key={intervention.id}>
                  <TableCell className="font-medium">{intervention.type}</TableCell>
                  <TableCell>{intervention.title}</TableCell>
                  <TableCell>{getStatusBadge(intervention.status)}</TableCell>
                  <TableCell>{getPriorityBadge(intervention.priority)}</TableCell>
                  <TableCell>{new Date(intervention.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{intervention.technician}</TableCell>
                  <TableCell>{intervention.duration}</TableCell>
                  <TableCell>{intervention.cost.toFixed(2)}€</TableCell>
                  <TableCell>
                    <Link to={`/interventions/${intervention.id}`}>
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
    </div>
  );
};

export default VehicleInterventions;
