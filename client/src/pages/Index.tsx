
import React from 'react';
import { Car, Users, Wrench, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import StatsCard from '@/components/Dashboard/StatsCard';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import AlertsPanel from '@/components/Dashboard/AlertsPanel';
import FleetOverviewChart from '@/components/Charts/FleetOverviewChart';

const Index = () => {
  const stats = [
    {
      title: 'Véhicules totaux',
      value: 58,
      change: { value: '+12%', type: 'increase' as const },
      icon: Car,
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Interventions ce mois',
      value: 127,
      change: { value: '+8%', type: 'increase' as const },
      icon: Wrench,
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Alertes actives',
      value: 12,
      change: { value: '-15%', type: 'decrease' as const },
      icon: AlertTriangle,
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      title: 'Taux de disponibilité',
      value: '94.2%',
      change: { value: '+2.1%', type: 'increase' as const },
      icon: TrendingUp,
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* En-tête de page */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de votre flotte de véhicules
            </p>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <StatsCard {...stat} />
              </div>
            ))}
          </div>

          {/* Graphiques de vue d'ensemble */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FleetOverviewChart />
          </div>

          {/* Activités récentes et alertes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <RecentActivity />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <AlertsPanel />
            </div>
          </div>

          {/* Section d'actions rapides */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in" style={{ animationDelay: '700ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions rapides
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                <Car className="w-5 h-5" />
                <span>Ajouter un véhicule</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                <Calendar className="w-5 h-5" />
                <span>Programmer intervention</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                <Users className="w-5 h-5" />
                <span>Gérer les utilisateurs</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
