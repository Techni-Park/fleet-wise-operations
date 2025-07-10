
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Header from '@/components/Layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { type ParamAppli } from '@shared/schema';
import { useSettings } from '@/context/SettingsContext';


const Settings = () => {
  console.log('🔧 [Settings] Component rendering...');
  
  const { settings: globalSettings, loading: isLoading, reloadSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<Partial<ParamAppli>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Debug: Log du contexte Settings
  console.log('📊 [Settings] useSettings hook result:', {
    globalSettings,
    isLoading,
    settingsType: typeof globalSettings,
    settingsKeys: globalSettings ? Object.keys(globalSettings) : 'null',
    settingsLength: globalSettings ? Object.keys(globalSettings).length : 0
  });

  useEffect(() => {
    console.log('🔄 [Settings] useEffect triggered - globalSettings changed');
    console.log('📥 [Settings] globalSettings received:', {
      hasGlobalSettings: !!globalSettings,
      globalSettingsType: typeof globalSettings,
      globalSettingsValue: globalSettings,
      isLoadingState: isLoading
    });

    if (globalSettings) {
      console.log('✅ [Settings] Setting localSettings from globalSettings');
      console.log('📋 [Settings] globalSettings content:', {
        RAISON_SOCIALE: globalSettings.RAISON_SOCIALE,
        EMAIL: globalSettings.EMAIL,
        ADRESSE: globalSettings.ADRESSE,
        VILLE: globalSettings.VILLE,
        CPOSTAL: globalSettings.CPOSTAL,
        SIRET: globalSettings.SIRET,
        NUM_TVA: globalSettings.NUM_TVA,
        CD_DEVISE: globalSettings.CD_DEVISE,
        CD_LANG: globalSettings.CD_LANG,
        allKeys: Object.keys(globalSettings)
      });
      setLocalSettings(globalSettings);
    } else {
      console.log('❌ [Settings] globalSettings is null/undefined, not setting localSettings');
    }
  }, [globalSettings, isLoading]);

  // Debug: Log des localSettings après changement
  useEffect(() => {
    console.log('🏪 [Settings] localSettings updated:', {
      hasLocalSettings: !!localSettings,
      localSettingsLength: Object.keys(localSettings).length,
      localSettingsKeys: Object.keys(localSettings),
      sampleValues: {
        RAISON_SOCIALE: localSettings.RAISON_SOCIALE,
        EMAIL: localSettings.EMAIL,
        ADRESSE: localSettings.ADRESSE,
        VILLE: localSettings.VILLE
      }
    });
  }, [localSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    console.log('📝 [Settings] Input changed:', { fieldId: id, newValue: value });
    setLocalSettings((prev: Partial<ParamAppli>) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof ParamAppli, value: string) => {
    console.log('🔽 [Settings] Select changed:', { fieldId: id, newValue: value });
    setLocalSettings((prev: Partial<ParamAppli>) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    console.log('💾 [Settings] Starting save process...');
    console.log('📤 [Settings] Data to save:', localSettings);
    
    setIsSaving(true);
    try {
      console.log('🌐 [Settings] Making PUT request to /api/paramappli');
      const response = await fetch('/api/paramappli', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localSettings),
      });

      console.log('📨 [Settings] API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ [Settings] Save successful, response data:', responseData);
        
        console.log('🔄 [Settings] Reloading settings...');
        await reloadSettings();
        
        toast({
          title: "Succès",
          description: "Paramètres sauvegardés avec succès.",
        });
      } else {
        const errorData = await response.text();
        console.error('❌ [Settings] Save failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("💥 [Settings] Network error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur réseau est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      console.log('🏁 [Settings] Save process completed');
    }
  };

  // Debug: Log de l'état de chargement
  console.log('⏳ [Settings] Current loading state:', { isLoading, isSaving });

  if (isLoading) {
    console.log('⌛ [Settings] Showing loading state');
    return (
        <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold">Chargement des paramètres...</h1>
        </div>
    )
  }

  console.log('🎨 [Settings] Rendering main settings interface');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Paramètres
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Configuration de l'application et préférences
              </p>
            </div>
            <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="integrations">Intégrations</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Paramètres généraux
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="RAISON_SOCIALE">Nom de l'entreprise</Label>
                      <Input id="RAISON_SOCIALE" value={localSettings.RAISON_SOCIALE || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="EMAIL">Email de contact</Label>
                      <Input id="EMAIL" type="email" value={localSettings.EMAIL || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ADRESSE">Adresse</Label>
                    <Input id="ADRESSE" value={localSettings.ADRESSE || ''} onChange={handleInputChange} placeholder="Ex: 123 Rue de la Flotte" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="CPOSTAL">Code Postal</Label>
                      <Input id="CPOSTAL" value={localSettings.CPOSTAL || ''} onChange={handleInputChange} placeholder="Ex: 75001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="VILLE">Ville</Label>
                      <Input id="VILLE" value={localSettings.VILLE || ''} onChange={handleInputChange} placeholder="Ex: Paris" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select defaultValue="europe/paris">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                          <SelectItem value="europe/london">Europe/London</SelectItem>
                          <SelectItem value="america/new_york">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="CD_DEVISE">Devise</Label>
                      <Select value={localSettings.CD_DEVISE || 'EUR'} onValueChange={(value) => handleSelectChange('CD_DEVISE', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dollar US ($)</SelectItem>
                          <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations légales et fiscales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="SIRET">SIRET</Label>
                      <Input id="SIRET" value={localSettings.SIRET || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="NUM_TVA">N° TVA Intracommunautaire</Label>
                      <Input id="NUM_TVA" value={localSettings.NUM_TVA || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="CODE_APE">Code APE (NAF)</Label>
                      <Input id="CODE_APE" value={localSettings.CODE_APE || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="RCS">RCS</Label>
                      <Input id="RCS" value={localSettings.RCS || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="STATUT_SOCIAL">Statut social</Label>
                      <Input id="STATUT_SOCIAL" value={localSettings.STATUT_SOCIAL || ''} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="MTT_CAPITAL">Capital Social</Label>
                      <Input id="MTT_CAPITAL" type="number" value={localSettings.MTT_CAPITAL || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Apparence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mode sombre</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Activer le thème sombre de l'interface
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Langue de l'interface</Label>
                    <Select value={localSettings.CD_LANG || 'fr'} onValueChange={(value) => handleSelectChange('CD_LANG', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Préférences de notification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications par email</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Recevoir les notifications importantes par email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertes de maintenance</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notifications pour les maintenances dues
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Rappels de documents</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Alertes pour les documents expirés
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifications d'anomalies</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Alertes pour les nouveaux problèmes signalés
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Email de notification</Label>
                    <Input id="notification-email" type="email" defaultValue="alerts@fleettracker.com" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Paramètres de sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Authentification à deux facteurs</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ajouter une couche de sécurité supplémentaire
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Déconnexion automatique</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Déconnexion après inactivité
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Durée de session (minutes)</Label>
                      <Input type="number" defaultValue="60" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tentatives de connexion max</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Politique de mot de passe</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="strong">Forte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Intégrations externes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">API Google Maps</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Intégration pour la géolocalisation
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Service de notification SMS</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Envoi de notifications par SMS
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Système comptable</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Synchronisation avec votre logiciel comptable
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Paramètres avancés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mode de débogage</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Activer les logs détaillés pour le support technique
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sauvegarde automatique</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sauvegarde quotidienne des données
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fréquence de sauvegarde</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">Zone de danger</h4>
                      <div className="space-y-2">
                        <Button variant="destructive" className="w-full">
                          Réinitialiser toutes les données
                        </Button>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cette action est irréversible. Toutes les données seront supprimées.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
