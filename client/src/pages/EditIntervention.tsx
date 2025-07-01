import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressInput } from '@/components/ui/address-input';
import { useToast } from '@/hooks/use-toast';

const EditIntervention = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [intervention, setIntervention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  // États du formulaire basés sur les champs réels de la table INTERVENTION
  const [formData, setFormData] = useState({
    LIB50: '',
    LIB_INTERVENTION: '',
    IDCONTACT: '',
    CLE_MACHINE_CIBLE: '',
    DT_INTER_DBT: '',
    HR_DEBUT: '',
    DT_INTER_FIN: '',
    HR_FIN: '',
    ST_INTER: 0,
    CDUSER: '',
    DEMANDEUR: '',
    SUR_SITE: 0,
    ID2GENRE_INTER: 0,
    // Adresse d'intervention
    ADRESSE_INTERVENTION: '',
    LIEU_INTERVENTION: '',
    COORDS_LAT: '',
    COORDS_LON: '',
    USDEF_LIB: '',
    USDEF_NUM: 0,
    USDEF_BOO: 0
  });

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Charger l'intervention si en mode édition
        if (id) {
          const response = await fetch(`/api/interventions/${id}`, { credentials: 'include' });
          if (response.ok) {
            const data = await response.json();
            setIntervention(data);
            setFormData({
              LIB50: data.LIB50 || '',
              LIB_INTERVENTION: data.LIB_INTERVENTION || '',
              IDCONTACT: data.IDCONTACT?.toString() || '',
              CLE_MACHINE_CIBLE: data.CLE_MACHINE_CIBLE || '',
              DT_INTER_DBT: data.DT_INTER_DBT || '',
              HR_DEBUT: data.HR_DEBUT || '',
              DT_INTER_FIN: data.DT_INTER_FIN || '',
              HR_FIN: data.HR_FIN || '',
              ST_INTER: data.ST_INTER || 0,
              CDUSER: data.CDUSER || '',
              DEMANDEUR: data.DEMANDEUR || '',
              SUR_SITE: data.SUR_SITE || 0,
              ID2GENRE_INTER: data.ID2GENRE_INTER || 0,
              // Adresse d'intervention (nouveaux champs)
              ADRESSE_INTERVENTION: data.ADRESSE_INTERVENTION || '',
              LIEU_INTERVENTION: data.LIEU_INTERVENTION || '',
              COORDS_LAT: data.COORDS_LAT?.toString() || '',
              COORDS_LON: data.COORDS_LON?.toString() || '',
              USDEF_LIB: data.USDEF_LIB || '',
              USDEF_NUM: data.USDEF_NUM || 0,
              USDEF_BOO: data.USDEF_BOO || 0
            });
          }
        }

        // Charger les contacts
        const contactsResponse = await fetch('/api/contacts', { credentials: 'include' });
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json();
          setContacts(Array.isArray(contactsData) ? contactsData : contactsData.contacts || []);
        }

        // Charger les véhicules
        const vehiclesResponse = await fetch('/api/vehicles', { credentials: 'include' });
        if (vehiclesResponse.ok) {
          const vehiclesData = await vehiclesResponse.json();
          setVehicles(vehiclesData || []);
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, toast]);

  // Gérer les changements de formulaire
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gérer les changements d'adresse avec géocodage
  const handleAddressChange = (address: string, coordinates?: { lat: number; lon: number }) => {
    handleInputChange('ADRESSE_INTERVENTION', address);
    if (coordinates) {
      handleInputChange('COORDS_LAT', coordinates.lat.toString());
      handleInputChange('COORDS_LON', coordinates.lon.toString());
    } else {
      handleInputChange('COORDS_LAT', '');
      handleInputChange('COORDS_LON', '');
    }
  };

  // Sauvegarder l'intervention
  const handleSave = async () => {
    try {
      setSaving(true);

      // Préparer les données à envoyer
      const dataToSend = {
        ...formData,
        IDCONTACT: formData.IDCONTACT ? parseInt(formData.IDCONTACT) : null,
        ST_INTER: parseInt(formData.ST_INTER.toString()),
        SUR_SITE: parseInt(formData.SUR_SITE.toString()),
        ID2GENRE_INTER: parseInt(formData.ID2GENRE_INTER.toString()),
        USDEF_NUM: parseFloat(formData.USDEF_NUM.toString()) || 0,
        USDEF_BOO: parseInt(formData.USDEF_BOO.toString())
      };

      const url = id ? `/api/interventions/${id}` : '/api/interventions';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const savedIntervention = await response.json();
        toast({
          title: "Succès",
          description: id ? "Intervention modifiée avec succès" : "Intervention créée avec succès"
        });
        navigate(`/interventions/${savedIntervention.IDINTERVENTION || id}`);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'intervention",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={id ? `/interventions/${id}` : '/interventions'}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {id ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {id ? `Modification de l'intervention #${id}` : 'Création d\'une nouvelle intervention'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(id ? `/interventions/${id}` : '/interventions')}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="LIB50">Libellé court *</Label>
                  <Input
                    id="LIB50"
                    value={formData.LIB50}
                    onChange={(e) => handleInputChange('LIB50', e.target.value)}
                    placeholder="Libellé de l'intervention"
                    maxLength={50}
                  />
                </div>

                <div>
                  <Label htmlFor="IDCONTACT">Client</Label>
                  <Select 
                    value={formData.IDCONTACT} 
                    onValueChange={(value) => handleInputChange('IDCONTACT', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.IDCONTACT} value={contact.IDCONTACT.toString()}>
                          {contact.RAISON_SOCIALE || `${contact.NOMFAMILLE} ${contact.PRENOM}`.trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="CLE_MACHINE_CIBLE">Véhicule</Label>
                  <Select 
                    value={formData.CLE_MACHINE_CIBLE} 
                    onValueChange={(value) => handleInputChange('CLE_MACHINE_CIBLE', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.IDMACHINE} value={`R${vehicle.IDMACHINE}`}>
                          {vehicle.IMMAT} - {vehicle.MARQUE} {vehicle.MODELE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="DEMANDEUR">Demandeur</Label>
                  <Input
                    id="DEMANDEUR"
                    value={formData.DEMANDEUR}
                    onChange={(e) => handleInputChange('DEMANDEUR', e.target.value)}
                    placeholder="Nom du demandeur"
                    maxLength={30}
                  />
                </div>

                <div>
                  <Label htmlFor="CDUSER">Technicien</Label>
                  <Input
                    id="CDUSER"
                    value={formData.CDUSER}
                    onChange={(e) => handleInputChange('CDUSER', e.target.value)}
                    placeholder="Code utilisateur"
                    maxLength={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="LIB_INTERVENTION">Description détaillée</Label>
                <Textarea
                  id="LIB_INTERVENTION"
                  value={formData.LIB_INTERVENTION}
                  onChange={(e) => handleInputChange('LIB_INTERVENTION', e.target.value)}
                  rows={4}
                  placeholder="Description détaillée de l'intervention..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Planification */}
          <Card>
            <CardHeader>
              <CardTitle>Planification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="DT_INTER_DBT">Date de début</Label>
                  <Input
                    id="DT_INTER_DBT"
                    type="date"
                    value={formData.DT_INTER_DBT}
                    onChange={(e) => handleInputChange('DT_INTER_DBT', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="HR_DEBUT">Heure de début</Label>
                  <Input
                    id="HR_DEBUT"
                    type="time"
                    value={formData.HR_DEBUT}
                    onChange={(e) => handleInputChange('HR_DEBUT', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="DT_INTER_FIN">Date de fin</Label>
                  <Input
                    id="DT_INTER_FIN"
                    type="date"
                    value={formData.DT_INTER_FIN}
                    onChange={(e) => handleInputChange('DT_INTER_FIN', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="HR_FIN">Heure de fin</Label>
                  <Input
                    id="HR_FIN"
                    type="time"
                    value={formData.HR_FIN}
                    onChange={(e) => handleInputChange('HR_FIN', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle>Localisation de l'intervention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddressInput
                  value={formData.ADRESSE_INTERVENTION}
                  onChange={handleAddressChange}
                  label="Adresse d'intervention"
                  placeholder="Saisir l'adresse du lieu d'intervention..."
                  className="w-full"
                />
                <div>
                  <Label htmlFor="LIEU_INTERVENTION">Précisions sur le lieu</Label>
                  <Input
                    id="LIEU_INTERVENTION"
                    value={formData.LIEU_INTERVENTION}
                    onChange={(e) => handleInputChange('LIEU_INTERVENTION', e.target.value)}
                    placeholder="Détails supplémentaires (bâtiment, étage, etc.)"
                  />
                </div>
              </div>
              
              {/* Affichage des coordonnées si géocodées */}
              {formData.COORDS_LAT && formData.COORDS_LON && (
                <div className="text-xs text-gray-500 bg-green-50 p-2 rounded">
                  📍 Coordonnées GPS : {parseFloat(formData.COORDS_LAT).toFixed(6)}, {parseFloat(formData.COORDS_LON).toFixed(6)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statut et options */}
          <Card>
            <CardHeader>
              <CardTitle>Statut et options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ST_INTER">Statut</Label>
                  <Select 
                    value={formData.ST_INTER.toString()} 
                    onValueChange={(value) => handleInputChange('ST_INTER', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Planifiée</SelectItem>
                      <SelectItem value="1">En cours</SelectItem>
                      <SelectItem value="9">Terminée</SelectItem>
                      <SelectItem value="10">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ID2GENRE_INTER">Type d'intervention</Label>
                  <Select 
                    value={formData.ID2GENRE_INTER.toString()} 
                    onValueChange={(value) => handleInputChange('ID2GENRE_INTER', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Non défini</SelectItem>
                      <SelectItem value="1">Maintenance</SelectItem>
                      <SelectItem value="2">Réparation</SelectItem>
                      <SelectItem value="3">Contrôle</SelectItem>
                      <SelectItem value="4">Nettoyage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="SUR_SITE">Sur site</Label>
                  <Select 
                    value={formData.SUR_SITE.toString()} 
                    onValueChange={(value) => handleInputChange('SUR_SITE', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Non</SelectItem>
                      <SelectItem value="1">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="USDEF_LIB">Information personnalisée</Label>
                  <Input
                    id="USDEF_LIB"
                    value={formData.USDEF_LIB}
                    onChange={(e) => handleInputChange('USDEF_LIB', e.target.value)}
                    placeholder="Information supplémentaire"
                    maxLength={40}
                  />
                </div>

                <div>
                  <Label htmlFor="USDEF_NUM">Valeur numérique</Label>
                  <Input
                    id="USDEF_NUM"
                    type="number"
                    step="0.01"
                    value={formData.USDEF_NUM}
                    onChange={(e) => handleInputChange('USDEF_NUM', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditIntervention; 