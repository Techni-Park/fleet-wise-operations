import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, X, Filter, RotateCcw } from 'lucide-react';

interface InterventionFiltersProps {
  dateDebut: string;
  dateFin: string;
  onDateDebutChange: (date: string) => void;
  onDateFinChange: (date: string) => void;
  onReset: () => void;
  selectedStatuses: number[];
  onStatusChange: (statuses: number[]) => void;
  totalInterventions: number;
  filteredCount: number;
}

const statusOptions = [
  { value: 0, label: 'Planifiée', color: 'bg-orange-100 text-orange-800' },
  { value: 1, label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  { value: 9, label: 'Terminée', color: 'bg-green-100 text-green-800' },
  { value: 10, label: 'Annulée', color: 'bg-red-100 text-red-800' },
];

export function InterventionFilters({
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  onReset,
  selectedStatuses,
  onStatusChange,
  totalInterventions,
  filteredCount
}: InterventionFiltersProps) {

  const toggleStatus = (status: number) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const hasActiveFilters = dateDebut || dateFin || selectedStatuses.length > 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h3 className="font-semibold">Filtres</h3>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  {filteredCount} / {totalInterventions}
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres par date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-debut" className="text-sm font-medium">
                Date de début
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="date-debut"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => onDateDebutChange(e.target.value)}
                  className="pl-10"
                />
                {dateDebut && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDateDebutChange('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-fin" className="text-sm font-medium">
                Date de fin
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="date-fin"
                  type="date"
                  value={dateFin}
                  onChange={(e) => onDateFinChange(e.target.value)}
                  className="pl-10"
                />
                {dateFin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDateFinChange('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filtres par statut */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Statuts</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Badge
                  key={status.value}
                  variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedStatuses.includes(status.value) 
                      ? status.color 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Raccourcis de dates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Raccourcis</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  onDateDebutChange(today);
                  onDateFinChange(today);
                }}
                className="text-xs"
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
                  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 7));
                  onDateDebutChange(weekStart.toISOString().split('T')[0]);
                  onDateFinChange(weekEnd.toISOString().split('T')[0]);
                }}
                className="text-xs"
              >
                Cette semaine
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                  onDateDebutChange(monthStart.toISOString().split('T')[0]);
                  onDateFinChange(monthEnd.toISOString().split('T')[0]);
                }}
                className="text-xs"
              >
                Ce mois
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 