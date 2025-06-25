import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Building, Phone, Mail, MapPin, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ICLTPRO: 0,
    RAISON_SOCIALE: '',
    NOMFAMILLE: '',
    PRENOM: '',
    ADRESSE: '',
    CP: '',
    VILLE: '',
    CDREGION: '',
    TEL1: '',
    TEL2: '',
    TEL3: '',
    EMAIL: '',
    OBSERVATION: ''
  });

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${id}`);
      if (response.ok) {
        const contact = await response.json();
        setFormData({
          ICLTPRO: contact.ICLTPRO || 0,
          RAISON_SOCIALE: contact.RAISON_SOCIALE || '',
          NOMFAMILLE: contact.NOMFAMILLE || '',
          PRENOM: contact.PRENOM || '',
          ADRESSE: contact.ADRESSE || '',
          CP: contact.CP || '',
          VILLE: contact.VILLE || '',
          CDREGION: contact.CDREGION || '',
          TEL1: contact.TEL1 || '',
          TEL2: contact.TEL2 || '',
          TEL3: contact.TEL3 || '',
          EMAIL: contact.EMAIL || '',
          OBSERVATION: contact.OBSERVATION || ''
        });
      } else {
        alert('Contact introuvable');
        navigate('/clients');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement du contact');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      ICLTPRO: parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate(`/clients/${id}`);
      } else {
        const error = await response.text();
        alert(`Erreur lors de la modification du contact: ${error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du contact');
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
            <p>Chargement du contact...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <Link to={`/clients/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Modifier le contact
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Contact #{id}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Type de contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.ICLTPRO.toString()}
                onValueChange={handleTypeChange}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="particulier" />
                  <Label htmlFor="particulier">Particulier</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="professionnel" />
                  <Label htmlFor="professionnel">Professionnel</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {formData.ICLTPRO === 1 ? (
                  <Building className="w-5 h-5 mr-2" />
                ) : (
                  <User className="w-5 h-5 mr-2" />
                )}
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.ICLTPRO === 1 && (
                  <div className="md:col-span-2">
                    <Label htmlFor="RAISON_SOCIALE">Raison sociale *</Label>
                    <Input
                      id="RAISON_SOCIALE"
                      name="RAISON_SOCIALE"
                      value={formData.RAISON_SOCIALE}
                      onChange={handleInputChange}
                      placeholder="Nom de l'entreprise"
                      required={formData.ICLTPRO === 1}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="NOMFAMILLE">Nom de famille *</Label>
                  <Input
                    id="NOMFAMILLE"
                    name="NOMFAMILLE"
                    value={formData.NOMFAMILLE}
                    onChange={handleInputChange}
                    placeholder="Nom de famille"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="PRENOM">Prénom *</Label>
                  <Input
                    id="PRENOM"
                    name="PRENOM"
                    value={formData.PRENOM}
                    onChange={handleInputChange}
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordonnées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="TEL1">Téléphone principal</Label>
                  <Input
                    id="TEL1"
                    name="TEL1"
                    value={formData.TEL1}
                    onChange={handleInputChange}
                    placeholder="01 23 45 67 89"
                    type="tel"
                  />
                </div>

                <div>
                  <Label htmlFor="TEL2">Téléphone secondaire</Label>
                  <Input
                    id="TEL2"
                    name="TEL2"
                    value={formData.TEL2}
                    onChange={handleInputChange}
                    placeholder="01 23 45 67 89"
                    type="tel"
                  />
                </div>

                <div>
                  <Label htmlFor="TEL3">Téléphone mobile</Label>
                  <Input
                    id="TEL3"
                    name="TEL3"
                    value={formData.TEL3}
                    onChange={handleInputChange}
                    placeholder="06 12 34 56 78"
                    type="tel"
                  />
                </div>

                <div>
                  <Label htmlFor="EMAIL">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </Label>
                  <Input
                    id="EMAIL"
                    name="EMAIL"
                    value={formData.EMAIL}
                    onChange={handleInputChange}
                    placeholder="contact@exemple.fr"
                    type="email"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ADRESSE">Adresse</Label>
                  <Input
                    id="ADRESSE"
                    name="ADRESSE"
                    value={formData.ADRESSE}
                    onChange={handleInputChange}
                    placeholder="123 rue de la Paix"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="CP">Code postal</Label>
                    <Input
                      id="CP"
                      name="CP"
                      value={formData.CP}
                      onChange={handleInputChange}
                      placeholder="75000"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="VILLE">Ville</Label>
                    <Input
                      id="VILLE"
                      name="VILLE"
                      value={formData.VILLE}
                      onChange={handleInputChange}
                      placeholder="Paris"
                    />
                  </div>

                  <div>
                    <Label htmlFor="CDREGION">Région</Label>
                    <Input
                      id="CDREGION"
                      name="CDREGION"
                      value={formData.CDREGION}
                      onChange={handleInputChange}
                      placeholder="IDF"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle>Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="OBSERVATION">Notes et commentaires</Label>
              <Textarea
                id="OBSERVATION"
                name="OBSERVATION"
                value={formData.OBSERVATION}
                onChange={handleInputChange}
                placeholder="Informations complémentaires..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            <Link to={`/clients/${id}`}>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditClient;