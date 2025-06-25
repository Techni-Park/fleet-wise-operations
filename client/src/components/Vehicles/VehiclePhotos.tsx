
import React from 'react';
import { Camera, Plus, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VehiclePhotosProps {
  vehicleId: string;
}

const VehiclePhotos: React.FC<VehiclePhotosProps> = ({ vehicleId }) => {
  const photos = [
    {
      id: '1',
      url: '/placeholder.svg',
      title: 'Vue extérieure avant',
      date: '2024-06-01',
      category: 'exterior'
    },
    {
      id: '2',
      url: '/placeholder.svg',
      title: 'Intérieur - Tableau de bord',
      date: '2024-06-01',
      category: 'interior'
    },
    {
      id: '3',
      url: '/placeholder.svg',
      title: 'Anomalie - Rayure portière',
      date: '2024-05-20',
      category: 'damage'
    },
    {
      id: '4',
      url: '/placeholder.svg',
      title: 'Maintenance - Changement pneu',
      date: '2024-05-15',
      category: 'maintenance'
    }
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'exterior':
        return 'Extérieur';
      case 'interior':
        return 'Intérieur';
      case 'damage':
        return 'Dommage';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Autre';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exterior':
        return 'bg-blue-100 text-blue-800';
      case 'interior':
        return 'bg-green-100 text-green-800';
      case 'damage':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Photos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Galerie photos du véhicule
          </p>
        </div>
        <Button>
          <Camera className="w-4 h-4 mr-2" />
          Ajouter une photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucune photo disponible</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter la première photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button variant="secondary" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{photo.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(photo.category)}`}>
                    {getCategoryLabel(photo.category)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(photo.date).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclePhotos;
