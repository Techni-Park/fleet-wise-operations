
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/Vehicles/VehicleForm';

const CreateVehicle = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log('Création du véhicule:', data);
    // Ici vous ajouteriez la logique pour créer le véhicule
    navigate('/vehicles');
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* En-tête de page */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/vehicles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Ajouter un véhicule
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Créez une nouvelle fiche véhicule pour votre flotte
              </p>
            </div>
          </div>

          <div className="max-w-4xl">
            <VehicleForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateVehicle;
