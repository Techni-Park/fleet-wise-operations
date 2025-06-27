import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pencil, Trash2, Plus, MoveUp, MoveDown, AlertTriangle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface CustomField {
  id: number;
  entity_type_id: number;
  nom: string;
  label: string;
  type: string;
  is_protected: boolean;
  obligatoire: boolean;
  ordre: number;
  options: string | null;
}

const entityTypes = [
  { id: 1, name: 'Véhicule' },
  // Futurs types d'entités peuvent être ajoutés ici
];

const fieldTypes = [
  { value: 'text', label: 'Texte' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Zone de texte' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'switch', label: 'Interrupteur' },
  { value: 'radio', label: 'Boutons radio' }
];

export default function CustomFieldsSettings() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    label: '',
    type: 'text',
    is_protected: false,
    obligatoire: false,
    options: ''
  });

  // Options prédéfinies pour les véhicules
  const vehicleGenreOptions = [
    { value: 'VP', label: 'Voiture particulière' },
    { value: 'CTTE', label: 'Camionnette' },
    { value: 'CAM', label: 'Camion' }
  ];

  useEffect(() => {
    loadCustomFields();
  }, [selectedEntityType]);

  const loadCustomFields = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/custom-fields?entity_type_id=${selectedEntityType}`);
      if (response.ok) {
        const fields = await response.json();
        setCustomFields(fields.sort((a: CustomField, b: CustomField) => a.ordre - b.ordre));
      } else {
        throw new Error('Erreur lors du chargement des champs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les champs personnalisés",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation des options JSON
      let optionsJson = null;
      if (formData.options.trim()) {
        try {
          optionsJson = JSON.parse(formData.options);
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Format JSON invalide dans les options",
            variant: "destructive"
          });
          setSaving(false);
          return;
        }
      }

      const fieldData = {
        entity_type_id: selectedEntityType,
        nom: formData.nom,
        label: formData.label,
        type: formData.type,
        is_protected: formData.is_protected,
        obligatoire: formData.obligatoire,
        ordre: editingField ? editingField.ordre : (customFields.length + 1),
        options: optionsJson ? JSON.stringify(optionsJson) : null
      };

      const url = editingField 
        ? `/api/custom-fields/${editingField.id}`
        : '/api/custom-fields';
      
      const method = editingField ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fieldData)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: editingField 
            ? "Champ personnalisé modifié avec succès"
            : "Champ personnalisé créé avec succès"
        });
        
        setIsDialogOpen(false);
        resetForm();
        loadCustomFields();
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le champ personnalisé",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      nom: field.nom,
      label: field.label,
      type: field.type,
      is_protected: field.is_protected,
      obligatoire: field.obligatoire,
      options: field.options || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (field: CustomField) => {
    if (field.is_protected) {
      toast({
        title: "Erreur",
        description: "Ce champ protégé ne peut pas être supprimé",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce champ personnalisé ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/custom-fields/${field.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Champ personnalisé supprimé avec succès"
        });
        loadCustomFields();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le champ personnalisé",
        variant: "destructive"
      });
    }
  };

  const handleMoveOrder = async (field: CustomField, direction: 'up' | 'down') => {
    const currentIndex = customFields.findIndex(f => f.id === field.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === customFields.length - 1)
    ) {
      return;
    }

    const newFields = [...customFields];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Échanger les positions
    [newFields[currentIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[currentIndex]];
    
    // Mettre à jour les ordres
    try {
      const updates = newFields.map((field, index) => ({
        id: field.id,
        ordre: index + 1
      }));

      await Promise.all(updates.map(update => 
        fetch(`/api/custom-fields/${update.id}/order`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordre: update.ordre })
        })
      ));

      loadCustomFields();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'ordre",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingField(null);
    setFormData({
      nom: '',
      label: '',
      type: 'text',
      is_protected: false,
      obligatoire: false,
      options: ''
    });
  };

  const generateOptionsExample = () => {
    if (formData.type === 'select' || formData.type === 'radio') {
      return JSON.stringify({
        genre_filter: ["VP", "CTTE"], // Afficher seulement pour ces genres
        values: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" }
        ]
      }, null, 2);
    }
    return JSON.stringify({
      genre_filter: ["VP", "CTTE"], // Afficher seulement pour ces genres
      placeholder: "Texte d'aide"
    }, null, 2);
  };

  const renderOptionsPreview = (options: string | null) => {
    if (!options) return null;
    
    try {
      const parsed = JSON.parse(options);
      return (
        <div className="text-xs text-muted-foreground">
          {parsed.genre_filter && (
            <div>Genres: {parsed.genre_filter.join(', ')}</div>
          )}
          {parsed.values && (
            <div>Options: {parsed.values.map((v: any) => v.label).join(', ')}</div>
          )}
        </div>
      );
    } catch {
      return <div className="text-xs text-red-500">JSON invalide</div>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Champs personnalisés</h1>
          <p className="text-muted-foreground">
            Gérez les champs personnalisés pour vos entités
          </p>
        </div>

        {/* Sélection de l'entité */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Type d'entité</CardTitle>
            <CardDescription>
              Sélectionnez le type d'entité pour lequel configurer les champs personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="entity-type">Type d'entité :</Label>
              <Select
                value={selectedEntityType.toString()}
                onValueChange={(value) => setSelectedEntityType(parseInt(value))}
              >
                <SelectTrigger className="w-[200px]" id="entity-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des champs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Champs personnalisés</CardTitle>
              <CardDescription>
                Liste des champs personnalisés pour {entityTypes.find(t => t.id === selectedEntityType)?.name}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un champ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingField ? 'Modifier le champ' : 'Ajouter un champ personnalisé'}
                  </DialogTitle>
                  <DialogDescription>
                    Configurez les propriétés du champ personnalisé
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom technique *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        placeholder="nom_technique"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Nom utilisé en base de données (sans espaces ni accents)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="label">Libellé *</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                        placeholder="Libellé affiché"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type de champ *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="obligatoire"
                        checked={formData.obligatoire}
                        onCheckedChange={(checked) => setFormData({...formData, obligatoire: checked})}
                      />
                      <Label htmlFor="obligatoire">Champ obligatoire</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_protected"
                        checked={formData.is_protected}
                        onCheckedChange={(checked) => setFormData({...formData, is_protected: checked})}
                      />
                      <Label htmlFor="is_protected">Champ protégé</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="options">Options (JSON)</Label>
                    <Textarea
                      id="options"
                      value={formData.options}
                      onChange={(e) => setFormData({...formData, options: e.target.value})}
                      placeholder={generateOptionsExample()}
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>genre_filter</strong> : Array des genres de véhicules pour lesquels afficher ce champ (VP, CTTE, CAM)<br/>
                        <strong>values</strong> : Pour select/radio, array d'objets {"{value, label}"}<br/>
                        <strong>placeholder</strong> : Texte d'aide pour les champs de saisie
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Enregistrement...' : (editingField ? 'Modifier' : 'Créer')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : customFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun champ personnalisé configuré
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Propriétés</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="w-8 text-center">{field.ordre}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveOrder(field, 'up')}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveOrder(field, 'down')}
                              disabled={index === customFields.length - 1}
                            >
                              <MoveDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{field.nom}</TableCell>
                      <TableCell>{field.label}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {fieldTypes.find(t => t.value === field.type)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {field.obligatoire && (
                            <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                          )}
                          {field.is_protected && (
                            <Badge variant="secondary" className="text-xs">Protégé</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderOptionsPreview(field.options)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(field)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!field.is_protected && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(field)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}