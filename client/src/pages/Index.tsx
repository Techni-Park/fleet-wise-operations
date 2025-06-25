
import React from 'react';
import { Car, Users, Wrench, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
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
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d'ensemble de votre flotte de véhicules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="transform transition-all duration-200 hover:scale-105">
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Fleet Overview Chart */}
          <div className="xl:col-span-2">
            <div className="transform transition-all duration-200 hover:shadow-lg">
              <FleetOverviewChart />
            </div>
          </div>

          {/* Alerts Panel */}
          <div>
            <div className="transform transition-all duration-200 hover:shadow-lg">
              <AlertsPanel />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="transform transition-all duration-200 hover:shadow-lg">
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
