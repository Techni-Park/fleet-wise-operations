import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Loader, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CustomField {
  id: number;
  entity_type_id: number;
  nom: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'switch' | 'radio';
  is_protected: number;
  obligatoire: number;
  ordre: number;
  options: any;
  created_at: string;
  updated_at: string;
}

interface CustomFieldValue {
  id: number;
  entity_id: number;
  custom_field_id: number;
  valeur: string;
  created_at: string;
  updated_at: string;
}

interface InterventionCustomFieldsProps {
  interventionId: number;
}

const InterventionCustomFields: React.FC<InterventionCustomFieldsProps> = ({ interventionId }) => {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadCustomFields = async () => {
    try {
      setLoading(true);
      
      const fieldsResponse = await fetch('/api/custom-fields?entity_type_id=3', {
        credentials: 'include'
      });
      
      if (!fieldsResponse.ok) {
        throw new Error(`Erreur HTTP: ${fieldsResponse.status}`);
      }
      
      const fields = await fieldsResponse.json();
      
      const parsedFields = fields.map((field: CustomField) => {
        if (field.options && typeof field.options === 'string') {
          try {
            field.options = JSON.parse(field.options);
          } catch (e) {
            console.error('Erreur parsing options pour le champ', field.nom, e);
            field.options = null;
          }
        }
        return field;
      });
      
      const valuesResponse = await fetch(`/api/custom-field-values/${interventionId}?entity_type_id=3`, {
        credentials: 'include'
      });
      
      if (!valuesResponse.ok) {
        throw new Error(`Erreur HTTP: ${valuesResponse.status}`);
      }
      
      const values = await valuesResponse.json();
      
      setCustomFields(parsedFields);
      
      const valuesMap: { [key: number]: string } = {};
      values.forEach((value: CustomFieldValue) => {
        valuesMap[value.custom_field_id] = value.valeur || '';
      });
      setFieldValues(valuesMap);
      
    } catch (error) {
      console.error('Erreur lors du chargement des champs personnalisés:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les champs personnalisés",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interventionId) {
      loadCustomFields();
    }
  }, [interventionId]);

  const handleFieldChange = (fieldId: number, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      const savePromises = Object.entries(fieldValues).map(async ([fieldId, value]) => {
        if (value.trim() !== '') {
          await fetch('/api/custom-field-values', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              entityId: interventionId,
              customFieldId: parseInt(fieldId),
              valeur: value,
              entityTypeId: 3
            })
          });
        } else {
          await fetch(`/api/custom-field-values/${interventionId}/${fieldId}?entity_type_id=3`, {
            method: 'DELETE',
            credentials: 'include'
          });
        }
      });

      await Promise.all(savePromises);
      
      setHasChanges(false);
      toast({
        title: "Succès",
        description: "Les champs personnalisés ont été sauvegardés"
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: CustomField) => {
    const value = fieldValues[field.id] || '';
    const isRequired = field.obligatoire === 1;

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            rows={3}
            required={isRequired}
          />
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === '1' || value === 'true'}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked ? '1' : '0')}
            />
            <span className="text-sm text-gray-600">
              {value === '1' || value === 'true' ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        );

      case 'select':
        const selectOptions = field.options?.values || field.options || [];
        if (Array.isArray(selectOptions) && selectOptions.length > 0) {
          return (
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required={isRequired}
            >
              <option value="">Sélectionner...</option>
              {selectOptions.map((option: any, index: number) => (
                <option key={index} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'radio':
        const radioOptions = field.options?.values || field.options || [];
        if (Array.isArray(radioOptions) && radioOptions.length > 0) {
          return (
            <div className="space-y-2">
              {radioOptions.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}_${index}`}
                    name={`field_${field.id}`}
                    value={option.value || option}
                    checked={value === (option.value || option)}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`${field.id}_${index}`} className="text-sm">
                    {option.label || option}
                  </label>
                </div>
              ))}
            </div>
          );
        }
        return null;

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );
    }
  };

  const groupFieldsBySubset = (fields: CustomField[]) => {
    const groups: { [key: string]: CustomField[] } = {};
    
    fields.forEach(field => {
      let subset = 'Autres informations';
      if (field.options?.subset) {
        subset = field.options.subset;
      }
      
      if (!groups[subset]) {
        groups[subset] = [];
      }
      groups[subset].push(field);
    });
    
    const sortedGroups: { [key: string]: CustomField[] } = {};
    Object.keys(groups).sort((a, b) => {
      if (a === 'Autres informations') return 1;
      if (b === 'Autres informations') return -1;
      return a.localeCompare(b);
    }).forEach(key => {
      sortedGroups[key] = groups[key];
    });
    
    return sortedGroups;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p>Chargement des champs personnalisés...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Champs personnalisés
          </h3>
          <p className="text-sm text-gray-600">
            {customFields.length} champs configurés
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={loadCustomFields} 
            variant="outline" 
            size="sm"
            disabled={loading || saving}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {hasChanges && (
            <Button 
              onClick={saveChanges} 
              size="sm"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Sauvegarder
            </Button>
          )}
        </div>
      </div>

      {customFields.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun champ personnalisé
            </h3>
            <p className="text-gray-500">
              Aucun champ personnalisé n'est configuré pour les interventions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informations personnalisées</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(groupFieldsBySubset(customFields)).map(([subset, fields]) => (
              <div key={subset} className="mb-8 last:mb-0">
                <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">
                  {subset}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={`field_${field.id}`} className="flex items-center">
                        {field.label}
                        {field.obligatoire === 1 && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                        {field.is_protected === 1 && (
                          <span className="text-xs text-blue-600 ml-2 bg-blue-100 px-2 py-1 rounded">
                            Protégé
                          </span>
                        )}
                      </Label>
                      <div id={`field_${field.id}`}>
                        {renderField(field)}
                      </div>
                      {field.type === 'switch' && (
                        <p className="text-xs text-gray-500">
                          Champ de type interrupteur (oui/non)
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {hasChanges && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm text-orange-800">
                    Vous avez des modifications non sauvegardées. N'oubliez pas de sauvegarder vos changements.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterventionCustomFields; 