import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin, Building, Loader, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContacts = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Fonction pour formater le type de contact
  const formatContactType = (type: number) => {
    const typeMap: { [key: number]: { label: string; variant: string } } = {
      0: { label: 'Particulier', variant: 'default' },
      1: { label: 'Professionnel', variant: 'secondary' },
      2: { label: 'Entreprise', variant: 'outline' }
    };
    return typeMap[type] || { label: 'Non défini', variant: 'secondary' };
  };

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact =>
    (contact.NOMFAMILLE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.PRENOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.RAISON_SOCIALE?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.VILLE?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (contactId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        const response = await fetch(`/api/contacts/${contactId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          loadContacts();
        } else {
          alert('Erreur lors de la suppression du contact');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du contact');
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des contacts...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Clients
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {contacts.length} contacts dans la base MySQL
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => loadContacts(true)} 
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link to="/clients/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau contact
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Particuliers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contacts.filter(c => c.ICLTPRO === 0).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Professionnels</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {contacts.filter(c => c.ICLTPRO === 1).length}
                  </p>
                </div>
                <Building className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avec email</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {contacts.filter(c => c.EMAIL && c.EMAIL.trim() !== '').length}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, prénom, société, email, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coordonnées</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Aucun contact trouvé pour cette recherche' : 'Aucun contact trouvé'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map((contact) => {
                      const contactType = formatContactType(contact.ICLTPRO);
                      
                      return (
                        <TableRow key={contact.IDCONTACT}>
                          <TableCell>
                            <div className="font-medium text-gray-900 dark:text-white">
                              #{contact.IDCONTACT}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {contact.RAISON_SOCIALE ? (
                                  contact.RAISON_SOCIALE
                                ) : (
                                  `${contact.PRENOM || ''} ${contact.NOMFAMILLE || ''}`.trim() || 'Nom non renseigné'
                                )}
                              </div>
                              {contact.RAISON_SOCIALE && (contact.PRENOM || contact.NOMFAMILLE) && (
                                <div className="text-sm text-gray-500">
                                  {contact.PRENOM} {contact.NOMFAMILLE}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={contactType.variant as any}>
                              {contactType.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {contact.TEL1 && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                  {contact.TEL1}
                                </div>
                              )}
                              {contact.EMAIL && (
                                <div className="flex items-center text-sm">
                                  <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                  <a href={`mailto:${contact.EMAIL}`} className="text-blue-600 hover:underline">
                                    {contact.EMAIL}
                                  </a>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {contact.ADRESSE && (
                                <div className="flex items-start">
                                  <MapPin className="w-3 h-3 mr-1 text-gray-400 mt-0.5" />
                                  <div>
                                    <div>{contact.ADRESSE}</div>
                                    <div>{contact.CP} {contact.VILLE}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {contact.CDREGION || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link to={`/clients/${contact.IDCONTACT}`}>
                                <Button variant="ghost" size="sm" title="Voir le détail">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/clients/${contact.IDCONTACT}/edit`}>
                                <Button variant="ghost" size="sm" title="Modifier">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(contact.IDCONTACT)}
                                title="Supprimer"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Clients;