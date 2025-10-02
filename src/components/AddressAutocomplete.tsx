'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceResult {
  place_id: string;
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: AddressData) => void;
  onInputChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
  error?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onInputChange,
  placeholder = "Ingresa tu dirección...",
  className = "",
  required = false,
  label = "Dirección",
  error
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const predictionsRef = useRef<HTMLDivElement>(null);
  const googleMapsLoaded = useRef(false);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyA5EM-axt9q1IF6rxkEHS9lAD9EnmZl6Kw';

  // Cargar Google Maps API
  useEffect(() => {
    if (typeof window !== 'undefined' && !googleMapsLoaded.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = () => {
        googleMapsLoaded.current = true;
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  // Obtener predicciones de direcciones
  const getPlacePredictions = async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}&types=address&components=country:us|country:mx|country:ca`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        // Obtener detalles completos para cada predicción
        const detailedPredictions = await Promise.all(
          data.predictions.slice(0, 5).map(async (prediction: { place_id: string; description: string }) => {
            try {
              const detailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=address_components,formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`
              );
              const detailsData = await detailsResponse.json();
              return detailsData.result;
            } catch (error) {
              console.error('Error fetching place details:', error);
              return null;
            }
          })
        );
        
        setPredictions(detailedPredictions.filter(Boolean));
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onInputChange(inputValue);
    
    if (inputValue.length >= 3) {
      getPlacePredictions(inputValue);
      setShowPredictions(true);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Procesar dirección seleccionada
  const processAddress = (place: PlaceResult): AddressData => {
    const components = place.address_components;
    
    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';
    let countryCode = '';

    components.forEach(component => {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        street += component.long_name + ' ';
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.short_name;
      } else if (types.includes('postal_code')) {
        zipCode = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
        countryCode = component.short_name;
      }
    });

    return {
      street: street.trim(),
      city,
      state,
      zipCode,
      country,
      countryCode,
      formattedAddress: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    };
  };

  // Seleccionar predicción
  const selectPrediction = (place: PlaceResult) => {
    const addressData = processAddress(place);
    onChange(addressData);
    onInputChange(addressData.formattedAddress);
    setShowPredictions(false);
    setPredictions([]);
  };

  // Manejar teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showPredictions || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : predictions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          selectPrediction(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowPredictions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Cerrar predicciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        predictionsRef.current &&
        !predictionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowPredictions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-200 focus:border-purple-500'
            }
          `}
          required={required}
          autoComplete="off"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <motion.div
          ref={predictionsRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              onClick={() => selectPrediction(prediction)}
              className={`
                px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors
                ${index === selectedIndex 
                  ? 'bg-purple-50 text-purple-900' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.formatted_address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Instructions */}
      {!showPredictions && !error && (
        <p className="mt-1 text-xs text-gray-500">
          Escribe al menos 3 caracteres para ver sugerencias
        </p>
      )}
    </div>
  );
}
