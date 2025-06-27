import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Car, Wrench, MapPin, Calendar, FileText } from 'lucide-react';

interface VehicleFormData {
  // Identification
  IMMAT: string;
  CD_MACHINE: string;
  LIB_MACHINE: string;
  NUM_IDENTIF: string;
  NUM_SERIE: string;
  ID2_ETATMACHINE: number;

  // Caractéristiques techniques
  MARQUE: string;
  MODELE: string;
  TYPE_MACHINE: string;
  GENRE_NATIONAL: string;
  CARBURANT: string;
  PUISSANCE_ADMIN: number;
  PUISSANCEW: number;
  PLACES_ASSISES: number;
  PTAC: number;
  PTR: number;

  // Kilométrage et dates
  KMACTUEL: number;
  KILOMETRAGE: number;
  DT_PREMCIRC: string;
  DT_MISEENFONCTION: string;

  // Contrôles et maintenance
  DT_CTRLTECH: string;
  DT_CTRLPOLLUTION: string;
  DT_ECHASS: string;
  NUMCONTRASS: string;
  DT_PROCH_MNT: string;
  DT_EXP_GARANTIE: string;
  DT_DBT_GARANTIE: string;

  // Localisation et observations
  ADRESSE1: string;
  ADRESSE2: string;
  CPOSTAL: string;
  VILLE: string;
  OBSERVATIONS: string;
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
      {/* Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="IMMAT">Immatriculation *</Label>
              <Input
                id="IMMAT"
                {...register('IMMAT', { required: 'L\'immatriculation est obligatoire' })}
                placeholder="AB-123-CD"
              />
              {errors.IMMAT && (
                <p className="text-sm text-red-600">{errors.IMMAT.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="CD_MACHINE">Code machine *</Label>
              <Input
                id="CD_MACHINE"
                {...register('CD_MACHINE', { required: 'Le code machine est obligatoire' })}
                placeholder="VH001"
              />
              {errors.CD_MACHINE && (
                <p className="text-sm text-red-600">{errors.CD_MACHINE.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="LIB_MACHINE">Libellé machine</Label>
              <Input
                id="LIB_MACHINE"
                {...register('LIB_MACHINE')}
                placeholder="Véhicule de livraison urbain"
              />
            </div>

            <div>
              <Label htmlFor="NUM_IDENTIF">VIN (Numéro d'identification)</Label>
              <Input
                id="NUM_IDENTIF"
                {...register('NUM_IDENTIF')}
                placeholder="VF1RH000123456789"
                maxLength={17}
              />
            </div>

            <div>
              <Label htmlFor="NUM_SERIE">Numéro de série</Label>
              <Input
                id="NUM_SERIE"
                {...register('NUM_SERIE')}
                placeholder="SN123456"
              />
            </div>

            <div>
              <Label htmlFor="ID2_ETATMACHINE">Statut *</Label>
              <select
                id="ID2_ETATMACHINE"
                {...register('ID2_ETATMACHINE', { 
                  required: 'Le statut est obligatoire',
                  valueAsNumber: true 
                })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionner un statut</option>
                <option value={1}>Actif</option>
                <option value={2}>Maintenance</option>
                <option value={3}>Hors service</option>
                <option value={4}>Archivé</option>
              </select>
              {errors.ID2_ETATMACHINE && (
                <p className="text-sm text-red-600">{errors.ID2_ETATMACHINE.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Caractéristiques techniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="MARQUE">Marque *</Label>
              <Input
                id="MARQUE"
                {...register('MARQUE', { required: 'La marque est obligatoire' })}
                placeholder="Renault"
              />
              {errors.MARQUE && (
                <p className="text-sm text-red-600">{errors.MARQUE.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="MODELE">Modèle *</Label>
              <Input
                id="MODELE"
                {...register('MODELE', { required: 'Le modèle est obligatoire' })}
                placeholder="Kangoo"
              />
              {errors.MODELE && (
                <p className="text-sm text-red-600">{errors.MODELE.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="TYPE_MACHINE">Type de machine</Label>
              <Input
                id="TYPE_MACHINE"
                {...register('TYPE_MACHINE')}
                placeholder="Véhicule utilitaire"
              />
            </div>

            <div>
              <Label htmlFor="GENRE_NATIONAL">Genre national</Label>
              <select
                id="GENRE_NATIONAL"
                {...register('GENRE_NATIONAL')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionner</option>
                <option value="VP">VP - Voiture particulière</option>
                <option value="CTTE">CTTE - Camionnette</option>
                <option value="CAM">CAM - Camion</option>
                <option value="TRA">TRA - Tracteur routier</option>
                <option value="REM">REM - Remorque</option>
                <option value="MOTO">MOTO - Motocyclette</option>
              </select>
            </div>

            <div>
              <Label htmlFor="CARBURANT">Carburant</Label>
              <select
                id="CARBURANT"
                {...register('CARBURANT')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Sélectionner</option>
                <option value="ES">Essence</option>
                <option value="GO">Diesel</option>
                <option value="EL">Électrique</option>
                <option value="HY">Hybride</option>
                <option value="GPL">GPL</option>
                <option value="GNV">GNV</option>
              </select>
            </div>

            <div>
              <Label htmlFor="PUISSANCE_ADMIN">Puissance administrative (CV)</Label>
              <Input
                id="PUISSANCE_ADMIN"
                type="number"
                {...register('PUISSANCE_ADMIN', { valueAsNumber: true })}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="PUISSANCEW">Puissance moteur (W)</Label>
              <Input
                id="PUISSANCEW"
                type="number"
                {...register('PUISSANCEW', { valueAsNumber: true })}
                placeholder="55000"
              />
            </div>

            <div>
              <Label htmlFor="PLACES_ASSISES">Places assises</Label>
              <Input
                id="PLACES_ASSISES"
                type="number"
                {...register('PLACES_ASSISES', { valueAsNumber: true })}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="PTAC">PTAC (kg)</Label>
              <Input
                id="PTAC"
                type="number"
                {...register('PTAC', { valueAsNumber: true })}
                placeholder="3500"
              />
            </div>

            <div>
              <Label htmlFor="PTR">PTR (kg)</Label>
              <Input
                id="PTR"
                type="number"
                {...register('PTR', { valueAsNumber: true })}
                placeholder="3000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kilométrage et dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Kilométrage et dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="KMACTUEL">Kilométrage véhicule (km)</Label>
              <Input
                id="KMACTUEL"
                type="number"
                {...register('KMACTUEL', { valueAsNumber: true })}
                placeholder="45000"
              />
            </div>

            <div>
              <Label htmlFor="KILOMETRAGE">Kilométrage machine (km)</Label>
              <Input
                id="KILOMETRAGE"
                type="number"
                {...register('KILOMETRAGE', { valueAsNumber: true })}
                placeholder="45000"
              />
            </div>

            <div>
              <Label htmlFor="DT_PREMCIRC">Date de première circulation</Label>
              <Input
                id="DT_PREMCIRC"
                type="date"
                {...register('DT_PREMCIRC')}
              />
            </div>

            <div>
              <Label htmlFor="DT_MISEENFONCTION">Date de mise en fonction</Label>
              <Input
                id="DT_MISEENFONCTION"
                type="date"
                {...register('DT_MISEENFONCTION')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles et maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Contrôles et maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="DT_CTRLTECH">Date de contrôle technique</Label>
              <Input
                id="DT_CTRLTECH"
                type="date"
                {...register('DT_CTRLTECH')}
              />
            </div>

            <div>
              <Label htmlFor="DT_CTRLPOLLUTION">Date de contrôle pollution</Label>
              <Input
                id="DT_CTRLPOLLUTION"
                type="date"
                {...register('DT_CTRLPOLLUTION')}
              />
            </div>

            <div>
              <Label htmlFor="DT_ECHASS">Date d'expiration assurance</Label>
              <Input
                id="DT_ECHASS"
                type="date"
                {...register('DT_ECHASS')}
              />
            </div>

            <div>
              <Label htmlFor="NUMCONTRASS">Numéro de contrat d'assurance</Label>
              <Input
                id="NUMCONTRASS"
                {...register('NUMCONTRASS')}
                placeholder="ASS123456"
              />
            </div>

            <div>
              <Label htmlFor="DT_PROCH_MNT">Prochaine maintenance</Label>
              <Input
                id="DT_PROCH_MNT"
                type="date"
                {...register('DT_PROCH_MNT')}
              />
            </div>

            <div>
              <Label htmlFor="DT_EXP_GARANTIE">Expiration de garantie</Label>
              <Input
                id="DT_EXP_GARANTIE"
                type="date"
                {...register('DT_EXP_GARANTIE')}
              />
            </div>

            <div>
              <Label htmlFor="DT_DBT_GARANTIE">Début de garantie</Label>
              <Input
                id="DT_DBT_GARANTIE"
                type="date"
                {...register('DT_DBT_GARANTIE')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ADRESSE1">Adresse ligne 1</Label>
              <Input
                id="ADRESSE1"
                {...register('ADRESSE1')}
                placeholder="123 Rue de la Paix"
              />
            </div>

            <div>
              <Label htmlFor="ADRESSE2">Adresse ligne 2</Label>
              <Input
                id="ADRESSE2"
                {...register('ADRESSE2')}
                placeholder="Bâtiment A"
              />
            </div>

            <div>
              <Label htmlFor="CPOSTAL">Code postal</Label>
              <Input
                id="CPOSTAL"
                {...register('CPOSTAL')}
                placeholder="75001"
                maxLength={9}
              />
            </div>

            <div>
              <Label htmlFor="VILLE">Ville</Label>
              <Input
                id="VILLE"
                {...register('VILLE')}
                placeholder="Paris"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="OBSERVATIONS">Observations</Label>
              <Textarea
                id="OBSERVATIONS"
                {...register('OBSERVATIONS')}
                placeholder="Notes et remarques particulières..."
                rows={3}
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
