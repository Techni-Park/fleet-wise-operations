import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { FileText, Save, AlertTriangle, Edit, Eye } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';

interface FormField {
  id: number;
  nom: string;
  label: string;
  type: string;
  taille: string;
  obligatoire: boolean;
  ordre: number;
  groupe: string;
  options: any;
  validation: any;
}

interface CustomForm {
  id: number;
  nom: string;
  description: string;
  is_active: boolean;
  fields?: FormField[];
  values?: { [fieldId: number]: string };
}

interface InterventionFormsTabProps {
  interventionId: number | undefined;
}

export default function InterventionFormsTab({ interventionId }: InterventionFormsTabProps) {
  const { user } = useAuth();
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [formValues, setFormValues] = useState<{ [fieldId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  useEffect(() => {
    if (interventionId) {
      loadForms();
    }
  }, [interventionId]);

  const loadForms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/forms?entity_type_id=3', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const formsData = await response.json();
        setForms(formsData);
      }
    } catch (error) {
      console.error('Erreur chargement formulaires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les formulaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFormWithFields = async (formId: number) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const formData = await response.json();
        
        const valuesResponse = await fetch(`/api/forms/${formId}/values/${interventionId}`, {
          credentials: 'include'
        });
        
        if (valuesResponse.ok) {
          const values = await valuesResponse.json();
          setFormValues(values);
        }
        
        setSelectedForm({...formData, values: formValues});
      }
    } catch (error) {
      console.error('Erreur chargement formulaire:', error);
    }
  };

  const handleFieldValueChange = (fieldId: number, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSaveForm = async () => {
    if (!selectedForm || !interventionId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/forms/${selectedForm.id}/values/${interventionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          values: formValues,
          created_by: user?.CDUSER || 'WEB'
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Formulaire sauvegardé avec succès"
        });
        setIsFormDialogOpen(false);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le formulaire",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.id] || '';
    const fieldSize = field.taille === 'small' ? 'md:w-1/4' : 
                    field.taille === 'medium' ? 'md:w-1/2' : 
                    field.taille === 'large' ? 'md:w-3/4' : 'w-full';

    const handleChange = (newValue: string) => {
      handleFieldValueChange(field.id, newValue);
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type={field.type}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.options?.placeholder || ''}
              required={field.obligatoire}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="number"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.options?.placeholder || ''}
              min={field.options?.min}
              max={field.options?.max}
              step={field.options?.step}
              required={field.obligatoire}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="date"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              required={field.obligatoire}
            />
          </div>
        );

      case 'datetime':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="datetime-local"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              required={field.obligatoire}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={`field-${field.id}`}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.options?.placeholder || ''}
              required={field.obligatoire}
              rows={3}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <Label htmlFor={`field-${field.id}`}>
              {field.label}
              {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.values?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'switch':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <div className="flex items-center space-x-2">
              <Switch
                id={`field-${field.id}`}
                checked={value === 'true'}
                onCheckedChange={(checked) => handleChange(checked ? 'true' : 'false')}
              />
              <Label htmlFor={`field-${field.id}`}>
                {field.label}
                {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className={`space-y-2 ${fieldSize}`}>
            <div className="flex items-center space-x-2">
              <input
                id={`field-${field.id}`}
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => handleChange(e.target.checked ? 'true' : 'false')}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`field-${field.id}`}>
                {field.label}
                {field.obligatoire && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const groupedFields = selectedForm?.fields?.reduce((groups, field) => {
    const group = field.groupe || 'General';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(field);
    return groups;
  }, {} as { [key: string]: FormField[] }) || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des formulaires...</div>
      </div>
    );
  }

  if (!interventionId) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Intervention non trouvée
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {forms.length === 0 ? (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Aucun formulaire disponible pour les interventions. 
            <Button variant="link" className="p-0 h-auto ml-1" onClick={() => window.open('/settings/forms', '_blank')}>
              Créer un formulaire
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {form.nom}
                  {form.is_active ? (
                    <Badge variant="outline" className="text-xs">Actif</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Inactif</Badge>
                  )}
                </CardTitle>
                {form.description && (
                  <CardDescription className="text-sm">
                    {form.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Dialog open={isFormDialogOpen && selectedForm?.id === form.id} onOpenChange={setIsFormDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => loadFormWithFields(form.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Remplir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedForm?.nom}</DialogTitle>
                        <DialogDescription>
                          {selectedForm?.description}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {Object.entries(groupedFields).map(([groupName, fields]) => (
                          <div key={groupName} className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">
                              {groupName}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {fields
                                .sort((a, b) => a.ordre - b.ordre)
                                .map(renderField)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleSaveForm} disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 