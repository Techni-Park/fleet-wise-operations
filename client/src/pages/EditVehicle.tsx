import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/Vehicles/VehicleForm';
import { useToast } from '@/hooks/use-toast';

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadVehicle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicules/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        console.error('Failed to fetch vehicle');
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du véhicule",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du véhicule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

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

      // Mettre à jour le véhicule (combiné)
      const response = await fetch(`/api/vehicules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vehicleData, machineData })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Le véhicule a été modifié avec succès"
        });
        navigate(`/vehicles/${id}`);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur modification véhicule:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement du véhicule...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!vehicle) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Véhicule introuvable
          </h1>
          <Link to="/vehicles">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux véhicules
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="grid grid-cols-4 gap-6 items-start mb-8">
          {/* Colonne 1 : Informations principales (3/4 de l'espace) */}
          <div className="col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Modifier : {vehicle.LIB_MACHINE || 'Véhicule sans libellé'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
              {vehicle.IMMAT || 'Non immatriculé'}
            </p>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {vehicle.MARQUE} {vehicle.MODELE}
            </p>
          </div>

          {/* Colonne 2 : Boutons d'action (1/4 de l'espace) */}
          <div className="flex justify-end space-x-2">
            <Link to={`/vehicles/${id}`}>
              <Button variant="outline" size="sm" title="Annuler les modifications">
                <X className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              onClick={() => document.getElementById('vehicle-form-submit')?.click()}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700" 
              size="sm" 
              title="Enregistrer les modifications"
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
            initialData={vehicle}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit
            saving={saving}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditVehicle;
