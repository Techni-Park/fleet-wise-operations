import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Pencil, Trash2, Plus, GripVertical, AlertTriangle, Settings, FileText, Eye } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormField {
  id: number;
  idforms: number;
  nom: string;
  label: string;
  type: string;
  taille: string;
  obligatoire: boolean;
  ordre: number;
  groupe: string;
  ordre_groupe: number;
  options: string | null;
  validation: string | null;
}

interface CustomForm {
  id: number;
  nom: string;
  description: string;
  entity_type_id: number;
  is_active: boolean;
  created_by: string;
  fields?: FormField[];
}

const entityTypes = [
  { id: 1, name: 'Véhicule' },
  { id: 3, name: 'Intervention' },
];

const fieldTypes = [
  { value: 'text', label: 'Texte' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date et heure' },
  { value: 'textarea', label: 'Zone de texte' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'radio', label: 'Boutons radio' },
  { value: 'checkbox', label: 'Case à cocher' },
  { value: 'switch', label: 'Interrupteur' },
  { value: 'file', label: 'Fichier' }
];

const fieldSizes = [
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
  { value: 'full', label: 'Pleine largeur' }
];

export default function FormsSettings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<number>(3); // Default to interventions
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  
  // États pour les dialogs
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // État du formulaire de création/édition de formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    entity_type_id: 3,
    is_active: true
  });

  // État du formulaire de création/édition de champ
  const [fieldData, setFieldData] = useState({
    nom: '',
    label: '',
    type: 'text',
    taille: 'medium',
    obligatoire: false,
    groupe: 'General',
    options: '',
    validation: ''
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    loadForms();
  }, [selectedEntityType, user, authLoading, navigate]);

  const loadForms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms?entity_type_id=${selectedEntityType}`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        const formsData = await response.json();
        setForms(formsData);
      } else {
        throw new Error('Erreur lors du chargement des formulaires');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les formulaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFormFields = async (formId: number) => {
    try {
      const response = await fetch(`/api/forms/${formId}/fields`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const fields = await response.json();
        setFormFields(fields);
      }
    } catch (error) {
      console.error('Erreur chargement champs:', error);
    }
  };

  // Gestion des formulaires
  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Formulaire créé avec succès"
        });
        
        setIsFormDialogOpen(false);
        resetFormData();
        loadForms();
      } else {
        throw new Error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le formulaire",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditForm = (form: CustomForm) => {
    setEditingForm(form);
    setFormData({
      nom: form.nom,
      description: form.description || '',
      entity_type_id: form.entity_type_id,
      is_active: form.is_active
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteForm = async (form: CustomForm) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Formulaire supprimé avec succès"
        });
        loadForms();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le formulaire",
        variant: "destructive"
      });
    }
  };

  // Gestion des champs
  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    setSaving(true);
    try {
      let optionsJson = null;
      let validationJson = null;

      if (fieldData.options.trim()) {
        try {
          optionsJson = JSON.parse(fieldData.options);
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

      if (fieldData.validation.trim()) {
        try {
          validationJson = JSON.parse(fieldData.validation);
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Format JSON invalide dans la validation",
            variant: "destructive"
          });
          setSaving(false);
          return;
        }
      }

      const fieldRequestData = {
        nom: fieldData.nom,
        label: fieldData.label,
        type: fieldData.type,
        taille: fieldData.taille,
        obligatoire: fieldData.obligatoire,
        ordre: formFields.length + 1,
        groupe: fieldData.groupe,
        ordre_groupe: 1,
        options: optionsJson ? JSON.stringify(optionsJson) : null,
        validation: validationJson ? JSON.stringify(validationJson) : null
      };

      const url = editingField 
        ? `/api/forms/fields/${editingField.id}`
        : `/api/forms/${selectedForm.id}/fields`;
      
      const method = editingField ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(fieldRequestData)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: editingField 
            ? "Champ modifié avec succès"
            : "Champ créé avec succès"
        });
        
        setIsFieldDialogOpen(false);
        resetFieldData();
        loadFormFields(selectedForm.id);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le champ",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldData({
      nom: field.nom,
      label: field.label,
      type: field.type,
      taille: field.taille,
      obligatoire: field.obligatoire,
      groupe: field.groupe,
      options: field.options || '',
      validation: field.validation || ''
    });
    setIsFieldDialogOpen(true);
  };

  const handleDeleteField = async (field: FormField) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce champ ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/fields/${field.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Champ supprimé avec succès"
        });
        loadFormFields(field.idforms);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le champ",
        variant: "destructive"
      });
    }
  };

  // Drag & Drop
  const handleDragEnd = async (result: any) => {
    if (!result.destination || !selectedForm) return;

    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'état local immédiatement
    setFormFields(items);

    // Préparer les nouvelles positions
    const fieldOrders = items.map((field, index) => ({
      id: field.id,
      ordre: index + 1,
      groupe: field.groupe,
      ordre_groupe: field.ordre_groupe
    }));

    try {
      const response = await fetch(`/api/forms/${selectedForm.id}/fields/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ fieldOrders })
      });

      if (!response.ok) {
        // Rétablir l'ordre original en cas d'erreur
        loadFormFields(selectedForm.id);
        throw new Error('Erreur lors de la réorganisation');
      }
    } catch (error) {
      console.error('Erreur réorganisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les champs",
        variant: "destructive"
      });
    }
  };

  // Fonctions utilitaires
  const resetFormData = () => {
    setEditingForm(null);
    setFormData({
      nom: '',
      description: '',
      entity_type_id: selectedEntityType,
      is_active: true
    });
  };

  const resetFieldData = () => {
    setEditingField(null);
    setFieldData({
      nom: '',
      label: '',
      type: 'text',
      taille: 'medium',
      obligatoire: false,
      groupe: 'General',
      options: '',
      validation: ''
    });
  };

  const generateOptionsExample = () => {
    if (fieldData.type === 'select' || fieldData.type === 'radio') {
      return JSON.stringify({
        values: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" }
        ]
      }, null, 2);
    } else {
      return JSON.stringify({
        placeholder: "Texte d'aide"
      }, null, 2);
    }
  };

  const generateValidationExample = () => {
    switch (fieldData.type) {
      case 'text':
      case 'textarea':
        return JSON.stringify({
          minLength: 3,
          maxLength: 100,
          pattern: "^[a-zA-Z\\s]+$"
        }, null, 2);
      case 'number':
        return JSON.stringify({
          min: 0,
          max: 999,
          step: 1
        }, null, 2);
      case 'email':
        return JSON.stringify({
          pattern: "^[^@]+@[^@]+\\.[^@]+$"
        }, null, 2);
      default:
        return JSON.stringify({
          required: true
        }, null, 2);
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Vérification de l'authentification...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Formulaires personnalisés</h1>
          <p className="text-muted-foreground">
            Créez et gérez des formulaires personnalisés pour vos entités
          </p>
        </div>

        {/* Sélection de l'entité */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Type d'entité</CardTitle>
            <CardDescription>
              Sélectionnez le type d'entité pour lequel configurer les formulaires
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des formulaires */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Formulaires</CardTitle>
                <CardDescription>
                  Liste des formulaires pour {entityTypes.find(t => t.id === selectedEntityType)?.name}
                </CardDescription>
              </div>
              <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetFormData}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau formulaire
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingForm ? 'Modifier le formulaire' : 'Créer un formulaire'}
                    </DialogTitle>
                    <DialogDescription>
                      Configurez les propriétés du formulaire
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateForm} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="form-nom">Nom du formulaire *</Label>
                      <Input
                        id="form-nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        placeholder="Ex: Rapport d'intervention"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="form-description">Description</Label>
                      <Textarea
                        id="form-description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Description du formulaire..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="form-active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                      />
                      <Label htmlFor="form-active">Formulaire actif</Label>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsFormDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Enregistrement...' : (editingForm ? 'Modifier' : 'Créer')}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : forms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun formulaire configuré
                </div>
              ) : (
                <div className="space-y-3">
                  {forms.map(form => (
                    <div 
                      key={form.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedForm?.id === form.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedForm(form);
                        loadFormFields(form.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{form.nom}</h4>
                            {!form.is_active && (
                              <Badge variant="secondary">Inactif</Badge>
                            )}
                          </div>
                          {form.description && (
                            <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditForm(form);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteForm(form);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Éditeur de champs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {selectedForm ? `Champs - ${selectedForm.nom}` : 'Champs du formulaire'}
                </CardTitle>
                <CardDescription>
                  {selectedForm ? 'Glissez-déposez pour réorganiser' : 'Sélectionnez un formulaire pour éditer ses champs'}
                </CardDescription>
              </div>
              {selectedForm && (
                <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetFieldData}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un champ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingField ? 'Modifier le champ' : 'Ajouter un champ'}
                      </DialogTitle>
                      <DialogDescription>
                        Configurez les propriétés du champ
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCreateField} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="field-nom">Nom technique *</Label>
                          <Input
                            id="field-nom"
                            value={fieldData.nom}
                            onChange={(e) => setFieldData({...fieldData, nom: e.target.value})}
                            placeholder="nom_technique"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="field-label">Libellé *</Label>
                          <Input
                            id="field-label"
                            value={fieldData.label}
                            onChange={(e) => setFieldData({...fieldData, label: e.target.value})}
                            placeholder="Libellé affiché"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="field-type">Type de champ *</Label>
                          <Select
                            value={fieldData.type}
                            onValueChange={(value) => setFieldData({...fieldData, type: value})}
                          >
                            <SelectTrigger id="field-type">
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

                        <div className="space-y-2">
                          <Label htmlFor="field-taille">Taille</Label>
                          <Select
                            value={fieldData.taille}
                            onValueChange={(value) => setFieldData({...fieldData, taille: value})}
                          >
                            <SelectTrigger id="field-taille">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldSizes.map(size => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-groupe">Groupe</Label>
                        <Input
                          id="field-groupe"
                          value={fieldData.groupe}
                          onChange={(e) => setFieldData({...fieldData, groupe: e.target.value})}
                          placeholder="Ex: Informations générales"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="field-obligatoire"
                          checked={fieldData.obligatoire}
                          onCheckedChange={(checked) => setFieldData({...fieldData, obligatoire: checked})}
                        />
                        <Label htmlFor="field-obligatoire">Champ obligatoire</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-options">Options (JSON)</Label>
                        <Textarea
                          id="field-options"
                          value={fieldData.options}
                          onChange={(e) => setFieldData({...fieldData, options: e.target.value})}
                          placeholder={generateOptionsExample()}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field-validation">Validation (JSON)</Label>
                        <Textarea
                          id="field-validation"
                          value={fieldData.validation}
                          onChange={(e) => setFieldData({...fieldData, validation: e.target.value})}
                          placeholder={generateValidationExample()}
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsFieldDialogOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" disabled={saving}>
                          {saving ? 'Enregistrement...' : (editingField ? 'Modifier' : 'Créer')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent>
              {!selectedForm ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un formulaire pour voir ses champs</p>
                </div>
              ) : formFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun champ configuré</p>
                  <p className="text-sm">Ajoutez votre premier champ</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {formFields.map((field, index) => (
                          <Draggable
                            key={field.id}
                            draggableId={field.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-3 border rounded-lg ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab text-gray-400 hover:text-gray-600"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-medium">{field.label}</h5>
                                        <Badge variant="outline" className="text-xs">
                                          {fieldTypes.find(t => t.value === field.type)?.label}
                                        </Badge>
                                        {field.obligatoire && (
                                          <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600">{field.nom} • {field.groupe}</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditField(field)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteField(field)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 