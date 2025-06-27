import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, User, MapPin, Edit, Trash2, ArrowLeft, 
  Phone, Mail, Car, AlertTriangle, FileText, Settings, 
  Image, MessageSquare, Send, Upload, Download, Eye,
  Camera, PlusCircle, FileIcon
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import InterventionAnomalies from '@/components/Interventions/InterventionAnomalies';

const InterventionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [intervention, setIntervention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // États pour l'onglet Rapport
  const [documents, setDocuments] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (id) {
      loadIntervention();
      loadDocuments();
      loadComments();
    }
  }, [id]);

  const loadIntervention = async () => {
    try {
      const response = await fetch(`/api/interventions/${id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setIntervention(data);
      } else {
        throw new Error('Intervention non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'intervention:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'intervention",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch(`/api/interventions/${id}/documents`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/interventions/${id}/comments`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const handleDeleteIntervention = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      try {
        const response = await fetch(`/api/interventions/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          toast({
            title: "Succès",
            description: "Intervention supprimée avec succès",
          });
          navigate('/interventions');
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'intervention",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/interventions/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          LIB100: 'Commentaire intervention',
          COMMENTAIRE: newComment,
          CDUSER: 'WEB', // TODO: utiliser l'utilisateur connecté
        }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments();
        toast({
          title: "Succès",
          description: "Commentaire ajouté",
        });
      }
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      // Pour l'instant, simuler l'upload en créant juste l'entrée document
      const response = await fetch(`/api/interventions/${id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          LIB100: file.name,
          FILEREF: file.name,
          COMMENTAIRE: `Photo/document: ${file.name}`,
          CDUSER: 'WEB', // TODO: utiliser l'utilisateur connecté
          ID2GENRE_DOCUMENT: file.type.includes('image') ? 1 : 2, // 1=Image, 2=Document
        }),
      });

      if (response.ok) {
        loadDocuments();
        toast({
          title: "Succès",
          description: "Fichier ajouté",
        });
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le fichier",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Fonctions utilitaires
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 9:
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 1:
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 0:
        return <Badge className="bg-orange-100 text-orange-800">Planifiée</Badge>;
      case 10:
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">Statut {status}</Badge>;
    }
  };

  const getInterventionType = (typeInter: number) => {
    switch (typeInter) {
      case 1: return 'Maintenance';
      case 2: return 'Réparation';
      case 3: return 'Contrôle';
      case 4: return 'Nettoyage';
      default: return 'Non défini';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatFullName = (nom: string, prenom: string) => {
    if (!nom && !prenom) return '-';
    return `${prenom || ''} ${nom || ''}`.trim();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4">Chargement de l'intervention...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!intervention) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Intervention non trouvée</h1>
          <Link to="/interventions">
            <Button>Retour aux interventions</Button>
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
            <Button 
              variant="outline" 
              onClick={() => navigate('/interventions')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {intervention.LIB50 || 'Intervention'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">#{intervention.IDINTERVENTION}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/interventions/${intervention.IDINTERVENTION}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDeleteIntervention}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Statut principal */}
        <div className="flex items-center gap-4">
          {getStatusBadge(intervention.ST_INTER)}
          {intervention.SUR_SITE === 1 && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <MapPin className="w-3 h-3 mr-1" />
              Sur site
            </Badge>
          )}
          <Badge variant="outline">
            {getInterventionType(intervention.ID2GENRE_INTER)}
          </Badge>
        </div>

        {/* Informations principales en cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {intervention.CONTACT_RAISON_SOCIALE || 
                   formatFullName(intervention.CONTACT_NOM, intervention.CONTACT_PRENOM) || 
                   'Non défini'}
                </p>
                {intervention.CONTACT_EMAIL && (
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${intervention.CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
                      {intervention.CONTACT_EMAIL}
                    </a>
                  </div>
                )}
                {intervention.CONTACT_TEL && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${intervention.CONTACT_TEL}`} className="text-blue-600 hover:underline">
                      {intervention.CONTACT_TEL}
                    </a>
                  </div>
                )}
                {intervention.CONTACT_ADRESSE1 && (
                  <div className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 mr-2 mt-1" />
                    <div>
                      <div>{intervention.CONTACT_ADRESSE1}</div>
                      {intervention.CONTACT_VILLE && <div>{intervention.CONTACT_VILLE}</div>}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {intervention.VEHICULE_LIB_MACHINE || 
                   `${intervention.VEHICULE_MARQUE || ''} ${intervention.VEHICULE_MODELE || ''}`.trim() ||
                   'Non défini'}
                </p>
                {intervention.VEHICULE_IMMAT && (
                  <div className="text-sm">
                    <span className="font-medium">Immatriculation: </span>
                    {intervention.VEHICULE_IMMAT}
                  </div>
                )}
                {intervention.VEHICULE_CODE && (
                  <div className="text-sm">
                    <span className="font-medium">Code machine: </span>
                    {intervention.VEHICULE_CODE}
                  </div>
                )}
                {intervention.VEHICULE_IDMACHINE && (
                  <Link to={`/vehicles/${intervention.VEHICULE_IDMACHINE}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir véhicule
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technicien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Technicien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {formatFullName(intervention.TECHNICIEN_NOM, intervention.TECHNICIEN_PRENOM) || 
                   intervention.CDUSER || 
                   'Non assigné'}
                </p>
                {intervention.TECHNICIEN_EMAIL && (
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href={`mailto:${intervention.TECHNICIEN_EMAIL}`} className="text-blue-600 hover:underline">
                      {intervention.TECHNICIEN_EMAIL}
                    </a>
                  </div>
                )}
                {intervention.TECHNICIEN_TEL && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${intervention.TECHNICIEN_TEL}`} className="text-blue-600 hover:underline">
                      {intervention.TECHNICIEN_TEL}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets pour le contenu détaillé */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="rapport">Rapport</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de planification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Planification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Date début:</span>
                    <span className="ml-2">{formatDate(intervention.DT_INTER_DBT)}</span>
                  </div>
                  {intervention.HR_DEBUT && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Heure début:</span>
                      <span className="ml-2">{intervention.HR_DEBUT}</span>
                    </div>
                  )}
                  {intervention.DT_INTER_FIN && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Date fin:</span>
                      <span className="ml-2">{formatDate(intervention.DT_INTER_FIN)}</span>
                    </div>
                  )}
                  {intervention.HR_FIN && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Heure fin:</span>
                      <span className="ml-2">{intervention.HR_FIN}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description et commentaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {intervention.LIB_INTERVENTION && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-sm">{intervention.LIB_INTERVENTION}</p>
                    </div>
                  )}
                  {intervention.DEMANDEUR && (
                    <div>
                      <span className="font-medium">Demandeur:</span>
                      <p className="mt-1 text-sm">{intervention.DEMANDEUR}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rapport" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Documents et photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Photos et Documents
                    </span>
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={uploadingFile}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? 'Upload...' : 'Ajouter'}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.length === 0 ? (
                      <p className="text-gray-500 text-sm">Aucun document</p>
                    ) : (
                      documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center">
                            {doc.ID2GENRE_DOCUMENT === 1 ? (
                              <Image className="w-4 h-4 mr-2" />
                            ) : (
                              <FileIcon className="w-4 h-4 mr-2" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{doc.LIB100}</p>
                              <p className="text-xs text-gray-500">
                                {formatFullName(doc.NOMFAMILLE, doc.PRENOM)} - {formatDateTime(doc.DHCRE)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline des commentaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Commentaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Formulaire pour nouveau commentaire */}
                    <div className="border rounded-lg p-3">
                      <Label htmlFor="new-comment">Ajouter un commentaire</Label>
                      <Textarea
                        id="new-comment"
                        placeholder="Écrivez votre commentaire..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                      <Button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="mt-2"
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>

                    {/* Timeline des commentaires */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {comments.length === 0 ? (
                        <p className="text-gray-500 text-sm">Aucun commentaire</p>
                      ) : (
                        comments.map((comment, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">
                                {formatFullName(comment.NOMFAMILLE, comment.PRENOM) || comment.CDUSER}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(comment.DHCRE)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.COMMENTAIRE}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anomalies">
            <Card>
              <CardHeader>
                <CardTitle>Anomalies détectées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Fonctionnalité en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Photos de l'intervention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documents
                    .filter(doc => doc.ID2GENRE_DOCUMENT === 1)
                    .map((photo, index) => (
                      <div key={index} className="border rounded-lg p-4 text-center">
                        <Image className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium">{photo.LIB100}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(photo.DHCRE)}</p>
                      </div>
                    ))}
                  {documents.filter(doc => doc.ID2GENRE_DOCUMENT === 1).length === 0 && (
                    <p className="text-gray-500 col-span-full text-center">Aucune photo</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default InterventionDetails;
