import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin, Building, Loader, RefreshCw, ChevronLeft, ChevronRight, List, Grid, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { offlineStorage } from '@/services/offlineStorage';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Adjusted for better grid layout
    total: 0,
  });

  const loadContacts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setIsOffline(false);

    try {
      const response = await fetch(`/api/contacts?page=${pagination.page}&limit=${pagination.limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.warn('Erreur lors du chargement des contacts depuis le réseau. Tentative de chargement local.', error);
      setIsOffline(true);
      try {
        const offlineContacts = await offlineStorage.getCache('contacts');
        if (offlineContacts && Array.isArray(offlineContacts)) {
          setContacts(offlineContacts);
          setPagination(prev => ({...prev, total: offlineContacts.length, page: 1}));
        } else {
          setContacts([]);
        }
      } catch (offlineError) {
        console.error('Erreur lors du chargement des contacts depuis le cache:', offlineError);
        setContacts([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const formatContactType = (type: number) => {
    const typeMap: { [key: number]: { label: string; variant: string } } = {
      0: { label: 'Particulier', variant: 'default' },
      1: { label: 'Professionnel', variant: 'secondary' },
    };
    return typeMap[type] || { label: 'Non défini', variant: 'secondary' };
  };

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

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <AppLayout>
        {isOffline && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-700">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">Mode hors ligne actif</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Les données affichées proviennent du cache et peuvent ne pas être à jour.
            </p>
          </div>
        )}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des contacts...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const renderContactCard = (contact: any, isListView: boolean) => {
    const contactType = formatContactType(contact.ICLTPRO);

    // Determine which contact details to use based on ICLTPRO
    const tel1 = contact.ICLTPRO === 1 ? contact.TELP1 : contact.TEL1;
    const tel2 = contact.ICLTPRO === 1 ? contact.TELP2 : contact.TEL2;
    const email = contact.ICLTPRO === 1 ? contact.EMAILP : contact.EMAIL;
    const address1 = contact.ICLTPRO === 1 ? contact.ADRESSEP1 : contact.ADRESSE1;
    const address2 = contact.ICLTPRO === 1 ? contact.ADRESSEP2 : contact.ADRESSE2;
    const postalCode = contact.ICLTPRO === 1 ? contact.CPOSTALP : contact.CPOSTAL;
    const city = contact.ICLTPRO === 1 ? contact.VILLEP : contact.VILLE;
    const region = contact.ICLTPRO === 1 ? contact.CDREGIONP : contact.CDREGION;

    const fullAddress = `${address1 || ''} ${address2 || ''} ${postalCode || ''} ${city || ''} ${region || ''}`.trim();
    const googleMapsLink = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : '#';

    const formatGender = (genderId: number) => {
      switch (genderId) {
        case 1: return 'Homme';
        case 2: return 'Femme';
        default: return 'Non spécifié';
      }
    };

    const cardClass = isListView
      ? "flex flex-col sm:flex-row w-full"
      : "flex flex-col";

    return (
      <AppLayout>
        {isOffline && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-700">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">Mode hors ligne actif</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Les données affichées proviennent du cache et peuvent ne pas être à jour.
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Card key={contact.IDCONTACT} className={cardClass}>
              <div className={`flex-grow ${isListView ? 'sm:w-2/3' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="truncate">
                      {contact.RAISON_SOCIALE ? (
                        <>
                          {contact.RAISON_SOCIALE}
                          <div className="text-sm font-normal text-gray-500">
                            {contact.PRENOM} {contact.NOMFAMILLE}
                          </div>
                        </>
                      ) : (
                        `${contact.PRENOM} ${contact.NOMFAMILLE}`
                      )}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={contactType.variant as any} className="flex-shrink-0">{contactType.label}</Badge>
                      {contact.interventionCount !== undefined && (
                        <Badge variant="outline" className="flex-shrink-0">
                          Interventions: {contact.interventionCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a href={`mailto:${email}`} className="truncate text-blue-600 hover:underline">
                        {email || 'N/A'}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{tel1 || 'N/A'}</span>
                    </div>
                    {tel2 && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{tel2}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <span>
                        {address1 && <div>{address1}</div>}
                        {address2 && <div>{address2}</div>}
                        {(postalCode || city) && <div>{postalCode} {city}</div>}
                        {region && <div>{region}</div>}
                        {fullAddress && (
                          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Voir sur Google Maps
                          </a>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Genre: {formatGender(contact.ID2GENRE_CONTACT)}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className={`flex p-4 border-t sm:border-t-0 sm:border-l ${isListView ? 'sm:w-1/3 sm:flex-col sm:justify-center' : 'justify-end'}`}>
                <div className={`flex ${isListView ? 'flex-col space-y-2' : 'space-x-2'}`}>
                  <Link to={`/clients/${contact.IDCONTACT}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full flex justify-center items-center"><Eye className="w-4 h-4 mr-2" /> Voir</Button>
                  </Link>
                  <Link to={`/clients/${contact.IDCONTACT}/edit`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full flex justify-center items-center"><Edit className="w-4 h-4 mr-2" /> Modifier</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.IDCONTACT)} className="w-full flex justify-center items-center">
                    <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{pagination.total} contacts</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => loadContacts(true)} disabled={refreshing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link to="/clients/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant={view === 'grid' ? 'secondary' : 'outline'} onClick={() => setView('grid')}><Grid className="w-4 h-4" /></Button>
                <Button variant={view === 'list' ? 'secondary' : 'outline'} onClick={() => setView('list')}><List className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium">Aucun contact trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Les données sont peut-être en cours de chargement ou aucun contact ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredContacts.map((contact) => renderContactCard(contact, view === 'list'))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center pt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
              <span className="text-sm text-gray-600">Page {pagination.page} sur {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= totalPages}>
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;