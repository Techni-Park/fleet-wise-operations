
import React, { useState } from 'react';
import { Calendar, Plus, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Planning = () => {
  const [viewMode, setViewMode] = useState('calendar');
  
  const events = [
    {
      id: '1',
      title: 'Révision 20 000 km',
      vehicle: 'AB-123-CD',
      type: 'Maintenance',
      date: '2024-06-25',
      time: '09:00',
      duration: '2h',
      technician: 'Pierre Martin',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Réparation freins',
      vehicle: 'EF-456-GH',
      type: 'Réparation',
      date: '2024-06-25',
      time: '14:00',
      duration: '3h',
      technician: 'Marie Dubois',
      status: 'in_progress'
    },
    {
      id: '3',
      title: 'Contrôle technique',
      vehicle: 'IJ-789-KL',
      type: 'Contrôle',
      date: '2024-06-26',
      time: '10:00',
      duration: '1h',
      technician: 'Jean Leroy',
      status: 'scheduled'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Planifiée</Badge>;
      case 'in_progress':
        return <Badge className="bg-orange-100 text-orange-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
                Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Planification des interventions et maintenance
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle intervention
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex gap-4">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">Vue calendrier</SelectItem>
                  <SelectItem value="list">Vue liste</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Rechercher une intervention..."
                className="w-64"
              />
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <Card>
              <CardHeader>
                <CardTitle>Interventions planifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.vehicle} - {event.type}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p>{new Date(event.date).toLocaleDateString('fr-FR')}</p>
                            <p className="text-gray-600 dark:text-gray-400">{event.time} ({event.duration})</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{event.technician}</p>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Calendrier des interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <div key={day} className="p-2 text-center font-medium bg-gray-100 dark:bg-gray-800 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNumber = i - 5 + 1;
                    const isCurrentMonth = dayNumber > 0 && dayNumber <= 30;
                    const hasEvent = [25, 26].includes(dayNumber);
                    
                    return (
                      <div
                        key={i}
                        className={`p-2 min-h-20 border rounded ${
                          isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        {isCurrentMonth && (
                          <>
                            <div className="font-medium text-sm mb-1">{dayNumber}</div>
                            {hasEvent && (
                              <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1">
                                {dayNumber === 25 ? '2 interventions' : '1 intervention'}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Planning;
