
import React, { useState } from 'react';
import { AlertTriangle, Bell, Filter, CheckCircle, X, Eye } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Alerts = () => {
  const [filter, setFilter] = useState('all');
  
  const alerts = [
    {
      id: '1',
      title: 'Maintenance critique requise',
      description: 'Le véhicule AB-123-CD a dépassé les 50 000 km sans révision majeure',
      vehicle: 'AB-123-CD',
      priority: 'high',
      category: 'maintenance',
      date: '2024-06-25',
      status: 'active'
    },
    {
      id: '2',
      title: 'Contrôle technique expiré',
      description: 'Le contrôle technique du véhicule EF-456-GH a expiré',
      vehicle: 'EF-456-GH',
      priority: 'high',
      category: 'compliance',
      date: '2024-06-20',
      status: 'active'
    },
    {
      id: '3',
      title: 'Assurance à renouveler',
      description: 'L\'assurance du véhicule IJ-789-KL expire dans 30 jours',
      vehicle: 'IJ-789-KL',
      priority: 'medium',
      category: 'insurance',
      date: '2024-06-15',
      status: 'active'
    },
    {
      id: '4',
      title: 'Kilométrage élevé détecté',
      description: 'Usage intensif détecté sur le véhicule MN-012-OP',
      vehicle: 'MN-012-OP',
      priority: 'low',
      category: 'usage',
      date: '2024-06-10',
      status: 'resolved'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Critique</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Important</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'Maintenance';
      case 'compliance':
        return 'Conformité';
      case 'insurance':
        return 'Assurance';
      case 'usage':
        return 'Utilisation';
      default:
        return category;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'resolved' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'resolved') return alert.status === 'resolved';
    return alert.priority === filter;
  });

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.priority === 'high');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Alertes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Surveillance et notifications de la flotte
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Marquer tout comme lu
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{criticalAlerts.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alertes critiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bell className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{activeAlerts.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alertes actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {alerts.filter(a => a.status === 'resolved').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alertes résolues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{alerts.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total alertes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex gap-4 mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les alertes</SelectItem>
                <SelectItem value="active">Alertes actives</SelectItem>
                <SelectItem value="resolved">Alertes résolues</SelectItem>
                <SelectItem value="high">Priorité haute</SelectItem>
                <SelectItem value="medium">Priorité moyenne</SelectItem>
                <SelectItem value="low">Priorité basse</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Rechercher une alerte..."
              className="w-64"
            />
          </div>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Alert key={alert.id} variant={alert.priority === 'high' ? 'destructive' : 'default'}>
                {getStatusIcon(alert.status)}
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2 mb-2">
                      {alert.title}
                      {getPriorityBadge(alert.priority)}
                      <Badge variant="outline">{getCategoryLabel(alert.category)}</Badge>
                    </AlertTitle>
                    <AlertDescription className="mb-2">
                      {alert.description}
                    </AlertDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Véhicule: {alert.vehicle}</span>
                      <span>Date: {new Date(alert.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {alert.status === 'active' && (
                      <>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Alerts;
