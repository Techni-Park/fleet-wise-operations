
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/Vehicles/VehicleForm';

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Données d'exemple - en réalité, vous récupéreriez ces données via l'ID
  const vehicleData = {
    plate: 'AB-123-CD',
    model: 'Renault Clio',
    year: 2020,
    mileage: 45000,
    vin: 'VF1RH000123456789',
    color: 'Blanc',
    fuelType: 'Essence',
    enginePower: '90 CH',
    insurance: '2024-12-31',
    technicalControl: '2024-10-20'
  };

  const handleSubmit = (data: any) => {
    console.log('Modification du véhicule:', id, data);
    // Ici vous ajouteriez la logique pour modifier le véhicule
    navigate(`/vehicles/${id}`);
  };

  const handleCancel = () => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* En-tête de page */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to={`/vehicles/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Modifier le véhicule
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {vehicleData.plate} - {vehicleData.model}
              </p>
            </div>
          </div>

          <div className="max-w-4xl">
            <VehicleForm
              initialData={vehicleData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEdit
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditVehicle;
