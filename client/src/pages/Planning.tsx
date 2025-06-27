import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Filter, Eye, Edit, Trash2, Clock, User, Settings, Users, Wrench } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types pour les données
interface Intervention {
  IDINTERVENTION: number;
  LIB50?: string;
  LIB_INTERVENTION?: string;
  DT_INTER_DBT?: string;
  HR_DEBUT?: string;
  DT_INTER_FIN?: string;
  HR_FIN?: string;
  ST_INTER?: number;
  CDUSER?: string;
  CLE_MACHINE_CIBLE?: string;
  IDCONTACT?: number;
  ID2GENRE_INTER?: number;
  // Données liées
  technicien_nom?: string;
  machine_nom?: string;
  client_nom?: string;
}

interface Action {
  IDACTION: number;
  LIB100?: string;
  DT_AFAIRE?: string;
  CDUSER?: string;
  CLE_MACHINE_CIBLE?: string;
  TYPACT?: number;
  ST_ACTION?: number;
  COMMENTAIRE?: string;
  technicien_nom?: string;
  machine_nom?: string;
}

interface TimelineResource {
  id: string;
  name: string;
  type: 'technicien' | 'machine';
}

const Planning = () => {
  const [viewMode, setViewMode] = useState('timeline');
  const [timelineView, setTimelineView] = useState('semaine');
  const [resourceType, setResourceType] = useState<'technicien' | 'machine'>('technicien');
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [resources, setResources] = useState<TimelineResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Couleurs pour les statuts
  const getStatusColor = (status: number, type: 'intervention' | 'alert' = 'intervention') => {
    if (type === 'intervention') {
      switch (status) {
        case 0: return 'bg-gray-500'; // À faire
        case 1: return 'bg-blue-500'; // En cours
        case 2: return 'bg-green-500'; // Terminé
        case 3: return 'bg-orange-500'; // Suspendu
        case 4: return 'bg-purple-500'; // Facturé
        default: return 'bg-gray-400';
      }
    } else {
      // Pour les actions/alertes
      switch (status) {
        case 0: return 'bg-red-500'; // Alerte active
        case 1: return 'bg-yellow-500'; // En traitement
        case 2: return 'bg-green-500'; // Résolue
        default: return 'bg-gray-400';
      }
    }
  };

  const getStatusLabel = (status: number, type: 'intervention' | 'alert' = 'intervention') => {
    if (type === 'intervention') {
      switch (status) {
        case 0: return 'À faire';
        case 1: return 'En cours';
        case 2: return 'Terminé';
        case 3: return 'Suspendu';
        case 4: return 'Facturé';
        default: return 'Inconnu';
      }
    } else {
      switch (status) {
        case 0: return 'Alerte active';
        case 1: return 'En traitement';
        case 2: return 'Résolue';
        default: return 'Inconnu';
      }
    }
  };

  // Chargement des données
  useEffect(() => {
    loadPlanningData();
  }, [resourceType, selectedDate, timelineView]);

  const loadPlanningData = async () => {
    setLoading(true);
    try {
      // Calcul des dates selon la vue
      const startDate = getViewStartDate();
      const endDate = getViewEndDate();

      // Chargement des interventions
      const interventionsResponse = await fetch(
        `/api/planning/interventions?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
      );
      const interventionsData = await interventionsResponse.json();
      setInterventions(interventionsData);

      // Chargement des alertes (actions avec TYPACT = 1)
      const alertsResponse = await fetch(
        `/api/planning/alerts?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
      );
      const alertsData = await alertsResponse.json();
      setActions(alertsData);

      // Chargement des ressources
      const resourcesResponse = await fetch(`/api/planning/resources?type=${resourceType}`);
      const resourcesData = await resourcesResponse.json();
      setResources(resourcesData);

    } catch (error) {
      console.error('Erreur lors du chargement des données du planning:', error);
    } finally {
      setLoading(false);
    }
  };

  const getViewStartDate = () => {
    const date = new Date(selectedDate);
    switch (timelineView) {
      case 'jour':
        return date;
      case 'semaine':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lundi
        return startOfWeek;
      case 'mois':
        return new Date(date.getFullYear(), date.getMonth(), 1);
      case '2mois':
        return new Date(date.getFullYear(), date.getMonth(), 1);
      default:
        return date;
    }
  };

  const getViewEndDate = () => {
    const startDate = getViewStartDate();
    switch (timelineView) {
      case 'jour':
        return startDate;
      case 'semaine':
        const endOfWeek = new Date(startDate);
        endOfWeek.setDate(startDate.getDate() + 6); // Dimanche
        return endOfWeek;
      case 'mois':
        return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      case '2mois':
        return new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);
      default:
        return startDate;
    }
  };

  const getDaysInView = () => {
    const days = [];
    const startDate = getViewStartDate();
    const endDate = getViewEndDate();
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const getItemsForResourceAndDate = (resourceId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const items = [];

    // Interventions
    const resourceInterventions = interventions.filter(intervention => {
      if (resourceType === 'technicien') {
        return intervention.CDUSER === resourceId && intervention.DT_INTER_DBT === dateStr;
      } else {
        return intervention.CLE_MACHINE_CIBLE === resourceId && intervention.DT_INTER_DBT === dateStr;
      }
    });

    items.push(...resourceInterventions.map(intervention => ({
      ...intervention,
      type: 'intervention' as const,
      title: intervention.LIB50 || intervention.LIB_INTERVENTION || 'Intervention',
      subtitle: resourceType === 'technicien' 
        ? intervention.machine_nom || intervention.CLE_MACHINE_CIBLE
        : intervention.technicien_nom || intervention.CDUSER,
      time: intervention.HR_DEBUT || '00:00',
      status: intervention.ST_INTER || 0
    })));

    // Alertes (Actions avec TYPACT = 1)
    const resourceAlerts = actions.filter(action => {
      if (resourceType === 'technicien') {
        return action.CDUSER === resourceId && action.DT_AFAIRE === dateStr;
      } else {
        return action.CLE_MACHINE_CIBLE === resourceId && action.DT_AFAIRE === dateStr;
      }
    });

    items.push(...resourceAlerts.map(action => ({
      ...action,
      type: 'alert' as const,
      title: action.LIB100 || 'Alerte',
      subtitle: resourceType === 'technicien'
        ? action.machine_nom || action.CLE_MACHINE_CIBLE
        : action.technicien_nom || action.CDUSER,
      time: '00:00',
      status: action.ST_ACTION || 0
    })));

    return items.sort((a, b) => a.time.localeCompare(b.time));
  };

  const renderTimelineView = () => {
    const days = getDaysInView();

    return (
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* En-tête avec les dates */}
          <div className="flex border-b bg-gray-50 dark:bg-gray-800">
            <div className="w-48 p-3 font-medium border-r">
              {resourceType === 'technicien' ? 'Techniciens' : 'Machines'}
            </div>
            {days.map((day, index) => (
              <div key={index} className="w-32 p-3 text-center border-r">
                <div className="font-medium">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Lignes des ressources */}
          {resources.map((resource) => (
            <div key={resource.id} className="flex border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="w-48 p-3 border-r flex items-center">
                <div className="flex items-center space-x-2">
                  {resourceType === 'technicien' ? 
                    <User className="w-4 h-4 text-blue-500" /> : 
                    <Wrench className="w-4 h-4 text-orange-500" />
                  }
                  <span className="font-medium">{resource.name}</span>
                </div>
              </div>
              {days.map((day, dayIndex) => {
                const items = getItemsForResourceAndDate(resource.id, day);
                return (
                  <div key={dayIndex} className="w-32 p-1 border-r min-h-16">
                    {items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`mb-1 p-1 rounded text-xs text-white cursor-pointer hover:opacity-80 ${
                          getStatusColor(item.status, item.type)
                        }`}
                        title={`${item.title}\n${item.subtitle}\n${item.time}\n${getStatusLabel(item.status, item.type)}`}
                      >
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="truncate opacity-90">{item.subtitle}</div>
                        <div className="text-xs opacity-75">{item.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
      <div className="space-y-4">
        {/* Navigation du calendrier */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
          >
            ← Précédent
          </Button>
          <h3 className="text-lg font-medium">
            {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <Button 
            variant="outline"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
          >
            Suivant →
          </Button>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours */}
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center font-medium bg-gray-100 dark:bg-gray-800 rounded">
              {day}
            </div>
          ))}

          {/* Cases du calendrier */}
          {Array.from({ length: 42 }, (_, i) => {
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const startOfCalendar = new Date(startOfMonth);
            startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay() + 1);
            
            const currentDate = new Date(startOfCalendar);
            currentDate.setDate(currentDate.getDate() + i);
            
            const isCurrentMonth = currentDate.getMonth() === selectedDate.getMonth();
            const dateStr = currentDate.toISOString().split('T')[0];
            
            // Compter les événements de cette date
            const dayInterventions = interventions.filter(int => int.DT_INTER_DBT === dateStr);
            const dayAlerts = actions.filter(action => action.DT_AFAIRE === dateStr);
            
            return (
              <div
                key={i}
                className={`p-2 min-h-20 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                }`}
                onClick={() => setSelectedDate(currentDate)}
              >
                <div className="font-medium text-sm mb-1">{currentDate.getDate()}</div>
                {(dayInterventions.length > 0 || dayAlerts.length > 0) && (
                  <div className="space-y-1">
                    {dayInterventions.length > 0 && (
                      <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded">
                        {dayInterventions.length} intervention{dayInterventions.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {dayAlerts.length > 0 && (
                      <div className="text-xs bg-red-100 text-red-800 p-1 rounded">
                        {dayAlerts.length} alerte{dayAlerts.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const allEvents = [
      ...interventions.map(int => ({
        ...int,
        type: 'intervention' as const,
        title: int.LIB50 || int.LIB_INTERVENTION || 'Intervention',
        date: int.DT_INTER_DBT,
        time: int.HR_DEBUT,
        status: int.ST_INTER || 0,
        resource: resourceType === 'technicien' ? int.CDUSER : int.CLE_MACHINE_CIBLE,
        subtitle: resourceType === 'technicien' ? int.machine_nom : int.technicien_nom
      })),
      ...actions.map(action => ({
        ...action,
        type: 'alert' as const,
        title: action.LIB100 || 'Alerte',
        date: action.DT_AFAIRE,
        time: '00:00',
        status: action.ST_ACTION || 0,
        resource: resourceType === 'technicien' ? action.CDUSER : action.CLE_MACHINE_CIBLE,
        subtitle: resourceType === 'technicien' ? action.machine_nom : action.technicien_nom
      }))
    ].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <div className="space-y-4">
        {allEvents.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {event.type === 'intervention' ? 
                    <Wrench className="w-4 h-4 text-blue-500" /> : 
                    <Clock className="w-4 h-4 text-red-500" />
                  }
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.subtitle} - {event.resource}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <p>{new Date(event.date!).toLocaleDateString('fr-FR')}</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.time}</p>
                </div>
                <Badge className={`text-white ${getStatusColor(event.status, event.type)}`}>
                  {getStatusLabel(event.status, event.type)}
                </Badge>
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
    );
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
                Planification des interventions et alertes
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle intervention
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex gap-4 flex-wrap">
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                  <TabsTrigger value="list">Liste</TabsTrigger>
                </TabsList>
              </Tabs>

              {viewMode === 'timeline' && (
                <>
                  <Select value={timelineView} onValueChange={setTimelineView}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jour">Jour</SelectItem>
                      <SelectItem value="semaine">Semaine</SelectItem>
                      <SelectItem value="mois">Mois</SelectItem>
                      <SelectItem value="2mois">2 Mois</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={resourceType} onValueChange={(value: 'technicien' | 'machine') => setResourceType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technicien">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Techniciens</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="machine">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Machines</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
              
              <Input
                placeholder="Rechercher..."
                className="w-64"
              />
              
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {viewMode === 'timeline' && <Clock className="w-5 h-5 mr-2" />}
                {viewMode === 'calendar' && <Calendar className="w-5 h-5 mr-2" />}
                {viewMode === 'list' && <Eye className="w-5 h-5 mr-2" />}
                {viewMode === 'timeline' && `Timeline - ${timelineView} (${resourceType})`}
                {viewMode === 'calendar' && 'Vue calendrier'}
                {viewMode === 'list' && 'Vue liste'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Chargement du planning...</p>
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'timeline' && renderTimelineView()}
                  {viewMode === 'calendar' && renderCalendarView()}
                  {viewMode === 'list' && renderListView()}
                </>
              )}
            </CardContent>
          </Card>

          {/* Légende des couleurs */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm">À faire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">En cours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Terminé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Suspendu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">Facturé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Alerte</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">En traitement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Résolue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Planning; 