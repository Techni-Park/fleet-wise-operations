
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditIntervention = () => {
  const { id } = useParams();

  const intervention = {
    id: id || '1',
    title: 'Révision 20 000 km',
    description: 'Révision complète du véhicule avec changement des filtres et vérification des niveaux',
    type: 'Maintenance',
    status: 'completed',
    priority: 'medium',
    vehicleId: '1',
    scheduledDate: '2024-05-15',
    estimatedDuration: '2h30',
    estimatedCost: 250.00,
    technicianId: 'tech-1',
    notes: 'Intervention réalisée selon le planning. Véhicule en excellent état général.'
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to={`/interventions/${intervention.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Modifier l'intervention
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Modification de l'intervention #{intervention.id}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'intervention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre de l'intervention</Label>
                    <Input id="title" defaultValue={intervention.title} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'intervention</Label>
                    <Select defaultValue={intervention.type.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="reparation">Réparation</SelectItem>
                        <SelectItem value="controle">Contrôle</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={intervention.description}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Select defaultValue={intervention.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select defaultValue={intervention.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Planifiée</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Véhicule</Label>
                    <Select defaultValue={intervention.vehicleId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">AB-123-CD - Renault Clio</SelectItem>
                        <SelectItem value="2">EF-456-GH - Peugeot 308</SelectItem>
                        <SelectItem value="3">IJ-789-KL - Ford Transit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-date">Date prévue</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      defaultValue={intervention.scheduledDate}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée estimée</Label>
                    <Input
                      id="duration"
                      defaultValue={intervention.estimatedDuration}
                      placeholder="Ex: 2h30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cost">Coût estimé (€)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      defaultValue={intervention.estimatedCost}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technician">Technicien assigné</Label>
                  <Select defaultValue={intervention.technicianId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech-1">Pierre Martin</SelectItem>
                      <SelectItem value="tech-2">Marie Dubois</SelectItem>
                      <SelectItem value="tech-3">Jean Leroy</SelectItem>
                      <SelectItem value="tech-4">Lucas Petit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    defaultValue={intervention.notes}
                    rows={4}
                    placeholder="Notes supplémentaires..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditIntervention;
