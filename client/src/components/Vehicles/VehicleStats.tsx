
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface VehicleStatsProps {
  vehicleId: string;
}

const VehicleStats: React.FC<VehicleStatsProps> = ({ vehicleId }) => {
  // Données d'exemple pour les graphiques
  const maintenanceData = [
    { month: 'Jan', cost: 120 },
    { month: 'Fév', cost: 80 },
    { month: 'Mar', cost: 250 },
    { month: 'Avr', cost: 150 },
    { month: 'Mai', cost: 200 },
    { month: 'Jun', cost: 90 }
  ];

  const kilometrageData = [
    { month: 'Jan', km: 42000 },
    { month: 'Fév', km: 42800 },
    { month: 'Mar', km: 43500 },
    { month: 'Avr', km: 44200 },
    { month: 'Mai', km: 44800 },
    { month: 'Jun', km: 45000 }
  ];

  const interventionTypes = [
    { name: 'Maintenance', value: 45, color: '#8884d8' },
    { name: 'Nettoyage', value: 30, color: '#82ca9d' },
    { name: 'Réparation', value: 20, color: '#ffc658' },
    { name: 'Contrôle', value: 5, color: '#ff7300' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Statistiques du véhicule</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Analyses et métriques de performance
        </p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">890€</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coût total maintenance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interventions réalisées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">3000</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">km parcourus (6 mois)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Disponibilité</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coûts de maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Coûts de maintenance (6 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`, 'Coût']} />
                <Bar dataKey="cost" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution du kilométrage */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du kilométrage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kilometrageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} km`, 'Kilométrage']} />
                <Line type="monotone" dataKey="km" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des interventions */}
        <Card>
          <CardHeader>
            <CardTitle>Types d'interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interventionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {interventionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performances mensuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs clés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Consommation moyenne</span>
              <span className="font-medium">6.2 L/100km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Coût au kilomètre</span>
              <span className="font-medium">0.29€/km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Nombre de pannes</span>
              <span className="font-medium">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Temps d'immobilisation</span>
              <span className="font-medium">2 jours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Note satisfaction</span>
              <span className="font-medium">4.5/5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleStats;
