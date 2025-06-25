
import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports = () => {
  const [period, setPeriod] = useState('month');
  
  const reports = [
    {
      id: '1',
      title: 'Rapport mensuel de maintenance',
      description: 'Analyse des interventions du mois de juin 2024',
      type: 'maintenance',
      period: 'Juin 2024',
      status: 'ready',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Rapport coûts trimestriels',
      description: 'Analyse des coûts Q2 2024',
      type: 'costs',
      period: 'Q2 2024',
      status: 'ready',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Rapport utilisation véhicules',
      description: 'Analyse d\'utilisation par véhicule',
      type: 'usage',
      period: 'Juin 2024',
      status: 'generating',
      size: '-'
    }
  ];

  const stats = {
    totalVehicles: 25,
    totalInterventions: 127,
    totalCosts: 45720,
    avgCostPerVehicle: 1829,
    maintenanceRate: 8.5,
    availabilityRate: 94.2
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'Maintenance';
      case 'costs':
        return 'Coûts';
      case 'usage':
        return 'Utilisation';
      default:
        return type;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Rapports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analyses et rapports de performance de la flotte
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Nouveau rapport
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {/* Métriques clés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Véhicules totaux</p>
                        <p className="text-3xl font-bold">{stats.totalVehicles}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Interventions</p>
                        <p className="text-3xl font-bold">{stats.totalInterventions}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Coûts totaux</p>
                        <p className="text-3xl font-bold">{stats.totalCosts.toLocaleString()}€</p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Indicateurs de performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Indicateurs de performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Coût moyen par véhicule</span>
                      <span className="font-bold">{stats.avgCostPerVehicle}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de maintenance</span>
                      <span className="font-bold">{stats.maintenanceRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de disponibilité</span>
                      <span className="font-bold text-green-600">{stats.availabilityRate}%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tendances mensuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500">Graphique des tendances</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="flex gap-4 mb-6">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="quarter">Ce trimestre</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Rapports disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium">{report.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {report.description}
                              </p>
                            </div>
                            <div className="text-sm">
                              <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                            </div>
                            <div className="text-sm">
                              <p>{report.period}</p>
                              <p className="text-gray-600 dark:text-gray-400">{report.size}</p>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {report.status === 'ready' && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse des coûts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500">Graphique d'analyse des coûts</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisation par véhicule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500">Graphique d'utilisation</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Fréquence des pannes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500">Graphique des pannes</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-500">Graphique de performance</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
