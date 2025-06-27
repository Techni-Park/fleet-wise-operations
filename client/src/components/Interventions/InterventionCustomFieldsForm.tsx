import React, { useState, useEffect } from 'react';
import { Settings, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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
}

interface InterventionCustomFieldsFormProps {
  interventionId?: number; // IDINTERVENTION pour l'édition
  values: { [key: string]: string };
  onChange: (fieldId: number, value: string) => void;
}

const InterventionCustomFieldsForm: React.FC<InterventionCustomFieldsFormProps> = ({ 
  interventionId, 
  values, 
  onChange 
}) => {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les champs personnalisés
  const loadCustomFields = async () => {
    try {
      setLoading(true);
      
      // Charger les définitions des champs pour les interventions (entity_type_id = 3)
      const fieldsResponse = await fetch('/api/custom-fields/3');
      const fields = await fieldsResponse.json();
      setCustomFields(fields);
      
    } catch (error) {
      console.error('Erreur lors du chargement des champs personnalisés:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomFields();
  }, []);

  // Rendre un champ selon son type
  const renderField = (field: CustomField) => {
    const value = values[field.id] || '';
    const isRequired = field.obligatoire === 1;

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={isRequired}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
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
              onCheckedChange={(checked) => onChange(field.id, checked ? '1' : '0')}
            />
            <span className="text-sm text-gray-600">
              {value === '1' || value === 'true' ? 'Activé' : 'Désactivé'}
            </span>
          </div>
        );

      case 'select':
        if (field.options && Array.isArray(field.options)) {
          return (
            <select
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required={isRequired}
            >
              <option value="">Sélectionner...</option>
              {field.options.map((option: any, index: number) => (
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
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );

      case 'radio':
        if (field.options && Array.isArray(field.options)) {
          return (
            <div className="space-y-2">
              {field.options.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.id}_${index}`}
                    name={`field_${field.id}`}
                    value={option.value || option}
                    checked={value === (option.value || option)}
                    onChange={(e) => onChange(field.id, e.target.value)}
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
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            required={isRequired}
          />
        );
    }
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

  if (customFields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Champs personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Aucun champ personnalisé configuré pour les interventions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Champs personnalisés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customFields.map((field) => (
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionCustomFieldsForm; 