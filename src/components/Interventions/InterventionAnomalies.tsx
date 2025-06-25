
import React from 'react';
import { AlertTriangle, Plus, Eye, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface InterventionAnomaliesProps {
  interventionId: string;
  vehicleId: string;
}

const InterventionAnomalies: React.FC<InterventionAnomaliesProps> = ({ interventionId, vehicleId }) => {
  const anomalies = [
    {
      id: '1',
      title: 'Rayure sur portière gauche',
      severity: 'orange',
      status: 'open',
      reportedDate: '2024-05-20',
      reportedBy: 'Jean Dupont',
      description: 'Rayure visible sur la portière côté conducteur',
      willTreat: true,
      estimatedCost: 150.00
    },
    {
      id: '2',
      title: 'Voyant moteur allumé',
      severity: 'rouge',
      status: 'open',
      reportedDate: '2024-06-05',
      reportedBy: 'Marie Martin',
      description: 'Le voyant moteur s\'allume de façon intermittente',
      willTreat: true,
      estimatedCost: 200.00
    },
    {
      id: '3',
      title: 'Bruit de freinage',
      severity: 'jaune',
      status: 'open',
      reportedDate: '2024-06-10',
      reportedBy: 'Pierre Leroy',
      description: 'Bruit anormal lors du freinage',
      willTreat: false,
      estimatedCost: 75.00
    },
    {
      id: '4',
      title: 'Fissure pare-brise',
      severity: 'orange',
      status: 'open',
      reportedDate: '2024-06-12',
      reportedBy: 'Sophie Bernard',
      description: 'Petite fissure en bas à droite du pare-brise',
      willTreat: false,
      estimatedCost: 300.00
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

  const anomaliesToTreat = anomalies.filter(a => a.willTreat);
  const totalCostToTreat = anomaliesToTreat.reduce((sum, a) => sum + a.estimatedCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Anomalies à traiter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Anomalies du véhicule qui seront traitées lors de cette intervention
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une anomalie
        </Button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Anomalies à traiter</p>
                <p className="text-xl font-bold">{anomaliesToTreat.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coût estimé</p>
                <p className="text-xl font-bold">{totalCostToTreat.toFixed(2)}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total anomalies</p>
                <p className="text-xl font-bold">{anomalies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des anomalies */}
      <Card>
        <CardHeader>
          <CardTitle>Anomalies du véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Traiter</TableHead>
                <TableHead>Anomalie</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Date signalée</TableHead>
                <TableHead>Coût estimé</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((anomaly) => (
                <TableRow key={anomaly.id} className={anomaly.willTreat ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                  <TableCell>
                    <Checkbox 
                      checked={anomaly.willTreat}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{anomaly.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {anomaly.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Signalé par: {anomaly.reportedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                  <TableCell>
                    {new Date(anomaly.reportedDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className={anomaly.willTreat ? 'font-bold text-blue-600' : ''}>
                      {anomaly.estimatedCost.toFixed(2)}€
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {anomaly.willTreat && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions sur les anomalies sélectionnées */}
      {anomaliesToTreat.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé des anomalies à traiter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomaliesToTreat.map((anomaly) => (
                <div key={anomaly.id} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">{anomaly.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{getSeverityBadge(anomaly.severity)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{anomaly.estimatedCost.toFixed(2)}€</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Coût total estimé</span>
                  <span className="text-blue-600">{totalCostToTreat.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterventionAnomalies;
