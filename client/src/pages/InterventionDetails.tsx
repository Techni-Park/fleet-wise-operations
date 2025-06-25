import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, FileText, Camera, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterventionAnomalies from '@/components/Interventions/InterventionAnomalies';

const InterventionDetails = () => {
  const { id } = useParams();

  // Données d'exemple
  const intervention = {
    id: id || '1',
    title: 'Révision 20 000 km',
    description: 'Révision complète du véhicule avec changement des filtres et vérification des niveaux',
    type: 'Maintenance',
    status: 'completed',
    priority: 'medium',
    vehicle: {
      id: '1',
      plate: 'AB-123-CD',
      model: 'Renault Clio',
      year: 2020
    },
    scheduledDate: '2024-05-15',
    startDate: '2024-05-15T08:00:00',
    completedDate: '2024-05-15T10:30:00',
    technician: {
      name: 'Pierre Martin',
      id: 'tech-1'
    },
    estimatedDuration: '2h30',
    actualDuration: '2h30',
    estimatedCost: 250.00,
    actualCost: 250.00,
    checklist: [
      { item: 'Vérification niveau huile moteur', completed: true, notes: 'Niveau correct' },
      { item: 'Changement filtre à air', completed: true, notes: 'Filtre remplacé' },
      { item: 'Contrôle pression pneus', completed: true, notes: 'Pression ajustée' },
      { item: 'Vérification freins', completed: true, notes: 'Plaquettes en bon état' }
    ],
    photos: [
      { id: '1', url: '/placeholder.svg', title: 'Avant intervention' },
      { id: '2', url: '/placeholder.svg', title: 'Filtre à air usagé' },
      { id: '3', url: '/placeholder.svg', title: 'Après intervention' }
    ],
    notes: 'Intervention réalisée selon le planning. Véhicule en excellent état général.',
    partsUsed: [
      { name: 'Filtre à air', quantity: 1, cost: 25.00 },
      { name: 'Huile moteur 5W30', quantity: 4, cost: 80.00 },
      { name: 'Filtre à huile', quantity: 1, cost: 15.00 }
    ]
  };

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* En-tête de page */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/interventions">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {intervention.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {intervention.vehicle.plate} - {intervention.vehicle.model}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to={`/interventions/${intervention.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </Link>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                    {getStatusBadge(intervention.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priorité</p>
                    {getPriorityBadge(intervention.priority)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-medium">{intervention.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Technicien</p>
                    <p className="font-medium">{intervention.technician.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
                    <p className="font-medium">{intervention.actualDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Coût</p>
                    <p className="font-medium">{intervention.actualCost.toFixed(2)}€</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détails de l'intervention */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="checklist">Check-list</TabsTrigger>
                  <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="parts">Pièces</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Détails de l'intervention</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {intervention.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Planning</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Date prévue</p>
                              <p>{new Date(intervention.scheduledDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Début</p>
                              <p>{new Date(intervention.startDate).toLocaleString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Fin</p>
                              <p>{new Date(intervention.completedDate).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Coûts</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Coût estimé</p>
                              <p>{intervention.estimatedCost.toFixed(2)}€</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Coût réel</p>
                              <p className="font-medium">{intervention.actualCost.toFixed(2)}€</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Notes du technicien</h4>
                        <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          {intervention.notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="checklist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Check-list d'intervention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {intervention.checklist.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                            <CheckCircle className={`w-5 h-5 mt-0.5 ${item.completed ? 'text-green-500' : 'text-gray-300'}`} />
                            <div className="flex-1">
                              <p className={`font-medium ${item.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                {item.item}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="anomalies">
                  <InterventionAnomalies 
                    interventionId={intervention.id} 
                    vehicleId={intervention.vehicle.id} 
                  />
                </TabsContent>
                
                <TabsContent value="photos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Photos de l'intervention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {intervention.photos.map((photo) => (
                          <div key={photo.id} className="border rounded-lg overflow-hidden">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                              <p className="text-sm font-medium">{photo.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="parts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pièces utilisées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {intervention.partsUsed.map((part, index) => (
                          <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{part.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Quantité: {part.quantity}
                              </p>
                            </div>
                            <p className="font-medium">{part.cost.toFixed(2)}€</p>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total pièces</span>
                            <span>
                              {intervention.partsUsed.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterventionDetails;
