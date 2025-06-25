
import React from 'react';
import { AlertTriangle, Calendar, FileText, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VehicleAlertsProps {
  vehicleId: string;
}

const VehicleAlerts: React.FC<VehicleAlertsProps> = ({ vehicleId }) => {
  const alerts = [
    {
      id: '1',
      type: 'maintenance',
      priority: 'high',
      title: 'Maintenance préventive due',
      description: 'Le véhicule a atteint 45 000 km, une révision est recommandée',
      dueDate: '2024-06-25',
      icon: Wrench
    },
    {
      id: '2',
      type: 'document',
      priority: 'medium',
      title: 'Contrôle technique à renouveler',
      description: 'Le contrôle technique expire dans 4 mois',
      dueDate: '2024-10-20',
      icon: FileText
    },
    {
      id: '3',
      type: 'insurance',
      priority: 'low',
      title: 'Assurance à renouveler',
      description: 'L\'assurance expire dans 6 mois',
      dueDate: '2024-12-31',
      icon: Calendar
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Critique';
      case 'medium':
        return 'Important';
      case 'low':
        return 'Info';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Alertes du véhicule</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Notifications importantes concernant ce véhicule
        </p>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Aucune alerte pour ce véhicule</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Alert key={alert.id} variant={alert.priority === 'high' ? 'destructive' : 'default'}>
                <IconComponent className="h-4 w-4" />
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge variant={getPriorityColor(alert.priority) as any}>
                        {getPriorityText(alert.priority)}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-1">
                      {alert.description}
                    </AlertDescription>
                    <p className="text-sm text-gray-500 mt-2">
                      Échéance: {new Date(alert.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </Alert>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleAlerts;
