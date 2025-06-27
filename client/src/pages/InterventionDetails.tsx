import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, User, MapPin, Edit, Trash2, ArrowLeft, 
  Phone, Mail, Car, AlertTriangle, FileText, Settings, 
  Image, MessageSquare, Send, Upload, Download, Eye,
  Camera, PlusCircle, FileIcon, Save, Plus, Paperclip,
  Reply, X, Check, CheckCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import AppLayout from '@/components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import InterventionAnomalies from '@/components/Interventions/InterventionAnomalies';
import InterventionCustomFields from '@/components/Interventions/InterventionCustomFields';
import InterventionFormsTab from '@/components/Interventions/InterventionFormsTab';

const InterventionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [intervention, setIntervention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // États pour l'onglet Rapport
  const [documents, setDocuments] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // États pour le Chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [uploadingChatFile, setUploadingChatFile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [messageReactions, setMessageReactions] = useState<{[key: number]: string[]}>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // États pour les commentaires d'upload
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadDialogType, setUploadDialogType] = useState<'chat' | 'rapport'>('chat');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadComment, setUploadComment] = useState('');

  // États pour les instructions avancées
  const [instructions, setInstructions] = useState('');
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);

  // États pour les accordéons
  const [isPointageFormOpen, setIsPointageFormOpen] = useState(false);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadIntervention();
      loadDocuments();
      loadComments();
      loadChatMessages();
      loadInstructions();
    }
  }, [id]);

  // Fermer le picker d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEmojiPicker(null);
    };

    if (showEmojiPicker !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showEmojiPicker]);

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

  const loadChatMessages = async () => {
    try {
      const response = await fetch(`/api/interventions/${id}/chat`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
        // Scroll vers le bas après le chargement des messages
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages du chat:', error);
    }
  };

  const loadInstructions = async () => {
    try {
      setLoadingInstructions(true);
      const response = await fetch(`/api/interventions/${id}/instructions`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setInstructions(data.INSTRUCTIONS || '');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des instructions:', error);
    } finally {
      setLoadingInstructions(false);
    }
  };

  const saveInstructions = async () => {
    try {
      setSavingInstructions(true);
      const response = await fetch(`/api/interventions/${id}/instructions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          instructions,
          userId: user?.CDUSER || 'WEB'
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Instructions sauvegardées",
        });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde instructions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les instructions",
        variant: "destructive",
      });
    } finally {
      setSavingInstructions(false);
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

  const handleReportFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ouvrir le dialog de commentaire
    setPendingFile(file);
    setUploadDialogType('rapport');
    setUploadComment('');
    setShowUploadDialog(true);
    
    // Réinitialiser l'input file
    event.target.value = '';
  };

  const handleFileUpload = handleReportFileUpload;

  // Fonctions pour le Chat
  const handleAddChatMessage = async () => {
    if (!newChatMessage.trim()) return;

    try {
      const response = await fetch(`/api/interventions/${id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          CLE_PIECE_CIBLE: `INT${id}`,
          LIB100: 'Message chat',
          COMMENTAIRE: newChatMessage,
          CDUSER: user?.CDUSER || 'WEB',
          IDACTION_PREC: replyingTo?.IDACTION || 0,
        }),
      });

      if (response.ok) {
        setNewChatMessage('');
        setReplyingTo(null);
        loadChatMessages();
        toast({
          title: "Succès",
          description: "Message envoyé",
        });
        // Scroll vers le bas après envoi
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  const handleAddReaction = async (messageId: number, emoji: string) => {
    try {
      // TODO: Envoyer la réaction au serveur
      // Pour l'instant, on stocke localement
      setMessageReactions(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), emoji]
      }));
      setShowEmojiPicker(null);
      
      toast({
        title: "Réaction ajoutée",
        description: `${emoji} ajouté au message`,
      });
    } catch (error) {
      console.error('Erreur ajout réaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réaction",
        variant: "destructive",
      });
    }
  };

  const handleChatFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ouvrir le dialog de commentaire
    setPendingFile(file);
    setUploadDialogType('chat');
    setUploadComment('');
    setShowUploadDialog(true);
    
    // Réinitialiser l'input file
    event.target.value = '';
  };

  const confirmFileUpload = async () => {
    if (!pendingFile) return;

    if (uploadDialogType === 'chat') {
      setUploadingChatFile(true);
      try {
        // Utiliser FormData pour l'upload
        const formData = new FormData();
        formData.append('file', pendingFile);
        formData.append('cduser', user?.CDUSER || 'WEB');
        formData.append('comment', uploadComment || '');
        if (replyingTo?.IDACTION) {
          formData.append('replyTo', replyingTo.IDACTION.toString());
        }

        const response = await fetch(`/api/interventions/${id}/chat/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Upload réussi:', result);
          
          setReplyingTo(null);
          loadChatMessages();
          loadDocuments();
          toast({
            title: "Succès",
            description: pendingFile.type.includes('image') ? "Photo partagée" : "Document partagé",
          });
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Erreur d\'upload');
        }
      } catch (error) {
        console.error('Erreur partage fichier:', error);
        toast({
          title: "Erreur",
          description: "Impossible de partager le fichier",
          variant: "destructive",
        });
      } finally {
        setUploadingChatFile(false);
      }
    } else {
      // Upload pour rapport/photos
      setUploadingFile(true);
      try {
        const formData = new FormData();
        formData.append('file', pendingFile);
        formData.append('cduser', user?.CDUSER || 'WEB');
        formData.append('comment', uploadComment || '');

        const response = await fetch(`/api/interventions/${id}/photos/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          loadDocuments();
          toast({
            title: "Succès",
            description: "Photo ajoutée au rapport",
          });
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Erreur d\'upload');
        }
      } catch (error) {
        console.error('Erreur upload photo rapport:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la photo",
          variant: "destructive",
        });
      } finally {
        setUploadingFile(false);
      }
    }

    // Fermer le dialog
    setShowUploadDialog(false);
    setPendingFile(null);
    setUploadComment('');
  };

  const getInitials = (nom: string, prenom: string) => {
    const initials = `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`;
    return initials.toUpperCase() || '??';
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const hash = userId?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
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
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {intervention.LIB50 || 'Intervention'}
                </h1>
                <div className="flex items-center gap-2">
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
              </div>
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
                      <Car className="w-4 h-4 mr-2" />
                      Ouvrir véhicule
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
          <TabsList className="grid w-full grid-cols-10 text-xs">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="customfields">Champs custom</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="pointages">Pointages</TabsTrigger>
            <TabsTrigger value="ressources">Ressources</TabsTrigger>
            <TabsTrigger value="checklist">Check List</TabsTrigger>
            <TabsTrigger value="rapport">Rapport</TabsTrigger>
            <TabsTrigger value="formulaires">Formulaires</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
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
                      <p className="mt-1 text-sm whitespace-pre-wrap">{intervention.LIB_INTERVENTION}</p>
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

          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="documents" className="w-full">
                  <TabsList>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="procedures">Procédures</TabsTrigger>
                    <TabsTrigger value="advanced">Instructions avancées</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="documents" className="mt-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">Documents liés à l'intervention</h4>
                      <div className="space-y-3">
                        {documents.length === 0 ? (
                          <p className="text-gray-500 text-sm">Aucun document d'instruction</p>
                        ) : (
                          documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex items-center">
                                <FileIcon className="w-5 h-5 mr-3" />
                                <div>
                                  <p className="font-medium">{doc.LIB100}</p>
                                  <p className="text-sm text-gray-500">
                                    Ajouté le {formatDateTime(doc.DHCRE)}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Voir
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="procedures" className="mt-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">Procédures standard</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h5 className="font-medium">Procédure de maintenance préventive</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Contrôles visuels, vérification des niveaux, test des fonctions principales
                          </p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium">Procédure de diagnostic</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Analyse des codes d'erreur, tests électroniques, mesures
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Instructions détaillées</h4>
                        <Button 
                          onClick={saveInstructions}
                          disabled={savingInstructions}
                          size="sm"
                        >
                          {savingInstructions ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Sauvegarder
                        </Button>
                      </div>
                      
                      {loadingInstructions ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="border rounded-lg">
                          <Textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Saisissez les instructions détaillées pour cette intervention..."
                            className="min-h-[300px] border-0 resize-none"
                            style={{ whiteSpace: 'pre-wrap' }}
                          />
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        <p>💡 Vous pouvez utiliser du HTML pour formater le texte et insérer des images.</p>
                        <p>Exemple: &lt;b&gt;Texte en gras&lt;/b&gt;, &lt;img src="url" /&gt;</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pointages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Pointages temps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Formulaire de pointage masquable */}
                  <Collapsible open={isPointageFormOpen} onOpenChange={setIsPointageFormOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau pointage
                        </span>
                        {isPointageFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <Card className="bg-blue-50 dark:bg-blue-950">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="task-name">Tâche</Label>
                              <Input id="task-name" placeholder="Nom de la tâche" />
                            </div>
                            <div>
                              <Label htmlFor="time-spent">Temps passé (h)</Label>
                              <Input id="time-spent" type="number" step="0.5" placeholder="1.5" />
                            </div>
                            <div className="flex items-end">
                              <Button className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter pointage
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="task-description">Description (optionnel)</Label>
                            <Textarea id="task-description" placeholder="Détails de la tâche effectuée..." rows={2} />
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Liste des pointages */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Pointages enregistrés</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">Diagnostic initial</h5>
                            <Badge variant="outline">1.5h</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Analyse des symptômes et codes d'erreur</p>
                          <p className="text-xs text-gray-500 mt-1">Technicien: J. Dupont - 14:30-16:00</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">Réparation moteur</h5>
                            <Badge variant="outline">3.0h</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Remplacement de la courroie et révision</p>
                          <p className="text-xs text-gray-500 mt-1">Technicien: M. Martin - 08:00-11:00</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">Temps total:</span>
                      <Badge className="bg-blue-100 text-blue-800">4.5h</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ressources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Ressources & Prestations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Ajout de ressources masquable */}
                  <Collapsible open={isResourceFormOpen} onOpenChange={setIsResourceFormOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter une ressource
                        </span>
                        {isResourceFormOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <Card className="bg-green-50 dark:bg-green-950">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label htmlFor="resource-type">Type</Label>
                              <select id="resource-type" className="w-full p-2 border rounded">
                                <option value="prestation">Prestation</option>
                                <option value="fourniture">Fourniture</option>
                                <option value="piece">Pièce détachée</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="resource-name">Nom/Description</Label>
                              <Input id="resource-name" placeholder="Ex: Filtre à huile" />
                            </div>
                            <div>
                              <Label htmlFor="resource-qty">Quantité</Label>
                              <Input id="resource-qty" type="number" placeholder="1" />
                            </div>
                            <div className="flex items-end">
                              <Button className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="resource-price">Prix unitaire (€)</Label>
                              <Input id="resource-price" type="number" step="0.01" placeholder="25.90" />
                            </div>
                            <div>
                              <Label htmlFor="resource-ref">Référence</Label>
                              <Input id="resource-ref" placeholder="REF-123456" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Liste des ressources */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Ressources utilisées</h4>
                    
                    {/* Prestations */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Prestations</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <p className="font-medium">Diagnostic électronique</p>
                            <p className="text-sm text-gray-600">1 unité × 75.00€</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">75.00€</p>
                            <Badge variant="outline" className="text-xs">Prestation</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fournitures */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Fournitures</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <p className="font-medium">Huile moteur 5W30</p>
                            <p className="text-sm text-gray-600">5 litres × 8.50€ - Réf: OIL-5W30</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">42.50€</p>
                            <Badge variant="outline" className="text-xs">Fourniture</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <p className="font-medium">Filtre à huile</p>
                            <p className="text-sm text-gray-600">1 unité × 15.90€ - Réf: FIL-001</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">15.90€</p>
                            <Badge variant="outline" className="text-xs">Fourniture</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded font-medium">
                      <span>Total ressources:</span>
                      <span className="text-lg">133.40€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customfields">
            <InterventionCustomFields interventionId={intervention.IDINTERVENTION} />
          </TabsContent>

          <TabsContent value="anomalies">
            <InterventionAnomalies 
              interventionId={intervention.IDINTERVENTION.toString()} 
              vehicleId={intervention.CLE_MACHINE_CIBLE || "0"} 
            />
          </TabsContent>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Check List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <input type="checkbox" id="check1" className="w-4 h-4" />
                      <label htmlFor="check1" className="flex-1 font-medium">Vérification des niveaux</label>
                      <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <input type="checkbox" id="check2" className="w-4 h-4" defaultChecked />
                      <label htmlFor="check2" className="flex-1 font-medium">Test des fonctions principales</label>
                      <Badge variant="outline" className="text-xs">Obligatoire</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <input type="checkbox" id="check3" className="w-4 h-4" />
                      <label htmlFor="check3" className="flex-1 font-medium">Contrôle visuel extérieur</label>
                      <Badge variant="outline" className="text-xs">Recommandé</Badge>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <input type="checkbox" id="check4" className="w-4 h-4" defaultChecked />
                      <label htmlFor="check4" className="flex-1 font-medium">Nettoyage et rangement</label>
                      <Badge variant="outline" className="text-xs">Recommandé</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Progression:</span>
                      <span className="text-sm text-gray-600">2/4 éléments validés</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rapport">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Rapport d'intervention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Photos et documents */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Photos et documents</h4>
                      <div className="flex space-x-2">
                        <input
                          type="file"
                          id="report-file-upload"
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          multiple
                          onChange={handleReportFileUpload}
                          disabled={uploadingFile}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('report-file-upload')?.click()}
                          disabled={uploadingFile}
                        >
                          {uploadingFile ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                          ) : (
                            <Camera className="w-4 h-4 mr-2" />
                          )}
                          Ajouter photo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('report-file-upload')?.click()}
                          disabled={uploadingFile}
                        >
                          {uploadingFile ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          Ajouter document
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun document ajouté</p>
                        </div>
                      ) : (
                        documents.map((doc, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {doc.TYPE_FICHIER?.startsWith('image/') ? (
                                  <Image className="w-5 h-5 mr-2" />
                                ) : (
                                  <FileIcon className="w-5 h-5 mr-2" />
                                )}
                                <span className="text-sm font-medium truncate">{doc.LIB100}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                            {doc.COMMENTAIRE && (
                              <p className="text-xs text-gray-600 mb-2">{doc.COMMENTAIRE}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {formatDateTime(doc.DHCRE)} - {doc.CDUSER}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Commentaires du rapport */}
                  <div>
                    <h4 className="font-medium mb-4">Commentaires du rapport</h4>
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun commentaire</p>
                        </div>
                      ) : (
                        comments.map((comment, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                  {getInitials(comment.CDUSER, '')}
                                </div>
                                <div>
                                  <p className="font-medium">{comment.CDUSER}</p>
                                  <p className="text-sm text-gray-500">{formatDateTime(comment.DHCRE)}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{comment.LIB200}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Nouveau commentaire */}
                    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                      <Label htmlFor="new-comment" className="text-sm font-medium">
                        Ajouter un commentaire
                      </Label>
                      <Textarea
                        id="new-comment"
                        placeholder="Décrivez le travail effectué, les observations..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                      <div className="flex justify-end mt-3">
                        <Button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Ajouter commentaire
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulaires">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Formulaires personnalisés
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/settings/forms')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gérer les formulaires
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InterventionFormsTab interventionId={intervention?.IDINTERVENTION} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat intervention
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {chatMessages.length} messages
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Zone de réponse active */}
                {replyingTo && (
                  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <Reply className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-green-600 font-medium">
                          Répondre à {formatFullName(replyingTo.NOMFAMILLE, replyingTo.PRENOM) || replyingTo.CDUSER}
                        </p>
                        <p className="text-xs text-gray-600 truncate max-w-[200px]">
                          {replyingTo.COMMENTAIRE}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setReplyingTo(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Zone de chat scrollable */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun message dans le chat</p>
                      <p className="text-sm">Commencez la conversation !</p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => {
                      // Déterminer si c'est l'utilisateur actuel (utiliser le CDUSER réel)
                      const isCurrentUser = message.CDUSER === (user?.CDUSER || 'WEB');
                      const showAvatar = index === 0 || chatMessages[index - 1].CDUSER !== message.CDUSER;
                      const userName = formatFullName(message.NOMFAMILLE, message.PRENOM) || message.CDUSER || 'Utilisateur';
                      const initials = getInitials(message.NOMFAMILLE, message.PRENOM) || message.CDUSER?.substring(0, 2).toUpperCase() || 'U';
                      const avatarColor = getAvatarColor(message.CDUSER);

                      return (
                        <div key={message.IDACTION} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
                          <div className={`flex max-w-[75%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3`}>
                            {/* Avatar - toujours affiché */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${avatarColor} ${showAvatar ? '' : 'invisible'} flex-shrink-0`}>
                              {initials}
                            </div>
                            
                            <div className="flex flex-col space-y-1 flex-1">
                              {/* Nom utilisateur - toujours affiché au-dessus de chaque message */}
                              <span className={`text-xs font-medium ${isCurrentUser ? 'text-right text-green-600' : 'text-left text-gray-700'} ${isCurrentUser ? 'mr-2' : 'ml-2'}`}>
                                {isCurrentUser ? 'Vous' : userName}
                              </span>
                              

                              
                              {/* Message de réponse style WhatsApp - seulement si IDACTION_PREC > 0 */}
                              {message.IDACTION_PREC && message.IDACTION_PREC > 0 && (
                                <div className={`mb-3 pl-3 border-l-4 py-2 rounded-r-lg ${
                                  isCurrentUser 
                                    ? 'border-green-300 bg-green-600/10' 
                                    : 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/20'
                                }`}>
                                  <p className={`text-xs font-semibold mb-1 ${
                                    isCurrentUser ? 'text-green-700' : 'text-blue-600 dark:text-blue-400'
                                  }`}>
                                    {formatFullName(message.PARENT_USER_NOM, message.PARENT_USER_PRENOM) || 'Utilisateur'}
                                  </p>
                                  <p className={`text-xs opacity-90 ${
                                    isCurrentUser ? 'text-gray-700' : 'text-gray-700 dark:text-gray-300'
                                  }`} 
                                     style={{
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                       overflow: 'hidden'
                                     }}>
                                    {message.PARENT_COMMENTAIRE}
                                  </p>
                                </div>
                              )}

                              {/* Bulle de message */}
                              <div className={`relative rounded-2xl p-4 shadow-sm ${
                                isCurrentUser 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                              }`}>
                                {/* Contenu du message */}
                                <div className="space-y-2">
                                  {/* Message texte */}
                                  {message.COMMENTAIRE && (
                                    <p className="text-sm whitespace-pre-wrap">
                                      {message.COMMENTAIRE}
                                    </p>
                                  )}
                                  
                                  {/* Fichiers attachés */}
                                  {message.DOCUMENTS && message.DOCUMENTS.length > 0 && (
                                    <div className="space-y-3">
                                      {message.DOCUMENTS.map((doc: any, docIndex: number) => (
                                        <div key={docIndex} className={`rounded-lg overflow-hidden ${
                                          isCurrentUser ? 'border border-blue-300' : 'border border-gray-200'
                                        }`}>
                                          {doc.ID2GENRE_DOCUMENT === 1 ? (
                                            // Affichage des images avec aperçu amélioré
                                            <div className="space-y-2">
                                              <div className="relative group">
                                                <img 
                                                  src={`/api/documents/${doc.IDDOCUMENT}/download`}
                                                  alt={doc.LIB100}
                                                  className="w-full max-w-sm h-auto max-h-64 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                                  onClick={() => window.open(`/api/documents/${doc.IDDOCUMENT}/download`, '_blank')}
                                                  onError={(e) => {
                                                    // Si l'image ne charge pas, afficher une icône
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                  }}
                                                />
                                                <div className="hidden flex items-center justify-center w-full h-32 bg-gray-100 rounded">
                                                  <div className="text-center">
                                                    <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                    <span className="text-xs text-gray-600">Image non disponible</span>
                                                  </div>
                                                </div>
                                                {/* Overlay avec boutons */}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                  <div className="flex space-x-2">
                                                    <Button 
                                                      variant="secondary" 
                                                      size="sm" 
                                                      className="bg-white/90 hover:bg-white text-gray-800"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`/api/documents/${doc.IDDOCUMENT}/download`, '_blank');
                                                      }}
                                                      title="Voir en grand"
                                                    >
                                                      <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                      variant="secondary" 
                                                      size="sm" 
                                                      className="bg-white/90 hover:bg-white text-gray-800"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        const link = document.createElement('a');
                                                        link.href = `/api/documents/${doc.IDDOCUMENT}/download`;
                                                        link.download = doc.LIB100;
                                                        link.click();
                                                      }}
                                                      title="Télécharger"
                                                    >
                                                      <Download className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="px-3 pb-2">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center space-x-2">
                                                    <Image className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs font-medium truncate">{doc.LIB100}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            // Affichage des documents avec aperçu amélioré
                                            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                              <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded ${
                                                  isCurrentUser ? 'bg-green-600' : 'bg-green-100'
                                                }`}>
                                                  <FileIcon className={`w-5 h-5 ${
                                                    isCurrentUser ? 'text-white' : 'text-green-600'
                                                  }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium truncate">{doc.LIB100}</p>
                                                  <p className="text-xs text-gray-500">
                                                    Document • {formatDateTime(doc.DHCRE).split(' ')[0]}
                                                  </p>
                                                  {/* Aperçu pour certains types de fichiers */}
                                                  {(doc.LIB100.toLowerCase().includes('.pdf') || 
                                                    doc.LIB100.toLowerCase().includes('.txt') ||
                                                    doc.LIB100.toLowerCase().includes('.doc')) && (
                                                    <div className="mt-2">
                                                      <iframe
                                                        src={`/api/documents/${doc.IDDOCUMENT}/download`}
                                                        className="w-full h-20 border rounded text-xs"
                                                        title={`Aperçu de ${doc.LIB100}`}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="flex space-x-1">
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="p-2 h-auto hover:bg-green-100"
                                                    onClick={() => window.open(`/api/documents/${doc.IDDOCUMENT}/download`, '_blank')}
                                                    title="Ouvrir le document"
                                                  >
                                                    <Eye className="w-4 h-4" />
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="p-2 h-auto hover:bg-green-100"
                                                    onClick={() => {
                                                      const link = document.createElement('a');
                                                      link.href = `/api/documents/${doc.IDDOCUMENT}/download`;
                                                      link.download = doc.LIB100;
                                                      link.click();
                                                    }}
                                                    title="Télécharger le document"
                                                  >
                                                    <Download className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Réactions existantes */}
                                {messageReactions[message.IDACTION] && messageReactions[message.IDACTION].length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {Array.from(new Set(messageReactions[message.IDACTION])).map((emoji, idx) => (
                                      <span
                                        key={idx}
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                          isCurrentUser ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-700'
                                        }`}
                                      >
                                        {emoji} {messageReactions[message.IDACTION].filter(e => e === emoji).length}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Heure, statut et boutons d'interaction */}
                                <div className={`flex items-center justify-between mt-3 ${
                                  isCurrentUser ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs">
                                      {formatDateTime(message.DHCRE).split(' ')[1]}
                                    </span>
                                    {isCurrentUser && (
                                      <div className="flex">
                                        {message.STATUS === 'sent' ? (
                                          <Check className="w-3 h-3" />
                                        ) : message.STATUS === 'delivered' ? (
                                          <CheckCheck className="w-3 h-3" />
                                        ) : (
                                          <CheckCheck className="w-3 h-3 text-green-300" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Boutons d'interaction */}
                                  <div className="flex items-center space-x-1">
                                    {/* Bouton emoji */}
                                    <div className="relative">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-auto text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowEmojiPicker(showEmojiPicker === message.IDACTION ? null : message.IDACTION);
                                        }}
                                        title="Ajouter une réaction"
                                      >
                                        😊
                                      </Button>
                                      
                                      {/* Picker d'emojis */}
                                      {showEmojiPicker === message.IDACTION && (
                                        <div 
                                          className="absolute bottom-full right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex flex-wrap gap-1 z-10 max-w-xs"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {['👍', '❤️', '😂', '😮', '😢', '😡', '🙌', '👏', '🔥', '💯', '🎉', '💪'].map(emoji => (
                                            <button
                                              key={emoji}
                                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg transition-colors flex-shrink-0"
                                              onClick={() => handleAddReaction(message.IDACTION, emoji)}
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Bouton de réponse */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`p-1 h-auto ${
                                        isCurrentUser 
                                          ? 'text-white hover:text-white hover:bg-green-400' 
                                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                      }`}
                                      onClick={() => setReplyingTo(message)}
                                      title="Répondre à ce message"
                                    >
                                      <Reply className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>


                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="border-t p-4 flex-shrink-0">
                  <div className="flex items-end space-x-2">
                    {/* Bouton d'attachement */}
                    <div className="flex flex-col space-y-1">
                      <input
                        type="file"
                        id="chat-file-upload"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt,.xlsx"
                        onChange={handleChatFileUpload}
                        disabled={uploadingChatFile}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('chat-file-upload')?.click()}
                        disabled={uploadingChatFile}
                        className="px-3"
                      >
                        {uploadingChatFile ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        ) : (
                          <Paperclip className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Zone de texte */}
                    <div className="flex-1">
                      <Textarea
                        placeholder="Tapez votre message..."
                        value={newChatMessage}
                        onChange={(e) => setNewChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddChatMessage();
                          }
                        }}
                        rows={1}
                        className="resize-none min-h-[40px] max-h-[120px]"
                      />
                    </div>

                    {/* Bouton d'envoi */}
                    <Button
                      onClick={handleAddChatMessage}
                      disabled={!newChatMessage.trim()}
                      size="sm"
                      className="px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog pour ajouter un commentaire lors de l'upload */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {uploadDialogType === 'chat' ? 'Partager un fichier' : 'Ajouter une photo/document'}
            </DialogTitle>
            <DialogDescription>
              {pendingFile && (
                <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded">
                  <FileIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{pendingFile.name}</span>
                  <Badge variant="outline">
                    {(pendingFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="upload-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="upload-comment"
                placeholder={uploadDialogType === 'chat' 
                  ? "Ajoutez un message avec ce fichier..." 
                  : "Décrivez cette photo/document..."
                }
                value={uploadComment}
                onChange={(e) => setUploadComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUploadDialog(false);
                setPendingFile(null);
                setUploadComment('');
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={confirmFileUpload}
              disabled={uploadingFile || uploadingChatFile}
            >
              {uploadingFile || uploadingChatFile ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              ) : null}
              {uploadDialogType === 'chat' ? 'Partager' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default InterventionDetails;