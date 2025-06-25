import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Building, User, Calendar, Truck, FileText, AlertTriangle, Loader } from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<any>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [vehicules, setVehicules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactData();
  }, [id]);

  const loadContactData = async () => {
    try {
      setLoading(true);
      
      // Charger les données du contact
      const contactResponse = await fetch(`/api/contacts/${id}`);
      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        setContact(contactData);
      }

      // Charger les interventions liées au contact
      const interventionsResponse = await fetch('/api/interventions');
      if (interventionsResponse.ok) {
        const interventionsData = await interventionsResponse.json();
        const clientInterventions = interventionsData.filter((intervention: any) => 
          intervention.IDCONTACT?.toString() === id
        );
        setInterventions(clientInterventions);
      }

      // Charger les véhicules liés au contact
      const vehiculesResponse = await fetch('/api/vehicules');
      if (vehiculesResponse.ok) {
        const vehiculesData = await vehiculesResponse.json();
        const clientVehicules = vehiculesData.filter((vehicule: any) => 
          vehicule.IDCONTACT?.toString() === id
        );
        setVehicules(clientVehicules);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatStatus = (status: number) => {
    const statusMap: { [key: number]: { label: string; variant: string } } = {
      0: { label: 'Planifiée', variant: 'secondary' },
      1: { label: 'En cours', variant: 'default' },
      9: { label: 'Terminée', variant: 'secondary' },
      10: { label: 'Annulée', variant: 'destructive' }
    };
    return statusMap[status] || { label: 'Inconnu', variant: 'secondary' };
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des détails du contact...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!contact) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contact introuvable
          </h1>
          <Link to="/clients">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux contacts
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/clients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {contact.RAISON_SOCIALE || `${contact.PRENOM || ''} ${contact.NOMFAMILLE || ''}`.trim() || 'Contact sans nom'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Contact #{contact.IDCONTACT}
              </p>
            </div>
          </div>
          <Link to={`/clients/${contact.IDCONTACT}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <div className="mt-1">
                      <Badge variant={contact.ICLTPRO === 1 ? 'default' : 'secondary'}>
                        {contact.ICLTPRO === 1 ? 'Professionnel' : 'Particulier'}
                      </Badge>
                    </div>
                  </div>
                  
                  {contact.RAISON_SOCIALE && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Raison sociale</label>
                      <div className="mt-1 flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {contact.RAISON_SOCIALE}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom et prénom</label>
                    <div className="mt-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.PRENOM} {contact.NOMFAMILLE}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {contact.TEL1 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Téléphone principal</label>
                      <div className="mt-1 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`tel:${contact.TEL1}`} className="text-blue-600 hover:underline">
                          {contact.TEL1}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.EMAIL && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="mt-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`mailto:${contact.EMAIL}`} className="text-blue-600 hover:underline">
                          {contact.EMAIL}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.ADRESSE && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Adresse</label>
                      <div className="mt-1 flex items-start">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <div>{contact.ADRESSE}</div>
                          <div>{contact.CP} {contact.VILLE}</div>
                          {contact.CDREGION && <div>Région: {contact.CDREGION}</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">Interventions</span>
                  </div>
                  <span className="font-bold text-blue-600">{interventions.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">Véhicules</span>
                  </div>
                  <span className="font-bold text-green-600">{vehicules.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <span className="font-bold text-purple-600">0</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm">Alertes</span>
                  </div>
                  <span className="font-bold text-red-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets détaillés */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="interventions" className="w-full">
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
                <TabsTrigger value="interventions">Interventions ({interventions.length})</TabsTrigger>
                <TabsTrigger value="vehicules">Véhicules ({vehicules.length})</TabsTrigger>
                <TabsTrigger value="contrats">Contrats (0)</TabsTrigger>
                <TabsTrigger value="documents">Documents (0)</TabsTrigger>
                <TabsTrigger value="alertes">Alertes (0)</TabsTrigger>
              </TabsList>

              <TabsContent value="interventions" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historique des interventions</h3>
                  {interventions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucune intervention pour ce contact</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Libellé</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date début</TableHead>
                          <TableHead>Date fin</TableHead>
                          <TableHead>Utilisateur</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interventions.map((intervention) => {
                          const status = formatStatus(intervention.ST_INTER);
                          return (
                            <TableRow key={intervention.IDINTERVENTION}>
                              <TableCell>#{intervention.IDINTERVENTION}</TableCell>
                              <TableCell>{intervention.LIB50 || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={status.variant as any}>
                                  {status.label}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(intervention.DT_INTER_DBT)}</TableCell>
                              <TableCell>{formatDate(intervention.DT_INTER_FIN)}</TableCell>
                              <TableCell>{intervention.CDUSER || '-'}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="vehicules" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Véhicules liés</h3>
                  {vehicules.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucun véhicule lié à ce contact</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Immatriculation</TableHead>
                          <TableHead>Marque/Modèle</TableHead>
                          <TableHead>Carburant</TableHead>
                          <TableHead>Kilométrage</TableHead>
                          <TableHead>Contrôle technique</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicules.map((vehicule) => (
                          <TableRow key={vehicule.IDVEHICULE}>
                            <TableCell>#{vehicule.IDVEHICULE}</TableCell>
                            <TableCell>{vehicule.IMMAT || '-'}</TableCell>
                            <TableCell>{vehicule.MARQUE} {vehicule.MODELE}</TableCell>
                            <TableCell>{vehicule.CARBURANT || '-'}</TableCell>
                            <TableCell>
                              {vehicule.KMACTUEL ? `${vehicule.KMACTUEL.toLocaleString()} km` : '-'}
                            </TableCell>
                            <TableCell>{formatDate(vehicule.DT_CTRLTECH)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contrats" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contrats</h3>
                  <p className="text-gray-500 text-center py-8">Fonctionnalité à développer</p>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <p className="text-gray-500 text-center py-8">Fonctionnalité à développer</p>
                </div>
              </TabsContent>

              <TabsContent value="alertes" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Alertes liées aux véhicules</h3>
                  <p className="text-gray-500 text-center py-8">Fonctionnalité à développer</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ClientDetails;