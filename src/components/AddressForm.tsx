'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AddressAutocomplete from './AddressAutocomplete';
import { useAddress, AddressData } from '@/hooks/useAddress';

interface AddressFormProps {
  title?: string;
  onAddressChange: (address: AddressData) => void;
  initialAddress?: Partial<AddressData>;
  showCountry?: boolean;
  className?: string;
}

export default function AddressForm({
  title = "Dirección de Envío",
  onAddressChange,
  initialAddress,
  showCountry = true,
  className = ""
}: AddressFormProps) {
  const {
    address,
    errors,
    updateAddress,
    updateField,
    validateAddress,
    isAddressComplete
  } = useAddress(initialAddress);

  // Notificar cambios de dirección al componente padre
  React.useEffect(() => {
    if (isAddressComplete()) {
      onAddressChange(address);
    }
  }, [address, onAddressChange, isAddressComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {title}
      </h3>

      <div className="space-y-6">
        {/* Autocompletado de Dirección */}
        <AddressAutocomplete
          value={address.formattedAddress}
          onChange={updateAddress}
          onInputChange={(value) => updateField('formattedAddress', value)}
          label="Dirección Completa"
          placeholder="Escribe tu dirección completa..."
          required
          error={errors.formattedAddress}
        />

        {/* Campos Individuales (para edición manual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calle *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => updateField('street', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.street ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="123 Main Street"
              required
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.city ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="New York"
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => updateField('state', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.state ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="NY"
              required
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal *
            </label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => updateField('zipCode', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.zipCode ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="10001"
              required
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>
        </div>

        {/* País */}
        {showCountry && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País *
            </label>
            <select
              value={address.countryCode}
              onChange={(e) => {
                const option = e.target.options[e.target.selectedIndex];
                updateField('country', option.text);
                updateField('countryCode', e.target.value);
              }}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.country ? 'border-red-300' : 'border-gray-300'}
              `}
              required
            >
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="CA">Canadá</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        )}

        {/* Información de Validación */}
        {isAddressComplete() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 text-sm font-medium">
              Dirección completa y válida
            </span>
          </motion.div>
        )}

        {/* Coordenadas (solo para desarrollo) */}
        {process.env.NODE_ENV === 'development' && address.coordinates && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Coordenadas (Debug)</h4>
            <p className="text-xs text-gray-600">
              Lat: {address.coordinates.lat.toFixed(6)}, Lng: {address.coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
