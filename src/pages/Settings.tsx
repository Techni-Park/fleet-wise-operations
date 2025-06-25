
import React from 'react';
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

const Settings = () => {
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
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
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
                      <Label htmlFor="company-name">Nom de l'entreprise</Label>
                      <Input id="company-name" defaultValue="FleetTracker Pro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email de contact</Label>
                      <Input id="contact-email" type="email" defaultValue="contact@fleettracker.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Adresse de l'entreprise</Label>
                    <Textarea id="company-address" defaultValue="123 Rue de la Flotte, 75001 Paris, France" />
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
                      <Label htmlFor="currency">Devise</Label>
                      <Select defaultValue="eur">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="usd">Dollar US ($)</SelectItem>
                          <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Select defaultValue="fr">
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
