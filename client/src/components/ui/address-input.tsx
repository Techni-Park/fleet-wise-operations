import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, Check, X } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent } from './card';

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressInputProps {
  value: string;
  onChange: (value: string, coordinates?: { lat: number; lon: number }) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function AddressInput({ 
  value, 
  onChange, 
  placeholder = "Saisir l'adresse...", 
  label = "Adresse",
  required = false,
  className = "" 
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [lastQuery, setLastQuery] = useState('');
  const [hasValidCoordinates, setHasValidCoordinates] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fonction de géocodage utilisant OpenStreetMap (Nominatim)
  const geocodeAddress = async (address: string): Promise<AddressSuggestion[]> => {
    if (address.length < 3) return [];
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: address,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'fr', // Privilégier la France
          'accept-language': 'fr'
        })
      );
      
      if (!response.ok) throw new Error('Erreur géocodage');
      
      const data = await response.json();
      return data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        place_id: item.place_id,
        address: item.address
      }));
    } catch (error) {
      console.error('Erreur lors du géocodage:', error);
      return [];
    }
  };

  // Fonction de recherche avec debounce
  const searchAddresses = async (query: string) => {
    if (query === lastQuery) return;
    
    setLastQuery(query);
    setIsLoading(true);
    setHasValidCoordinates(false);
    
    try {
      // Délai pour respecter les limites de l'API
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const results = await geocodeAddress(query);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer les changements d'input avec debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Debounce pour éviter trop de requêtes
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (newValue.length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchAddresses(newValue);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasValidCoordinates(false);
    }
  };

  // Sélectionner une suggestion
  const selectSuggestion = (suggestion: AddressSuggestion) => {
    const coordinates = {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    };
    
    onChange(suggestion.display_name, coordinates);
    setSuggestions([]);
    setShowSuggestions(false);
    setHasValidCoordinates(true);
    
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Gérer les touches clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Fermer les suggestions si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nettoyer le timeout
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <Label htmlFor="address-input" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
          {hasValidCoordinates && (
            <Check className="w-4 h-4 text-green-500" />
          )}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="address-input"
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className="pr-10"
          autoComplete="off"
        />
        
        {/* Indicateur de chargement */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin text-gray-400" />
          ) : hasValidCoordinates ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : value.length >= 3 ? (
            <MapPin className="w-4 h-4 text-gray-400" />
          ) : null}
        </div>
      </div>

      {/* Liste des suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg"
        >
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                className={`
                  px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors
                  ${index === selectedIndex 
                    ? 'bg-blue-50 text-blue-900' 
                    : 'hover:bg-gray-50'
                  }
                `}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.address?.road 
                        ? `${suggestion.address.house_number || ''} ${suggestion.address.road}`.trim()
                        : suggestion.display_name.split(',')[0]
                      }
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.address?.city && suggestion.address?.postcode
                        ? `${suggestion.address.postcode} ${suggestion.address.city}`
                        : suggestion.display_name
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Message d'aide */}
      {value.length > 0 && value.length < 3 && (
        <p className="text-xs text-gray-500 mt-1">
          Saisissez au moins 3 caractères pour déclencher la recherche
        </p>
      )}
    </div>
  );
} 