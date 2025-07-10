import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Settings, 
  Camera,
  Save,
  Edit3,
  Key,
  UserCheck,
  UserX
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    PRENOM: '',
    NOMFAMILLE: '',
    EMAILP: '',
    TELBUR: '',
    FONCTION_PRO: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        PRENOM: user.PRENOM || '',
        NOMFAMILLE: user.NOMFAMILLE || '',
        EMAILP: (user as any).EMAILP || user.email || '',
        TELBUR: (user as any).TELBUR || '',
        FONCTION_PRO: (user as any).FONCTION_PRO || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Non connecté</h3>
          <p className="text-gray-500">Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  // Générer les initiales pour l'avatar
  const getInitials = () => {
    const firstInitial = user.PRENOM?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.NOMFAMILLE?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  // Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = () => {
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 
      'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600', 'bg-teal-600'
    ];
    const hash = user.CDUSER?.charCodeAt(0) || 0;
    return colors[hash % colors.length];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // TODO: Implémenter la sauvegarde via API
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Réinitialiser les données
    if (user) {
      setFormData({
        PRENOM: user.PRENOM || '',
        NOMFAMILLE: user.NOMFAMILLE || '',
        EMAILP: (user as any).EMAILP || user.email || '',
        TELBUR: (user as any).TELBUR || '',
        FONCTION_PRO: (user as any).FONCTION_PRO || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Profile */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={`${user.PRENOM} ${user.NOMFAMILLE}`} />
                <AvatarFallback className={`text-white text-2xl font-bold ${getAvatarColor()}`}>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.PRENOM} {user.NOMFAMILLE}
                  </h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {(user as any).EMAILP || user.email}
                  </p>
                  {(user as any).FONCTION_PRO && (
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4" />
                      {(user as any).FONCTION_PRO}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={(user as any).IAUTORISE === 1 ? "default" : "destructive"} className="flex items-center gap-1">
                    {(user as any).IAUTORISE === 1 ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                    {(user as any).IAUTORISE === 1 ? 'Autorisé' : 'Non autorisé'}
                  </Badge>
                  
                  {user.IADMIN === 1 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Administrateur
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil et vos coordonnées.
                </CardDescription>
              </div>
              <Button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.PRENOM}
                    onChange={(e) => handleInputChange('PRENOM', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de famille</Label>
                  <Input
                    id="nom"
                    value={formData.NOMFAMILLE}
                    onChange={(e) => handleInputChange('NOMFAMILLE', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.EMAILP}
                    onChange={(e) => handleInputChange('EMAILP', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.TELBUR}
                    onChange={(e) => handleInputChange('TELBUR', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fonction">Fonction professionnelle</Label>
                  <Input
                    id="fonction"
                    value={formData.FONCTION_PRO}
                    onChange={(e) => handleInputChange('FONCTION_PRO', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    Sauvegarder les modifications
                  </Button>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations système</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Utilisateur:</span>
                    <span className="font-mono">{user.IDUSER}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code Utilisateur:</span>
                    <span className="font-mono">{user.CDUSER}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <Badge variant={(user as any).IAUTORISE === 1 ? "default" : "destructive"}>
                      {(user as any).IAUTORISE === 1 ? 'Autorisé' : 'Non autorisé'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rôle:</span>
                    <Badge variant={user.IADMIN === 1 ? "secondary" : "outline"}>
                      {user.IADMIN === 1 ? 'Administrateur' : 'Utilisateur'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte et vos préférences de connexion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Mot de passe</h4>
                    <p className="text-sm text-gray-500">
                      Dernière modification il y a plus de 30 jours
                    </p>
                  </div>
                  <Button variant="outline">
                    Changer le mot de passe
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-500">
                      Ajoutez une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <Button variant="outline">
                    Configurer
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sessions actives</h4>
                    <p className="text-sm text-gray-500">
                      Gérez vos sessions de connexion
                    </p>
                  </div>
                  <Button variant="outline">
                    Voir les sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Préférences
              </CardTitle>
              <CardDescription>
                Personnalisez votre expérience utilisateur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thème</h4>
                    <p className="text-sm text-gray-500">
                      Choisissez votre thème préféré
                    </p>
                  </div>
                  <Button variant="outline">
                    Système
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Langue</h4>
                    <p className="text-sm text-gray-500">
                      Sélectionnez votre langue préférée
                    </p>
                  </div>
                  <Button variant="outline">
                    Français
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-500">
                      Configurez vos préférences de notification
                    </p>
                  </div>
                  <Button variant="outline">
                    Configurer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 