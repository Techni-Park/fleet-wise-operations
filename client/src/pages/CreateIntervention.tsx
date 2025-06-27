import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Car, MapPin, ArrowLeft, Save, X } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const CreateIntervention = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // États du formulaire basés sur la structure INTERVENTION
  const [formData, setFormData] = useState({
    // Informations principales
    LIB50: '',
    LIB_INTERVENTION: '',
    IDCONTACT: '',
    CLE_MACHINE_CIBLE: '',
    CDUSER: '',
    DEMANDEUR: '',
    
    // Planification
    DT_INTER_DBT: '',
    HR_DEBUT: '',
    DT_INTER_FIN: '',
    HR_FIN: '',
    
    // Statut et options
    ST_INTER: 0, // 0=Planifiée par défaut
    ID2GENRE_INTER: 1, // 1=Maintenance par défaut
    SUR_SITE: false,
    
    // Champs personnalisés
    USDEF_LIB: '',
    USDEF_NUM: '',
    USDEF_BOO: false
  });

  useEffect(() => {
    loadSelectData();
  }, []);

  const loadSelectData = async () => {
    try {
      // Charger les contacts
      const contactsResponse = await fetch('/api/contacts?page=1&limit=1000');
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.contacts || []);
      }

      // Charger les véhicules
      const vehiclesResponse = await fetch('/api/vehicles');
      if (vehiclesResponse.ok) {
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData || []);
      }

      // Charger les utilisateurs
      const usersResponse = await fetch('/api/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.IDVEHICULE?.toString() === vehicleId || v.IDMACHINE?.toString() === vehicleId);
    if (vehicle) {
      const machineId = vehicle.IDMACHINE || vehicle.IDVEHICULE;
      handleInputChange('CLE_MACHINE_CIBLE', `R${machineId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/interventions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          IDCONTACT: formData.IDCONTACT ? parseInt(formData.IDCONTACT) : null,
          USDEF_NUM: formData.USDEF_NUM ? parseFloat(formData.USDEF_NUM) : null,
        }),
      });

      if (response.ok) {
        const newIntervention = await response.json();
        toast({
          title: "Succès",
          description: "Intervention créée avec succès",
        });
        navigate(`/interventions/${newIntervention.IDINTERVENTION}`);
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'intervention",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusOptions = () => [
    { value: '0', label: 'Planifiée' },
    { value: '1', label: 'En cours' },
    { value: '9', label: 'Terminée' },
    { value: '10', label: 'Annulée' }
  ];

  const getTypeOptions = () => [
    { value: '1', label: 'Maintenance' },
    { value: '2', label: 'Réparation' },
    { value: '3', label: 'Contrôle' },
    { value: '4', label: 'Nettoyage' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/interventions')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Nouvelle intervention
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Créer une nouvelle intervention
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lib50">Libellé court (50 caractères max)</Label>
                  <Input
                    id="lib50"
                    value={formData.LIB50}
                    onChange={(e) => handleInputChange('LIB50', e.target.value)}
                    maxLength={50}
                    placeholder="Résumé de l'intervention"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="demandeur">Demandeur</Label>
                  <Input
                    id="demandeur"
                    value={formData.DEMANDEUR}
                    onChange={(e) => handleInputChange('DEMANDEUR', e.target.value)}
                    placeholder="Nom du demandeur"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  value={formData.LIB_INTERVENTION}
                  onChange={(e) => handleInputChange('LIB_INTERVENTION', e.target.value)}
                  placeholder="Description complète de l'intervention"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contact">Client</Label>
                  <Select value={formData.IDCONTACT} onValueChange={(value) => handleInputChange('IDCONTACT', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.IDCONTACT} value={contact.IDCONTACT.toString()}>
                          {contact.RAISON_SOCIALE || `${contact.PRENOM} ${contact.NOMFAMILLE}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle">Véhicule</Label>
                  <Select onValueChange={handleVehicleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem 
                          key={vehicle.IDVEHICULE || vehicle.IDMACHINE} 
                          value={(vehicle.IDMACHINE || vehicle.IDVEHICULE)?.toString() || ''}
                        >
                          {vehicle.LIB_MACHINE || `${vehicle.MARQUE} ${vehicle.MODELE}` || vehicle.IMMAT || 'Véhicule sans nom'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="technicien">Technicien</Label>
                  <Select value={formData.CDUSER} onValueChange={(value) => handleInputChange('CDUSER', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigner un technicien" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.CDUSER} value={user.CDUSER}>
                          {`${user.PRENOM} ${user.NOMFAMILLE}` || user.CDUSER}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Planification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Planification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={formData.DT_INTER_DBT}
                    onChange={(e) => handleInputChange('DT_INTER_DBT', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="heureDebut">Heure de début</Label>
                  <Input
                    id="heureDebut"
                    type="time"
                    value={formData.HR_DEBUT}
                    onChange={(e) => handleInputChange('HR_DEBUT', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={formData.DT_INTER_FIN}
                    onChange={(e) => handleInputChange('DT_INTER_FIN', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="heureFin">Heure de fin</Label>
                  <Input
                    id="heureFin"
                    type="time"
                    value={formData.HR_FIN}
                    onChange={(e) => handleInputChange('HR_FIN', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Statut et options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Statut et options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={formData.ST_INTER.toString()} onValueChange={(value) => handleInputChange('ST_INTER', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type d'intervention</Label>
                  <Select value={formData.ID2GENRE_INTER.toString()} onValueChange={(value) => handleInputChange('ID2GENRE_INTER', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getTypeOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="surSite"
                    checked={formData.SUR_SITE}
                    onCheckedChange={(checked) => handleInputChange('SUR_SITE', checked)}
                  />
                  <Label htmlFor="surSite">Intervention sur site</Label>
                </div>
              </div>

              {/* Champs personnalisés */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="usdefLib">Champ personnalisé (texte)</Label>
                  <Input
                    id="usdefLib"
                    value={formData.USDEF_LIB}
                    onChange={(e) => handleInputChange('USDEF_LIB', e.target.value)}
                    placeholder="Texte libre"
                  />
                </div>
                <div>
                  <Label htmlFor="usdefNum">Champ personnalisé (nombre)</Label>
                  <Input
                    id="usdefNum"
                    type="number"
                    value={formData.USDEF_NUM}
                    onChange={(e) => handleInputChange('USDEF_NUM', e.target.value)}
                    placeholder="Valeur numérique"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="usdefBoo"
                    checked={formData.USDEF_BOO}
                    onCheckedChange={(checked) => handleInputChange('USDEF_BOO', checked)}
                  />
                  <Label htmlFor="usdefBoo">Champ personnalisé (booléen)</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/interventions')}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Création...' : 'Créer l\'intervention'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateIntervention; 