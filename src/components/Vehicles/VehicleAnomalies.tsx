
import React from 'react';
import { AlertTriangle, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VehicleAnomaliesProps {
  vehicleId: string;
}

const VehicleAnomalies: React.FC<VehicleAnomaliesProps> = ({ vehicleId }) => {
  const anomalies = [
    {
      id: '1',
      title: 'Rayure sur portière gauche',
      severity: 'orange',
      status: 'open',
      reportedDate: '2024-05-20',
      reportedBy: 'Jean Dupont',
      description: 'Rayure visible sur la portière côté conducteur'
    },
    {
      id: '2',
      title: 'Voyant moteur allumé',
      severity: 'rouge',
      status: 'in_progress',
      reportedDate: '2024-06-05',
      reportedBy: 'Marie Martin',
      description: 'Le voyant moteur s\'allume de façon intermittente'
    },
    {
      id: '3',
      title: 'Usure pneu avant droit',
      severity: 'jaune',
      status: 'resolved',
      reportedDate: '2024-04-15',
      reportedBy: 'Pierre Leroy',
      description: 'Usure prématurée constatée lors de l\'inspection'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'rouge':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'orange':
        return <Badge className="bg-orange-100 text-orange-800">Important</Badge>;
      case 'jaune':
        return <Badge className="bg-yellow-100 text-yellow-800">Mineur</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Ouverte</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Résolue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Anomalies</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suivi des anomalies et problèmes signalés
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Signaler une anomalie
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critiques</p>
                <p className="text-xl font-bold">
                  {anomalies.filter(a => a.severity === 'rouge').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Importantes</p>
                <p className="text-xl font-bold">
                  {anomalies.filter(a => a.severity === 'orange').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mineures</p>
                <p className="text-xl font-bold">
                  {anomalies.filter(a => a.severity === 'jaune').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Résolues</p>
                <p className="text-xl font-bold">
                  {anomalies.filter(a => a.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des anomalies */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des anomalies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((anomaly) => (
                <TableRow key={anomaly.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{anomaly.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {anomaly.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                  <TableCell>{getStatusBadge(anomaly.status)}</TableCell>
                  <TableCell>
                    {new Date(anomaly.reportedDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{anomaly.reportedBy}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Voir
                    </Button>
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

export default VehicleAnomalies;
