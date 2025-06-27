import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/Vehicles/VehicleForm';
import { useToast } from '@/hooks/use-toast';

const CreateVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setSaving(true);
      
      // Préparer les données pour les deux tables
      const vehicleData = {
        IMMAT: data.IMMAT,
        NUM_IDENTIF: data.NUM_IDENTIF,
        GENRE_NATIONAL: data.GENRE_NATIONAL,
        CARBURANT: data.CARBURANT,
        PUISSANCE_ADMIN: data.PUISSANCE_ADMIN,
        PLACES_ASSISES: data.PLACES_ASSISES,
        PTAC: data.PTAC,
        PTR: data.PTR,
        NUMCONTRASS: data.NUMCONTRASS,
        DT_ECHASS: data.DT_ECHASS,
        KMACTUEL: data.KMACTUEL,
        DT_PREMCIRC: data.DT_PREMCIRC,
        DT_CTRLTECH: data.DT_CTRLTECH,
        DT_CTRLPOLLUTION: data.DT_CTRLPOLLUTION
      };

      const machineData = {
        CD_MACHINE: data.CD_MACHINE,
        LIB_MACHINE: data.LIB_MACHINE,
        ID2_ETATMACHINE: data.ID2_ETATMACHINE,
        MARQUE: data.MARQUE,
        MODELE: data.MODELE,
        TYPE_MACHINE: data.TYPE_MACHINE,
        NUM_SERIE: data.NUM_SERIE,
        PUISSANCEW: data.PUISSANCEW,
        KILOMETRAGE: data.KILOMETRAGE,
        DT_MISEENFONCTION: data.DT_MISEENFONCTION,
        DT_PROCH_MNT: data.DT_PROCH_MNT,
        DT_EXP_GARANTIE: data.DT_EXP_GARANTIE,
        DT_DBT_GARANTIE: data.DT_DBT_GARANTIE,
        ADRESSE1: data.ADRESSE1,
        ADRESSE2: data.ADRESSE2,
        CPOSTAL: data.CPOSTAL,
        VILLE: data.VILLE,
        OBSERVATIONS: data.OBSERVATIONS
      };

      // Créer le véhicule (combiné)
      const response = await fetch('/api/vehicules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicleData, machineData })
      });

      if (response.ok) {
        const newVehicle = await response.json();
        toast({
          title: "Succès",
          description: "Le véhicule a été créé avec succès"
        });
        navigate(`/vehicles/${newVehicle.IDVEHICULE}`);
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création véhicule:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le véhicule",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="grid grid-cols-4 gap-6 items-start mb-8">
          {/* Colonne 1 : Informations principales (3/4 de l'espace) */}
          <div className="col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ajouter un véhicule
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
              Créez une nouvelle fiche véhicule pour votre flotte
            </p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Nouveau véhicule
            </p>
          </div>

          {/* Colonne 2 : Boutons d'action (1/4 de l'espace) */}
          <div className="flex justify-end space-x-2">
            <Link to="/vehicles">
              <Button variant="outline" size="sm" title="Annuler la création">
                <X className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              onClick={() => document.getElementById('vehicle-form-submit')?.click()}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700" 
              size="sm" 
              title="Créer le véhicule"
            >
              {saving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-6xl">
          <VehicleForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit={false}
            saving={saving}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateVehicle;
