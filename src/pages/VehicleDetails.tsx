
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Car, Calendar, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleInterventions from '@/components/Vehicles/VehicleInterventions';
import VehicleAlerts from '@/components/Vehicles/VehicleAlerts';
import VehicleDocuments from '@/components/Vehicles/VehicleDocuments';
import VehiclePhotos from '@/components/Vehicles/VehiclePhotos';
import VehicleAnomalies from '@/components/Vehicles/VehicleAnomalies';
import VehicleStats from '@/components/Vehicles/VehicleStats';

const VehicleDetails = () => {
  const { id } = useParams();

  // Données d'exemple - en réalité, vous récupéreriez ces données via l'ID
  const vehicle = {
    id: id || '1',
    plate: 'AB-123-CD',
    model: 'Renault Clio',
    year: 2020,
    mileage: 45000,
    status: 'active' as const,
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-08-15',
    insurance: '2024-12-31',
    technicalControl: '2024-10-20',
    vin: 'VF1RH000123456789',
    color: 'Blanc',
    fuelType: 'Essence',
    enginePower: '90 CH'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" />Maintenance</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Inactif</Badge>;
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
          {/* En-tête de page */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/vehicles">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {vehicle.plate}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {vehicle.model} - {vehicle.year}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to={`/vehicles/${vehicle.id}/edit`}>
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
                    <Car className="w-5 h-5 mr-2" />
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
                    {getStatusBadge(vehicle.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Modèle</p>
                    <p className="font-medium">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Année</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kilométrage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Carburant</p>
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Onglets principaux */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="interventions" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="interventions">Interventions</TabsTrigger>
                  <TabsTrigger value="alerts">Alertes</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>
                
                <TabsContent value="interventions">
                  <VehicleInterventions vehicleId={vehicle.id} />
                </TabsContent>
                
                <TabsContent value="alerts">
                  <VehicleAlerts vehicleId={vehicle.id} />
                </TabsContent>
                
                <TabsContent value="documents">
                  <VehicleDocuments vehicle={vehicle} />
                </TabsContent>
                
                <TabsContent value="photos">
                  <VehiclePhotos vehicleId={vehicle.id} />
                </TabsContent>
                
                <TabsContent value="anomalies">
                  <VehicleAnomalies vehicleId={vehicle.id} />
                </TabsContent>
                
                <TabsContent value="stats">
                  <VehicleStats vehicleId={vehicle.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VehicleDetails;
