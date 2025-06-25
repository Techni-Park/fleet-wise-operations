
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VehicleFormData {
  plate: string;
  model: string;
  year: number;
  mileage: number;
  vin: string;
  color: string;
  fuelType: string;
  enginePower: string;
  insurance: string;
  technicalControl: string;
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    defaultValues: initialData
  });

  const handleFormSubmit = (data: VehicleFormData) => {
    onSubmit(data);
    toast({
      title: isEdit ? "Véhicule modifié" : "Véhicule créé",
      description: isEdit ? "Les modifications ont été enregistrées avec succès." : "Le véhicule a été ajouté à la flotte.",
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plate">Plaque d'immatriculation *</Label>
              <Input
                id="plate"
                {...register('plate', { required: 'La plaque est obligatoire' })}
                placeholder="AB-123-CD"
              />
              {errors.plate && (
                <p className="text-sm text-red-600">{errors.plate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="model">Modèle *</Label>
              <Input
                id="model"
                {...register('model', { required: 'Le modèle est obligatoire' })}
                placeholder="Renault Clio"
              />
              {errors.model && (
                <p className="text-sm text-red-600">{errors.model.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="year">Année *</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { 
                  required: 'L\'année est obligatoire',
                  min: { value: 1900, message: 'Année invalide' },
                  max: { value: new Date().getFullYear() + 1, message: 'Année invalide' }
                })}
                placeholder="2020"
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="mileage">Kilométrage *</Label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage', { 
                  required: 'Le kilométrage est obligatoire',
                  min: { value: 0, message: 'Le kilométrage doit être positif' }
                })}
                placeholder="45000"
              />
              {errors.mileage && (
                <p className="text-sm text-red-600">{errors.mileage.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="vin">Numéro VIN</Label>
              <Input
                id="vin"
                {...register('vin')}
                placeholder="VF1RH000123456789"
              />
            </div>

            <div>
              <Label htmlFor="color">Couleur</Label>
              <Input
                id="color"
                {...register('color')}
                placeholder="Blanc"
              />
            </div>

            <div>
              <Label htmlFor="fuelType">Type de carburant</Label>
              <select
                id="fuelType"
                {...register('fuelType')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionner</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
                <option value="Électrique">Électrique</option>
                <option value="GPL">GPL</option>
              </select>
            </div>

            <div>
              <Label htmlFor="enginePower">Puissance moteur</Label>
              <Input
                id="enginePower"
                {...register('enginePower')}
                placeholder="90 CH"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insurance">Date d'expiration assurance</Label>
              <Input
                id="insurance"
                type="date"
                {...register('insurance')}
              />
            </div>

            <div>
              <Label htmlFor="technicalControl">Date d'expiration contrôle technique</Label>
              <Input
                id="technicalControl"
                type="date"
                {...register('technicalControl')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {isEdit ? 'Enregistrer les modifications' : 'Créer le véhicule'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
